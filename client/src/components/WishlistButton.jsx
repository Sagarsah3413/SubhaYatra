import { useState, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';
import { wishlistService } from '../services/wishlistService';

const WishlistButton = ({ 
  placeId, 
  className = '', 
  size = 'md',
  showTooltip = true,
  onToggle = null 
}) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Size variants
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  // Check wishlist status on mount
  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const inWishlist = await wishlistService.isInWishlist(placeId);
        setIsInWishlist(inWishlist);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };

    if (placeId) {
      checkWishlistStatus();
    }
  }, [placeId]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(placeId);
        setIsInWishlist(false);
        if (onToggle) onToggle(placeId, false);
      } else {
        await wishlistService.addToWishlist(placeId);
        setIsInWishlist(true);
        if (onToggle) onToggle(placeId, true);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`
        ${sizeClasses[size]}
        rounded-full
        flex items-center justify-center
        transition-all duration-300
        transform hover:scale-110
        ${isInWishlist 
          ? 'bg-red-500 text-white shadow-lg shadow-red-500/25' 
          : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        backdrop-blur-sm border border-white/20
        ${className}
      `}
      title={showTooltip ? (isInWishlist ? 'Remove from wishlist' : 'Add to wishlist') : ''}
    >
      <FaHeart 
        className={`
          transition-all duration-300
          ${isLoading ? 'animate-pulse' : ''}
          ${isInWishlist ? 'scale-110' : 'scale-100'}
        `} 
      />
    </button>
  );
};

export default WishlistButton;