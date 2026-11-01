/**
 * Explorer Service — read-only access to the Explorer (facets) API.
 *
 * Mirrors the conventions in placesService.js:
 *   - singleton class
 *   - URLSearchParams for query building
 *   - try/catch + console.error, returns parsed JSON
 *
 * Endpoints (no auth):
 *   GET /api/places/explore?month=&difficulty=&province=&access=&page=&limit=
 *   GET /api/places/explore/options
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ExplorerService {
  /**
   * Filter choices + availability counts for the UI.
   * Returns { total_destinations, provinces, difficulties, access_types, months }.
   */
  async getOptions() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/places/explore/options`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching explore options:', error);
      throw error;
    }
  }

  /**
   * Explore destinations. All filters are optional and combined with AND on the
   * backend. Empty filters are omitted from the query string.
   *
   * @param {Object} params
   * @param {number|string} [params.month]      1..12
   * @param {string} [params.difficulty]         Easy|Moderate|Hard
   * @param {string} [params.province]           Koshi|Madhesh|Bagmati|Gandaki|Lumbini|Karnali|Sudurpashchim
   * @param {string} [params.access]             Road|Road+Hike|Trek|Fly-in
   * @param {number} [params.page]
   * @param {number} [params.limit]
   * @returns {Promise<{destinations:Array, total:number, page:number, limit:number, pages:number, filters:Object}>}
   */
  async explore({ month, difficulty, province, access, page, limit } = {}) {
    try {
      const queryParams = new URLSearchParams();

      // Omit empty filters.
      if (month !== undefined && month !== null && month !== '') queryParams.append('month', month);
      if (difficulty) queryParams.append('difficulty', difficulty);
      if (province) queryParams.append('province', province);
      if (access) queryParams.append('access', access);
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);

      const response = await fetch(`${API_BASE_URL}/api/places/explore?${queryParams}`);

      if (!response.ok) {
        // Surface backend validation messages (HTTP 400 with {error}) when present.
        let message = `HTTP error! status: ${response.status}`;
        try {
          const body = await response.json();
          if (body && body.error) message = body.error;
        } catch {
          /* non-JSON error body — keep default message */
        }
        throw new Error(message);
      }

      return await response.json();
    } catch (error) {
      console.error('Error exploring destinations:', error);
      // A failed fetch (server down / unreachable) surfaces as a TypeError with
      // no HTTP response. Tag it so the UI can show a clear "backend offline"
      // message instead of a generic error.
      if (error instanceof TypeError) {
        const offline = new Error('OFFLINE');
        offline.isOffline = true;
        throw offline;
      }
      throw error;
    }
  }
}

// Export singleton instance
export default new ExplorerService();
