import React, { useState, useEffect } from 'react';

/**
 * FestivalImage Component
 * 
 * A robust image component that tries to load external images first,
 * then falls back to local SVG files if the external image fails.
 */
const FestivalImage = ({ 
  festival, 
  alt, 
  className = "", 
  onImageLoad = null,
  onImageError = null,
  preferExternal = true // New prop to control preference
}) => {
  const [currentSrc, setCurrentSrc] = useState('');
  const [imageStatus, setImageStatus] = useState('loading'); // 'loading', 'loaded', 'error'
  const [attemptedUrls, setAttemptedUrls] = useState([]);

  // Generate image sources in priority order
  const getImageSources = () => {
    const sources = [];
    
    if (!festival) {
      return ['/src/assets/festivals/festival-default.svg'];
    }

    if (preferExternal) {
      // 1. External imageUrl (Wikimedia Commons) - if preferExternal is true
      if (festival.imageUrl) {
        sources.push(festival.imageUrl);
      }

      // 2. Local SVG file
      if (festival.image) {
        sources.push(`/src/assets/festivals/${festival.image}`);
      } else if (festival.id) {
        sources.push(`/src/assets/festivals/${festival.id}.svg`);
      }
    } else {
      // 1. Local SVG file first - if preferExternal is false
      if (festival.image) {
        sources.push(`/src/assets/festivals/${festival.image}`);
      } else if (festival.id) {
        sources.push(`/src/assets/festivals/${festival.id}.svg`);
      }

      // 2. External imageUrl as fallback
      if (festival.imageUrl) {
        sources.push(festival.imageUrl);
      }
    }

    // 3. Default fallback
    sources.push('/src/assets/festivals/festival-default.svg');

    return sources;
  };

  const imageSources = getImageSources();

  // Initialize with first source
  useEffect(() => {
    if (imageSources.length > 0) {
      setCurrentSrc(imageSources[0]);
      setImageStatus('loading');
      setAttemptedUrls([]);
    }
  }, [festival?.id, festival?.imageUrl, festival?.image, preferExternal]);

  const handleImageLoad = (e) => {
    console.log(`✅ Image loaded successfully: ${currentSrc} for ${festival?.name}`);
    setImageStatus('loaded');
    if (onImageLoad) onImageLoad(e);
  };

  const handleImageError = (e) => {
    console.log(`❌ Image failed to load: ${currentSrc} for ${festival?.name}`);
    
    const newAttemptedUrls = [...attemptedUrls, currentSrc];
    setAttemptedUrls(newAttemptedUrls);

    // Find next source that hasn't been attempted
    const nextSource = imageSources.find(src => !newAttemptedUrls.includes(src));
    
    if (nextSource) {
      console.log(`🔄 Trying fallback image: ${nextSource} for ${festival?.name}`);
      setCurrentSrc(nextSource);
      setImageStatus('loading');
    } else {
      console.log(`💥 All image sources failed for ${festival?.name}, using default`);
      setCurrentSrc('/src/assets/festivals/festival-default.svg');
      setImageStatus('error');
    }

    if (onImageError) onImageError(e);
  };

  return (
    <img
      src={currentSrc}
      alt={alt || festival?.name || 'Festival'}
      className={`${className} ${imageStatus === 'loading' ? 'opacity-75' : 'opacity-100'} transition-opacity duration-200`}
      onLoad={handleImageLoad}
      onError={handleImageError}
      loading="lazy"
    />
  );
};

export default FestivalImage;