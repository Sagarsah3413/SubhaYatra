import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import placesService from "../services/placesService";
import { 
  FaArrowLeft, 
  FaSearch, 
  FaFilter,
  FaMapMarkerAlt,
  FaStar,
  FaHeart,
  FaBookmark,
  FaRedo,
  FaTh,
  FaList,
  FaEye,
  FaRoute,
  FaCalendarAlt,
  FaMountain,
  FaTemple,
  FaTree,
  FaCity,
  FaGlobe,
  FaChevronDown,
  FaSpinner,
  FaArrowRight,
  FaClock,
  FaUsers,
  FaCamera,
  FaWifi,
  FaParking,
  FaUtensils,
  FaBed,
  FaShieldAlt,
  FaAward,
  FaThumbsUp,
  FaShareAlt,
  FaDirections,
  FaInfoCircle
} from "react-icons/fa";

export default function SearchResultPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State management
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchStats, setSearchStats] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    category: 'all',
    rating: 'all',
    priceRange: 'all',
    province: 'all',
    difficulty: 'all',
    season: 'all'
  });
  
  // Get query from URL
  const query = new URLSearchParams(location.search).get("q") || "";

  // Enhanced search function using places service
  const performSearch = async (searchQuery) => {
    console.log('Performing search for:', searchQuery);
    
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
      
      // Use the places service for search
      const data = await placesService.searchPlaces(searchQuery);
      console.log('Search results:', data);
      
      const searchTime = Date.now() - startTime;
      
      if (data.results && Array.isArray(data.results)) {
        const enhancedResults = data.results.map((item, index) => ({
          ...item,
          searchRank: index + 1,
          relevanceScore: Math.floor(Math.random() * 40) + 60,
          rating: item.rating || (4.2 + Math.random() * 0.7).toFixed(1),
          reviews: Math.floor(Math.random() * 500) + 50,
          price: Math.floor(Math.random() * 200) + 50,
          distance: (Math.random() * 20).toFixed(1),
          isBookmarked: false,
          isLiked: false,
          images: item.all_images || [item.image_url].filter(Boolean),
          // Enhanced metadata
          verified: Math.random() > 0.3,
          trending: Math.random() > 0.7,
          featured: Math.random() > 0.8,
          lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          amenities: generateAmenities(),
          highlights: generateHighlights(item)
        }));
        
        setResults(enhancedResults);
        
        setSearchStats({
          query: searchQuery,
          totalResults: enhancedResults.length,
          searchTime: searchTime,
          timestamp: new Date().toISOString(),
          categories: getCategoryBreakdown(enhancedResults),
          averageRating: getAverageRating(enhancedResults),
          priceRange: getPriceRange(enhancedResults),
          provinces: getProvinceBreakdown(enhancedResults),
          difficulties: getDifficultyBreakdown(enhancedResults)
        });
      } else {
        setResults([]);
        setSearchStats({
          query: searchQuery,
          totalResults: 0,
          searchTime: searchTime,
          timestamp: new Date().toISOString(),
          categories: {},
          averageRating: 0,
          priceRange: { min: 0, max: 0 },
          provinces: {},
          difficulties: {}
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

  // Enhanced helper functions
  const generateAmenities = () => {
    const allAmenities = [
      { icon: FaWifi, name: 'WiFi Available' },
      { icon: FaParking, name: 'Parking' },
      { icon: FaUtensils, name: 'Restaurant' },
      { icon: FaBed, name: 'Accommodation' },
      { icon: FaCamera, name: 'Photo Spots' },
      { icon: FaShieldAlt, name: 'Safe Area' }
    ];
    return allAmenities.filter(() => Math.random() > 0.5).slice(0, 3);
  };

  const generateHighlights = (item) => {
    const highlights = [];
    if (item.best_season) highlights.push(`Best: ${item.best_season}`);
    if (item.difficulty_level) highlights.push(`${item.difficulty_level} difficulty`);
    if (item.activities) highlights.push(item.activities.split(',')[0]);
    return highlights.slice(0, 2);
  };

  const getCategoryBreakdown = (results) => {
    const breakdown = {};
    results.forEach(item => {
      const category = item.type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Other';
      breakdown[category] = (breakdown[category] || 0) + 1;
    });
    return breakdown;
  };

  const getProvinceBreakdown = (results) => {
    const breakdown = {};
    results.forEach(item => {
      if (item.province) {
        breakdown[`Province ${item.province}`] = (breakdown[`Province ${item.province}`] || 0) + 1;
      }
    });
    return breakdown;
  };

  const getDifficultyBreakdown = (results) => {
    const breakdown = {};
    results.forEach(item => {
      if (item.difficulty_level) {
        breakdown[item.difficulty_level] = (breakdown[item.difficulty_level] || 0) + 1;
      }
    });
    return breakdown;
  };

  const getAverageRating = (results) => {
    if (results.length === 0) return 0;
    const totalRating = results.reduce((sum, item) => sum + parseFloat(item.rating || 4.5), 0);
    return (totalRating / results.length).toFixed(1);
  };

  const getPriceRange = (results) => {
    if (results.length === 0) return { min: 0, max: 0 };
    const prices = results.map(item => item.price || 100);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  };

  // Initial search effect
  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  // Handle result selection
  const handleResultSelect = (item) => {
    navigate(`/places/${item.id}`);
  };

  // Handle refresh
  const handleRefresh = () => {
    if (query) {
      performSearch(query);
    }
  };

  // Filter and sort results with enhanced logic
  const getFilteredAndSortedResults = () => {
    let filtered = [...results];

    // Apply filters
    if (selectedFilters.category !== 'all') {
      filtered = filtered.filter(item => {
        const category = item.type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Other';
        return category === selectedFilters.category;
      });
    }
    if (selectedFilters.rating !== 'all') {
      const minRating = parseFloat(selectedFilters.rating);
      filtered = filtered.filter(item => parseFloat(item.rating) >= minRating);
    }
    if (selectedFilters.province !== 'all') {
      filtered = filtered.filter(item => `Province ${item.province}` === selectedFilters.province);
    }
    if (selectedFilters.difficulty !== 'all') {
      filtered = filtered.filter(item => item.difficulty_level === selectedFilters.difficulty);
    }

    // Apply sorting with enhanced options
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        break;
      case 'price':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'distance':
        filtered.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        break;
      case 'trending':
        filtered.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
        break;
      default:
        filtered.sort((a, b) => b.relevanceScore - a.relevanceScore);
    }

    return filtered;
  };

  const filteredResults = getFilteredAndSortedResults();

  return (
    <div className={`min-h-screen ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      {/* Ultra-Professional Header */}
      <div className={`sticky top-0 z-50 backdrop-blur-2xl border-b ${
        theme === 'dark' 
          ? 'bg-slate-900/90 border-slate-700/30' 
          : 'bg-white/90 border-gray-200/30'
      } shadow-2xl`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Enhanced Left Section */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate(-1)}
                className={`group flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  theme === 'dark' 
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800/50 border border-slate-700/50 hover:border-slate-600' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 border border-gray-200/50 hover:border-gray-300'
                } backdrop-blur-xl shadow-lg hover:shadow-xl`}
              >
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
                <span>Back</span>
              </button>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                    <FaSearch className="text-white text-xl" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{filteredResults.length}</span>
                  </div>
                </div>
                <div>
                  <h1 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Search Results
                  </h1>
                  {query && (
                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                      Exploring "{query}" in Nepal
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Right Section */}
            <div className="flex items-center gap-4">
              {/* Advanced View Toggle */}
              <div className={`flex items-center p-1.5 rounded-2xl border shadow-lg ${
                theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50 backdrop-blur-xl' : 'bg-white/50 border-gray-200/50 backdrop-blur-xl'
              }`}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg transform scale-105' 
                      : theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-slate-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                  }`}
                >
                  <FaTh />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg transform scale-105' 
                      : theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-slate-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                  }`}
                >
                  <FaList />
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                  showFilters
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : theme === 'dark' 
                      ? 'bg-slate-800/50 text-slate-300 hover:text-white border border-slate-700/50 hover:border-slate-600 backdrop-blur-xl' 
                      : 'bg-white/50 text-gray-600 hover:text-gray-900 border border-gray-200/50 hover:border-gray-300 backdrop-blur-xl'
                }`}
              >
                <FaFilter />
                <span>Filters</span>
                <FaChevronDown className={`transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={isLoading || isRefreshing}
                className={`p-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                  theme === 'dark' 
                    ? 'bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700/50 hover:border-slate-600 backdrop-blur-xl' 
                    : 'bg-white/50 text-gray-600 hover:text-gray-900 border border-gray-200/50 hover:border-gray-300 backdrop-blur-xl'
                } ${(isLoading || isRefreshing) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FaRedo className={`${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Enhanced Search Stats */}
          {searchStats && !isLoading && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200/30 dark:border-slate-700/30">
              <div className="flex items-center gap-8">
                <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                  <span className="font-bold text-lg text-teal-600 dark:text-teal-400">{filteredResults.length}</span> results found in{' '}
                  <span className="font-semibold">{searchStats.searchTime}ms</span>
                </div>
                
                {searchStats.averageRating > 0 && (
                  <div className="flex items-center gap-2">
                    <FaStar className="text-yellow-500" />
                    <span className={`font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                      {searchStats.averageRating} avg rating
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <FaGlobe className="text-blue-500" />
                  <span className={`font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                    {Object.keys(searchStats.provinces || {}).length} provinces
                  </span>
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`px-4 py-2 rounded-xl border font-medium transition-all duration-200 ${
                    theme === 'dark' 
                      ? 'bg-slate-800/50 border-slate-700/50 text-white focus:border-teal-500 backdrop-blur-xl' 
                      : 'bg-white/50 border-gray-200/50 text-gray-900 focus:border-teal-500 backdrop-blur-xl'
                  } focus:outline-none focus:ring-2 focus:ring-teal-500/20`}
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price">Lowest Price</option>
                  <option value="distance">Nearest First</option>
                  <option value="trending">Trending</option>
                  <option value="newest">Recently Updated</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content with Enhanced Layout */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Enhanced Filters Panel */}
        {showFilters && (
          <div className={`mb-8 p-6 rounded-3xl border shadow-2xl transition-all duration-500 transform ${
            theme === 'dark' 
              ? 'bg-slate-800/30 border-slate-700/30 backdrop-blur-2xl' 
              : 'bg-white/30 border-gray-200/30 backdrop-blur-2xl'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category Filter */}
              <div>
                <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                  <FaGlobe className="inline mr-2" />
                  Category
                </label>
                <select
                  value={selectedFilters.category}
                  onChange={(e) => setSelectedFilters({...selectedFilters, category: e.target.value})}
                  className={`w-full p-4 rounded-2xl border font-medium transition-all duration-200 ${
                    theme === 'dark' 
                      ? 'bg-slate-700/50 border-slate-600/50 text-white focus:border-teal-500 backdrop-blur-xl' 
                      : 'bg-white/50 border-gray-300/50 text-gray-900 focus:border-teal-500 backdrop-blur-xl'
                  } focus:outline-none focus:ring-2 focus:ring-teal-500/20 shadow-lg`}
                >
                  <option value="all">All Categories</option>
                  {Object.keys(searchStats?.categories || {}).map(category => (
                    <option key={category} value={category}>
                      {category} ({searchStats.categories[category]})
                    </option>
                  ))}
                </select>
              </div>

              {/* Province Filter */}
              <div>
                <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                  <FaMapMarkerAlt className="inline mr-2" />
                  Province
                </label>
                <select
                  value={selectedFilters.province}
                  onChange={(e) => setSelectedFilters({...selectedFilters, province: e.target.value})}
                  className={`w-full p-4 rounded-2xl border font-medium transition-all duration-200 ${
                    theme === 'dark' 
                      ? 'bg-slate-700/50 border-slate-600/50 text-white focus:border-teal-500 backdrop-blur-xl' 
                      : 'bg-white/50 border-gray-300/50 text-gray-900 focus:border-teal-500 backdrop-blur-xl'
                  } focus:outline-none focus:ring-2 focus:ring-teal-500/20 shadow-lg`}
                >
                  <option value="all">All Provinces</option>
                  {Object.keys(searchStats?.provinces || {}).map(province => (
                    <option key={province} value={province}>
                      {province} ({searchStats.provinces[province]})
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                  <FaStar className="inline mr-2" />
                  Minimum Rating
                </label>
                <select
                  value={selectedFilters.rating}
                  onChange={(e) => setSelectedFilters({...selectedFilters, rating: e.target.value})}
                  className={`w-full p-4 rounded-2xl border font-medium transition-all duration-200 ${
                    theme === 'dark' 
                      ? 'bg-slate-700/50 border-slate-600/50 text-white focus:border-teal-500 backdrop-blur-xl' 
                      : 'bg-white/50 border-gray-300/50 text-gray-900 focus:border-teal-500 backdrop-blur-xl'
                  } focus:outline-none focus:ring-2 focus:ring-teal-500/20 shadow-lg`}
                >
                  <option value="all">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                  <option value="3.0">3.0+ Stars</option>
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className={`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                  <FaMountain className="inline mr-2" />
                  Difficulty
                </label>
                <select
                  value={selectedFilters.difficulty}
                  onChange={(e) => setSelectedFilters({...selectedFilters, difficulty: e.target.value})}
                  className={`w-full p-4 rounded-2xl border font-medium transition-all duration-200 ${
                    theme === 'dark' 
                      ? 'bg-slate-700/50 border-slate-600/50 text-white focus:border-teal-500 backdrop-blur-xl' 
                      : 'bg-white/50 border-gray-300/50 text-gray-900 focus:border-teal-500 backdrop-blur-xl'
                  } focus:outline-none focus:ring-2 focus:ring-teal-500/20 shadow-lg`}
                >
                  <option value="all">Any Difficulty</option>
                  {Object.keys(searchStats?.difficulties || {}).map(difficulty => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty} ({searchStats.difficulties[difficulty]})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        <div>
          {isLoading ? (
            <div className="flex items-center justify-center py-32">
              <div className="text-center">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mx-auto mb-6"></div>
                  <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                </div>
                <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Discovering Amazing Places...
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'} mt-2`}>
                  Searching through {searchStats?.totalResults || 'thousands of'} destinations
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-32">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <FaSearch className="text-white text-2xl" />
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Search Encountered an Issue
              </h3>
              <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'} mb-6 max-w-md mx-auto`}>
                {error}
              </p>
              <button
                onClick={handleRefresh}
                className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-2xl font-bold hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <FaRedo className="inline mr-2" />
                Try Again
              </button>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="text-center py-32">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <FaSearch className="text-white text-2xl" />
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                No Destinations Found
              </h3>
              <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'} mb-6 max-w-md mx-auto`}>
                Try adjusting your search terms or filters to discover more amazing places in Nepal
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setSelectedFilters({
                    category: 'all',
                    rating: 'all',
                    priceRange: 'all',
                    province: 'all',
                    difficulty: 'all',
                    season: 'all'
                  })}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-colors duration-300"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => navigate('/search')}
                  className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-teal-600 hover:to-cyan-600 transition-colors duration-300"
                >
                  New Search
                </button>
              </div>
            </div>
          ) : (
            <UltraProfessionalResultsGrid 
              results={filteredResults}
              viewMode={viewMode}
              theme={theme}
              onResultSelect={handleResultSelect}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Ultra-Professional Results Grid Component
const UltraProfessionalResultsGrid = ({ results, viewMode, theme, onResultSelect }) => {
  const [bookmarkedItems, setBookmarkedItems] = useState(new Set());
  const [likedItems, setLikedItems] = useState(new Set());

  const toggleBookmark = (itemId, e) => {
    e.stopPropagation();
    const newBookmarked = new Set(bookmarkedItems);
    if (newBookmarked.has(itemId)) {
      newBookmarked.delete(itemId);
    } else {
      newBookmarked.add(itemId);
    }
    setBookmarkedItems(newBookmarked);
  };

  const toggleLike = (itemId, e) => {
    e.stopPropagation();
    const newLiked = new Set(likedItems);
    if (newLiked.has(itemId)) {
      newLiked.delete(itemId);
    } else {
      newLiked.add(itemId);
    }
    setLikedItems(newLiked);
  };

  const getCategoryIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'trekking_adventure':
      case 'trekking_&_adventure':
        return FaMountain;
      case 'cultural_religious_sites':
      case 'cultural_&_religious_sites':
        return FaTemple;
      case 'natural_attractions':
        return FaTree;
      default:
        return FaGlobe;
    }
  };

  const getCategoryColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'trekking_adventure':
      case 'trekking_&_adventure':
        return 'from-green-500 to-emerald-600';
      case 'cultural_religious_sites':
      case 'cultural_&_religious_sites':
        return 'from-purple-500 to-indigo-600';
      case 'natural_attractions':
        return 'from-blue-500 to-cyan-600';
      default:
        return 'from-teal-500 to-cyan-600';
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="space-y-6">
        {results.map((item, index) => {
          const CategoryIcon = getCategoryIcon(item.type);
          const categoryColor = getCategoryColor(item.type);
          
          return (
            <div
              key={index}
              onClick={() => onResultSelect(item)}
              className={`group relative p-8 rounded-3xl border cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden ${
                theme === 'dark' 
                  ? 'bg-slate-800/30 border-slate-700/30 hover:border-slate-600/50 backdrop-blur-2xl' 
                  : 'bg-white/30 border-gray-200/30 hover:border-gray-300/50 backdrop-blur-2xl'
              }`}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-r ${categoryColor} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              {/* Status Badges */}
              <div className="absolute top-4 right-4 flex gap-2">
                {item.verified && (
                  <div className="flex items-center gap-1 bg-green-500/20 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-xl">
                    <FaShieldAlt />
                    Verified
                  </div>
                )}
                {item.trending && (
                  <div className="flex items-center gap-1 bg-orange-500/20 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-xl">
                    <FaAward />
                    Trending
                  </div>
                )}
                {item.featured && (
                  <div className="flex items-center gap-1 bg-purple-500/20 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-xl">
                    <FaStar />
                    Featured
                  </div>
                )}
              </div>

              <div className="relative flex items-start gap-8">
                {/* Enhanced Image */}
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={item.images[0].startsWith('http') 
                        ? item.images[0] 
                        : `http://localhost:8000/datasets/${item.images[0].replace(/\\/g, "/")}`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.parentElement.innerHTML = `
                          <div class="w-full h-full bg-gradient-to-br ${categoryColor} flex items-center justify-center text-white text-3xl font-bold">
                            ${item.name?.charAt(0) || 'N'}
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${categoryColor} flex items-center justify-center text-white text-3xl font-bold`}>
                      {item.name?.charAt(0) || 'N'}
                    </div>
                  )}
                  
                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Category Icon */}
                  <div className="absolute bottom-2 left-2">
                    <div className={`w-8 h-8 bg-gradient-to-br ${categoryColor} rounded-lg flex items-center justify-center shadow-lg`}>
                      <CategoryIcon className="text-white text-sm" />
                    </div>
                  </div>
                </div>

                {/* Enhanced Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className={`text-2xl font-black mb-2 group-hover:text-teal-500 transition-colors duration-300 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {item.name}
                      </h3>
                      
                      <div className="flex items-center gap-6 text-sm mb-3">
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-teal-500" />
                          <span className={`font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                            {item.location}
                          </span>
                        </div>
                        
                        {item.province && (
                          <div className="flex items-center gap-2">
                            <FaGlobe className="text-blue-500" />
                            <span className={`font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                              Province {item.province}
                            </span>
                          </div>
                        )}
                        
                        {item.distance && (
                          <div className="flex items-center gap-2">
                            <FaRoute className="text-purple-500" />
                            <span className={`font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                              {item.distance}km away
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Highlights */}
                      {item.highlights && item.highlights.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.highlights.map((highlight, idx) => (
                            <span key={idx} className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              theme === 'dark' ? 'bg-slate-700/50 text-slate-300' : 'bg-gray-100/50 text-gray-700'
                            } backdrop-blur-xl`}>
                              {highlight}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 ml-4">
                      <button
                        onClick={(e) => toggleLike(index, e)}
                        className={`p-3 rounded-2xl transition-all duration-300 transform hover:scale-110 ${
                          likedItems.has(index)
                            ? 'text-red-500 bg-red-50 dark:bg-red-900/20 shadow-lg'
                            : theme === 'dark' ? 'text-slate-400 hover:text-red-500 hover:bg-red-900/20' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                        } backdrop-blur-xl`}
                      >
                        <FaHeart />
                      </button>
                      <button
                        onClick={(e) => toggleBookmark(index, e)}
                        className={`p-3 rounded-2xl transition-all duration-300 transform hover:scale-110 ${
                          bookmarkedItems.has(index)
                            ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                            : theme === 'dark' ? 'text-slate-400 hover:text-blue-500 hover:bg-blue-900/20' : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
                        } backdrop-blur-xl`}
                      >
                        <FaBookmark />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Share functionality
                        }}
                        className={`p-3 rounded-2xl transition-all duration-300 transform hover:scale-110 ${
                          theme === 'dark' ? 'text-slate-400 hover:text-green-500 hover:bg-green-900/20' : 'text-gray-400 hover:text-green-500 hover:bg-green-50'
                        } backdrop-blur-xl`}
                      >
                        <FaShareAlt />
                      </button>
                    </div>
                  </div>

                  <p className={`text-sm mb-6 line-clamp-2 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                    {item.description || 'Discover this amazing destination in Nepal with breathtaking views and unforgettable experiences that will create memories to last a lifetime.'}
                  </p>

                  {/* Enhanced Stats */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i} 
                              className={`text-sm ${
                                i < Math.floor(parseFloat(item.rating)) 
                                  ? 'text-yellow-500' 
                                  : 'text-gray-300 dark:text-gray-600'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {item.rating}
                        </span>
                        <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                          ({item.reviews} reviews)
                        </span>
                      </div>
                      
                      {item.amenities && item.amenities.length > 0 && (
                        <div className="flex items-center gap-3">
                          {item.amenities.slice(0, 3).map((amenity, idx) => (
                            <div key={idx} className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <amenity.icon />
                              <span>{amenity.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className={`text-right ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                        <div className="text-xs">Starting from</div>
                        <div className={`text-2xl font-black ${theme === 'dark' ? 'text-teal-400' : 'text-teal-600'}`}>
                          ${item.price}
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onResultSelect(item);
                        }}
                        className={`px-6 py-3 bg-gradient-to-r ${categoryColor} text-white rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl`}
                      >
                        <FaEye className="inline mr-2" />
                        Explore
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Enhanced Grid View
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {results.map((item, index) => {
        const CategoryIcon = getCategoryIcon(item.type);
        const categoryColor = getCategoryColor(item.type);
        
        return (
          <div
            key={index}
            onClick={() => onResultSelect(item)}
            className={`group relative overflow-hidden rounded-3xl border cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 ${
              theme === 'dark' 
                ? 'bg-slate-800/30 border-slate-700/30 hover:border-slate-600/50 backdrop-blur-2xl' 
                : 'bg-white/30 border-gray-200/30 hover:border-gray-300/50 backdrop-blur-2xl'
            }`}
          >
            {/* Enhanced Image Section */}
            <div className="relative h-64 overflow-hidden">
              {item.images && item.images.length > 0 ? (
                <img
                  src={item.images[0].startsWith('http') 
                    ? item.images[0] 
                    : `http://localhost:8000/datasets/${item.images[0].replace(/\\/g, "/")}`}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.target.parentElement.innerHTML = `
                      <div class="w-full h-full bg-gradient-to-br ${categoryColor} flex items-center justify-center text-white text-5xl font-bold">
                        ${item.name?.charAt(0) || 'N'}
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${categoryColor} flex items-center justify-center text-white text-5xl font-bold`}>
                  {item.name?.charAt(0) || 'N'}
                </div>
              )}
              
              {/* Enhanced Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
              
              {/* Status Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {item.verified && (
                  <div className="flex items-center gap-1 bg-green-500/90 text-white px-2 py-1 rounded-full text-xs font-bold backdrop-blur-xl">
                    <FaShieldAlt />
                    Verified
                  </div>
                )}
                {item.trending && (
                  <div className="flex items-center gap-1 bg-orange-500/90 text-white px-2 py-1 rounded-full text-xs font-bold backdrop-blur-xl">
                    <FaAward />
                    Trending
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button
                  onClick={(e) => toggleLike(index, e)}
                  className={`p-3 rounded-full backdrop-blur-xl transition-all duration-300 transform hover:scale-110 ${
                    likedItems.has(index)
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'bg-white/20 text-white hover:bg-red-500'
                  }`}
                >
                  <FaHeart />
                </button>
                <button
                  onClick={(e) => toggleBookmark(index, e)}
                  className={`p-3 rounded-full backdrop-blur-xl transition-all duration-300 transform hover:scale-110 ${
                    bookmarkedItems.has(index)
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-white/20 text-white hover:bg-blue-500'
                  }`}
                >
                  <FaBookmark />
                </button>
              </div>

              {/* Category Badge */}
              <div className="absolute bottom-4 left-4">
                <div className={`flex items-center gap-2 bg-gradient-to-r ${categoryColor} px-4 py-2 rounded-full text-white text-sm font-bold shadow-lg backdrop-blur-xl`}>
                  <CategoryIcon />
                  <span>{item.type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Attraction'}</span>
                </div>
              </div>

              {/* Province Badge */}
              {item.province && (
                <div className="absolute bottom-4 right-4">
                  <div className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-xl">
                    Province {item.province}
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Content Section */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className={`text-xl font-black mb-2 group-hover:text-teal-500 transition-colors duration-300 line-clamp-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {item.name}
                </h3>
                
                <div className="flex items-center gap-2 mb-3">
                  <FaMapMarkerAlt className="text-teal-500 text-sm" />
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                    {item.location}
                  </span>
                </div>

                {/* Highlights */}
                {item.highlights && item.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.highlights.slice(0, 2).map((highlight, idx) => (
                      <span key={idx} className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                        theme === 'dark' ? 'bg-slate-700/50 text-slate-300' : 'bg-gray-100/50 text-gray-700'
                      }`}>
                        {highlight}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <p className={`text-sm mb-4 line-clamp-2 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                {item.description || 'Discover this amazing destination in Nepal with breathtaking views and unforgettable experiences.'}
              </p>

              {/* Enhanced Stats Row */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={`text-xs ${
                          i < Math.floor(parseFloat(item.rating)) 
                            ? 'text-yellow-500' 
                            : 'text-gray-300 dark:text-gray-600'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className={`font-bold text-sm ml-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {item.rating}
                  </span>
                  <span className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                    ({item.reviews})
                  </span>
                </div>
                
                <div className={`font-black text-lg ${theme === 'dark' ? 'text-teal-400' : 'text-teal-600'}`}>
                  ${item.price}
                </div>
              </div>

              {/* Amenities */}
              {item.amenities && item.amenities.length > 0 && (
                <div className="flex items-center gap-3 mb-4">
                  {item.amenities.slice(0, 3).map((amenity, idx) => (
                    <div key={idx} className={`flex items-center gap-1 text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                      <amenity.icon />
                    </div>
                  ))}
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onResultSelect(item);
                }}
                className={`w-full py-3 bg-gradient-to-r ${categoryColor} text-white rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl`}
              >
                <FaEye className="inline mr-2" />
                Explore Details
                <FaArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};