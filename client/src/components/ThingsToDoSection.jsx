import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkedAlt, FaStar, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";
import placesService from "../services/placesService";
import SmartImage from "./SmartImage";

export default function ThingsToDoSection() {
  const { theme } = useTheme();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlaces = async () => {
      try {
        setLoading(true);
        const data = await placesService.getPlaces({ limit: 6 });
        setPlaces(data.places || []);
      } catch (error) {
        console.error('Error loading places:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPlaces();
  }, []);

  if (loading) {
    return (
      <section className={`py-20 ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-teal-500 border-t-transparent rounded-full mx-auto"></div>
            <p className={`mt-4 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
              Loading places...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-20 ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-teal-50 dark:bg-teal-900/30 rounded-full px-6 py-3 mb-4">
            <FaMapMarkedAlt className="text-teal-600 dark:text-teal-400 text-xl" />
            <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">
              Exciting Experiences
            </span>
          </div>
          
          <h2 className={`text-4xl md:text-5xl font-black mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
              Things To Do
            </span>
          </h2>
          
          <p className={`text-lg max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
          }`}>
            Explore amazing destinations and unforgettable adventures
          </p>
        </div>

        {/* Places Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {places.map((place, index) => (
            <Link
              key={place.id || index}
              to={`/details?type=Place&name=${encodeURIComponent(place.name)}`}
              className={`group rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white'
              }`}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <SmartImage
                  item={{ ...place, type: 'Place' }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  showLoader={true}
                />
                {place.difficulty_level && (
                  <div className="absolute top-4 right-4 bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {place.difficulty_level}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className={`text-xl font-bold mb-2 line-clamp-1 group-hover:text-teal-600 transition-colors ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {place.name}
                </h3>

                <div className="flex items-center gap-2 mb-3">
                  <FaMapMarkerAlt className="text-red-500 flex-shrink-0" />
                  <span className={`text-sm line-clamp-1 ${
                    theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                  }`}>
                    {place.location}
                  </span>
                </div>

                {place.type && (
                  <div className="mb-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      theme === 'dark' 
                        ? 'bg-teal-900/50 text-teal-300' 
                        : 'bg-teal-100 text-teal-700'
                    }`}>
                      {place.type}
                    </span>
                  </div>
                )}

                <p className={`text-sm line-clamp-2 mb-4 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
                }`}>
                  {place.description || 'Discover this amazing destination in Nepal'}
                </p>

                <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-semibold group-hover:gap-4 transition-all">
                  <span>Explore Now</span>
                  <FaArrowRight className="text-sm" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            to="/searchresult?q=place"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            <span>View All Places</span>
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
