import { useState, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';
import { useUser } from '@clerk/clerk-react';
import { wishlistService } from '../services/wishlistService';
import { useToast } from '../contexts/ToastContext';

const WishlistButton = ({ 
  placeId, 
  placeData = null,  // Optional place data for non-database places
  className = '', 
  size = 'md',
  showTooltip = true,
  onToggle = null 
}) => {
  const { user, isSignedIn } = useUser();
  const { showToast } = useToast();
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
      if (!isSignedIn || !user?.id) return;
      
      try {
        const inWishlist = await wishlistService.isInWishlist(placeId, user.id);
        setIsInWishlist(inWishlist);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };

    if (placeId) {
      checkWishlistStatus();
    }
  }, [placeId, isSignedIn, user]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is signed in
    if (!isSignedIn || !user?.id) {
      showToast('Please sign in to add places to your wishlist', 'error');
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(placeId, user.id);
        setIsInWishlist(false);
        showToast('Removed from wishlist', 'success');
        if (onToggle) onToggle(placeId, false);
      } else {
        await wishlistService.addToWishlist(placeId, user.id, placeData);
        setIsInWishlist(true);
        showToast('Added to wishlist', 'success');
        if (onToggle) onToggle(placeId, true);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      showToast('Failed to update wishlist. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading || !isSignedIn}
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
        ${isLoading || !isSignedIn ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        backdrop-blur-sm border border-white/20
        ${className}
      `}
      title={showTooltip ? (
        !isSignedIn ? 'Sign in to add to wishlist' :
        isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'
      ) : ''}
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