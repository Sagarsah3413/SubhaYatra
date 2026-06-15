import { useState, useEffect, useRef, useCallback } from "react";
import { FaSearch, FaTimes, FaSpinner, FaMicrophone } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import SearchDropdownList from "../components/SearchDropdownList";

export default function SearchBar({ placeholder, className = "", onSearch = null, category = "all" }) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const dropdownRef = useRef(null);
  
  // State management
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isHomePage, setIsHomePage] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  // Update internal category when prop changes
  useEffect(() => {
    setActiveCategory(category);
  }, [category]);

  // Check if we're on homepage
  useEffect(() => {
    setIsHomePage(location.pathname === '/');
  }, [location.pathname]);

  // Check speech recognition support
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
    }
  }, []);

  // Close dropdown when route changes
  useEffect(() => {
    setShowSuggestions(false);
    setIsFocused(false);
    setSelectedIndex(-1);
    setQuery("");
  }, [location.pathname]);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInsideDropdown = dropdownRef.current && dropdownRef.current.contains(event.target);
      const isClickInsideInput = inputRef.current && inputRef.current.contains(event.target);
      
      if (!isClickInsideDropdown && !isClickInsideInput) {
        setShowSuggestions(false);
        setIsFocused(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Search with debouncing
  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    try {
      const res = await fetch(
        `http://localhost:8000/api/search?q=${encodeURIComponent(searchQuery)}&category=${activeCategory}`
      );
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();

      const suggestions = data.results
        .sort((a, b) => {
          const aScore = calculateRelevance(a, searchQuery);
          const bScore = calculateRelevance(b, searchQuery);
          return bScore - aScore;
        })
        .slice(0, 8);

      setResults(suggestions);
      setShowSuggestions(true);
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory]);

  // Calculate relevance score
  const calculateRelevance = (item, query) => {
    const q = query.toLowerCase();
    const name = item.name.toLowerCase();
    const location = (item.location || '').toLowerCase();
    
    let score = 0;
    
    if (name === q) score += 100;
    else if (name.startsWith(q)) score += 80;
    else if (name.includes(q)) score += 60;
    
    if (location.includes(q)) score += 40;
    
    return score;
  };

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length >= 1) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(query);
      }, 300);
    } else {
      setResults([]);
      setIsLoading(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, activeCategory, performSearch]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    const totalItems = results.length;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % totalItems);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev <= 0 ? totalItems - 1 : prev - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle search execution
  const handleSearch = () => {
    if (!query.trim()) return;
    
    navigate(`/searchresult?q=${encodeURIComponent(query)}&category=${activeCategory}`);
    setShowSuggestions(false);
    setResults([]);
    
    if (onSearch) onSearch(query);
  };

  // Handle result selection
  const handleSelect = (item) => {
    setQuery(item.name);
    navigate(`/details?type=${item.type}&name=${encodeURIComponent(item.name)}`);
    setShowSuggestions(false);
    setResults([]);
  };

  // Clear search
  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // Voice search
  const handleVoiceSearch = () => {
    if (!speechSupported) {
      alert('Voice search is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
      inputRef.current?.focus();
      setIsFocused(true);
      setShowSuggestions(true);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      console.error('Speech recognition error:', event.error);
      
      let errorMessage = 'Voice search failed. ';
      switch (event.error) {
        case 'no-speech':
          errorMessage += 'No speech detected.';
          break;
        case 'audio-capture':
          errorMessage += 'No microphone found.';
          break;
        case 'not-allowed':
          errorMessage += 'Microphone access denied.';
          break;
        default:
          errorMessage += 'Please try again.';
      }
      alert(errorMessage);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  return (
    <div className={`relative w-full max-w-4xl mx-auto ${className}`}>
      {/* Active Category Indicator */}
      {activeCategory !== "all" && (
        <div className={`
          mb-2 flex items-center gap-2 px-3 py-1.5 rounded-lg w-fit
          ${theme === 'dark' 
            ? 'bg-slate-700/80 text-slate-300' 
            : 'bg-gray-100 text-gray-700'
          }
        `}>
          <span className="text-xs font-medium">
            Searching in: {
              activeCategory === 'hotel' ? '🏨 Hotels' :
              activeCategory === 'place' ? '🗺️ Places' :
              activeCategory === 'restaurant' ? '🍴 Restaurants' :
              '🌍 All'
            }
          </span>
          <button
            onClick={() => setActiveCategory("all")}
            className={`
              text-xs px-2 py-0.5 rounded transition-colors
              ${theme === 'dark' 
                ? 'hover:bg-slate-600 text-slate-400 hover:text-white' 
                : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
              }
            `}
          >
            Clear
          </button>
        </div>
      )}
      
      {/* Search Container */}
      <div className={`
        relative flex items-center rounded-2xl shadow-2xl border-2 overflow-hidden
        transition-all duration-300 z-[10000] backdrop-blur-sm
        ${isFocused 
          ? 'border-teal-400 shadow-teal-500/30 bg-white/95 dark:bg-slate-800/95 scale-[1.02]' 
          : theme === 'dark' 
            ? 'border-slate-700/50 bg-slate-800/90 hover:border-slate-600' 
            : 'border-gray-300/50 bg-white/90 hover:border-gray-400'
        }
      `}>
        
        {/* Search Icon */}
        <div className="pl-5 pr-2">
          <div className={`
            w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300
            ${isFocused 
              ? 'bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/30' 
              : theme === 'dark' 
                ? 'bg-slate-700/80' 
                : 'bg-gray-100'
            }
          `}>
            <FaSearch className={`
              text-lg
              ${isFocused ? 'text-white' : theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}
            `} />
          </div>
        </div>

        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (isHomePage) {
              setIsFocused(true);
              setShowSuggestions(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={
            isListening 
              ? "🎤 Listening... Speak now" 
              : placeholder || "Search destinations, hotels, restaurants..."
          }
          className={`
            flex-grow px-4 py-5 outline-none text-base bg-transparent font-medium
            ${theme === 'dark' ? 'text-white placeholder-slate-400' : 'text-gray-800 placeholder-gray-500'}
            ${isListening ? 'placeholder-red-500' : ''}
          `}
          autoComplete="off"
          spellCheck="false"
          disabled={isListening}
        />

        {/* Loading Spinner */}
        {isLoading && (
          <div className="px-3">
            <FaSpinner className="text-teal-500 animate-spin text-xl" />
          </div>
        )}

        {/* Clear Button */}
        {query && !isLoading && (
          <button
            onClick={clearSearch}
            className={`
              w-10 h-10 mx-2 rounded-xl transition-all duration-300 flex items-center justify-center
              ${theme === 'dark' 
                ? 'hover:bg-slate-700/80 text-slate-400 hover:text-white' 
                : 'hover:bg-gray-100 text-gray-400 hover:text-gray-700'
              }
            `}
            title="Clear search"
          >
            <FaTimes className="text-lg" />
          </button>
        )}

        {/* Voice Search Button */}
        {speechSupported && (
          <button
            onClick={handleVoiceSearch}
            className={`
              w-10 h-10 mx-2 rounded-xl transition-all duration-300 flex items-center justify-center
              ${isListening 
                ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50' 
                : theme === 'dark' 
                  ? 'hover:bg-slate-700/80 text-slate-400 hover:text-teal-400' 
                  : 'hover:bg-gray-100 text-gray-400 hover:text-teal-500'
              }
            `}
            title={isListening ? "Listening... Click to stop" : "Voice Search"}
          >
            <FaMicrophone className="text-lg" />
          </button>
        )}

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={!query.trim() || isLoading}
          className={`
            px-8 py-5 font-semibold text-base transition-all duration-300
            flex items-center gap-2 rounded-r-2xl
            ${query.trim() && !isLoading
              ? 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl'
              : theme === 'dark'
                ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          <FaSearch />
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>

      {/* Suggestions Modal */}
      {showSuggestions && query.trim() && isHomePage && (
        <>
          {/* Backdrop - Solid Black */}
          <div
            className="fixed inset-0 bg-black z-[999]"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowSuggestions(false);
                setIsFocused(false);
                setSelectedIndex(-1);
              }
            }}
          >
            {/* Modal Container */}
            <div
              ref={dropdownRef}
              className="
                absolute left-1/2 top-24 -translate-x-1/2 w-full max-w-4xl
                bg-black
                border-2 border-teal-500 rounded-2xl shadow-2xl
                mx-4
                flex flex-col
                animate-in fade-in slide-in-from-top-4 duration-300
              "
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {results.length > 0 && (
                <div className="
                  px-3 py-2 border-b font-medium text-xs flex-shrink-0
                  text-white border-gray-700 bg-black
                ">
                  {results.length} {results.length === 1 ? 'result' : 'results'} found
                </div>
              )}

              {/* Scrollable Content - Shows only 1.5 items, scroll for more */}
              <div
                className="overflow-y-auto custom-scrollbar"
                style={{
                  maxHeight: results.length > 0 ? '100px' : 'auto' // Smaller height showing ~1.5 items
                }}
              >
                {results.length > 0 ? (
                  <SearchDropdownList
                    results={results}
                    onSelect={handleSelect}
                    selectedIndex={selectedIndex}
                    theme={theme}
                  />
                ) : !isLoading && (
                  <div className="px-4 py-8 text-center text-white">
                    <FaSearch className="text-3xl mx-auto mb-3 opacity-50" />
                    <p className="font-medium text-base">No results found for "{query}"</p>
                    <p className="text-xs mt-1">Try different keywords</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
