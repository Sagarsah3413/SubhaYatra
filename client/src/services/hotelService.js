// Hotel Service for fetching hotel data from backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const hotelService = {
  /**
   * Get all hotels from the hotels table
   * @returns {Promise<Array>} Array of hotels
   */
  async getAllHotels() {
    try {
      console.log('Fetching from API:', `${API_BASE_URL}/hotels`);
      const response = await fetch(`${API_BASE_URL}/hotels`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Hotels received:', data);
      
      return data;
    } catch (error) {
      console.error('Error fetching hotels:', error);
      return [];
    }
  },

  /**
   * Get total count of hotels directly from backend
   * @returns {Promise<number>} Total number of hotels
   */
  async getHotelCount() {
    try {
      console.log('Fetching hotel count from:', `${API_BASE_URL}/hotels/count`);
      const response = await fetch(`${API_BASE_URL}/hotels/count`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Hotel count received:', data);
      
      return data.count || 0;
    } catch (error) {
      console.error('Error fetching hotel count:', error);
      // Fallback to getting all hotels and counting
      try {
        const hotels = await this.getAllHotels();
        return hotels.length;
      } catch (fallbackError) {
        console.error('Fallback hotel count failed:', fallbackError);
        return 0;
      }
    }
  },

  /**
   * Get hotel by ID
   * @param {number} hotelId - Hotel ID
   * @returns {Promise<Object|null>} Hotel object or null
   */
  async getHotelById(hotelId) {
    try {
      const hotels = await this.getAllHotels();
      return hotels.find(hotel => hotel.id === hotelId) || null;
    } catch (error) {
      console.error('Error fetching hotel:', error);
      return null;
    }
  }
};

export default hotelService;