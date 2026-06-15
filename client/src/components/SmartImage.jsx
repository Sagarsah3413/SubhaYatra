import { useState, useEffect, useRef } from 'react';
import { FaImage, FaHotel, FaUtensils, FaMountain, FaSpinner } from 'react-icons/fa';
import imageService from '../services/imageService';

/**
 * SmartImage Component - With image preloading for better performance
 */
export default function SmartImage({ 
  item, 
  imageIndex = 0, 
  size = 'medium',
  className = '',
  alt = '',
  showLoader = true,
  showFallbackIcon = true,
  onLoad = null,
  onError = null,
  style = {},
  eager = false
}) {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isAIGenerated, setIsAIGenerated] = useState(false);
  const preloadRef = useRef(null);

  const maxRetries = 2;

  // Preload image in background
  const preloadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => reject(url);
      img.src = url;
      preloadRef.current = img;
    });
  };

  // Generate type-specific AI placeholder image
  const generateTypeSpecificAIImage = (item, attempt = 0) => {
    if (!item || !item.name) return null;
    
    const identifier = `${item.name}`.toLowerCase().replace(/[^a-z0-9]/g, '');
    let hash = 0;
    for (let i = 0; i < identifier.length; i++) {
      hash = ((hash << 5) - hash) + identifier.charCodeAt(i);
    }
    const uniqueId = Math.abs(hash % 10000);
    
    // Determine very specific search terms based on item type
    let searchTerms = '';
    const itemType = (item.type || '').toLowerCase();
    const itemName = (item.name || '').toLowerCase();
    
    // Hotel-specific images - ONLY hotels, no random items
    if (itemType === 'hotel' || itemType.includes('hotel') || itemName.includes('hotel') || itemName.includes('lodge') || itemName.includes('resort')) {
      searchTerms = 'hotel,building,accommodation,resort,lodge';
    } 
    // Restaurant-specific images - ONLY food/dining, no random items
    else if (itemType === 'restaurant' || itemType.includes('restaurant') || itemName.includes('restaurant') || itemName.includes('cafe') || itemName.includes('dining')) {
      searchTerms = 'food,restaurant,meal,dining,cuisine';
    } 
    // Place-specific images - ONLY destinations, no random items
    else {
      if (itemType.includes('temple') || itemName.includes('temple') || itemName.includes('mandir')) {
        searchTerms = 'temple,architecture,building,heritage,monument';
      } else if (itemName.includes('lake') || itemName.includes('river')) {
        searchTerms = 'lake,water,landscape,nature,scenery';
      } else if (itemName.includes('mountain') || itemName.includes('peak') || itemName.includes('hill')) {
        searchTerms = 'mountain,peak,landscape,nature,scenery';
      } else if (itemName.includes('trek') || itemName.includes('trail')) {
        searchTerms = 'hiking,trail,mountain,trekking,path';
      } else if (itemName.includes('village') || itemName.includes('town')) {
        searchTerms = 'village,town,houses,settlement,rural';
      } else if (itemName.includes('park') || itemName.includes('garden')) {
        searchTerms = 'park,garden,nature,trees,landscape';
      } else {
        searchTerms = 'landscape,nature,scenery,destination,travel';
      }
    }
    
    // Use multiple services with VERY specific terms to avoid random items
    const imageServices = [
      // Unsplash with specific terms (no "nepal" to avoid random results)
      `https://source.unsplash.com/800x600/?${searchTerms}&sig=${uniqueId}`,
      // Picsum as fallback (consistent but random)
      `https://picsum.photos/seed/${identifier}${uniqueId}/800/600`,
      // Lorem Flickr with specific terms
      `https://loremflickr.com/800/600/${searchTerms}?random=${uniqueId}`
    ];
    
    return imageServices[attempt] || imageServices[0];
  };

  useEffect(() => {
    if (!item) {
      setIsLoading(false);
      setHasError(true);
      return;
    }

    const loadImage = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const url = imageService.getImageUrl(item, imageIndex);
        const hasValidUrl = url && url !== 'null' && url.trim() !== '';
        
        if (hasValidUrl) {
          try {
            await preloadImage(url);
            setImageUrl(url);
            setIsAIGenerated(false);
            setIsLoading(false);
            return;
          } catch {
            // Database image failed, try AI
          }
        }

        // Generate AI placeholder
        const aiUrl = generateTypeSpecificAIImage(item, retryCount);
        if (aiUrl) {
          try {
            await preloadImage(aiUrl);
            setImageUrl(aiUrl);
            setIsAIGenerated(true);
            setIsLoading(false);
            return;
          } catch {
            if (retryCount < maxRetries) {
              setRetryCount(prev => prev + 1);
              return;
            }
          }
        }

        throw new Error('No image available');
      } catch {
        setHasError(true);
        setIsLoading(false);
      }
    };

    loadImage();

    return () => {
      if (preloadRef.current) {
        preloadRef.current.onload = null;
        preloadRef.current.onerror = null;
      }
    };
  }, [item, imageIndex, retryCount]);

  const handleImageLoad = (e) => {
    setIsLoading(false);
    setHasError(false);
    if (onLoad) onLoad(e);
  };

  const handleImageError = (e) => {
    if (!isAIGenerated && retryCount === 0) {
      const aiUrl = generateTypeSpecificAIImage(item, 0);
      if (aiUrl) {
        setImageUrl(aiUrl);
        setIsAIGenerated(true);
        setHasError(false);
        return;
      }
    }
    
    if (isAIGenerated && retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      return;
    }
    
    setHasError(true);
    setIsLoading(false);
    if (onError) onError(e);
  };

  const getTypeIcon = (type) => {
    const iconMap = {
      'Hotel': FaHotel,
      'Restaurant': FaUtensils,
      'Place': FaMountain
    };
    return iconMap[type] || FaImage;
  };

  const getTypeGradient = (type) => {
    const gradientMap = {
      'Hotel': 'from-blue-500 to-indigo-600',
      'Restaurant': 'from-orange-500 to-red-600',
      'Place': 'from-emerald-500 to-teal-600'
    };
    return gradientMap[type] || 'from-gray-500 to-gray-600';
  };

  if (isLoading && showLoader) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 dark:bg-gray-700 ${className}`} style={style}>
        <div className="flex flex-col items-center gap-2">
          <FaSpinner className="text-2xl text-gray-400 animate-spin" />
          <span className="text-sm text-gray-500">Loading...</span>
        </div>
      </div>
    );
  }

  if (hasError || !imageUrl) {
    if (!showFallbackIcon) return null;

    const TypeIcon = getTypeIcon(item?.type);
    const typeGradient = getTypeGradient(item?.type);

    return (
      <div className={`flex items-center justify-center bg-gradient-to-br ${typeGradient} ${className}`} style={style}>
        <div className="flex flex-col items-center gap-2 text-white">
          <TypeIcon className="text-4xl opacity-80" />
          <span className="text-sm font-medium opacity-75">{item?.type || 'Image'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <img
        src={imageUrl}
        alt={alt || item?.name || 'Image'}
        className={className}
        style={style}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading={eager ? "eager" : "lazy"}
      />
      
      {isAIGenerated && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-lg flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 7H7v6h6V7z"/>
            <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd"/>
          </svg>
          <span>AI</span>
        </div>
      )}
    </div>
  );
}
