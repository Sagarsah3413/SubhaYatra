import { FaMapMarkerAlt, FaHotel, FaUtensils, FaMapMarkedAlt, FaMountain } from "react-icons/fa";

export default function SearchDropdownList({ results, onSelect, selectedIndex = -1, theme = 'light' }) {
  console.log('SearchDropdownList rendered with:', { results, selectedIndex, theme });
  
  if (!results || results.length === 0) {
    console.log('No results to display');
    return (
      <div className={`px-4 py-1 text-center text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
        No suggestions found
      </div>
    );
  }

  const getTypeIcon = (type) => {
    const icons = {
      'Place': FaMountain,
      'Hotel': FaHotel,
      'Restaurant': FaUtensils,
      'Attraction': FaMapMarkedAlt
    };
    return icons[type] || FaMapMarkerAlt;
  };

  return (
    <div className="max-h-32 overflow-y-auto">
      {results.map((item, index) => {
        const TypeIcon = getTypeIcon(item.type);
        const isSelected = selectedIndex === index;
        
        return (
          <button
            key={`${item.name}-${index}`}
            onClick={() => onSelect(item)}
            className={`
              w-full px-4 py-1 text-left transition-all duration-150
              flex items-center gap-2 hover:scale-[1.005]
              ${isSelected 
                ? theme === 'dark' 
                  ? 'bg-teal-900/30 border-l-2 border-teal-500' 
                  : 'bg-teal-50 border-l-2 border-teal-500'
                : theme === 'dark' 
                  ? 'hover:bg-slate-700/30' 
                  : 'hover:bg-gray-50'
              }
            `}
          >
            <div className={`
              w-5 h-5 rounded-sm flex items-center justify-center flex-shrink-0
              ${theme === 'dark' 
                ? 'bg-slate-600 text-slate-300' 
                : 'bg-gray-100 text-gray-600'
              }
            `}>
              <TypeIcon className="text-xs" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className={`
                font-medium text-xs truncate
                ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
              `}>
                {item.name}
              </div>
              <div className={`
                text-xs truncate opacity-75
                ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}
              `}>
                {item.location || 'Nepal'} • {item.type}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}