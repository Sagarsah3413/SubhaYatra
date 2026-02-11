/**
 * Recommendation Service
 * Handles all API calls related to travel recommendations
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Create a new recommendation request
 * @param {Object} preferences - User preferences for the trip
 * @returns {Promise<Object>} Recommendation results
 */
export const createRecommendation = async (preferences) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: preferences.name,
        age: preferences.age,
        phone: preferences.phone,
        travellers: preferences.travellers,
        tripDuration: preferences.tripDuration,
        travelMonth: preferences.travelMonth, // Added travel month
        tripTypes: preferences.tripTypes || [preferences.tripType], // Support multiple types
        userId: preferences.userId || 'anonymous'
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get recommendations');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating recommendation:', error);
    throw error;
  }
};

/**
 * Get a specific recommendation by ID
 * @param {number} recommendationId - The recommendation ID
 * @returns {Promise<Object>} Recommendation details
 */
export const getRecommendation = async (recommendationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/recommendations/${recommendationId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get recommendation');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting recommendation:', error);
    throw error;
  }
};

/**
 * Get all recommendations for a user
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} List of user recommendations
 */
export const getUserRecommendations = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/recommendations/user/${userId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get user recommendations');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting user recommendations:', error);
    throw error;
  }
};

/**
 * Get recommendation statistics
 * @returns {Promise<Object>} Recommendation stats
 */
export const getRecommendationStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/recommendations/stats`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get stats');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting recommendation stats:', error);
    throw error;
  }
};
