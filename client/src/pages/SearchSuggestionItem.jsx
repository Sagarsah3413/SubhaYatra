import React from "react";

export default function SearchSuggestionItem({ item, onSelect }) {
  return (
    <li
      onClick={() => onSelect(item)}
      className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-lg"
    >
      {item.name}
    </li>
  );
}
