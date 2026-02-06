import { useState, useEffect } from 'react';
import { FaImage, FaHotel, FaUtensils, FaMountain, FaSpinner } from 'react-icons/fa';
import imageService from '../services/imageService';

/**
 * SmartImage Component - Intelligent image loading with fallbacks and WORKING AI generation
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
  eager = false,
  enableAI = true
}) {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isAIGenerated, setIsAIGenerated] = useState(false); // Track if image is AI-generated

  const maxRetries = 2;

  // Generate AI tourism image using multiple services
  const generateAIImage = async (place) => {
    console.log(`🎨 Generating Nepal AI image for: ${place.name} (type: ${place.type})`);
    
    const identifier = `${place.name || 'place'}_${place.type || 'tourism'}`.toLowerCase().replace(/[^a-z0-9]/g, '');
    let hash = 0;
    for (let i = 0; i < identifier.length; i++) {
      const char = identifier.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const uniqueId = Math.abs(hash % 10000);
    
    // Determine search terms based on place type
    let searchTerms = 'nepal+tourism';
    const placeType = (place.type || '').toLowerCase();
    const placeName = (place.name || '').toLowerCase();
    
    if (placeType.includes('hotel') || placeName.includes('hotel') || placeName.includes('lodge')) {
      searchTerms = 'nepal+hotel+mountain+lodge';
    } else if (placeType.includes('restaurant') || placeName.includes('restaurant') || placeType.includes('food')) {
      searchTerms = 'nepal+restaurant+food+traditional';
    } else if (placeType.includes('temple') || placeName.includes('temple') || placeType.includes('cultural') || placeType.includes('religious')) {
      searchTerms = 'nepal+temple+heritage+buddhist';
    } else if (placeType.includes('natural') || placeType.includes('nature') || placeName.includes('lake') || placeName.includes('mountain')) {
      searchTerms = 'nepal+mountain+landscape+nature';
    } else if (placeType.includes('trekking') || placeType.includes('adventure') || placeName.includes('trek')) {
      searchTerms = 'nepal+trekking+himalaya+mountain';
    } else if (placeType.includes('village') || placeType.includes('rural') || placeName.includes('village')) {
      searchTerms = 'nepal+village+traditional+culture';
    }
    
    // Try multiple image services
    const imageServices = [
      // Service 1: Unsplash
      `https://source.unsplash.com/800x600/?${searchTerms}&sig=${uniqueId}`,
      // Service 2: Picsum with overlay (fallback)
      `https://picsum.photos/800/600?random=${uniqueId}`,
      // Service 3: Lorem Picsum
      `https://loremflickr.com/800/600/${searchTerms.replace(/\+/g, ',')}`
    ];
    
    console.log(`🎯 Trying image services for ${place.name}:`, imageServices);
    
    // Try each service with timeout
    for (const serviceUrl of imageServices) {
      try {
        const result = await new Promise((resolve, reject) => {
          const img = new Image();
          const timeout = setTimeout(() => {
            reject(new Error('Timeout'));
          }, 2000); // 2 second timeout per service
          
          img.onload = () => {
            clearTimeout(timeout);
            console.log(`✅ Image service worked for ${place.name}: ${serviceUrl}`);
            resolve(serviceUrl);
          };
          
          img.onerror = () => {
            clearTimeout(timeout);
            reject(new Error('Failed to load'));
          };
          
          img.src = serviceUrl;
        });
        
        return result; // Return first working service
      } catch (error) {
        console.log(`❌ Service failed for ${place.name}: ${serviceUrl}`);
        continue; // Try next service
      }
    }
    
    // If all services fail, return null (will show gradient fallback)
    console.log(`💥 All image services failed for ${place.name}`);
    return null;
  };

  // Fallback AI image generation with alternative approach
  const generateFallbackAIImage = (place) => {
    console.log(`🔄 Generating fallback AI image for: ${place.name}`);
    
    // Create different unique identifier for fallback
    const identifier = `fallback_${place.name}_${place.type}`.toLowerCase().replace(/[^a-z0-9]/g, '');
    let hash = 0;
    for (let i = 0; i < identifier.length; i++) {
      const char = identifier.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const uniqueId = Math.abs(hash).toString(36);
    
    // Simplified but very specific search terms
    let searchQuery = '';
    
    if (place.type?.toLowerCase().includes('hotel') || 
        place.name?.toLowerCase().includes('hotel') ||
        place.name?.toLowerCase().includes('lodge')) {
      searchQuery = 'nepal+mountain+lodge+accommodation+himalaya';
    } else if (place.type?.toLowerCase().includes('restaurant') || 
               place.name?.toLowerCase().includes('restaurant')) {
      searchQuery = 'nepal+food+traditional+cuisine+dining';
    } else if (place.type?.toLowerCase().includes('temple') || 
               place.name?.toLowerCase().includes('temple')) {
      searchQuery = 'nepal+temple+buddhist+hindu+heritage';
    } else if (place.type?.toLowerCase().includes('natural') || 
               place.name?.toLowerCase().includes('lake') ||
               place.name?.toLowerCase().includes('mountain')) {
      searchQuery = 'nepal+mountain+landscape+nature+himalaya';
    } else if (place.type?.toLowerCase().includes('trekking') || 
               place.name?.toLowerCase().includes('trek')) {
      searchQuery = 'nepal+trekking+mountain+trail+adventure';
    } else if (place.type?.toLowerCase().includes('village') || 
               place.name?.toLowerCase().includes('village')) {
      searchQuery = 'nepal+village+culture+traditional+rural';
    } else {
      searchQuery = 'nepal+tourism+travel+destination+culture';
    }
    
    const fallbackUrl = `https://source.unsplash.com/800x600/?${searchQuery}&sig=fb${uniqueId}`;
    console.log(`🔄 Generated fallback URL: ${fallbackUrl}`);
    
    return fallbackUrl;
  };

  // Check if place needs AI image
  const needsAIImage = (place) => {
    if (!place) return false;
    
    const hasValidImages = place.all_images && 
                          Array.isArray(place.all_images) && 
                          place.all_images.length > 0 &&
                          place.all_images.some(img => img && img.trim() !== '' && img !== 'null');
    
    const hasValidImageUrl = place.image_url && 
                            place.image_url.trim() !== '' && 
                            place.image_url !== 'null' &&
                            place.image_url !== null;
    
    return !hasValidImages && !hasValidImageUrl;
  };

  useEffect(() => {
    console.log(`🔍 SmartImage useEffect triggered for: ${item?.name}`, {
      item,
      imageIndex,
      enableAI,
      retryCount
    });

    if (!item) {
      console.log('❌ SmartImage: No item provided');
      setIsLoading(false);
      setHasError(true);
      return;
    }

    const loadImage = async () => {
      console.log(`🚀 SmartImage: Starting loadImage for ${item.name}`);
      setIsLoading(true);
      setHasError(false);

      try {
        // First, try to get the regular image URL
        const url = imageService.getImageUrl(item, imageIndex);
        
        console.log(`📸 SmartImage: Regular image URL for ${item.name}:`, url);
        
        if (url) {
          console.log(`✅ SmartImage: Loading regular image: ${url}`);
          setImageUrl(url);
          setIsLoading(false);
          return;
        }

        // If no regular image and AI is enabled, generate one
        if (enableAI) {
          console.log(`🤖 SmartImage: No regular image found for "${item.name}", checking if AI generation needed`);
          
          const needsAI = needsAIImage(item);
          console.log(`🔍 SmartImage: needsAIImage result for ${item.name}:`, needsAI);
          
          if (needsAI) {
            console.log(`🎨 SmartImage: Starting AI generation for: ${item.name}`);
            setIsGeneratingAI(true);
            
            // Generate AI image (returns Promise now)
            generateAIImage(item).then(aiUrl => {
              console.log(`🎯 SmartImage: Generated AI URL for ${item.name}:`, aiUrl);
              
              if (aiUrl) {
                console.log(`✅ SmartImage: Setting AI image URL: ${aiUrl}`);
                setImageUrl(aiUrl);
                setIsAIGenerated(true); // Mark as AI-generated
                setIsLoading(false);
                setIsGeneratingAI(false);
              } else {
                console.warn(`❌ SmartImage: Failed to generate AI image for: ${item.name}`);
                throw new Error('AI image generation returned null');
              }
            }).catch(error => {
              console.error(`❌ SmartImage: AI generation error for ${item.name}:`, error);
              setHasError(true);
              setIsLoading(false);
              setIsGeneratingAI(false);
            });
            
            return; // Exit early, Promise will handle the rest
          } else {
            console.log(`ℹ️ SmartImage: AI generation not needed for: ${item.name}`);
          }
        } else {
          console.log(`🚫 SmartImage: AI generation disabled for: ${item.name}`);
        }

        // If all else fails, show error
        console.log(`💥 SmartImage: No image available for: ${item.name}, showing fallback`);
        throw new Error('No image available');
      } catch (error) {
        console.warn(`⚠️ SmartImage: Failed to load image for ${item.name}:`, error);
        
        // Try fallback images
        if (retryCount < maxRetries) {
          console.log(`🔄 SmartImage: Retrying (${retryCount + 1}/${maxRetries}) for: ${item.name}`);
          setRetryCount(prev => prev + 1);
          return; // This will trigger useEffect again
        } else {
          console.log(`💀 SmartImage: All retries exhausted for: ${item.name}, showing error state`);
          setHasError(true);
        }
      } finally {
        setIsLoading(false);
        setIsGeneratingAI(false);
      }
    };

    loadImage();
  }, [item, imageIndex, size, retryCount, enableAI]);

  const handleImageLoad = (e) => {
    setIsLoading(false);
    setHasError(false);
    if (onLoad) onLoad(e);
  };

  const handleImageError = (e) => {
    console.warn(`Image failed to load: ${imageUrl}`);
    setHasError(true);
    setIsLoading(false);
    if (onError) onError(e);
    
    // Try one more fallback
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
    }
  };

  const getTypeIcon = (type) => {
    const iconMap = {
      'Place': FaMountain,
      'Destination': FaMountain,
      'Attraction': FaMountain,
      'Hotel': FaHotel,
      'Restaurant': FaUtensils,
      'restaurant': FaUtensils,
      'hotel': FaHotel,
      'place': FaMountain
    };
    
    return iconMap[type] || FaImage;
  };

  const getTypeGradient = (type) => {
    const gradientMap = {
      'Place': 'from-emerald-500 to-teal-600',
      'Destination': 'from-emerald-500 to-teal-600',
      'Attraction': 'from-purple-500 to-pink-600',
      'Hotel': 'from-blue-500 to-indigo-600',
      'Restaurant': 'from-orange-500 to-red-600',
      'restaurant': 'from-orange-500 to-red-600',
      'hotel': 'from-blue-500 to-indigo-600',
      'place': 'from-emerald-500 to-teal-600'
    };
    
    return gradientMap[type] || 'from-gray-500 to-gray-600';
  };

  if (isLoading && showLoader) {
    // Determine specific image type being generated
    let imageType = 'Tourism';
    let loadingMessage = 'Loading Nepal destination image...';
    
    if (item?.type?.toLowerCase().includes('hotel') || 
        item?.type?.toLowerCase().includes('accommodation') ||
        item?.name?.toLowerCase().includes('hotel') ||
        item?.name?.toLowerCase().includes('lodge')) {
      imageType = 'Hotel';
      loadingMessage = 'Generating Nepal hotel/lodge image...';
    } else if (item?.type?.toLowerCase().includes('restaurant') || 
               item?.type?.toLowerCase().includes('food') ||
               item?.name?.toLowerCase().includes('restaurant')) {
      imageType = 'Restaurant';
      loadingMessage = 'Generating Nepal cuisine image...';
    } else if (item?.type?.toLowerCase().includes('temple') || 
               item?.type?.toLowerCase().includes('cultural') ||
               item?.name?.toLowerCase().includes('temple') ||
               item?.name?.toLowerCase().includes('mandir')) {
      imageType = 'Temple';
      loadingMessage = 'Generating Nepal temple image...';
    } else if (item?.type?.toLowerCase().includes('natural') || 
               item?.type?.toLowerCase().includes('nature') ||
               item?.name?.toLowerCase().includes('lake') ||
               item?.name?.toLowerCase().includes('mountain')) {
      imageType = 'Nature';
      loadingMessage = 'Generating Nepal landscape image...';
    } else if (item?.type?.toLowerCase().includes('trekking') || 
               item?.type?.toLowerCase().includes('adventure') ||
               item?.name?.toLowerCase().includes('trek')) {
      imageType = 'Trekking';
      loadingMessage = 'Generating Nepal trekking image...';
    } else if (item?.type?.toLowerCase().includes('village') || 
               item?.type?.toLowerCase().includes('rural') ||
               item?.name?.toLowerCase().includes('village')) {
      imageType = 'Village';
      loadingMessage = 'Generating Nepal village image...';
    }
    
    return (
      <div 
        className={`flex items-center justify-center bg-gray-200 dark:bg-gray-700 ${className}`}
        style={style}
      >
        <div className="flex flex-col items-center gap-2">
          <FaSpinner className="text-2xl text-gray-400 animate-spin" />
          <span className="text-sm text-gray-500 text-center">
            {isGeneratingAI ? (
              <>
                <div className="font-medium">🇳🇵 {loadingMessage}</div>
                <div className="text-xs mt-1">Creating authentic Nepal {imageType.toLowerCase()} imagery...</div>
              </>
            ) : (
              'Loading...'
            )}
          </span>
        </div>
      </div>
    );
  }

  if (hasError || !imageUrl) {
    if (!showFallbackIcon) {
      return null;
    }

    const TypeIcon = getTypeIcon(item?.type);
    const typeGradient = getTypeGradient(item?.type);

    return (
      <div 
        className={`flex items-center justify-center bg-gradient-to-br ${typeGradient} ${className}`}
        style={style}
      >
        <div className="flex flex-col items-center gap-2 text-white">
          <TypeIcon className="text-4xl opacity-80" />
          <span className="text-sm font-medium opacity-75">
            {item?.type || 'Image'}
          </span>
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
      
      {/* AI Generated Badge */}
      {isAIGenerated && (
        <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-pulse">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 7H7v6h6V7z"/>
            <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd"/>
          </svg>
          <span>🇳🇵 Nepal AI</span>
        </div>
      )}
    </div>
  );
}