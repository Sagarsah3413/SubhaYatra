import { FaMapMarkerAlt, FaHotel, FaUtensils, FaMountain, FaStar } from "react-icons/fa";
import SmartImage from "./SmartImage";

export default function SearchDropdownList({ results, onSelect, selectedIndex = -1, theme = 'light' }) {
  if (!results || results.length === 0) {
    return null;
  }

  const getTypeIcon = (type) => {
    const icons = {
      'Place': FaMountain,
      'Hotel': FaHotel,
      'Restaurant': FaUtensils,
      'Attraction': FaMapMarkerAlt
    };
    return icons[type] || FaMapMarkerAlt;
  };

  const getTypeColor = (type) => {
    const colors = {
      'Place': 'emerald',
      'Hotel': 'blue',
      'Restaurant': 'orange',
      'Attraction': 'purple'
    };
    return colors[type] || 'gray';
  };

  return (
    <div 
      className="overflow-y-auto"
      onMouseDown={(e) => e.stopPropagation()}
    >
      {results.map((item, index) => {
        const TypeIcon = getTypeIcon(item.type);
        const color = getTypeColor(item.type);
        const isSelected = selectedIndex === index;
        
        return (
          <button
            key={`${item.name}-${index}`}
            onClick={() => onSelect(item)}
            className={`
              w-full text-left transition-all duration-200
              ${isSelected 
                ? theme === 'dark'
                  ? 'bg-slate-700'
                  : 'bg-gray-100'
                : theme === 'dark' 
                  ? 'hover:bg-slate-750' 
                  : 'hover:bg-gray-50'
              }
            `}
          >
            <div className="px-3 py-2 flex items-center gap-2">
              {/* Image - Smaller */}
              <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden bg-gray-200 dark:bg-slate-700">
                <SmartImage
                  item={item}
                  className="w-full h-full object-cover"
                  style={{ width: '100%', height: '100%' }}
                  showLoader={false}
                  showFallbackIcon={true}
                />
              </div>
              
              {/* Content - Compact */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className={`
                    font-semibold text-xs truncate
                    ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
                  `}>
                    {item.name}
                  </h3>
                  
                  {item.rating && (
                    <div className="flex items-center gap-0.5 text-[10px] text-amber-600 dark:text-amber-400">
                      <FaStar />
                      {item.rating}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className={`
                    px-1.5 py-0.5 rounded-full
                    bg-${color}-100 dark:bg-${color}-900/30
                    text-${color}-700 dark:text-${color}-300
                  `}>
                    {item.type}
                  </span>
                  
                  {item.location && (
                    <span className={`
                      flex items-center gap-0.5 truncate
                      ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}
                    `}>
                      <FaMapMarkerAlt className="text-[8px] flex-shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </span>
                  )}
                </div>
              </div>
              
              {/* Arrow - Smaller */}
              <div className={`
                flex-shrink-0 opacity-0 transition-opacity duration-200
                ${isSelected ? 'opacity-100' : 'group-hover:opacity-100'}
              `}>
                <svg 
                  className={`w-4 h-4 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-400'}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
