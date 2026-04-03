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

        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/recommendations`, {
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
            travelMonth: preferences.travelMonth, // Added travel month
            tripTypes: preferences.tripTypes || [preferences.tripType],
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('API Error Response:', errorData);
          throw new Error(errorData.error || 'Failed to fetch recommendations');
        }

        const data = await response.json();
        
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
          preferences: preferences,
          errorType: err.name
        });
        
        // Provide more specific error messages
        let errorMessage = err.message;
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
          errorMessage = 'Cannot connect to backend server. Please ensure the backend is running on http://localhost:8000';
        }
        
        setError(errorMessage || 'Failed to fetch recommendations. Please check if backend is running on port 8000.');
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
                      Travel Month
                    </div>
                    <div className={`text-lg font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {preferences.travelMonth || 'Not specified'}
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
                        ? preferences.tripTypes.map(t => {
                            // Remove emoji and get text (e.g., "⛰️ Natural Attractions" -> "Natural Attractions")
                            const parts = t.split(' ');
                            return parts.slice(1).join(' '); // Skip first part (emoji)
                          }).join(', ')
                        : preferences.tripType?.split(' ').slice(1).join(' ')}
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
            <button
              onClick={() => navigate("/recommendation")}
              className="px-6 py-3 bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Try Again
            </button>
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
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Recommended Destinations
              </h2>
              <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                {recommendedPlaces.length} perfect {recommendedPlaces.length === 1 ? 'match' : 'matches'} for your {formatTripDuration(preferences.tripDuration).toLowerCase()} trip
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendedPlaces.map((place) => (
                <RecommendationCard key={place.id} place={place} theme={theme} navigate={navigate} preferences={preferences} recommendations={recommendations} />
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

// ── Recommendation Card with multi-image slider + hotels/restaurants ──────────
const REC_API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function toAbsUrl(path) {
  if (!path || path === 'null') return null;
  const p = path.trim();
  if (p.startsWith('http')) return p;
  // /datasets/... paths — just prepend API base
  if (p.startsWith('/datasets/')) return `${REC_API}${p}`;
  // Legacy /api/images/... paths
  if (p.startsWith('/api/images/destinations/'))
    return `${REC_API}/datasets/destination_images/${p.slice('/api/images/destinations/'.length)}`;
  if (p.startsWith('/api/images/hotels/'))
    return `${REC_API}/datasets/hotel_images/${p.slice('/api/images/hotels/'.length)}`;
  if (p.startsWith('/api/images/restaurants/'))
    return `${REC_API}/datasets/restaurant_images/${p.slice('/api/images/restaurants/'.length)}`;
  if (p.startsWith('destination_images/') || p.startsWith('hotel_images/') || p.startsWith('restaurant_images/'))
    return `${REC_API}/datasets/${p}`;
  return null;
}

function RecommendationCard({ place, theme, navigate, preferences, recommendations }) {
  const [activeTab, setActiveTab] = useState('place');
  const [tabImgIdx, setTabImgIdx] = useState(0);
  const [tabImgErrors, setTabImgErrors] = useState({});

  const dark = theme === 'dark';
  const cardBg = dark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-white/50';

  const allImgs = (place.all_images?.length ? place.all_images : (place.image ? [place.image] : []))
    .map(toAbsUrl).filter(Boolean);

  // Images for the active tab
  const tabImages = activeTab === 'place'
    ? allImgs
    : activeTab === 'hotels' && place.hotels?.length
      ? place.hotels.flatMap(h =>
          (h.all_images?.length ? h.all_images : (h.image_url ? [h.image_url] : []))
            .map(toAbsUrl).filter(Boolean))
      : activeTab === 'restaurants' && place.restaurants?.length
        ? place.restaurants.flatMap(r =>
            (r.all_images?.length ? r.all_images : (r.image_url ? [r.image_url] : []))
              .map(toAbsUrl).filter(Boolean))
        : allImgs;

  const tabSrc = !tabImgErrors[tabImgIdx] && tabImages[tabImgIdx] ? tabImages[tabImgIdx] : null;
  const typeEmoji = place.type?.includes('Natural') ? '📍' : place.type?.includes('Trekking') ? '📍' :
    place.type?.includes('Cultural') ? '📍' : '📍';

  return (
    <div className={`rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border backdrop-blur-xl ${cardBg}`}>

      {/* Tab selector */}
      <div className={`flex border-b text-xs font-semibold ${dark ? 'border-slate-700' : 'border-slate-200'}`}>
        {[
          { key: 'place', label: '🏔 Destination' },
          ...(place.hotels?.length ? [{ key: 'hotels', label: `🏨 Hotels (${place.hotels.length})` }] : []),
          ...(place.restaurants?.length ? [{ key: 'restaurants', label: `🍴 Restaurants (${place.restaurants.length})` }] : []),
        ].map(tab => (
          <button key={tab.key} onClick={() => { setActiveTab(tab.key); setTabImgIdx(0); setTabImgErrors({}); }}
            className={`flex-1 py-2 px-3 transition-colors ${
              activeTab === tab.key
                ? 'bg-teal-600 text-white'
                : dark ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-500 hover:bg-slate-50'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Image slider */}
      <div className={`h-48 relative overflow-hidden ${dark ? 'bg-slate-800' : 'bg-slate-100'}`}>
        {tabSrc ? (
          <img src={tabSrc} alt={place.name} className="w-full h-full object-cover"
            onError={() => setTabImgErrors(e => ({ ...e, [tabImgIdx]: true }))} />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <span className="text-5xl">📍</span>
            <span className={`text-xs font-medium ${dark ? 'text-slate-500' : 'text-slate-400'}`}>No image available</span>
          </div>
        )}

        {/* Dot nav */}
        {tabImages.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {tabImages.slice(0, 6).map((_, i) => (
              <button key={i} onClick={() => setTabImgIdx(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === tabImgIdx ? 'bg-white scale-125' : 'bg-white/50'}`} />
            ))}
          </div>
        )}
        {tabImages.length > 1 && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/50 text-white text-[10px] font-semibold">
            {tabImages.length} photos
          </div>
        )}

        {/* Match score */}
        {place.match_score && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-teal-600/90 text-white text-[10px] font-bold">
            🎯 {place.match_score}
          </div>
        )}
      </div>

      {/* Hotel/Restaurant list when tab active */}
      {activeTab === 'hotels' && place.hotels?.length > 0 && (
        <div className={`px-4 py-2 border-b text-xs space-y-1 ${dark ? 'border-slate-700' : 'border-slate-100'}`}>
          {place.hotels.map((h, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className={`font-semibold truncate ${dark ? 'text-slate-200' : 'text-slate-700'}`}>{h.name}</span>
              <span className={`ml-2 shrink-0 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                {h.rating ? `⭐ ${h.rating}` : ''} {h.price_range || ''}
              </span>
            </div>
          ))}
        </div>
      )}
      {activeTab === 'restaurants' && place.restaurants?.length > 0 && (
        <div className={`px-4 py-2 border-b text-xs space-y-1 ${dark ? 'border-slate-700' : 'border-slate-100'}`}>
          {place.restaurants.map((r, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className={`font-semibold truncate ${dark ? 'text-slate-200' : 'text-slate-700'}`}>{r.name}</span>
              <span className={`ml-2 shrink-0 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                {r.rating ? `⭐ ${r.rating}` : ''} {r.cuisine || ''}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Card body */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-1">
          <div className="flex-1">
            <h3 className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{place.name}</h3>
            {place.location && (
              <p className={`text-xs flex items-center gap-1 mt-0.5 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                📍 {place.location}
              </p>
            )}
          </div>
          <span className="text-sm font-semibold text-yellow-500 ml-2">⭐ {place.rating?.toFixed(1) || '4.0'}</span>
        </div>

        {place.is_versatile && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-500/20 border border-teal-500/30 text-xs font-semibold text-teal-500 mb-2">
            ✨ Versatile Match
          </span>
        )}

        <p className={`text-sm mb-3 line-clamp-2 ${dark ? 'text-slate-300' : 'text-gray-600'}`}>
          {place.description || 'Discover this amazing destination in Nepal'}
        </p>

        {place.tags && (
          <div className="flex flex-wrap gap-1 mb-3">
            {place.tags.split(/[,;]/).slice(0, 3).map((tag, i) => (
              <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${dark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>
                {tag.trim()}
              </span>
            ))}
          </div>
        )}

        <div className={`text-xs space-y-1 mb-4 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
          {place.best_season && <div>🌤️ Best: {place.best_season}</div>}
          {place.difficulty_level && <div>💪 {place.difficulty_level}</div>}
          {place.duration && <div>📅 {place.duration}</div>}
        </div>

        <button
          onClick={() => navigate(`/place/${place.id}`, {
            state: { fromRecommendations: true, preferences, recommendations }
          })}
          className="w-full bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 hover:from-teal-700 hover:via-cyan-700 hover:to-emerald-700 text-white font-semibold py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm"
        >
          View Details →
        </button>
      </div>
    </div>
  );
}
