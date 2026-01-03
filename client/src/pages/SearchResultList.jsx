import { useState } from "react";
import { 
  FaMapMarkerAlt, 
  FaHotel, 
  FaUtensils, 
  FaMapMarkedAlt, 
  FaMountain, 
  FaStar, 
  FaArrowRight,
  FaEye,
  FaHeart,
  FaUsers,
  FaFire,
  FaCrown,
  FaShieldAlt,
  FaAward,
  FaBolt,
  FaRocket,
  FaGem,
  FaThumbsUp,
  FaRoute,
  FaClock,
  FaWifi,
  FaParking,
  FaSwimmingPool,
  FaCoffee,
  FaBookmark,
  FaShare,
  FaChartLine,
  FaTrendingUp,
  FaCalendarAlt
} from "react-icons/fa";

export default function SearchResultList({ results, onSelect, selectedIndex = -1, theme = 'light' }) {
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [likedItems, setLikedItems] = useState(new Set());
  const [bookmarkedItems, setBookmarkedItems] = useState(new Set());

  const getTypeConfig = (type) => {
    const configs = {
      'place': {
        icon: FaMountain,
        gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
        textColor: theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600',
        bgColor: theme === 'dark' ? 'bg-emerald-900/30' : 'bg-emerald-50',
        borderColor: 'border-emerald-300 dark:border-emerald-600',
        shadowColor: 'shadow-emerald-500/30',
        accentColor: 'emerald'
      },
      'hotel': {
        icon: FaHotel,
        gradient: 'from-blue-500 via-indigo-500 to-purple-600',
        textColor: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
        bgColor: theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50',
        borderColor: 'border-blue-300 dark:border-blue-600',
        shadowColor: 'shadow-blue-500/30',
        accentColor: 'blue'
      },
      'restaurant': {
        icon: FaUtensils,
        gradient: 'from-orange-500 via-red-500 to-pink-600',
        textColor: theme === 'dark' ? 'text-orange-400' : 'text-orange-600',
        bgColor: theme === 'dark' ? 'bg-orange-900/30' : 'bg-orange-50',
        borderColor: 'border-orange-300 dark:border-orange-600',
        shadowColor: 'shadow-orange-500/30',
        accentColor: 'orange'
      },
      'attraction': {
        icon: FaMapMarkedAlt,
        gradient: 'from-purple-500 via-pink-500 to-rose-600',
        textColor: theme === 'dark' ? 'text-purple-400' : 'text-purple-600',
        bgColor: theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-50',
        borderColor: 'border-purple-300 dark:border-purple-600',
        shadowColor: 'shadow-purple-500/30',
        accentColor: 'purple'
      }
    };
    return configs[type.toLowerCase()] || configs['place'];
  };

  // Enhanced mock data generator
  const generateMockData = (item, index) => ({
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
    responseTime: Math.floor(Math.random() * 30) + 5,
    popularityScore: Math.floor(Math.random() * 100) + 1,
    matchScore: Math.floor(Math.random() * 40) + 60
  });

  const handleActionClick = (e, action, index) => {
    e.stopPropagation();
    
    switch(action) {
      case 'like':
        const newLikedItems = new Set(likedItems);
        if (newLikedItems.has(index)) {
          newLikedItems.delete(index);
        } else {
          newLikedItems.add(index);
        }
        setLikedItems(newLikedItems);
        break;
      case 'bookmark':
        const newBookmarkedItems = new Set(bookmarkedItems);
        if (newBookmarkedItems.has(index)) {
          newBookmarkedItems.delete(index);
        } else {
          newBookmarkedItems.add(index);
        }
        setBookmarkedItems(newBookmarkedItems);
        break;
      case 'share':
        console.log('Shared:', results[index]?.name);
        break;
      default:
        console.log(`${action} clicked for:`, results[index]?.name);
    }
  };

  return (
    <div className={`
      max-h-screen overflow-y-auto space-y-6 p-6 relative
      ${theme === 'dark' ? 'scrollbar-thumb-slate-600 scrollbar-track-slate-800' : 'scrollbar-thumb-gray-300 scrollbar-track-gray-100'}
      scrollbar-thin
    `}>
      {/* Ultra Premium Header */}
      <div className={`
        relative overflow-hidden rounded-3xl border-2 mb-10 backdrop-blur-xl
        ${theme === 'dark' 
          ? 'bg-slate-800/95 border-slate-600' 
          : 'bg-white/95 border-gray-200'
        }
        shadow-2xl
      `}>
        {/* Animated Background Effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-40 h-40 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>
        
        <div className="relative z-10 text-center py-12 px-8">
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl animate-bounce">
              <FaRocket className="text-4xl text-white" />
            </div>
            <h2 className="text-7xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
              Premium Results
            </h2>
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl animate-bounce delay-300">
              <FaGem className="text-4xl text-white" />
            </div>
          </div>
          
          <p className={`
            text-2xl font-bold mb-8
            ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}
          `}>
            {results.length} curated destinations discovered for you
          </p>
          
          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
            <div className={`
              group flex items-center gap-4 px-8 py-6 rounded-3xl border-2 shadow-2xl transition-all duration-500 hover:scale-105
              ${theme === 'dark' 
                ? 'bg-blue-900/30 border-blue-700 text-blue-300 hover:bg-blue-800/40' 
                : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'
              }
            `}>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                <FaRocket className="text-3xl text-white" />
              </div>
              <div>
                <div className="font-black text-3xl">Premium</div>
                <div className="text-lg opacity-80">Quality</div>
              </div>
            </div>
            
            <div className={`
              group flex items-center gap-4 px-8 py-6 rounded-3xl border-2 shadow-2xl transition-all duration-500 hover:scale-105
              ${theme === 'dark' 
                ? 'bg-emerald-900/30 border-emerald-700 text-emerald-300 hover:bg-emerald-800/40' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
              }
            `}>
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                <FaGem className="text-3xl text-white" />
              </div>
              <div>
                <div className="font-black text-3xl">Curated</div>
                <div className="text-lg opacity-80">Selection</div>
              </div>
            </div>
            
            <div className={`
              group flex items-center gap-4 px-8 py-6 rounded-3xl border-2 shadow-2xl transition-all duration-500 hover:scale-105
              ${theme === 'dark' 
                ? 'bg-purple-900/30 border-purple-700 text-purple-300 hover:bg-purple-800/40' 
                : 'bg-purple-50 border-purple-200 text-purple-600 hover:bg-purple-100'
              }
            `}>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                <FaShieldAlt className="text-3xl text-white" />
              </div>
              <div>
                <div className="font-black text-3xl">Verified</div>
                <div className="text-lg opacity-80">Trusted</div>
              </div>
            </div>
            
            <div className={`
              group flex items-center gap-4 px-8 py-6 rounded-3xl border-2 shadow-2xl transition-all duration-500 hover:scale-105
              ${theme === 'dark' 
                ? 'bg-orange-900/30 border-orange-700 text-orange-300 hover:bg-orange-800/40' 
                : 'bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100'
              }
            `}>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                <FaCrown className="text-3xl text-white" />
              </div>
              <div>
                <div className="font-black text-3xl">Exclusive</div>
                <div className="text-lg opacity-80">Access</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Ultra Premium Results */}
      {results.map((item, index) => {
        const typeConfig = getTypeConfig(item.type);
        const TypeIcon = typeConfig.icon;
        const isSelected = selectedIndex === index;
        const isHovered = hoveredIndex === index;
        const isLiked = likedItems.has(index);
        const isBookmarked = bookmarkedItems.has(index);
        const mockData = generateMockData(item, index);
        
        return (
          <div
            key={index}
            onClick={() => onSelect(item)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(-1)}
            className={`
              group relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-1000
              transform hover:-translate-y-4 hover:scale-[1.02] border-2 backdrop-blur-xl
              ${isSelected 
                ? `${typeConfig.bgColor} ${typeConfig.borderColor} shadow-2xl ${typeConfig.shadowColor} scale-105` 
                : theme === 'dark'
                  ? 'bg-slate-800/95 border-slate-700 hover:border-slate-600 hover:bg-slate-700/95'
                  : 'bg-white/95 border-gray-200 hover:border-gray-300 hover:bg-white'
              }
              hover:shadow-2xl
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

            <div className="relative z-10 p-10">
              <div className="flex items-start gap-8">
                {/* Enhanced Icon Container */}
                <div className="relative flex-shrink-0">
                  <div className={`
                    w-28 h-28 rounded-3xl flex items-center justify-center
                    transition-all duration-1000 shadow-2xl relative overflow-hidden
                    ${isSelected || isHovered
                      ? `bg-gradient-to-br ${typeConfig.gradient} text-white scale-125 shadow-2xl ${typeConfig.shadowColor}`
                      : `${typeConfig.bgColor} ${typeConfig.textColor}`
                    }
                  `}>
                    <TypeIcon className="text-5xl relative z-10" />
                    
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1500"></div>
                  </div>
                  
                  {/* Premium Badge Collection */}
                  <div className="absolute -top-3 -right-3 flex flex-col gap-2">
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
                
                {/* Enhanced Content */}
                <div className="flex-1 min-w-0">
                  {/* Header with Live Status */}
                  <div className="flex items-start justify-between gap-6 mb-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className={`
                          font-black text-4xl line-clamp-2 leading-tight
                          ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
                          group-hover:${typeConfig.textColor} transition-colors duration-500
                          ${isSelected ? typeConfig.textColor : ''}
                        `}>
                          {item.name}
                        </h3>
                        
                        {/* Live Status Indicators */}
                        <div className="flex gap-2">
                          {mockData.lastBooked <= 2 && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full text-sm font-bold animate-pulse shadow-xl">
                              <FaBolt className="text-xs" />
                              <span>HOT</span>
                            </div>
                          )}
                          {mockData.satisfaction >= 95 && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full text-sm font-bold shadow-xl">
                              <FaAward className="text-xs" />
                              <span>TOP RATED</span>
                            </div>
                          )}
                          {mockData.instantBook && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-bold shadow-xl">
                              <FaBolt className="text-xs" />
                              <span>INSTANT</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Enhanced Location with Rich Details */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-12 h-12 bg-gradient-to-br ${typeConfig.gradient} rounded-2xl flex items-center justify-center shadow-xl`}>
                          <FaMapMarkerAlt className="text-white text-xl" />
                        </div>
                        <div className="flex-1">
                          <span className={`
                            text-2xl font-bold block
                            ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}
                          `}>
                            {item.location || 'Nepal'}
                          </span>
                          <div className="flex items-center gap-6 text-lg mt-2">
                            <div className="flex items-center gap-2">
                              <FaRoute className={typeConfig.textColor} />
                              <span className={`${theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}`}>
                                {mockData.distance} away
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaClock className={typeConfig.textColor} />
                              <span className={`${theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}`}>
                                {mockData.travelTime} travel
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaCalendarAlt className={typeConfig.textColor} />
                              <span className={`${theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}`}>
                                Last booked {mockData.lastBooked}h ago
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced Type Badge */}
                    <div className={`
                      px-8 py-4 rounded-3xl font-black text-2xl flex-shrink-0 shadow-2xl
                      transition-all duration-500 group-hover:scale-110 relative overflow-hidden
                      ${isSelected || isHovered
                        ? `bg-gradient-to-br ${typeConfig.gradient} text-white`
                        : `${typeConfig.bgColor} ${typeConfig.textColor} border-2 ${typeConfig.borderColor}`
                      }
                    `}>
                      <span className="relative z-10">{item.type}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </div>
                  </div>
                  
                  {/* Enhanced Description */}
                  {item.description && (
                    <p className={`
                      text-xl line-clamp-3 leading-relaxed mb-6
                      ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}
                    `}>
                      {item.description}
                    </p>
                  )}
                  
                  {/* Enhanced Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                    {/* Rating */}
                    <div className={`
                      flex items-center gap-3 px-6 py-4 rounded-3xl border-2 transition-all duration-500 hover:scale-105 shadow-xl
                      ${theme === 'dark' 
                        ? 'bg-yellow-900/20 border-yellow-700 text-yellow-300' 
                        : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                      }
                    `}>
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <FaStar className="text-white text-xl" />
                      </div>
                      <div>
                        <div className="font-black text-2xl">{mockData.rating}</div>
                        <div className="text-sm opacity-75">({mockData.reviews})</div>
                      </div>
                    </div>

                    {/* Views */}
                    <div className={`
                      flex items-center gap-3 px-6 py-4 rounded-3xl border-2 transition-all duration-500 hover:scale-105 shadow-xl
                      ${theme === 'dark' 
                        ? 'bg-blue-900/20 border-blue-700 text-blue-300' 
                        : 'bg-blue-50 border-blue-200 text-blue-700'
                      }
                    `}>
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <FaEye className="text-white text-xl" />
                      </div>
                      <div>
                        <div className="font-black text-2xl">{(mockData.views / 1000).toFixed(1)}K</div>
                        <div className="text-sm opacity-75">views</div>
                      </div>
                    </div>

                    {/* Bookings */}
                    <div className={`
                      flex items-center gap-3 px-6 py-4 rounded-3xl border-2 transition-all duration-500 hover:scale-105 shadow-xl
                      ${theme === 'dark' 
                        ? 'bg-purple-900/20 border-purple-700 text-purple-300' 
                        : 'bg-purple-50 border-purple-200 text-purple-700'
                      }
                    `}>
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <FaUsers className="text-white text-xl" />
                      </div>
                      <div>
                        <div className="font-black text-2xl">{mockData.bookings}</div>
                        <div className="text-sm opacity-75">bookings</div>
                      </div>
                    </div>

                    {/* Satisfaction */}
                    <div className={`
                      flex items-center gap-3 px-6 py-4 rounded-3xl border-2 transition-all duration-500 hover:scale-105 shadow-xl
                      ${theme === 'dark' 
                        ? 'bg-green-900/20 border-green-700 text-green-300' 
                        : 'bg-green-50 border-green-200 text-green-700'
                      }
                    `}>
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <FaThumbsUp className="text-white text-xl" />
                      </div>
                      <div>
                        <div className="font-black text-2xl">{mockData.satisfaction}%</div>
                        <div className="text-sm opacity-75">satisfaction</div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className={`
                      flex items-center gap-3 px-6 py-4 rounded-3xl border-2 transition-all duration-500 hover:scale-105 shadow-xl
                      ${theme === 'dark' 
                        ? 'bg-emerald-900/20 border-emerald-700 text-emerald-300' 
                        : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      }
                    `}>
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <FaGem className="text-white text-xl" />
                      </div>
                      <div>
                        <div className="font-black text-2xl">{mockData.price}</div>
                        <div className="text-sm opacity-75">from</div>
                      </div>
                    </div>

                    {/* Match Score */}
                    <div className={`
                      flex items-center gap-3 px-6 py-4 rounded-3xl border-2 transition-all duration-500 hover:scale-105 shadow-xl
                      ${theme === 'dark' 
                        ? 'bg-indigo-900/20 border-indigo-700 text-indigo-300' 
                        : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                      }
                    `}>
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <FaChartLine className="text-white text-xl" />
                      </div>
                      <div>
                        <div className="font-black text-2xl">{mockData.matchScore}%</div>
                        <div className="text-sm opacity-75">match</div>
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
                  
                  {/* Enhanced Tags */}
                  {item.tags && (
                    <div className="flex flex-wrap gap-3 mb-6">
                      {item.tags.split(',').slice(0, 5).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className={`
                            px-5 py-3 rounded-2xl text-lg font-black border-2 transition-all duration-500 hover:scale-110 cursor-pointer
                            ${theme === 'dark' 
                              ? 'bg-slate-700/50 text-slate-300 border-slate-600 hover:border-slate-500 hover:bg-slate-600/50' 
                              : 'bg-gray-100 text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-200'
                            }
                            hover:shadow-xl relative overflow-hidden group/tag
                          `}
                        >
                          <span className="relative z-10">#{tag.trim()}</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover/tag:translate-x-full transition-transform duration-1000"></div>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Enhanced Action Area */}
                <div className="flex flex-col items-center gap-6 flex-shrink-0 relative z-10">
                  {/* Quick Actions with Enhanced Styling */}
                  <div className={`
                    flex flex-col gap-4 opacity-0 group-hover:opacity-100 transition-all duration-700
                    transform translate-x-4 group-hover:translate-x-0
                  `}>
                    <button
                      onClick={(e) => handleActionClick(e, 'like', index)}
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
                      onClick={(e) => handleActionClick(e, 'bookmark', index)}
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
                      onClick={(e) => handleActionClick(e, 'share', index)}
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
                      <FaShare className="text-2xl relative z-10" />
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </div>

                  {/* Enhanced Main Arrow with Multiple Effects */}
                  <div className="relative">
                    <FaArrowRight className={`
                      text-5xl transition-all duration-1000 relative z-10
                      ${isSelected || isHovered 
                        ? `${typeConfig.textColor} transform translate-x-4 scale-150` 
                        : theme === 'dark' ? 'text-slate-500' : 'text-gray-400'
                      }
                    `} />
                    {(isSelected || isHovered) && (
                      <div className={`absolute inset-0 ${typeConfig.textColor} animate-ping opacity-75`}>
                        <FaArrowRight className="text-5xl" />
                      </div>
                    )}
                    {mockData.trending && (
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse">
                        <div className="absolute inset-0 bg-red-400 rounded-full animate-ping"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Ultra Premium Hover Effect Overlay with Multiple Layers */}
            <div className={`
              absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none rounded-3xl
              bg-gradient-to-r from-transparent via-${typeConfig.accentColor}-500/10 to-transparent
            `}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-2000"></div>
            </div>

            {/* Selection Glow with Pulse Animation */}
            {isSelected && (
              <div className={`
                absolute inset-0 pointer-events-none animate-pulse rounded-3xl
                bg-gradient-to-r from-${typeConfig.accentColor}-500/20 via-transparent to-${typeConfig.accentColor}-500/20
              `}></div>
            )}
          </div>
        );
      })}

      {/* Enhanced Empty State */}
      {results.length === 0 && (
        <div className={`
          relative overflow-hidden rounded-3xl border-2 backdrop-blur-xl
          ${theme === 'dark' 
            ? 'bg-slate-800/95 border-slate-700' 
            : 'bg-white/95 border-gray-200'
          }
          shadow-2xl
        `}>
          {/* Animated Background Effects */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full blur-2xl animate-pulse delay-1000"></div>
          </div>
          
          <div className="relative z-10 text-center py-20 px-10">
            <div className="w-40 h-40 mx-auto mb-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
              <FaMapMarkerAlt className="text-6xl text-white" />
            </div>
            <h3 className={`
              text-5xl font-black mb-6
              ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
            `}>
              No Results Found
            </h3>
            <p className={`
              text-2xl mb-8
              ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}
            `}>
              Try adjusting your search terms or explore our featured destinations
            </p>
            <button className="group px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-black text-2xl rounded-3xl shadow-2xl hover:scale-105 transition-all duration-500 relative overflow-hidden">
              <span className="relative z-10">Explore Featured Destinations</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}