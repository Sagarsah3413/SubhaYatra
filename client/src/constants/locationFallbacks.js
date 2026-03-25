// Localized fallback strings when location detection fails
export const LOCATION_FALLBACKS = {
    en: 'Location Unknown',
    ne: 'स्थान अज्ञात',
    hi: 'स्थान अज्ञात',
    zh: '位置未知',
    ja: '場所不明',
    ko: '위치 알 수 없음',
};

export const getLocalizedFallback = (language) =>
    LOCATION_FALLBACKS[language] || LOCATION_FALLBACKS.en;

// Kathmandu neighborhood bounding-box map used as a last-resort fallback
export const KATHMANDU_NEIGHBORHOODS = [
    { name: 'Mahalaxmi', bounds: { minLat: 27.685, maxLat: 27.695, minLon: 85.315, maxLon: 85.325 } },
    { name: 'Thamel', bounds: { minLat: 27.715, maxLat: 27.720, minLon: 85.320, maxLon: 85.328 } },
    { name: 'Kalimati', bounds: { minLat: 27.685, maxLat: 27.692, minLon: 85.318, maxLon: 85.325 } },
    { name: 'Baneshwor', bounds: { minLat: 27.708, maxLat: 27.715, minLon: 85.320, maxLon: 85.328 } },
    { name: 'Basantapur', bounds: { minLat: 27.700, maxLat: 27.705, minLon: 85.305, maxLon: 85.312 } },
    { name: 'Patan', bounds: { minLat: 27.660, maxLat: 27.670, minLon: 85.305, maxLon: 85.315 } },
    { name: 'Bhaktapur', bounds: { minLat: 27.670, maxLat: 27.680, minLon: 85.425, maxLon: 85.435 } },
    { name: 'Kirtipur', bounds: { minLat: 27.645, maxLat: 27.655, minLon: 85.275, maxLon: 85.285 } },
    { name: 'Balaju', bounds: { minLat: 27.725, maxLat: 27.735, minLon: 85.295, maxLon: 85.305 } },
    { name: 'Maharajgunj', bounds: { minLat: 27.735, maxLat: 27.745, minLon: 85.320, maxLon: 85.330 } },
];

export const SUPPORTED_LANGUAGES = [
    { code: 'en', flag: '🇺🇸', name: 'English', nativeName: 'English' },
    { code: 'ne', flag: '🇳🇵', name: 'Nepali', nativeName: 'नेपाली' },
    { code: 'hi', flag: '🇮🇳', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'zh', flag: '🇨🇳', name: 'Chinese', nativeName: '中文' },
    { code: 'ja', flag: '🇯🇵', name: 'Japanese', nativeName: '日本語' },
    { code: 'ko', flag: '🇰🇷', name: 'Korean', nativeName: '한국어' },
];