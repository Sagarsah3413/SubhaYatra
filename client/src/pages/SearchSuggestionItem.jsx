import React from "react";
import { useNavigate } from "react-router-dom";

export default function SearchSuggestionItem({ item }) {
  const navigate = useNavigate();

  const handleClick = () => {
    // Redirect to detail page
    navigate(`/details?type=${item.type}&name=${encodeURIComponent(item.name)}`);
  };

  return (
    <li
      onClick={handleClick}
      className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-lg"
    >
      {item.name}
    </li>
  );
}
