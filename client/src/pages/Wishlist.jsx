import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { wishlistService } from '../services/wishlistService';
import { 
  FaHeart, 
  FaMapMarkerAlt, 
  FaStar,
  FaTrash,
  FaSearch,
  FaBookmark,
  FaArrowRight,
  FaMountain,
  FaTree,
  FaBuilding,
  FaCamera,
  FaGlobe,
  FaExclamationTriangle
} from 'react-icons/fa';

const Wishlist = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [wishlistItems, setWishlistItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load wishlist data from API
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await wishlistService.getUserWishlist();
        setWishlistItems(data);
        setFilteredItems(data);
      } catch (err) {
        console.error('Failed to load wishlist:', err);
        setError('Failed to load wishlist. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, []);

  // Filter functionality
  useEffect(() => {
    let filtered = wishlistItems;

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [wishlistItems, searchQuery]);

  const removeFromWishlist = async (itemId) => {
    try {
      await wishlistService.removeFromWishlist(itemId);
      const removedItem = wishlistItems.find(item => item.id === itemId);
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
      setFilteredItems(prev => prev.filter(item => item.id !== itemId));
      
      // Show success message (you can replace this with a toast notification)
      console.log(`✅ Removed "${removedItem?.name}" from wishlist`);
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
      setError('Failed to remove item. Please try again.');
      
      // Clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'trekking': return FaMountain;
      case 'culture': return FaBuilding;
      case 'nature': return FaTree;
      case 'wildlife': return FaCamera;
      default: return FaGlobe;
    }
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty.includes('Easy')) return 'text-green-600 bg-green-100';
    if (difficulty.includes('Moderate')) return 'text-yellow-600 bg-yellow-100';
    if (difficulty.includes('Challenging')) return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Loading your wishlist...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            theme === 'dark' ? 'bg-red-900/20' : 'bg-red-100'
          }`}>
            <FaExclamationTriangle className="text-2xl text-red-500" />
          </div>
          <p className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className={`absolute inset-0 ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900' 
              : 'bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900'
          }`}></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white">
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-white/20">
              <FaHeart className="text-red-400" />
              <span className="font-semibold">Your Travel Dreams</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-emerald-300 bg-clip-text text-transparent">
                My Wishlist
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-cyan-100 mb-4 max-w-4xl mx-auto leading-relaxed">
              Save and organize your dream destinations for future adventures
            </p>
            
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <FaBookmark className="text-teal-400" />
                <span>{wishlistItems.length} Saved Places</span>
              </div>
              <div className="flex items-center gap-2">
                <FaHeart className="text-red-400" />
                <span>Personalized Collection</span>
              </div>
              {wishlistItems.length > 0 && wishlistItems[0].added_at && (
                <div className="flex items-center gap-2">
                  <FaGlobe className="text-blue-400" />
                  <span>Real API Data</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search your wishlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-6 py-4 rounded-2xl border-2 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
              }`}
            />
            <FaSearch className="absolute right-6 top-1/2 transform -translate-y-1/2 text-teal-500 text-lg" />
          </div>
        </div>
      </section>

      {/* Wishlist Content */}
      <main className="max-w-7xl mx-auto px-6 pb-20">
        {filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
              theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
            }`}>
              <FaHeart className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4">
              {searchQuery ? 'No matches found' : 'Your wishlist is empty'}
            </h3>
            <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
              {searchQuery 
                ? 'Try adjusting your search'
                : 'Start exploring and save places you\'d love to visit'
              }
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Explore Destinations
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <WishlistCard
                key={item.id}
                item={item}
                theme={theme}
                onRemove={() => removeFromWishlist(item.id)}
                getCategoryIcon={getCategoryIcon}
                getDifficultyColor={getDifficultyColor}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

// Simplified Wishlist Card Component
const WishlistCard = ({ item, theme, onRemove, getCategoryIcon, getDifficultyColor }) => {
  const CategoryIcon = getCategoryIcon(item.category);
  
  return (
    <div className={`group rounded-3xl border transition-all duration-500 hover:transform hover:-translate-y-2 ${
      theme === 'dark'
        ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
        : 'bg-white border-gray-200 hover:border-gray-300'
    } shadow-lg hover:shadow-2xl overflow-hidden`}>
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800';
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Top Actions */}
        <div className="absolute top-4 right-4">
          <button
            onClick={onRemove}
            className="w-10 h-10 rounded-full bg-red-500/80 border border-red-400/40 text-white backdrop-blur-sm hover:bg-red-600/90 transition-all duration-300 flex items-center justify-center"
          >
            <FaTrash />
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 border border-white/30">
            <CategoryIcon className="text-white text-sm" />
            <span className="text-white text-sm font-medium capitalize">{item.category}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="absolute bottom-4 right-4">
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 border border-white/30">
            <FaStar className="text-yellow-400 text-sm" />
            <span className="text-white text-sm font-bold">{item.rating}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 group-hover:text-teal-500 transition-colors duration-300">
          {item.name}
        </h3>
        
        <div className="flex items-center gap-2 mb-3">
          <FaMapMarkerAlt className="text-teal-500 text-sm" />
          <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
            {item.location}
          </span>
        </div>

        <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
          {item.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getDifficultyColor(item.difficulty)}`}>
            {item.difficulty}
          </span>
          <span className="text-sm font-medium">{item.duration}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
              ({item.reviews} reviews)
            </span>
          </div>
          <span className="text-xl font-bold text-teal-500">{item.price}</span>
        </div>

        <button className="w-full mt-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2">
          <span>View Details</span>
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Wishlist;