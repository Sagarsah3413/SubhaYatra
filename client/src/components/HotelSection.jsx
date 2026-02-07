import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHotel, FaStar, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";
import placesService from "../services/placesService";
import SmartImage from "./SmartImage";

export default function HotelSection() {
  const { theme } = useTheme();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHotels = async () => {
      try {
        setLoading(true);
        const data = await placesService.getHotels({ limit: 6 });
        setHotels(data.hotels || []);
      } catch (error) {
        console.error('Error loading hotels:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHotels();
  }, []);

  if (loading) {
    return (
      <section className={`py-20 ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className={`mt-4 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
              Loading hotels...
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
          <div className="inline-flex items-center gap-3 bg-blue-50 dark:bg-blue-900/30 rounded-full px-6 py-3 mb-4">
            <FaHotel className="text-blue-600 dark:text-blue-400 text-xl" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              Cozy Stays
            </span>
          </div>
          
          <h2 className={`text-4xl md:text-5xl font-black mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Hotels
            </span>
          </h2>
          
          <p className={`text-lg max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
          }`}>
            Discover comfortable accommodations across Nepal
          </p>
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {hotels.map((hotel, index) => (
            <Link
              key={hotel.id || index}
              to={`/details?type=Hotel&name=${encodeURIComponent(hotel.name)}`}
              className={`group rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white'
              }`}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <SmartImage
                  item={{ ...hotel, type: 'Hotel' }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  showLoader={true}
                />
                {hotel.price_range && (
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {hotel.price_range}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className={`text-xl font-bold mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {hotel.name}
                </h3>

                <div className="flex items-center gap-2 mb-3">
                  <FaMapMarkerAlt className="text-red-500 flex-shrink-0" />
                  <span className={`text-sm line-clamp-1 ${
                    theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                  }`}>
                    {hotel.location}
                  </span>
                </div>

                {hotel.rating && (
                  <div className="flex items-center gap-2 mb-3">
                    <FaStar className="text-yellow-500" />
                    <span className={`font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {hotel.rating}
                    </span>
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                    }`}>
                      / 5.0
                    </span>
                  </div>
                )}

                <p className={`text-sm line-clamp-2 mb-4 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
                }`}>
                  {hotel.description || 'Comfortable accommodation in Nepal'}
                </p>

                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-4 transition-all">
                  <span>View Details</span>
                  <FaArrowRight className="text-sm" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            to="/searchresult?q=hotel"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            <span>View All Hotels</span>
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
