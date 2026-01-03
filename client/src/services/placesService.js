// Places Service for fetching places data from backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const placesService = {
  /**
   * Get all places
   * @returns {Promise<Array>} Array of places
   */
  async getAllPlaces() {
    try {
      const response = await fetch(`${API_BASE_URL}/places`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching places:', error);
      return [];
    }
  },

  /**
   * Get place by ID
   * @param {number} placeId - Place ID
   * @returns {Promise<Object|null>} Place object or null
   */
  async getPlaceById(placeId) {
    try {
      const places = await this.getAllPlaces();
      return places.find(place => place.id === placeId) || null;
    } catch (error) {
      console.error('Error fetching place:', error);
      return null;
    }
  },

  /**
   * Search places by query
   * @param {string} query - Search query
   * @returns {Promise<Array>} Array of matching places
   */
  async searchPlaces(query) {
    try {
      const places = await this.getAllPlaces();
      const lowercaseQuery = query.toLowerCase();
      
      return places.filter(place => 
        place.name.toLowerCase().includes(lowercaseQuery) ||
        place.location.toLowerCase().includes(lowercaseQuery) ||
        (place.description && place.description.toLowerCase().includes(lowercaseQuery)) ||
        (place.tags && place.tags.toLowerCase().includes(lowercaseQuery))
      );
    } catch (error) {
      console.error('Error searching places:', error);
      return [];
    }
  }
};

export default placesService;