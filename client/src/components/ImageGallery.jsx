import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaExpand, FaTimes, FaMapMarkerAlt, FaHotel, FaUtensils, FaMountain } from 'react-icons/fa';
import imageService from '../services/imageService';

const TYPE_ICON = {
  Hotel: FaHotel, hotel: FaHotel,
  Restaurant: FaUtensils, restaurant: FaUtensils,
  Place: FaMountain, place: FaMountain,
};

export default function ImageGallery({ item, className = '', showThumbnails = true, showControls = true, maxHeight = '400px' }) {
  const [images, setImages]         = useState([]);
  const [current, setCurrent]       = useState(0);
  const [lightbox, setLightbox]     = useState(false);
  const [imgErrors, setImgErrors]   = useState({});

  useEffect(() => {
    if (item) setImages(imageService.getAllImageUrls(item));
  }, [item]);

  const prev = () => setCurrent(i => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrent(i => (i + 1) % images.length);

  const Icon = TYPE_ICON[item?.type] || FaMapMarkerAlt;

  const Fallback = () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-700">
      <Icon className="text-6xl text-slate-400" />
    </div>
  );

  if (!images.length) {
    return (
      <div className={`rounded-2xl overflow-hidden ${className}`} style={{ height: maxHeight }}>
        <Fallback />
      </div>
    );
  }

  const currentSrc = !imgErrors[current] ? images[current] : null;

  return (
    <>
      <div className={`relative rounded-2xl overflow-hidden ${className}`} style={{ height: maxHeight }}>
        {/* Main image */}
        {currentSrc ? (
          <img
            src={currentSrc}
            alt={item?.name}
            className="w-full h-full object-cover"
            onError={() => setImgErrors(e => ({ ...e, [current]: true }))}
          />
        ) : <Fallback />}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

        {/* Nav arrows */}
        {showControls && images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur text-white flex items-center justify-center hover:bg-black/60 transition-all">
              <FaChevronLeft />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur text-white flex items-center justify-center hover:bg-black/60 transition-all">
              <FaChevronRight />
            </button>
          </>
        )}

        {/* Expand */}
        <button onClick={() => setLightbox(true)} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 backdrop-blur text-white flex items-center justify-center hover:bg-black/60 transition-all">
          <FaExpand className="text-sm" />
        </button>

        {/* Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full bg-black/50 text-white text-xs font-medium">
            {current + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {images.map((url, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                i === current ? 'border-teal-500 scale-105' : 'border-slate-300 dark:border-slate-600'
              }`}>
              {!imgErrors[i] ? (
                <img src={url} alt="" className="w-full h-full object-cover"
                  onError={() => setImgErrors(e => ({ ...e, [i]: true }))} />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-700">
                  <Icon className="text-slate-400 text-lg" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[99999] bg-black/95 flex items-center justify-center p-4" onClick={() => setLightbox(false)}>
          <button onClick={() => setLightbox(false)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">
            <FaTimes />
          </button>
          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">
                <FaChevronLeft className="text-xl" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">
                <FaChevronRight className="text-xl" />
              </button>
            </>
          )}
          <img src={currentSrc || ''} alt={item?.name} className="max-w-full max-h-full object-contain rounded-xl" onClick={e => e.stopPropagation()} />
          <div className="absolute bottom-4 text-white text-sm font-medium">{item?.name} — {current + 1}/{images.length}</div>
        </div>
      )}
    </>
  );
}
