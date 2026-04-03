/**
 * Image Service — resolves image paths from DB to full API URLs.
 * All seeded images are stored as /api/images/destinations|hotels|restaurants/<folder>/<file>
 * Just prepend the API base URL and encode each path segment.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function buildUrl(path) {
  if (!path || path === 'null' || !path.trim()) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/api/')) {
    // Encode each segment after /api/images/<type>/
    const parts = path.split('/');
    // parts: ['', 'api', 'images', 'destinations', ...rest]
    const prefix = parts.slice(0, 4).join('/');   // /api/images/destinations
    const rest   = parts.slice(4).map(encodeURIComponent).join('/');
    return `${API_BASE_URL}${prefix}/${rest}`;
  }
  // Legacy /datasets/ paths — no static route, skip
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
