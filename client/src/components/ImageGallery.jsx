import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaExpand, FaTimes, FaDownload, FaShare } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import SmartImage from './SmartImage';
import imageService from '../services/imageService';

/**
 * ImageGallery Component - Display multiple images with navigation and lightbox
 */
export default function ImageGallery({ 
  item, 
  className = '',
  showThumbnails = true,
  showControls = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  maxHeight = '400px'
}) {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

  useEffect(() => {
    if (item) {
      const imageUrls = imageService.getAllImageUrls(item);
      setImages(imageUrls);
    }
  }, [item]);

  useEffect(() => {
    if (isAutoPlaying && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % images.length);
      }, autoPlayInterval);

      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, images.length, autoPlayInterval]);

  const goToPrevious = () => {
    setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % images.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const openLightbox = () => {
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const downloadImage = async () => {
    if (images[currentIndex]) {
      try {
        const response = await fetch(images[currentIndex]);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${item.name}-${currentIndex + 1}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading image:', error);
      }
    }
  };

  const shareImage = async () => {
    if (navigator.share && images[currentIndex]) {
      try {
        await navigator.share({
          title: item.name,
          text: `Check out this image of ${item.name}`,
          url: images[currentIndex]
        });
      } catch (error) {
        console.error('Error sharing image:', error);
      }
    }
  };

  if (!images.length) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`}>
        <SmartImage 
          item={item} 
          className="w-full h-full object-cover rounded-lg"
          style={{ maxHeight }}
        />
      </div>
    );
  }

  return (
    <>
      {/* Main Gallery */}
      <div className={`relative overflow-hidden rounded-lg ${className}`}>
        {/* Main Image */}
        <div className="relative" style={{ maxHeight }}>
          <SmartImage
            item={item}
            imageIndex={currentIndex}
            className="w-full h-full object-cover transition-all duration-500"
            style={{ maxHeight }}
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

          {/* Navigation Controls */}
          {showControls && images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className={`
                  absolute left-4 top-1/2 transform -translate-y-1/2 z-10
                  w-12 h-12 rounded-full backdrop-blur-md border-2 border-white/30
                  flex items-center justify-center text-white hover:bg-white/20
                  transition-all duration-300 hover:scale-110
                  ${theme === 'dark' ? 'bg-black/30' : 'bg-white/30'}
                `}
              >
                <FaChevronLeft className="text-lg" />
              </button>

              <button
                onClick={goToNext}
                className={`
                  absolute right-4 top-1/2 transform -translate-y-1/2 z-10
                  w-12 h-12 rounded-full backdrop-blur-md border-2 border-white/30
                  flex items-center justify-center text-white hover:bg-white/20
                  transition-all duration-300 hover:scale-110
                  ${theme === 'dark' ? 'bg-black/30' : 'bg-white/30'}
                `}
              >
                <FaChevronRight className="text-lg" />
              </button>
            </>
          )}

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button
              onClick={openLightbox}
              className="w-10 h-10 rounded-full backdrop-blur-md bg-black/30 border-2 border-white/30 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
              title="View Fullscreen"
            >
              <FaExpand className="text-sm" />
            </button>
            
            <button
              onClick={downloadImage}
              className="w-10 h-10 rounded-full backdrop-blur-md bg-black/30 border-2 border-white/30 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
              title="Download Image"
            >
              <FaDownload className="text-sm" />
            </button>

            <button
              onClick={shareImage}
              className="w-10 h-10 rounded-full backdrop-blur-md bg-black/30 border-2 border-white/30 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
              title="Share Image"
            >
              <FaShare className="text-sm" />
            </button>
          </div>

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full backdrop-blur-md bg-black/50 text-white text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {/* Auto-play Indicator */}
          {isAutoPlaying && (
            <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full backdrop-blur-md bg-green-500/80 text-white text-sm font-medium">
              Auto-play
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {showThumbnails && images.length > 1 && (
          <div className="flex gap-2 p-4 overflow-x-auto">
            {images.map((imageUrl, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`
                  flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300
                  ${currentIndex === index 
                    ? 'border-blue-500 scale-110' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                  }
                `}
              >
                <SmartImage
                  item={item}
                  imageIndex={index}
                  size="thumbnail"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-all duration-300"
            >
              <FaTimes className="text-xl" />
            </button>

            {/* Lightbox Image */}
            <SmartImage
              item={item}
              imageIndex={currentIndex}
              size="original"
              className="max-w-full max-h-full object-contain"
            />

            {/* Lightbox Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-16 h-16 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-all duration-300"
                >
                  <FaChevronLeft className="text-2xl" />
                </button>

                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-16 h-16 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-all duration-300"
                >
                  <FaChevronRight className="text-2xl" />
                </button>
              </>
            )}

            {/* Lightbox Info */}
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <h3 className="text-white text-xl font-bold mb-2">{item.name}</h3>
              <p className="text-white/80 text-sm">
                Image {currentIndex + 1} of {images.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}