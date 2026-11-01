/**
 * Image Service — resolves image_url from DB to a full API URL.
 * Seeded paths look like:
 *   /api/images/destinations/<dest_folder>/<file>
 *   /api/images/hotels/<dest_folder>/<hotel_name>/<file>
 *   /api/images/restaurants/<dest_folder>/<rest_name>/<file>
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function encodePath(path) {
  // Encode each segment individually, preserving slashes
  return path.split('/').map(seg => encodeURIComponent(seg)).join('/');
}

class ImageService {
  getImageUrl(item, imageIndex = 0) {
    if (!item) return null;

    let path = null;

    if (item.all_images && Array.isArray(item.all_images) && item.all_images.length > 0) {
      path = item.all_images[imageIndex] || item.all_images[0];
    } else if (item.image_url) {
      path = item.image_url;
    }

    if (!path || path === 'null' || !path.trim()) return null;

    // Already a full URL
    if (path.startsWith('http')) return path;

    // Our seeded paths start with /api/images/...
    // Encode each path segment to handle spaces, parentheses etc.
    if (path.startsWith('/api/')) {
      // Split on / but keep the /api/images/type/ prefix intact, encode the rest
      const parts = path.split('/');
      // parts[0]='' parts[1]='api' parts[2]='images' parts[3]='destinations|hotels|restaurants'
      // parts[4+] = folder names and filename — these need encoding
      const prefix = parts.slice(0, 4).join('/');   // /api/images/destinations
      const rest   = parts.slice(4).map(encodeURIComponent).join('/');
      return `${API_BASE_URL}${prefix}/${rest}`;
    }

    return `${API_BASE_URL}/${path}`;
  }

  getAllImageUrls(item) {
    if (!item) return [];
    const paths = (item.all_images && Array.isArray(item.all_images) && item.all_images.length > 0)
      ? item.all_images
      : item.image_url ? [item.image_url] : [];
    return paths.map((_, i) => this.getImageUrl(item, i)).filter(Boolean);
  }

  /**
   * Resolve a RAW destination image path (as stored in Place.image_url / facet
   * image_path) into a browser-accessible URL served by the backend at
   *   GET /api/images/destinations/<path:filename>  ->  datasets/destination_images/<filename>
   *
   * Raw paths use Windows backslashes, spaces and parentheses, e.g.
   *   "mount everest (...)\\Mount Everest ... 1.1.jpeg"
   * The facet image_path is additionally a SEMICOLON-separated list; we take
   * the first entry. Routed through the same base-URL + per-segment encoding
   * as getImageUrl so there is a single shared resolver.
   */
  getDestinationImageUrl(rawPath) {
    if (!rawPath || typeof rawPath !== 'string') return null;

    // Take the first entry of a semicolon-separated list, then normalize.
    let path = rawPath.split(';')[0].trim();
    if (!path || path === 'null') return null;

    // Already a full URL or already-resolved API path.
    if (path.startsWith('http')) return path;
    if (path.startsWith('/api/')) return this.getImageUrl({ image_url: path });

    // Windows backslashes -> forward slashes, strip any leading slashes.
    path = path.replace(/\\/g, '/').replace(/^\/+/, '');

    // Encode each segment (handles spaces, parentheses) and prefix the route.
    return `${API_BASE_URL}/api/images/destinations/${encodePath(path)}`;
  }
}

export default new ImageService();
