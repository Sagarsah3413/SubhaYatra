import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
    detectUserLocation,
    forceRefreshLocation as serviceForceRefresh,
} from '../services/reverseGeocode/locationService';

/**
 * Manages all location-related state and side-effects.
 *
 * Returns:
 *   currentLocation   {string}   - Human-readable location string
 *   isLocationLoading {boolean}  - True while detection is in progress
 *   locationError     {string|null}
 *   locationRetryCount {number}
 *   locationDebugInfo {Array}    - Debug log entries
 *   showLocationDebug {boolean}
 *   setShowLocationDebug {Function}
 *   refresh           {Function} - Trigger a manual location refresh
 *   addDebugLog       {Function} - Internal – exposed for debug panel
 */
export const useLocation = (selectedLanguage) => {
    const { i18n } = useTranslation();

    const [currentLocation, setCurrentLocation] = useState('Detecting location...');
    const [isLocationLoading, setIsLocationLoading] = useState(true);
    const [locationError, setLocationError] = useState(null);
    const [locationRetryCount, setLocationRetryCount] = useState(0);
    const [locationDebugInfo, setLocationDebugInfo] = useState([]);
    const [showLocationDebug, setShowLocationDebug] = useState(false);

    // Debug logger – keeps last 10 entries
    const addDebugLog = useCallback((message, data = null) => {
        if (!import.meta.env.DEV) return; // no-op in production
        const timestamp = new Date().toLocaleTimeString();
        const entry = { timestamp, message, data: data ? JSON.stringify(data, null, 2) : null };
        setLocationDebugInfo(prev => [...prev.slice(-9), entry]);
        console.log(`🔍 [${timestamp}] ${message}`, data || '');
    }, []);

    // Stable refresh callback
    const refresh = useCallback(() => {
        serviceForceRefresh(
            selectedLanguage,
            setCurrentLocation,
            setIsLocationLoading,
            setLocationError,
            setLocationRetryCount,
            addDebugLog
        );
    }, [selectedLanguage, addDebugLog]);

    // Initial detection on mount
    useEffect(() => {
        detectUserLocation(
            selectedLanguage,
            setCurrentLocation,
            setIsLocationLoading,
            setLocationError,
            setLocationRetryCount,
            addDebugLog
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Re-detect when language changes
    useEffect(() => {
        if (selectedLanguage !== i18n.language) {
            detectUserLocation(
                selectedLanguage,
                setCurrentLocation,
                setIsLocationLoading,
                setLocationError,
                setLocationRetryCount,
                addDebugLog
            );
        }
    }, [selectedLanguage, i18n.language, addDebugLog]);

    // Ctrl+Shift+L toggles the debug panel (dev only)
    useEffect(() => {
        if (!import.meta.env.DEV) return;
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'L') {
                e.preventDefault();
                setShowLocationDebug(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return {
        currentLocation,
        isLocationLoading,
        locationError,
        locationRetryCount,
        locationDebugInfo,
        showLocationDebug,
        setShowLocationDebug,
        setLocationDebugInfo,
        refresh,
        addDebugLog,
    };
};