import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import SearchResultsList from "../components/SearchResultsList";

export default function SearchResultPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State management
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get query from URL
  const query = new URLSearchParams(location.search).get("query");

  console.log('SearchResultPage rendered with query:', query);

  // Search function
  const performSearch = async (searchQuery) => {
    if (!searchQuery) {
      setError("No search query provided");
      setIsLoading(false);
      return;
    }

    console.log('Performing search for:', searchQuery);
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await fetch(
        `http://localhost:8000/api/search/?q=${encodeURIComponent(searchQuery)}`
      );
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to fetch search results`);
      }
      
      const data = await res.json();
      console.log('Search API response:', data);
      
      if (data.results && Array.isArray(data.results)) {
        setResults(data.results);
        console.log('Set results:', data.results);
      } else {
        setResults([]);
        console.log('No results in API response');
      }
      
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial search effect
  useEffect(() => {
    console.log('useEffect triggered with query:', query);
    performSearch(query);
  }, [query]);

  // Handle result selection
  const handleResultSelect = (item) => {
    console.log('Result selected:', item);
    navigate(`/details?type=${item.type}&name=${encodeURIComponent(item.name)}`);
  };

  return (
    <div className={`min-h-screen p-4 ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {/* Simple Header */}
      <div className={`p-6 rounded-lg mb-6 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} shadow-md`}>
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            ← Back
          </button>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Search Results Page
          </h1>
        </div>
        
        <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
          <p>Query: {query || 'None'}</p>
          <p>Results: {results.length}</p>
          <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
          <p>Error: {error || 'None'}</p>
        </div>
      </div>

      {/* Search Results */}
      <SearchResultsList
        results={results}
        isLoading={isLoading}
        error={error}
        query={query}
        onResultSelect={handleResultSelect}
      />
    </div>
  );
}