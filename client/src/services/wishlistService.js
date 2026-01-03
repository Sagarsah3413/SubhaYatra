// Wishlist Service for managing user's saved places
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Demo user ID - in a real app, this would come from authentication
const DEMO_USER_ID = 'demo_user_123';

export const wishlistService = {
  /**
   * Get all places in user's wishlist
   * @param {string} userId - User ID (optional, defaults to demo user)
   * @returns {Promise<Array>} Array of wishlist items
   */
  async getUserWishlist(userId = DEMO_USER_ID) {
    try {
      const response = await fetch(`${API_BASE_URL}/wishlist/${userId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      // Return fallback data on error
      return getFallbackWishlistData();
    }
  },

  /**
   * Add place to user's wishlist
   * @param {number} placeId - Place ID to add
   * @param {string} userId - User ID (optional, defaults to demo user)
   * @returns {Promise<Object>} Success response
   */
  async addToWishlist(placeId, userId = DEMO_USER_ID) {
    try {
      const response = await fetch(`${API_BASE_URL}/wishlist/${userId}/${placeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  },

  /**
   * Remove place from user's wishlist
   * @param {number} placeId - Place ID to remove
   * @param {string} userId - User ID (optional, defaults to demo user)
   * @returns {Promise<Object>} Success response
   */
  async removeFromWishlist(placeId, userId = DEMO_USER_ID) {
    try {
      const response = await fetch(`${API_BASE_URL}/wishlist/${userId}/${placeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  },

  /**
   * Check if place is in user's wishlist
   * @param {number} placeId - Place ID to check
   * @param {string} userId - User ID (optional, defaults to demo user)
   * @returns {Promise<boolean>} True if in wishlist
   */
  async isInWishlist(placeId, userId = DEMO_USER_ID) {
    try {
      const response = await fetch(`${API_BASE_URL}/wishlist/${userId}/${placeId}/check`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.in_wishlist;
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      return false;
    }
  }
};

// Fallback wishlist data for demo/offline mode
const getFallbackWishlistData = () => {
  console.log('Using fallback wishlist data. Check your backend connection.');
  
  return [
    {
      id: 1,
      name: 'Everest Base Camp Trek',
      category: 'trekking',
      location: 'Solukhumbu, Nepal',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
      rating: 4.9,
      reviews: 2847,
      duration: '14 days',
      difficulty: 'Challenging',
      price: '$1,299',
      description: 'Epic journey to the base of the world\'s highest mountain with stunning Himalayan views.',
      tags: 'trekking, mountains, adventure',
      added_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Annapurna Circuit',
      category: 'trekking',
      location: 'Annapurna Region, Nepal',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      rating: 4.8,
      reviews: 1923,
      duration: '16 days',
      difficulty: 'Moderate to Challenging',
      price: '$899',
      description: 'Classic trek through diverse landscapes from subtropical to alpine zones.',
      tags: 'trekking, circuit, mountains',
      added_at: new Date().toISOString()
    },
    {
      id: 3,
      name: 'Chitwan National Park Safari',
      category: 'wildlife',
      location: 'Chitwan, Nepal',
      image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800',
      rating: 4.7,
      reviews: 1456,
      duration: '3 days',
      difficulty: 'Easy',
      price: '$299',
      description: 'Wildlife adventure in Nepal\'s first national park with rhinos and tigers.',
      tags: 'wildlife, safari, nature',
      added_at: new Date().toISOString()
    }
  ];
};

export default wishlistService;