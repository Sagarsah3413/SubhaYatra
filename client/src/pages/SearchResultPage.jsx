import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function SearchResultPage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const query = new URLSearchParams(useLocation().search).get("query");

  useEffect(() => {
    if (!query) {
      setError("No query provided");
      return;
    }

    const fetchResult = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/search/?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error("Failed to fetch search results");
        const data = await res.json();

        if (Array.isArray(data.results) && data.results.length > 0) {
          setResult(data.results[0]); // Take the first matching result
        } else {
          setResult("not-found");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchResult();
  }, [query]);

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

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
      {result.images && result.images.length > 0 && (
        <div className="flex gap-3 overflow-x-auto mb-4">
          {result.images.map((img, idx) => (
            <img
              key={idx}
              src={`http://127.0.0.1:8000/${img.replace(/\\/g, "/")}`}
              className="w-40 h-32 object-cover rounded-lg"
              alt={result.name}
            />
          ))}
        </div>
      )}

      <p className="text-lg text-gray-700 mb-2">{result.description || "No description available."}</p>
      <p className="text-gray-500 mb-4">Location: {result.location || "Unknown"}</p>

      {result.wikipedia_url && (
        <a
          href={result.wikipedia_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          Read more on Wikipedia
        </a>
      )}
    </div>
  );
}
