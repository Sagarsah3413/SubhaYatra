import { FaMapMarkerAlt, FaHotel, FaUtensils, FaMountain, FaStar } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

const TYPE_CONFIG = {
  place:      { icon: FaMountain, label: "Place",      color: "text-emerald-400", badge: "bg-emerald-900/50 text-emerald-300" },
  hotel:      { icon: FaHotel,    label: "Hotel",      color: "text-blue-400",    badge: "bg-blue-900/50 text-blue-300" },
  restaurant: { icon: FaUtensils, label: "Restaurant", color: "text-orange-400",  badge: "bg-orange-900/50 text-orange-300" },
};

function getConfig(type) {
  return TYPE_CONFIG[(type || '').toLowerCase()] || TYPE_CONFIG.place;
}

export default function SearchDropdownList({ results, onSelect, selectedIndex = -1, theme = 'dark' }) {
  if (!results?.length) return null;

  return (
    <div onMouseDown={e => e.stopPropagation()}>
      {results.map((item, index) => {
        const cfg = getConfig(item._type || item.type);
        const Icon = cfg.icon;
        const isSelected = selectedIndex === index;

        const rawPath = (item.all_images && Array.isArray(item.all_images) && item.all_images.length)
          ? item.all_images[0]
          : item.image_url;
        const imgSrc = rawPath
          ? rawPath.startsWith('http')
            ? rawPath
            : (() => {
                const parts = rawPath.split('/');
                const prefix = parts.slice(0, 4).join('/');
                const rest   = parts.slice(4).map(encodeURIComponent).join('/');
                return `${API}${prefix}/${rest}`;
              })()
          : null;

        return (
          <button
            key={`${item.name}-${index}`}
            onClick={() => onSelect(item)}
            className={`w-full text-left transition-all duration-150 ${
              isSelected
                ? "bg-teal-900/60"
                : theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-50"
            }`}
          >
            <div className="px-3 py-2 flex items-center gap-2">
              {/* Thumbnail */}
              <div className={`flex-shrink-0 w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center ${
                theme === "dark" ? "bg-slate-700" : "bg-slate-100"
              }`}>
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                  />
                ) : null}
                <div className={`w-full h-full items-center justify-center ${imgSrc ? "hidden" : "flex"}`}>
                  <Icon className={`text-base ${cfg.color}`} />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={`font-semibold text-xs truncate ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                    {item.name}
                  </span>
                  {item.rating && (
                    <span className="flex items-center gap-0.5 text-[10px] text-amber-400 shrink-0">
                      <FaStar className="text-[8px]" />{Number(item.rating).toFixed(1)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className={`px-1.5 py-0.5 rounded-full font-medium ${cfg.badge}`}>
                    {cfg.label}
                  </span>
                  {item.location && (
                    <span className={`flex items-center gap-0.5 truncate ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                      <FaMapMarkerAlt className="text-[8px] shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
