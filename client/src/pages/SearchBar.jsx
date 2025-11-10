import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

export default function Searchbar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://127.0.0.1:8000/search/?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setLoading(false);

        // Merge all results into a single array
        const merged = [
          ...data.hotels.map(h => `Hotel: ${h}`),
          ...data.restaurants.map(r => `Restaurant: ${r}`),
          ...data.attractions.map(a => `Attraction: ${a}`)
        ];

        setSuggestions(merged);
      } catch (err) {
        console.error("Fetch error:", err);
        setLoading(false);
        setSuggestions([]);
      }
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelect = (item) => {
    setQuery(item);
    setSuggestions([]);
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    alert(`You searched for: "${query}"`);
    setSuggestions([]);
  };

  return (
    <div className="relative w-[600px] mt-6 mx-auto">
      <div className="flex items-center border border-gray-400 rounded-full overflow-hidden shadow-md bg-white w-full">
        <FaSearch className="ml-4 text-gray-500 text-lg" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your search here..."
          className="flex-grow px-4 py-3 outline-none text-gray-700 text-lg"
        />
        <button
          onClick={handleSearch}
          className="px-6 bg-black text-white rounded-r-md hover:bg-gray-900 transition"
        >
          Search
        </button>
      </div>

      {/* Dropdown suggestions */}
      {suggestions.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-20">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => handleSelect(s)}
              className="px-5 py-2 cursor-pointer hover:bg-pink-100 text-gray-700 text-lg"
            >
              {s}
            </li>
          ))}
        </ul>
      )}

      {loading && <p className="text-gray-500 mt-2">Loading...</p>}
    </div>
  );
}
