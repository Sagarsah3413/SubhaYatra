import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useUser } from "@clerk/clerk-react";
import {
  FaArrowLeft, FaSearch, FaSpinner, FaMapMarkerAlt,
  FaStar, FaHotel, FaUtensils, FaMountain, FaChevronRight
} from "react-icons/fa";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ── Single card ───────────────────────────────────────────────────────────────
function Card({ item, type, theme, navigate }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [err, setErr]       = useState({});

  // Build all image URLs
  const allImgs = (() => {
    const paths = item.all_images && Array.isArray(item.all_images) && item.all_images.length
      ? item.all_images
      : item.image_url ? [item.image_url] : [];
    return paths.map(p => {
      if (!p || p === 'null') return null;
      if (p.startsWith('http')) return p;
      const parts = p.split('/');
      const prefix = parts.slice(0, 4).join('/');
      const rest   = parts.slice(4).map(encodeURIComponent).join('/');
      return `${API}${prefix}/${rest}`;
    }).filter(Boolean);
  })();

  const src = !err[imgIdx] && allImgs[imgIdx] ? allImgs[imgIdx] : null;

  const accent = type === "place" ? "teal" : type === "hotel" ? "blue" : "orange";
  const Icon   = type === "place" ? FaMountain : type === "hotel" ? FaHotel : FaUtensils;

  return (
    <div
      onClick={() => navigate(`/details?type=${type}&name=${encodeURIComponent(item.name)}`)}
      className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300
        hover:-translate-y-1 hover:shadow-2xl
        ${theme === "dark"
          ? "bg-slate-800 border-slate-700 hover:border-slate-500"
          : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"}`}
    >
      {/* Image area */}
      <div className="relative h-44 overflow-hidden bg-slate-200 dark:bg-slate-700">
        {src ? (
          <img src={src} alt={item.name}
            onError={() => setErr(e => ({ ...e, [imgIdx]: true }))}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon className="text-5xl text-slate-400" />
          </div>
        )}

        {/* Rating */}
        {item.rating && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 text-white text-xs font-bold">
            <FaStar className="text-amber-400 text-[10px]" />
            {Number(item.rating).toFixed(1)}
          </div>
        )}

        {/* Image dots — only if multiple images */}
        {allImgs.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {allImgs.slice(0, 5).map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setImgIdx(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === imgIdx ? 'bg-white scale-125' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Image count badge */}
        {allImgs.length > 1 && (
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full bg-black/50 text-white text-[10px] font-semibold">
            {allImgs.length} photos
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3 space-y-1.5">
        <h3 className={`font-bold text-sm leading-tight line-clamp-1 group-hover:text-${accent}-500 transition-colors
          ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
          {item.name}
        </h3>
        {item.location && (
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <FaMapMarkerAlt className={`text-${accent}-500 flex-shrink-0`} />
            <span className="line-clamp-1">{item.location}</span>
          </div>
        )}
        {item.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}
        {item.price_range && (
          <p className={`text-xs font-semibold text-${accent}-600 dark:text-${accent}-400`}>
            {item.price_range}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Section block ─────────────────────────────────────────────────────────────
function Section({ title, icon: Icon, accent, items, type, theme, navigate, query }) {
  if (!items.length) return null;
  return (
    <div className="mb-10">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-${accent}-100 dark:bg-${accent}-900/40 flex items-center justify-center`}>
            <Icon className={`text-${accent}-600 dark:text-${accent}-400 text-lg`} />
          </div>
          <div>
            <h2 className={`text-xl font-black ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
              {title}
            </h2>
            <p className="text-xs text-slate-500">
              {items.length} result{items.length !== 1 ? "s" : ""} for "{query}"
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold bg-${accent}-100 dark:bg-${accent}-900/40 text-${accent}-700 dark:text-${accent}-300`}>
          {items.length}
        </span>
      </div>

      {/* Divider */}
      <div className={`h-0.5 w-full mb-5 bg-gradient-to-r from-${accent}-500/60 via-${accent}-300/30 to-transparent rounded-full`} />

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {items.map((item, i) => (
          <Card key={`${type}-${item.id || i}`} item={item} type={type} theme={theme} navigate={navigate} />
        ))}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SearchResultPage() {
  const { theme } = useTheme();
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, isSignedIn, isLoaded } = useUser();

  const [places,      setPlaces]      = useState([]);
  const [hotels,      setHotels]      = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading,   setIsLoading]   = useState(false);
  const [error,       setError]       = useState(null);

  const params   = new URLSearchParams(location.search);
  const query    = params.get("q") || "";
  const category = params.get("category") || "all";

  const total = places.length + hotels.length + restaurants.length;

  useEffect(() => {
    if (!isLoaded || !query) return;
    if (!isSignedIn || !user) {
      setError("Please sign in to search.");
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetch(
      `${API}/api/search?q=${encodeURIComponent(query)}&category=${category}`,
      { headers: { "X-Clerk-User-Id": user.id, "X-Clerk-User-Name": user.fullName || "" } }
    )
      .then(res => {
        if (res.status === 401) throw new Error("Please sign in to search.");
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (cancelled) return;
        setPlaces(data.results?.places || []);
        setHotels(data.results?.hotels || []);
        setRestaurants(data.results?.restaurants || []);
      })
      .catch(e => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  }, [query, category, isLoaded, isSignedIn, user]);

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900"}`}>

      {/* ── Sticky header ── */}
      <div className={`sticky top-0 z-40 border-b backdrop-blur-xl shadow-sm
        ${theme === "dark" ? "bg-slate-900/95 border-slate-700" : "bg-white/95 border-slate-200"}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)}
            className={`p-2 rounded-xl transition-colors ${theme === "dark" ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-600"}`}>
            <FaArrowLeft />
          </button>
          <FaSearch className="text-teal-500" />
          <div className="flex-1">
            <span className={`font-black text-lg ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
              {isLoading ? "Searching…" : `${total} result${total !== 1 ? "s" : ""} for `}
            </span>
            {!isLoading && (
              <span className="text-teal-500 font-black text-lg">"{query}"</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <FaSpinner className="text-5xl text-teal-500 animate-spin" />
            <p className="text-slate-500 font-semibold">Searching destinations…</p>
          </div>
        ) : error ? (
          <div className="text-center py-32">
            <p className="text-red-500 text-lg font-semibold mb-4">{error}</p>
            <button onClick={() => window.location.reload()}
              className="px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700">
              Try Again
            </button>
          </div>
        ) : total === 0 ? (
          <div className="text-center py-32">
            <FaSearch className="text-6xl text-slate-300 mx-auto mb-4" />
            <p className="text-2xl font-bold mb-2">No results for "{query}"</p>
            <p className="text-slate-500">Try different keywords</p>
          </div>
        ) : (
          <>
            {/* Destinations */}
            <Section
              title="Destinations"
              icon={FaMountain}
              accent="teal"
              items={places}
              type="place"
              theme={theme}
              navigate={navigate}
              query={query}
            />

            {/* Hotels */}
            <Section
              title="Hotels & Stays"
              icon={FaHotel}
              accent="blue"
              items={hotels}
              type="hotel"
              theme={theme}
              navigate={navigate}
              query={query}
            />

            {/* Restaurants */}
            <Section
              title="Restaurants & Dining"
              icon={FaUtensils}
              accent="orange"
              items={restaurants}
              type="restaurant"
              theme={theme}
              navigate={navigate}
              query={query}
            />
          </>
        )}
      </div>
    </div>
  );
}
