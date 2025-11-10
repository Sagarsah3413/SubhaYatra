import React from "react";

export default function SearchResult({ item, onSelect }) {
  return (
    <li
      onClick={() => onSelect(item)}
      className="px-5 py-2 cursor-pointer hover:bg-pink-100 text-gray-700 text-lg"
    >
      <span className="font-semibold">{item.type}:</span> {item.name}
    </li>
  );
}
