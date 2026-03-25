import { getLocalizedFallback, KATHMANDU_NEIGHBORHOODS } from '../constants/locationFallbacks';

// ---------------------------------------------------------------------------
// Address parsing helpers (shared across multiple geocoding APIs)
// ---------------------------------------------------------------------------

/**
 * Extracts the most specific neighbourhood string from a Nominatim address object.
 */
export const extractNeighborhood = (address) =>
    address.neighbourhood ||
    address.suburb ||
    address.quarter ||
    address.residential ||
    address.hamlet ||
    address.village ||
    address.locality ||
    address.town_district ||
    address.district ||
    address.city_district ||
    address.borough ||
    null;

/**
 * Extracts city from a Nominatim address object.
 */
export const extractCity = (address) =>
    address.city || address.town || address.municipality || address.county || null;

/**
 * Builds a human-readable location string from a Nominatim `data` response.
 * Returns at most 3 comma-separated parts, ordered most-specific → least.
 */
export const formatLocationName = (data, language) => {
    const address = data.address || {};

    const houseNumber = address.house_number;
    const road = address.road || address.street;
    const neighborhood = extractNeighborhood(address);
    const locality = address.locality || address.village || address.hamlet || address.town_district;
    const district = address.district || address.county || address.municipality;
    const city = address.city || address.town || address.city_district;
    const state = address.state || address.region || address.province;
    const country = address.country;
    const amenity = address.amenity;
    // const shop = address.shop;
    const building = address.building;

    let parts = [];

    if (amenity && (neighborhood || locality || road)) parts.push(amenity);

    if (building && road) {
        parts.push(`${building}, ${road}`);
    } else if (houseNumber && road) {
        parts.push(`${houseNumber} ${road}`);
    } else if (road && (neighborhood || locality)) {
        parts.push(`${road}, ${neighborhood || locality}`);
    } else if (road) {
        parts.push(road);
    }

    if (neighborhood && !parts.some(p => p.includes(neighborhood))) parts.push(neighborhood);
    else if (locality && !parts.some(p => p.includes(locality))) parts.push(locality);

    if (district && district !== city && !parts.some(p => p.includes(district))) parts.push(district);
    if (city && !parts.some(p => p.includes(city))) parts.push(city);
    if (state && state !== city) parts.push(state);
    if (country) parts.push(country);

    let result = parts.filter(Boolean).slice(0, 3).join(', ');

    // Fallback to display_name if we didn't get enough detail
    if (!result || parts.length < 2) {
        if (data.display_name) {
            result = data.display_name.split(',').map(p => p.trim()).slice(0, 3).join(', ');
        }
    }

    return result || getLocalizedFallback(language);
};

// ---------------------------------------------------------------------------
// Manual neighborhood bounding-box lookup (last-resort before coords)
// ---------------------------------------------------------------------------

export const tryNeighborhoodMapping = (latitude, longitude) => {
    for (const n of KATHMANDU_NEIGHBORHOODS) {
        const { minLat, maxLat, minLon, maxLon } = n.bounds;
        if (latitude >= minLat && latitude <= maxLat && longitude >= minLon && longitude <= maxLon) {
            return `${n.name}, Kathmandu, Nepal`;
        }
    }
    return null;
};

// ---------------------------------------------------------------------------
// Core reverse-geocoding orchestrator
// ---------------------------------------------------------------------------

/**
 * Tries multiple geocoding APIs in order and returns the best result.
 * @param {number} latitude
 * @param {number} longitude
 * @param {string} language  - BCP-47 language code (e.g. 'en', 'ne')
 * @param {number} gpsAccuracy - GPS accuracy in metres (used for logging only)
 * @param {Function} [addDebugLog] - optional debug logger (message, data?) => void
 * @returns {Promise<string>} Human-readable location string
 */
