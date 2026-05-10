import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { Header } from "../components/header/Header";
import Footer from "../components/footer/Footer";
import imageService from "../services/imageService";

// ─── Reusable card matching the RecommendationCard design ───────────────────
function PlaceCard({ item, accentColor = "teal", fallbackEmoji = "📍", theme, onClick }) {
  const dark = theme === 'dark';
  const allUrls = imageService.getAllImageUrls(item);
  const [imgIdx, setImgIdx] = useState(0);
  const [imgErrors, setImgErrors] = useState({});

  const src = !imgErrors[imgIdx] && allUrls[imgIdx] ? allUrls[imgIdx] : null;

  const accent = {
    teal:    { badge: 'bg-teal-600/90',    text: dark ? 'text-teal-400' : 'text-teal-600',    tag: dark ? 'bg-teal-900/30 text-teal-400' : 'bg-teal-50 text-teal-700' },
    emerald: { badge: 'bg-emerald-600/90', text: dark ? 'text-emerald-400' : 'text-emerald-600', tag: dark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-700' },
  }[accentColor] ?? {};

  const cardBg = dark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white/80 border-white/50';

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border backdrop-blur-xl cursor-pointer ${cardBg}`}
    >
      {/* Image area */}
      <div className={`h-48 relative overflow-hidden ${dark ? 'bg-slate-800' : 'bg-slate-100'}`}>
        {src ? (
          <img
            src={src}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover"
            onError={() => setImgErrors(e => ({ ...e, [imgIdx]: true }))}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <span className="text-5xl">{fallbackEmoji}</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

        {/* Dot nav */}
        {allUrls.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {allUrls.slice(0, 6).map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setImgIdx(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIdx ? 'bg-white scale-125' : 'bg-white/50'}`}
              />
            ))}
          </div>
        )}

        {/* Photo count badge */}
        {allUrls.length > 1 && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/50 text-white text-[10px] font-semibold">
            {allUrls.length} photos
          </div>
        )}

        {/* Rating badge */}
        {item.rating != null && (
          <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full ${accent.badge} text-white text-[10px] font-bold`}>
            ⭐ {Number(item.rating).toFixed(1)}
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-5">
        <h3 className={`text-lg font-bold mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}>
          {item.name}
        </h3>

        {item.location && (
          <p className={`text-xs flex items-center gap-1 mb-2 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
            📍 {item.location}
          </p>
        )}

        {item.description && (
          <p className={`text-sm line-clamp-2 mb-3 ${dark ? 'text-slate-300' : 'text-gray-600'}`}>
            {item.description}
          </p>
        )}

        <div className="flex items-center justify-between flex-wrap gap-2">
          {item.price_range && (
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${accent.tag}`}>
              💰 {item.price_range}
            </span>
          )}
          {item.cuisine && (
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${accent.tag}`}>
              🍴 {item.cuisine}
            </span>
          )}
          <span className={`text-xs ml-auto ${dark ? 'text-slate-500' : 'text-gray-400'}`}>
            View details →
          </span>
        </div>
      </div>
    </div>
  );
}

export default function PlaceDetailView() {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [similarPlaces, setSimilarPlaces] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  // Check if we came from recommendation results
  const fromRecommendations = location.state?.fromRecommendations;
  const userPreferences = location.state?.preferences; // Get user preferences

  const handleBackClick = () => {
    if (fromRecommendations) {
      // Go back to recommendation results with state preserved
      navigate('/recommendation-results', { 
        state: location.state 
      });
    } else {
      // Go back to previous page
      navigate(-1);
    }
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`Fetching details for place ID: ${placeId}`);
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/places/${placeId}`);
        
        console.log(`Response status: ${response.status}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Response error:', errorText);
          throw new Error(`Failed to fetch place details: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response data:', data);
        
        // Handle both response formats:
        // 1. Direct format: { id, name, hotels, restaurants, ... }
        // 2. Wrapped format: { success: true, place: { ... } }
        let placeData;
        if (data.success && data.place) {
          placeData = data.place;
        } else if (data.id && data.name) {
          // Direct format - use as is
          placeData = data;
        } else {
          console.error('Invalid response format:', data);
          throw new Error('Invalid response format - missing place data');
        }
        
        // Ensure arrays are properly formatted
        if (typeof placeData.tags === 'string') {
          placeData.tags = placeData.tags.split(',').map(t => t.trim()).filter(t => t);
        }
        if (typeof placeData.activities === 'string') {
          placeData.activities = placeData.activities.split(',').map(a => a.trim()).filter(a => a);
        }
        
        // Images should already be formatted by backend, but ensure they exist
        // images already come as /api/images/... from backend
        if (!placeData.images || placeData.images.length === 0) {
          placeData.images = [];
        }
        
        // Ensure hotels and restaurants exist
        placeData.hotels = placeData.hotels || [];
        placeData.restaurants = placeData.restaurants || [];
        placeData.events = placeData.events || [];
        
        console.log('Place images:', placeData.images);
        console.log('Hotels:', placeData.hotels.length);
        console.log('Restaurants:', placeData.restaurants.length);
        console.log('Events:', placeData.events.length);
        
        setPlace(placeData);
        console.log('✅ Place data loaded successfully');
        
        // Fetch similar places after place data is loaded
        fetchSimilarPlaces(placeId);
      } catch (err) {
        console.error('Error fetching place details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchSimilarPlaces = async (id) => {
      try {
        setLoadingSimilar(true);
        console.log(`🔍 Fetching similar places for place ID: ${id}`);
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/places/${id}/similar?limit=6`);
        
        console.log(`Similar places response status: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Similar places data:', data);
          if (data.success && data.similar_places) {
            setSimilarPlaces(data.similar_places);
            console.log(`✅ Loaded ${data.similar_places.length} similar places`);
          } else {
            console.log('⚠️ No similar places found in response');
          }
        } else {
          console.error(`❌ Failed to fetch similar places: ${response.status}`);
        }
      } catch (err) {
        console.error('Error fetching similar places:', err);
      } finally {
        setLoadingSimilar(false);
      }
    };

    if (placeId) {
      fetchPlaceDetails();
    } else {
      setError('No place ID provided');
      setLoading(false);
    }
  }, [placeId]);

  // Hotel Detail Modal Component
  const HotelModal = ({ hotel, onClose }) => {
    const [currentImage, setCurrentImage] = useState(0);
    
    const nextImage = () => {
      if (hotel.images && hotel.images.length > 0) {
        setCurrentImage((prev) => (prev + 1) % hotel.images.length);
      }
    };
    
    const prevImage = () => {
      if (hotel.images && hotel.images.length > 0) {
        setCurrentImage((prev) => (prev - 1 + hotel.images.length) % hotel.images.length);
      }
    };
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
        <div 
          className={`relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
            theme === 'dark' ? 'bg-slate-800' : 'bg-white'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Images */}
          {hotel.images && hotel.images.length > 0 && (
            <div>
              <div className="h-96 relative group">
                <img
                  src={imageService.getImageUrl({ all_images: hotel.images }, currentImage)}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.style.display = 'none'}
                />
                
                {/* Navigation Buttons */}
                {hotel.images.length > 1 && (
                  <>
                    {/* Previous Button */}
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    {/* Next Button */}
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
                      {currentImage + 1} / {hotel.images.length}
                    </div>
                  </>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {hotel.images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto bg-black/5">
                  {hotel.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImage(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImage === idx ? 'border-teal-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imageService.getImageUrl({ all_images: hotel.images }, idx)}
                        alt={`${hotel.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className={`text-3xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {hotel.name}
                </h2>
                <p className={`text-lg flex items-center gap-2 mb-3 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                }`}>
                  <span>📍</span>
                  <span>{hotel.location}</span>
                </p>
                
                {/* Price Range */}
                <div className={`inline-block px-4 py-2 rounded-lg ${
                  theme === 'dark' ? 'bg-teal-900/30 text-teal-400' : 'bg-teal-50 text-teal-700'
                }`}>
                  <span className="font-semibold text-lg">💰 {hotel.price_range || 'Price not available'}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <span className="text-yellow-500 text-2xl">⭐</span>
                <span className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {hotel.rating?.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Description */}
            {hotel.description && (
              <p className={`text-lg mb-4 leading-relaxed ${
                theme === 'dark' ? 'text-slate-300' : 'text-gray-700'
              }`}>
                {hotel.description}
              </p>
            )}

            {/* Tags */}
            {hotel.tags && (
              <div className="flex flex-wrap gap-2">
                {hotel.tags.split(',').map((tag, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 rounded-full text-sm ${
                      theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Restaurant Detail Modal Component
  const RestaurantModal = ({ restaurant, onClose }) => {
    const [currentImage, setCurrentImage] = useState(0);
    
    const nextImage = () => {
      if (restaurant.images && restaurant.images.length > 0) {
        setCurrentImage((prev) => (prev + 1) % restaurant.images.length);
      }
    };
    
    const prevImage = () => {
      if (restaurant.images && restaurant.images.length > 0) {
        setCurrentImage((prev) => (prev - 1 + restaurant.images.length) % restaurant.images.length);
      }
    };
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
        <div 
          className={`relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
            theme === 'dark' ? 'bg-slate-800' : 'bg-white'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Images */}
          {restaurant.images && restaurant.images.length > 0 && (
            <div>
              <div className="h-96 relative group">
                <img
                  src={imageService.getImageUrl({ all_images: restaurant.images }, currentImage)}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.style.display = 'none'}
                />
                
                {/* Navigation Buttons */}
                {restaurant.images.length > 1 && (
                  <>
                    {/* Previous Button */}
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    {/* Next Button */}
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
                      {currentImage + 1} / {restaurant.images.length}
                    </div>
                  </>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {restaurant.images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto bg-black/5">
                  {restaurant.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImage(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImage === idx ? 'border-emerald-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imageService.getImageUrl({ all_images: restaurant.images }, idx)}
                        alt={`${restaurant.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className={`text-3xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {restaurant.name}
                </h2>
                <p className={`text-lg flex items-center gap-2 mb-3 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                }`}>
                  <span>📍</span>
                  <span>{restaurant.location}</span>
                </p>
                
                {/* Price Range */}
                <div className={`inline-block px-4 py-2 rounded-lg ${
                  theme === 'dark' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
                }`}>
                  <span className="font-semibold text-lg">💰 {restaurant.price_range || 'Price not available'}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <span className="text-yellow-500 text-2xl">⭐</span>
                <span className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {restaurant.rating?.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Description */}
            {restaurant.description && (
              <p className={`text-lg mb-4 leading-relaxed ${
                theme === 'dark' ? 'text-slate-300' : 'text-gray-700'
              }`}>
                {restaurant.description}
              </p>
            )}

            {/* Tags */}
            {restaurant.tags && (
              <div className="flex flex-wrap gap-2">
                {restaurant.tags.split(',').map((tag, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 rounded-full text-sm ${
                      theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col ${
        theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'
      }`}>
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className={theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}>
              Loading place details...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className={`min-h-screen flex flex-col ${
        theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'
      }`}>
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <p className={`text-lg mb-4 ${
              theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
            }`}>
              {error || 'Place not found'}
            </p>
            <button
              onClick={handleBackClick}
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${
      theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      <Header />

      <div className="flex-1 max-w-7xl mx-auto px-4 pt-24 pb-8 w-full">

        {/* Image Gallery */}
        {place.images && place.images.length > 0 && (
          <div className={`rounded-2xl overflow-hidden shadow-xl mb-8 ${
            theme === 'dark' ? 'bg-slate-800' : 'bg-white'
          }`}>
            {/* Main Image */}
            <div className="h-96 relative group">
              <img
                src={imageService.getImageUrl({ all_images: place.images }, selectedImage)}
                alt={place.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>';
                  e.target.style.display = 'none';
                }}
              />
              
              {/* Navigation Buttons */}
              {place.images.length > 1 && (
                <>
                  {/* Previous Button */}
                  <button
                    onClick={() => setSelectedImage((prev) => (prev - 1 + place.images.length) % place.images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  {/* Next Button */}
                  <button
                    onClick={() => setSelectedImage((prev) => (prev + 1) % place.images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
                    {selectedImage + 1} / {place.images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {place.images.length > 1 && (
              <div className="p-4 flex gap-2 overflow-x-auto">
                {place.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? 'border-teal-500 scale-105'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imageService.getImageUrl({ all_images: place.images }, idx)}
                      alt={`${place.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Place Details */}
        <div className={`rounded-2xl shadow-xl p-8 mb-8 ${
          theme === 'dark' ? 'bg-slate-800' : 'bg-white'
        }`}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className={`text-4xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {place.name}
              </h1>
              <p className={`text-lg flex items-center gap-2 ${
                theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
              }`}>
                <span>📍</span>
                <span>{place.location}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-500 text-2xl">⭐</span>
              <span className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {place.rating?.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Tags */}
          {place.tags && place.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {place.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1 rounded-full text-sm ${
                    theme === 'dark'
                      ? 'bg-slate-700 text-slate-300'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <p className={`text-lg mb-6 leading-relaxed ${
            theme === 'dark' ? 'text-slate-300' : 'text-gray-700'
          }`}>
            {place.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => navigate('/itinerary', {
                state: {
                  preselectedDestination: {
                    id: place.id,
                    name: place.name,
                    location: place.location,
                    description: place.description,
                    type: place.type,
                    best_season: place.best_season,
                    activities: place.activities,
                    difficulty_level: place.difficulty_level,
                    transportation: place.transportation
                  },
                  // Pass user preferences if available (from recommendations)
                  userPreferences: userPreferences ? {
                    travellers: userPreferences.travellers,
                    tripDuration: userPreferences.tripDuration,
                    travelMonth: userPreferences.travelMonth,
                    age: userPreferences.age,
                    tripTypes: userPreferences.tripTypes
                  } : null
                }
              })}
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <span>📅</span>
              <span>Plan Itinerary</span>
            </button>
            
            <button
              onClick={handleBackClick}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 ${
                theme === 'dark'
                  ? 'bg-slate-700 text-white hover:bg-slate-600'
                  : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span>←</span>
              <span>Back</span>
            </button>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {place.best_season && (
              <div className={`p-4 rounded-xl ${
                theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'
              }`}>
                <div className="text-2xl mb-2">🌤️</div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                }`}>
                  Best Season
                </div>
                <div className={`font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {place.best_season}
                </div>
              </div>
            )}

            {place.difficulty_level && (
              <div className={`p-4 rounded-xl ${
                theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'
              }`}>
                <div className="text-2xl mb-2">💪</div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                }`}>
                  Difficulty Level
                </div>
                <div className={`font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {place.difficulty_level}
                </div>
              </div>
            )}

            {place.province && (
              <div className={`p-4 rounded-xl ${
                theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'
              }`}>
                <div className="text-2xl mb-2">🗺️</div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                }`}>
                  Province
                </div>
                <div className={`font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {place.province}
                </div>
              </div>
            )}

            {place.accessibility && (
              <div className={`p-4 rounded-xl ${
                theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'
              }`}>
                <div className="text-2xl mb-2">🚗</div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                }`}>
                  Accessibility
                </div>
                <div className={`font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {place.accessibility}
                </div>
              </div>
            )}

            {place.transportation && (
              <div className={`p-4 rounded-xl ${
                theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'
              }`}>
                <div className="text-2xl mb-2">🚌</div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                }`}>
                  Transportation
                </div>
                <div className={`font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {place.transportation}
                </div>
              </div>
            )}

            {/* Events - Same style as transportation */}
            {place.events && place.events.length > 0 && (
              <div className={`p-4 rounded-xl ${
                theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'
              }`}>
                <div className="text-2xl mb-2">🎉</div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                }`}>
                  Events & Festivals
                </div>
                <div className={`font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {place.events.length} {place.events.length === 1 ? 'Event' : 'Events'}
                </div>
                {/* Show first event name as preview */}
                {place.events[0] && (
                  <div className={`text-sm mt-2 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    {place.events[0].name}
                    {place.events.length > 1 && (
                      <span className={`text-xs ml-1 ${
                        theme === 'dark' ? 'text-slate-500' : 'text-gray-500'
                      }`}>
                        +{place.events.length - 1} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Activities */}
          {place.activities && place.activities.length > 0 && (
            <div className="mt-6">
              <h3 className={`text-xl font-bold mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Activities
              </h3>
              <div className="flex flex-wrap gap-2">
                {place.activities.map((activity, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      theme === 'dark'
                        ? 'bg-teal-900/30 text-teal-400'
                        : 'bg-teal-50 text-teal-700'
                    }`}
                  >
                    {activity.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Hotels Section — only rendered when data exists */}
        {place.hotels?.length > 0 && (
          <div className="mb-8">
            <h2 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              🏨 Nearby Hotels
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {place.hotels.map((hotel) => (
                <PlaceCard
                  key={hotel.id}
                  item={hotel}
                  accentColor="teal"
                  fallbackEmoji="🏨"
                  theme={theme}
                  onClick={() => setSelectedHotel(hotel)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Restaurants Section — only rendered when data exists */}
        {place.restaurants?.length > 0 && (
          <div className="mb-8">
            <h2 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              🍽️ Nearby Restaurants
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {place.restaurants.map((restaurant) => (
                <PlaceCard
                  key={restaurant.id}
                  item={restaurant}
                  accentColor="emerald"
                  fallbackEmoji="🍽️"
                  theme={theme}
                  onClick={() => setSelectedRestaurant(restaurant)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Nearby Places Section */}
      {(loadingSimilar || (similarPlaces && similarPlaces.length > 0)) && (
        <div className="max-w-7xl mx-auto px-4 py-12 w-full">
          <h2 className={`text-3xl font-bold mb-8 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            📍 Nearby Places to Explore
          </h2>
          
          {loadingSimilar ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className={theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}>
                  Finding nearby places...
                </p>
              </div>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarPlaces.map((similarPlace) => (
              <div
                key={similarPlace.id}
                onClick={() => {
                  window.scrollTo(0, 0);
                  navigate(`/place/${similarPlace.id}`, {
                    state: location.state
                  });
                }}
                className={`rounded-xl shadow-lg overflow-hidden transition-all hover:scale-105 cursor-pointer ${
                  theme === 'dark' ? 'bg-slate-800' : 'bg-white'
                }`}
              >
                <div className="h-48 overflow-hidden bg-slate-200 dark:bg-slate-700">
                  {similarPlace.image ? (
                    <img
                      src={imageService.getImageUrl(similarPlace, 0)}
                      alt={similarPlace.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">📍</div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className={`text-lg font-bold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {similarPlace.name}
                  </h3>
                  
                  <p className={`text-sm mb-2 ${
                    theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                  }`}>
                    📍 {similarPlace.location}
                  </p>
                  
                  {similarPlace.description && (
                    <p className={`text-sm mb-3 line-clamp-2 ${
                      theme === 'dark' ? 'text-slate-300' : 'text-gray-700'
                    }`}>
                      {similarPlace.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className={`text-sm font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {similarPlace.rating?.toFixed(1)}
                      </span>
                    </div>
                    
                    {similarPlace.difficulty_level && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {similarPlace.difficulty_level}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      )}

      {/* Modals */}
      {selectedHotel && (
        <HotelModal hotel={selectedHotel} onClose={() => setSelectedHotel(null)} />
      )}
      
      {selectedRestaurant && (
        <RestaurantModal restaurant={selectedRestaurant} onClose={() => setSelectedRestaurant(null)} />
      )}

      <Footer />
    </div>
  );
}
