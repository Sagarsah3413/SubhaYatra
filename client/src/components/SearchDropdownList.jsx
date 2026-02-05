import { FaMapMarkerAlt, FaHotel, FaUtensils, FaMapMarkedAlt, FaMountain, FaStar, FaClock, FaFire } from "react-icons/fa";

export default function SearchDropdownList({ results, onSelect, selectedIndex = -1, theme = 'light' }) {
  console.log('SearchDropdownList rendered with:', { results, selectedIndex, theme });
  
  if (!results || results.length === 0) {
    console.log('No results to display');
    return (
      <div className={`px-8 py-6 text-center ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
        <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <FaMapMarkerAlt className="text-xl opacity-50" />
        </div>
        <p className="text-sm font-medium">No suggestions found</p>
        <p className="text-xs opacity-75 mt-1">Try adjusting your search terms</p>
      </div>
    );
  }

  const getTypeConfig = (type) => {
    const configs = {
      'Place': {
        icon: FaMountain,
        gradient: 'from-emerald-500 to-teal-600',
        bgGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',
        borderColor: 'emerald',
        label: 'Destination'
      },
      'Hotel': {
        icon: FaHotel,
        gradient: 'from-blue-500 to-indigo-600',
        bgGradient: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
        borderColor: 'blue',
        label: 'Accommodation'
      },
      'Restaurant': {
        icon: FaUtensils,
        gradient: 'from-orange-500 to-red-600',
        bgGradient: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
        borderColor: 'orange',
        label: 'Dining'
      },
      'Attraction': {
        icon: FaMapMarkedAlt,
        gradient: 'from-purple-500 to-pink-600',
        bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
        borderColor: 'purple',
        label: 'Attraction'
      }
    };
    return configs[type] || {
      icon: FaMapMarkerAlt,
      gradient: 'from-gray-500 to-slate-600',
      bgGradient: 'from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20',
      borderColor: 'gray',
      label: 'Location'
    };
  };

  return (
    <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
      {results.map((item, index) => {
        const typeConfig = getTypeConfig(item.type);
        const TypeIcon = typeConfig.icon;
        const isSelected = selectedIndex === index;
        const isPopular = item.relevanceScore > 80;
        
        return (
          <button
            key={`${item.name}-${index}`}
            onClick={() => onSelect(item)}
            className={`
              w-full text-left transition-all duration-300 transform-gpu
              group relative overflow-hidden
              ${isSelected 
                ? `bg-gradient-to-r ${typeConfig.bgGradient} border-l-4 border-${typeConfig.borderColor}-500 shadow-lg scale-[1.02]` 
                : theme === 'dark' 
                  ? 'hover:bg-gradient-to-r hover:from-slate-700/50 hover:to-slate-600/50 hover:scale-[1.01]' 
                  : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-white hover:scale-[1.01]'
              }
            `}
          >
            {/* Premium Background Pattern */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-transparent"></div>
            </div>
            
            <div className="relative z-10 px-6 py-4 flex items-start gap-4">
              {/* Professional Icon Container */}
              <div className={`
                relative flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center
                transition-all duration-500 shadow-lg
                ${isSelected 
                  ? `bg-gradient-to-br ${typeConfig.gradient} scale-110 rotate-3` 
                  : theme === 'dark' 
                    ? 'bg-gradient-to-br from-slate-600 to-slate-500 group-hover:scale-105 group-hover:rotate-1' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 group-hover:scale-105 group-hover:rotate-1'
                }
              `}>
                <TypeIcon className={`
                  text-lg transition-all duration-300
                  ${isSelected ? 'text-white' : theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}
                `} />
                
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                    <FaFire className="text-white text-xs" />
                  </div>
                )}
                
                {/* Selection Ring */}
                {isSelected && (
                  <div className={`absolute inset-0 rounded-2xl border-2 border-${typeConfig.borderColor}-300 animate-pulse`}></div>
                )}
              </div>
              
              {/* Content Section */}
              <div className="flex-1 min-w-0">
                {/* Title Row */}
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`
                    font-bold text-base truncate transition-colors duration-200
                    ${isSelected 
                      ? `text-${typeConfig.borderColor}-600 dark:text-${typeConfig.borderColor}-400` 
                      : theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }
                  `}>
                    {item.name}
                  </h3>
                  
                  {/* Rating Badge */}
                  {item.rating && (
                    <div className={`
                      flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                      ${theme === 'dark' 
                        ? 'bg-amber-900/30 text-amber-300 border border-amber-700/30' 
                        : 'bg-amber-100 text-amber-700 border border-amber-200'
                      }
                    `}>
                      <FaStar className="text-xs" />
                      {item.rating}
                    </div>
                  )}
                </div>
                
                {/* Description Row */}
                <div className="flex items-center gap-3 text-xs font-medium mb-2">
                  <div className={`
                    flex items-center gap-1 px-2 py-1 rounded-lg
                    ${theme === 'dark' 
                      ? `bg-gradient-to-r ${typeConfig.bgGradient} text-${typeConfig.borderColor}-300 border border-${typeConfig.borderColor}-700/30` 
                      : `bg-gradient-to-r ${typeConfig.bgGradient} text-${typeConfig.borderColor}-600 border border-${typeConfig.borderColor}-200`
                    }
                  `}>
                    <TypeIcon className="text-xs" />
                    {typeConfig.label}
                  </div>
                  
                  {item.location && (
                    <div className={`
                      flex items-center gap-1
                      ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}
                    `}>
                      <FaMapMarkerAlt className="text-xs" />
                      {item.location}
                    </div>
                  )}
                </div>
                
                {/* Additional Info */}
                <div className="flex items-center gap-4 text-xs">
                  {item.price && (
                    <div className={`
                      font-semibold
                      ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}
                    `}>
                      {item.price}
                    </div>
                  )}
                  
                  {item.duration && (
                    <div className={`
                      flex items-center gap-1
                      ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}
                    `}>
                      <FaClock className="text-xs" />
                      {item.duration}
                    </div>
                  )}
                  
                  {item.tags && (
                    <div className={`
                      truncate opacity-75
                      ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}
                    `}>
                      {item.tags}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Hover Action Arrow */}
              <div className={`
                flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center
                transition-all duration-300 opacity-0 group-hover:opacity-100
                ${theme === 'dark' 
                  ? 'bg-gradient-to-br from-teal-600 to-cyan-600 text-white' 
                  : 'bg-gradient-to-br from-teal-500 to-cyan-500 text-white'
                }
                group-hover:scale-110 group-hover:translate-x-1
              `}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            
            {/* Premium Bottom Accent */}
            <div className={`
              absolute bottom-0 left-0 h-0.5 bg-gradient-to-r transition-all duration-300
              ${isSelected 
                ? `from-${typeConfig.borderColor}-500 via-${typeConfig.borderColor}-400 to-transparent w-full` 
                : `from-transparent via-${typeConfig.borderColor}-300/50 to-transparent w-0 group-hover:w-full`
              }
            `}></div>
          </button>
        );
      })}
    </div>
  );
}