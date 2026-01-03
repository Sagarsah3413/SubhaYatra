import { useState, useEffect, useRef, useCallback } from "react";
import { 
  FaSearch, 
  FaTimes, 
  FaHistory, 
  FaFire, 
  FaMapMarkerAlt,
  FaMicrophone,
  FaFilter,
  FaSpinner,
  FaKeyboard
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import SearchDropdownList from "../components/SearchDropdownList";

export default function SearchBar({ placeholder, className = "", onSearch = null }) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  
  // State management
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [popularSearches] = useState([
    "Everest Base Camp Trek",
    "Chitwan National Park",
    "Annapurna Circuit",
    "Kathmandu Durbar Square",
    "Pokhara Lakeside",
    "Langtang Valley Trek"
  ]);

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
    
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
    }
  }, []);

  // Enhanced search with debouncing and error handling
  const performSearch = useCallback(async (searchQuery) => {
    console.log('performSearch called with:', searchQuery);
    
    if (!searchQuery.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
      
      console.log('Making API call to:', `http://localhost:8000/api/search/?q=${encodeURIComponent(searchQuery)}`);
      
      const res = await fetch(
        `http://localhost:8000/api/search/?q=${encodeURIComponent(searchQuery)}`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      console.log('API response:', data);

      // Enhanced sorting algorithm
      const suggestions = data.results
        .map(item => ({
          ...item,
          relevanceScore: calculateRelevance(item, searchQuery)
        }))
        .sort((a, b) => {
          // Sort by relevance score first
          if (b.relevanceScore !== a.relevanceScore) {
            return b.relevanceScore - a.relevanceScore;
          }
          
          // Then by type priority (Places first)
          const typePriority = { 'Place': 4, 'Attraction': 3, 'Hotel': 2, 'Restaurant': 1 };
          return (typePriority[b.type] || 0) - (typePriority[a.type] || 0);
        })
        .slice(0, 10);

      console.log('Processed suggestions:', suggestions);
      setResults(suggestions);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Search error:', err);
        setResults([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Calculate relevance score for search results
  const calculateRelevance = (item, query) => {
    const q = query.toLowerCase();
    const name = item.name.toLowerCase();
    const description = (item.description || '').toLowerCase();
    const location = (item.location || '').toLowerCase();
    const tags = (item.tags || '').toLowerCase();
    
    let score = 0;
    
    // Exact name match gets highest score
    if (name === q) score += 100;
    else if (name.startsWith(q)) score += 80;
    else if (name.includes(q)) score += 60;
    
    // Location matches
    if (location.includes(q)) score += 40;
    
    // Description matches
    if (description.includes(q)) score += 20;
    
    // Tag matches
    if (tags.includes(q)) score += 30;
    
    // Boost popular destinations
    if (popularSearches.some(popular => popular.toLowerCase().includes(name))) {
      score += 10;
    }
    
    return score;
  };

  // Cleanup effect for voice recognition
  useEffect(() => {
    return () => {
      // Stop any ongoing voice recognition when component unmounts
      if (isListening) {
        setIsListening(false);
      }
    };
  }, [isListening]);
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
  }, [query, performSearch]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    const totalItems = results.length + (query.trim() ? 0 : popularSearches.length);
    
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
        if (selectedIndex >= 0) {
          if (query.trim() && selectedIndex < results.length) {
            handleSelect(results[selectedIndex]);
          } else if (!query.trim() && selectedIndex < popularSearches.length) {
            handlePopularSearch(popularSearches[selectedIndex]);
          }
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
    
    // Add to search history
    const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    
    // Navigate to search results
    navigate(`/searchresult?query=${encodeURIComponent(query)}`);
    setShowSuggestions(false);
    setResults([]);
    
    if (onSearch) onSearch(query);
  };

  // Handle result selection
  const handleSelect = (item) => {
    setQuery(item.name);
    
    // Add to search history
    const newHistory = [item.name, ...searchHistory.filter(h => h !== item.name)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    
    // Navigate to details
    navigate(`/details?type=${item.type}&name=${encodeURIComponent(item.name)}`);
    setShowSuggestions(false);
    setResults([]);
  };

  // Handle popular search selection
  const handlePopularSearch = (searchTerm) => {
    setQuery(searchTerm);
    performSearch(searchTerm);
  };

  // Clear search
  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // Voice search implementation
  const handleVoiceSearch = () => {
    if (!speechSupported) {
      alert('Voice search is not supported in your browser. Please try Chrome, Edge, or Safari.');
      return;
    }

    // If already listening, stop the recognition
    if (isListening) {
      setIsListening(false);
      return;
    }

    // Create speech recognition instance
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Configure recognition settings
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    // Start listening
    setIsListening(true);
    recognition.start();

    // Handle successful recognition
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
      
      // Auto-focus input and show suggestions
      inputRef.current?.focus();
      setIsFocused(true);
      setShowSuggestions(true);
      
      // Show success message
      const successDiv = document.createElement('div');
      successDiv.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
        theme === 'dark' 
          ? 'bg-green-900/90 text-green-200 border border-green-700' 
          : 'bg-green-100/90 text-green-800 border border-green-300'
      } backdrop-blur-sm`;
      successDiv.innerHTML = `
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <div>
            <div class="text-sm font-medium">Voice input captured!</div>
            <div class="text-xs opacity-75">"${transcript}"</div>
          </div>
        </div>
      `;
      document.body.appendChild(successDiv);
      
      // Remove success message after 3 seconds
      setTimeout(() => {
        if (document.body.contains(successDiv)) {
          document.body.removeChild(successDiv);
        }
      }, 3000);
      
      // Perform search with voice input
      if (transcript.trim()) {
        performSearch(transcript);
      }
    };

    // Handle recognition errors
    recognition.onerror = (event) => {
      setIsListening(false);
      console.error('Speech recognition error:', event.error);
      
      let errorMessage = 'Voice search failed. ';
      switch (event.error) {
        case 'no-speech':
          errorMessage += 'No speech was detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage += 'No microphone was found. Please check your microphone.';
          break;
        case 'not-allowed':
          errorMessage += 'Microphone access was denied. Please allow microphone access and try again.';
          break;
        case 'network':
          errorMessage += 'Network error occurred. Please check your connection.';
          break;
        default:
          errorMessage += 'Please try again.';
      }
      
      // Show error in a non-intrusive way
      const errorDiv = document.createElement('div');
      errorDiv.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
        theme === 'dark' 
          ? 'bg-red-900/90 text-red-200 border border-red-700' 
          : 'bg-red-100/90 text-red-800 border border-red-300'
      } backdrop-blur-sm`;
      errorDiv.innerHTML = `
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <span class="text-sm font-medium">${errorMessage}</span>
        </div>
      `;
      document.body.appendChild(errorDiv);
      
      // Remove error message after 5 seconds
      setTimeout(() => {
        if (document.body.contains(errorDiv)) {
          document.body.removeChild(errorDiv);
        }
      }, 5000);
    };

    // Handle recognition end
    recognition.onend = () => {
      setIsListening(false);
    };

    // Handle speech start
    recognition.onspeechstart = () => {
      console.log('Speech detected');
    };

    // Handle speech end
    recognition.onspeechend = () => {
      console.log('Speech ended');
    };
  };

  return (
    <div className={`relative w-full max-w-4xl mx-auto ${className}`}>
      {/* Ultra Premium Search Container */}
      <div className={`
        relative flex items-center rounded-xl shadow-md border overflow-hidden
        transition-all duration-300 transform-gpu backdrop-blur-lg
        ${isFocused 
          ? 'border-teal-500 shadow-teal-500/20 scale-[1.01] shadow-lg' 
          : theme === 'dark' 
            ? 'border-slate-600 bg-gradient-to-r from-slate-800/95 to-slate-700/95' 
            : 'border-gray-200 bg-gradient-to-r from-white/95 to-gray-50/95'
        }
        ${showSuggestions ? 'rounded-b-none' : ''}
        hover:shadow-lg group
      `}>
        
        {/* Premium Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)
            `,
            backgroundSize: '400px 400px, 300px 300px'
          }}></div>
        </div>

        {/* Premium Floating Elements */}
        <div className="absolute -top-5 -left-5 w-20 h-20 bg-gradient-to-br from-teal-400/10 to-cyan-400/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-1000"></div>
        <div className="absolute -bottom-5 -right-5 w-16 h-16 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-lg group-hover:scale-125 transition-transform duration-1000"></div>

        <div className="relative z-10 flex items-center w-full">
          {/* Ultra Premium Search Icon */}
          <div className="pl-8 pr-4">
            <div className={`
              w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500
              ${isFocused 
                ? 'bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg scale-110 rotate-3' 
                : theme === 'dark' 
                  ? 'bg-gradient-to-br from-slate-700 to-slate-600' 
                  : 'bg-gradient-to-br from-gray-100 to-gray-200'
              }
            `}>
              <FaSearch className={`
                text-xl transition-all duration-500
                ${isFocused 
                  ? 'text-white scale-110' 
                  : theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                }
              `} />
            </div>
          </div>

          {/* Ultra Premium Search Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => {
              // Delay hiding suggestions to allow clicks
              setTimeout(() => {
                setIsFocused(false);
                setShowSuggestions(false);
                setSelectedIndex(-1);
              }, 200);
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening 
                ? "🎤 Listening... Speak now" 
                : placeholder || "Search destinations, hotels, restaurants..."
            }
            className={`
              flex-grow px-5 py-1 outline-none text-sm bg-transparent font-medium
              transition-all duration-200
              ${theme === 'dark' 
                ? 'text-white placeholder-slate-400' 
                : 'text-gray-800 placeholder-gray-500'
              }
              ${isFocused ? 'placeholder-opacity-75' : 'placeholder-opacity-100'}
              ${isListening ? 'placeholder-red-500 dark:placeholder-red-400' : ''}
            `}
            autoComplete="off"
            spellCheck="false"
            disabled={isListening}
          />

          {/* Premium Loading Spinner */}
          {isLoading && (
            <div className="px-4">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center">
                <FaSpinner className="text-white animate-spin text-lg" />
              </div>
            </div>
          )}

          {/* Ultra Premium Clear Button */}
          {query && !isLoading && (
            <button
              onClick={clearSearch}
              className={`
                w-10 h-10 mx-3 rounded-2xl transition-all duration-300 flex items-center justify-center
                ${theme === 'dark' 
                  ? 'hover:bg-slate-700 text-slate-400 hover:text-white hover:scale-110' 
                  : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600 hover:scale-110'
                }
              `}
            >
              <FaTimes className="text-lg" />
            </button>
          )}

          {/* Ultra Premium Voice Search Button */}
          <button
            onClick={handleVoiceSearch}
            disabled={!speechSupported}
            className={`
              w-12 h-12 mx-2 rounded-2xl transition-all duration-300 flex items-center justify-center relative overflow-hidden
              ${isListening 
                ? 'bg-gradient-to-br from-red-500 to-red-600 text-white scale-110 animate-pulse' 
                : speechSupported
                  ? theme === 'dark' 
                    ? 'hover:bg-gradient-to-br hover:from-slate-700 hover:to-slate-600 text-slate-400 hover:text-teal-400 hover:scale-110' 
                    : 'hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-200 text-gray-400 hover:text-teal-500 hover:scale-110'
                  : 'opacity-50 cursor-not-allowed text-gray-400'
              }
            `}
            title={
              !speechSupported 
                ? "Voice search not supported in this browser" 
                : isListening 
                  ? "Listening... Click to stop" 
                  : "Voice Search - Click and speak"
            }
          >
            {isListening ? (
              <div className="flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce mr-1"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce mr-1" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            ) : (
              <FaMicrophone className="text-lg" />
            )}
            
            {/* Listening Ring Effect */}
            {isListening && (
              <div className="absolute inset-0 rounded-2xl border-2 border-red-300 animate-ping"></div>
            )}
            
            {/* Premium Shine Effect */}
            {!isListening && speechSupported && (
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
            )}
          </button>

          {/* Ultra Premium Search Button */}
          <button
            onClick={handleSearch}
            disabled={!query.trim() || isLoading}
            className={`
              px-10 py-6 font-bold text-xl transition-all duration-500
              flex items-center gap-4 relative overflow-hidden rounded-r-3xl
              ${query.trim() && !isLoading
                ? 'bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 hover:from-teal-700 hover:via-cyan-700 hover:to-blue-700 text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-rotate-1'
                : theme === 'dark'
                  ? 'bg-gradient-to-r from-slate-700 to-slate-600 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <div className={`
              w-8 h-8 rounded-xl flex items-center justify-center
              ${query.trim() && !isLoading ? 'bg-white/20' : 'bg-transparent'}
            `}>
              <FaSearch className={`${isLoading ? 'animate-pulse' : ''} text-lg`} />
            </div>
            <span className="hidden sm:inline font-black">
              {isLoading ? 'Searching...' : 'Search'}
            </span>
            
            {/* Premium Button Shine Effect */}
            {query.trim() && !isLoading && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            )}
          </button>
        </div>
      </div>

      {/* Ultra Premium Suggestions Dropdown */}
      {showSuggestions && (
        <div className={`
          absolute top-full left-0 right-0 z-50
          ${theme === 'dark' 
            ? 'bg-gradient-to-br from-slate-800/98 to-slate-700/98' 
            : 'bg-gradient-to-br from-white/98 to-gray-50/98'
          }
          backdrop-blur-xl border-2 border-t-0 rounded-b-2xl shadow-xl
          ${isFocused 
            ? 'border-teal-500 shadow-teal-500/10' 
            : theme === 'dark' ? 'border-slate-600' : 'border-gray-200'
          }
          max-h-36 overflow-hidden
        `}>
          
          {/* Premium Background Pattern */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                radial-gradient(circle at 30% 30%, rgba(6, 182, 212, 0.2) 0%, transparent 50%),
                radial-gradient(circle at 70% 70%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)
              `,
              backgroundSize: '300px 300px, 400px 400px'
            }}></div>
          </div>

          <div className="relative z-10">
            {/* Voice Search Status */}
            {isListening && (
              <div className={`
                px-8 py-6 border-b text-center
                ${theme === 'dark' 
                  ? 'text-red-300 border-slate-700 bg-gradient-to-r from-red-900/20 to-red-800/20' 
                  : 'text-red-600 border-gray-200 bg-gradient-to-r from-red-50/80 to-red-100/80'
                }
              `}>
                <div className="flex items-center justify-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center animate-pulse">
                    <FaMicrophone className="text-white text-lg" />
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-6 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-8 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-7 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                    <div className="w-2 h-5 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
                <p className="font-bold text-lg mb-2">🎤 Listening...</p>
                <p className="text-sm opacity-75">Speak clearly and mention your destination</p>
              </div>
            )}

            {/* Search Results */}
            {query.trim() && results.length > 0 && (
              <div>
                <div className={`
                  px-4 py-0.5 border-b font-medium text-xs flex items-center gap-1.5
                  ${theme === 'dark' 
                    ? 'text-slate-300 border-slate-700 bg-gradient-to-r from-slate-750/80 to-slate-700/80' 
                    : 'text-gray-700 border-gray-200 bg-gradient-to-r from-gray-50/80 to-white/80'
                  }
                `}>
                  <div className="w-3 h-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-sm flex items-center justify-center">
                    <FaSearch className="text-white text-xs" />
                  </div>
                  Search Results ({results.length})
                </div>
                <SearchDropdownList 
                  results={results} 
                  onSelect={handleSelect}
                  selectedIndex={selectedIndex}
                  theme={theme}
                />
              </div>
            )}

            {/* No Results */}
            {query.trim() && !isLoading && results.length === 0 && (
              <div className={`
                px-8 py-12 text-center
                ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}
              `}>
                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <FaSearch className="text-2xl opacity-50" />
                </div>
                <p className="font-bold text-lg mb-3">No results found for "{query}"</p>
                <p className="text-base">Try different keywords or check spelling</p>
              </div>
            )}

            {/* Popular Searches (when no query) */}
            {!query.trim() && (
              <div>
                <div className={`
                  px-4 py-2 border-b font-semibold text-sm flex items-center gap-2
                  ${theme === 'dark' 
                    ? 'text-slate-300 border-slate-700 bg-gradient-to-r from-slate-750/80 to-slate-700/80' 
                    : 'text-gray-700 border-gray-200 bg-gradient-to-r from-gray-50/80 to-white/80'
                  }
                `}>
                  <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                    <FaFire className="text-white text-xs" />
                  </div>
                  Popular Destinations
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handlePopularSearch(search)}
                      className={`
                        w-full px-4 py-3 text-left transition-all duration-200
                        flex items-center gap-3 group hover:scale-[1.01]
                        ${selectedIndex === index 
                          ? theme === 'dark' 
                            ? 'bg-gradient-to-r from-slate-700/80 to-slate-600/80 shadow-lg' 
                            : 'bg-gradient-to-r from-teal-50/80 to-cyan-50/80 shadow-lg'
                          : theme === 'dark' 
                            ? 'hover:bg-gradient-to-r hover:from-slate-700/60 hover:to-slate-600/60' 
                            : 'hover:bg-gradient-to-r hover:from-gray-50/60 hover:to-white/60'
                        }
                      `}
                    >
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center
                        ${theme === 'dark' 
                          ? 'bg-gradient-to-br from-slate-600 to-slate-500' 
                          : 'bg-gradient-to-br from-gray-100 to-gray-200'
                        }
                        group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md
                      `}>
                        <FaMapMarkerAlt className="text-orange-500 text-sm" />
                      </div>
                      <div className="flex-1">
                        <div className={`
                          font-semibold text-sm
                          ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
                        `}>
                          {search}
                        </div>
                        <div className={`
                          text-xs font-medium
                          ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}
                        `}>
                          Popular destination
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search History */}
            {!query.trim() && searchHistory.length > 0 && (
              <div>
                <div className={`
                  px-4 py-2 border-b font-semibold text-sm flex items-center gap-2
                  ${theme === 'dark' 
                    ? 'text-slate-300 border-slate-700 bg-gradient-to-r from-slate-750/80 to-slate-700/80' 
                    : 'text-gray-700 border-gray-200 bg-gradient-to-r from-gray-50/80 to-white/80'
                  }
                `}>
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <FaHistory className="text-white text-xs" />
                  </div>
                  Recent Searches
                </div>
                <div className="max-h-32 overflow-y-auto">
                  {searchHistory.slice(0, 5).map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handlePopularSearch(search)}
                      className={`
                        w-full px-8 py-4 text-left transition-all duration-300
                        flex items-center gap-4 hover:scale-[1.01]
                        ${theme === 'dark' 
                          ? 'hover:bg-gradient-to-r hover:from-slate-700/60 hover:to-slate-600/60 text-slate-300' 
                          : 'hover:bg-gradient-to-r hover:from-gray-50/60 hover:to-white/60 text-gray-700'
                        }
                      `}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <FaHistory className="text-white text-xs" />
                      </div>
                      <span className="truncate font-medium">{search}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Premium Keyboard Shortcuts Hint */}
            <div className={`
              px-8 py-4 border-t text-sm flex items-center justify-between
              ${theme === 'dark' 
                ? 'text-slate-500 border-slate-700 bg-gradient-to-r from-slate-750/60 to-slate-700/60' 
                : 'text-gray-400 border-gray-200 bg-gradient-to-r from-gray-50/60 to-white/60'
              }
            `}>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center">
                  <FaKeyboard className="text-white text-xs" />
                </div>
                Use ↑↓ to navigate, Enter to select, Esc to close
              </div>
              
              {speechSupported && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                    <FaMicrophone className="text-white text-xs" />
                  </div>
                  <span className="text-xs">Voice search available</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
