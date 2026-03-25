import { getLocalizedFallback } from '../../constants/locationFallbacks';
import { reverseGeocodeWithMaxAccuracy, detectLocationByNetwork } from '../geocodingService';

// ---------------------------------------------------------------------------
// GPS promise wrapper
// ---------------------------------------------------------------------------

/**
 * Promise-based wrapper around navigator.geolocation.getCurrentPosition.
 * Resolves with a GeolocationPosition, or null if the browser lacks support.
 * Never rejects – errors are swallowed and null is returned so callers can
 * fall through to network detection.
 *
 * @param {PositionOptions} options
 * @returns {Promise<GeolocationPosition|null>}
 */
export const getCurrentPositionAsync = (options) =>
    new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve(null);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => resolve(position),
            (error) => {
                console.warn('Geolocation error:', error.message);
                resolve(null);
            },
            options
        );
    });

// ---------------------------------------------------------------------------
// High-accuracy GPS detection
// ---------------------------------------------------------------------------

/**
 * Attempts to get location with maximum GPS accuracy.
 * Falls through to network detection on any failure.
 *
 * @param {string}   language      - BCP-47 language code
 * @param {Function} setLocation   - state setter for the location string
 * @param {Function} setLoading    - state setter for loading flag
 * @param {Function} setError      - state setter for error string | null
 * @param {Function} setRetryCount - state setter for retry counter
 * @param {Function} [addDebugLog] - optional debug logger (message, data?) => void
 * @param {number}   [retryCount]  - internal retry counter (default 0)
 */
export const detectUserLocation = async (
    language,
    setLocation,
    setLoading,
    setError,
    setRetryCount,
    addDebugLog = () => { },
    retryCount = 0
) => {
    setLoading(true);
    setError(null);
    addDebugLog(`Starting GPS detection (attempt ${retryCount + 1})`);

    try {
        const position = await getCurrentPositionAsync({
            enableHighAccuracy: true,
            timeout: 45000,
            maximumAge: 0,
        });

        if (position) {
            const { latitude, longitude, accuracy } = position.coords;
            const locationInfo = {
                latitude: parseFloat(latitude.toFixed(8)),
                longitude: parseFloat(longitude.toFixed(8)),
                accuracy: Math.round(accuracy),
                timestamp: new Date(position.timestamp).toLocaleTimeString(),
            };
            addDebugLog('GPS SUCCESS', locationInfo);

            // Show coordinates immediately, then replace with named location
            setLocation(`📍 ${latitude.toFixed(6)}, ${longitude.toFixed(6)} (±${Math.round(accuracy)}m)`);

            const locationName = await reverseGeocodeWithMaxAccuracy(
                latitude, longitude, language, accuracy, addDebugLog
            );

            setTimeout(() => {
                setLocation(`🌍 ${locationName}`);
                setLoading(false);
            }, 300);

            setRetryCount(0);
            addDebugLog(`Final location: ${locationName}`);
            return;
        }

        // No position returned – try network
        addDebugLog('GPS returned null, falling back to network');
        const networkLocation = await detectLocationByNetwork(language, addDebugLog);
        setLocation(networkLocation);
    } catch (error) {
        addDebugLog(`GPS error (attempt ${retryCount + 1})`, { error: error.message, code: error.code });

        if (error.code === 1) {
            // PERMISSION_DENIED
            setError('Location permission denied');
            const networkLocation = await detectLocationByNetwork(language, addDebugLog);
            setLocation(networkLocation);
        } else if (error.code === 2) {
            // POSITION_UNAVAILABLE
            setError('GPS unavailable');
            const networkLocation = await detectLocationByNetwork(language, addDebugLog);
            setLocation(networkLocation);
        } else if (error.code === 3) {
            // TIMEOUT
            if (retryCount < 2) {
                addDebugLog(`GPS timeout – retrying with lower accuracy (attempt ${retryCount + 2})`);
                setRetryCount(retryCount + 1);
                setTimeout(() => {
                    detectUserLocationFallback(language, setLocation, setLoading, setError, setRetryCount, addDebugLog, retryCount + 1);
                }, 1000);
                return;
            }
            setError('GPS timeout');
            const networkLocation = await detectLocationByNetwork(language, addDebugLog);
            setLocation(networkLocation);
        } else {
            if (retryCount < 1) {
                addDebugLog(`Unknown GPS error – retrying (attempt ${retryCount + 2})`);
                setRetryCount(retryCount + 1);
                setTimeout(() => {
                    detectUserLocation(language, setLocation, setLoading, setError, setRetryCount, addDebugLog, retryCount + 1);
                }, 2000);
                return;
            }
            const networkLocation = await detectLocationByNetwork(language, addDebugLog);
            setLocation(networkLocation);
        }
    }

    setLoading(false);
};

// ---------------------------------------------------------------------------
// Lower-accuracy fallback GPS (used after timeout retries)
// ---------------------------------------------------------------------------

/**
 * Same as detectUserLocation but with lower accuracy settings.
 * Used internally after GPS timeouts.
 */
export const detectUserLocationFallback = async (
    language,
    setLocation,
    setLoading,
    setError,
    setRetryCount,
    addDebugLog = () => { },
    retryCount = 0
) => {
    addDebugLog(`Trying fallback GPS (lower accuracy, attempt ${retryCount + 1})`);

    try {
        const position = await getCurrentPositionAsync({
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 300000, // allow 5-min cache
        });

        if (position) {
            const { latitude, longitude, accuracy } = position.coords;
            addDebugLog('Fallback GPS SUCCESS', { latitude, longitude, accuracy });

            setLocation(`📍 ${latitude.toFixed(4)}, ${longitude.toFixed(4)} (±${Math.round(accuracy)}m)`);
            const locationName = await reverseGeocodeWithMaxAccuracy(
                latitude, longitude, language, accuracy, addDebugLog
            );
            setLocation(`🌍 ${locationName}`);
            setRetryCount(0);
        } else {
            const networkLocation = await detectLocationByNetwork(language, addDebugLog);
            setLocation(networkLocation);
        }
    } catch (err) {
        addDebugLog('Fallback GPS failed', { error: err.message });
        const networkLocation = await detectLocationByNetwork(language, addDebugLog);
        setLocation(networkLocation);
    }

    setLoading(false);
};

// ---------------------------------------------------------------------------
// Force refresh (call this from UI "refresh" buttons)
// ---------------------------------------------------------------------------

/**
 * Convenience wrapper that resets state and triggers a fresh location detection.
 *
 * @param {string}   language
 * @param {Function} setLocation
 * @param {Function} setLoading
 * @param {Function} setError
 * @param {Function} setRetryCount
 * @param {Function} [addDebugLog]
 */
export const forceRefreshLocation = async (
    language,
    setLocation,
    setLoading,
    setError,
    setRetryCount,
    addDebugLog = () => { }
) => {
    setLocation('Refreshing location...');
    setLoading(true);

    try {
        await detectUserLocation(language, setLocation, setLoading, setError, setRetryCount, addDebugLog);
    } catch (err) {
        console.error('Force refresh failed:', err);
        setLocation('Location refresh failed');
        setTimeout(() => setLocation(getLocalizedFallback(language)), 2000);
        setLoading(false);
    }
};