import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function SearchResultPage() {
  const [result, setResult] = useState(null);
  const query = new URLSearchParams(useLocation().search).get("query");

  useEffect(() => {
    const fetchResult = async () => {
      const res = await fetch(`http://127.0.0.1:8000/api/search/?q=${query}`);
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        setResult(data.results[0]);
      } else {
        setResult("not-found");
      }
    };

    fetchResult();
  }, [query]);

  if (result === null) {
    return <p className="text-center mt-10 text-xl">Loading...</p>;
  }

  if (result === "not-found") {
    return (
      <p className="text-center mt-10 text-xl text-red-500">
        No results found for "{query}"
      </p>
    );
  }

  return (
    <div className="w-[700px] mx-auto mt-10 bg-white p-5 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-4">{result.name}</h1>

      {/* Image Gallery */}
      <div className="flex gap-3 overflow-x-auto mb-4">
        {result.images &&
          result.images.map((img, idx) => (
            <img
              key={idx}
              src={`http://127.0.0.1:8000/${img.replace(/\\/g, "/")}`}
              className="w-40 h-32 object-cover rounded-lg"
              alt={result.name}
            />
          ))}
      </div>

      <p className="text-lg text-gray-700 mb-2">{result.description}</p>
      <p className="text-gray-500">Location: {result.location}</p>
    </div>
  );
}
