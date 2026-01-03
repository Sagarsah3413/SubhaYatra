import { useTheme } from "../contexts/ThemeContext";
import SearchResultCard from "../pages/SearchResultCard";

export default function SearchResultsList({ 
  results = [], 
  isLoading = false, 
  error = null, 
  query = "",
  className = "",
  onResultSelect = null 
}) {
  const { theme } = useTheme();

  return (
    <div className={`p-4 ${className}`}>
      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Loading...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error: {error}</p>
            <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Please try again</p>
          </div>
        </div>
      )}

      {/* No results state */}
      {!isLoading && !error && results.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              No Results Found
            </p>
            <p className={theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}>
              {query ? `No results found for "${query}"` : "Start searching to discover destinations"}
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      {!isLoading && !error && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((item, index) => (
            <SearchResultCard
              key={`${item.name}-${index}`}
              item={item}
              onSelect={onResultSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}