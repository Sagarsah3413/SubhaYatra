import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useTheme } from "../contexts/ThemeContext";
import { useToast } from "../contexts/ToastContext";
import { 
  FaArrowLeft, 
  FaMapMarkerAlt, 
  FaStar, 
  FaHeart, 
  FaShare, 
  FaCalendar, 
  FaClock, 
  FaPhone, 
  FaEnvelope, 
  FaGlobe,
  FaWifi,
  FaParking,
  FaSwimmingPool,
  FaCoffee,
  FaUtensils,
  FaHotel,
  FaMountain,
  FaBookmark,
  FaDirections,
  FaExternalLinkAlt,
  FaSpinner,
  FaExclamationTriangle,
  FaChevronDown,
  FaChevronUp,
  FaEye,
  FaThumbsUp,
  FaFlag,
  FaInfoCircle,
  FaRoute,
  FaCompass
} from "react-icons/fa";
import ImageGallery from "../components/ImageGallery";
import SmartImage from "../components/SmartImage";

export default function DetailPage() {
  const { theme } = useTheme();
  const { showWishlist, showSuccess, showInfo } = useToast();
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  
  const search = new URLSearchParams(useLocation().search);
  const type = search.get("type");
  const name = search.get("name");

  // Mock enhanced data
  const mockEnhancedData = {
    rating: (4.2 + Math.random() * 0.7).toFixed(1),
    reviews: Math.floor(Math.random() * 2000) + 100,
    views: Math.floor(Math.random() * 10000) + 1000,
    likes: Math.floor(Math.random() * 1000) + 50,
    entryFee: type === 'Hotel' ? `NPR ${Math.floor(Math.random() * 3000) + 800}` :
              type === 'Restaurant' ? `NPR ${Math.floor(Math.random() * 600) + 150}` :
              `NPR ${Math.floor(Math.random() * 500) + 50}`,
    originalFee: type === 'Hotel' ? `NPR ${Math.floor(Math.random() * 4000) + 1200}` :
                 type === 'Restaurant' ? `NPR ${Math.floor(Math.random() * 800) + 250}` :
                 `NPR ${Math.floor(Math.random() * 700) + 100}`,
    discount: Math.floor(Math.random() * 30) + 10,
    verified: Math.random() > 0.6,
    trending: Math.random() > 0.8,
    freeWifi: Math.random() > 0.6,
    freeParking: Math.random() > 0.5,
    pool: type === 'Hotel' && Math.random() > 0.7,
    breakfast: type === 'Hotel' && Math.random() > 0.6,
    satisfaction: Math.floor(Math.random() * 15) + 85,
    openingHours: type === 'Restaurant' ? "10:00 AM - 10:00 PM" : 
                  type === 'Hotel' ? "24/7 Check-in" : 
                  "6:00 AM - 6:00 PM",
    phone: "+977-1-" + Math.floor(Math.random() * 9000000 + 1000000),
    email: "info@" + (name?.toLowerCase().replace(/\s+/g, '') || 'venue') + ".com",
    website: "www." + (name?.toLowerCase().replace(/\s+/g, '') || 'venue') + ".com",
    bestTimeToVisit: type === 'Place' ? "October to December" : "Year Round",
    difficulty: type === 'Place' ? ["Easy", "Moderate", "Challenging"][Math.floor(Math.random() * 3)] : null,
    duration: type === 'Place' ? `${Math.floor(Math.random() * 6) + 1}-${Math.floor(Math.random() * 4) + 2} hours` : null
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `http://localhost:8000/api/details/${type}/${encodeURIComponent(name)}`
        );
        if (!res.ok) throw new Error("Failed to fetch details");
        const json = await res.json();
        
        // Enhance data with mock features
        const enhancedData = {
          ...json,
          type: type,
          ...mockEnhancedData
        };
        
        setData(enhancedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (type && name) {
      fetchDetails();
    }
  }, [type, name]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleBookmark = async () => {
    if (!isSignedIn) {
      showInfo(
        "Sign In Required",
        "Please sign in to add places to your wishlist."
      );
      navigate('/sign-in');
      return;
    }

    if (!data || !data.id) {
      showInfo("Error", "Place information not available.");
      return;
    }

    setIsAddingToWishlist(true);

    try {
      const userId = user.id;
      const placeId = data.id;

      if (isBookmarked) {
        // Remove from wishlist
        const response = await fetch(`http://localhost:8000/api/wishlist/${userId}/${placeId}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to remove from wishlist');

        setIsBookmarked(false);
        showSuccess(
          "Removed from Wishlist",
          `${data.name} has been removed from your wishlist.`
        );
      } else {
        // Add to wishlist
        const response = await fetch(`http://localhost:8000/api/wishlist/${userId}/${placeId}`, {
          method: 'POST',
        });

        if (!response.ok) throw new Error('Failed to add to wishlist');

        setIsBookmarked(true);
        showWishlist(
          "Added to Travel Wishlist",
          `${data.name} has been saved to your personal travel collection.`,
          {
            action: {
              label: "View Wishlist",
              onClick: () => navigate('/wishlist')
            }
          }
        );
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      showInfo(
        "Error",
        "Failed to update wishlist. Please try again."
      );
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  // Check if place is in wishlist on load
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (isSignedIn && user && data && data.id) {
        try {
          const userId = user.id;
          const placeId = data.id;
          const response = await fetch(`http://localhost:8000/api/wishlist/${userId}/${placeId}/check`);
          
          if (response.ok) {
            const result = await response.json();
            setIsBookmarked(result.in_wishlist);
          }
        } catch (error) {
          console.error('Error checking wishlist status:', error);
        }
      }
    };

    checkWishlistStatus();
  }, [isSignedIn, user, data]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.name,
          text: `Check out ${data.name} - ${data.description}`,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const getTypeIcon = (itemType) => {
    const iconMap = {
      'Place': FaMountain,
      'Hotel': FaHotel,
      'Restaurant': FaUtensils
    };
    return iconMap[itemType] || FaMountain;
  };

  const getTypeColor = (itemType) => {
    const colorMap = {
      'Place': 'emerald',
      'Hotel': 'blue',
      'Restaurant': 'orange'
    };
    return colorMap[itemType] || 'gray';
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <FaSpinner className="text-4xl text-blue-500 animate-spin mx-auto mb-4" />
          <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Loading Details...
          </h2>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center max-w-md mx-auto p-8">
          <FaExclamationTriangle className="text-5xl text-red-500 mx-auto mb-4" />
          <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Something went wrong
          </h2>
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {error || 'The requested item could not be found'}
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaArrowLeft className="inline mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const TypeIcon = getTypeIcon(data.type);
  const typeColor = getTypeColor(data.type);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg sticky top-0 z-10`}>
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
                className={`p-2 rounded-lg transition-colors ${
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
                onClick={handleBookmark}
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked 
                    ? 'bg-yellow-500 text-white' 
                    : theme === 'dark' 
                    ? 'bg-gray-700 text-gray-300 hover:bg-yellow-500 hover:text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-yellow-500 hover:text-white'
                }`}
              >
                <FaBookmark />
              </button>

              <button
                onClick={handleShare}
                className={`p-2 rounded-lg transition-colors ${
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
          <div>
            <ImageGallery
              item={data}
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
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-${typeColor}-500 text-white`}>
                  <TypeIcon className="text-xl" />
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${typeColor}-100 text-${typeColor}-800`}>
                  {data.type}
                </span>
                {data.verified && (
                  <span className="px-2 py-1 bg-blue-500 text-white rounded-full text-xs font-medium flex items-center gap-1">
                    <FaFlag className="text-xs" />
                    Verified
                  </span>
                )}
                {data.trending && (
                  <span className="px-2 py-1 bg-red-500 text-white rounded-full text-xs font-medium">
                    🔥 Trending
                  </span>
                )}
              </div>
              
              <h1 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {data.name}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <FaMapMarkerAlt className="text-red-500" />
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    {data.location}
                  </span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={`${i < Math.floor(data.rating) ? 'text-yellow-500' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className={`font-semibold ml-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {data.rating}
                  </span>
                </div>
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  ({data.reviews} reviews)
                </span>
              </div>

              {/* Entry Fee */}
              <div className="flex items-center gap-3 mb-6">
                {data.discount > 15 && (
                  <span className={`text-lg line-through ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {data.originalFee}
                  </span>
                )}
                <span className={`text-3xl font-bold text-${typeColor}-600`}>
                  {data.entryFee}
                </span>
                {data.discount > 15 && (
                  <span className="px-2 py-1 bg-red-500 text-white rounded-full text-sm font-medium">
                    {data.discount}% OFF
                  </span>
                )}
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {type === 'Hotel' ? 'per night' : type === 'Restaurant' ? 'avg cost' : 'entry fee'}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className={`text-center p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow`}>
                <FaEye className="text-blue-500 text-xl mx-auto mb-1" />
                <div className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {(data.views / 1000).toFixed(1)}K
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Views</div>
              </div>

              <div className={`text-center p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow`}>
                <FaStar className="text-yellow-500 text-xl mx-auto mb-1" />
                <div className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {data.rating}
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Rating</div>
              </div>

              <div className={`text-center p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow`}>
                <FaThumbsUp className="text-green-500 text-xl mx-auto mb-1" />
                <div className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {data.satisfaction}%
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Satisfaction</div>
              </div>
            </div>

            {/* Description */}
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h2 className={`text-xl font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                About
              </h2>
              <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                <p className={showFullDescription ? '' : 'line-clamp-3'}>
                  {data.description}
                </p>
                {data.description && data.description.length > 200 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className={`mt-2 flex items-center gap-1 text-${typeColor}-500 hover:text-${typeColor}-600 font-medium`}
                  >
                    {showFullDescription ? (
                      <>
                        <FaChevronUp />
                        Show Less
                      </>
                    ) : (
                      <>
                        <FaChevronDown />
                        Read More
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Contact Information
              </h2>
              
              <div className="space-y-4">
                {/* Venue Contact */}
                <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {data.name}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <FaPhone className={`text-${typeColor}-500`} />
                      <a href={`tel:${data.phone}`} className={`hover:text-${typeColor}-500 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {data.phone}
                      </a>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <FaEnvelope className={`text-${typeColor}-500`} />
                      <a href={`mailto:${data.email}`} className={`hover:text-${typeColor}-500 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {data.email}
                      </a>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <FaGlobe className={`text-${typeColor}-500`} />
                      <a href={`https://${data.website}`} target="_blank" rel="noopener noreferrer" className={`hover:text-${typeColor}-500 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {data.website}
                      </a>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <FaClock className={`text-${typeColor}-500`} />
                      <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                        {data.openingHours}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Roamio Wanderly Contact */}
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30' : 'bg-gradient-to-r from-blue-50 to-purple-50'} border-2 border-blue-200 dark:border-blue-700`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <FaCompass className="text-white text-sm" />
                    </div>
                    <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Roamio Wanderly
                    </h3>
                    <span className="px-2 py-1 bg-blue-500 text-white rounded-full text-xs font-medium">
                      Travel Partner
                    </span>
                  </div>
                  
                  <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Need help planning your visit? Our travel experts are here to assist you!
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <FaPhone className="text-blue-500" />
                      <a href="tel:+977-1-4567890" className="hover:text-blue-500 text-gray-700 dark:text-gray-300">
                        +977-1-4567890
                      </a>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <FaEnvelope className="text-blue-500" />
                      <a href="mailto:info@roamiowanderly.com" className="hover:text-blue-500 text-gray-700 dark:text-gray-300">
                        info@roamiowanderly.com
                      </a>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <FaGlobe className="text-blue-500" />
                      <a href="https://roamiowanderly.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 text-gray-700 dark:text-gray-300">
                        www.roamiowanderly.com
                      </a>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <FaClock className="text-blue-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        24/7 Travel Support
                      </span>
                    </div>
                  </div>
                  
                  <div className={`mt-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                    <p className={`text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                      🌟 Get personalized travel recommendations, local insights, and expert guidance for your Nepal adventure!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Amenities
              </h2>
              
              <div className="grid grid-cols-2 gap-3">
                {data.freeWifi && (
                  <div className="flex items-center gap-2">
                    <FaWifi className={`text-${typeColor}-500`} />
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Free WiFi</span>
                  </div>
                )}
                
                {data.freeParking && (
                  <div className="flex items-center gap-2">
                    <FaParking className={`text-${typeColor}-500`} />
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Free Parking</span>
                  </div>
                )}
                
                {data.pool && (
                  <div className="flex items-center gap-2">
                    <FaSwimmingPool className={`text-${typeColor}-500`} />
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Swimming Pool</span>
                  </div>
                )}
                
                {data.breakfast && (
                  <div className="flex items-center gap-2">
                    <FaCoffee className={`text-${typeColor}-500`} />
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Breakfast</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={handleBookmark}
                disabled={isAddingToWishlist}
                className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 shadow-lg bg-gradient-to-r from-${typeColor}-500 to-${typeColor}-600 hover:from-${typeColor}-600 hover:to-${typeColor}-700 hover:shadow-${typeColor}-500/25 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isAddingToWishlist ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    {isBookmarked ? 'Removing...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <FaHeart className={isBookmarked ? 'fill-current' : ''} />
                    {isBookmarked ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </>
                )}
              </button>
              
              <button 
                onClick={() => {
                  // Open Google Maps with the location
                  const location = data.location || 'Nepal';
                  const query = encodeURIComponent(`${data.name}, ${location}`);
                  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
                  window.open(mapsUrl, '_blank');
                  
                  showSuccess(
                    "Directions Opened",
                    "Google Maps has been opened in a new tab with the location details. Safe travels!"
                  );
                }}
                className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold border-2 transition-all duration-300 hover:scale-105 shadow-lg ${
                  theme === 'dark' 
                    ? 'border-gray-600 text-white hover:bg-gray-700 hover:shadow-gray-500/25' 
                    : 'border-gray-300 text-gray-900 hover:bg-gray-100 hover:shadow-gray-500/25'
                }`}
              >
                <FaDirections />
                Get Directions
              </button>
            </div>

            {/* Additional Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => {
                  // Navigate to itinerary planner with current destination
                  navigate('/guide', { 
                    state: { 
                      preselectedDestination: {
                        name: data.name,
                        type: data.type,
                        location: data.location,
                        description: data.description
                      }
                    }
                  });
                }}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                  theme === 'dark' 
                    ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-purple-500/25' 
                    : 'bg-purple-500 text-white hover:bg-purple-600 shadow-lg hover:shadow-purple-500/25'
                }`}
              >
                <FaRoute />
                Plan Itinerary
              </button>
              
              <button 
                onClick={handleShare}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                  theme === 'dark' 
                    ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-green-500/25' 
                    : 'bg-green-500 text-white hover:bg-green-600 shadow-lg hover:shadow-green-500/25'
                }`}
              >
                <FaShare />
                Share Experience
              </button>
              
              <button 
                onClick={() => {
                  // Navigate to Itinerary planner Travel Tips section
                  navigate('/itinerary', { 
                    state: { 
                      openTab: 'tips',
                      fromDetailPage: true 
                    } 
                  });
                }}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                  theme === 'dark' 
                    ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg hover:shadow-orange-500/25' 
                    : 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-orange-500/25'
                }`}
              >
                <FaInfoCircle />
                Get Local Tips
              </button>
            </div>

            {/* Wikipedia Link */}
            {data.wikipedia_url && (
              <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <a
                  href={data.wikipedia_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 text-${typeColor}-500 hover:text-${typeColor}-600 font-medium`}
                >
                  <FaExternalLinkAlt />
                  Learn more on Wikipedia
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
