/**
 * Itinerary Service — persists user itineraries to the backend.
 *
 * Mirrors the conventions in placesService.js / explorerService.js:
 *   - singleton class
 *   - import.meta.env.VITE_API_URL base with localhost fallback
 *   - try/catch + console.error, returns parsed JSON
 *   - surfaces backend error messages when present
 *
 * Auth is a plain header (NOT a JWT): `X-Clerk-User-Id` is required on every
 * list/create/update/delete request, with an optional `X-Clerk-User-Name`.
 *
 * Endpoints (base `${API_BASE_URL}`):
 *   GET    /api/itineraries          (header required) → array of itineraries
 *   POST   /api/itineraries          (header required) → 201 created itinerary
 *   GET    /api/itineraries/<id>     (public readable; private requires owner)
 *   PUT    /api/itineraries/<id>     (header required, owner only)
 *   DELETE /api/itineraries/<id>     (header required, owner only)
 */

import { API_URL } from '../config/api';

const API_BASE_URL = API_URL;

class ItineraryService {
  /**
   * Build request headers. Always JSON; attach the Clerk id (and name when
   * available) so the backend can scope the request to the signed-in user.
   */
  buildHeaders(clerkId, userName) {
    const headers = { 'Content-Type': 'application/json' };
    if (clerkId) headers['X-Clerk-User-Id'] = clerkId;
    if (userName) headers['X-Clerk-User-Name'] = userName;
    return headers;
  }

  /**
   * Read the response, surfacing a backend `error` message (HTTP 4xx/5xx with
   * {error}) instead of a generic status when present.
   */
  async parse(response) {
    if (!response.ok) {
      let message = `HTTP error! status: ${response.status}`;
      try {
        const body = await response.json();
        if (body && body.error) message = body.error;
      } catch {
        /* non-JSON error body — keep default message */
      }
      throw new Error(message);
    }
    return response.json();
  }

  /**
   * List the signed-in user's itineraries.
   * @param {string} clerkId
   * @returns {Promise<Array>}
   */
  async list(clerkId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/itineraries`, {
        headers: this.buildHeaders(clerkId),
      });
      return await this.parse(response);
    } catch (error) {
      console.error('Error listing itineraries:', error);
      throw error;
    }
  }

  /**
   * Create a new itinerary for the signed-in user.
   * @param {string} clerkId
   * @param {string|null} userName
   * @param {Object} payload  {title, description, start_date, end_date, is_public, total_budget, items:[...]}
   * @returns {Promise<Object>} the created itinerary (to_dict shape, incl. id + items)
   */
  async create(clerkId, userName, payload) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/itineraries`, {
        method: 'POST',
        headers: this.buildHeaders(clerkId, userName),
        body: JSON.stringify(payload),
      });
      return await this.parse(response);
    } catch (error) {
      console.error('Error creating itinerary:', error);
      throw error;
    }
  }

  /**
   * Fetch a single itinerary. Public itineraries are readable without a header;
   * private ones require the owner's clerk id.
   * @param {number|string} id
   * @param {string} [clerkId]
   * @returns {Promise<Object>}
   */
  async get(id, clerkId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/itineraries/${id}`, {
        headers: this.buildHeaders(clerkId),
      });
      return await this.parse(response);
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      throw error;
    }
  }

  /**
   * Update an itinerary (owner only).
   * @param {number|string} id
   * @param {string} clerkId
   * @param {Object} payload
   * @returns {Promise<Object>} the updated itinerary
   */
  async update(id, clerkId, payload) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/itineraries/${id}`, {
        method: 'PUT',
        headers: this.buildHeaders(clerkId),
        body: JSON.stringify(payload),
      });
      return await this.parse(response);
    } catch (error) {
      console.error('Error updating itinerary:', error);
      throw error;
    }
  }

  /**
   * Delete an itinerary (owner only).
   * @param {number|string} id
   * @param {string} clerkId
   * @returns {Promise<Object>} {success:true}
   */
  async remove(id, clerkId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/itineraries/${id}`, {
        method: 'DELETE',
        headers: this.buildHeaders(clerkId),
      });
      return await this.parse(response);
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new ItineraryService();
