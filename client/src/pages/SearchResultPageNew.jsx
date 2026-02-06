import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import SmartImage from "../components/SmartImage";
import { FaArrowLeft, FaSearch, FaSpinner, FaMapMarkerAlt } from "react-icons/fa";

export default function SearchResultPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchStats, setSearchStats] = useState(null);
  
  // Get query from URL
  const query = new URLSearchParams(location.search).get("q") || "";
  
  console.log('SearchResultPage loaded');
  console.log('Query:', query);

  const performSearch = async (searchQuery) => {
    if (!searchQuery) {
      setError("No search query provided");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Calling API for:', searchQuery, '(unlimited results)');
      
      // Call API without any limit
      const response = await fetch(`http://localhost:8000/api/places/search?q=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.results && Array.isArray(data.results)) {
        // Normalize image data for each result
        const normalizedResults = data.results.map(item => {
          // Ensure the item has proper image data structure
          if (!item.all_images || !Array.isArray(item.all_images)) {
            item.all_images = [];
          }
          
          // If image_url is null or empty, ensure it's properly set
          if (!item.image_url || item.image_url === 'null' || item.image_url.trim() === '') {
            item.image_url = null;
          }
          
          return item;
        });
        
        setResults(normalizedResults);
        setSearchStats({
          query: searchQuery,
          count: data.count,
          unlimited: data.unlimited || false
        });
        console.log('Set results:', normalizedResults.length, 'items (unlimited)');
        
        // Log items that need AI images
        const needsAI = normalizedResults.filter(item => 
          (!item.all_images || item.all_images.length === 0) && 
          (!item.image_url || item.image_url === null)
        );
        console.log(`Items needing AI images: ${needsAI.length}/${normalizedResults.length}`, 
          needsAI.map(item => `${item.name} (${item.type})`));
        
        // Log breakdown by type
        const typeBreakdown = needsAI.reduce((acc, item) => {
          const type = item.type || 'unknown';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});
        console.log('AI image needs by type:', typeBreakdown);
      } else {
        setResults([]);
        setSearchStats(null);
        console.log('No results found');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('useEffect triggered, query:', query);
    if (query) {
      performSearch(query);
    }
  }, [query]);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Enhanced Header */}
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg p-4`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaArrowLeft />
              Back
            </button>
            
            <div className="flex items-center gap-3">
              <FaSearch className="text-blue-500 text-xl" />
              <h1 className="text-2xl font-bold">Search Results</h1>
              {query && <span className="text-lg text-gray-500">for "{query}"</span>}
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-500">Unlimited Search</div>
              <div className="text-xs text-green-600">All matching results shown</div>
            </div>
          </div>
          
          {/* Search Stats */}
          {searchStats && (
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <div className="flex items-center gap-4">
                <span>
                  Found <span className="font-bold text-blue-600 text-lg">{searchStats.count}</span> results
                </span>
                {searchStats.unlimited && (
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full font-medium">
                    ✓ All Results Shown
                  </span>
                )}
              </div>
              <div className="text-xs">
                Sorted by relevance • No limits applied
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <FaSpinner className="text-5xl text-blue-500 animate-spin mx-auto mb-6" />
              <p className="text-xl">Searching through all destinations...</p>
              <p className="text-sm text-gray-500 mt-2">Finding every match for "{query}"</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-xl mb-4">Error: {error}</p>
            <button
              onClick={() => performSearch(query)}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <FaSearch className="text-6xl text-gray-400 mx-auto mb-4" />
            <p className="text-2xl mb-4">No results found for "{query}"</p>
            <p className="text-gray-500">Try a different search term or check your spelling</p>
          </div>
        ) : (
          <>
            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map((item, index) => (
                <ResultCard 
                  key={index} 
                  item={item} 
                  index={index}
                  theme={theme}
                  navigate={navigate}
                />
              ))}
            </div>
            
            {/* Results Summary */}
            <div className="mt-12 text-center p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <h3 className="text-lg font-bold mb-2">Search Complete</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Showing all <span className="font-bold text-blue-600">{results.length}</span> results 
                matching "{query}" • No results hidden or limited
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Enhanced Result Card Component with SmartImage
const ResultCard = ({ item, index, theme, navigate }) => {
  return (
    <div
      className={`group p-6 rounded-xl border ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300'
      } hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 relative`}
      onClick={() => navigate(`/details?type=Place&name=${encodeURIComponent(item.name)}`)}
    >
      {/* Relevance Score Badge */}
      {item.relevance_score && (
        <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg z-10">
          {item.relevance_score}% match
        </div>
      )}
      
      {/* Smart Image with automatic fallbacks */}
      <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
        <SmartImage
          item={item}
          className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
          style={{ width: '100%', height: '100%' }}
          enableAI={true}
          showLoader={true}
          eager={true}
        />
      </div>
      
      {/* Content */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold line-clamp-2 group-hover:text-blue-600 transition-colors">
          {item.name}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <FaMapMarkerAlt className="text-red-500 flex-shrink-0" />
          <span className="line-clamp-1">{item.location}</span>
        </div>
        
        <p className="text-sm line-clamp-3 text-gray-700 dark:text-gray-300 leading-relaxed">
          {item.description || 'Discover this amazing destination in Nepal.'}
        </p>
        
        <div className="flex items-center justify-between pt-2">
          {item.type && (
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full font-medium">
              {item.type.replace(/_/g, ' ')}
            </span>
          )}
          
          {item.province && (
            <span className="text-xs text-gray-500 font-medium">
              Province {item.province}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};