import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Components
import { Header } from "../components/header/Header";
import Footer from "../components/footer/Footer";

export default function RecommendationResults() {
  const location = useLocation();
  const navigate = useNavigate();

  // 👇 Get preferences safely
  const preferences = location.state?.preferences;

  // 🔒 Prevent direct access
  useEffect(() => {
    if (!preferences) {
      navigate("/recommendation");
    }
  }, [preferences, navigate]);

  if (!preferences) return null;

  // 🧪 MOCK DATA (replace later with backend API)
  const destinations = [
    {
      id: 1,
      name: "Pokhara",
      type: "⛰️ Natural Attractions",
      description: "Beautiful lakes, mountains, and peaceful vibes.",
    },
    {
      id: 2,
      name: "Annapurna Base Camp",
      type: "🧗 Trekking & Adventures",
      description: "One of the most popular trekking destinations.",
    },
    {
      id: 3,
      name: "Lumbini",
      type: "🛕 Cultural & Religious Sites",
      description: "Birthplace of Lord Buddha.",
    },
    {
      id: 4,
      name: "Bandipur",
      type: "🏡 Village & Rural Tourism",
      description: "Traditional village with mountain views.",
    },
    {
      id: 5,
      name: "Kathmandu",
      type: "🏙️ Urban & Modern Attractions",
      description: "Capital city with culture, food, and nightlife.",
    },
  ];

  // 🔍 Filter based on user trip type
  const recommendedPlaces = destinations.filter(
    (place) => place.type === preferences.tripType
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header onHomeClick={() => navigate(-1)} />

      {/* Title */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-6">
        <h1 className="text-center text-2xl font-bold">
          🌍 Your Travel Recommendations
        </h1>
        <p className="text-center text-sm opacity-90 mt-1">
          Based on your preferences, {preferences.name}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-5xl mx-auto px-4 py-8">
        {recommendedPlaces.length === 0 ? (
          <p className="text-center text-gray-600">
            No recommendations found for your selection 😕
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendedPlaces.map((place) => (
              <div
                key={place.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold text-gray-800">
                  {place.name}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {place.type}
                </p>
                <p className="text-gray-600 mt-3">
                  {place.description}
                </p>

                <button
                  className="mt-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