export const reverseGeocodeWithMaxAccuracy = async (
    latitude, longitude, language, gpsAccuracy, addDebugLog = () => { }
) => {
    addDebugLog(`Starting reverse geocoding: ${latitude}, ${longitude} (±${gpsAccuracy}m)`);

    const apis = [
        {
            name: 'Nominatim-Ultra-Precise',
            priority: 1,
            url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=${language}&addressdetails=1&zoom=20&extratags=1&namedetails=1&polygon_geojson=0`,
            parser: (data) => {
                const address = data.address || {};
                let parts = [];

                const neighborhood = extractNeighborhood(address);
                const road = address.road || address.street || address.pedestrian || address.footway;
                const houseNumber = address.house_number || address.building;
                const city = extractCity(address);
                const country = address.country;

                if (houseNumber && road && neighborhood) {
                    parts.push(`${houseNumber} ${road}`, neighborhood, city || country);
                } else if (road && neighborhood && road !== neighborhood) {
                    parts.push(road, neighborhood, city || country);
                } else if (neighborhood && city && neighborhood !== city) {
                    parts.push(neighborhood, city, country);
                } else if (neighborhood) {
                    parts.push(neighborhood, city || address.state || country);
                } else if (road && city) {
                    parts.push(road, city, country);
                } else if (road) {
                    parts.push(road, city || address.state || country);
                } else {
                    const displayParts = data.display_name?.split(',') || [];
                    if (displayParts.length >= 3) parts = displayParts.slice(0, 3).map(p => p.trim());
                }

                return parts.filter(Boolean).slice(0, 3).join(', ') || null;
            },
        },
        {
            name: 'Overpass-Neighborhood',
            priority: 2,
            url: `https://overpass-api.de/api/interpreter?data=[out:json][timeout:10];(way(around:100,${latitude},${longitude})["place"~"neighbourhood|suburb|quarter|hamlet"];relation(around:100,${latitude},${longitude})["place"~"neighbourhood|suburb|quarter|hamlet"];);out geom;`,
            parser: (data) => {
                if (data.elements?.length > 0) {
                    const tags = data.elements[0].tags || {};
                    if (tags.name) return `${tags.name}, Kathmandu, Nepal`;
                }
                return null;
            },
        },
        {
            name: 'BigDataCloud-Locality',
            priority: 3,
            url: `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=${language}&localityType=neighbourhood`,
            parser: (data) => {
                const parts = [];
                if (data.locality) parts.push(data.locality);
                if (data.localityInfo?.administrative) {
                    const admin = data.localityInfo.administrative;
                    for (let i = admin.length - 1; i >= 0; i--) {
                        if (admin[i].name && !parts.includes(admin[i].name)) {
                            parts.push(admin[i].name);
                            break;
                        }
                    }
                }
                if (data.city && !parts.includes(data.city)) parts.push(data.city);
                if (data.countryName) parts.push(data.countryName);
                return parts.slice(0, 3).join(', ') || null;
            },
        },
        {
            name: 'Nominatim-Multi-Zoom',
            priority: 4,
            url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=${language}&addressdetails=1&zoom=19&extratags=1`,
            parser: (data) => {
                const address = data.address || {};
                const specificArea =
                    address.neighbourhood || address.suburb || address.quarter ||
                    address.locality || address.village || address.hamlet ||
                    address.residential || address.town_district;
                return specificArea ? `${specificArea}, Kathmandu, Nepal` : null;
            },
        },
        {
            name: 'Photon-Neighborhood',
            priority: 5,
            url: `https://photon.komoot.io/reverse?lat=${latitude}&lon=${longitude}&lang=${language}&limit=5`,
            parser: (data) => {
                if (data.features?.length > 0) {
                    for (const feature of data.features) {
                        const props = feature.properties || {};
                        if (props.type === 'neighbourhood' || props.type === 'suburb') {
                            return `${props.name}, Kathmandu, Nepal`;
                        }
                        if (props.district && props.district !== 'Kathmandu') {
                            return `${props.district}, Kathmandu, Nepal`;
                        }
                    }
                    const props = data.features[0].properties || {};
                    if (props.name && props.name !== 'Kathmandu') return `${props.name}, Kathmandu, Nepal`;
                }
                return null;
            },
        },
    ];

    const allResults = [];

    for (const api of apis) {
        try {
            addDebugLog(`Trying ${api.name}`);
            const response = await fetch(api.url, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'User-Agent': 'RoamioWanderly/2.0 (Neighborhood Detection Mode)',
                },
            });

            if (response.ok) {
                const data = await response.json();
                const locationName = api.parser(data);

                if (locationName && !locationName.includes('undefined') && locationName !== 'Kathmandu, Nepal') {
                    const parts = locationName.split(',').map(p => p.trim());
                    const hasNeighborhood = parts.length >= 2 && parts[0] !== 'Kathmandu';
                    const hasRoad = /road|street|marg|chowk|tole/i.test(locationName);
                    let score = parts.length;
                    if (hasNeighborhood) score += 5;
                    if (hasRoad) score += 3;

                    allResults.push({ api: api.name, location: locationName, score, priority: api.priority });
                    addDebugLog(`${api.name} SUCCESS: ${locationName} (score: ${score})`);
                } else {
                    addDebugLog(`${api.name} returned generic/invalid result: ${locationName}`);
                }
            } else {
                addDebugLog(`${api.name} HTTP ${response.status}`);
            }
        } catch (err) {
            addDebugLog(`${api.name} failed`, { error: err.message });
        }
    }

    if (allResults.length > 0) {
        allResults.sort((a, b) => b.score - a.score || a.priority - b.priority);
        const best = allResults[0];
        addDebugLog(`Best result: ${best.location} from ${best.api}`);
        return best.location;
    }

    // Manual bounding-box fallback
    const manualResult = tryNeighborhoodMapping(latitude, longitude);
    if (manualResult) {
        addDebugLog(`Manual mapping: ${manualResult}`);
        return manualResult;
    }

    const coords = `${latitude.toFixed(6)}°, ${longitude.toFixed(6)}° (Kathmandu Area)`;
    addDebugLog(`All APIs failed, using coordinates: ${coords}`);
    return coords;
};

