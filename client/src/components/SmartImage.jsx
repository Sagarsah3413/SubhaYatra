import { useState } from 'react';
import { FaMapMarkerAlt, FaHotel, FaUtensils, FaMountain } from 'react-icons/fa';
import imageService from '../services/imageService';

const TYPE_ICON = {
  Hotel: FaHotel,
  hotel: FaHotel,
  Restaurant: FaUtensils,
  restaurant: FaUtensils,
  Place: FaMountain,
  place: FaMountain,
};

export default function SmartImage({
  item,
  imageIndex = 0,
  className = '',
  alt = '',
  style = {},
  eager = false,
  showFallbackIcon = true,
  showLoader = false,
}) {
  const [failed, setFailed] = useState(false);

  const url = !failed ? imageService.getImageUrl(item, imageIndex) : null;
  const Icon = TYPE_ICON[item?.type] || FaMapMarkerAlt;

  if (!url) {
    if (!showFallbackIcon) return null;
    return (
      <div
        className={`flex items-center justify-center bg-slate-100 dark:bg-slate-700 ${className}`}
        style={style}
      >
        <Icon className="text-4xl text-slate-400 dark:text-slate-500" />
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={alt || item?.name || ''}
      className={className}
      style={style}
      loading={eager ? 'eager' : 'lazy'}
      onError={() => setFailed(true)}
    />
  );
}
