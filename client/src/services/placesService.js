/**
 * Places Service - API interactions for places, hotels, and restaurants
 */

const API_BASE_URL = 'http://localhost:8000';

class PlacesService {
  /**
   * Normalize image data for consistent usage across components
   */
  normalizeImageData(item, defaultType = 'Place') {
    // Ensure the item has a type
    if (!item.type) {
      item.type = defaultType;
    }

    // Convert all_images from JSON string to array if needed
    if (item.all_images && typeof item.all_images === 'string') {
      try {
        item.all_images = JSON.parse(item.all_images);
      } catch (error) {
        console.warn('Failed to parse all_images JSON:', error);
        item.all_images = [];
      }
    }

    // Ensure all_images is an array
    if (!Array.isArray(item.all_images)) {
      item.all_images = [];
    }

    // If no all_images but has image_url, use image_url
    if (item.all_images.length === 0 && item.image_url) {
      item.all_images = [item.image_url];
    }

    // Legacy support: if item has 'images' array, merge it
    if (item.images && Array.isArray(item.images)) {
      item.all_images = [...new Set([...item.all_images, ...item.images])];
    }

    return item;
  }
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
      
      const data = await response.json();
      
      // Normalize image data for each place
      if (data.places) {
        data.places = data.places.map(place => this.normalizeImageData(place));
      }
      
      return data;
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
      
      const data = await response.json();
      
      // Normalize image data for each hotel
      if (data.hotels) {
        data.hotels = data.hotels.map(hotel => this.normalizeImageData(hotel, 'Hotel'));
      }
      
      return data;
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
      
      const data = await response.json();
      
      // Normalize image data for each restaurant
      if (data.restaurants) {
        data.restaurants = data.restaurants.map(restaurant => this.normalizeImageData(restaurant, 'Restaurant'));
      }
      
      return data;
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