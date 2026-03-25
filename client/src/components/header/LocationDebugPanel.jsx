import React from 'react';

/**
 * Developer-only debug panel for location testing.
 * Automatically stripped in production via import.meta.env.DEV guard in useLocation.
 *
 * Props:
 *   isLocationLoading   {boolean}
 *   currentLocation     {string}
 *   locationError       {string|null}
 *   locationRetryCount  {number}
 *   locationDebugInfo   {Array}
 *   setLocationDebugInfo {Function}
 *   setShowLocationDebug {Function}
 *   selectedLanguage    {string}
 *   forceRefreshLocation {Function}
 *   reverseGeocodeWithMaxAccuracy {Function}
 *   setCurrentLocation  {Function}
 *   addDebugLog         {Function}
 */
const LocationDebugPanel = ({
    isLocationLoading,
    currentLocation,
    locationError,
    locationRetryCount,
    locationDebugInfo,
    setLocationDebugInfo,
    setShowLocationDebug,
    selectedLanguage,
    forceRefreshLocation,
    reverseGeocodeWithMaxAccuracy,
    setCurrentLocation,
    addDebugLog,
}) => {
    const testArea = async (lat, lon, label) => {
        setLocationDebugInfo([]);
        addDebugLog(`Testing ${label}: ${lat}, ${lon}`);
        const result = await reverseGeocodeWithMaxAccuracy(lat, lon, selectedLanguage, 5, addDebugLog);
        setCurrentLocation(`🎯 ${result}`);
    };

    return (
        <div className="fixed top-20 right-4 w-96 max-h-96 bg-black/90 text-green-400 text-xs font-mono p-4 rounded-lg border border-green-500/50 backdrop-blur-xl z-9999 overflow-y-auto">
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-green-500/30">
                <span className="text-green-300 font-bold">🔍 Location Debug Panel</span>
                <button onClick={() => setShowLocationDebug(false)} className="text-red-400 hover:text-red-300">✕</button>
            </div>

            <div className="space-y-2">
                <div className="text-yellow-400"><strong>Status:</strong> {isLocationLoading ? 'Loading...' : 'Complete'}</div>
                <div className="text-cyan-400"><strong>Location:</strong> {currentLocation}</div>
                {locationError && <div className="text-red-400"><strong>Error:</strong> {locationError}</div>}
                <div className="text-purple-400"><strong>Retry Count:</strong> {locationRetryCount}</div>

                {/* Quick tests */}
                <div className="border-t border-green-500/30 pt-2 mt-2">
                    <div className="text-green-300 text-xs mb-1">Quick Tests:</div>
                    <div className="flex gap-1 mb-2 flex-wrap">
                        <button onClick={() => { setLocationDebugInfo([]); forceRefreshLocation(); }} className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700" disabled={isLocationLoading}>🔄 GPS</button>
                        <button onClick={() => setLocationDebugInfo([])} className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700">🗑️ Clear</button>
                    </div>

                    <div className="text-green-300 text-xs mb-1">Test Areas:</div>
                    <div className="flex gap-1 mb-2 flex-wrap">
                        <button onClick={() => testArea(27.6915, 85.3203, 'Mahalaxmi')} className="px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700" disabled={isLocationLoading}>🏠 Mahalaxmi</button>
                        <button onClick={() => testArea(27.7172, 85.3240, 'Thamel')} className="px-2 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700" disabled={isLocationLoading}>🏛️ Thamel</button>
                        <button onClick={() => testArea(27.7021, 85.3077, 'Durbar Sq')} className="px-2 py-1 bg-red-600    text-white rounded text-xs hover:bg-red-700" disabled={isLocationLoading}>🏰 Durbar Sq</button>
                        <button onClick={() => testArea(27.6893, 85.3206, 'Kalimati')} className="px-2 py-1 bg-green-600  text-white rounded text-xs hover:bg-green-700" disabled={isLocationLoading}>🥬 Kalimati</button>
                        <button onClick={() => testArea(27.6648, 85.3077, 'Patan')} className="px-2 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700" disabled={isLocationLoading}>🏛️ Patan</button>
                        <button onClick={() => testArea(27.7103, 85.3222, 'Baneshwor')} className="px-2 py-1 bg-pink-600   text-white rounded text-xs hover:bg-pink-700" disabled={isLocationLoading}>🏢 Baneshwor</button>
                    </div>
                </div>

                {/* Debug log */}
                <div className="border-t border-green-500/30 pt-2 mt-2">
                    <div className="text-green-300 font-bold mb-1">Debug Log:</div>
                    <div className="max-h-32 overflow-y-auto">
                        {locationDebugInfo.length === 0 ? (
                            <div className="text-gray-500 italic">No logs yet.</div>
                        ) : (
                            locationDebugInfo.map((log, idx) => (
                                <div key={idx} className="mb-1 text-xs">
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
    );
};

export default LocationDebugPanel;