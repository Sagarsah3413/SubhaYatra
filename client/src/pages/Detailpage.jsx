import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function DetailPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const search = new URLSearchParams(useLocation().search);
  const type = search.get("type");
  const name = search.get("name");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/details/${type}/${encodeURIComponent(name)}/`
        );
        if (!res.ok) throw new Error("Failed to fetch details");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchDetails();
  }, [type, name]);

  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!data) return <p className="text-center mt-10 text-xl">Loading...</p>;

  return (
    <div className="w-[90%] max-w-5xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6">{data.name}</h1>

      {/* Flex container: images left, description right */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Images */}
        <div className="md:w-1/2 flex flex-col gap-3">
          {data.images?.map((img, idx) => (
            <img
              key={idx}
              src={`http://127.0.0.1:8000/${img.replace(/\\/g, "/")}`}
              alt={data.name}
              className="w-full h-48 md:h-60 object-cover rounded-lg"
            />
          ))}
        </div>

        {/* Right: Description */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <p className="text-lg text-gray-700">{data.description}</p>
          <p className="text-gray-500">Location: {data.location}</p>
        </div>
      </div>

      {/* Wikipedia link below the images */}
      {data.wikipedia_url && (
        <div className="mt-6 text-center">
          <a
            href={data.wikipedia_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Read more on Wikipedia
          </a>
        </div>
      )}
    </div>
  );
}
