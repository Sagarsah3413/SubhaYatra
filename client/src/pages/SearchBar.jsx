import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

export default function Searchbar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // 🔍 Fetch live suggestions while typing
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`http://127.0.0.1:8000/search/suggestions?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error("Failed to fetch suggestions");
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Suggestion error:", err);
        setSuggestions([]);
      }
    };

    const delayDebounce = setTimeout(fetchSuggestions, 200); // ⏱ small delay for better UX
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSearch = async () => {
    if (query.trim() === "") return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      console.log("Search results:", data);
      alert(`Found ${data.length} results (see console).`);
      setSuggestions([]); // hide suggestions after search
    } catch (error) {
      console.error(error);
      alert("Error during search");
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setQuery(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-6 relative">
      <div className="flex items-center border border-gray-400 rounded-full overflow-hidden w-[600px] shadow-md bg-white transition-all duration-300 hover:shadow-lg">
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

      {/* 🔽 Suggestion Dropdown */}
      {suggestions.length > 0 && (
        <ul className="absolute top-[70px] bg-white border border-gray-200 w-[600px] rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => handleSelectSuggestion(s)}
              className="px-5 py-2 cursor-pointer hover:bg-pink-100 text-gray-700 text-lg"
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
