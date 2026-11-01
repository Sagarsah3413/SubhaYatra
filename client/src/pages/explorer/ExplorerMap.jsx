import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { canShowPin } from './explorerUtils';

// Default Leaflet marker icons (reuse the same CDN fix used in Contact.jsx).
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Nepal center + bounds fallback.
const NEPAL_CENTER = [28.3949, 84.124];

/**
 * Map panel for the current result set. Renders pins ONLY for destinations
 * with verified coordinates and map_pin_allowed === true. Suspect/unreliable
 * records never get a pin (they carry an "Approximate location" note on cards).
 */
export default function ExplorerMap({ destinations }) {
  const navigate = useNavigate();
  const pinned = (destinations || []).filter(canShowPin);

  const center =
    pinned.length > 0 ? [pinned[0].latitude, pinned[0].longitude] : NEPAL_CENTER;

  return (
    <div className="overflow-hidden rounded-lg border border-surface-300 dark:border-navy-700">
      <div className="border-b border-surface-200 px-4 py-2.5 text-sm text-surface-600 dark:border-navy-700 dark:text-slate-400">
        {pinned.length > 0
          ? `${pinned.length} of ${destinations.length} shown — only verified coordinates are mapped`
          : 'No verified coordinates in these results'}
      </div>
      <div className="h-[420px] w-full">
        <MapContainer
          center={center}
          zoom={pinned.length > 0 ? 7 : 6}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {pinned.map((d) => (
            <Marker key={d.id} position={[d.latitude, d.longitude]}>
              <Popup>
                <div className="space-y-1">
                  <p className="font-semibold">{d.name}</p>
                  <p className="text-xs text-gray-600">
                    {d.province}
                    {d.district ? ` · ${d.district}` : ''}
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate(`/place/${d.id}`)}
                    className="text-xs font-semibold text-amber-600 underline"
                  >
                    View details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
