/**
 * Places Service - API interactions for places, hotels, and restaurants
 */

const API_BASE_URL = 'http://localhost:8000';

class PlacesService {
  /**
   * Get all places with optional filtering and pagination
   */
  async getPlaces(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Add filters
      if (params.type) queryParams.append('type', params.type);
      if (params.province) queryParams.append('province', params.province);
      if (params.difficulty) queryParams.append('difficulty', params.difficulty);
      if (params.search) queryParams.append('search', params.search);
      
      const response = await fetch(`${API_BASE_URL}/api/places?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching places:', error);
      throw error;
    }
  }

  /**
   * Get detailed information about a specific place
   */
  async getPlaceDetails(placeId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/places/${placeId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching place details:', error);
      throw error;
    }
  }

  /**
   * Get featured places (popular destinations)
   */
  async getFeaturedPlaces(limit = 6) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/places/featured?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching featured places:', error);
      throw error;
    }
  }

  /**
   * Search places with advanced filters
   */
  async searchPlaces(query, filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('q', query);
      
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.min_rating) queryParams.append('min_rating', filters.min_rating);
      if (filters.max_difficulty) queryParams.append('max_difficulty', filters.max_difficulty);
      
      const response = await fetch(`${API_BASE_URL}/api/places/search?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching places:', error);
      throw error;
    }
  }

  /**
   * Get all available place categories
   */
  async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/places/categories`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  /**
   * Get all available provinces
   */
  async getProvinces() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/places/provinces`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching provinces:', error);
      throw error;
    }
  }

  /**
   * Get hotels with filtering
   */
  async getHotels(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.place_id) queryParams.append('place_id', params.place_id);
      if (params.price_range) queryParams.append('price_range', params.price_range);
      if (params.min_rating) queryParams.append('min_rating', params.min_rating);
      if (params.search) queryParams.append('search', params.search);
      
      const response = await fetch(`${API_BASE_URL}/api/hotels?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching hotels:', error);
      throw error;
    }
  }

  /**
   * Get restaurants with filtering
   */
  async getRestaurants(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.place_id) queryParams.append('place_id', params.place_id);
      if (params.price_range) queryParams.append('price_range', params.price_range);
      if (params.min_rating) queryParams.append('min_rating', params.min_rating);
      if (params.search) queryParams.append('search', params.search);
      
      const response = await fetch(`${API_BASE_URL}/api/restaurants?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      throw error;
    }
  }

  /**
   * Create a new place (admin functionality)
   */
  async createPlace(placeData) {
    try {
      const formData = new FormData();
      
      // Add text fields
      Object.keys(placeData).forEach(key => {
        if (key !== 'images' && placeData[key] !== null && placeData[key] !== undefined) {
          formData.append(key, placeData[key]);
        }
      });
      
      // Add image files
      if (placeData.images && placeData.images.length > 0) {
        placeData.images.forEach((image, index) => {
          formData.append(`image_${index + 1}`, image);
        });
      }
      
      const response = await fetch(`${API_BASE_URL}/api/places`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating place:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new PlacesService();