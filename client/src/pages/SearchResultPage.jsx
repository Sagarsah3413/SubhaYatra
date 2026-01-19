import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
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
  FaList
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
  const [selectedFilters, setSelectedFilters] = useState({
    category: 'all',
    rating: 'all',
    priceRange: 'all'
  });
  
  // Get query from URL
  const query = new URLSearchParams(location.search).get("query") || "";

  // Enhanced search function
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
      const apiUrl = `http://localhost:8000/api/search?q=${encodeURIComponent(searchQuery)}`;
      console.log('API URL:', apiUrl);
      
      const res = await fetch(apiUrl);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('API Response:', data);
      const searchTime = Date.now() - startTime;
      
      if (data.results && Array.isArray(data.results)) {
        const enhancedResults = data.results.map((item, index) => ({
          ...item,
          searchRank: index + 1,
          relevanceScore: Math.floor(Math.random() * 40) + 60,
          rating: (4.2 + Math.random() * 0.7).toFixed(1),
          reviews: Math.floor(Math.random() * 500) + 50,
          price: Math.floor(Math.random() * 200) + 50,
          distance: (Math.random() * 20).toFixed(1),
          isBookmarked: false,
          isLiked: false
        }));
        
        setResults(enhancedResults);
        
        setSearchStats({
          query: searchQuery,
          totalResults: enhancedResults.length,
          searchTime: searchTime,
          timestamp: new Date().toISOString(),
          categories: getCategoryBreakdown(enhancedResults),
          averageRating: getAverageRating(enhancedResults),
          priceRange: getPriceRange(enhancedResults)
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

  // Helper functions
  const getCategoryBreakdown = (results) => {
    const breakdown = {};
    results.forEach(item => {
      breakdown[item.type] = (breakdown[item.type] || 0) + 1;
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
    navigate(`/details?type=${item.type}&name=${encodeURIComponent(item.name)}`);
  };

  // Handle refresh
  const handleRefresh = () => {
    if (query) {
      performSearch(query);
    }
  };

  // Filter and sort results
  const getFilteredAndSortedResults = () => {
    let filtered = [...results];

    // Apply filters
    if (selectedFilters.category !== 'all') {
      filtered = filtered.filter(item => item.type === selectedFilters.category);
    }
    if (selectedFilters.rating !== 'all') {
      const minRating = parseFloat(selectedFilters.rating);
      filtered = filtered.filter(item => parseFloat(item.rating) >= minRating);
    }

    // Apply sorting
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
      default:
        filtered.sort((a, b) => b.relevanceScore - a.relevanceScore);
    }

    return filtered;
  };

  const filteredResults = getFilteredAndSortedResults();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {/* Professional Header */}
      <div className={`sticky top-0 z-50 backdrop-blur-xl border-b ${
        theme === 'dark' 
          ? 'bg-slate-900/95 border-slate-700/50' 
          : 'bg-white/95 border-gray-200/50'
      } shadow-lg`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate(-1)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  theme === 'dark' 
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <FaArrowLeft />
                <span>Back</span>
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <FaSearch className="text-white" />
                </div>
                <div>
                  <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Search Results
                  </h1>
                  {query && (
                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                      Results for "{query}"
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className={`flex items-center p-1 rounded-lg border ${
                theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-200'
              }`}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-teal-500 text-white shadow-md' 
                      : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FaTh />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-teal-500 text-white shadow-md' 
                      : theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FaList />
                </button>
              </div>

              {/* Action Buttons */}
              <button
                onClick={handleRefresh}
                disabled={isLoading || isRefreshing}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  theme === 'dark' 
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                } ${(isLoading || isRefreshing) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FaRedo className={`${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Search Stats */}
          {searchStats && !isLoading && (
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-200/50 dark:border-slate-700/50">
              <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                <span className="font-medium">{filteredResults.length}</span> results found in{' '}
                <span className="font-medium">{searchStats.searchTime}ms</span>
              </div>
              
              {searchStats.averageRating > 0 && (
                <div className="flex items-center gap-1">
                  <FaStar className="text-yellow-500 text-sm" />
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                    {searchStats.averageRating} avg rating
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className={`sticky top-32 p-6 rounded-2xl border shadow-lg ${
              theme === 'dark' 
                ? 'bg-slate-800/50 border-slate-700/50 backdrop-blur-xl' 
                : 'bg-white/80 border-gray-200/50 backdrop-blur-xl'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <FaFilter className={`text-lg ${theme === 'dark' ? 'text-teal-400' : 'text-teal-600'}`} />
                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Filters
                </h3>
              </div>

              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <label className={`block text-sm font-medium mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                    Category
                  </label>
                  <select
                    value={selectedFilters.category}
                    onChange={(e) => setSelectedFilters({...selectedFilters, category: e.target.value})}
                    className={`w-full p-3 rounded-xl border transition-all duration-200 ${
                      theme === 'dark' 
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-teal-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-teal-500'
                    } focus:outline-none focus:ring-2 focus:ring-teal-500/20`}
                  >
                    <option value="all">All Categories</option>
                    {Object.keys(searchStats?.categories || {}).map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)} ({searchStats.categories[category]})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className={`block text-sm font-medium mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                    Minimum Rating
                  </label>
                  <select
                    value={selectedFilters.rating}
                    onChange={(e) => setSelectedFilters({...selectedFilters, rating: e.target.value})}
                    className={`w-full p-3 rounded-xl border transition-all duration-200 ${
                      theme === 'dark' 
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-teal-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-teal-500'
                    } focus:outline-none focus:ring-2 focus:ring-teal-500/20`}
                  >
                    <option value="all">Any Rating</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.0">4.0+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                    <option value="3.0">3.0+ Stars</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className={`block text-sm font-medium mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`w-full p-3 rounded-xl border transition-all duration-200 ${
                      theme === 'dark' 
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-teal-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-teal-500'
                    } focus:outline-none focus:ring-2 focus:ring-teal-500/20`}
                  >
                    <option value="relevance">Most Relevant</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price">Lowest Price</option>
                    <option value="distance">Nearest First</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Searching...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaSearch className="text-red-500 text-xl" />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Search Error
                </h3>
                <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'} mb-4`}>
                  {error}
                </p>
                <button
                  onClick={handleRefresh}
                  className="px-6 py-3 bg-teal-500 text-white rounded-xl font-medium hover:bg-teal-600 transition-colors duration-200"
                >
                  Try Again
                </button>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaSearch className="text-gray-400 text-xl" />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  No Results Found
                </h3>
                <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'} mb-4`}>
                  Try adjusting your search terms or filters
                </p>
              </div>
            ) : (
              <ProfessionalResultsGrid 
                results={filteredResults}
                viewMode={viewMode}
                theme={theme}
                onResultSelect={handleResultSelect}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Professional Results Grid Component
const ProfessionalResultsGrid = ({ results, viewMode, theme, onResultSelect }) => {
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

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {results.map((item, index) => (
          <div
            key={index}
            onClick={() => onResultSelect(item)}
            className={`group p-6 rounded-2xl border cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
              theme === 'dark' 
                ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600 backdrop-blur-xl' 
                : 'bg-white/80 border-gray-200/50 hover:border-gray-300 backdrop-blur-xl'
            }`}
          >
            <div className="flex items-start gap-6">
              {/* Image */}
              <div className="w-24 h-24 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[0].startsWith('http') 
                      ? item.images[0] 
                      : `http://localhost:8000/${item.images[0].replace(/\\/g, "/")}`}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to gradient background if image fails
                      e.target.parentElement.innerHTML = `
                        <div class="w-full h-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
                          ${item.name?.charAt(0) || 'N'}
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
                    {item.name?.charAt(0) || 'N'}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className={`text-xl font-bold mb-1 group-hover:text-teal-500 transition-colors duration-200 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm">
                      <span className={`px-2 py-1 rounded-lg font-medium ${
                        theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {item.type}
                      </span>
                      <div className="flex items-center gap-1">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>
                          {item.location || 'Nepal'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => toggleLike(index, e)}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        likedItems.has(index)
                          ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                          : theme === 'dark' ? 'text-slate-400 hover:text-red-500' : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <FaHeart />
                    </button>
                    <button
                      onClick={(e) => toggleBookmark(index, e)}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        bookmarkedItems.has(index)
                          ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : theme === 'dark' ? 'text-slate-400 hover:text-blue-500' : 'text-gray-400 hover:text-blue-500'
                      }`}
                    >
                      <FaBookmark />
                    </button>
                  </div>
                </div>

                <p className={`text-sm mb-4 line-clamp-2 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                  {item.description || 'Discover this amazing destination in Nepal with breathtaking views and unforgettable experiences.'}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-500" />
                    <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {item.rating}
                    </span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                      ({item.reviews} reviews)
                    </span>
                  </div>
                  
                  <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                    {item.distance}km away
                  </div>
                  
                  <div className={`font-bold text-lg ${theme === 'dark' ? 'text-teal-400' : 'text-teal-600'}`}>
                    ${item.price}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Grid View
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {results.map((item, index) => (
        <div
          key={index}
          onClick={() => onResultSelect(item)}
          className={`group relative overflow-hidden rounded-2xl border cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
            theme === 'dark' 
              ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600 backdrop-blur-xl' 
              : 'bg-white/80 border-gray-200/50 hover:border-gray-300 backdrop-blur-xl'
          }`}
        >
          {/* Image Section */}
          <div className="relative h-48 overflow-hidden">
            {item.images && item.images.length > 0 ? (
              <img
                src={item.images[0].startsWith('http') 
                  ? item.images[0] 
                  : `http://localhost:8000/${item.images[0].replace(/\\/g, "/")}`}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to gradient background if image fails
                  e.target.parentElement.innerHTML = `
                    <div class="w-full h-full bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 flex items-center justify-center text-white text-4xl font-bold">
                      ${item.name?.charAt(0) || 'N'}
                    </div>
                  `;
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 flex items-center justify-center text-white text-4xl font-bold">
                {item.name?.charAt(0) || 'N'}
              </div>
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={(e) => toggleLike(index, e)}
                className={`p-2 rounded-full backdrop-blur-xl transition-all duration-200 ${
                  likedItems.has(index)
                    ? 'bg-red-500 text-white'
                    : 'bg-white/20 text-white hover:bg-red-500'
                }`}
              >
                <FaHeart />
              </button>
              <button
                onClick={(e) => toggleBookmark(index, e)}
                className={`p-2 rounded-full backdrop-blur-xl transition-all duration-200 ${
                  bookmarkedItems.has(index)
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/20 text-white hover:bg-blue-500'
                }`}
              >
                <FaBookmark />
              </button>
            </div>

            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-xl text-white text-xs font-medium rounded-full">
                {item.type}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            <div className="mb-3">
              <h3 className={`text-lg font-bold mb-2 group-hover:text-teal-500 transition-colors duration-200 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {item.name}
              </h3>
              
              <div className="flex items-center gap-1 mb-2">
                <FaMapMarkerAlt className="text-gray-400 text-sm" />
                <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                  {item.location || 'Nepal'}
                </span>
              </div>
            </div>

            <p className={`text-sm mb-4 line-clamp-2 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
              {item.description || 'Discover this amazing destination in Nepal with breathtaking views and unforgettable experiences.'}
            </p>

            {/* Stats Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-500 text-sm" />
                <span className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {item.rating}
                </span>
                <span className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                  ({item.reviews})
                </span>
              </div>
              
              <div className={`font-bold ${theme === 'dark' ? 'text-teal-400' : 'text-teal-600'}`}>
                ${item.price}
              </div>
            </div>

            {/* Distance */}
            <div className={`text-xs mt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
              {item.distance}km away
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};