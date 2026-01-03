import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { UserButton, SignUpButton, SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import NepaliCalendar from "../../pages/NepaliCalendar";
import { useTheme } from "../../contexts/ThemeContext";
import { FaSun, FaMoon, FaBars, FaTimes, FaMapMarkerAlt, FaGlobe, FaCompass, FaCamera, FaBookOpen, FaEnvelope, FaHeart, FaUser, FaCog, FaQuestionCircle } from "react-icons/fa";

/**
 * Header Component
 * 
 * A responsive navigation header with mobile menu toggle, theme switching,
 * calendar integration, and user authentication features.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onHomeClick - Callback function for home navigation
 */
export const Header = ({ onHomeClick }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || 'en');
  const [currentLocation, setCurrentLocation] = useState('Detecting location...');
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [locationRetryCount, setLocationRetryCount] = useState(0);
  const [locationError, setLocationError] = useState(null);
  const [showLocationDebug, setShowLocationDebug] = useState(false); // Debug panel toggle
  const [locationDebugInfo, setLocationDebugInfo] = useState([]); // Debug information

  // Debug logging
  console.log('Header render - showCalendar:', showCalendar);

  // Refs for DOM manipulation and focus management
  const calendarRef = useRef(null);
  const triggerRef = useRef(null);
  const previousActive = useRef(null);

  // Event handlers
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const handleLogoClick = () => navigate("/");

  const handleNavigation = (path) => {
    navigate(path);
    closeMobileMenu();
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
    
    addDebugLog(`Starting high-accuracy location detection (attempt ${retryCount + 1})`);
    
    try {
      // Get user's position with maximum accuracy settings
      const position = await getCurrentPositionAsync({
        enableHighAccuracy: true, // Always use high accuracy
        timeout: 30000, // Longer timeout for better accuracy
        maximumAge: 0 // Always get fresh location, no cache
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
        
        // Show precise coordinates first
        setCurrentLocation(`📍 ${latitude.toFixed(6)}, ${longitude.toFixed(6)} (±${Math.round(accuracy)}m)`);
        
        // Get the most accurate location name possible
        const locationName = await reverseGeocodeWithMaxAccuracy(latitude, longitude, language, accuracy);
        setCurrentLocation(`🌍 ${locationName}`);
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
    addDebugLog(`Starting FORCED neighborhood detection for: ${latitude}, ${longitude} (GPS accuracy: ±${gpsAccuracy}m)`);
    
    // Use maximum zoom for neighborhood detection
    const zoomLevel = 20; // Always use maximum zoom for neighborhood detection
    
    addDebugLog(`Using maximum zoom level ${zoomLevel} for neighborhood detection`);
    
    const apis = [
      // Ultra-high resolution Nominatim for neighborhoods
      {
        name: 'Nominatim-Neighborhood',
        url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=${language}&addressdetails=1&zoom=20&extratags=1&namedetails=1&polygon_geojson=0`,
        priority: 1,
        parser: (data) => {
          addDebugLog(`Nominatim-Neighborhood response:`, data);
          
          const address = data.address || {};
          let parts = [];
          
          // Force neighborhood detection - check all possible neighborhood fields
          const neighborhood = address.neighbourhood || address.suburb || address.quarter || 
                              address.residential || address.hamlet || address.village ||
                              address.locality || address.town_district || address.district;
          
          const road = address.road || address.street;
          const houseNumber = address.house_number;
          const city = address.city || address.town || address.municipality;
          const state = address.state || address.region;
          const country = address.country;
          
          // Build most specific location possible
          if (houseNumber && road && neighborhood) {
            parts.push(`${houseNumber} ${road}`, neighborhood, city || country);
          } else if (road && neighborhood) {
            parts.push(`${road}`, neighborhood, city || country);
          } else if (neighborhood && city && neighborhood !== city) {
            parts.push(neighborhood, city, country);
          } else if (neighborhood) {
            parts.push(neighborhood, city || state || country);
          } else if (road) {
            parts.push(road, city || state || country);
          } else {
            // Fallback to display name parsing for neighborhoods
            const displayParts = data.display_name?.split(',') || [];
            if (displayParts.length >= 3) {
              // Take first 3 parts which are usually most specific
              parts = displayParts.slice(0, 3).map(p => p.trim());
            }
          }
          
          const result = parts.filter(Boolean).slice(0, 3).join(', ');
          addDebugLog(`Nominatim-Neighborhood parsed: ${result}`);
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
    
    // Close mobile menu if open
    closeMobileMenu();
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
    setMobileAnimating, 
    isMobileMenuOpen, 
    setIsMobileMenuOpen 
  });

  useResponsiveMenuHandler(isMobileMenuOpen, setIsMobileMenuOpen);
  
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
    <header className={getHeaderClasses(theme)}>
      {/* Left side: Mobile Menu Button + Logo + App Name */}
      <div className="flex items-center gap-3">
        <MobileMenuToggle 
          isOpen={isMobileMenuOpen}
          onToggle={toggleMobileMenu}
          theme={theme}
        />
        <Logo onClick={handleLogoClick} theme={theme} />
      </div>

      {/* Desktop Navigation */}
      <DesktopNavigation 
        theme={theme}
        clerkAvailable={clerkAvailable}
        onCalendarOpen={handleCalendarOpen}
        onNavigation={handleNavigation}
        onThemeToggle={toggleTheme}
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

      {/* Mobile Navigation Menu */}
      <MobileNavigationMenu 
        isOpen={isMobileMenuOpen}
        theme={theme}
        clerkAvailable={clerkAvailable}
        onCalendarOpen={handleCalendarOpen}
        onNavigation={handleNavigation}
        onThemeToggle={toggleTheme}
        onClose={closeMobileMenu}
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
 * Returns super ultra-professional header CSS classes based on theme
 */
const getHeaderClasses = (theme) => {
  return `sticky top-0 z-50 w-full px-6 py-4 ${
    theme === "dark" 
      ? "bg-gradient-to-r from-slate-950/98 via-slate-900/95 to-slate-950/98 backdrop-blur-3xl border-slate-700/30 shadow-2xl shadow-slate-900/40" 
      : "bg-gradient-to-r from-white/99 via-slate-50/98 to-white/99 backdrop-blur-3xl border-slate-200/30 shadow-2xl shadow-slate-200/20"
  } border-b flex justify-between items-center relative transition-all duration-500 will-change-transform transform-gpu min-h-[80px] max-h-[80px] before:absolute before:inset-0 before:bg-gradient-to-r ${
    theme === "dark"
      ? "before:from-teal-600/8 before:via-cyan-600/5 before:to-blue-600/8"
      : "before:from-teal-500/5 before:via-cyan-500/3 before:to-blue-500/5"
  } before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-700 after:absolute after:inset-0 after:bg-gradient-to-b ${
    theme === "dark"
      ? "after:from-transparent after:via-slate-900/10 after:to-slate-950/20"
      : "after:from-transparent after:via-white/10 after:to-slate-50/20"
  } after:pointer-events-none group`;
};

/**
 * Returns super ultra-professional theme-based button classes
 */
const getThemeClasses = (theme) => {
  return theme === "dark" 
    ? "text-teal-100 hover:text-white hover:bg-gradient-to-r hover:from-teal-800/70 hover:to-cyan-800/70 hover:shadow-xl hover:shadow-teal-900/30 transition-all duration-500 transform hover:scale-105" 
    : "text-teal-700 hover:text-teal-900 hover:bg-gradient-to-r hover:from-teal-50/70 hover:to-cyan-50/70 hover:shadow-xl hover:shadow-teal-200/30 transition-all duration-500 transform hover:scale-105";
};

/**
 * Returns super ultra-professional navigation button classes
 */
const getNavButtonClasses = (theme) => {
  return `px-6 py-3 rounded-2xl font-semibold transition-all duration-500 border-2 backdrop-blur-2xl transform-gpu will-change-transform relative overflow-hidden group ${
    theme === "dark" 
      ? "border-teal-700/50 hover:border-teal-600/80 hover:bg-gradient-to-r hover:from-teal-900/60 hover:to-cyan-900/60 hover:shadow-2xl hover:shadow-teal-900/40 hover:scale-110" 
      : "border-teal-200/50 hover:border-teal-300/80 hover:bg-gradient-to-r hover:from-teal-50/60 hover:to-cyan-50/60 hover:shadow-2xl hover:shadow-teal-200/40 hover:scale-110"
  } before:absolute before:inset-0 before:bg-gradient-to-r ${
    theme === "dark"
      ? "before:from-teal-600/15 before:via-cyan-600/10 before:to-blue-600/15"
      : "before:from-teal-500/8 before:via-cyan-500/5 before:to-blue-500/8"
  } before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent after:transform after:-skew-x-12 after:-translate-x-full group-hover:after:translate-x-full after:transition-transform after:duration-1000`;
};

// ==================== CUSTOM HOOKS ====================

/**
 * Handles click outside events for calendar and mobile menu
 */
const useClickOutsideHandler = ({ 
  showCalendar, 
  mobileAnimating, 
  setShowCalendar, 
  setMobileAnimating, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen 
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
      
      // Handle mobile menu clicks
      if (isMobileMenuOpen) {
        const mobileMenu = e.target.closest('.mobile-menu');
        const mobileToggle = e.target.closest('.mobile-toggle');
        
        // Don't close if clicking inside menu or on toggle button
        if (!mobileMenu && !mobileToggle) {
          setIsMobileMenuOpen(false);
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
  }, [mobileAnimating, showCalendar, isMobileMenuOpen, setShowCalendar, setMobileAnimating, setIsMobileMenuOpen]);
};

/**
 * Handles responsive behavior for mobile menu
 */
const useResponsiveMenuHandler = (isMobileMenuOpen, setIsMobileMenuOpen) => {
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);
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
 * Ultra-Professional Custom Language Dropdown Component - Mobile Version
 */
const CustomLanguageDropdownMobile = ({ selectedLanguage, onLanguageChange, theme }) => {
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
      {/* Mobile Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-5 rounded-3xl backdrop-blur-xl border transition-all duration-300 flex items-center justify-between ${
          theme === "dark"
            ? "bg-gradient-to-r from-slate-900/80 via-slate-800/60 to-slate-900/80 border-slate-700/40 hover:border-slate-600/60 text-slate-100 hover:text-white"
            : "bg-gradient-to-r from-white/95 via-slate-50/80 to-white/95 border-slate-200/40 hover:border-slate-300/60 text-slate-700 hover:text-slate-900"
        } shadow-2xl hover:shadow-3xl`}
      >
        <div className="flex items-center space-x-4">
          <span className="text-2xl">{selectedLang.flag}</span>
          <div className="text-left">
            <div className="font-bold text-lg">{selectedLang.name}</div>
            <div className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
              {selectedLang.nativeName}
            </div>
          </div>
        </div>
        <div className={`flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-300 ${
          theme === "dark" 
            ? "bg-slate-700/60 hover:bg-slate-600/70" 
            : "bg-slate-100/80 hover:bg-slate-200/90"
        }`}>
          <svg 
            className={`w-5 h-5 text-slate-500 hover:text-teal-500 transition-all duration-300 ${
              isOpen ? 'rotate-180 text-teal-500' : ''
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Professional Mobile Dropdown Menu */}
      {isOpen && (
        <div className={`absolute top-full left-0 right-0 mt-3 rounded-3xl backdrop-blur-2xl border shadow-2xl z-50 overflow-hidden ${
          theme === "dark"
            ? "bg-slate-900/95 border-slate-700/50 shadow-slate-900/50"
            : "bg-white/95 border-slate-200/50 shadow-slate-200/50"
        }`}>
          {/* Premium Mobile Header */}
          <div className={`px-6 py-4 border-b ${
            theme === "dark" 
              ? "bg-gradient-to-r from-slate-800/60 to-slate-700/60 border-slate-700/50" 
              : "bg-gradient-to-r from-slate-50/80 to-gray-50/80 border-slate-200/50"
          }`}>
            <div className="flex items-center justify-center space-x-3">
              <FaGlobe className="text-teal-500 text-lg" />
              <span className={`text-lg font-bold ${
                theme === "dark" ? "text-slate-200" : "text-slate-700"
              }`}>
                Select Your Language
              </span>
            </div>
          </div>

          {/* Mobile Language Options */}
          <div className="py-3">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language.code)}
                className={`w-full px-6 py-4 text-left transition-all duration-200 flex items-center space-x-4 ${
                  selectedLanguage === language.code
                    ? theme === "dark"
                      ? "bg-gradient-to-r from-teal-900/60 to-cyan-900/60 text-white border-l-4 border-teal-400"
                      : "bg-gradient-to-r from-teal-50/90 to-cyan-50/90 text-teal-900 border-l-4 border-teal-500"
                    : theme === "dark"
                      ? "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                      : "text-slate-700 hover:bg-slate-50/80 hover:text-slate-900"
                }`}
              >
                {/* Flag */}
                <span className="text-2xl">{language.flag}</span>
                
                {/* Language Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-base">{language.name}</span>
                    <span className="text-sm font-semibold opacity-75 bg-slate-500/20 px-2 py-1 rounded-lg">
                      {language.code.toUpperCase()}
                    </span>
                  </div>
                  <div className={`text-sm ${
                    selectedLanguage === language.code
                      ? theme === "dark" ? "text-teal-200" : "text-teal-700"
                      : theme === "dark" ? "text-slate-400" : "text-slate-500"
                  }`}>
                    {language.nativeName}
                  </div>
                </div>

                {/* Selection Indicator */}
                {selectedLanguage === language.code && (
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-500 text-white">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Premium Mobile Footer */}
          <div className={`px-6 py-3 border-t text-center ${
            theme === "dark" 
              ? "bg-slate-800/40 border-slate-700/50" 
              : "bg-slate-50/60 border-slate-200/50"
          }`}>
            <span className={`text-sm ${
              theme === "dark" ? "text-slate-400" : "text-slate-500"
            }`}>
              🌍 More languages coming soon
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Super Ultra-Professional mobile menu toggle button component with premium effects
 */
const MobileMenuToggle = ({ isOpen, onToggle, theme }) => (
  <button
    onClick={onToggle}
    className={`p-5 rounded-3xl mobile-toggle transition-all duration-500 border-2 backdrop-blur-2xl relative overflow-hidden group ${
      theme === "dark" 
        ? "border-teal-700/50 hover:border-teal-600/80 bg-gradient-to-br from-teal-900/60 via-slate-800/50 to-cyan-900/60 hover:bg-gradient-to-br hover:from-teal-800/80 hover:via-slate-700/70 hover:to-cyan-800/80 text-teal-100 hover:text-white shadow-2xl hover:shadow-teal-900/50 hover:scale-110" 
        : "border-teal-200/50 hover:border-teal-300/80 bg-gradient-to-br from-teal-50/60 via-white/50 to-cyan-50/60 hover:bg-gradient-to-br hover:from-teal-100/80 hover:via-white/70 hover:to-cyan-100/80 text-teal-700 hover:text-teal-900 shadow-2xl hover:shadow-teal-200/50 hover:scale-110"
    } min-w-[60px] max-w-[60px] min-h-[60px] max-h-[60px] flex items-center justify-center transform-gpu will-change-transform`}
    aria-expanded={isOpen}
    aria-label="Toggle navigation menu"
    style={{ position: 'relative', zIndex: 60 }}
  >
    {/* Ultra Premium Background Effects */}
    <div className="absolute -inset-2 opacity-0 group-hover:opacity-100 transition-all duration-700">
      <div className={`absolute inset-0 rounded-full ${
        theme === "dark" 
          ? "bg-gradient-to-r from-teal-600/30 via-cyan-600/20 to-blue-600/30" 
          : "bg-gradient-to-r from-teal-500/20 via-cyan-500/15 to-blue-500/20"
      } blur-2xl animate-pulse`} />
    </div>
    
    {/* Premium Active State Background */}
    <div className={`absolute inset-0 transition-all duration-500 ${
      isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
    } ${theme === "dark" ? "bg-gradient-to-br from-teal-700/40 via-cyan-700/30 to-blue-700/40" : "bg-gradient-to-br from-teal-200/40 via-cyan-200/30 to-blue-200/40"} rounded-3xl shadow-inner`} />
    
    {/* Enhanced Icon Container */}
    <div className="relative w-8 h-8 flex items-center justify-center">
      <div className="relative transform-gpu">
        {isOpen ? (
          <FaTimes size={20} className="transform transition-all duration-500 group-hover:rotate-180 group-hover:scale-125 drop-shadow-lg" />
        ) : (
          <FaBars size={20} className="transform transition-all duration-500 group-hover:scale-125 group-hover:rotate-3 drop-shadow-lg" />
        )}
      </div>
      
      {/* Floating Animation Dots */}
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-bounce"></div>
      <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200 animate-bounce"></div>
    </div>
    
    {/* Ultra Premium Glow Effect */}
    <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
      theme === "dark" 
        ? "bg-gradient-to-r from-teal-600/25 via-cyan-600/20 to-blue-600/25" 
        : "bg-gradient-to-r from-teal-500/15 via-cyan-500/10 to-blue-500/15"
    } blur-xl -z-10 animate-pulse`} />
    
    {/* Shimmer Effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-3xl"></div>
  </button>
);

/**
 * Super Ultra-Professional logo component with premium animations and effects
 */
const Logo = ({ onClick, theme }) => (
  <div className="flex items-center cursor-pointer group transform-gpu will-change-transform relative" onClick={onClick}>
    {/* Ultra Premium Background Glow */}
    <div className="absolute -inset-6 opacity-0 group-hover:opacity-100 transition-all duration-1000">
      <div className={`absolute inset-0 rounded-full ${
        theme === "dark" 
          ? "bg-gradient-to-r from-teal-600/40 via-cyan-600/30 to-emerald-600/40" 
          : "bg-gradient-to-r from-teal-500/30 via-cyan-500/20 to-emerald-500/30"
      } blur-3xl animate-pulse`} />
      <div className={`absolute inset-0 rounded-full ${
        theme === "dark" 
          ? "bg-gradient-to-r from-blue-600/20 via-purple-600/15 to-pink-600/20" 
          : "bg-gradient-to-r from-blue-500/15 via-purple-500/10 to-pink-500/15"
      } blur-2xl animate-pulse delay-500`} />
    </div>
    
    {/* Enhanced Logo Icon */}
    <div className="relative mr-6">
      <div className={`absolute -inset-4 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 ${
        theme === "dark" 
          ? "bg-gradient-to-br from-teal-600/30 via-cyan-600/20 to-emerald-600/30" 
          : "bg-gradient-to-br from-teal-500/20 via-cyan-500/15 to-emerald-500/20"
      } blur-2xl animate-pulse shadow-2xl`} />
      
      {/* Premium Icon Container */}
      <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-700 ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-800/80 via-slate-700/60 to-slate-800/80 border-2 border-slate-600/50"
          : "bg-gradient-to-br from-white/90 via-slate-50/70 to-white/90 border-2 border-slate-200/50"
      } group-hover:scale-110 group-hover:rotate-3 shadow-2xl backdrop-blur-xl`}>
        <span className="text-4xl font-bold transform transition-all duration-700 filter drop-shadow-2xl">
          🌄
        </span>
        
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
      </div>
    </div>
    
    {/* Enhanced Brand Text */}
    <div className="hidden md:flex flex-col min-w-0 relative">
      {/* Premium Background Pattern */}
      <div className="absolute -inset-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className={`absolute inset-0 rounded-xl ${
          theme === "dark" 
            ? "bg-gradient-to-r from-slate-800/20 via-slate-700/10 to-slate-800/20" 
            : "bg-gradient-to-r from-white/30 via-slate-50/20 to-white/30"
        } backdrop-blur-sm`} />
      </div>
      
      <div className="flex items-baseline relative z-10">
        <span className={`text-4xl font-black tracking-tight bg-gradient-to-r ${
          theme === "dark" 
            ? "from-teal-300 via-emerald-300 to-cyan-300" 
            : "from-teal-600 via-emerald-600 to-cyan-600"
        } text-transparent bg-clip-text font-sans whitespace-nowrap group-hover:bg-gradient-to-r ${
          theme === "dark"
            ? "group-hover:from-teal-200 group-hover:via-emerald-200 group-hover:to-cyan-200"
            : "group-hover:from-teal-700 group-hover:via-emerald-700 group-hover:to-cyan-700"
        } transition-all duration-700 drop-shadow-lg`}>
          Roamio
        </span>
        <span className={`text-2xl font-light ml-4 tracking-wider ${
          theme === "dark" ? "text-slate-300 group-hover:text-slate-100" : "text-slate-500 group-hover:text-slate-700"
        } transition-all duration-700 whitespace-nowrap drop-shadow-md`}>
          Wanderly
        </span>
      </div>
      
      {/* Enhanced Underline Animation */}
      <div className="relative mt-1">
        <div className={`h-1.5 w-0 group-hover:w-full transition-all duration-1000 ${
          theme === "dark" 
            ? "bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400" 
            : "bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600"
        } rounded-full shadow-xl`} />
        <div className={`absolute top-0 h-1.5 w-0 group-hover:w-full transition-all duration-1000 delay-200 ${
          theme === "dark" 
            ? "bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" 
            : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
        } rounded-full shadow-lg opacity-60`} />
      </div>
      
      {/* Premium Tagline */}
      <div className={`text-xs font-medium mt-1 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-700 delay-300 ${
        theme === "dark" ? "text-slate-400" : "text-slate-500"
      }`}>
        Discover • Explore • Wander
      </div>
    </div>
    
    {/* Ultra Premium Floating Elements */}
    <div className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-bounce"></div>
    <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 delay-300 animate-bounce"></div>
  </div>
);

/**
 * Desktop navigation component
 */
const DesktopNavigation = ({ 
  theme, 
  clerkAvailable, 
  onCalendarOpen, 
  onNavigation, 
  onThemeToggle, 
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
  <div className="hidden md:flex items-center gap-3">
    {/* Location Indicator */}
    <div 
      className="hidden lg:flex items-center space-x-2 px-3 py-2 bg-slate-100/60 dark:bg-slate-800/60 rounded-xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors duration-200 group"
      onClick={onLocationRefresh}
      title={isLocationLoading ? "Detecting location..." : "Click to refresh location"}
    >
      <FaMapMarkerAlt className={`text-teal-500 text-sm ${isLocationLoading ? 'animate-pulse' : ''}`} />
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {isLocationLoading 
          ? (locationRetryCount > 0 ? `Retrying... (${locationRetryCount}/2)` : 'Detecting location...') 
          : currentLocation}
      </span>
      {!isLocationLoading && (
        <svg className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
      )}
      {locationError && (
        <span className="text-xs text-amber-500 ml-1" title={locationError}>⚠</span>
      )}
    </div>

    <NavigationItems 
      theme={theme}
      onCalendarOpen={onCalendarOpen}
      onNavigation={onNavigation}
      onThemeToggle={onThemeToggle}
      showCalendar={showCalendar}
      triggerRef={triggerRef}
      selectedLanguage={selectedLanguage}
      onLanguageChange={onLanguageChange}
    />
    
    <AuthenticationButtons clerkAvailable={clerkAvailable} onNavigation={onNavigation} />
  </div>
);

/**
 * Mobile navigation menu component
 */
const MobileNavigationMenu = ({ 
  isOpen, 
  theme, 
  clerkAvailable, 
  onCalendarOpen, 
  onNavigation, 
  onThemeToggle, 
  onClose,
  currentLocation,
  isLocationLoading,
  onLocationRefresh,
  selectedLanguage,
  onLanguageChange,
  locationRetryCount = 0,
  locationError = null
}) => {
  const { t } = useTranslation();
  
  return (
    <>
      {isOpen && (
        <div className={`absolute top-full left-0 right-0 mobile-menu transform-gpu will-change-transform ${
          theme === "dark" 
            ? "bg-slate-950/95 backdrop-blur-xl border-slate-800/50" 
            : "bg-white/95 backdrop-blur-xl border-slate-200/50"
        } border-t shadow-2xl z-[60] animate-in slide-in-from-top-4 duration-300 max-h-[80vh] overflow-y-auto`}>
          <div className="max-w-7xl mx-auto">
            <nav className="flex flex-col p-8 space-y-1 scrollbar-thin scrollbar-thumb-teal-500 scrollbar-track-transparent hover:scrollbar-thumb-teal-400">
              
              {/* Location Indicator - Mobile (Moved to Top) */}
              <div 
                className="flex items-center justify-center space-x-2 px-4 py-3 mb-4 bg-slate-100/60 dark:bg-slate-800/60 rounded-xl border border-slate-200/50 dark:border-slate-700/50 cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors duration-200"
                onClick={onLocationRefresh}
                title={isLocationLoading ? "Detecting location..." : "Tap to refresh location"}
              >
                <FaMapMarkerAlt className={`text-teal-500 ${isLocationLoading ? 'animate-pulse' : ''}`} />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Currently exploring: {isLocationLoading 
                    ? (locationRetryCount > 0 ? `Retrying... (${locationRetryCount}/2)` : 'Detecting location...') 
                    : currentLocation}
                </span>
                {!isLocationLoading && (
                  <svg className="w-3 h-3 text-slate-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                )}
                {locationError && (
                  <span className="text-xs text-amber-500 ml-1" title={locationError}>⚠</span>
                )}
              </div>
              
              {/* Language Selector - Mobile (Second) */}
              <div className="mb-4">
                <CustomLanguageDropdownMobile 
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={onLanguageChange}
                  theme={theme}
                />
              </div>

              <MobileNavigationItems 
                theme={theme}
                onCalendarOpen={onCalendarOpen}
                onNavigation={onNavigation}
                onThemeToggle={onThemeToggle}
                onClose={onClose}
              />
              
              <div className="pt-6 border-t border-teal-200/50 dark:border-teal-700/50 mt-6">
                <MobileAuthenticationButtons 
                  clerkAvailable={clerkAvailable} 
                  onNavigation={onNavigation}
                  onClose={onClose}
                  theme={theme}
                />
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

/**
 * Navigation items component (shared between desktop and mobile)
 */
const NavigationItems = ({ 
  theme, 
  onCalendarOpen, 
  onNavigation, 
  onThemeToggle, 
  showCalendar, 
  triggerRef,
  selectedLanguage,
  onLanguageChange
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center space-x-2">
      {/* Language Selector - First in Desktop */}
      <CustomLanguageDropdown 
        selectedLanguage={selectedLanguage}
        onLanguageChange={onLanguageChange}
        theme={theme}
      />
      
      <div className="h-6 w-px bg-teal-300 dark:bg-teal-600 mx-2" />
      
      {/* Calendar Button */}
      <button
        type="button"
        ref={triggerRef}
        onClick={onCalendarOpen}
        className={`${getNavButtonClasses(theme)} ${getThemeClasses(theme)}`}
        aria-expanded={showCalendar}
        aria-haspopup="dialog"
        aria-label="Open Nepali Calendar"
        title="Nepali Calendar"
      >
        <span className="flex items-center space-x-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <span>{t('header.calendar')}</span>
        </span>
      </button>
      
      {/* Home Button */}
      <button
        onClick={() => onNavigation("/")}
        className={`${getNavButtonClasses(theme)} ${getThemeClasses(theme)}`}
        title="Home"
      >
        <span className="flex items-center space-x-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span>{t('header.home')}</span>
        </span>
      </button>
      
      {/* About Button */}
      <button
        type="button"
        onClick={() => onNavigation("/about")}
        className={`${getNavButtonClasses(theme)} ${getThemeClasses(theme)}`}
        title="About Us"
      >
        <span className="flex items-center space-x-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>{t('header.about')}</span>
        </span>
      </button>

      <div className="h-6 w-px bg-teal-300 dark:bg-teal-600 mx-2" />

      {/* Theme Toggle Button */}
      <button
        onClick={onThemeToggle}
        className={`${getNavButtonClasses(theme)} ${getThemeClasses(theme)}`}
        aria-label="Toggle theme"
        title={theme === "light" ? t('header.darkMode') : t('header.lightMode')}
      >
        <span className="flex items-center space-x-2">
          {theme === "light" ? (
            <FaMoon className="w-4 h-4" />
          ) : (
            <FaSun className="w-4 h-4" />
          )}
          <span>{theme === "light" ? t('header.darkMode') : t('header.lightMode')}</span>
        </span>
      </button>
    </div>
  );
};

/**
 * Mobile navigation items component
 */
const MobileNavigationItems = ({ 
  theme, 
  onCalendarOpen, 
  onNavigation, 
  onThemeToggle, 
  onClose 
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-3">
      {/* Calendar Button */}
      <button
        type="button"
        onClick={onCalendarOpen}
        className={`w-full p-4 text-left rounded-2xl transition-all duration-300 backdrop-blur-sm transform-gpu will-change-transform ${
          theme === "dark" 
            ? "bg-gradient-to-r from-slate-800/60 via-slate-700/40 to-slate-800/60 border border-slate-600/30 hover:border-teal-500/50 hover:bg-gradient-to-r hover:from-teal-900/40 hover:via-teal-800/30 hover:to-teal-900/40 text-slate-100 hover:text-white" 
            : "bg-gradient-to-r from-white/80 via-slate-50/60 to-white/80 border border-slate-200/40 hover:border-teal-300/60 hover:bg-gradient-to-r hover:from-teal-50/60 hover:via-teal-25/40 hover:to-teal-50/60 text-slate-700 hover:text-teal-900"
        } flex items-center space-x-4 group shadow-sm hover:shadow-lg`}
        aria-haspopup="dialog"
        aria-label="Open Nepali Calendar"
      >
        <div className={`p-2 rounded-xl ${
          theme === "dark" ? "bg-teal-500/20 group-hover:bg-teal-500/30" : "bg-teal-100/80 group-hover:bg-teal-200/80"
        } transition-colors duration-300`}>
          <svg className="w-5 h-5 text-teal-500 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1">
          <span className="font-semibold text-base">{t('header.calendar')}</span>
          <p className={`text-xs mt-0.5 ${
            theme === "dark" ? "text-slate-400" : "text-slate-500"
          }`}>View Nepali dates & festivals</p>
        </div>
        <div className={`p-1 rounded-lg ${
          theme === "dark" ? "bg-slate-700/50" : "bg-slate-100/50"
        } group-hover:translate-x-1 transition-transform duration-300`}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      </button>

      {/* Home Button */}
      <button
        onClick={() => onNavigation("/")}
        className={`w-full p-4 text-left rounded-2xl transition-all duration-300 backdrop-blur-sm transform-gpu will-change-transform ${
          theme === "dark" 
            ? "bg-gradient-to-r from-slate-800/60 via-slate-700/40 to-slate-800/60 border border-slate-600/30 hover:border-emerald-500/50 hover:bg-gradient-to-r hover:from-emerald-900/40 hover:via-emerald-800/30 hover:to-emerald-900/40 text-slate-100 hover:text-white" 
            : "bg-gradient-to-r from-white/80 via-slate-50/60 to-white/80 border border-slate-200/40 hover:border-emerald-300/60 hover:bg-gradient-to-r hover:from-emerald-50/60 hover:via-emerald-25/40 hover:to-emerald-50/60 text-slate-700 hover:text-emerald-900"
        } flex items-center space-x-4 group shadow-sm hover:shadow-lg`}
      >
        <div className={`p-2 rounded-xl ${
          theme === "dark" ? "bg-emerald-500/20 group-hover:bg-emerald-500/30" : "bg-emerald-100/80 group-hover:bg-emerald-200/80"
        } transition-colors duration-300`}>
          <svg className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </div>
        <div className="flex-1">
          <span className="font-semibold text-base">{t('header.home')}</span>
          <p className={`text-xs mt-0.5 ${
            theme === "dark" ? "text-slate-400" : "text-slate-500"
          }`}>Return to main page</p>
        </div>
        <div className={`p-1 rounded-lg ${
          theme === "dark" ? "bg-slate-700/50" : "bg-slate-100/50"
        } group-hover:translate-x-1 transition-transform duration-300`}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      </button>

      {/* Experiences Button */}
      <button
        onClick={() => onNavigation("/experiences")}
        className={`w-full p-4 text-left rounded-2xl transition-all duration-300 backdrop-blur-sm transform-gpu will-change-transform ${
          theme === "dark" 
            ? "bg-gradient-to-r from-slate-800/60 via-slate-700/40 to-slate-800/60 border border-slate-600/30 hover:border-pink-500/50 hover:bg-gradient-to-r hover:from-pink-900/40 hover:via-pink-800/30 hover:to-pink-900/40 text-slate-100 hover:text-white" 
            : "bg-gradient-to-r from-white/80 via-slate-50/60 to-white/80 border border-slate-200/40 hover:border-pink-300/60 hover:bg-gradient-to-r hover:from-pink-50/60 hover:via-pink-25/40 hover:to-pink-50/60 text-slate-700 hover:text-pink-900"
        } flex items-center space-x-4 group shadow-sm hover:shadow-lg`}
      >
        <div className={`p-2 rounded-xl ${
          theme === "dark" ? "bg-pink-500/20 group-hover:bg-pink-500/30" : "bg-pink-100/80 group-hover:bg-pink-200/80"
        } transition-colors duration-300`}>
          <FaCamera className="w-5 h-5 text-pink-500 group-hover:scale-110 transition-transform duration-300" />
        </div>
        <div className="flex-1">
          <span className="font-semibold text-base">Experiences</span>
          <p className={`text-xs mt-0.5 ${
            theme === "dark" ? "text-slate-400" : "text-slate-500"
          }`}>Unique travel experiences</p>
        </div>
        <div className={`p-1 rounded-lg ${
          theme === "dark" ? "bg-slate-700/50" : "bg-slate-100/50"
        } group-hover:translate-x-1 transition-transform duration-300`}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      </button>

      {/* Travel Guide Button */}
      <button
        onClick={() => onNavigation("/guide")}
        className={`w-full p-4 text-left rounded-2xl transition-all duration-300 backdrop-blur-sm transform-gpu will-change-transform ${
          theme === "dark" 
            ? "bg-gradient-to-r from-slate-800/60 via-slate-700/40 to-slate-800/60 border border-slate-600/30 hover:border-orange-500/50 hover:bg-gradient-to-r hover:from-orange-900/40 hover:via-orange-800/30 hover:to-orange-900/40 text-slate-100 hover:text-white" 
            : "bg-gradient-to-r from-white/80 via-slate-50/60 to-white/80 border border-slate-200/40 hover:border-orange-300/60 hover:bg-gradient-to-r hover:from-orange-50/60 hover:via-orange-25/40 hover:to-orange-50/60 text-slate-700 hover:text-orange-900"
        } flex items-center space-x-4 group shadow-sm hover:shadow-lg`}
      >
        <div className={`p-2 rounded-xl ${
          theme === "dark" ? "bg-orange-500/20 group-hover:bg-orange-500/30" : "bg-orange-100/80 group-hover:bg-orange-200/80"
        } transition-colors duration-300`}>
          <FaBookOpen className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform duration-300" />
        </div>
        <div className="flex-1">
          <span className="font-semibold text-base">Travel Guide</span>
          <p className={`text-xs mt-0.5 ${
            theme === "dark" ? "text-slate-400" : "text-slate-500"
          }`}>Essential travel information</p>
        </div>
        <div className={`p-1 rounded-lg ${
          theme === "dark" ? "bg-slate-700/50" : "bg-slate-100/50"
        } group-hover:translate-x-1 transition-transform duration-300`}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      </button>

      {/* Wishlist Button */}
      <button
        onClick={() => onNavigation("/wishlist")}
        className={`w-full p-4 text-left rounded-2xl transition-all duration-300 backdrop-blur-sm transform-gpu will-change-transform ${
          theme === "dark" 
            ? "bg-gradient-to-r from-slate-800/60 via-slate-700/40 to-slate-800/60 border border-slate-600/30 hover:border-red-500/50 hover:bg-gradient-to-r hover:from-red-900/40 hover:via-red-800/30 hover:to-red-900/40 text-slate-100 hover:text-white" 
            : "bg-gradient-to-r from-white/80 via-slate-50/60 to-white/80 border border-slate-200/40 hover:border-red-300/60 hover:bg-gradient-to-r hover:from-red-50/60 hover:via-red-25/40 hover:to-red-50/60 text-slate-700 hover:text-red-900"
        } flex items-center space-x-4 group shadow-sm hover:shadow-lg`}
      >
        <div className={`p-2 rounded-xl ${
          theme === "dark" ? "bg-red-500/20 group-hover:bg-red-500/30" : "bg-red-100/80 group-hover:bg-red-200/80"
        } transition-colors duration-300`}>
          <FaHeart className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform duration-300" />
        </div>
        <div className="flex-1">
          <span className="font-semibold text-base">Wishlist</span>
          <p className={`text-xs mt-0.5 ${
            theme === "dark" ? "text-slate-400" : "text-slate-500"
          }`}>Your saved places</p>
        </div>
        <div className={`p-1 rounded-lg ${
          theme === "dark" ? "bg-slate-700/50" : "bg-slate-100/50"
        } group-hover:translate-x-1 transition-transform duration-300`}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      </button>
      
      {/* About Button */}
      <button
        type="button"
        onClick={() => onNavigation("/about")}
        className={`w-full p-4 text-left rounded-2xl transition-all duration-300 backdrop-blur-sm transform-gpu will-change-transform ${
          theme === "dark" 
            ? "bg-gradient-to-r from-slate-800/60 via-slate-700/40 to-slate-800/60 border border-slate-600/30 hover:border-blue-500/50 hover:bg-gradient-to-r hover:from-blue-900/40 hover:via-blue-800/30 hover:to-blue-900/40 text-slate-100 hover:text-white" 
            : "bg-gradient-to-r from-white/80 via-slate-50/60 to-white/80 border border-slate-200/40 hover:border-blue-300/60 hover:bg-gradient-to-r hover:from-blue-50/60 hover:via-blue-25/40 hover:to-blue-50/60 text-slate-700 hover:text-blue-900"
        } flex items-center space-x-4 group shadow-sm hover:shadow-lg`}
      >
        <div className={`p-2 rounded-xl ${
          theme === "dark" ? "bg-blue-500/20 group-hover:bg-blue-500/30" : "bg-blue-100/80 group-hover:bg-blue-200/80"
        } transition-colors duration-300`}>
          <svg className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1">
          <span className="font-semibold text-base">{t('header.about')}</span>
          <p className={`text-xs mt-0.5 ${
            theme === "dark" ? "text-slate-400" : "text-slate-500"
          }`}>Learn about our mission</p>
        </div>
        <div className={`p-1 rounded-lg ${
          theme === "dark" ? "bg-slate-700/50" : "bg-slate-100/50"
        } group-hover:translate-x-1 transition-transform duration-300`}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      </button>

      {/* Contact Button */}
      <button
        onClick={() => onNavigation("/contact")}
        className={`w-full p-4 text-left rounded-2xl transition-all duration-300 backdrop-blur-sm transform-gpu will-change-transform ${
          theme === "dark" 
            ? "bg-gradient-to-r from-slate-800/60 via-slate-700/40 to-slate-800/60 border border-slate-600/30 hover:border-cyan-500/50 hover:bg-gradient-to-r hover:from-cyan-900/40 hover:via-cyan-800/30 hover:to-cyan-900/40 text-slate-100 hover:text-white" 
            : "bg-gradient-to-r from-white/80 via-slate-50/60 to-white/80 border border-slate-200/40 hover:border-cyan-300/60 hover:bg-gradient-to-r hover:from-cyan-50/60 hover:via-cyan-25/40 hover:to-cyan-50/60 text-slate-700 hover:text-cyan-900"
        } flex items-center space-x-4 group shadow-sm hover:shadow-lg`}
      >
        <div className={`p-2 rounded-xl ${
          theme === "dark" ? "bg-cyan-500/20 group-hover:bg-cyan-500/30" : "bg-cyan-100/80 group-hover:bg-cyan-200/80"
        } transition-colors duration-300`}>
          <FaEnvelope className="w-5 h-5 text-cyan-500 group-hover:scale-110 transition-transform duration-300" />
        </div>
        <div className="flex-1">
          <span className="font-semibold text-base">Contact</span>
          <p className={`text-xs mt-0.5 ${
            theme === "dark" ? "text-slate-400" : "text-slate-500"
          }`}>Get in touch with us</p>
        </div>
        <div className={`p-1 rounded-lg ${
          theme === "dark" ? "bg-slate-700/50" : "bg-slate-100/50"
        } group-hover:translate-x-1 transition-transform duration-300`}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      </button>

      {/* Help Button */}
      <button
        onClick={() => onNavigation("/help")}
        className={`w-full p-4 text-left rounded-2xl transition-all duration-300 backdrop-blur-sm transform-gpu will-change-transform ${
          theme === "dark" 
            ? "bg-gradient-to-r from-slate-800/60 via-slate-700/40 to-slate-800/60 border border-slate-600/30 hover:border-green-500/50 hover:bg-gradient-to-r hover:from-green-900/40 hover:via-green-800/30 hover:to-green-900/40 text-slate-100 hover:text-white" 
            : "bg-gradient-to-r from-white/80 via-slate-50/60 to-white/80 border border-slate-200/40 hover:border-green-300/60 hover:bg-gradient-to-r hover:from-green-50/60 hover:via-green-25/40 hover:to-green-50/60 text-slate-700 hover:text-green-900"
        } flex items-center space-x-4 group shadow-sm hover:shadow-lg`}
      >
        <div className={`p-2 rounded-xl ${
          theme === "dark" ? "bg-green-500/20 group-hover:bg-green-500/30" : "bg-green-100/80 group-hover:bg-green-200/80"
        } transition-colors duration-300`}>
          <FaQuestionCircle className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform duration-300" />
        </div>
        <div className="flex-1">
          <span className="font-semibold text-base">Help & FAQ</span>
          <p className={`text-xs mt-0.5 ${
            theme === "dark" ? "text-slate-400" : "text-slate-500"
          }`}>Get help and support</p>
        </div>
        <div className={`p-1 rounded-lg ${
          theme === "dark" ? "bg-slate-700/50" : "bg-slate-100/50"
        } group-hover:translate-x-1 transition-transform duration-300`}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      </button>

      {/* Elegant Divider */}
      <div className="py-3">
        <div className={`h-px bg-gradient-to-r ${
          theme === "dark" 
            ? "from-transparent via-slate-600/50 to-transparent" 
            : "from-transparent via-slate-300/50 to-transparent"
        }`} />
      </div>

      {/* Theme Toggle Button */}
      <button
        onClick={() => {
          onThemeToggle();
          onClose();
        }}
        className={`w-full p-4 text-left rounded-2xl transition-all duration-300 backdrop-blur-sm transform-gpu will-change-transform ${
          theme === "dark" 
            ? "bg-gradient-to-r from-slate-800/60 via-slate-700/40 to-slate-800/60 border border-slate-600/30 hover:border-amber-500/50 hover:bg-gradient-to-r hover:from-amber-900/40 hover:via-amber-800/30 hover:to-amber-900/40 text-slate-100 hover:text-white" 
            : "bg-gradient-to-r from-white/80 via-slate-50/60 to-white/80 border border-slate-200/40 hover:border-indigo-300/60 hover:bg-gradient-to-r hover:from-indigo-50/60 hover:via-indigo-25/40 hover:to-indigo-50/60 text-slate-700 hover:text-indigo-900"
        } flex items-center space-x-4 group shadow-sm hover:shadow-lg`}
        aria-label="Toggle theme"
      >
        <div className={`p-2 rounded-xl ${
          theme === "dark" 
            ? "bg-amber-500/20 group-hover:bg-amber-500/30" 
            : "bg-indigo-100/80 group-hover:bg-indigo-200/80"
        } transition-colors duration-300`}>
          {theme === "light" ? (
            <FaMoon size={20} className="text-indigo-500 group-hover:scale-110 transition-transform duration-300" />
          ) : (
            <FaSun size={20} className="text-amber-500 group-hover:scale-110 transition-transform duration-300" />
          )}
        </div>
        <div className="flex-1">
          <span className="font-semibold text-base">
            {theme === "light" ? t('header.darkMode') : t('header.lightMode')}
          </span>
          <p className={`text-xs mt-0.5 ${
            theme === "dark" ? "text-slate-400" : "text-slate-500"
          }`}>
            {theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
          </p>
        </div>
        <div className={`p-1 rounded-lg ${
          theme === "dark" ? "bg-slate-700/50" : "bg-slate-100/50"
        } group-hover:translate-x-1 transition-transform duration-300`}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      </button>
    </div>
  );
};

/**
 * Authentication buttons for desktop
 */
const AuthenticationButtons = ({ clerkAvailable, onNavigation }) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center space-x-3">
      <SignedOut>
        <button 
          onClick={() => onNavigation('/sign-up')}
          className={`px-8 py-3 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 hover:from-teal-700 hover:via-emerald-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-teal-500/50 backdrop-blur-sm relative overflow-hidden group`}
        >
          <span className="relative z-10 flex items-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
            <span>{t('header.signUp')}</span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </button>
      </SignedOut>
      <SignedIn>
        <div className="flex items-center p-1 rounded-xl border border-teal-200/50 dark:border-teal-700/50 bg-teal-50/40 dark:bg-teal-900/40 backdrop-blur-sm">
          <UserButton />
        </div>
      </SignedIn>
    </div>
  );
};

/**
 * Authentication buttons for mobile
 */
const MobileAuthenticationButtons = ({ clerkAvailable, onNavigation, onClose, theme }) => {
  const { t } = useTranslation();
  
  return (
    <>
      <SignedOut>
        <button 
          onClick={() => {
            onNavigation('/sign-up');
            onClose();
          }}
          className={`w-full p-4 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 hover:from-teal-700 hover:via-emerald-700 hover:to-cyan-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-teal-500/50 backdrop-blur-sm relative overflow-hidden group`}
        >
          <span className="relative z-10 flex items-center justify-center space-x-3">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
            </div>
            <div className="text-left">
              <span className="block text-base font-bold">{t('header.signUp')}</span>
              <span className="block text-xs opacity-90">Join our travel community</span>
            </div>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </button>
      </SignedOut>
      <SignedIn>
        <div className={`flex justify-center p-4 rounded-2xl border backdrop-blur-sm ${
          theme === "dark" 
            ? "bg-gradient-to-r from-slate-800/60 via-slate-700/40 to-slate-800/60 border-slate-600/30" 
            : "bg-gradient-to-r from-white/80 via-slate-50/60 to-white/80 border-slate-200/40"
        } shadow-lg`}>
          <UserButton />
        </div>
      </SignedIn>
    </>
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