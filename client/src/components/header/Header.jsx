import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { UserButton, SignUpButton, SignedIn, SignedOut, useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import NepaliCalendar from "../../pages/NepaliCalendar";
import { useTheme } from "../../contexts/ThemeContext";
import { FaMapMarkerAlt, FaGlobe, FaCompass, FaCamera, FaBookOpen, FaEnvelope, FaUser, FaCog, FaQuestionCircle, FaSearch, FaInfoCircle, FaPhone, FaBars, FaPlusCircle } from "react-icons/fa";

/**
 * Premium Header Component
 * 
 * An ultra-modern, responsive navigation header featuring:
 * - Advanced location detection with GPS accuracy
 * - Premium visual effects and animations
 * - Multi-language support with smooth transitions
 * - Integrated Nepali calendar with portal rendering
 * - Theme switching with sophisticated animations
 * - Mobile-first responsive design
 * - Authentication integration with Clerk
 * - Debug panels for development
 * 
 * @param {Object} props - Component props
 */
export const Header = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const { signOut } = useClerk();

  // Authentication state with error handling
  let clerkAvailable = false;
  try {
    const { user } = useUser();
    clerkAvailable = !!user;
  } catch (e) {
    clerkAvailable = false;
  }

  // Component state
  const [showCalendar, setShowCalendar] = useState(false);
  const [mobileAnimating, setMobileAnimating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || 'en');
  const [currentLocation, setCurrentLocation] = useState('Detecting location...');
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [locationRetryCount, setLocationRetryCount] = useState(0);
  const [locationError, setLocationError] = useState(null);
  const [showLocationDebug, setShowLocationDebug] = useState(false); // Debug panel toggle
  const [locationDebugInfo, setLocationDebugInfo] = useState([]); // Debug information
  const [locationAnimating, setLocationAnimating] = useState(false); // Location update animation
  const [showSearchModal, setShowSearchModal] = useState(false); // Search modal state
  const [searchQuery, setSearchQuery] = useState(''); // Search query state

  // Debug logging
  console.log('Header render - showCalendar:', showCalendar);

  // Refs for DOM manipulation and focus management
  const calendarRef = useRef(null);
  const triggerRef = useRef(null);
  const previousActive = useRef(null);

  // Event handlers
  const handleLogoClick = () => navigate("/");

  const handleNavigation = (path) => {
    console.log('Header navigation clicked:', path);
    navigate(path);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    i18n.changeLanguage(language);
    // Re-detect location with new language
    detectUserLocation(language);
    console.log('Language changed to:', language);
  };

  // Debug logging function
  const addDebugLog = (message, data = null) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
      timestamp,
      message,
      data: data ? JSON.stringify(data, null, 2) : null
    };
    setLocationDebugInfo(prev => [...prev.slice(-9), logEntry]); // Keep last 10 entries
    console.log(`🔍 [${timestamp}] ${message}`, data || '');
  };

  // Enhanced location detection with maximum accuracy
  const detectUserLocation = async (language = selectedLanguage, retryCount = 0) => {
    setIsLocationLoading(true);
    setLocationError(null);
    setLocationAnimating(true); // Trigger animation
    
    addDebugLog(`Starting ULTRA high-accuracy location detection (attempt ${retryCount + 1})`);
    
    try {
      // Get user's position with MAXIMUM accuracy settings
      const position = await getCurrentPositionAsync({
        enableHighAccuracy: true, // Always use high accuracy GPS
        timeout: 45000, // Extended timeout for maximum accuracy (45 seconds)
        maximumAge: 0 // Always get fresh location, absolutely no cache
      });

      if (position) {
        const { latitude, longitude, accuracy, altitude, heading, speed } = position.coords;
        const locationInfo = { 
          latitude: parseFloat(latitude.toFixed(8)), // High precision
          longitude: parseFloat(longitude.toFixed(8)),
          accuracy: Math.round(accuracy),
          altitude: altitude ? Math.round(altitude) : null,
          heading: heading ? Math.round(heading) : null,
          speed: speed ? Math.round(speed) : null,
          timestamp: new Date(position.timestamp).toLocaleTimeString()
        };
        
        addDebugLog('HIGH-ACCURACY GPS SUCCESS', locationInfo);
        
        // Show precise coordinates first with animation
        setCurrentLocation(`📍 ${latitude.toFixed(6)}, ${longitude.toFixed(6)} (±${Math.round(accuracy)}m)`);
        
        // Get the most accurate location name possible
        const locationName = await reverseGeocodeWithMaxAccuracy(latitude, longitude, language, accuracy);
        
        // Trigger slide animation for location update
        setTimeout(() => {
          setCurrentLocation(`🌍 ${locationName}`);
          setLocationAnimating(false);
        }, 300);
        
        setLocationRetryCount(0);
        
        addDebugLog(`FINAL ACCURATE LOCATION: ${locationName}`);
      } else {
        addDebugLog('GPS FAILED: No position data received');
        await detectLocationByNetwork(language);
      }
    } catch (error) {
      addDebugLog(`GPS ERROR (attempt ${retryCount + 1})`, { 
        error: error.message, 
        code: error.code,
        PERMISSION_DENIED: error.code === 1,
        POSITION_UNAVAILABLE: error.code === 2,
        TIMEOUT: error.code === 3
      });
      
      // Handle specific GPS errors
      if (error.code === 1) { // PERMISSION_DENIED
        setLocationError('Location permission denied');
        await detectLocationByNetwork(language);
      } else if (error.code === 2) { // POSITION_UNAVAILABLE
        setLocationError('GPS unavailable');
        await detectLocationByNetwork(language);
      } else if (error.code === 3) { // TIMEOUT
        if (retryCount < 2) {
          addDebugLog(`GPS TIMEOUT: Retrying with lower accuracy (attempt ${retryCount + 2})`);
          setLocationRetryCount(retryCount + 1);
          setTimeout(() => {
            detectUserLocationFallback(language, retryCount + 1);
          }, 1000);
          return;
        } else {
          setLocationError('GPS timeout');
          await detectLocationByNetwork(language);
        }
      } else {
        // Unknown error, try fallback
        if (retryCount < 1) {
          addDebugLog(`Unknown GPS error: Retrying (attempt ${retryCount + 2})`);
          setLocationRetryCount(retryCount + 1);
          setTimeout(() => {
            detectUserLocation(language, retryCount + 1);
          }, 2000);
          return;
        } else {
          await detectLocationByNetwork(language);
        }
      }
    }
    
    setIsLocationLoading(false);
    setLocationAnimating(false);
  };

  // Fallback location detection with lower accuracy requirements
  const detectUserLocationFallback = async (language = selectedLanguage, retryCount = 0) => {
    addDebugLog(`Trying fallback GPS with lower accuracy (attempt ${retryCount + 1})`);
    
    try {
      const position = await getCurrentPositionAsync({
        enableHighAccuracy: false, // Lower accuracy but faster
        timeout: 15000,
        maximumAge: 300000 // Allow 5-minute cache
      });

      if (position) {
        const { latitude, longitude, accuracy } = position.coords;
        addDebugLog('FALLBACK GPS SUCCESS', { latitude, longitude, accuracy });
        
        setCurrentLocation(`📍 ${latitude.toFixed(4)}, ${longitude.toFixed(4)} (±${Math.round(accuracy)}m)`);
        
        const locationName = await reverseGeocodeWithMaxAccuracy(latitude, longitude, language, accuracy);
        setCurrentLocation(`🌍 ${locationName}`);
        setLocationRetryCount(0);
      } else {
        await detectLocationByNetwork(language);
      }
    } catch (error) {
      addDebugLog('FALLBACK GPS FAILED', { error: error.message });
      await detectLocationByNetwork(language);
    }
  };

  // Promise-based geolocation wrapper
  const getCurrentPositionAsync = (options) => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => {
          console.error('Geolocation error:', error.message);
          resolve(null); // Don't reject, just return null to try fallback
        },
        options
      );
    });
  };

  // Network-based location detection (renamed from IP-based)
  const detectLocationByNetwork = async (language) => {
    try {
      addDebugLog('Starting network-based location detection...');
      
      const networkApis = [
        {
          name: 'NetworkGeo',
          url: 'https://ip-api.com/json/?fields=status,country,regionName,city,lat,lon,timezone,query',
          parser: (data) => {
            addDebugLog('NetworkGeo response:', data);
            if (data.status === 'success') {
              if (data.city && data.country) {
                return `${data.city}, ${data.country}`;
              } else if (data.regionName && data.country) {
                return `${data.regionName}, ${data.country}`;
              } else if (data.country) {
                return data.country;
              }
            }
            return null;
          }
        },
        {
          name: 'GeoLocation',
          url: 'https://ipinfo.io/json',
          parser: (data) => {
            addDebugLog('GeoLocation response:', data);
            if (data.city && data.country) {
              return `${data.city}, ${data.country}`;
            } else if (data.region && data.country) {
              return `${data.region}, ${data.country}`;
            } else if (data.country) {
              return data.country;
            }
            return null;
          }
        }
      ];

      for (const api of networkApis) {
        try {
          addDebugLog(`Trying ${api.name} network service...`);
          const response = await fetch(api.url);
          if (response.ok) {
            const data = await response.json();
            const locationName = api.parser(data);
            
            if (locationName) {
              addDebugLog(`${api.name} SUCCESS: ${locationName}`);
              setCurrentLocation(`🌐 ${locationName}`);
              return;
            }
          }
        } catch (error) {
          addDebugLog(`${api.name} failed:`, { error: error.message });
          continue;
        }
      }

      // Final fallback
      addDebugLog('All network services failed, using fallback');
      setCurrentLocation(`❓ ${getLocalizedFallback(language)}`);
    } catch (error) {
      addDebugLog('Network location detection failed:', { error: error.message });
      setCurrentLocation(`❓ ${getLocalizedFallback(language)}`);
    }
  };

  // Ultra-accurate reverse geocoding with forced neighborhood detection
  const reverseGeocodeWithMaxAccuracy = async (latitude, longitude, language, gpsAccuracy) => {
    addDebugLog(`Starting ULTRA-PRECISE neighborhood detection for: ${latitude}, ${longitude} (GPS accuracy: ±${gpsAccuracy}m)`);
    
    // Use maximum zoom for neighborhood detection - ALWAYS zoom 20 for best results
    const zoomLevel = 20; // Maximum zoom for street-level accuracy
    
    addDebugLog(`Using MAXIMUM zoom level ${zoomLevel} for precise neighborhood detection`);
    
    const apis = [
      // Ultra-high resolution Nominatim for neighborhoods - PRIMARY SOURCE
      {
        name: 'Nominatim-Ultra-Precise',
        url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=${language}&addressdetails=1&zoom=20&extratags=1&namedetails=1&polygon_geojson=0`,
        priority: 1,
        parser: (data) => {
          addDebugLog(`Nominatim-Ultra-Precise response:`, data);
          
          const address = data.address || {};
          let parts = [];
          
          // FORCE neighborhood detection - check ALL possible neighborhood fields in priority order
          const neighborhood = address.neighbourhood || address.suburb || address.quarter || 
                              address.residential || address.hamlet || address.village ||
                              address.locality || address.town_district || address.district ||
                              address.city_district || address.borough;
          
          const road = address.road || address.street || address.pedestrian || address.footway;
          const houseNumber = address.house_number || address.building;
          const city = address.city || address.town || address.municipality || address.county;
          const state = address.state || address.region || address.province;
          const country = address.country;
          
          // Build MOST specific location possible with priority hierarchy
          if (houseNumber && road && neighborhood) {
            // Best case: House number + Road + Neighborhood
            parts.push(`${houseNumber} ${road}`, neighborhood, city || country);
          } else if (road && neighborhood && road !== neighborhood) {
            // Very good: Road + Neighborhood (different)
            parts.push(`${road}`, neighborhood, city || country);
          } else if (neighborhood && city && neighborhood !== city) {
            // Good: Neighborhood + City (different)
            parts.push(neighborhood, city, country);
          } else if (neighborhood) {
            // Acceptable: Just neighborhood
            parts.push(neighborhood, city || state || country);
          } else if (road && city) {
            // Fallback: Road + City
            parts.push(road, city, country);
          } else if (road) {
            // Minimal: Just road
            parts.push(road, city || state || country);
          } else {
            // Last resort: Parse display name for most specific parts
            const displayParts = data.display_name?.split(',') || [];
            if (displayParts.length >= 3) {
              // Take first 3 parts which are usually most specific
              parts = displayParts.slice(0, 3).map(p => p.trim());
            }
          }
          
          const result = parts.filter(Boolean).slice(0, 3).join(', ');
          addDebugLog(`Nominatim-Ultra-Precise parsed: ${result}`);
          return result || null;
        }
      },
      
      // Overpass API for detailed neighborhood data
      {
        name: 'Overpass-Neighborhood',
        url: `https://overpass-api.de/api/interpreter?data=[out:json][timeout:10];(way(around:100,${latitude},${longitude})["place"~"neighbourhood|suburb|quarter|hamlet"];relation(around:100,${latitude},${longitude})["place"~"neighbourhood|suburb|quarter|hamlet"];);out geom;`,
        priority: 2,
        parser: (data) => {
          addDebugLog(`Overpass-Neighborhood response:`, data);
          
          if (data.elements && data.elements.length > 0) {
            const element = data.elements[0];
            const tags = element.tags || {};
            
            if (tags.name) {
              return `${tags.name}, Kathmandu, Nepal`;
            }
          }
          return null;
        }
      },
      
      // BigDataCloud with forced locality detection
      {
        name: 'BigDataCloud-Locality',
        url: `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=${language}&localityType=neighbourhood`,
        priority: 3,
        parser: (data) => {
          addDebugLog(`BigDataCloud-Locality response:`, data);
          
          let parts = [];
          
          // Extract all possible locality information
          if (data.locality) parts.push(data.locality);
          if (data.localityInfo && data.localityInfo.administrative) {
            const admin = data.localityInfo.administrative;
            // Get the most specific administrative area
            for (let i = admin.length - 1; i >= 0; i--) {
              if (admin[i].name && !parts.includes(admin[i].name)) {
                parts.push(admin[i].name);
                break;
              }
            }
          }
          if (data.city && !parts.includes(data.city)) parts.push(data.city);
          if (data.countryName) parts.push(data.countryName);
          
          const result = parts.slice(0, 3).join(', ');
          addDebugLog(`BigDataCloud-Locality parsed: ${result}`);
          return result || null;
        }
      },
      
      // Multiple Nominatim calls with different zoom levels
      {
        name: 'Nominatim-Multi-Zoom',
        url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=${language}&addressdetails=1&zoom=19&extratags=1`,
        priority: 4,
        parser: (data) => {
          addDebugLog(`Nominatim-Multi-Zoom response:`, data);
          
          const address = data.address || {};
          
          // Try to extract the most specific area name
          const specificArea = address.neighbourhood || address.suburb || address.quarter ||
                              address.locality || address.village || address.hamlet ||
                              address.residential || address.town_district;
          
          if (specificArea) {
            return `${specificArea}, Kathmandu, Nepal`;
          }
          
          return null;
        }
      },
      
      // Photon API with neighborhood focus
      {
        name: 'Photon-Neighborhood',
        url: `https://photon.komoot.io/reverse?lat=${latitude}&lon=${longitude}&lang=${language}&limit=5`,
        priority: 5,
        parser: (data) => {
          addDebugLog(`Photon-Neighborhood response:`, data);
          
          if (data.features && data.features.length > 0) {
            // Look through all features for neighborhood data
            for (const feature of data.features) {
              const props = feature.properties || {};
              
              if (props.type === 'neighbourhood' || props.type === 'suburb') {
                return `${props.name}, Kathmandu, Nepal`;
              }
              
              if (props.district && props.district !== 'Kathmandu') {
                return `${props.district}, Kathmandu, Nepal`;
              }
            }
            
            // Fallback to first feature
            const props = data.features[0].properties || {};
            if (props.name && props.name !== 'Kathmandu') {
              return `${props.name}, Kathmandu, Nepal`;
            }
          }
          
          return null;
        }
      }
    ];

    // Try each API and collect all results
    let allResults = [];

    for (const api of apis) {
      try {
        addDebugLog(`Trying ${api.name} for neighborhood detection`);
        
        const response = await fetch(api.url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'RoamioWanderly/2.0 (Neighborhood Detection Mode)'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const locationName = api.parser(data);
          
          if (locationName && !locationName.includes('undefined') && locationName !== 'Kathmandu, Nepal') {
            // Score based on specificity
            const parts = locationName.split(',').map(p => p.trim());
            const hasNeighborhood = parts.length >= 2 && parts[0] !== 'Kathmandu';
            const hasRoad = /road|street|marg|chowk|tole/i.test(locationName);
            
            let score = parts.length;
            if (hasNeighborhood) score += 5;
            if (hasRoad) score += 3;
            
            allResults.push({
              api: api.name,
              location: locationName,
              score: score,
              priority: api.priority
            });
            
            addDebugLog(`${api.name} SUCCESS: ${locationName} (Score: ${score})`);
          } else {
            addDebugLog(`${api.name} returned generic or invalid result: ${locationName}`);
          }
        } else {
          addDebugLog(`${api.name} HTTP error: ${response.status}`);
        }
      } catch (error) {
        addDebugLog(`${api.name} failed:`, { error: error.message });
        continue;
      }
    }

    // Select the best result
    if (allResults.length > 0) {
      // Sort by score (descending) then by priority (ascending)
      allResults.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.priority - b.priority;
      });
      
      const bestResult = allResults[0];
      addDebugLog(`Best neighborhood result: ${bestResult.location} from ${bestResult.api} (Score: ${bestResult.score})`);
      addDebugLog(`All results:`, allResults);
      
      return bestResult.location;
    }

    // If no specific neighborhood found, try manual neighborhood mapping
    const neighborhoodResult = await tryNeighborhoodMapping(latitude, longitude);
    if (neighborhoodResult) {
      addDebugLog(`Manual neighborhood mapping: ${neighborhoodResult}`);
      return neighborhoodResult;
    }

    // Final fallback with high-precision coordinates
    const coordsLocation = `${latitude.toFixed(6)}°, ${longitude.toFixed(6)}° (Kathmandu Area)`;
    addDebugLog(`All neighborhood detection failed, using coordinates: ${coordsLocation}`);
    return coordsLocation;
  };

  // Manual neighborhood mapping for Kathmandu areas
  const tryNeighborhoodMapping = async (latitude, longitude) => {
    addDebugLog(`Trying manual neighborhood mapping for: ${latitude}, ${longitude}`);
    
    // Define neighborhood boundaries for Kathmandu valley
    const neighborhoods = [
      { name: 'Mahalaxmi', bounds: { minLat: 27.685, maxLat: 27.695, minLon: 85.315, maxLon: 85.325 } },
      { name: 'Thamel', bounds: { minLat: 27.715, maxLat: 27.720, minLon: 85.320, maxLon: 85.328 } },
      { name: 'Kalimati', bounds: { minLat: 27.685, maxLat: 27.692, minLon: 85.318, maxLon: 85.325 } },
      { name: 'Baneshwor', bounds: { minLat: 27.708, maxLat: 27.715, minLon: 85.320, maxLon: 85.328 } },
      { name: 'Basantapur', bounds: { minLat: 27.700, maxLat: 27.705, minLon: 85.305, maxLon: 85.312 } },
      { name: 'Patan', bounds: { minLat: 27.660, maxLat: 27.670, minLon: 85.305, maxLon: 85.315 } },
      { name: 'Bhaktapur', bounds: { minLat: 27.670, maxLat: 27.680, minLon: 85.425, maxLon: 85.435 } },
      { name: 'Kirtipur', bounds: { minLat: 27.645, maxLat: 27.655, minLon: 85.275, maxLon: 85.285 } },
      { name: 'Balaju', bounds: { minLat: 27.725, maxLat: 27.735, minLon: 85.295, maxLon: 85.305 } },
      { name: 'Maharajgunj', bounds: { minLat: 27.735, maxLat: 27.745, minLon: 85.320, maxLon: 85.330 } }
    ];
    
    for (const neighborhood of neighborhoods) {
      const bounds = neighborhood.bounds;
      if (latitude >= bounds.minLat && latitude <= bounds.maxLat &&
          longitude >= bounds.minLon && longitude <= bounds.maxLon) {
        addDebugLog(`Manual mapping found: ${neighborhood.name}`);
        return `${neighborhood.name}, Kathmandu, Nepal`;
      }
    }
    
    addDebugLog('No manual neighborhood mapping found');
    return null;
  };

  // Ultra-detailed location formatting with maximum specificity
  const formatLocationName = (data, language) => {
    const address = data.address || {};
    
    // Extract all possible location components from most specific to general
    const houseNumber = address.house_number;
    const road = address.road || address.street;
    const neighborhood = address.neighbourhood || address.suburb || address.quarter || address.residential;
    const locality = address.locality || address.village || address.hamlet || address.town_district;
    const district = address.district || address.county || address.municipality;
    const city = address.city || address.town || address.city_district;
    const state = address.state || address.region || address.province;
    const country = address.country;
    
    // Additional specific areas
    const postcode = address.postcode;
    const amenity = address.amenity;
    const shop = address.shop;
    const building = address.building;
    
    addDebugLog('All address components found:', {
      houseNumber, road, neighborhood, locality, district, city, state, country,
      postcode, amenity, shop, building
    });
    
    // Build ultra-specific location string
    let locationParts = [];
    
    // Start with most specific identifiable location
    if (amenity && (neighborhood || locality || road)) {
      // If there's a specific amenity (like a landmark)
      locationParts.push(amenity);
    }
    
    if (building && road) {
      // Building on a specific road
      locationParts.push(`${building}, ${road}`);
    } else if (houseNumber && road) {
      // House number and road
      locationParts.push(`${houseNumber} ${road}`);
    } else if (road && (neighborhood || locality)) {
      // Road in neighborhood
      locationParts.push(`${road}, ${neighborhood || locality}`);
    } else if (road) {
      // Just the road
      locationParts.push(road);
    }
    
    // Add neighborhood/locality if not already included
    if (neighborhood && !locationParts.some(part => part.includes(neighborhood))) {
      locationParts.push(neighborhood);
    } else if (locality && !locationParts.some(part => part.includes(locality))) {
      locationParts.push(locality);
    }
    
    // Add district if it's different from city and adds value
    if (district && district !== city && !locationParts.some(part => part.includes(district))) {
      locationParts.push(district);
    }
    
    // Add city if not already included
    if (city && !locationParts.some(part => part.includes(city))) {
      locationParts.push(city);
    }
    
    // Add state/country for context
    if (state && state !== city) {
      locationParts.push(state);
    }
    if (country) {
      locationParts.push(country);
    }
    
    // Clean up and format the result
    let result = locationParts.filter(Boolean).slice(0, 3).join(', '); // Limit to 3 parts for readability
    
    // If we didn't get enough detail, try alternative parsing
    if (!result || locationParts.length < 2) {
      // Fallback to display name parsing for maximum detail
      if (data.display_name) {
        const displayParts = data.display_name.split(',').map(part => part.trim());
        // Take first 3 parts which are usually most specific
        result = displayParts.slice(0, 3).join(', ');
      }
    }
    
    // Final fallback
    if (!result) {
      result = getLocalizedFallback(language);
    }
    
    addDebugLog(`Final formatted location: ${result}`);
    return result;
  };

  // Enhanced localized fallback with more options
  const getLocalizedFallback = (language) => {
    const fallbacks = {
      'en': 'Location Unknown',
      'ne': 'स्थान अज्ञात',
      'hi': 'स्थान अज्ञात',
      'zh': '位置未知',
      'ja': '場所不明',
      'ko': '위치 알 수 없음'
    };
    return fallbacks[language] || fallbacks['en'];
  };

  // Force refresh location with user feedback
  const forceRefreshLocation = async () => {
    console.log('Force refreshing location...');
    setCurrentLocation('Refreshing location...');
    setIsLocationLoading(true);
    
    try {
      // Clear any cached position and force new detection
      await detectUserLocation(selectedLanguage);
    } catch (error) {
      console.error('Force refresh failed:', error);
      setCurrentLocation('Location refresh failed');
      setTimeout(() => {
        setCurrentLocation(getLocalizedFallback(selectedLanguage));
      }, 2000);
    }
  };

  const handleCalendarOpen = (e) => {
    console.log('Calendar button clicked!');
    e.preventDefault();
    e.stopPropagation();
    
    triggerRef.current = e.currentTarget;
    
    // Show calendar (animation will be handled by useEffect)
    console.log('Opening calendar...');
    setShowCalendar(true);
    setMobileAnimating(false); // Start hidden
  };

  // Handle calendar animation
  useEffect(() => {
    if (showCalendar && !mobileAnimating) {
      // Start animation after calendar is mounted
      const timer = setTimeout(() => {
        console.log('Starting calendar slide-up animation');
        setMobileAnimating(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [showCalendar, mobileAnimating]);

  // Custom hooks for side effects
  useClickOutsideHandler({ 
    showCalendar, 
    mobileAnimating, 
    setShowCalendar, 
    setMobileAnimating
  });

  useKeyboardHandler({ 
    showCalendar, 
    mobileAnimating, 
    setShowCalendar, 
    setMobileAnimating, 
    calendarRef 
  });
  
  useFocusManagement({ 
    showCalendar, 
    calendarRef, 
    previousActive, 
    setMobileAnimating 
  });

  // Location detection effects
  useEffect(() => {
    // Initial location detection on component mount
    detectUserLocation();
  }, []);

  useEffect(() => {
    // Re-detect location when language changes
    if (selectedLanguage !== i18n.language) {
      detectUserLocation(selectedLanguage);
    }
  }, [selectedLanguage, i18n.language]);

  // Debug panel keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Shift+L to toggle debug panel
      if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        setShowLocationDebug(prev => !prev);
        addDebugLog('Debug panel toggled');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className={`
      fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out transform-gpu will-change-transform
      ${theme === 'dark' 
        ? 'bg-gradient-to-r from-slate-950/99 via-slate-900/97 to-slate-950/99 border-slate-700/30' 
        : 'bg-gradient-to-r from-white/99 via-slate-50/97 to-white/99 border-slate-200/30'
      }
      backdrop-blur-3xl border-b shadow-2xl
      ${theme === 'dark' ? 'shadow-slate-900/60' : 'shadow-slate-900/15'}
      h-28 px-8 sm:px-12 lg:px-16
      flex items-center justify-between
      before:absolute before:inset-0 before:bg-gradient-to-r
      ${theme === 'dark' 
        ? 'before:from-teal-600/4 before:via-cyan-500/2 before:to-emerald-600/4' 
        : 'before:from-teal-500/3 before:via-cyan-400/1 before:to-emerald-500/3'
      }
      before:opacity-0 hover:before:opacity-100 before:transition-all before:duration-1000
      after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px
      after:bg-gradient-to-r after:from-transparent after:via-teal-500/30 after:to-transparent
      after:opacity-0 hover:after:opacity-100 after:transition-all after:duration-700
    `}>
      
      {/* Ultra-Premium Enterprise Background */}
      <div className="absolute inset-0 opacity-[0.008] dark:opacity-[0.015] pointer-events-none overflow-hidden">
        {/* Primary gradient layer */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(6, 182, 212, 0.6) 0%, transparent 70%),
            radial-gradient(circle at 90% 80%, rgba(59, 130, 246, 0.4) 0%, transparent 70%),
            radial-gradient(circle at 50% 5%, rgba(16, 185, 129, 0.35) 0%, transparent 80%),
            radial-gradient(circle at 20% 90%, rgba(139, 92, 246, 0.3) 0%, transparent 60%),
            radial-gradient(circle at 80% 10%, rgba(236, 72, 153, 0.25) 0%, transparent 65%)
          `,
          backgroundSize: '1600px 1600px, 1200px 1200px, 1800px 1800px, 800px 800px, 1000px 1000px',
          animation: 'float 25s ease-in-out infinite'
        }}></div>
        
        {/* Secondary geometric pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 47%, rgba(6, 182, 212, 0.03) 48%, rgba(6, 182, 212, 0.03) 52%, transparent 53%),
            linear-gradient(-45deg, transparent 47%, rgba(16, 185, 129, 0.02) 48%, rgba(16, 185, 129, 0.02) 52%, transparent 53%),
            linear-gradient(90deg, transparent 47%, rgba(59, 130, 246, 0.015) 48%, rgba(59, 130, 246, 0.015) 52%, transparent 53%)
          `,
          backgroundSize: '120px 120px, 80px 80px, 200px 200px'
        }}></div>
        
        {/* Tertiary dot pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at center, rgba(6, 182, 212, 0.08) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          opacity: 0.3
        }}></div>
      </div>

      {/* Left Section: Ultra-Premium Logo + Menu + Location */}
      <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 relative z-10">
        {/* Navigation Menu Bar - Always Visible */}
        <div className="relative">
          <MenuBar 
            theme={theme} 
            onNavigation={handleNavigation}
            forceRefreshLocation={forceRefreshLocation}
            selectedLanguage={selectedLanguage}
            handleLanguageChange={handleLanguageChange}
          />
        </div>

        {/* Enterprise-Grade Logo */}
        <div 
          onClick={handleLogoClick}
          className="group cursor-pointer flex items-center gap-4 p-3 rounded-3xl transition-all duration-500 hover:bg-white/8 dark:hover:bg-white/6 relative overflow-hidden"
        >
          {/* Logo Icon with Premium Effects */}
          <div className="relative">
            <div className={`
              w-16 h-16 rounded-3xl flex items-center justify-center font-black text-2xl
              bg-gradient-to-br from-teal-500 via-cyan-500 to-emerald-500 text-white
              shadow-2xl shadow-teal-500/30 group-hover:shadow-3xl group-hover:shadow-teal-500/50
              transition-all duration-500 group-hover:scale-110 transform-gpu
              relative overflow-hidden border border-white/20
            `}>
              <span className="relative z-10 font-black tracking-tight">R</span>
              
              {/* Inner glow effect */}
              <div className="absolute inset-2 rounded-2xl bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Rotating border effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 opacity-0 group-hover:opacity-20 animate-spin-slow"></div>
            </div>
            
            {/* Outer glow effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-teal-500 via-cyan-500 to-emerald-500 opacity-0 group-hover:opacity-30 blur-2xl transition-all duration-700 -z-10 scale-150"></div>
            
            {/* Pulsing ring */}
            <div className="absolute inset-0 rounded-3xl border-2 border-teal-400/0 group-hover:border-teal-400/40 transition-all duration-500 animate-pulse-ring"></div>
          </div>
          
          {/* Enhanced Brand Text */}
          <div className="hidden sm:block">
            <h1 className="font-black text-3xl leading-none mb-1">
              <span className="text-amber-400 hover:text-amber-300 transition-all duration-500 hover:scale-105 inline-block">Roamio</span>
            </h1>
            <p className="text-base font-bold tracking-widest uppercase">
              <span className="text-teal-400 hover:text-teal-300 transition-all duration-500 hover:scale-105 inline-block">Wanderly</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-teal-500 group-hover:w-full transition-all duration-700"></span>
            </p>
          </div>
          
          {/* Hover background effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-teal-500/5 via-cyan-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
        </div>

        {/* Enhanced Location Indicator with Improved Accuracy & Layout */}
        <div 
          className={`
            hidden lg:flex items-center gap-3 px-5 py-3 rounded-2xl border backdrop-blur-xl
            cursor-pointer transition-all duration-500 group relative overflow-hidden
            ${theme === 'dark' 
              ? 'bg-gradient-to-br from-slate-800/90 via-slate-800/80 to-slate-700/70 border-slate-600/50 hover:from-slate-700/95 hover:to-slate-600/80 hover:border-teal-500/60' 
              : 'bg-gradient-to-br from-white/95 via-white/90 to-slate-50/80 border-slate-300/50 hover:from-white hover:to-slate-100/90 hover:border-teal-400/60'
            }
            hover:shadow-2xl hover:shadow-teal-500/30 hover:scale-[1.03] transform-gpu
            before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br
            ${theme === 'dark' 
              ? 'before:from-teal-500/15 before:via-cyan-500/8 before:to-emerald-500/15' 
              : 'before:from-teal-400/12 before:via-cyan-400/6 before:to-emerald-400/12'
            }
            before:opacity-0 hover:before:opacity-100 before:transition-all before:duration-500
            animate-slide-in-left shadow-lg
          `}
          onClick={forceRefreshLocation}
          title="Click to refresh location"
        >
          {/* Enhanced Tooltip with More Info */}
          <div className={`
            absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 rounded-xl
            text-sm font-medium pointer-events-none z-50 min-w-[280px]
            opacity-0 group-hover:opacity-100 transition-all duration-300 delay-500
            ${theme === 'dark' 
              ? 'bg-slate-900/98 text-slate-100 border border-slate-700/60' 
              : 'bg-white/98 text-slate-800 border border-slate-200/60'
            }
            backdrop-blur-2xl shadow-2xl
            before:absolute before:top-full before:left-1/2 before:transform before:-translate-x-1/2
            before:border-8 before:border-transparent
            ${theme === 'dark' 
              ? 'before:border-t-slate-900/98' 
              : 'before:border-t-white/98'
            }
          `}>
            <div className="space-y-2">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-600/30">
                <FaMapMarkerAlt className="text-teal-500" />
                <span className="font-bold">Your Location</span>
              </div>
              
              <div className="text-sm">
                {isLocationLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>{locationRetryCount > 0 ? `Retrying (${locationRetryCount}/2)...` : 'Detecting with high accuracy GPS...'}</span>
                  </div>
                ) : (
                  <>
                    <div className="font-semibold text-teal-500">{currentLocation}</div>
                    <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      Click to refresh • High accuracy mode
                    </div>
                  </>
                )}
              </div>
              
              {locationError && (
                <div className="flex items-center gap-2 text-red-400 text-xs pt-2 border-t border-red-500/20">
                  <span>⚠️</span>
                  <span>{locationError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Location Icon with Better Visual Feedback */}
          <div className="relative flex-shrink-0">
            <div className={`
              w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 relative
              ${theme === 'dark' 
                ? 'bg-gradient-to-br from-teal-600/40 to-cyan-600/30 group-hover:from-teal-500/50 group-hover:to-cyan-500/40' 
                : 'bg-gradient-to-br from-teal-500/30 to-cyan-500/20 group-hover:from-teal-500/40 group-hover:to-cyan-500/30'
              }
              ${isLocationLoading ? 'animate-pulse' : ''}
              shadow-inner
            `}>
              <FaMapMarkerAlt className={`
                text-base transition-all duration-500
                ${isLocationLoading 
                  ? 'text-amber-500 animate-bounce' 
                  : locationError
                  ? 'text-red-500'
                  : 'text-teal-600 group-hover:text-teal-400'
                }
              `} />
              
              {/* Animated ring around icon */}
              <div className={`
                absolute inset-0 rounded-xl border-2 transition-all duration-500
                ${isLocationLoading 
                  ? 'border-amber-400/60 animate-ping' 
                  : 'border-teal-500/0 group-hover:border-teal-500/40'
                }
              `}></div>
            </div>
            
            {/* Enhanced Status Indicator */}
            {!isLocationLoading && !locationError && (
              <div className="absolute -top-1 -right-1 flex items-center justify-center">
                <div className="relative w-4 h-4">
                  <div className="absolute inset-0 bg-emerald-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Error Indicator */}
            {locationError && (
              <div className="absolute -top-1 -right-1 flex items-center justify-center">
                <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                  !
                </div>
              </div>
            )}
          </div>
          
          {/* Enhanced Location Text with Better Layout */}
          <div className="flex flex-col min-w-0 max-w-48 relative">
            {/* Main Location Text with Scrolling Animation */}
            <div className="relative overflow-hidden">
              <div className="location-scroll-container">
                <span className={`
                  text-sm font-bold leading-tight whitespace-nowrap inline-block
                  ${theme === 'dark' ? 'text-slate-50' : 'text-slate-900'}
                  group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors duration-500
                  ${isLocationLoading ? 'animate-pulse' : 'location-scroll-text'}
                `}>
                  {isLocationLoading 
                    ? (locationRetryCount > 0 ? `Retrying ${locationRetryCount}/2...` : 'Detecting location...') 
                    : currentLocation}
                </span>
              </div>
              
              {/* Gradient fade edges for smooth scroll effect */}
              <div className={`
                absolute left-0 top-0 bottom-0 w-4 pointer-events-none z-10
                bg-gradient-to-r ${theme === 'dark' 
                  ? 'from-slate-800 to-transparent' 
                  : 'from-white to-transparent'
                }
              `}></div>
              <div className={`
                absolute right-0 top-0 bottom-0 w-4 pointer-events-none z-10
                bg-gradient-to-l ${theme === 'dark' 
                  ? 'from-slate-800 to-transparent' 
                  : 'from-white to-transparent'
                }
              `}></div>
            </div>
            
            {/* Status Row with Enhanced Info */}
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <div className={`
                  w-1.5 h-1.5 rounded-full transition-all duration-500
                  ${isLocationLoading 
                    ? 'bg-amber-400 animate-pulse' 
                    : locationError
                    ? 'bg-red-400'
                    : 'bg-emerald-400 group-hover:bg-teal-400'
                  }
                `}></div>
                <span className={`
                  text-xs font-semibold uppercase tracking-wider
                  ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}
                  opacity-80 group-hover:opacity-100 group-hover:text-teal-500 transition-all duration-500
                `}>
                  {isLocationLoading ? 'Locating' : locationError ? 'Error' : 'Live GPS'}
                </span>
              </div>
            </div>
          </div>

          {/* Enhanced Action Indicator */}
          <div className="flex-shrink-0 ml-2">
            {!isLocationLoading ? (
              <div className={`
                w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-500
                ${theme === 'dark' 
                  ? 'bg-slate-700/60 group-hover:bg-teal-600/40' 
                  : 'bg-slate-200/60 group-hover:bg-teal-500/30'
                }
                opacity-70 group-hover:opacity-100 transform scale-90 group-hover:scale-100
                shadow-sm group-hover:shadow-md
              `}>
                <svg className="w-4 h-4 text-slate-400 group-hover:text-teal-500 transition-all duration-500 group-hover:rotate-180 transform-gpu" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              </div>
            ) : (
              <div className="w-7 h-7 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          
          {/* Enhanced border glow effect */}
          <div className={`
            absolute inset-0 rounded-2xl border-2 transition-all duration-500 pointer-events-none
            ${theme === 'dark' 
              ? 'border-teal-500/0 group-hover:border-teal-500/40' 
              : 'border-teal-400/0 group-hover:border-teal-400/50'
            }
          `}></div>
          
          {/* Enhanced background animation */}
          <div className={`
            absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700
            bg-gradient-to-br ${theme === 'dark' 
              ? 'from-teal-600/8 via-cyan-600/5 to-emerald-600/8' 
              : 'from-teal-500/8 via-cyan-500/5 to-emerald-500/8'
            }
          `}></div>
        </div>
      </div>

      {/* Ultra-Professional Desktop Navigation */}
      <DesktopNavigation 
        theme={theme}
        clerkAvailable={clerkAvailable}
        onCalendarOpen={handleCalendarOpen}
        onNavigation={handleNavigation}
        showCalendar={showCalendar}
        triggerRef={triggerRef}
        currentLocation={currentLocation}
        isLocationLoading={isLocationLoading}
        onLocationRefresh={forceRefreshLocation}
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
        locationRetryCount={locationRetryCount}
        locationError={locationError}
      />

      {/* Calendar Modals */}
      <CalendarModals 
        showCalendar={showCalendar}
        mobileAnimating={mobileAnimating}
        calendarRef={calendarRef}
        setShowCalendar={setShowCalendar}
        setMobileAnimating={setMobileAnimating}
      />

      {/* Location Debug Panel - Toggle with Ctrl+Shift+L */}
      {showLocationDebug && (
        <div className="fixed top-20 right-4 w-96 max-h-96 bg-black/90 text-green-400 text-xs font-mono p-4 rounded-lg border border-green-500/50 backdrop-blur-xl z-[9999] overflow-y-auto">
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-green-500/30">
            <span className="text-green-300 font-bold">🔍 Location Debug Panel</span>
            <button 
              onClick={() => setShowLocationDebug(false)}
              className="text-red-400 hover:text-red-300"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2">
            <div className="text-yellow-400">
              <strong>Current Status:</strong> {isLocationLoading ? 'Loading...' : 'Complete'}
            </div>
            <div className="text-cyan-400">
              <strong>Location:</strong> {currentLocation}
            </div>
            {locationError && (
              <div className="text-red-400">
                <strong>Error:</strong> {locationError}
              </div>
            )}
            <div className="text-purple-400">
              <strong>Retry Count:</strong> {locationRetryCount}
            </div>
            
            {/* Test Buttons */}
            <div className="border-t border-green-500/30 pt-2 mt-2">
              <div className="text-green-300 text-xs mb-1">Quick Tests:</div>
              <div className="flex gap-1 mb-2 flex-wrap">
                <button 
                  onClick={() => {
                    setLocationDebugInfo([]);
                    forceRefreshLocation();
                  }}
                  className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                  disabled={isLocationLoading}
                >
                  🔄 GPS
                </button>
                <button 
                  onClick={() => {
                    setLocationDebugInfo([]);
                    detectLocationByNetwork(selectedLanguage);
                  }}
                  className="px-2 py-1 bg-orange-600 text-white rounded text-xs hover:bg-orange-700"
                  disabled={isLocationLoading}
                >
                  🌐 Network
                </button>
                <button 
                  onClick={() => setLocationDebugInfo([])}
                  className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700"
                >
                  🗑️ Clear
                </button>
              </div>
              
              <div className="text-green-300 text-xs mb-1">Test Specific Areas:</div>
              <div className="flex gap-1 mb-1 flex-wrap">
                <button 
                  onClick={async () => {
                    setLocationDebugInfo([]);
                    // Use your exact GPS coordinates if available, or Mahalaxmi center
                    const lat = 27.6915; const lon = 85.3203;
                    addDebugLog(`FORCED Mahalaxmi Detection: ${lat}, ${lon}`);
                    const result = await reverseGeocodeWithMaxAccuracy(lat, lon, selectedLanguage, 5);
                    setCurrentLocation(`🎯 ${result}`);
                  }}
                  className="px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
                  disabled={isLocationLoading}
                >
                  🏠 Force Mahalaxmi
                </button>
                <button 
                  onClick={async () => {
                    setLocationDebugInfo([]);
                    // Test with slightly different Mahalaxmi coordinates
                    const lat = 27.6920; const lon = 85.3210;
                    addDebugLog(`Testing Mahalaxmi North: ${lat}, ${lon}`);
                    const result = await reverseGeocodeWithMaxAccuracy(lat, lon, selectedLanguage, 5);
                    setCurrentLocation(`🎯 ${result}`);
                  }}
                  className="px-2 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600"
                  disabled={isLocationLoading}
                >
                  🏠 Mahalaxmi N
                </button>
                <button 
                  onClick={async () => {
                    setLocationDebugInfo([]);
                    const lat = 27.7172; const lon = 85.3240;
                    addDebugLog(`Testing Thamel: ${lat}, ${lon}`);
                    const result = await reverseGeocodeWithMaxAccuracy(lat, lon, selectedLanguage, 5);
                    setCurrentLocation(`🎯 ${result}`);
                  }}
                  className="px-2 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700"
                  disabled={isLocationLoading}
                >
                  🏛️ Thamel
                </button>
                <button 
                  onClick={async () => {
                    setLocationDebugInfo([]);
                    const lat = 27.7021; const lon = 85.3077;
                    addDebugLog(`Testing Durbar Square: ${lat}, ${lon}`);
                    const result = await reverseGeocodeWithMaxAccuracy(lat, lon, selectedLanguage, 5);
                    setCurrentLocation(`🎯 ${result}`);
                  }}
                  className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                  disabled={isLocationLoading}
                >
                  🏰 Durbar Sq
                </button>
              </div>
              
              <div className="flex gap-1 mb-2 flex-wrap">
                <button 
                  onClick={async () => {
                    setLocationDebugInfo([]);
                    const lat = 27.6893; const lon = 85.3206;
                    addDebugLog(`Testing Kalimati: ${lat}, ${lon}`);
                    const result = await reverseGeocodeWithMaxAccuracy(lat, lon, selectedLanguage, 5);
                    setCurrentLocation(`🎯 ${result}`);
                  }}
                  className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                  disabled={isLocationLoading}
                >
                  🥬 Kalimati
                </button>
                <button 
                  onClick={async () => {
                    setLocationDebugInfo([]);
                    const lat = 27.6648; const lon = 85.3077;
                    addDebugLog(`Testing Patan: ${lat}, ${lon}`);
                    const result = await reverseGeocodeWithMaxAccuracy(lat, lon, selectedLanguage, 5);
                    setCurrentLocation(`🎯 ${result}`);
                  }}
                  className="px-2 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700"
                  disabled={isLocationLoading}
                >
                  🏛️ Patan
                </button>
                <button 
                  onClick={async () => {
                    setLocationDebugInfo([]);
                    const lat = 27.7103; const lon = 85.3222;
                    addDebugLog(`Testing New Baneshwor: ${lat}, ${lon}`);
                    const result = await reverseGeocodeWithMaxAccuracy(lat, lon, selectedLanguage, 5);
                    setCurrentLocation(`🎯 ${result}`);
                  }}
                  className="px-2 py-1 bg-pink-600 text-white rounded text-xs hover:bg-pink-700"
                  disabled={isLocationLoading}
                >
                  🏢 Baneshwor
                </button>
                <button 
                  onClick={async () => {
                    setLocationDebugInfo([]);
                    // Test your actual GPS coordinates
                    addDebugLog('Testing YOUR real GPS location...');
                    await forceRefreshLocation();
                  }}
                  className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                  disabled={isLocationLoading}
                >
                  📍 Your GPS
                </button>
              </div>
            </div>
            
            <div className="border-t border-green-500/30 pt-2 mt-2">
              <div className="text-green-300 font-bold mb-1">Debug Log:</div>
              <div className="max-h-32 overflow-y-auto">
                {locationDebugInfo.length === 0 ? (
                  <div className="text-gray-500 italic">No logs yet. Click a test button above.</div>
                ) : (
                  locationDebugInfo.map((log, index) => (
                    <div key={index} className="mb-1 text-xs">
                      <span className="text-gray-400">[{log.timestamp}]</span>{' '}
                      <span className="text-green-400">{log.message}</span>
                      {log.data && (
                        <pre className="text-yellow-300 ml-2 mt-1 text-[10px] overflow-x-auto max-h-20 overflow-y-auto">
                          {log.data}
                        </pre>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowSearchModal(false)}>
          <div className={`w-full max-w-2xl mx-4 rounded-2xl shadow-2xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Search Places
                </h3>
                <button
                  onClick={() => setShowSearchModal(false)}
                  className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  ✕
                </button>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      navigate(`/searchresult?query=${encodeURIComponent(searchQuery)}`);
                      setShowSearchModal(false);
                      setSearchQuery('');
                    }
                  }}
                  placeholder="Search for destinations, hotels, restaurants..."
                  className={`w-full px-4 py-3 pr-12 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    theme === 'dark' 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  autoFocus
                />
                <button
                  onClick={() => {
                    if (searchQuery.trim()) {
                      navigate(`/searchresult?query=${encodeURIComponent(searchQuery)}`);
                      setShowSearchModal(false);
                      setSearchQuery('');
                    }
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all"
                >
                  <FaSearch />
                </button>
              </div>
              
              <p className={`mt-3 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Press Enter or click the search icon to search
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Safely checks if Clerk is available to avoid runtime errors
 */
const useClerkSafely = () => {
  try {
    const user = useUser();
    return !!user;
  } catch (e) {
    return false;
  }
};

/**
 * Returns ultra-professional header CSS classes based on theme
 */
const getHeaderClasses = (theme) => {
  return `sticky top-0 z-50 w-full px-4 py-3 ${
    theme === "dark" 
      ? "bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-slate-950/95 backdrop-blur-2xl border-slate-700/40 shadow-2xl shadow-slate-900/50" 
      : "bg-gradient-to-r from-white/98 via-slate-50/95 to-white/98 backdrop-blur-2xl border-slate-200/40 shadow-2xl shadow-slate-200/30"
  } border-b flex justify-between items-center relative transition-all duration-300 will-change-transform transform-gpu min-h-[72px] max-h-[72px] before:absolute before:inset-0 before:bg-gradient-to-r ${
    theme === "dark"
      ? "before:from-teal-600/5 before:via-transparent before:to-cyan-600/5"
      : "before:from-teal-500/3 before:via-transparent before:to-cyan-500/3"
  } before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500`;
};

/**
 * Returns ultra-professional theme-based button classes
 */
const getThemeClasses = (theme) => {
  return theme === "dark" 
    ? "text-teal-100 hover:text-white hover:bg-gradient-to-r hover:from-teal-800/60 hover:to-cyan-800/60" 
    : "text-teal-700 hover:text-teal-900 hover:bg-gradient-to-r hover:from-teal-50/60 hover:to-cyan-50/60";
};

/**
 * Returns ultra-professional navigation button classes
 */
const getNavButtonClasses = (theme) => {
  return `px-4 py-2 rounded-xl font-medium transition-all duration-300 border backdrop-blur-xl transform-gpu will-change-transform relative overflow-hidden group ${
    theme === "dark" 
      ? "border-teal-700/40 hover:border-teal-600/70 hover:bg-gradient-to-r hover:from-teal-900/50 hover:to-cyan-900/50 hover:shadow-xl hover:shadow-teal-900/30 hover:scale-105" 
      : "border-teal-200/40 hover:border-teal-300/70 hover:bg-gradient-to-r hover:from-teal-50/50 hover:to-cyan-50/50 hover:shadow-xl hover:shadow-teal-200/30 hover:scale-105"
  } before:absolute before:inset-0 before:bg-gradient-to-r ${
    theme === "dark"
      ? "before:from-teal-600/10 before:to-cyan-600/10"
      : "before:from-teal-500/5 before:to-cyan-500/5"
  } before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300`;
};

// ==================== CUSTOM HOOKS ====================

/**
 * Handles click outside events for calendar
 */
const useClickOutsideHandler = ({ 
  showCalendar, 
  mobileAnimating, 
  setShowCalendar, 
  setMobileAnimating
}) => {
  useEffect(() => {
    function handleClickOutside(e) {
      // Handle calendar modal clicks
      if (showCalendar) {
        const modalContainer = e.target.closest('[role="dialog"]');
        const calendarButton = e.target.closest('button[aria-haspopup="dialog"]');
        
        // Don't close if clicking inside modal or on calendar button
        if (!modalContainer && !calendarButton) {
          console.log('Clicking outside calendar, closing...');
          if (mobileAnimating) {
            setMobileAnimating(false);
            setTimeout(() => setShowCalendar(false), 300);
          } else {
            setShowCalendar(false);
          }
        }
      }
    }
    
    // Add a small delay before attaching the click handler to prevent immediate closing
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 200);
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileAnimating, showCalendar, setShowCalendar, setMobileAnimating]);
};

/**
 * Handles keyboard navigation and escape key
 */
const useKeyboardHandler = ({ 
  showCalendar, 
  mobileAnimating, 
  setShowCalendar, 
  setMobileAnimating, 
  calendarRef 
}) => {
  useEffect(() => {
    function handleKey(e) {
      if (!showCalendar) return;
      
      if (e.key === 'Escape') {
        if (mobileAnimating) {
          setMobileAnimating(false);
          setTimeout(() => setShowCalendar(false), 300);
        } else {
          setShowCalendar(false);
        }
      }
      
      if (e.key === 'Tab' && calendarRef.current) {
        const focusable = calendarRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }
    
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [showCalendar, mobileAnimating, setShowCalendar, setMobileAnimating, calendarRef]);
};

/**
 * Manages focus when calendar modal opens/closes
 */
const useFocusManagement = ({ 
  showCalendar, 
  calendarRef, 
  previousActive, 
  setMobileAnimating 
}) => {
  useEffect(() => {
    if (showCalendar) {
      // Store the previously focused element
      previousActive.current = document.activeElement;
      
      // Focus the calendar after a short delay to ensure it's rendered
      const focusTimer = setTimeout(() => {
        if (calendarRef.current) {
          const focusable = calendarRef.current.querySelectorAll(
            'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );
          const firstFocusable = focusable.length ? focusable[0] : calendarRef.current;
          firstFocusable.focus();
        }
      }, 100);
      
      return () => clearTimeout(focusTimer);
    } else {
      // Restore focus to the previously focused element
      if (previousActive.current && typeof previousActive.current.focus === 'function') {
        try {
          previousActive.current.focus();
        } catch (e) {
          // Ignore focus errors
        }
      }
      previousActive.current = null;
    }
  }, [showCalendar, calendarRef, previousActive, setMobileAnimating]);
};

// ==================== SUB-COMPONENTS ====================

/**
 * Ultra-Professional Custom Language Dropdown Component
 */
const CustomLanguageDropdown = ({ selectedLanguage, onLanguageChange, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', flag: '🇺🇸', name: 'English', nativeName: 'English' },
    { code: 'ne', flag: '🇳🇵', name: 'Nepali', nativeName: 'नेपाली' },
    { code: 'hi', flag: '🇮🇳', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'zh', flag: '🇨🇳', name: 'Chinese', nativeName: '中文' },
    { code: 'ja', flag: '🇯🇵', name: 'Japanese', nativeName: '日本語' },
    { code: 'ko', flag: '🇰🇷', name: 'Korean', nativeName: '한국어' }
  ];

  const selectedLang = languages.find(lang => lang.code === selectedLanguage) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = (langCode) => {
    onLanguageChange(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 font-semibold text-sm transition-colors duration-300 min-w-[80px] ${
          theme === "dark" ? "text-slate-100 hover:text-white" : "text-slate-700 hover:text-slate-900"
        }`}
        title="Select Language"
      >
        <span>{selectedLang.flag}</span>
        <span>{selectedLang.code.toUpperCase()}</span>
        <svg 
          className={`w-3 h-3 text-slate-500 transition-all duration-300 ${
            isOpen ? 'rotate-180 text-teal-500' : 'text-slate-500 hover:text-teal-500'
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Professional Dropdown Menu */}
      {isOpen && (
        <div className={`absolute top-full right-0 mt-2 w-64 rounded-2xl backdrop-blur-2xl border shadow-2xl z-50 overflow-hidden ${
          theme === "dark"
            ? "bg-slate-900/95 border-slate-700/50 shadow-slate-900/50"
            : "bg-white/95 border-slate-200/50 shadow-slate-200/50"
        }`}>
          {/* Premium Header */}
          <div className={`px-4 py-3 border-b ${
            theme === "dark" 
              ? "bg-gradient-to-r from-slate-800/60 to-slate-700/60 border-slate-700/50" 
              : "bg-gradient-to-r from-slate-50/80 to-gray-50/80 border-slate-200/50"
          }`}>
            <div className="flex items-center space-x-2">
              <FaGlobe className="text-teal-500 text-sm" />
              <span className={`text-sm font-semibold ${
                theme === "dark" ? "text-slate-200" : "text-slate-700"
              }`}>
                Choose Language
              </span>
            </div>
          </div>

          {/* Language Options */}
          <div className="py-2 max-h-80 overflow-y-auto">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language.code)}
                className={`w-full px-4 py-3 text-left transition-all duration-200 flex items-center space-x-3 group ${
                  selectedLanguage === language.code
                    ? theme === "dark"
                      ? "bg-gradient-to-r from-teal-900/50 to-cyan-900/50 text-white border-l-4 border-teal-400"
                      : "bg-gradient-to-r from-teal-50/80 to-cyan-50/80 text-teal-900 border-l-4 border-teal-500"
                    : theme === "dark"
                      ? "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                      : "text-slate-700 hover:bg-slate-50/80 hover:text-slate-900"
                }`}
              >
                {/* Flag */}
                <span className="text-xl">{language.flag}</span>
                
                {/* Language Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{language.name}</span>
                    <span className="text-xs font-medium opacity-75">{language.code.toUpperCase()}</span>
                  </div>
                  <div className={`text-xs mt-0.5 ${
                    selectedLanguage === language.code
                      ? theme === "dark" ? "text-teal-200" : "text-teal-700"
                      : theme === "dark" ? "text-slate-400" : "text-slate-500"
                  }`}>
                    {language.nativeName}
                  </div>
                </div>

                {/* Selection Indicator */}
                {selectedLanguage === language.code && (
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-500 text-white">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Premium Footer */}
          <div className={`px-4 py-2 border-t text-center ${
            theme === "dark" 
              ? "bg-slate-800/40 border-slate-700/50" 
              : "bg-slate-50/60 border-slate-200/50"
          }`}>
            <span className={`text-xs ${
              theme === "dark" ? "text-slate-400" : "text-slate-500"
            }`}>
              More languages coming soon
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Ultra-professional logo component with enhanced animations
 */
const Logo = ({ onClick, theme }) => (
  <div className="flex items-center cursor-pointer group transform-gpu will-change-transform" onClick={onClick}>
    <div className="relative mr-5">
      <div className={`absolute -inset-3 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 ${
        theme === "dark" 
          ? "bg-gradient-to-r from-teal-600/30 via-cyan-600/20 to-emerald-600/30" 
          : "bg-gradient-to-r from-teal-500/20 via-cyan-500/15 to-emerald-500/20"
      } blur-2xl animate-pulse`} />
      <span className="relative text-5xl font-bold transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 filter drop-shadow-2xl min-w-[56px] flex items-center justify-center">
        🌄
      </span>
    </div>
    
    <div className="hidden md:flex flex-col min-w-0">
      <div className="flex items-baseline">
        <span className={`text-3xl font-black tracking-tight bg-gradient-to-r ${
          theme === "dark" 
            ? "from-teal-300 via-emerald-300 to-cyan-300" 
            : "from-teal-600 via-emerald-600 to-cyan-600"
        } text-transparent bg-clip-text font-sans whitespace-nowrap group-hover:bg-gradient-to-r ${
          theme === "dark"
            ? "group-hover:from-teal-200 group-hover:via-emerald-200 group-hover:to-cyan-200"
            : "group-hover:from-teal-700 group-hover:via-emerald-700 group-hover:to-cyan-700"
        } transition-all duration-500`}>
          Roamio
        </span>
        <span className={`text-xl font-light ml-3 tracking-wider ${
          theme === "dark" ? "text-slate-300 group-hover:text-slate-100" : "text-slate-500 group-hover:text-slate-700"
        } transition-all duration-500 whitespace-nowrap`}>
          Wanderly
        </span>
      </div>
      <div className={`h-1 w-0 group-hover:w-full transition-all duration-700 ${
        theme === "dark" 
          ? "bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400" 
          : "bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600"
      } rounded-full shadow-lg`} />
    </div>
  </div>
);

/**
 * Desktop navigation component - Ultra Professional
 */
const DesktopNavigation = ({ 
  theme, 
  clerkAvailable, 
  onCalendarOpen, 
  onNavigation, 
  showCalendar, 
  triggerRef,
  currentLocation,
  isLocationLoading,
  onLocationRefresh,
  selectedLanguage,
  onLanguageChange,
  locationRetryCount = 0,
  locationError = null
}) => (
  <div className="hidden md:flex items-center gap-4 relative z-10">
    {/* Navigation Items with Enhanced Styling */}
    <div className={`
      flex items-center gap-3 px-4 py-2 rounded-2xl border backdrop-blur-xl
      ${theme === 'dark' 
        ? 'bg-slate-800/40 border-slate-700/40 hover:bg-slate-700/50' 
        : 'bg-white/40 border-slate-200/40 hover:bg-white/60'
      }
      transition-all duration-300 hover:shadow-lg hover:scale-[1.02] transform-gpu
    `}>
      <NavigationItems 
        theme={theme}
        onCalendarOpen={onCalendarOpen}
        onNavigation={onNavigation}
        showCalendar={showCalendar}
        triggerRef={triggerRef}
        selectedLanguage={selectedLanguage}
        onLanguageChange={onLanguageChange}
      />
    </div>
    
    {/* Authentication Section */}
    <div className={`
      flex items-center gap-3 px-4 py-2 rounded-2xl border backdrop-blur-xl
      ${theme === 'dark' 
        ? 'bg-slate-800/40 border-slate-700/40' 
        : 'bg-white/40 border-slate-200/40'
      }
      transition-all duration-300 hover:shadow-lg hover:scale-[1.02] transform-gpu
    `}>
      <AuthenticationButtons clerkAvailable={clerkAvailable} onNavigation={onNavigation} theme={theme} />
    </div>
  </div>
);

/**
 * Navigation items component - Ultra Professional Styling
 */
const NavigationItems = ({ 
  theme, 
  onCalendarOpen, 
  onNavigation, 
  showCalendar, 
  triggerRef,
  selectedLanguage,
  onLanguageChange
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center gap-3">
      {/* Enhanced Language Selector */}
      <div className="relative">
        <CustomLanguageDropdown 
          selectedLanguage={selectedLanguage}
          onLanguageChange={onLanguageChange}
          theme={theme}
        />
      </div>
      
      {/* Elegant Separator */}
      <div className={`
        w-px h-6 
        ${theme === 'dark' ? 'bg-slate-600/50' : 'bg-slate-300/50'}
        relative
      `}>
        <div className={`
          absolute inset-0 w-px
          ${theme === 'dark' 
            ? 'bg-gradient-to-b from-transparent via-teal-400/30 to-transparent' 
            : 'bg-gradient-to-b from-transparent via-teal-500/30 to-transparent'
          }
        `}></div>
      </div>
      
      {/* Enhanced Features Button */}
      <div className="relative">
        <FeaturesBox theme={theme} onNavigation={onNavigation} />
      </div>
      
      {/* Enhanced Calendar Button */}
      <button
        type="button"
        ref={triggerRef}
        onClick={onCalendarOpen}
        className={`
          group relative px-4 py-2.5 rounded-xl font-medium transition-all duration-300 
          border backdrop-blur-xl transform-gpu will-change-transform overflow-hidden
          ${theme === 'dark' 
            ? 'border-teal-700/40 hover:border-teal-600/70 text-teal-100 hover:text-white hover:bg-gradient-to-r hover:from-teal-900/50 hover:to-cyan-900/50' 
            : 'border-teal-200/40 hover:border-teal-300/70 text-teal-700 hover:text-teal-900 hover:bg-gradient-to-r hover:from-teal-50/50 hover:to-cyan-50/50'
          }
          hover:shadow-xl hover:scale-105 btn-professional
          ${showCalendar ? 'ring-2 ring-teal-500/50 bg-teal-500/10' : ''}
        `}
        aria-expanded={showCalendar}
        aria-haspopup="dialog"
        aria-label="Open Nepali Calendar"
        title="Nepali Calendar"
      >
        <span className="flex items-center gap-2.5 relative z-10">
          <div className={`
            p-1.5 rounded-lg transition-all duration-300
            ${theme === 'dark' 
              ? 'bg-teal-800/30 group-hover:bg-teal-700/50' 
              : 'bg-teal-100/50 group-hover:bg-teal-200/70'
            }
          `}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="font-semibold">{t('header.calendar')}</span>
        </span>
        
        {/* Hover effect overlay */}
        <div className={`
          absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
          bg-gradient-to-r ${theme === 'dark' 
            ? 'from-teal-600/10 to-cyan-600/10' 
            : 'from-teal-500/5 to-cyan-500/5'
          }
        `}></div>
      </button>
      
      {/* Enhanced About Button */}
      <button
        type="button"
        onClick={() => onNavigation("/about")}
        className={`
          group relative px-4 py-2.5 rounded-xl font-medium transition-all duration-300 
          border backdrop-blur-xl transform-gpu will-change-transform overflow-hidden
          ${theme === 'dark' 
            ? 'border-slate-700/40 hover:border-slate-600/70 text-slate-200 hover:text-white hover:bg-gradient-to-r hover:from-slate-800/50 hover:to-slate-700/50' 
            : 'border-slate-200/40 hover:border-slate-300/70 text-slate-700 hover:text-slate-900 hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-slate-100/50'
          }
          hover:shadow-xl hover:scale-105 btn-professional
        `}
        title="About Us"
      >
        <span className="flex items-center gap-2.5 relative z-10">
          <div className={`
            p-1.5 rounded-lg transition-all duration-300
            ${theme === 'dark' 
              ? 'bg-slate-700/30 group-hover:bg-slate-600/50' 
              : 'bg-slate-100/50 group-hover:bg-slate-200/70'
            }
          `}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="font-semibold">{t('header.about')}</span>
        </span>
        
        {/* Hover effect overlay */}
        <div className={`
          absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
          bg-gradient-to-r ${theme === 'dark' 
            ? 'from-slate-600/10 to-slate-500/10' 
            : 'from-slate-400/5 to-slate-300/5'
          }
        `}></div>
      </button>
    </div>
  );
};

/**
 * Mobile navigation items component - Extended content
 */
const MobileNavigationItems = ({ 
  theme, 
  onCalendarOpen, 
  onNavigation, 
  onClose 
}) => {
  const { t } = useTranslation();
  
  const mainMenuItems = [
    {
      icon: FaSearch,
      label: "Search",
      action: () => setShowSearchModal(true),
      description: "Find destinations",
      color: "bg-emerald-500"
    },
    {
      icon: FaCompass,
      label: "Explore Nepal",
      path: "/explore-nepal",
      description: "Discover amazing places",
      color: "bg-purple-500"
    },
    {
      icon: FaCamera,
      label: "Gallery",
      path: "/gallery",
      description: "View photos & videos",
      color: "bg-pink-500"
    }
  ];

  const servicesItems = [
    {
      icon: FaMapMarkerAlt,
      label: "Trip Planner",
      path: "/trip-planner",
      description: "Plan your journey",
      color: "bg-indigo-500"
    },
    {
      icon: FaBookOpen,
      label: "Itinerary",
      path: "/guide",
      description: "Plan your journey",
      color: "bg-amber-500"
    },
    {
      icon: FaGlobe,
      label: "Weather",
      path: "/weather",
      description: "Current conditions",
      color: "bg-cyan-500"
    },
    {
      icon: FaPlusCircle,
      label: "Add Place",
      path: "/add-place",
      description: "Share your discovery",
      color: "bg-green-500"
    }
  ];

  const supportItems = [
    {
      icon: FaInfoCircle,
      label: "About Us",
      path: "/about",
      description: "Learn about our mission",
      color: "bg-orange-500"
    },
    {
      icon: FaPhone,
      label: "Contact",
      path: "/contact",
      description: "Get in touch",
      color: "bg-violet-500"
    },
    {
      icon: FaQuestionCircle,
      label: "Help & FAQ",
      path: "/help",
      description: "Find answers",
      color: "bg-red-500"
    },
    {
      icon: FaCog,
      label: "Settings",
      path: "/settings",
      description: "Manage preferences",
      color: "bg-gray-500"
    }
  ];
  
  const renderMenuSection = (items, title) => (
    <div className="mb-4">
      <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-1">
        {title}
      </h4>
      <div className="space-y-1">
        {items.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.path || item.label}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else if (item.path) {
                  onNavigation(item.path);
                }
                onClose();
              }}
              className={`
                w-full p-3 text-left rounded-xl transition-all duration-200 
                ${theme === "dark" 
                  ? "hover:bg-slate-800/50 text-slate-300 hover:text-white" 
                  : "hover:bg-slate-100/70 text-slate-600 hover:text-slate-900"
                } 
                flex items-center space-x-3 group hover:scale-[1.01]
              `}
            >
              {/* Minimal Icon */}
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-lg ${item.color}/20
                group-hover:scale-105 transition-transform duration-200
              `}>
                <IconComponent className={`w-4 h-4 ${item.color.replace('bg-', 'text-')}`} />
              </div>
              
              {/* Clean Text */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">
                  {item.label}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-1">
      {/* Main Navigation */}
      {renderMenuSection(mainMenuItems, "Navigation")}
      
      {/* Services Section */}
      {renderMenuSection(servicesItems, "Services")}
      
      {/* Quick Actions */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-1">
          Quick Actions
        </h4>
        <div className="space-y-1">
          {/* Calendar Button */}
          <button
            onClick={() => {
              onCalendarOpen();
              onClose();
            }}
            className={`
              w-full p-3 text-left rounded-xl transition-all duration-200 
              ${theme === "dark" 
                ? "hover:bg-slate-800/50 text-slate-300 hover:text-white" 
                : "hover:bg-slate-100/70 text-slate-600 hover:text-slate-900"
              } 
              flex items-center space-x-3 group hover:scale-[1.01]
            `}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-500/20 group-hover:scale-105 transition-transform duration-200">
              <svg className="w-4 h-4 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">Nepali Calendar</div>
            </div>
          </button>


        </div>
      </div>
      
      {/* Support Section */}
      {renderMenuSection(supportItems, "Support")}
    </div>
  );
};

/**
 * Authentication buttons - Ultra Professional Design
 */
const AuthenticationButtons = ({ clerkAvailable, onNavigation, theme }) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center gap-3">
      <SignedOut>
        {/* Enhanced Sign Up Button */}
        <button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Sign Up button clicked!');
            onNavigation('/sign-up');
          }}
          className={`
            group relative px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 
            transform-gpu will-change-transform overflow-hidden btn-professional
            bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 
            hover:from-teal-700 hover:via-emerald-700 hover:to-cyan-700
            text-white shadow-lg hover:shadow-xl hover:scale-105
            border border-teal-500/30 backdrop-blur-sm
            cursor-pointer z-10
          `}
        >
          <span className="relative z-10 flex items-center gap-2.5 pointer-events-none">
            <div className="p-1 rounded-md bg-white/20 group-hover:bg-white/30 transition-colors duration-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
            </div>
            <span className="font-bold">{t('header.signUp')}</span>
          </span>
          
          {/* Enhanced shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500 -z-10 pointer-events-none"></div>
        </button>
      </SignedOut>
      
      <SignedIn>
        {/* Enhanced User Button Container - Fixed for Dropdown */}
        <div className={`
          flex items-center p-2 rounded-xl border backdrop-blur-xl transition-all duration-300
          hover:shadow-lg hover:scale-105 transform-gpu
          ${theme === 'dark' 
            ? 'border-teal-700/50 bg-teal-900/30 hover:bg-teal-800/40' 
            : 'border-teal-200/50 bg-teal-50/30 hover:bg-teal-100/40'
          }
          relative
        `}
        style={{ zIndex: 9999 }}
        >
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 rounded-lg",
                userButtonPopoverCard: "shadow-2xl border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl !fixed !top-16 !right-4 z-[9999]",
                userButtonPopoverActionButton: "hover:bg-teal-50 dark:hover:bg-teal-900/50 cursor-pointer",
                userButtonPopoverActionButtonText: "text-slate-700 dark:text-slate-200",
                userButtonPopoverActionButtonIcon: "text-slate-600 dark:text-slate-300",
                userButtonPopoverFooter: "hidden"
              },
              layout: {
                shimmer: true
              }
            }}
            userProfileMode="modal"
            userProfileProps={{
              appearance: {
                elements: {
                  rootBox: "z-[9999]",
                  card: "shadow-2xl"
                }
              }
            }}
          />
        </div>
      </SignedIn>
    </div>
  );
};

/**
 * Calendar modals component (mobile-style slide-up for both desktop and mobile)
 */
const CalendarModals = ({ 
  showCalendar, 
  mobileAnimating, 
  calendarRef, 
  setShowCalendar,
  setMobileAnimating
}) => {
  console.log('CalendarModals render:', { showCalendar, mobileAnimating });
  
  // Additional state for new features
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedView, setSelectedView] = useState('calendar'); // 'calendar', 'today', 'events', 'schedule', 'analytics'
  const [quickDate, setQuickDate] = useState('');
  const [selectedTimeZone, setSelectedTimeZone] = useState('Asia/Kathmandu');
  const [jumpError, setJumpError] = useState('');
  const [isJumping, setIsJumping] = useState(false);
  const [jumpToDate, setJumpToDate] = useState(null);
  const [workingHours, setWorkingHours] = useState({ start: '09:00', end: '17:00' });
  const [meetings, setMeetings] = useState([
    { id: 1, title: 'Team Standup', time: '09:30', duration: '30min', type: 'meeting' },
    { id: 2, title: 'Client Review', time: '14:00', duration: '1hr', type: 'client' },
    { id: 3, title: 'Project Deadline', time: '18:00', duration: 'All Day', type: 'deadline' }
  ]);
  
  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  if (!showCalendar) {
    console.log('Calendar not showing - showCalendar is false');
    return null;
  }
  
  console.log('Calendar should be visible now!');
  
  const handleClose = () => {
    console.log('Calendar close requested');
    setMobileAnimating(false);
    setTimeout(() => {
      console.log('Calendar closing after animation');
      setShowCalendar(false);
    }, 350);
  };
  
  const handleViewChange = (view) => {
    setSelectedView(view);
  };
  
  const validateDateInput = (dateString) => {
    if (!dateString || dateString.trim() === '') {
      return { isValid: false, errorMessage: 'Please enter a date' };
    }

    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return { isValid: false, errorMessage: 'Invalid date format' };
      }

      // Check if date is within reasonable bounds (1900-2100)
      const year = date.getFullYear();
      if (year < 1900 || year > 2100) {
        return { isValid: false, errorMessage: 'Date must be between 1900 and 2100' };
      }

      return { isValid: true, parsedDate: date };
    } catch (error) {
      return { isValid: false, errorMessage: 'Invalid date format' };
    }
  };

  const handleQuickDateJump = () => {
    if (!quickDate) {
      setJumpError('Please enter a date');
      return;
    }

    const validation = validateDateInput(quickDate);
    
    if (!validation.isValid) {
      setJumpError(validation.errorMessage);
      return;
    }

    // Clear any previous errors
    setJumpError('');
    setIsJumping(true);

    // Set the date to jump to
    setJumpToDate(validation.parsedDate);
    
    console.log('Jumping to date:', validation.parsedDate);
  };

  const handleJumpComplete = () => {
    setIsJumping(false);
    setJumpToDate(null);
    console.log('Jump completed successfully');
  };

  const handleJumpError = (error) => {
    setIsJumping(false);
    setJumpToDate(null);
    setJumpError(error || 'Failed to navigate to date');
    console.error('Jump failed:', error);
  };

  // Clear error when user starts typing
  const handleQuickDateChange = (e) => {
    setQuickDate(e.target.value);
    if (jumpError) {
      setJumpError('');
    }
  };
  
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const modalContent = (
    <div 
      className="fixed inset-0 flex items-center justify-center backdrop-blur-2xl bg-black/10" 
      style={{ 
        zIndex: 99999,
        backgroundImage: `
          radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(255,255,255,0.06) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(255,255,255,0.04) 0%, transparent 50%)
        `
      }}
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="nepali-calendar-title"
    >
      {/* Ultra-premium backdrop with sophisticated layering */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" 
        onClick={handleClose}
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(0,0,0,0.1) 0%, transparent 50%, rgba(0,0,0,0.1) 100%),
            radial-gradient(ellipse at top left, rgba(255,255,255,0.1) 0%, transparent 70%),
            radial-gradient(ellipse at bottom right, rgba(255,255,255,0.05) 0%, transparent 70%)
          `
        }}
      />
      
      <div 
        ref={calendarRef}
        className={`relative w-full max-w-2xl mx-6 transform transition-all duration-700 ease-out ${
          mobileAnimating 
            ? 'translate-y-0 opacity-100 scale-100 rotate-0 blur-0' 
            : 'translate-y-16 opacity-0 scale-90 rotate-2 blur-sm'
        }`}
        style={{ 
          zIndex: 100000,
          marginTop: '-1vh',
          filter: mobileAnimating 
            ? 'drop-shadow(0 40px 80px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 0 rgba(255, 255, 255, 0.1))'
            : 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.2))'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Luxury container with premium glass morphism */}
        <div className="relative bg-white/98 backdrop-blur-3xl rounded-[2rem] border-2 border-white/30 overflow-hidden shadow-2xl ring-1 ring-black/5">
          
          {/* Premium outer glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded-[2rem] blur-xl opacity-50 -z-10"></div>
          
          {/* Ultra-sophisticated Header */}
          <div className="relative bg-gradient-to-r from-slate-50/95 via-white/98 to-slate-50/95 backdrop-blur-2xl border-b border-white/40">
            {/* Premium top accent with gradient */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-slate-400/60 to-transparent"></div>
            
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-transparent pointer-events-none"></div>
            
            <div className="relative px-6 py-3 border-b border-slate-200/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Ultra-compact icon container */}
                  <div className="relative group">
                    <div className="w-8 h-8 bg-gradient-to-br from-slate-600 via-slate-700 to-slate-900 rounded-xl flex items-center justify-center shadow-lg ring-1 ring-slate-900/20 transform transition-transform duration-300 group-hover:scale-105">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="space-y-0.5">
                    <h2 className="text-sm font-bold text-slate-900 tracking-tight leading-none font-serif">
                      Nepali Calendar
                    </h2>
                    <p className="text-xs font-medium text-slate-600 leading-none">
                      Professional System
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Ultra-compact status indicators */}
                  <div className="flex items-center space-x-1.5">
                    <div className="flex items-center space-x-1 px-2 py-0.5 bg-slate-100/60 rounded">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-slate-500">Live</span>
                    </div>
                    {/* Ultra-compact real-time clock */}
                    <div className="flex items-center space-x-1 px-2 py-0.5 bg-slate-100/60 rounded">
                      <svg className="w-2.5 h-2.5 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-mono text-slate-600">{formatTime(currentTime)}</span>
                    </div>
                  </div>
                  
                  {/* Ultra-compact close button */}
                  <button
                    onClick={handleClose}
                    className="group relative w-7 h-7 rounded-lg bg-slate-100/90 hover:bg-slate-200/90 border border-slate-200/60 hover:border-slate-300/60 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm hover:shadow-md"
                    aria-label="Close calendar"
                  >
                    <svg className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-800 transition-all duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Ultra-Compact Feature Toolbar - Separate Container */}
            <div className="px-6 py-2 bg-gradient-to-r from-slate-50/80 via-white/90 to-slate-50/80 border-b border-slate-200/30">
              <div className="flex items-center justify-between text-xs">
                {/* Ultra-compact View Toggle Buttons */}
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-medium text-slate-600 mr-1">View:</span>
                  {[
                    { id: 'calendar', label: 'Cal', icon: '📅' }
                  ].map((view) => (
                    <button
                      key={view.id}
                      onClick={() => handleViewChange(view.id)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                        selectedView === view.id
                          ? 'bg-slate-200/80 text-slate-800 shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100/60 hover:text-slate-800'
                      }`}
                    >
                      <span className="mr-1">{view.icon}</span>
                      {view.label}
                    </button>
                  ))}
                </div>
                
                {/* Ultra-compact Quick Date Jump */}
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-medium text-slate-600">Jump:</span>
                  <div className="relative">
                    <input
                      type="date"
                      value={quickDate}
                      onChange={handleQuickDateChange}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleQuickDateJump();
                        }
                      }}
                      className={`px-2 py-0.5 text-xs border rounded bg-white/80 focus:outline-none focus:ring-1 w-24 ${
                        jumpError 
                          ? 'border-red-300 focus:ring-red-300/50' 
                          : 'border-slate-200 focus:ring-slate-300/50'
                      }`}
                      aria-label="Select date to jump to"
                      aria-describedby={jumpError ? "jump-error" : undefined}
                    />
                    {jumpError && (
                      <div 
                        id="jump-error"
                        className="absolute top-full left-0 mt-1 px-2 py-1 bg-red-100 border border-red-300 rounded text-xs text-red-700 whitespace-nowrap z-10 shadow-lg"
                        role="alert"
                      >
                        {jumpError}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleQuickDateJump}
                    disabled={isJumping}
                    className={`px-2 py-0.5 text-white text-xs font-medium rounded transition-colors duration-200 ${
                      isJumping 
                        ? 'bg-slate-400 cursor-not-allowed' 
                        : 'bg-slate-600 hover:bg-slate-700'
                    }`}
                    aria-label="Jump to selected date"
                  >
                    {isJumping ? '...' : 'Go'}
                  </button>
                </div>
                
                {/* Ultra-compact Professional Tools */}
                <div className="flex items-center space-x-1">
                  <select 
                    value={selectedTimeZone}
                    onChange={(e) => setSelectedTimeZone(e.target.value)}
                    className="px-2 py-0.5 text-xs border border-slate-200 rounded bg-white/80 focus:outline-none focus:ring-1 focus:ring-slate-300/50"
                  >
                    <option value="Asia/Kathmandu">NPT</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">EST</option>
                    <option value="Europe/London">GMT</option>
                    <option value="Asia/Tokyo">JST</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Calendar Content with ultra-compact padding */}
          <div className="relative p-3 bg-gradient-to-b from-white/50 via-transparent to-white/30">
            {/* Premium inner shadows for ultra-depth */}
            <div className="absolute inset-0 rounded-b-[2rem] shadow-inner pointer-events-none opacity-30"></div>
            <div className="absolute inset-4 rounded-3xl shadow-inner pointer-events-none opacity-20"></div>
            
            {/* Content wrapper with ultra-compact enhancement */}
            <div className="relative bg-white/20 rounded-xl p-2 backdrop-blur-sm">
              {selectedView === 'calendar' && (
                <NepaliCalendar 
                  full 
                  mobile={false} 
                  onClose={handleClose}
                  jumpToDate={jumpToDate}
                  onJumpComplete={handleJumpComplete}
                  onJumpError={handleJumpError}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Render the modal using a portal to ensure it's at the top level
  return createPortal(modalContent, document.body);
};

/**
 * MenuBar Component - Professional Navigation Menu with Dropdown
 */
const MenuBar = ({ theme, onNavigation, forceRefreshLocation, selectedLanguage, handleLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { t } = useTranslation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (item) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      onNavigation(item.path);
    }
    setIsOpen(false);
  };

  // Navigation menu items - Comprehensive Core Functions
  const menuItems = [
    {
      category: "Explore",
      icon: FaCompass,
      color: "teal",
      items: [
        { name: "Home", path: "/", icon: "🏠", description: "Back to home" },
        { name: "Explore Nepal", path: "/explore-nepal", icon: "🗺️", description: "Discover Nepal" },
        { name: "All Places", path: "/all-places-detail", icon: "📍", description: "View all places" },
        { name: "Famous Spots", path: "/all-famous-spots", icon: "⭐", description: "Popular locations" },
        { name: "Nature Places", path: "/all-nature-places", icon: "🌲", description: "Natural beauty" }
      ]
    },
    {
      category: "Plan",
      icon: FaBookOpen,
      color: "purple",
      items: [
        { name: "Recommendations", path: "/recommendation", icon: "💡", description: "Get suggestions" },
        { name: "Itinerary", path: "/guide", icon: "📋", description: "Plan your trip" },
        { name: "Wishlist", path: "/wishlist", icon: "❤️", description: "Saved places" }
      ]
    },
    {
      category: "Support",
      icon: FaQuestionCircle,
      color: "cyan",
      items: [
        { name: "About", path: "/about", icon: "ℹ️", description: "About us" },
        { name: "Contact", path: "/contact", icon: "📧", description: "Get in touch" },
        { name: "Help", path: "/help", icon: "❓", description: "Need help" },
        { name: "FAQ", path: "/faq", icon: "💭", description: "Common questions" }
      ]
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Menu Button - Professional Design */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center w-11 h-11 rounded-xl font-semibold text-sm transition-all duration-300 border backdrop-blur-xl transform-gpu will-change-transform relative overflow-hidden group ${
          theme === "dark" 
            ? "border-slate-700/40 hover:border-teal-600/60 hover:bg-gradient-to-br hover:from-slate-800/60 hover:to-slate-700/60 hover:shadow-xl hover:shadow-teal-900/20 hover:scale-105 text-slate-200 hover:text-white" 
            : "border-slate-200/40 hover:border-teal-500/60 hover:bg-gradient-to-br hover:from-white/60 hover:to-slate-50/60 hover:shadow-xl hover:shadow-teal-500/20 hover:scale-105 text-slate-700 hover:text-slate-900"
        } ${isOpen ? 'border-teal-500/60 bg-teal-500/10' : ''}`}
        title="Navigation Menu"
      >
        <FaBars className={`text-lg transition-all duration-300 ${isOpen ? 'text-teal-500 rotate-90' : ''}`} />
        
        {/* Active indicator */}
        {isOpen && (
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-xl"></div>
        )}
      </button>

      {/* Professional Dropdown Menu - Fixed to Left Corner */}
      {isOpen && (
        <div 
          className={`fixed left-4 top-32 w-80 rounded-2xl backdrop-blur-2xl border shadow-2xl z-[60] overflow-hidden ${
            theme === "dark" 
              ? "bg-slate-900/98 border-slate-700/50 shadow-slate-900/60" 
              : "bg-white/98 border-slate-200/50 shadow-slate-900/20"
          }`}
          style={{ maxHeight: "calc(100vh - 140px)" }}
        >
          
          {/* Header Section */}
          <div className={`px-5 py-4 border-b ${
            theme === "dark" 
              ? "bg-gradient-to-br from-slate-800/60 to-slate-800/40 border-slate-700/50" 
              : "bg-gradient-to-br from-slate-50/80 to-white/80 border-slate-200/50"
          }`}>
            <div className="flex items-center gap-3 mb-1">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-teal-600/30 to-cyan-600/20' 
                  : 'bg-gradient-to-br from-teal-500/20 to-cyan-500/15'
              }`}>
                <FaBars className="text-lg text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <h3 className={`text-base font-bold ${
                  theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                }`}>
                  Navigation
                </h3>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Quick access to all features
                </p>
              </div>
            </div>
          </div>

          {/* Scrollable Content Container */}
          <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 dark:scrollbar-thumb-slate-400 scrollbar-track-transparent" style={{ maxHeight: "calc(100vh - 240px)" }}>
            
            {/* Location & Language Section */}
            <div className={`px-5 py-4 border-b ${
              theme === "dark" ? "border-slate-700/50 bg-slate-800/20" : "border-slate-200/50 bg-slate-50/30"
            }`}>
            
            {/* Location Card */}
            <div 
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl border mb-3
                cursor-pointer transition-all duration-300 group
                ${theme === 'dark' 
                  ? 'bg-gradient-to-br from-slate-800/60 to-slate-800/40 border-slate-700/50 hover:border-teal-600/50 hover:shadow-lg hover:shadow-teal-900/20' 
                  : 'bg-gradient-to-br from-white/80 to-slate-50/60 border-slate-200/50 hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-500/20'
                }
                hover:scale-[1.02] transform-gpu
              `}
              onClick={() => {
                if (typeof forceRefreshLocation === 'function') {
                  forceRefreshLocation();
                }
              }}
              title="Click to refresh location"
            >
              {/* Icon */}
              <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner
                ${theme === 'dark' 
                  ? 'bg-gradient-to-br from-teal-600/30 to-cyan-600/20' 
                  : 'bg-gradient-to-br from-teal-500/20 to-cyan-500/15'
                }
              `}>
                <FaMapMarkerAlt className="text-base text-teal-600 dark:text-teal-400" />
              </div>
              
              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-bold mb-0.5 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Your Location
                </div>
                <div className={`text-xs truncate font-medium ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Kathmandu, Nepal
                </div>
              </div>

              {/* Refresh Icon */}
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  theme === 'dark' ? 'bg-slate-700/50' : 'bg-slate-100/50'
                }`}>
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-teal-500 transition-all duration-300 group-hover:rotate-180 transform-gpu" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Language Card */}
            <div className={`
              rounded-xl border overflow-hidden
              ${theme === 'dark' 
                ? 'bg-gradient-to-br from-slate-800/60 to-slate-800/40 border-slate-700/50' 
                : 'bg-gradient-to-br from-white/80 to-slate-50/60 border-slate-200/50'
              }
            `}>
              {/* Header */}
              <div className={`flex items-center gap-3 px-4 py-3 border-b ${
                theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200/50'
              }`}>
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner
                  ${theme === 'dark' 
                    ? 'bg-gradient-to-br from-cyan-600/30 to-blue-600/20' 
                    : 'bg-gradient-to-br from-cyan-500/20 to-blue-500/15'
                  }
                `}>
                  <FaGlobe className="text-base text-cyan-600 dark:text-cyan-400" />
                </div>
                <div className="flex-1">
                  <div className={`text-xs font-bold ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Language
                  </div>
                  <div className={`text-[10px] font-medium ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Choose your preference
                  </div>
                </div>
              </div>
              
              {/* Language Grid */}
              <div className="p-3 grid grid-cols-2 gap-2">
                {[
                  { code: 'en', flag: '🇬🇧', name: 'English' },
                  { code: 'ne', flag: '🇳🇵', name: 'नेपाली' },
                  { code: 'hi', flag: '🇮🇳', name: 'हिन्दी' },
                  { code: 'zh', flag: '🇨🇳', name: '中文' },
                  { code: 'ja', flag: '🇯🇵', name: '日本語' },
                  { code: 'ko', flag: '🇰🇷', name: '한국어' }
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      if (typeof handleLanguageChange === 'function') {
                        handleLanguageChange(lang.code);
                      }
                    }}
                    className={`
                      px-3 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 
                      flex items-center justify-center gap-2 border
                      ${selectedLanguage === lang.code
                        ? theme === 'dark'
                          ? 'bg-gradient-to-br from-teal-600 to-cyan-600 text-white shadow-lg border-teal-500/50'
                          : 'bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg border-teal-400/50'
                        : theme === 'dark'
                          ? 'bg-slate-700/40 text-slate-300 hover:bg-slate-700/60 border-slate-600/40 hover:border-slate-500/60'
                          : 'bg-slate-50/40 text-slate-600 hover:bg-slate-100/60 border-slate-200/40 hover:border-slate-300/60'
                      }
                      hover:scale-105 transform-gpu
                    `}
                  >
                    <span className="text-base">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
            </div>

            {/* Menu Items */}
            <div className="p-4">
              {menuItems.map((category, categoryIndex) => (
              <div key={category.category} className={categoryIndex > 0 ? 'mt-5' : ''}>
                {/* Category Header with Icon */}
                <div className="flex items-center gap-2.5 mb-3 px-2">
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center
                    ${category.color === 'teal' 
                      ? theme === 'dark' ? 'bg-teal-600/20' : 'bg-teal-500/15'
                      : category.color === 'purple'
                      ? theme === 'dark' ? 'bg-purple-600/20' : 'bg-purple-500/15'
                      : theme === 'dark' ? 'bg-cyan-600/20' : 'bg-cyan-500/15'
                    }
                  `}>
                    <category.icon className={`text-sm ${
                      category.color === 'teal' 
                        ? 'text-teal-600 dark:text-teal-400'
                        : category.color === 'purple'
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-cyan-600 dark:text-cyan-400'
                    }`} />
                  </div>
                  <div className={`text-xs font-black uppercase tracking-wider ${
                    theme === "dark" ? "text-slate-300" : "text-slate-700"
                  }`}>
                    {category.category}
                  </div>
                </div>
                
                {/* Category Items */}
                <div className="space-y-1.5">
                  {category.items.map((item) => (
                    <button
                      key={item.path || item.name}
                      onClick={() => handleMenuClick(item)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-left group border ${
                        theme === "dark" 
                          ? "hover:bg-slate-800/60 text-slate-200 hover:text-white border-transparent hover:border-slate-700/50 hover:shadow-lg" 
                          : "hover:bg-slate-50/60 text-slate-700 hover:text-slate-900 border-transparent hover:border-slate-200/50 hover:shadow-md"
                      }`}
                    >
                      <div className={`
                        w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-xl
                        ${theme === 'dark' ? 'bg-slate-800/60 group-hover:bg-slate-700/60' : 'bg-slate-100/60 group-hover:bg-slate-200/60'}
                        transition-all duration-200
                      `}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm mb-0.5">{item.name}</div>
                        <div className={`text-xs ${
                          theme === "dark" ? "text-slate-400" : "text-slate-500"
                        }`}>
                          {item.description}
                        </div>
                      </div>
                      <svg 
                        className={`w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 ${
                          theme === "dark" ? "text-teal-400" : "text-teal-600"
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            ))}
            </div>
          </div>

          {/* Footer */}
          <div className={`px-5 py-3 border-t text-center ${
            theme === "dark" 
              ? "bg-slate-800/40 border-slate-700/50" 
              : "bg-slate-50/60 border-slate-200/50"
          }`}>
            <p className={`text-xs font-medium ${
              theme === "dark" ? "text-slate-400" : "text-slate-500"
            }`}>
              Roamio Wanderly © 2024
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Ultra-Professional Features Box Component
 * Comprehensive dropdown showcasing all Roamio Wanderly features
 */
const FeaturesBox = ({ theme, onNavigation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { t } = useTranslation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFeatureClick = (feature) => {
    if (feature.action) {
      feature.action();
    } else if (feature.path) {
      onNavigation(feature.path);
    }
    setIsOpen(false);
  };

  // Core essential features only - minimal set
  const featureCategories = [
    {
      title: "Core Features",
      icon: "🎯",
      color: "from-teal-500 to-cyan-500",
      features: [
        { name: "Add Place", path: "/add-place", icon: "➕", description: "Share your discovery" },
        { name: "My Wishlist", path: "/wishlist", icon: "❤️", description: "Saved places" }
      ]
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 border backdrop-blur-xl transform-gpu will-change-transform relative overflow-hidden group ${
          theme === "dark" 
            ? "border-teal-700/40 hover:border-teal-600/70 hover:bg-gradient-to-r hover:from-teal-900/50 hover:to-cyan-900/50 hover:shadow-xl hover:shadow-teal-900/30 hover:scale-105 text-teal-100 hover:text-white" 
            : "border-teal-200/40 hover:border-teal-300/70 hover:bg-gradient-to-r hover:from-teal-50/50 hover:to-cyan-50/50 hover:shadow-xl hover:shadow-teal-200/30 hover:scale-105 text-teal-700 hover:text-teal-900"
        } before:absolute before:inset-0 before:bg-gradient-to-r ${
          theme === "dark"
            ? "before:from-teal-600/10 before:to-cyan-600/10"
            : "before:from-teal-500/5 before:to-cyan-500/5"
        } before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300`}
        title="Explore All Features"
      >
        <span className="text-lg">🌟</span>
        <span>Features</span>
        <svg 
          className={`w-4 h-4 transition-all duration-300 ${
            isOpen ? 'rotate-180 text-teal-500' : 'text-slate-500 hover:text-teal-500'
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Ultra-Professional Features Dropdown */}
      {isOpen && (
        <div className={`absolute top-full right-0 mt-2 w-[400px] max-w-[90vw] rounded-2xl backdrop-blur-2xl border shadow-2xl z-50 overflow-hidden ${
          theme === "dark"
            ? "bg-slate-900/95 border-slate-700/50 shadow-slate-900/50"
            : "bg-white/95 border-slate-200/50 shadow-slate-200/50"
        }`}>
          {/* Premium Header */}
          <div className={`px-6 py-4 border-b ${
            theme === "dark" 
              ? "bg-gradient-to-r from-slate-800/60 to-slate-700/60 border-slate-700/50" 
              : "bg-gradient-to-r from-slate-50/80 to-gray-50/80 border-slate-200/50"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl">
                  <span className="text-2xl">🌟</span>
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${
                    theme === "dark" ? "text-slate-200" : "text-slate-700"
                  }`}>
                    Features
                  </h3>
                  <p className={`text-sm ${
                    theme === "dark" ? "text-slate-400" : "text-slate-500"
                  }`}>
                    Essential Nepal travel tools
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                theme === "dark" 
                  ? "bg-teal-900/50 text-teal-300 border border-teal-700/50" 
                  : "bg-teal-50/80 text-teal-700 border border-teal-200/50"
              }`}>
                {featureCategories.reduce((total, category) => total + category.features.length, 0)} Features
              </div>
            </div>
          </div>

          {/* Features Grid - Single Column for Core Features */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {featureCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-3">
                {/* Category Header */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color}/20`}>
                    <span className="text-lg">{category.icon}</span>
                  </div>
                  <div>
                    <h4 className={`font-bold text-sm ${
                      theme === "dark" ? "text-slate-200" : "text-slate-700"
                    }`}>
                      {category.title}
                    </h4>
                  </div>
                </div>

                {/* Category Features */}
                <div className="space-y-2">
                  {category.features.map((feature, featureIndex) => (
                    <button
                      key={featureIndex}
                      onClick={() => handleFeatureClick(feature)}
                      className={`w-full p-4 text-left rounded-xl transition-all duration-200 flex items-center space-x-4 group hover:scale-[1.02] ${
                        theme === "dark" 
                          ? "hover:bg-slate-800/50 text-slate-300 hover:text-white border border-slate-700/30 hover:border-slate-600/50" 
                          : "hover:bg-slate-50/70 text-slate-600 hover:text-slate-900 border border-slate-200/30 hover:border-slate-300/50"
                      }`}
                    >
                      {/* Feature Icon */}
                      <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${category.color}/20 group-hover:scale-105 transition-transform duration-200`}>
                        <span className="text-xl">{feature.icon}</span>
                      </div>
                      
                      {/* Feature Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-base mb-1">
                          {feature.name}
                        </div>
                        <div className={`text-sm ${
                          theme === "dark" ? "text-slate-400" : "text-slate-500"
                        }`}>
                          {feature.description}
                        </div>
                      </div>

                      {/* Arrow Icon */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Premium Footer */}
          <div className={`px-6 py-4 border-t text-center ${
            theme === "dark" 
              ? "bg-slate-800/40 border-slate-700/50" 
              : "bg-slate-50/60 border-slate-200/50"
          }`}>
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className={theme === "dark" ? "text-slate-400" : "text-slate-500"}>
                  Core features active
                </span>
              </div>
              <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">🎯</span>
                <span className={theme === "dark" ? "text-slate-400" : "text-slate-500"}>
                  Essential tools only
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};