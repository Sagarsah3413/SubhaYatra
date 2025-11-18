import React from "react";

export default function SearchResultCard({ item }) {
  if (!item) return null;

  return (
    <div className="mt-4 p-4 border rounded-xl shadow-lg bg-white w-[600px] mx-auto">
      {/* Image Gallery */}
      <div className="flex gap-2 overflow-x-auto mb-4">
        {item.images &&
          item.images.map((img, idx) => (
            <img
              key={idx}
              src={`http://127.0.0.1:8000/${img}`} // <-- frontend fetches from backend static path
              alt={item.name}
              className="w-32 h-32 object-cover rounded-lg"
            />
          ))}
      </div>

      {/* Info */}
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-gray-800">{item.name}</h2>
        <p className="text-gray-500">{item.location}</p>
        <p className="text-gray-700 mt-2">{item.description}</p>
        {item.tags && (
          <p className="text-sm text-gray-400 mt-2">Tags: {item.tags}</p>
        )}
      </div>
    </div>
  );
}
