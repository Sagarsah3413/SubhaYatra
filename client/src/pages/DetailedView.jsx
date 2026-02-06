import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { FaArrowLeft, FaMapMarkerAlt, FaStar, FaHeart, FaShare, FaCalendar, FaClock, FaUsers, FaPhone, FaEnvelope, FaGlobe } from 'react-icons/fa';
import ImageGallery from '../components/ImageGallery';
import SmartImage from '../components/SmartImage';
import placesService from '../services/placesService';

export default function DetailedView() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  const itemType = searchParams.get('type');
  const itemName = searchParams.get('name');
  const itemId = searchParams.get('id');

  useEffect(() => {
    loadItemDetails();
  }, [itemType, itemName, itemId]);

  const loadItemDetails = async () => {
    if (!itemType || (!itemName && !itemId)) {
      setError('Invalid item parameters');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // If we have an ID, fetch by ID, otherwise search by name
      let itemData;
      if (itemId) {
        itemData = await placesService.getPlaceDetails(itemId);
      } else {
        // Search for the item by name
        const searchResults = await placesService.searchPlaces(itemName);
        if (searchResults.results && searchResults.results.length > 0) {
          itemData = searchResults.results[0];
        } else {
          throw new Error('Item not found');
        }
      }

      // Normalize image data
      itemData = placesService.normalizeImageData(itemData);
      
      setItem(itemData);
    } catch (err) {
      console.error('Error loading item details:', err);
      setError(err.message || 'Failed to load item details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // TODO: Implement wishlist functionality
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.name,
          text: `Check out ${item.name} - ${item.description}`,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Loading details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-red-500 text-xl mb-4">{error || 'Item not found'}</p>
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaArrowLeft />
              Back
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={`p-3 rounded-full transition-all duration-300 ${
                  isLiked 
                    ? 'bg-red-500 text-white' 
                    : theme === 'dark' 
                    ? 'bg-gray-700 text-gray-300 hover:bg-red-500 hover:text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white'
                }`}
              >
                <FaHeart />
              </button>

              <button
                onClick={handleShare}
                className={`p-3 rounded-full transition-colors ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-blue-500 hover:text-white'
                }`}
              >
                <FaShare />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-6">
            <ImageGallery
              item={item}
              showThumbnails={true}
              showControls={true}
              maxHeight="500px"
              className="rounded-2xl overflow-hidden shadow-xl"
            />
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Title and Type */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.type === 'Place' ? 'bg-emerald-100 text-emerald-800' :
                  item.type === 'Hotel' ? 'bg-blue-100 text-blue-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {item.type}
                </span>
                {item.rating && (
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-500" />
                    <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {item.rating}
                    </span>
                  </div>
                )}
              </div>
              
              <h1 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {item.name}
              </h1>

              {item.location && (
                <div className="flex items-center gap-2 mb-4">
                  <FaMapMarkerAlt className="text-gray-500" />
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    {item.location}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            {item.description && (
              <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <h2 className={`text-xl font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  About
                </h2>
                <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {item.description}
                </p>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {item.best_season && (
                <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <div className="flex items-center gap-3">
                    <FaCalendar className="text-blue-500 text-xl" />
                    <div>
                      <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Best Season
                      </h3>
                      <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                        {item.best_season}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {item.difficulty_level && (
                <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <div className="flex items-center gap-3">
                    <FaClock className="text-green-500 text-xl" />
                    <div>
                      <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Difficulty
                      </h3>
                      <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                        {item.difficulty_level}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {item.price_range && (
                <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <div className="flex items-center gap-3">
                    <FaUsers className="text-purple-500 text-xl" />
                    <div>
                      <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Price Range
                      </h3>
                      <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                        {item.price_range}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {item.province && (
                <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-red-500 text-xl" />
                    <div>
                      <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Province
                      </h3>
                      <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                        {item.province}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Activities */}
            {item.activities && (
              <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <h2 className={`text-xl font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Activities
                </h2>
                <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {item.activities}
                </p>
              </div>
            )}

            {/* Tags */}
            {item.tags && (
              <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <h2 className={`text-xl font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {item.tags.split(',').map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        theme === 'dark' 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="flex-1 bg-blue-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-blue-600 transition-colors">
                Book Now
              </button>
              <button className="flex-1 bg-green-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-green-600 transition-colors">
                Get Directions
              </button>
            </div>
          </div>
        </div>

        {/* Related Hotels/Restaurants */}
        {(item.hotels?.length > 0 || item.restaurants?.length > 0) && (
          <div className="mt-12">
            <h2 className={`text-3xl font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Related Services
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Hotels */}
              {item.hotels?.length > 0 && (
                <div>
                  <h3 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Hotels
                  </h3>
                  <div className="space-y-4">
                    {item.hotels.slice(0, 3).map((hotel, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg flex gap-4`}
                      >
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <SmartImage
                            item={hotel}
                            size="small"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {hotel.name}
                          </h4>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {hotel.location}
                          </p>
                          {hotel.rating && (
                            <div className="flex items-center gap-1 mt-1">
                              <FaStar className="text-yellow-500 text-sm" />
                              <span className="text-sm font-medium">{hotel.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Restaurants */}
              {item.restaurants?.length > 0 && (
                <div>
                  <h3 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Restaurants
                  </h3>
                  <div className="space-y-4">
                    {item.restaurants.slice(0, 3).map((restaurant, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg flex gap-4`}
                      >
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <SmartImage
                            item={restaurant}
                            size="small"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {restaurant.name}
                          </h4>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {restaurant.location}
                          </p>
                          {restaurant.rating && (
                            <div className="flex items-center gap-1 mt-1">
                              <FaStar className="text-yellow-500 text-sm" />
                              <span className="text-sm font-medium">{restaurant.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}