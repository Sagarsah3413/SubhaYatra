import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

// Components
import { Header } from "../components/header/Header";
import Footer from "../components/footer/Footer";

export default function RecommendationResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();

  // 👇 Get preferences safely
  const preferences = location.state?.preferences;

  // 🔒 Prevent direct access
  useEffect(() => {
    if (!preferences) {
      navigate("/recommendation");
    }
  }, [preferences, navigate]);

  if (!preferences) return null;

  // Format trip duration for display
  const formatTripDuration = (duration) => {
    const durationMap = {
      "1-3": "1-3 Days",
      "4-7": "4-7 Days",
      "8-14": "8-14 Days",
      "15+": "15+ Days"
    };
    return durationMap[duration] || duration;
  };

  // 🧪 MOCK DATA (replace later with backend API)
  const destinations = [
    {
      id: 1,
      name: "Pokhara",
      type: "⛰️ Natural Attractions",
      description: "Beautiful lakes, mountains, and peaceful vibes.",
      image: "🏞️",
      rating: 4.8,
      duration: "2-3 days recommended"
    },
    {
      id: 2,
      name: "Annapurna Base Camp",
      type: "🧗 Trekking & Adventures",
      description: "One of the most popular trekking destinations.",
      image: "⛰️",
      rating: 4.9,
      duration: "7-12 days recommended"
    },
    {
      id: 3,
      name: "Lumbini",
      type: "🛕 Cultural & Religious",
      description: "Birthplace of Lord Buddha.",
      image: "🛕",
      rating: 4.7,
      duration: "1-2 days recommended"
    },
    {
      id: 4,
      name: "Bandipur",
      type: "🏡 Village & Rural",
      description: "Traditional village with mountain views.",
      image: "🏡",
      rating: 4.6,
      duration: "2-3 days recommended"
    },
    {
      id: 5,
      name: "Kathmandu",
      type: "🏙️ Urban & Modern",
      description: "Capital city with culture, food, and nightlife.",
      image: "🏙️",
      rating: 4.5,
      duration: "3-5 days recommended"
    },
  ];

  // 🔍 Filter based on user trip type
  const recommendedPlaces = destinations.filter(
    (place) => place.type === preferences.tripType
  );

  return (
    <div className={`min-h-screen flex flex-col ${
      theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100'
    }`}>
      <Header onHomeClick={() => navigate(-1)} />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 80% 50%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)`,
            backgroundSize: '800px 800px'
          }}></div>
        </div>

        <div className={`relative py-8 px-4 ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-slate-800/50 via-slate-900/50 to-slate-800/50' 
            : 'bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-emerald-500/10'
        }`}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 mb-3">
                <span className="text-xl">✨</span>
                <span className={`text-sm font-semibold ${
                  theme === 'dark' ? 'text-teal-400' : 'text-teal-600'
                }`}>
                  Personalized for You
                </span>
              </div>
              
              <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Your Perfect
                <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent"> Nepal Itinerary</span>
              </h1>
              
              <p className={`text-base ${
                theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
              }`}>
                Curated recommendations for {preferences.name}
              </p>
            </div>

            {/* Preferences Summary Card */}
            <div className={`rounded-2xl shadow-xl overflow-hidden max-w-3xl mx-auto ${
              theme === 'dark' 
                ? 'bg-slate-800/50 border border-slate-700/50' 
                : 'bg-white/80 border border-white/50'
            } backdrop-blur-xl`}>
              <div className="p-6">
                <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
                }`}>
                  <span>📋</span>
                  <span>Your Trip Details</span>
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className={`p-3 rounded-xl ${
                    theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-50'
                  }`}>
                    <div className={`text-xs mb-1 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                    }`}>
                      Travellers
                    </div>
                    <div className={`text-lg font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {preferences.travellers} {preferences.travellers === '1' ? 'person' : 'people'}
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl ${
                    theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-50'
                  }`}>
                    <div className={`text-xs mb-1 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                    }`}>
                      Duration
                    </div>
                    <div className={`text-lg font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {formatTripDuration(preferences.tripDuration)}
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl ${
                    theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-50'
                  }`}>
                    <div className={`text-xs mb-1 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                    }`}>
                      Age
                    </div>
                    <div className={`text-lg font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {preferences.age} years
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl ${
                    theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-50'
                  }`}>
                    <div className={`text-xs mb-1 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                    }`}>
                      Trip Type
                    </div>
                    <div className={`text-sm font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {preferences.tripType?.split(' ')[0]}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-5xl mx-auto px-4 py-12">
        {recommendedPlaces.length === 0 ? (
          <div className={`text-center py-12 rounded-2xl ${
            theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/80'
          } backdrop-blur-xl`}>
            <div className="text-6xl mb-4">😕</div>
            <p className={`text-lg ${
              theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
            }`}>
              No recommendations found for your selection
            </p>
            <button
              onClick={() => navigate("/recommendation")}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Try Different Preferences
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Recommended Destinations
              </h2>
              <p className={`text-sm mt-1 ${
                theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
              }`}>
                {recommendedPlaces.length} perfect {recommendedPlaces.length === 1 ? 'match' : 'matches'} for your {formatTripDuration(preferences.tripDuration).toLowerCase()} trip
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendedPlaces.map((place) => (
                <div
                  key={place.id}
                  className={`rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
                    theme === 'dark' 
                      ? 'bg-slate-800/50 border border-slate-700/50' 
                      : 'bg-white/80 border border-white/50'
                  } backdrop-blur-xl`}
                >
                  {/* Image Placeholder */}
                  <div className={`h-48 flex items-center justify-center text-7xl ${
                    theme === 'dark' ? 'bg-slate-900/50' : 'bg-gradient-to-br from-teal-50 to-cyan-50'
                  }`}>
                    {place.image}
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`text-xl font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {place.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className={`text-sm font-semibold ${
                          theme === 'dark' ? 'text-slate-300' : 'text-gray-700'
                        }`}>
                          {place.rating}
                        </span>
                      </div>
                    </div>

                    <div className={`text-sm mb-3 flex items-center gap-2 ${
                      theme === 'dark' ? 'text-teal-400' : 'text-teal-600'
                    }`}>
                      <span>{place.type}</span>
                    </div>

                    <p className={`text-sm mb-4 ${
                      theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
                    }`}>
                      {place.description}
                    </p>

                    <div className={`text-xs mb-4 flex items-center gap-2 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                    }`}>
                      <span>📅</span>
                      <span>{place.duration}</span>
                    </div>

                    <button
                      className="w-full bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 hover:from-teal-700 hover:via-cyan-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 flex items-center justify-center gap-2"
                    >
                      <span>View Details</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/recommendation")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-slate-800 text-white border border-slate-700 hover:bg-slate-700'
                    : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
                } shadow-lg hover:shadow-xl`}
              >
                ← Modify Preferences
              </button>
              
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                Explore More Destinations
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}