import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

// Components
import { Header } from "../components/header/Header";
import Footer from "../components/footer/Footer";

export default function RecommendationResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();

  // State for recommendations
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testingConnection, setTestingConnection] = useState(false);

  // Test backend connection
  const testBackendConnection = async () => {
    setTestingConnection(true);
    try {
      const response = await fetch('http://localhost:8000/api/recommendations/stats');
      if (response.ok) {
        const data = await response.json();
        alert(`✅ Backend is connected!\n\nTotal recommendations in database: ${data.stats.total_recommendations}`);
      } else {
        alert(`❌ Backend responded with error: ${response.status}`);
      }
    } catch (err) {
      alert(`❌ Cannot connect to backend!\n\nError: ${err.message}\n\nMake sure backend is running on port 8000.`);
    } finally {
      setTestingConnection(false);
    }
  };

  // � Get preferences safely
  const preferences = location.state?.preferences;

  // �🔒 Prevent direct access
  useEffect(() => {
    if (!preferences) {
      navigate("/recommendation");
    }
  }, [preferences, navigate]);

  // Scroll to top when component mounts or when returning from detail view
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch recommendations from backend
  useEffect(() => {
    if (!preferences) return;

    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://localhost:8000/api/recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: preferences.name,
            age: preferences.age,
            phone: preferences.phone,
            travellers: preferences.travellers,
            tripDuration: preferences.tripDuration,
            tripTypes: preferences.tripTypes || [preferences.tripType],
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }

        const data = await response.json();
        
        console.log('✅ Received recommendations:', data.total_matches);
        console.log('First 3 places with images:');
        data.recommendations.slice(0, 3).forEach((place, i) => {
          console.log(`${i + 1}. ${place.name}`);
          console.log(`   Image: ${place.image || 'No image'}`);
          if (place.image) {
            console.log(`   Full URL: http://localhost:8000${place.image}`);
          }
        });
        
        if (data.success && data.recommendations) {
          setRecommendations(data.recommendations);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        console.error('Error details:', {
          message: err.message,
          stack: err.stack,
          preferences: preferences
        });
        setError(err.message || 'Failed to fetch recommendations. Please check if backend is running on port 8000.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [preferences]);

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

  // Use recommendations from backend
  const recommendedPlaces = recommendations;

  return (
    <div className={`min-h-screen flex flex-col ${
      theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100'
    }`}>
      <Header onHomeClick={() => navigate(-1)} />

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20">
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
                      Trip Types
                    </div>
                    <div className={`text-sm font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {Array.isArray(preferences.tripTypes) 
                        ? preferences.tripTypes.map(t => t.split(' ')[0]).join(' ')
                        : preferences.tripType?.split(' ')[0]}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-5xl mx-auto px-4 pt-24 pb-12">
        {loading ? (
          <div className={`text-center py-12 rounded-2xl ${
            theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/80'
          } backdrop-blur-xl`}>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
              <p className={`text-lg ${
                theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
              }`}>
                Finding perfect destinations for you...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className={`text-center py-12 rounded-2xl ${
            theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/80'
          } backdrop-blur-xl`}>
            <div className="text-6xl mb-4">⚠️</div>
            <p className={`text-lg mb-2 ${
              theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
            }`}>
              Oops! Something went wrong
            </p>
            <p className={`text-sm mb-6 ${
              theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
            }`}>
              {error}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={testBackendConnection}
                disabled={testingConnection}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
              >
                {testingConnection ? 'Testing...' : '🔍 Test Backend Connection'}
              </button>
              <button
                onClick={() => navigate("/recommendation")}
                className="px-6 py-3 bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : recommendedPlaces.length === 0 ? (
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
                  {/* Image */}
                  <div className={`h-48 relative overflow-hidden ${
                    theme === 'dark' ? 'bg-slate-900/50' : 'bg-gradient-to-br from-teal-50 to-cyan-50'
                  }`}>
                    {place.image ? (
                      <img 
                        src={`http://localhost:8000${place.image}`}
                        alt={place.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          console.log(`Failed to load image for ${place.name}:`, place.image);
                          // Fallback to icon if image fails to load
                          e.target.style.display = 'none';
                          if (!e.target.parentElement.querySelector('.fallback-icon')) {
                            e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                            const icon = document.createElement('div');
                            icon.className = 'text-7xl fallback-icon';
                            icon.textContent = place.type?.includes('Natural') ? '🏞️' : 
                                             place.type?.includes('Trekking') ? '⛰️' :
                                             place.type?.includes('Cultural') ? '🛕' :
                                             place.type?.includes('Village') ? '🏡' :
                                             place.type?.includes('Urban') ? '🏙️' : '📍';
                            e.target.parentElement.appendChild(icon);
                          }
                        }}
                        onLoad={(e) => {
                          console.log(`✅ Loaded image for ${place.name}`);
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-7xl">
                        {place.type?.includes('Natural') ? '🏞️' : 
                         place.type?.includes('Trekking') ? '⛰️' :
                         place.type?.includes('Cultural') ? '🛕' :
                         place.type?.includes('Village') ? '🏡' :
                         place.type?.includes('Urban') ? '🏙️' : '📍'}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className={`text-xl font-bold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {place.name}
                        </h3>
                        {place.location && (
                          <p className={`text-xs mt-1 flex items-center gap-1 ${
                            theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                          }`}>
                            <span>📍</span>
                            <span>{place.location}</span>
                          </p>
                        )}
                        {place.is_versatile && (
                          <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30">
                            <svg className="w-3 h-3 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className={`text-xs font-semibold ${
                              theme === 'dark' ? 'text-teal-400' : 'text-teal-600'
                            }`}>
                              Versatile Match
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <span className="text-yellow-500">⭐</span>
                        <span className={`text-sm font-semibold ${
                          theme === 'dark' ? 'text-slate-300' : 'text-gray-700'
                        }`}>
                          {place.rating?.toFixed(1) || '4.0'}
                        </span>
                      </div>
                    </div>

                    <div className={`text-sm mb-3 flex flex-wrap items-center gap-2 ${
                      theme === 'dark' ? 'text-teal-400' : 'text-teal-600'
                    }`}>
                      {place.matched_types && place.matched_types.length > 0 ? (
                        place.matched_types.map((type, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1">
                            <span>{type}</span>
                            {idx < place.matched_types.length - 1 && <span className="text-slate-400">•</span>}
                          </span>
                        ))
                      ) : (
                        <span>{place.type}</span>
                      )}
                    </div>

                    <p className={`text-sm mb-3 line-clamp-2 ${
                      theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
                    }`}>
                      {place.description || 'Discover this amazing destination in Nepal'}
                    </p>

                    {/* Tags */}
                    {place.tags && (
                      <div className="mb-3 flex flex-wrap gap-1">
                        {place.tags.split(/[,;]/).slice(0, 3).map((tag, idx) => (
                          <span 
                            key={idx}
                            className={`text-xs px-2 py-1 rounded-full ${
                              theme === 'dark' 
                                ? 'bg-slate-700/50 text-slate-300' 
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="space-y-2 mb-4">
                      {place.duration && (
                        <div className={`text-xs flex items-center gap-2 ${
                          theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                        }`}>
                          <span>📅</span>
                          <span>{place.duration}</span>
                        </div>
                      )}
                      
                      {place.difficulty_level && (
                        <div className={`text-xs flex items-center gap-2 ${
                          theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                        }`}>
                          <span>💪</span>
                          <span>{place.difficulty_level}</span>
                        </div>
                      )}
                      
                      {place.best_season && (
                        <div className={`text-xs flex items-center gap-2 ${
                          theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                        }`}>
                          <span>🌤️</span>
                          <span>Best: {place.best_season}</span>
                        </div>
                      )}
                      
                      {place.match_score && (
                        <div className={`text-xs flex items-center gap-2 ${
                          theme === 'dark' ? 'text-teal-400' : 'text-teal-600'
                        }`}>
                          <span>🎯</span>
                          <span>Match Score: {place.match_score}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        console.log('View Details clicked for place:', place.id, place.name);
                        navigate(`/place/${place.id}`, {
                          state: {
                            fromRecommendations: true,
                            preferences: preferences,
                            recommendations: recommendations
                          }
                        });
                      }}
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