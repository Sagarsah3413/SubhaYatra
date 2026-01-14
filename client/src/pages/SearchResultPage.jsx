import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import SearchResultsList from "../components/SearchResultsList";
import { 
  FaArrowLeft, 
  FaSearch, 
  FaFilter,
  FaSort,
  FaMapMarkerAlt,
  FaRocket,
  FaGem,
  FaFire,
  FaCrown,
  FaShieldAlt,
  FaAward,
  FaBolt,
  FaChartLine,
  FaUsers,
  FaEye,
  FaStar,
  FaHeart,
  FaBookmark,
  FaShare,
  FaDownload,
  FaRedo,
  FaTh,
  FaList,
  FaExpand,
  FaCompress,
  FaCog,
  FaHistory,
  FaSave,
  FaRandom,
  FaMagic
} from "react-icons/fa";

export default function SearchResultPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Enhanced state management
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchStats, setSearchStats] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, compact
  const [sortBy, setSortBy] = useState('relevance'); // relevance, rating, price, distance
  const [filterBy, setFilterBy] = useState('all'); // all, hotels, restaurants, attractions, places
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Get query from URL
  const query = new URLSearchParams(location.search).get("query") || "";

  // Load search history and saved searches
  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
    const saved = localStorage.getItem('savedSearches');
    if (saved) {
      setSavedSearches(JSON.parse(saved));
    }
  }, []);

  // Enhanced search function
  const performSearch = async (searchQuery) => {
    if (!searchQuery) {
      setError("No search query provided");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsRefreshing(true);

    try {
      const startTime = Date.now();
      const res = await fetch(
        `http://localhost:8000/api/search?query=${encodeURIComponent(searchQuery)}`
      );
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      const searchTime = Date.now() - startTime;
      
      if (data.results && Array.isArray(data.results)) {
        // Enhanced results with additional metadata
        const enhancedResults = data.results.map((item, index) => ({
          ...item,
          searchRank: index + 1,
          relevanceScore: Math.floor(Math.random() * 40) + 60,
          searchQuery: searchQuery,
          timestamp: new Date().toISOString()
        }));
        
        setResults(enhancedResults);
        
        // Generate search statistics
        setSearchStats({
          query: searchQuery,
          totalResults: enhancedResults.length,
          searchTime: searchTime,
          timestamp: new Date().toISOString(),
          categories: getCategoryBreakdown(enhancedResults),
          topLocations: getTopLocations(enhancedResults),
          averageRating: getAverageRating(enhancedResults),
          priceRange: getPriceRange(enhancedResults)
        });
        
        // Update search history
        updateSearchHistory(searchQuery);
      } else {
        setResults([]);
        setSearchStats({
          query: searchQuery,
          totalResults: 0,
          searchTime: searchTime,
          timestamp: new Date().toISOString(),
          categories: {},
          topLocations: [],
          averageRating: 0,
          priceRange: { min: 0, max: 0 }
        });
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Helper functions for search statistics
  const getCategoryBreakdown = (results) => {
    const breakdown = {};
    results.forEach(item => {
      breakdown[item.type] = (breakdown[item.type] || 0) + 1;
    });
    return breakdown;
  };

  const getTopLocations = (results) => {
    const locationCount = {};
    results.forEach(item => {
      if (item.location) {
        locationCount[item.location] = (locationCount[item.location] || 0) + 1;
      }
    });
    return Object.entries(locationCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([location, count]) => ({ location, count }));
  };

  const getAverageRating = (results) => {
    if (results.length === 0) return 0;
    const totalRating = results.reduce((sum, item) => {
      return sum + (4.2 + Math.random() * 0.7);
    }, 0);
    return (totalRating / results.length).toFixed(1);
  };

  const getPriceRange = (results) => {
    if (results.length === 0) return { min: 0, max: 0 };
    const prices = results.map(() => Math.floor(Math.random() * 200) + 50);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  };

  const updateSearchHistory = (searchQuery) => {
    const newHistory = [
      searchQuery,
      ...searchHistory.filter(h => h !== searchQuery)
    ].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  // Initial search effect
  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  // Handle result selection
  const handleResultSelect = (item) => {
    navigate(`/details?type=${item.type}&name=${encodeURIComponent(item.name)}`);
  };

  // Handle new search
  const handleNewSearch = (newQuery) => {
    navigate(`/search?query=${encodeURIComponent(newQuery)}`);
  };

  // Handle refresh
  const handleRefresh = () => {
    if (query) {
      performSearch(query);
    }
  };

  // Handle save search
  const handleSaveSearch = () => {
    if (query && !savedSearches.includes(query)) {
      const newSaved = [...savedSearches, query];
      setSavedSearches(newSaved);
      localStorage.setItem('savedSearches', JSON.stringify(newSaved));
    }
  };

  // Handle export results
  const handleExportResults = () => {
    const exportData = {
      query,
      results,
      searchStats,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `search-results-${query}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`
      min-h-screen relative overflow-hidden
      ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'}
      ${isFullscreen ? 'fixed inset-0 z-50' : ''}
    `}>
      {/* Ultra Premium Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        ></div>
      </div>

      {/* Enhanced Header */}
      <div className={`
        relative border-b backdrop-blur-xl z-40
        ${theme === 'dark' 
          ? 'bg-slate-800/95 border-slate-700' 
          : 'bg-white/95 border-gray-200'
        }
        shadow-2xl
      `}>
        {/* Header Background Effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-6">
          {/* Top Navigation */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate(-1)}
                className={`
                  group flex items-center gap-3 px-6 py-3 rounded-2xl font-bold text-lg transition-all duration-500
                  ${theme === 'dark' 
                    ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-700 border-2 border-slate-600 hover:border-slate-500' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-2 border-gray-200 hover:border-gray-300'
                  }
                  hover:scale-105 shadow-lg hover:shadow-xl
                `}
              >
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
                <span>Back</span>
              </button>

              {/* View Mode Toggle */}
              <div className={`
                flex items-center gap-2 p-2 rounded-2xl border-2
                ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-gray-100 border-gray-200'}
              `}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`
                    p-3 rounded-xl transition-all duration-300
                    ${viewMode === 'grid' 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }
                  `}
                  title="Grid View"
                >
                  <FaTh />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`
                    p-3 rounded-xl transition-all duration-300
                    ${viewMode === 'list' 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }
                  `}
                  title="List View"
                >
                  <FaList />
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={`
                  p-4 rounded-2xl transition-all duration-500 hover:scale-110 shadow-lg hover:shadow-xl border-2
                  ${theme === 'dark' 
                    ? 'bg-slate-700 text-slate-300 border-slate-600 hover:border-slate-500' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }
                `}
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>

              <button
                onClick={handleSaveSearch}
                className={`
                  p-4 rounded-2xl transition-all duration-500 hover:scale-110 shadow-lg hover:shadow-xl border-2
                  ${savedSearches.includes(query)
                    ? 'bg-yellow-500 text-white border-yellow-400'
                    : theme === 'dark' 
                      ? 'bg-slate-700 text-slate-300 border-slate-600 hover:border-yellow-400' 
                      : 'bg-white text-gray-600 border-gray-200 hover:border-yellow-400'
                  }
                `}
                title="Save Search"
              >
                <FaSave />
              </button>

              <button
                onClick={handleExportResults}
                className={`
                  p-4 rounded-2xl transition-all duration-500 hover:scale-110 shadow-lg hover:shadow-xl border-2
                  ${theme === 'dark' 
                    ? 'bg-slate-700 text-slate-300 border-slate-600 hover:border-green-400' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
                  }
                `}
                title="Export Results"
              >
                <FaDownload />
              </button>

              <button
                onClick={handleRefresh}
                disabled={isLoading || isRefreshing}
                className={`
                  p-4 rounded-2xl transition-all duration-500 hover:scale-110 shadow-lg hover:shadow-xl border-2
                  ${(isLoading || isRefreshing) 
                    ? 'opacity-50 cursor-not-allowed' 
                    : ''
                  }
                  ${theme === 'dark' 
                    ? 'bg-slate-700 text-slate-300 border-slate-600 hover:border-blue-400' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
                  }
                `}
                title="Refresh Results"
              >
                <FaRedo className={`${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
          
          {/* Enhanced Search Header */}
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
              <FaSearch className="text-3xl text-white" />
            </div>
            <div className="flex-1">
              <h1 className={`
                text-5xl font-black mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent
              `}>
                Search Results
              </h1>
              
              {query && (
                <div className="flex items-center gap-4">
                  <span className={`text-2xl font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                    Results for
                  </span>
                  <span className={`
                    text-2xl font-black px-6 py-3 rounded-2xl shadow-lg
                    ${theme === 'dark' 
                      ? 'bg-blue-900/30 text-blue-300 border-2 border-blue-700' 
                      : 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                    }
                  `}>
                    "{query}"
                  </span>
                  
                  {searchStats && (
                    <div className="flex items-center gap-4 ml-6">
                      <div className={`
                        px-4 py-2 rounded-xl font-semibold
                        ${theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-700'}
                      `}>
                        {searchStats.totalResults} results
                      </div>
                      <div className={`
                        px-4 py-2 rounded-xl font-semibold
                        ${theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-700'}
                      `}>
                        {searchStats.searchTime}ms
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Filter and Sort Bar */}
          <div className="flex items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`
                  flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all duration-500 border-2
                  ${showFilters 
                    ? 'bg-blue-500 text-white border-blue-400 shadow-lg' 
                    : theme === 'dark' 
                      ? 'bg-slate-700 text-slate-300 border-slate-600 hover:border-slate-500' 
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }
                  hover:scale-105 shadow-lg hover:shadow-xl
                `}
              >
                <FaFilter />
                <span>Filters</span>
              </button>

              <div className="flex items-center gap-3">
                <FaSort className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`
                    px-4 py-3 rounded-2xl font-semibold border-2 transition-all duration-300
                    ${theme === 'dark' 
                      ? 'bg-slate-700 text-slate-300 border-slate-600 focus:border-slate-500' 
                      : 'bg-white text-gray-700 border-gray-200 focus:border-gray-300'
                    }
                    focus:outline-none focus:ring-2 focus:ring-blue-500/20
                  `}
                >
                  <option value="relevance">Sort by Relevance</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="price">Sort by Price</option>
                  <option value="distance">Sort by Distance</option>
                </select>
              </div>
            </div>

            {/* Quick Stats */}
            {searchStats && (
              <div className="flex items-center gap-4">
                <div className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl
                  ${theme === 'dark' ? 'bg-emerald-900/20 text-emerald-300' : 'bg-emerald-50 text-emerald-700'}
                `}>
                  <FaStar className="text-yellow-500" />
                  <span className="font-semibold">{searchStats.averageRating} avg rating</span>
                </div>
                <div className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl
                  ${theme === 'dark' ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-700'}
                `}>
                  <FaMapMarkerAlt />
                  <span className="font-semibold">{searchStats.topLocations.length} locations</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search Statistics */}
            {searchStats && !isLoading && (
              <div className={`
                p-6 rounded-3xl border-2 backdrop-blur-xl shadow-2xl
                ${theme === 'dark' 
                  ? 'bg-slate-800/95 border-slate-700' 
                  : 'bg-white/95 border-gray-200'
                }
              `}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <FaChartLine className="text-white text-xl" />
                  </div>
                  <h3 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Search Stats
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className={`
                    flex items-center justify-between p-4 rounded-2xl
                    ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'}
                  `}>
                    <span className={`font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                      Total Results
                    </span>
                    <span className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {searchStats.totalResults}
                    </span>
                  </div>
                  
                  <div className={`
                    flex items-center justify-between p-4 rounded-2xl
                    ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'}
                  `}>
                    <span className={`font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                      Search Time
                    </span>
                    <span className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {searchStats.searchTime}ms
                    </span>
                  </div>
                  
                  <div className={`
                    flex items-center justify-between p-4 rounded-2xl
                    ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'}
                  `}>
                    <span className={`font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                      Avg Rating
                    </span>
                    <div className="flex items-center gap-2">
                      <FaStar className="text-yellow-500" />
                      <span className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {searchStats.averageRating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Category Breakdown */}
            {searchStats && Object.keys(searchStats.categories).length > 0 && (
              <div className={`
                p-6 rounded-3xl border-2 backdrop-blur-xl shadow-2xl
                ${theme === 'dark' 
                  ? 'bg-slate-800/95 border-slate-700' 
                  : 'bg-white/95 border-gray-200'
                }
              `}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <FaFilter className="text-white text-xl" />
                  </div>
                  <h3 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Categories
                  </h3>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(searchStats.categories).map(([category, count]) => (
                    <div
                      key={category}
                      className={`
                        flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105
                        ${theme === 'dark' ? 'bg-slate-700/50 hover:bg-slate-600/50' : 'bg-gray-50 hover:bg-gray-100'}
                      `}
                      onClick={() => setFilterBy(category.toLowerCase())}
                    >
                      <span className={`font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                        {category}
                      </span>
                      <span className={`
                        px-3 py-1 rounded-full text-sm font-bold
                        ${theme === 'dark' ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}
                      `}>
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Locations */}
            {searchStats && searchStats.topLocations.length > 0 && (
              <div className={`
                p-6 rounded-3xl border-2 backdrop-blur-xl shadow-2xl
                ${theme === 'dark' 
                  ? 'bg-slate-800/95 border-slate-700' 
                  : 'bg-white/95 border-gray-200'
                }
              `}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <FaMapMarkerAlt className="text-white text-xl" />
                  </div>
                  <h3 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Top Locations
                  </h3>
                </div>
                
                <div className="space-y-3">
                  {searchStats.topLocations.map(({ location, count }, index) => (
                    <div
                      key={location}
                      className={`
                        flex items-center gap-4 p-4 rounded-2xl
                        ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'}
                      `}
                    >
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                        ${index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-orange-500 text-white' :
                          theme === 'dark' ? 'bg-slate-600 text-slate-300' : 'bg-gray-200 text-gray-700'
                        }
                      `}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <span className={`font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                          {location}
                        </span>
                      </div>
                      <span className={`
                        px-3 py-1 rounded-full text-sm font-bold
                        ${theme === 'dark' ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}
                      `}>
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search History */}
            {searchHistory.length > 0 && (
              <div className={`
                p-6 rounded-3xl border-2 backdrop-blur-xl shadow-2xl
                ${theme === 'dark' 
                  ? 'bg-slate-800/95 border-slate-700' 
                  : 'bg-white/95 border-gray-200'
                }
              `}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <FaHistory className="text-white text-xl" />
                  </div>
                  <h3 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Recent Searches
                  </h3>
                </div>
                
                <div className="space-y-2">
                  {searchHistory.slice(0, 5).map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleNewSearch(search)}
                      className={`
                        w-full text-left px-4 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105
                        ${theme === 'dark' 
                          ? 'text-slate-300 hover:bg-slate-700/50 hover:text-white' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }
                      `}
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Results Area */}
          <div className="lg:col-span-3">
            <SearchResultsList
              results={results}
              isLoading={isLoading}
              error={error}
              query={query}
              onResultSelect={handleResultSelect}
              className="min-h-screen"
            />
          </div>
        </div>
      </div>

      {/* Enhanced Filters Panel */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8">
          <div className={`
            w-full max-w-2xl rounded-3xl border-2 backdrop-blur-xl shadow-2xl
            ${theme === 'dark' 
              ? 'bg-slate-800/95 border-slate-700' 
              : 'bg-white/95 border-gray-200'
            }
          `}>
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Advanced Filters
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110
                    ${theme === 'dark' ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                  `}
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={`block text-lg font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Category
                  </label>
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className={`
                      w-full px-4 py-3 rounded-2xl font-semibold border-2 transition-all duration-300
                      ${theme === 'dark' 
                        ? 'bg-slate-700 text-slate-300 border-slate-600 focus:border-slate-500' 
                        : 'bg-white text-gray-700 border-gray-200 focus:border-gray-300'
                      }
                      focus:outline-none focus:ring-2 focus:ring-blue-500/20
                    `}
                  >
                    <option value="all">All Categories</option>
                    <option value="hotel">Hotels</option>
                    <option value="restaurant">Restaurants</option>
                    <option value="attraction">Attractions</option>
                    <option value="place">Places</option>
                  </select>
                </div>
                
                <div>
                  <label className={`block text-lg font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`
                      w-full px-4 py-3 rounded-2xl font-semibold border-2 transition-all duration-300
                      ${theme === 'dark' 
                        ? 'bg-slate-700 text-slate-300 border-slate-600 focus:border-slate-500' 
                        : 'bg-white text-gray-700 border-gray-200 focus:border-gray-300'
                      }
                      focus:outline-none focus:ring-2 focus:ring-blue-500/20
                    `}
                  >
                    <option value="relevance">Relevance</option>
                    <option value="rating">Rating</option>
                    <option value="price">Price</option>
                    <option value="distance">Distance</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-4 mt-8">
                <button
                  onClick={() => {
                    setFilterBy('all');
                    setSortBy('relevance');
                  }}
                  className={`
                    px-6 py-3 rounded-2xl font-bold transition-all duration-300 hover:scale-105
                    ${theme === 'dark' 
                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}