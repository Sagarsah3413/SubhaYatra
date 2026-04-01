import { useState, useEffect, useRef, useCallback } from "react";
import { FaSearch, FaTimes, FaSpinner, FaMicrophone, FaLock } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useUser } from "@clerk/clerk-react";
import SearchDropdownList from "../components/SearchDropdownList";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function SearchBar({ placeholder, className = "", onSearch = null, category = "all" }) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isSignedIn, isLoaded } = useUser();
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const dropdownRef = useRef(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => { setActiveCategory(category); }, [category]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) setSpeechSupported(true);
  }, []);

  // Reset on route change
  useEffect(() => {
    setShowSuggestions(false);
    setIsFocused(false);
    setSelectedIndex(-1);
    setQuery("");
    setShowLoginPrompt(false);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        inputRef.current && !inputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
        setIsFocused(false);
        setSelectedIndex(-1);
        setShowLoginPrompt(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const calcRelevance = (item, q) => {
    const lq = q.toLowerCase();
    const name = (item.name || '').toLowerCase();
    const loc = (item.location || '').toLowerCase();
    if (name === lq) return 100;
    if (name.startsWith(lq)) return 90;
    if (name.includes(` ${lq}`)) return 75;
    if (name.includes(lq)) return 60;
    if (loc.startsWith(lq)) return 40;
    if (loc.includes(lq)) return 20;
    return 0;
  };

  const performSearch = useCallback(async (searchQuery, save = false) => {
    if (!searchQuery.trim() || !isSignedIn || !user) return;
    setIsLoading(true);
    try {
      const saveParam = save && searchQuery.trim().length >= 3 ? '&save=1' : '';
      const res = await fetch(
        `${API}/api/search?q=${encodeURIComponent(searchQuery)}&category=${activeCategory}${saveParam}`,
        { headers: { 'X-Clerk-User-Id': user.id, 'X-Clerk-User-Name': user.fullName || '' } }
      );
      if (res.status === 401) { setShowLoginPrompt(true); return; }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const all = [
        ...(data.results?.places || []).map(p => ({ ...p, _type: 'place', type: 'place' })),
        ...(data.results?.hotels || []).map(h => ({ ...h, _type: 'hotel', type: 'hotel' })),
        ...(data.results?.restaurants || []).map(r => ({ ...r, _type: 'restaurant', type: 'restaurant' })),
      ].sort((a, b) => calcRelevance(b, searchQuery) - calcRelevance(a, searchQuery)).slice(0, 8);

      setResults(all);
      setShowSuggestions(all.length > 0);
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, isSignedIn, user]);

  // Debounced search
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (query.trim().length >= 1 && isLoaded && isSignedIn) {
      timerRef.current = setTimeout(() => performSearch(query), 300);
    } else {
      setResults([]);
      setIsLoading(false);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query, activeCategory, performSearch, isLoaded, isSignedIn]);

  const handleKeyDown = (e) => {
    const total = results.length;
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(p => (p + 1) % total); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(p => p <= 0 ? total - 1 : p - 1); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) handleSelect(results[selectedIndex]);
      else handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    }
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    if (!isSignedIn) { setShowLoginPrompt(true); return; }
    setShowSuggestions(false);
    setResults([]);
    // Save to history on explicit search
    performSearch(query, true);
    navigate(`/searchresult?q=${encodeURIComponent(query)}&category=${activeCategory}`);
    if (onSearch) onSearch(query);
  };

  const handleSelect = (item) => {
    setQuery(item.name);
    setShowSuggestions(false);
    setResults([]);
    // Save selected item name to history
    performSearch(item.name, true);
    navigate(`/details?type=${item._type || item.type}&name=${encodeURIComponent(item.name)}`);
  };

  const handleFocus = () => {
    if (!isLoaded) return;
    if (!isSignedIn) { setShowLoginPrompt(true); return; }
    setIsFocused(true);
    if (query.trim() && results.length > 0) setShowSuggestions(true);
  };

  const handleInputChange = (e) => {
    if (!isSignedIn) { setShowLoginPrompt(true); return; }
    setQuery(e.target.value);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setSelectedIndex(-1);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleVoiceSearch = () => {
    if (!isSignedIn) { setShowLoginPrompt(true); return; }
    if (!speechSupported) { alert('Voice search not supported.'); return; }
    if (isListening) { setIsListening(false); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.continuous = false; recognition.interimResults = false; recognition.lang = 'en-US';
    setIsListening(true); recognition.start();
    recognition.onresult = (e) => { setQuery(e.results[0][0].transcript); setIsListening(false); setIsFocused(true); };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  const isLocked = isLoaded && !isSignedIn;

  return (
    <div className={`relative w-full max-w-4xl mx-auto ${className}`} style={{ isolation: 'isolate' }}>

      {/* Search bar */}
      <div className={`relative flex items-center rounded-2xl shadow-2xl border-2 overflow-hidden transition-all duration-300 z-[99998] backdrop-blur-sm ${
        isLocked
          ? 'border-slate-400/40 bg-slate-100/80 dark:bg-slate-800/60 opacity-80'
          : isFocused
            ? 'border-teal-400 shadow-teal-500/30 bg-white/95 dark:bg-slate-800/95 scale-[1.02]'
            : theme === 'dark'
              ? 'border-slate-700/50 bg-slate-800/90 hover:border-slate-600'
              : 'border-gray-300/50 bg-white/90 hover:border-gray-400'
      }`}>

        <div className="pl-5 pr-2">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
            isLocked ? 'bg-slate-200 dark:bg-slate-700' :
            isFocused ? 'bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg' :
            theme === 'dark' ? 'bg-slate-700/80' : 'bg-gray-100'
          }`}>
            {isLocked
              ? <FaLock className="text-slate-400 text-lg" />
              : <FaSearch className={`text-lg ${isFocused ? 'text-white' : theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`} />
            }
          </div>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={
            isLocked ? "Sign in to search destinations…" :
            isListening ? "🎤 Listening..." :
            placeholder || "Search destinations, hotels, restaurants..."
          }
          readOnly={isLocked}
          className={`flex-grow px-4 py-5 outline-none text-base bg-transparent font-medium ${
            isLocked ? 'text-slate-400 dark:text-slate-500 cursor-not-allowed' :
            theme === 'dark' ? 'text-white placeholder-slate-400' : 'text-gray-800 placeholder-gray-500'
          }`}
          autoComplete="off"
          spellCheck="false"
        />

        {isLoading && <div className="px-3"><FaSpinner className="text-teal-500 animate-spin text-xl" /></div>}

        {query && !isLoading && isSignedIn && (
          <button onClick={clearSearch} className={`w-10 h-10 mx-2 rounded-xl flex items-center justify-center ${
            theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
          }`}><FaTimes /></button>
        )}

        {speechSupported && isSignedIn && (
          <button onClick={handleVoiceSearch} className={`w-10 h-10 mx-2 rounded-xl flex items-center justify-center ${
            isListening ? 'bg-red-500 text-white animate-pulse' :
            theme === 'dark' ? 'text-slate-400 hover:text-teal-400 hover:bg-slate-700' : 'text-gray-400 hover:text-teal-500 hover:bg-gray-100'
          }`}><FaMicrophone /></button>
        )}

        <button
          onClick={isLocked ? () => navigate('/sign-in') : handleSearch}
          disabled={!isLocked && (!query.trim() || isLoading)}
          className={`px-8 py-5 font-semibold text-base transition-all duration-300 flex items-center gap-2 rounded-r-2xl ${
            isLocked ? 'bg-gradient-to-r from-slate-500 to-slate-600 hover:from-teal-500 hover:to-cyan-600 text-white cursor-pointer' :
            query.trim() && !isLoading ? 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white' :
            theme === 'dark' ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLocked ? <><FaLock /><span className="hidden sm:inline">Sign In</span></> : <><FaSearch /><span className="hidden sm:inline">Search</span></>}
        </button>
      </div>

      {/* Login prompt */}
      {showLoginPrompt && isLocked && (
        <div className="absolute top-full left-0 right-0 mt-1 z-[99999]">
          <div className={`rounded-xl border border-teal-400 p-3 flex items-center justify-between gap-3 shadow-xl ${
            theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'
          }`}>
            <div className="flex items-center gap-2">
              <FaLock className="text-teal-500 text-xs" />
              <p className="text-xs font-semibold">Sign in to search destinations</p>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => navigate('/sign-in')} className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold">Sign In</button>
              <button onClick={() => navigate('/sign-up')} className="px-3 py-1 border border-teal-500 text-teal-600 dark:text-teal-400 rounded-lg text-xs font-semibold">Sign Up</button>
            </div>
          </div>
        </div>
      )}

      {/* Suggestions dropdown */}
      {isSignedIn && showSuggestions && results.length > 0 && (
        <div
          ref={dropdownRef}
          className={`absolute top-full left-0 right-0 mt-1 z-[99999] rounded-xl border shadow-xl overflow-hidden ${
            theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
          }`}
        >
          <div className={`px-3 py-1 border-b flex items-center justify-between ${
            theme === 'dark' ? 'border-slate-800' : 'border-slate-100'
          }`}>
            <span className={`text-[10px] font-semibold uppercase tracking-wide ${
              theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
            }`}>{results.length} match{results.length !== 1 ? 'es' : ''}</span>
            <button onClick={() => { setShowSuggestions(false); handleSearch(); }}
              className="text-[10px] text-teal-500 hover:text-teal-400 font-semibold">
              See all →
            </button>
          </div>
          <div className="overflow-y-auto max-h-40">
            <SearchDropdownList results={results} onSelect={handleSelect} selectedIndex={selectedIndex} theme={theme} />
          </div>
        </div>
      )}

    </div>
  );
}
