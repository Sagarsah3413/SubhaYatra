import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

export default function SearchBar({ placeholder }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Determine category from placeholder
  const getCategory = () => {
    if (!placeholder) return "all";
    if (placeholder.toLowerCase().includes("hotel")) return "hotel";
    if (placeholder.toLowerCase().includes("restaurant")) return "restaurant";
    if (placeholder.toLowerCase().includes("things to do")) return "attraction";
    return "all";
  };

  const category = getCategory();

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://127.0.0.1:8000/search/?q=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        setLoading(false);

        const filteredResults = [];
        if (category === "all" || category === "hotel") {
          filteredResults.push(...data.hotels.map(h => ({ type: "Hotel", name: h })));
        }
        if (category === "all" || category === "restaurant") {
          filteredResults.push(...data.restaurants.map(r => ({ type: "Restaurant", name: r })));
        }
        if (category === "all" || category === "attraction") {
          filteredResults.push(...data.attractions.map(a => ({ type: "Attraction", name: a })));
        }

        setResults(filteredResults);
      } catch (error) {
        console.error("Error fetching:", error);
        setLoading(false);
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, category]);

  const handleSelect = (item) => {
    setQuery(item.name);
    setResults([]);
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    alert(`You searched for: "${query}"`);
    setResults([]);
  };

  return (
    <div className="relative w-[600px] mt-6 mx-auto">
      {/* Search bar */}
      <div className="flex border border-gray-400 rounded-full shadow-md bg-white w-full overflow-hidden">
        <div className="flex items-center px-4">
          <FaSearch className="text-gray-500 text-lg" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || "Search everything..."}
          className="flex-grow px-4 py-3 outline-none text-gray-700 text-lg"
        />

        <button
          onClick={handleSearch}
          className="px-6 bg-black text-white hover:bg-gray-900 transition-all text-lg font-medium"
          style={{ borderTopRightRadius: "9999px", borderBottomRightRadius: "9999px" }}
        >
          Search
        </button>
      </div>

      {/* Dropdown suggestions */}
      {results.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-20">
          {results.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelect(item)}
              className="px-5 py-2 cursor-pointer hover:bg-pink-100 text-gray-700 text-lg"
            >
              <span className="font-semibold">{item.type}:</span> {item.name}
            </li>
          ))}
        </ul>
      )}

      {/* Loading */}
      {loading && (
        <p className="text-gray-500 mt-2 text-center">Loading...</p>
      )}
    </div>
  );
}
