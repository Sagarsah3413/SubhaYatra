import { FaGlobe, FaHotel, FaUtensils, FaMapMarkedAlt } from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";

export default function CategoryFilter({ activeCategory, onCategoryChange }) {
  const { theme } = useTheme();

  const handleCategoryChange = (categoryId) => {
    onCategoryChange(categoryId);
    
    // Scroll to sections after a short delay to allow rendering
    setTimeout(() => {
      const sectionsElement = document.getElementById('category-sections');
      if (sectionsElement) {
        sectionsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const categories = [
    {
      id: "all",
      label: "Search All",
      subtitle: "Everything Nepal",
      icon: FaGlobe,
      gradient: "from-teal-500 to-cyan-600",
      bgGradient: "from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20"
    },
    {
      id: "hotel",
      label: "Hotels",
      subtitle: "Cozy Stays",
      icon: FaHotel,
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
    },
    {
      id: "place",
      label: "Things To Do",
      subtitle: "Exciting Experiences",
      icon: FaMapMarkedAlt,
      gradient: "from-emerald-500 to-green-600",
      bgGradient: "from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20"
    },
    {
      id: "restaurant",
      label: "Restaurants",
      subtitle: "Taste Adventures",
      icon: FaUtensils,
      gradient: "from-orange-500 to-red-600",
      bgGradient: "from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20"
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Section Title */}
      <div className="text-center mb-8">
        <h2 className={`text-3xl md:text-4xl font-black mb-3 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
            Explore by Category
          </span>
        </h2>
        <p className={`text-lg ${
          theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
        }`}>
          Choose what you're looking for
        </p>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`
                group relative overflow-hidden rounded-3xl p-8 transition-all duration-500 transform
                ${isActive 
                  ? 'scale-105 shadow-2xl' 
                  : 'hover:scale-105 hover:shadow-xl'
                }
                ${theme === 'dark'
                  ? isActive
                    ? 'bg-slate-700 border-2 border-teal-500'
                    : 'bg-slate-800 border border-slate-700 hover:border-slate-600'
                  : isActive
                    ? 'bg-white border-2 border-teal-500'
                    : 'bg-white border border-gray-200 hover:border-gray-300'
                }
              `}
            >
              {/* Background Gradient Effect */}
              <div className={`
                absolute inset-0 bg-gradient-to-br ${category.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500
                ${isActive ? 'opacity-100' : ''}
              `}></div>

              {/* Animated Border Glow */}
              {isActive && (
                <div className={`
                  absolute inset-0 bg-gradient-to-r ${category.gradient} opacity-20 animate-pulse
                `}></div>
              )}

              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Icon Container */}
                <div className={`
                  w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-500
                  ${isActive
                    ? `bg-gradient-to-br ${category.gradient} shadow-xl scale-110`
                    : theme === 'dark'
                      ? 'bg-slate-700 group-hover:bg-slate-600'
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }
                `}>
                  <Icon className={`
                    text-3xl transition-colors duration-300
                    ${isActive 
                      ? 'text-white' 
                      : theme === 'dark' 
                        ? 'text-slate-300 group-hover:text-teal-400' 
                        : 'text-gray-600 group-hover:text-teal-600'
                    }
                  `} />
                </div>

                {/* Label */}
                <h3 className={`
                  text-xl font-black mb-2 transition-colors duration-300
                  ${isActive
                    ? 'bg-gradient-to-r ' + category.gradient + ' bg-clip-text text-transparent'
                    : theme === 'dark'
                      ? 'text-white group-hover:text-teal-400'
                      : 'text-gray-900 group-hover:text-teal-600'
                  }
                `}>
                  {category.label}
                </h3>

                {/* Subtitle */}
                <p className={`
                  text-sm font-medium transition-colors duration-300
                  ${isActive
                    ? theme === 'dark' ? 'text-teal-300' : 'text-teal-600'
                    : theme === 'dark'
                      ? 'text-slate-400 group-hover:text-slate-300'
                      : 'text-gray-500 group-hover:text-gray-700'
                  }
                `}>
                  {category.subtitle}
                </p>

                {/* Active Indicator */}
                {isActive && (
                  <div className="mt-4 flex justify-center">
                    <div className={`
                      w-2 h-2 rounded-full bg-gradient-to-r ${category.gradient} animate-pulse
                    `}></div>
                  </div>
                )}

                {/* Hover Arrow */}
                <div className={`
                  mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0
                  ${isActive ? 'opacity-100 translate-y-0' : ''}
                `}>
                  <div className={`
                    inline-flex items-center gap-2 text-sm font-semibold
                    ${isActive
                      ? theme === 'dark' ? 'text-teal-400' : 'text-teal-600'
                      : theme === 'dark'
                        ? 'text-slate-400'
                        : 'text-gray-600'
                    }
                  `}>
                    <span>{isActive ? 'Viewing' : 'View'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Shimmer Effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          );
        })}
      </div>

      {/* Active Category Indicator */}
      {activeCategory !== "all" && (
        <div className="mt-8 text-center">
          <div className={`
            inline-flex items-center gap-3 px-6 py-3 rounded-full border-2
            ${theme === 'dark'
              ? 'bg-slate-800 border-teal-500 text-teal-400'
              : 'bg-white border-teal-500 text-teal-600'
            }
            shadow-lg
          `}>
            <span className="text-sm font-semibold">
              Showing: {categories.find(c => c.id === activeCategory)?.label}
            </span>
            <button
              onClick={() => handleCategoryChange("all")}
              className={`
                text-xs px-3 py-1 rounded-full transition-colors
                ${theme === 'dark'
                  ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }
              `}
            >
              Clear Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
