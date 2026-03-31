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
}

export default new ImageService();
