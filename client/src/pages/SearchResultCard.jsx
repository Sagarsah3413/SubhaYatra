import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { 
  FaMapMarkerAlt, 
  FaStar, 
  FaHotel, 
  FaUtensils, 
  FaMapMarkedAlt, 
  FaMountain, 
  FaArrowRight,
  FaHeart,
  FaShare,
  FaEye,
  FaCrown,
  FaShieldAlt,
  FaFire,
  FaGem,
  FaUsers,
  FaClock,
  FaCamera,
  FaBookmark,
  FaThumbsUp,
  FaCalendarAlt,
  FaRoute,
  FaWifi,
  FaParking,
  FaSwimmingPool,
  FaCoffee,
  FaAward,
  FaBolt,
  FaMagic,
  FaRocket
} from "react-icons/fa";

export default function SearchResultCard({ item, className = "", onSelect = null }) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showQuickPreview, setShowQuickPreview] = useState(false);

  if (!item) {
    return (
      <div className="p-8 border-2 border-red-500 rounded-3xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center">
            <FaBolt className="text-white text-xl" />
          </div>
          <div>
            <p className="text-red-600 dark:text-red-400 font-black text-lg">No Data Available</p>
            <p className="text-red-500 dark:text-red-300 text-sm">Item information is missing</p>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced type-specific configuration
  const getTypeConfig = (type) => {
    const configs = {
      'Place': {
        icon: FaMountain,
        gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
        textColor: theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600',
        bgColor: theme === 'dark' ? 'bg-emerald-900/30' : 'bg-emerald-50',
        borderColor: 'border-emerald-300 dark:border-emerald-600',
        shadowColor: 'shadow-emerald-500/30',
        glowColor: 'shadow-emerald-400/50',
        accentColor: 'emerald'
      },
      'Hotel': {
        icon: FaHotel,
        gradient: 'from-blue-500 via-indigo-500 to-purple-600',
        textColor: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
        bgColor: theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50',
        borderColor: 'border-blue-300 dark:border-blue-600',
        shadowColor: 'shadow-blue-500/30',
        glowColor: 'shadow-blue-400/50',
        accentColor: 'blue'
      },
      'Restaurant': {
        icon: FaUtensils,
        gradient: 'from-orange-500 via-red-500 to-pink-600',
        textColor: theme === 'dark' ? 'text-orange-400' : 'text-orange-600',
        bgColor: theme === 'dark' ? 'bg-orange-900/30' : 'bg-orange-50',
        borderColor: 'border-orange-300 dark:border-orange-600',
        shadowColor: 'shadow-orange-500/30',
        glowColor: 'shadow-orange-400/50',
        accentColor: 'orange'
      },
      'Attraction': {
        icon: FaMapMarkedAlt,
        gradient: 'from-purple-500 via-pink-500 to-rose-600',
        textColor: theme === 'dark' ? 'text-purple-400' : 'text-purple-600',
        bgColor: theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-50',
        borderColor: 'border-purple-300 dark:border-purple-600',
        shadowColor: 'shadow-purple-500/30',
        glowColor: 'shadow-purple-400/50',
        accentColor: 'purple'
      }
    };
    return configs[item.type] || configs['Place'];
  };

  const typeConfig = getTypeConfig(item.type);
  const TypeIcon = typeConfig.icon;

  // Enhanced premium mock data with more features
  const mockData = {
    rating: (4.2 + Math.random() * 0.7).toFixed(1),
    reviews: Math.floor(Math.random() * 2000) + 100,
    views: Math.floor(Math.random() * 10000) + 1000,
    likes: Math.floor(Math.random() * 1000) + 50,
    bookings: Math.floor(Math.random() * 500) + 25,
    distance: `${(Math.random() * 50 + 1).toFixed(1)} km`,
    travelTime: `${Math.floor(Math.random() * 120) + 30} min`,
    price: item.type === 'Hotel' ? `$${Math.floor(Math.random() * 300) + 80}` :
           item.type === 'Restaurant' ? `$${Math.floor(Math.random() * 60) + 15}` :
           `$${Math.floor(Math.random() * 150) + 25}`,
    originalPrice: item.type === 'Hotel' ? `$${Math.floor(Math.random() * 400) + 120}` :
                   item.type === 'Restaurant' ? `$${Math.floor(Math.random() * 80) + 25}` :
                   `$${Math.floor(Math.random() * 200) + 50}`,
    discount: Math.floor(Math.random() * 30) + 10,
    premium: Math.random() > 0.75,
    verified: Math.random() > 0.6,
    trending: Math.random() > 0.8,
    featured: Math.random() > 0.85,
    newListing: Math.random() > 0.9,
    topRated: Math.random() > 0.85,
    lastBooked: Math.floor(Math.random() * 12) + 1,
    availability: Math.random() > 0.3,
    instantBook: Math.random() > 0.7,
    freeWifi: Math.random() > 0.6,
    freeParking: Math.random() > 0.5,
    pool: item.type === 'Hotel' && Math.random() > 0.7,
    breakfast: item.type === 'Hotel' && Math.random() > 0.6,
    satisfaction: Math.floor(Math.random() * 15) + 85,
    responseTime: Math.floor(Math.random() * 30) + 5
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(item);
    } else {
      navigate(`/details?type=${item.type}&name=${encodeURIComponent(item.name)}`);
    }
  };

  const handleActionClick = (e, action) => {
    e.stopPropagation();
    
    switch(action) {
      case 'like':
        setIsLiked(!isLiked);
        console.log(`${isLiked ? 'Unliked' : 'Liked'}:`, item.name);
        break;
      case 'bookmark':
        setIsBookmarked(!isBookmarked);
        console.log(`${isBookmarked ? 'Unbookmarked' : 'Bookmarked'}:`, item.name);
        break;
      case 'share':
        console.log('Shared:', item.name);
        // Add share functionality
        break;
      case 'preview':
        setShowQuickPreview(!showQuickPreview);
        break;
      default:
        console.log(`${action} clicked for:`, item.name);
    }
  };

  return (
    <div 
      className={`
        group relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-1000
        transform hover:-translate-y-3 hover:scale-[1.02] border-2 backdrop-blur-xl
        ${theme === 'dark' 
          ? 'bg-slate-800/95 border-slate-600 hover:border-slate-500 hover:bg-slate-700/95' 
          : 'bg-white/95 border-gray-200 hover:border-gray-300 hover:bg-white'
        }
        ${typeConfig.shadowColor} hover:${typeConfig.glowColor} hover:shadow-2xl
        ${className}
      `}
      onClick={handleCardClick}
      onMouseEnter={() => setShowQuickPreview(true)}
      onMouseLeave={() => setShowQuickPreview(false)}
    >
      {/* Ultra Premium Background Effects */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 via-purple-400/15 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-emerald-400/15 via-teal-400/10 to-cyan-400/15 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>

      {/* Animated Border Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${typeConfig.gradient} opacity-20 blur-sm animate-pulse`}></div>
      </div>

      {/* Enhanced Image Section */}
      <div className="relative h-56 overflow-hidden rounded-t-3xl">
        {item.images && item.images.length > 0 ? (
          <>
            <img
              src={item.images[0].startsWith('http') ? item.images[0] : `http://localhost:8000/${item.images[0]}`}
              alt={item.name}
              className={`
                w-full h-full object-cover transition-all duration-1000
                ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}
                group-hover:scale-110 group-hover:brightness-110
              `}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            
            {/* Loading Skeleton */}
            {!imageLoaded && (
              <div className={`
                absolute inset-0 animate-pulse
                ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'}
              `}>
                <div className="flex items-center justify-center h-full">
                  <FaCamera className="text-4xl text-gray-400 animate-bounce" />
                </div>
              </div>
            )}
          </>
        ) : null}
        
        {/* Enhanced Fallback Icon Display */}
        <div 
          className={`
            w-full h-full flex items-center justify-center relative overflow-hidden
            bg-gradient-to-br ${typeConfig.gradient}
            ${item.images && item.images.length > 0 ? 'hidden' : 'flex'}
          `}
        >
          <TypeIcon className="text-8xl text-white/80 relative z-10" />
          
          {/* Animated background patterns */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse delay-700"></div>
          </div>
        </div>

        {/* Enhanced Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

        {/* Premium Status Indicators */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {mockData.newListing && (
            <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full text-white text-sm font-bold shadow-xl animate-pulse">
              <FaRocket className="text-xs" />
              <span>New</span>
            </div>
          )}
          {mockData.premium && (
            <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full text-white text-sm font-bold shadow-xl">
              <FaCrown className="text-xs" />
              <span>Premium</span>
            </div>
          )}
          {mockData.verified && (
            <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full text-white text-sm font-bold shadow-xl">
              <FaShieldAlt className="text-xs" />
              <span>Verified</span>
            </div>
          )}
          {mockData.trending && (
            <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-red-500 to-pink-600 rounded-full text-white text-sm font-bold shadow-xl animate-pulse">
              <FaFire className="text-xs" />
              <span>Trending</span>
            </div>
          )}
          {mockData.topRated && (
            <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full text-white text-sm font-bold shadow-xl">
              <FaAward className="text-xs" />
              <span>Top Rated</span>
            </div>
          )}
        </div>

        {/* Enhanced Type Badge */}
        <div className="absolute top-4 right-4">
          <div className={`
            px-4 py-2 rounded-2xl font-bold text-sm shadow-xl backdrop-blur-md border-2
            ${typeConfig.bgColor} ${typeConfig.textColor} ${typeConfig.borderColor}
            transform group-hover:scale-110 transition-all duration-500
          `}>
            <div className="flex items-center gap-2">
              <TypeIcon className="text-sm" />
              <span>{item.type}</span>
            </div>
          </div>
        </div>

        {/* Discount Badge */}
        {mockData.discount > 15 && (
          <div className="absolute bottom-4 left-4">
            <div className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl text-white font-bold shadow-xl animate-pulse">
              <div className="flex items-center gap-2">
                <FaBolt className="text-sm" />
                <span>{mockData.discount}% OFF</span>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Quick Actions */}
        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={(e) => handleActionClick(e, 'like')}
            className={`
              w-12 h-12 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl
              transition-all duration-300 hover:scale-125 border-2
              ${isLiked 
                ? 'bg-red-500 text-white border-red-400' 
                : 'bg-white/20 text-white border-white/30 hover:bg-red-500 hover:border-red-400'
              }
            `}
            title="Add to Wishlist"
          >
            <FaHeart className={`text-lg ${isLiked ? 'animate-pulse' : ''}`} />
          </button>
          
          <button
            onClick={(e) => handleActionClick(e, 'bookmark')}
            className={`
              w-12 h-12 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl
              transition-all duration-300 hover:scale-125 border-2
              ${isBookmarked 
                ? 'bg-yellow-500 text-white border-yellow-400' 
                : 'bg-white/20 text-white border-white/30 hover:bg-yellow-500 hover:border-yellow-400'
              }
            `}
            title="Bookmark"
          >
            <FaBookmark className={`text-lg ${isBookmarked ? 'animate-pulse' : ''}`} />
          </button>
          
          <button
            onClick={(e) => handleActionClick(e, 'share')}
            className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:bg-blue-500 hover:scale-125 transition-all duration-300 shadow-xl border-2 border-white/30 hover:border-blue-400"
            title="Share"
          >
            <FaShare className="text-lg" />
          </button>
        </div>

        {/* Live Activity Indicator */}
        {mockData.lastBooked <= 3 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-bold shadow-xl animate-pulse">
              🔥 Booked {mockData.lastBooked}h ago
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Content Section */}
      <div className="p-8 relative z-10">
        {/* Header with Live Status */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <h3 className={`
                text-2xl font-black leading-tight line-clamp-2
                ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
                group-hover:${typeConfig.textColor} transition-colors duration-500
              `}>
                {item.name || 'Unnamed Item'}
              </h3>
              
              {/* Live Status Indicators */}
              {mockData.availability && (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white rounded-full text-xs font-bold">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>Available</span>
                </div>
              )}
            </div>
            
            {/* Enhanced Location with Travel Info */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${typeConfig.bgColor} shadow-lg`}>
                <FaMapMarkerAlt className={`text-lg ${typeConfig.textColor}`} />
              </div>
              <div className="flex-1">
                <span className={`text-lg font-bold block ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                  {item.location || 'Unknown Location'}
                </span>
                <div className="flex items-center gap-4 text-sm mt-1">
                  <div className="flex items-center gap-1">
                    <FaRoute className={typeConfig.textColor} />
                    <span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}>
                      {mockData.distance}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaClock className={typeConfig.textColor} />
                    <span className={theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}>
                      {mockData.travelTime}
                    </span>
                  </div>
                  {mockData.instantBook && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded-full text-xs font-bold">
                      <FaBolt className="text-xs" />
                      <span>Instant</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Price Section */}
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              {mockData.discount > 15 && (
                <span className={`text-lg line-through ${theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}`}>
                  {mockData.originalPrice}
                </span>
              )}
              <div className={`text-3xl font-black ${typeConfig.textColor}`}>
                {mockData.price}
              </div>
            </div>
            <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
              {item.type === 'Hotel' ? 'per night' : item.type === 'Restaurant' ? 'avg meal' : 'starting from'}
            </div>
            {mockData.responseTime <= 10 && (
              <div className="text-xs text-green-500 font-semibold mt-1">
                ⚡ Responds in {mockData.responseTime}min
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Description */}
        {item.description && (
          <p className={`
            text-base leading-relaxed mb-6 line-clamp-3
            ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}
          `}>
            {item.description}
          </p>
        )}

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {/* Rating */}
          <div className={`
            text-center p-4 rounded-2xl border-2 transition-all duration-500 hover:scale-105
            ${theme === 'dark' ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-200'}
          `}>
            <div className="flex items-center justify-center gap-1 mb-2">
              <FaStar className="text-yellow-500 text-xl" />
              <span className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {mockData.rating}
              </span>
            </div>
            <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'}`}>
              {mockData.reviews} reviews
            </div>
          </div>

          {/* Views */}
          <div className={`
            text-center p-4 rounded-2xl border-2 transition-all duration-500 hover:scale-105
            ${theme === 'dark' ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'}
          `}>
            <div className="flex items-center justify-center gap-1 mb-2">
              <FaEye className="text-blue-500 text-xl" />
              <span className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {(mockData.views / 1000).toFixed(1)}K
              </span>
            </div>
            <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
              views
            </div>
          </div>

          {/* Bookings */}
          <div className={`
            text-center p-4 rounded-2xl border-2 transition-all duration-500 hover:scale-105
            ${theme === 'dark' ? 'bg-purple-900/20 border-purple-700' : 'bg-purple-50 border-purple-200'}
          `}>
            <div className="flex items-center justify-center gap-1 mb-2">
              <FaUsers className="text-purple-500 text-xl" />
              <span className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {mockData.bookings}
              </span>
            </div>
            <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
              bookings
            </div>
          </div>

          {/* Satisfaction */}
          <div className={`
            text-center p-4 rounded-2xl border-2 transition-all duration-500 hover:scale-105
            ${theme === 'dark' ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'}
          `}>
            <div className="flex items-center justify-center gap-1 mb-2">
              <FaThumbsUp className="text-green-500 text-xl" />
              <span className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {mockData.satisfaction}%
              </span>
            </div>
            <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
              satisfaction
            </div>
          </div>
        </div>

        {/* Amenities/Features */}
        <div className="flex flex-wrap gap-3 mb-6">
          {mockData.freeWifi && (
            <div className={`
              flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all duration-300 hover:scale-105
              ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-slate-300' : 'bg-gray-100 border-gray-200 text-gray-700'}
            `}>
              <FaWifi className="text-sm" />
              <span className="text-sm font-semibold">Free WiFi</span>
            </div>
          )}
          {mockData.freeParking && (
            <div className={`
              flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all duration-300 hover:scale-105
              ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-slate-300' : 'bg-gray-100 border-gray-200 text-gray-700'}
            `}>
              <FaParking className="text-sm" />
              <span className="text-sm font-semibold">Free Parking</span>
            </div>
          )}
          {mockData.pool && (
            <div className={`
              flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all duration-300 hover:scale-105
              ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-slate-300' : 'bg-gray-100 border-gray-200 text-gray-700'}
            `}>
              <FaSwimmingPool className="text-sm" />
              <span className="text-sm font-semibold">Pool</span>
            </div>
          )}
          {mockData.breakfast && (
            <div className={`
              flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all duration-300 hover:scale-105
              ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-slate-300' : 'bg-gray-100 border-gray-200 text-gray-700'}
            `}>
              <FaCoffee className="text-sm" />
              <span className="text-sm font-semibold">Breakfast</span>
            </div>
          )}
        </div>

        {/* Enhanced Tags */}
        {item.tags && (
          <div className="flex flex-wrap gap-3 mb-6">
            {item.tags.split(',').slice(0, 4).map((tag, index) => (
              <span
                key={index}
                className={`
                  px-4 py-2 rounded-2xl text-sm font-bold border-2 transition-all duration-500 hover:scale-110 cursor-pointer
                  ${theme === 'dark' 
                    ? 'bg-slate-700/50 text-slate-300 border-slate-600 hover:border-slate-500 hover:bg-slate-600/50' 
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-200'
                  }
                  hover:shadow-lg relative overflow-hidden group/tag
                `}
              >
                <span className="relative z-10">#{tag.trim()}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover/tag:translate-x-full transition-transform duration-1000"></div>
              </span>
            ))}
          </div>
        )}

        {/* Enhanced Action Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
              ID: {item.id || 'N/A'}
            </div>
            {mockData.lastBooked <= 6 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-bold animate-pulse">
                <FaFire className="text-xs" />
                <span>Hot Deal</span>
              </div>
            )}
          </div>
          
          <button 
            className={`
              group/btn flex items-center gap-4 px-8 py-4 rounded-2xl font-bold text-lg
              bg-gradient-to-r ${typeConfig.gradient} text-white shadow-xl
              hover:shadow-2xl hover:scale-110 transition-all duration-500
              relative overflow-hidden border-2 border-white/20
            `}
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            <span className="relative z-10">Explore Now</span>
            <FaArrowRight className="text-xl relative z-10 group-hover/btn:translate-x-2 transition-transform duration-500" />
            
            {/* Enhanced button effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
          </button>
        </div>
      </div>

      {/* Ultra Premium Hover Effects */}
      <div className={`
        absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none rounded-3xl
        bg-gradient-to-br from-transparent via-blue-500/5 via-purple-500/5 to-transparent
      `}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-2000"></div>
      </div>

      {/* Quick Preview Tooltip */}
      {showQuickPreview && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className={`
            px-4 py-2 rounded-xl shadow-2xl border-2 backdrop-blur-md
            ${theme === 'dark' ? 'bg-slate-800/90 border-slate-600 text-white' : 'bg-white/90 border-gray-200 text-gray-900'}
          `}>
            <div className="text-sm font-semibold">Quick Preview Available</div>
            <div className="text-xs opacity-75">Hover to see details</div>
          </div>
        </div>
      )}
    </div>
  );
}