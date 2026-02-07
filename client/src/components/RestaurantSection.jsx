import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUtensils, FaStar, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";
import placesService from "../services/placesService";
import SmartImage from "./SmartImage";

export default function RestaurantSection() {
  const { theme } = useTheme();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setLoading(true);
        const data = await placesService.getRestaurants({ limit: 6 });
        setRestaurants(data.restaurants || []);
      } catch (error) {
        console.error('Error loading restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, []);

  if (loading) {
    return (
      <section className={`py-20 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
            <p className={`mt-4 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
              Loading restaurants...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-20 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-orange-50 dark:bg-orange-900/30 rounded-full px-6 py-3 mb-4">
            <FaUtensils className="text-orange-600 dark:text-orange-400 text-xl" />
            <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">
              Dining Experiences
            </span>
          </div>
          
          <h2 className={`text-4xl md:text-5xl font-black mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
              Restaurants
            </span>
          </h2>
          
          <p className={`text-lg max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
          }`}>
            Savor authentic Nepali cuisine and international flavors
          </p>
        </div>

        {/* Restaurants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {restaurants.map((restaurant, index) => (
            <Link
              key={restaurant.id || index}
              to={`/details?type=Restaurant&name=${encodeURIComponent(restaurant.name)}`}
              className={`group rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                theme === 'dark' ? 'bg-slate-700 border border-slate-600' : 'bg-white'
              }`}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <SmartImage
                  item={{ ...restaurant, type: 'Restaurant' }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  showLoader={true}
                />
                {restaurant.price_range && (
                  <div className="absolute top-4 right-4 bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {restaurant.price_range}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className={`text-xl font-bold mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {restaurant.name}
                </h3>

                <div className="flex items-center gap-2 mb-3">
                  <FaMapMarkerAlt className="text-red-500 flex-shrink-0" />
                  <span className={`text-sm line-clamp-1 ${
                    theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                  }`}>
                    {restaurant.location}
                  </span>
                </div>

                {restaurant.rating && (
                  <div className="flex items-center gap-2 mb-3">
                    <FaStar className="text-yellow-500" />
                    <span className={`font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {restaurant.rating}
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
                  {restaurant.description || 'Delicious dining experience in Nepal'}
                </p>

                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-semibold group-hover:gap-4 transition-all">
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
            to="/searchresult?q=restaurant"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            <span>View All Restaurants</span>
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