// ---------------------------------------------------------------------------
// Network / IP-based location (used when GPS is unavailable)
// ---------------------------------------------------------------------------

/**
 * Detects location via IP-based APIs (no GPS required).
 * @param {string} language
 * @param {Function} [addDebugLog]
 * @returns {Promise<string>} Human-readable location string with leading emoji
 */
export const detectLocationByNetwork = async (language, addDebugLog = () => { }) => {
    addDebugLog('Starting network-based location detection');

    const networkApis = [
        {
            name: 'NetworkGeo',
            url: 'https://ip-api.com/json/?fields=status,country,regionName,city,lat,lon,timezone,query',
            parser: (data) => {
                if (data.status === 'success') {
                    if (data.city && data.country) return `${data.city}, ${data.country}`;
                    if (data.regionName && data.country) return `${data.regionName}, ${data.country}`;
                    if (data.country) return data.country;
                }
                return null;
            },
        },
        {
            name: 'GeoLocation',
            url: 'https://ipinfo.io/json',
            parser: (data) => {
                if (data.city && data.country) return `${data.city}, ${data.country}`;
                if (data.region && data.country) return `${data.region}, ${data.country}`;
                if (data.country) return data.country;
                return null;
            },
        },
    ];

    for (const api of networkApis) {
        try {
            addDebugLog(`Trying ${api.name}`);
            const response = await fetch(api.url);
            if (response.ok) {
                const data = await response.json();
                const locationName = api.parser(data);
                if (locationName) {
                    addDebugLog(`${api.name} SUCCESS: ${locationName}`);
                    return `🌐 ${locationName}`;
                }
            }
        } catch (err) {
            addDebugLog(`${api.name} failed`, { error: err.message });
        }
    }

    addDebugLog('All network APIs failed, using fallback');
    return `❓ ${getLocalizedFallback(language)}`;
};