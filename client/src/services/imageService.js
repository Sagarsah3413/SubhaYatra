/**
 * Image Service — resolves image paths to full URLs.
 * The backend serves dataset images at: /datasets/<path>
 * DB stores paths like:
 *   /api/images/destinations/<folder>/<file>  (new seeded format)
 *   destination_images/<folder>/<file>         (old format)
 *   /datasets/destination_images/<folder>/<file>
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function buildUrl(path) {
  if (!path || path === 'null' || !path.trim()) return null;
  const p = path.trim();

  // Already a full URL
  if (p.startsWith('http')) return p;

  // New seeded format: /api/images/destinations/<folder>/<file>
  // Convert to /datasets/destination_images/<folder>/<file>
  if (p.startsWith('/api/images/destinations/')) {
    const rest = p.slice('/api/images/destinations/'.length);
    return `${API_BASE_URL}/datasets/destination_images/${rest}`;
  }
  if (p.startsWith('/api/images/hotels/')) {
    const rest = p.slice('/api/images/hotels/'.length);
    return `${API_BASE_URL}/datasets/hotel_images/${rest}`;
  }
  if (p.startsWith('/api/images/restaurants/')) {
    const rest = p.slice('/api/images/restaurants/'.length);
    return `${API_BASE_URL}/datasets/restaurant_images/${rest}`;
  }

  // Already /datasets/... format
  if (p.startsWith('/datasets/')) {
    return `${API_BASE_URL}${p}`;
  }

  // Relative path like destination_images/...
  if (p.startsWith('destination_images/') || p.startsWith('hotel_images/') || p.startsWith('restaurant_images/')) {
    return `${API_BASE_URL}/datasets/${p}`;
  }

  return null;
}

class ImageService {
  getImageUrl(item, imageIndex = 0) {
    if (!item) return null;

    let path = null;

    if (item.all_images && Array.isArray(item.all_images) && item.all_images.length > 0) {
      path = item.all_images[imageIndex] ?? item.all_images[0];
    } else if (item.image_url) {
      path = item.image_url;
    } else if (item.images && Array.isArray(item.images) && item.images.length > 0) {
      path = item.images[imageIndex] ?? item.images[0];
    }

    return buildUrl(path);
  }

  getAllImageUrls(item) {
    if (!item) return [];

    const paths =
      (item.all_images && Array.isArray(item.all_images) && item.all_images.length > 0)
        ? item.all_images
        : (item.images && Array.isArray(item.images) && item.images.length > 0)
          ? item.images
          : item.image_url
            ? [item.image_url]
            : [];

    return paths.map(buildUrl).filter(Boolean);
  }
}

export default new ImageService();
