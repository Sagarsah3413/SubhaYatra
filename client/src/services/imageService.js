/**
 * Image Service - Centralized image handling for destinations, hotels, and restaurants
 */

const API_BASE_URL = 'http://localhost:8000';

class ImageService {
  /**
   * Get the correct image path based on item type and image name
   */
  getImageUrl(item, imageIndex = 0) {
    console.log(`🔍 imageService.getImageUrl called for: ${item?.name}`, {
      type: item?.type,
      imageIndex,
      image_url: item?.image_url,
      all_images: item?.all_images
    });

    if (!item) {
      console.log('❌ imageService: No item provided');
      return null;
    }

    // Handle different image sources
    let imagePath = null;

    // Check if item has all_images array
    if (item.all_images && Array.isArray(item.all_images) && item.all_images.length > 0) {
      imagePath = item.all_images[imageIndex] || item.all_images[0];
      console.log(`✅ imageService: Found image in all_images[${imageIndex}]:`, imagePath);
    }
    // Fallback to image_url
    else if (item.image_url) {
      imagePath = item.image_url;
      console.log(`✅ imageService: Found image in image_url:`, imagePath);
    }
    // Fallback to images array (legacy support)
    else if (item.images && Array.isArray(item.images) && item.images.length > 0) {
      imagePath = item.images[imageIndex] || item.images[0];
      console.log(`✅ imageService: Found image in images[${imageIndex}]:`, imagePath);
    }

    if (!imagePath || imagePath === 'null' || imagePath.trim() === '') {
      console.log(`❌ imageService: No valid image path found for ${item.name}`);
      return null;
    }

    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
      console.log(`🌐 imageService: Returning full URL:`, imagePath);
      return imagePath;
    }

    // If it starts with /datasets, use as is
    if (imagePath.startsWith('/datasets')) {
      const fullUrl = `${API_BASE_URL}${imagePath}`;
      console.log(`📁 imageService: Returning datasets URL:`, fullUrl);
      return fullUrl;
    }

    // Normalize path separators (convert backslashes to forward slashes)
    imagePath = imagePath.replace(/\\/g, '/');

    // Determine the correct folder based on item type
    const imageFolder = this.getImageFolder(item.type);
    console.log(`📂 imageService: Image folder for type "${item.type}":`, imageFolder);
    
    // Handle different path formats
    if (imagePath.startsWith(imageFolder)) {
      // Path already includes folder (e.g., "hotel_images/...")
      const fullUrl = `${API_BASE_URL}/datasets/${imagePath}`;
      console.log(`✅ imageService: Path includes folder, returning:`, fullUrl);
      return fullUrl;
    }

    // If path doesn't start with folder name, prepend it
    const fullUrl = `${API_BASE_URL}/datasets/${imageFolder}/${imagePath}`;
    console.log(`🔧 imageService: Prepending folder, returning:`, fullUrl);
    return fullUrl;
  }

  /**
   * Get all image URLs for an item
   */
  getAllImageUrls(item) {
    if (!item) return [];

    let imagePaths = [];

    // Get all images from all_images field
    if (item.all_images && Array.isArray(item.all_images)) {
      imagePaths = [...item.all_images];
    }
    // Fallback to images array
    else if (item.images && Array.isArray(item.images)) {
      imagePaths = [...item.images];
    }
    // Fallback to single image_url
    else if (item.image_url) {
      imagePaths = [item.image_url];
    }

    return imagePaths.map((path, index) => this.getImageUrl(item, index)).filter(Boolean);
  }

  /**
   * Get the appropriate image folder based on item type
   */
  getImageFolder(type) {
    const folderMap = {
      'Place': 'destination_images',
      'Destination': 'destination_images',
      'Attraction': 'destination_images',
      'Hotel': 'hotel_images',
      'Restaurant': 'restaurant_images',
      'restaurant': 'restaurant_images',
      'hotel': 'hotel_images',
      'place': 'destination_images'
    };

    return folderMap[type] || 'destination_images';
  }

  /**
   * Get a fallback image based on item type
   */
  getFallbackImage(type) {
    const fallbackMap = {
      'Place': '/assets/fallback-destination.jpg',
      'Hotel': '/assets/fallback-hotel.jpg',
      'Restaurant': '/assets/fallback-restaurant.jpg'
    };

    return fallbackMap[type] || '/assets/fallback-destination.jpg';
  }

  /**
   * Preload images for better performance
   */
  preloadImages(imageUrls) {
    return Promise.all(
      imageUrls.map(url => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(url);
          img.onerror = () => reject(url);
          img.src = url;
        });
      })
    );
  }

  /**
   * Get optimized image URL with size parameters (if backend supports it)
   */
  getOptimizedImageUrl(item, size = 'medium', imageIndex = 0) {
    const baseUrl = this.getImageUrl(item, imageIndex);
    if (!baseUrl) return null;

    // Add size parameters if needed (implement on backend)
    const sizeMap = {
      'thumbnail': '150x150',
      'small': '300x200',
      'medium': '600x400',
      'large': '1200x800',
      'original': null
    };

    const dimensions = sizeMap[size];
    if (dimensions) {
      return `${baseUrl}?size=${dimensions}`;
    }

    return baseUrl;
  }

  /**
   * Check if image exists
   */
  async imageExists(imageUrl) {
    try {
      const response = await fetch(imageUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get image metadata
   */
  async getImageMetadata(imageUrl) {
    try {
      const response = await fetch(imageUrl, { method: 'HEAD' });
      if (!response.ok) return null;

      return {
        url: imageUrl,
        size: response.headers.get('content-length'),
        type: response.headers.get('content-type'),
        lastModified: response.headers.get('last-modified')
      };
    } catch (error) {
      console.error('Error getting image metadata:', error);
      return null;
    }
  }

  /**
   * Upload new image (for admin functionality)
   */
  async uploadImage(file, itemType, itemId) {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', itemType);
      formData.append('item_id', itemId);

      const response = await fetch(`${API_BASE_URL}/api/images/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  /**
   * Delete image (for admin functionality)
   */
  async deleteImage(imagePath) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/images/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image_path: imagePath })
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  /**
   * Get random images from a specific category for showcasing
   */
  async getRandomImages(type, count = 6) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/images/random?type=${type}&count=${count}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch random images: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching random images:', error);
      return [];
    }
  }
}

// Export singleton instance
export default new ImageService();