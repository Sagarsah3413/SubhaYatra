import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function Searchbar() {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim() === "") return;
    alert(`Searching for: ${query}`);
  };

  return (
    <div className="flex items-center justify-center mt-6">
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
    </div>
  );
}
