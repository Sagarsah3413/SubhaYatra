import React from "react";
import SearchResult from "./SearchResult";

export default function SearchResultList({ results, onSelect }) {
  return (
    <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-20">
      {results.map((item, index) => (
        <SearchResult key={index} item={item} onSelect={onSelect} />
      ))}
    </ul>
  );
}
