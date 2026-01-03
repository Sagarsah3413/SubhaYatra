import { useState, useRef, useEffect } from "react";
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
  FaClock,
  FaFire,
  FaTrendingUp,
  FaEye,
  FaHeart,
  FaBookmark,
  FaExternalLinkAlt,
  FaSearch,
  FaGlobe,
  FaCamera,
  FaRoute,
  FaCompass,
  FaCrown,
  FaShieldAlt,
  FaAward,
  FaBolt,
  FaGem,
  FaMagic,
  FaLightbulb,
  FaRocket,
  FaThumbsUp,
  FaUsers,
  FaCalendarAlt,
  FaShareAlt,
  FaPlay,
  FaChartLine,
  FaHistory,
  FaHotjar,
  FaWifi,
  FaParking,
  FaSwimmingPool,
  FaCoffee,
  FaPlane,
  FaCar,
  FaWalking,
  FaStopwatch,
  FaPercent,
  FaTag
} from "react-icons/fa";

export default function SearchSuggestionItem({ 
  item, 
  onSelect, 
  isSelected = false, 
  searchQuery = "",
  index = 0,
  isPopular = false,
  isHistory = false,
  className = ""
}) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const itemRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Scroll into view when selected with smooth animation
  useEffect(() => {
    if (isSelected && itemRef.current) {
      itemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [isSelected]);

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
        accentColor: 'emerald'
      },
      'Hotel': {
        icon: FaHotel,
        gradient: 'from-blue-500 via-indigo-500 to-purple-600',
        textColor: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
        bgColor: theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50',
        borderColor: 'border-blue-300 dark:border-blue-600',
        shadowColor: 'shadow-blue-500/30',
        accentColor: 'blue'
      },
      'Restaurant': {
        icon: FaUtensils,
        gradient: 'from-orange-500 via-red-500 to-pink-600',
        textColor: theme === 'dark' ? 'text-orange-400' : 'text-orange-600',
        bgColor: theme === 'dark' ? 'bg-orange-900/30' : 'bg-orange-50',
        borderColor: 'border-orange-300 dark:border-orange-600',
        shadowColor: 'shadow-orange-500/30',
        accentColor: 'orange'
      },
      'Attraction': {
        icon: FaMapMarkedAlt,
        gradient: 'from-purple-500 via-pink-500 to-rose-600',
        textColor: theme === 'dark' ? 'text-purple-400' : 'text-purple-600',
        bgColor: theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-50',
        borderColor: 'border-purple-300 dark:border-purple-600',
        shadowColor: 'shadow-purple-500/30',
        accentColor: 'purple'
      }
    };
    return configs[type] || configs['Place'];
  };

  const typeConfig = item ? getTypeConfig(item.type) : null;
  const TypeIcon = typeConfig?.icon || FaMapMarkerAlt;

  // Enhanced premium mock data
  const mockData = item ? {
    rating: (4.2 + Math.random() * 0.7).toFixed(1),
    reviews: Math.floor(Math.random() * 2000) + 100,
    popularity: Math.floor(Math.random() * 100) + 1,
    lastVisited: isHistory ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString() : null,
    trending: isPopular && Math.random() > 0.5,
    distance: `${(Math.random() * 50 + 1).toFixed(1)} km`,
    estimatedTime: `${Math.floor(Math.random() * 120 + 30)} min`,
    travelMode: ['car', 'walking', 'plane'][Math.floor(Math.random() * 3)],
    premium: Math.random() > 0.8,
    verified: Math.random() > 0.7,
    featured: Math.random() > 0.85,
    newListing: Math.random() > 0.9,
    topRated: Math.random() > 0.85,
    bookings: Math.floor(Math.random() * 500) + 50,
    satisfaction: Math.floor(Math.random() * 20) + 80,
    views: Math.floor(Math.random() * 5000) + 500,
    likes: Math.floor(Math.random() * 500) + 25,
    lastBooked: Math.floor(Math.random() * 24) + 1,
    specialOffers: Math.random() > 0.6,
    liveUpdates: Math.random() > 0.7,
    instantBook: Math.random() > 0.7,
    freeWifi: Math.random() > 0.6,
    freeParking: Math.random() > 0.5,
    pool: item.type === 'Hotel' && Math.random() > 0.7,
    breakfast: item.type === 'Hotel' && Math.random() > 0.6,
    discount: Math.floor(Math.random() * 30) + 10,
    price: item.type === 'Hotel' ? `$${Math.floor(Math.random() * 300) + 80}` :
           item.type === 'Restaurant' ? `$${Math.floor(Math.random() * 60) + 15}` :
           `$${Math.floor(Math.random() * 150) + 25}`,
    originalPrice: item.type === 'Hotel' ? `$${Math.floor(Math.random() * 400) + 120}` :
                   item.type === 'Restaurant' ? `$${Math.floor(Math.random() * 80) + 25}` :
                   `$${Math.floor(Math.random() * 200) + 50}`,
    matchScore: Math.floor(Math.random() * 40) + 60,
    responseTime: Math.floor(Math.random() * 30) + 5
  } : null;

  // Enhanced highlight text with better styling
  const highlightText = (text, query) => {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark 
          key={index} 
          className={`
            ${theme === 'dark' 
              ? 'bg-gradient-to-r from-yellow-900/60 to-orange-900/60 text-yellow-300' 
              : 'bg-gradient-to-r from-yellow-200 to-orange-200 text-yellow-800'
            }
            rounded-lg px-2 py-1 font-black shadow-lg animate-pulse
          `}
        >
          {part}
        </mark>
      ) : part
    );
  };

  // Handle click with enhanced analytics
  const handleClick = () => {
    console.log('Ultra Premium Suggestion clicked:', {
      query: searchQuery,
      suggestion: item?.name || 'Unknown',
      type: item?.type || 'Unknown',
      index,
      isPopular,
      isHistory,
      timestamp: new Date().toISOString(),
      mockData: mockData
    });

    if (onSelect) {
      onSelect(item);
    } else if (item) {
      navigate(`/details?type=${item.type}&name=${encodeURIComponent(item.name)}`);
    }
  };

  // Enhanced keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    } else if (e.key === 'p' || e.key === 'P') {
      e.preventDefault();
      setShowPreview(!showPreview);
    }
  };

  // Handle action clicks
  const handleActionClick = (e, action) => {
    e.stopPropagation();
    
    switch(action) {
      case 'like':
        setIsLiked(!isLiked);
        break;
      case 'bookmark':
        setIsBookmarked(!isBookmarked);
        break;
      case 'share':
        console.log('Shared:', item?.name);
        break;
      case 'preview':
        setShowPreview(!showPreview);
        break;
      default:
        console.log(`${action} clicked for:`, item?.name);
    }
  };

  // For popular searches or history items without full item data
  if (!item && (isPopular || isHistory)) {
    return (
      <div
        ref={itemRef}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        tabIndex={0}
        className={`
          group relative flex items-center gap-8 px-10 py-8 cursor-pointer
          transition-all duration-1000 border-b-2 last:border-b-0 backdrop-blur-xl overflow-hidden
          transform hover:-translate-y-2 hover:shadow-2xl rounded-3xl mx-3 mb-3
          ${isSelected 
            ? theme === 'dark' 
              ? 'bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border-blue-600 shadow-blue-500/20 shadow-2xl scale-105' 
              : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-blue-500/20 shadow-2xl scale-105'
            : theme === 'dark'
              ? 'hover:bg-gradient-to-r hover:from-slate-700/50 hover:to-slate-600/50 border-slate-600 hover:border-slate-500'
              : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 border-gray-200 hover:border-gray-300'
          }
          ${className}
        `}
      >
        {/* Ultra Premium Background Effects */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-5 -left-5 w-24 h-24 bg-gradient-to-br from-emerald-400/15 to-teal-600/15 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        {/* Enhanced Icon with Multiple Effects */}
        <div className="relative flex-shrink-0">
          <div className={`
            w-20 h-20 rounded-3xl flex items-center justify-center flex-shrink-0
            transition-all duration-1000 shadow-2xl relative overflow-hidden
            ${isSelected || isHovered
              ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white scale-125 shadow-blue-500/50'
              : theme === 'dark'
                ? 'bg-slate-600 text-slate-300'
                : 'bg-gray-100 text-gray-600'
            }
          `}>
            {isHistory ? <FaHistory className="text-3xl" /> : isPopular ? <FaHotjar className="text-3xl animate-bounce" /> : <FaSearch className="text-3xl" />}
            
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </div>

          {/* Status Indicators */}
          <div className="absolute -top-2 -right-2 flex flex-col gap-1">
            {isPopular && (
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <FaFire className="text-white text-sm" />
              </div>
            )}
            {isHistory && (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <FaClock className="text-white text-sm" />
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Content */}
        <div className="flex-1 min-w-0 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`
              font-black text-3xl truncate leading-tight
              ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
              ${isSelected || isHovered ? 'text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text' : ''}
              transition-all duration-500
            `}>
              {highlightText(item?.name || 'Search term', searchQuery)}
            </h3>
            
            <div className="flex items-center gap-3">
              {isPopular && (
                <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-xl">
                  <FaTrendingUp className="text-lg animate-bounce" />
                  <span className="text-lg font-black">TRENDING</span>
                </div>
              )}
              {isHistory && (
                <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl">
                  <FaHistory className="text-lg" />
                  <span className="text-lg font-black">RECENT</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Enhanced Stats for Popular Items */}
          {isPopular && (
            <div className="flex items-center gap-8 mt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaChartLine className="text-white text-lg" />
                </div>
                <div>
                  <span className={`text-lg font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
                    +{Math.floor(Math.random() * 50) + 10}% searches
                  </span>
                  <div className="text-sm opacity-75">Growth</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaUsers className="text-white text-lg" />
                </div>
                <div>
                  <span className={`text-lg font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
                    {Math.floor(Math.random() * 1000) + 100} users
                  </span>
                  <div className="text-sm opacity-75">Active</div>
                </div>
              </div>
            </div>
          )}

          {/* History Item Details */}
          {isHistory && (
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-blue-500 text-xl" />
                <div>
                  <p className={`text-lg font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
                    Last searched: {new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </p>
                  <div className="text-sm opacity-75">Recent activity</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Arrow with Pulse Effect */}
        <div className="relative flex-shrink-0">
          <FaArrowRight className={`
            text-3xl transition-all duration-1000 relative z-10
            ${isSelected || isHovered 
              ? 'text-blue-500 transform translate-x-3 scale-150' 
              : theme === 'dark' ? 'text-slate-500' : 'text-gray-400'
            }
          `} />
          {(isSelected || isHovered) && (
            <div className="absolute inset-0 text-blue-500 animate-ping opacity-75">
              <FaArrowRight className="text-3xl" />
            </div>
          )}
        </div>

        {/* Hover Glow Effect */}
        <div className={`
          absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none rounded-3xl
          bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10
        `}></div>
      </div>
    );
  }

  // Full item suggestion with ultra-premium styling
  if (!item) return null;

  return (
    <div
      ref={itemRef}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => {
        setIsHovered(true);
        setShowPreview(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowPreview(false);
      }}
      tabIndex={0}
      className={`
        group relative flex items-center gap-10 px-12 py-10 cursor-pointer
        transition-all duration-1000 border-b-2 last:border-b-0 overflow-hidden backdrop-blur-2xl
        transform hover:-translate-y-3 hover:shadow-3xl rounded-4xl mx-4 mb-4
        ${isSelected 
          ? `${typeConfig.bgColor} ${typeConfig.borderColor} border-l-8 shadow-2xl ${typeConfig.shadowColor} scale-105`
          : theme === 'dark'
            ? 'hover:bg-slate-700/50 border-slate-700 hover:border-slate-600'
            : 'hover:bg-gray-50/50 border-gray-100 hover:border-gray-300'
        }
        ${className}
      `}
    >
      {/* Ultra Premium Background Effects */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
        <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-${typeConfig.accentColor}-400/20 to-${typeConfig.accentColor}-600/20 rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-${typeConfig.accentColor}-400/15 to-${typeConfig.accentColor}-600/15 rounded-full blur-2xl animate-pulse delay-500`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-${typeConfig.accentColor}-400/10 to-${typeConfig.accentColor}-600/10 rounded-full blur-xl animate-pulse delay-1000`}></div>
      </div>

      {/* Selection Indicator with Glow */}
      {isSelected && (
        <div className={`absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b ${typeConfig.gradient} rounded-r-full shadow-2xl animate-pulse`}></div>
      )}

      {/* Enhanced Image/Icon Container */}
      <div className="relative flex-shrink-0">
        {item.images && item.images.length > 0 && !imageError ? (
          <div className="relative w-32 h-32 rounded-4xl overflow-hidden shadow-2xl">
            <img
              src={item.images[0].startsWith('http') ? item.images[0] : `http://localhost:8000/${item.images[0]}`}
              alt={item.name}
              className={`
                w-full h-full object-cover transition-all duration-1000
                ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}
                ${isHovered ? 'scale-125 brightness-110' : 'scale-100'}
              `}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
            
            {!imageLoaded && (
              <div className={`
                absolute inset-0 animate-pulse
                ${theme === 'dark' ? 'bg-slate-600' : 'bg-gray-200'}
              `}>
                <div className="flex items-center justify-center h-full">
                  <FaCamera className="text-4xl text-gray-400 animate-bounce" />
                </div>
              </div>
            )}
            
            {/* Enhanced Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40"></div>
            
            {/* Live Indicator */}
            {mockData.liveUpdates && (
              <div className="absolute top-3 right-3 w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg">
                <div className="absolute inset-0 bg-red-400 rounded-full animate-ping"></div>
              </div>
            )}
          </div>
        ) : (
          <div className={`
            w-32 h-32 rounded-4xl flex items-center justify-center shadow-2xl
            transition-all duration-1000 relative overflow-hidden
            ${isSelected || isHovered
              ? `bg-gradient-to-br ${typeConfig.gradient} text-white scale-125 shadow-3xl ${typeConfig.shadowColor}`
              : `${typeConfig.bgColor} ${typeConfig.textColor}`
            }
          `}>
            <TypeIcon className="text-5xl relative z-10" />
            
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1500"></div>
          </div>
        )}

        {/* Enhanced Type Badge with Premium Styling */}
        <div className={`
          absolute -bottom-3 -right-3 w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl
          border-4 border-white dark:border-slate-800 transition-all duration-500
          ${isSelected || isHovered
            ? `bg-gradient-to-br ${typeConfig.gradient} text-white scale-110`
            : `${typeConfig.bgColor} ${typeConfig.textColor}`
          }
        `}>
          <TypeIcon className="text-xl" />
        </div>

        {/* Premium Badge Collection */}
        <div className="absolute -top-4 -right-4 flex flex-col gap-2">
          {mockData.premium && (
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <FaCrown className="text-white text-lg" />
            </div>
          )}
          {mockData.verified && (
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
              <FaShieldAlt className="text-white text-lg" />
            </div>
          )}
          {mockData.trending && (
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
              <FaTrendingUp className="text-white text-lg" />
            </div>
          )}
          {mockData.featured && (
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl">
              <FaFire className="text-white text-lg" />
            </div>
          )}
          {mockData.newListing && (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl">
              <FaRocket className="text-white text-lg" />
            </div>
          )}
        </div>
      </div>

      {/* Ultra Premium Content Section */}
      <div className="flex-1 min-w-0 relative z-10">
        {/* Enhanced Header with Live Status */}
        <div className="flex items-start justify-between gap-6 mb-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4 mb-3">
              <h3 className={`
                font-black text-4xl leading-tight
                ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
                ${isSelected || isHovered ? `${typeConfig.textColor}` : ''}
                transition-all duration-500
              `}>
                {highlightText(item.name, searchQuery)}
              </h3>
              
              {/* Live Activity Indicators */}
              <div className="flex gap-2">
                {mockData.lastBooked <= 2 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full text-sm font-bold animate-pulse shadow-xl">
                    <FaBolt className="text-sm" />
                    <span>HOT</span>
                  </div>
                )}
                {mockData.satisfaction >= 95 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full text-sm font-bold shadow-xl">
                    <FaAward className="text-sm" />
                    <span>TOP</span>
                  </div>
                )}
                {mockData.specialOffers && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-full text-sm font-bold animate-pulse shadow-xl">
                    <FaGem className="text-sm" />
                    <span>OFFER</span>
                  </div>
                )}
                {mockData.instantBook && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-bold shadow-xl">
                    <FaBolt className="text-sm" />
                    <span>INSTANT</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Price Section */}
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              {mockData.discount > 15 && (
                <span className={`text-xl line-through ${theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}`}>
                  {mockData.originalPrice}
                </span>
              )}
              <div className={`text-4xl font-black ${typeConfig.textColor}`}>
                {mockData.price}
              </div>
            </div>
            <div className={`text-lg ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
              {item.type === 'Hotel' ? 'per night' : item.type === 'Restaurant' ? 'avg meal' : 'starting from'}
            </div>
            {mockData.discount > 15 && (
              <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold">
                <FaPercent className="text-xs" />
                <span>{mockData.discount}% OFF</span>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Location with Rich Details */}
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-10 h-10 bg-gradient-to-br ${typeConfig.gradient} rounded-2xl flex items-center justify-center shadow-xl`}>
            <FaMapMarkerAlt className="text-white text-xl" />
          </div>
          <div className="flex-1">
            <span className={`
              text-2xl font-bold
              ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}
            `}>
              {highlightText(item.location || 'Nepal', searchQuery)}
            </span>
            <div className="flex items-center gap-6 text-lg mt-2">
              <div className="flex items-center gap-2">
                {mockData.travelMode === 'car' ? <FaCar className={typeConfig.textColor} /> :
                 mockData.travelMode === 'walking' ? <FaWalking className={typeConfig.textColor} /> :
                 <FaPlane className={typeConfig.textColor} />}
                <span className={`${theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}`}>
                  {mockData.distance} away
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaStopwatch className={typeConfig.textColor} />
                <span className={`${theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}`}>
                  {mockData.estimatedTime} travel
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className={typeConfig.textColor} />
                <span className={`${theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}`}>
                  {mockData.lastBooked}h ago
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Description */}
        {item.description && (
          <p className={`
            text-xl line-clamp-2 leading-relaxed mb-6
            ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}
          `}>
            {highlightText(item.description, searchQuery)}
          </p>
        )}

        {/* Ultra Premium Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <FaStar className="text-white text-lg" />
            </div>
            <div>
              <div className={`font-black text-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {mockData.rating}
              </div>
              <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                ({mockData.reviews})
              </div>
            </div>
          </div>

          {/* Views */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-br ${typeConfig.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
              <FaEye className="text-white text-lg" />
            </div>
            <div>
              <div className={`font-black text-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {(mockData.views / 1000).toFixed(1)}K
              </div>
              <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                views
              </div>
            </div>
          </div>

          {/* Bookings */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <FaUsers className="text-white text-lg" />
            </div>
            <div>
              <div className={`font-black text-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {mockData.bookings}
              </div>
              <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                bookings
              </div>
            </div>
          </div>

          {/* Match Score */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <FaThumbsUp className="text-white text-lg" />
            </div>
            <div>
              <div className={`font-black text-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {mockData.matchScore}%
              </div>
              <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                match
              </div>
            </div>
          </div>

          {/* Response Time */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <FaClock className="text-white text-lg" />
            </div>
            <div>
              <div className={`font-black text-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {mockData.responseTime}m
              </div>
              <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                response
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Amenities */}
        <div className="flex flex-wrap gap-3 mb-6">
          {mockData.freeWifi && (
            <div className={`
              flex items-center gap-2 px-4 py-2 rounded-2xl border-2 transition-all duration-300 hover:scale-105 shadow-lg
              ${theme === 'dark' ? 'bg-slate-700/50 border-slate-600 text-slate-300' : 'bg-gray-100 border-gray-200 text-gray-700'}
            `}>
              <FaWifi className="text-lg" />
              <span className="font-semibold">Free WiFi</span>
            </div>
          )}
          {mockData.freeParking && (
            <div className={`
              flex items-center gap-2 px-4 py-2 rounded-2xl border-2 transition-all duration-300 hover:scale-105 shadow-lg
              ${theme === 'dark' ? 'bg-slate-700/50 border-slate-600 text-slate-300' : 'bg-gray-100 border-gray-200 text-gray-700'}
            `}>
              <FaParking className="text-lg" />
              <span className="font-semibold">Free Parking</span>
            </div>
          )}
          {mockData.pool && (
            <div className={`
              flex items-center gap-2 px-4 py-2 rounded-2xl border-2 transition-all duration-300 hover:scale-105 shadow-lg
              ${theme === 'dark' ? 'bg-slate-700/50 border-slate-600 text-slate-300' : 'bg-gray-100 border-gray-200 text-gray-700'}
            `}>
              <FaSwimmingPool className="text-lg" />
              <span className="font-semibold">Pool</span>
            </div>
          )}
          {mockData.breakfast && (
            <div className={`
              flex items-center gap-2 px-4 py-2 rounded-2xl border-2 transition-all duration-300 hover:scale-105 shadow-lg
              ${theme === 'dark' ? 'bg-slate-700/50 border-slate-600 text-slate-300' : 'bg-gray-100 border-gray-200 text-gray-700'}
            `}>
              <FaCoffee className="text-lg" />
              <span className="font-semibold">Breakfast</span>
            </div>
          )}
        </div>

        {/* Enhanced Tags with Interactive Effects */}
        {item.tags && (
          <div className="flex flex-wrap gap-3 mb-6">
            {item.tags.split(',').slice(0, 4).map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className={`
                  px-5 py-3 rounded-2xl text-lg font-black transition-all duration-500 hover:scale-110 cursor-pointer relative overflow-hidden shadow-lg
                  ${theme === 'dark' 
                    ? 'bg-slate-700/50 text-slate-300 border border-slate-600 hover:border-slate-500' 
                    : 'bg-gray-100 text-gray-600 border border-gray-200 hover:border-gray-300'
                  }
                  hover:shadow-xl group/tag
                `}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover/tag:translate-x-full transition-transform duration-1000"></div>
                <span className="relative z-10 flex items-center gap-2">
                  <FaTag className="text-sm" />
                  {tag.trim()}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Ultra Premium Action Area */}
      <div className="flex flex-col items-center gap-8 flex-shrink-0 relative z-10">
        {/* Quick Actions with Enhanced Styling */}
        <div className={`
          flex flex-col gap-4 opacity-0 group-hover:opacity-100 transition-all duration-700
          transform translate-x-4 group-hover:translate-x-0
        `}>
          <button
            onClick={(e) => handleActionClick(e, 'like')}
            className={`
              w-16 h-16 rounded-3xl transition-all duration-500 hover:scale-125 shadow-2xl relative overflow-hidden border-2
              ${isLiked 
                ? 'bg-red-500 text-white border-red-400 animate-pulse' 
                : theme === 'dark' 
                  ? 'bg-slate-700 text-slate-300 hover:text-red-400 hover:bg-slate-600 border-slate-600 hover:border-red-400' 
                  : 'bg-white text-gray-600 hover:text-red-500 hover:bg-red-50 border-gray-200 hover:border-red-400'
              }
              flex items-center justify-center
            `}
            title="Add to Wishlist"
          >
            <FaHeart className="text-2xl relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          
          <button
            onClick={(e) => handleActionClick(e, 'bookmark')}
            className={`
              w-16 h-16 rounded-3xl transition-all duration-500 hover:scale-125 shadow-2xl relative overflow-hidden border-2
              ${isBookmarked 
                ? 'bg-yellow-500 text-white border-yellow-400 animate-pulse' 
                : theme === 'dark' 
                  ? 'bg-slate-700 text-slate-300 hover:text-yellow-400 hover:bg-slate-600 border-slate-600 hover:border-yellow-400' 
                  : 'bg-white text-gray-600 hover:text-yellow-500 hover:bg-yellow-50 border-gray-200 hover:border-yellow-400'
              }
              flex items-center justify-center
            `}
            title="Bookmark"
          >
            <FaBookmark className="text-2xl relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          
          <button
            onClick={(e) => handleActionClick(e, 'share')}
            className={`
              w-16 h-16 rounded-3xl transition-all duration-500 hover:scale-125 shadow-2xl relative overflow-hidden border-2
              ${theme === 'dark' 
                ? 'bg-slate-700 text-slate-300 hover:text-blue-400 hover:bg-slate-600 border-slate-600 hover:border-blue-400' 
                : 'bg-white text-gray-600 hover:text-blue-500 hover:bg-blue-50 border-gray-200 hover:border-blue-400'
              }
              flex items-center justify-center
            `}
            title="Share"
          >
            <FaShareAlt className="text-2xl relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Enhanced Main Arrow with Multiple Effects */}
        <div className="relative">
          <FaArrowRight className={`
            text-4xl transition-all duration-1000 relative z-10
            ${isSelected || isHovered 
              ? `${typeConfig.textColor} transform translate-x-4 scale-150` 
              : theme === 'dark' ? 'text-slate-500' : 'text-gray-400'
            }
          `} />
          {(isSelected || isHovered) && (
            <div className={`absolute inset-0 ${typeConfig.textColor} animate-ping opacity-75`}>
              <FaArrowRight className="text-4xl" />
            </div>
          )}
          {mockData.trending && (
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse">
              <div className="absolute inset-0 bg-red-400 rounded-full animate-ping"></div>
            </div>
          )}
        </div>
      </div>

      {/* Ultra Premium Hover Effect Overlay with Multiple Layers */}
      <div className={`
        absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none rounded-4xl
        bg-gradient-to-r from-transparent via-${typeConfig.accentColor}-500/10 to-transparent
      `}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-2000"></div>
      </div>

      {/* Selection Glow with Pulse Animation */}
      {isSelected && (
        <div className={`
          absolute inset-0 pointer-events-none animate-pulse rounded-4xl
          bg-gradient-to-r from-${typeConfig.accentColor}-500/20 via-transparent to-${typeConfig.accentColor}-500/20
        `}></div>
      )}

      {/* Quick Preview Modal */}
      {showPreview && (
        <div className="absolute top-full left-0 right-0 mt-4 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className={`
            p-8 rounded-3xl border-2 backdrop-blur-xl shadow-3xl
            ${theme === 'dark' ? 'bg-slate-800/95 border-slate-600' : 'bg-white/95 border-gray-200'}
          `}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Quick Preview - {item.name}
              </h3>
              <button
                onClick={(e) => handleActionClick(e, 'preview')}
                className={`
                  w-12 h-12 rounded-2xl flex items-center justify-center hover:scale-110 transition-all duration-300
                  ${theme === 'dark' ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                `}
              >
                ×
              </button>
            </div>
            <div className="space-y-6">
              <p className={`text-xl leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                {item.description || 'No description available.'}
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'}`}>
                  <div className="text-3xl font-black mb-3">{mockData.rating}</div>
                  <div className="text-lg opacity-75">Rating</div>
                </div>
                <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'}`}>
                  <div className="text-3xl font-black mb-3">{mockData.distance}</div>
                  <div className="text-lg opacity-75">Distance</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}