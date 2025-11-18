import React from "react";
import SearchSuggestionItem from "./SearchSuggestionItem";

export default function SearchResultList({ results, onSelect }) {
  return (
    <ul className="absolute bg-white w-full shadow-lg rounded-lg mt-2 max-h-60 overflow-y-auto z-20">
      {results.map((item, index) => (
        <SearchSuggestionItem key={index} item={item} onSelect={onSelect} />
      ))}
    </ul>
  );
}
