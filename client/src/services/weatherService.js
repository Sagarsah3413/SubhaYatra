// Optimized Weather Service with caching and error handling
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'demo_key';
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// In-memory cache
let weatherCache = {
  data: null,
  timestamp: 0
};

// Optimized fallback weather data
const getFallbackWeather = () => {
  const conditions = [
    { condition: 'Sunny', icon: '☀️', temp: 22 },
    { condition: 'Partly Cloudy', icon: '⛅', temp: 19 },
    { condition: 'Clear', icon: '🌤️', temp: 24 }
  ];
  
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  
  return {
    location: 'Kathmandu, Nepal',
    temperature: randomCondition.temp + Math.floor(Math.random() * 6) - 3,
    condition: randomCondition.condition,
    humidity: Math.floor(Math.random() * 30) + 50,
    icon: randomCondition.icon,
    windSpeed: Math.floor(Math.random() * 10) + 5,
    pressure: Math.floor(Math.random() * 20) + 1010,
    lastUpdated: new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  };
};

// Optimized weather icon mapping
const getWeatherIcon = (code) => {
  const iconMap = {
    2: '⛈️', // Thunderstorm
    3: '🌦️', // Drizzle  
    5: '🌧️', // Rain
    6: '❄️', // Snow
    7: '🌫️', // Atmosphere
    800: '☀️', // Clear
    8: '☁️' // Clouds
  };
  
  const category = Math.floor(code / 100);
  return iconMap[category] || iconMap[code] || '🌤️';
};

export const fetchWeatherData = async () => {
  try {
    // Check cache first
    const now = Date.now();
    if (weatherCache.data && (now - weatherCache.timestamp) < CACHE_DURATION) {
      return weatherCache.data;
    }

    // Use fallback for demo
    if (WEATHER_API_KEY === 'demo_key') {
      const fallbackData = getFallbackWeather();
      weatherCache = { data: fallbackData, timestamp: now };
      return fallbackData;
    }

    // Fetch from API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(
      `${WEATHER_BASE_URL}/weather?lat=27.7172&lon=85.3240&appid=${WEATHER_API_KEY}&units=metric`,
      { signal: controller.signal }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    const weatherData = {
      location: `${data.name}, Nepal`,
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].description.replace(/\b\w/g, l => l.toUpperCase()),
      humidity: data.main.humidity,
      icon: getWeatherIcon(data.weather[0].id),
      windSpeed: Math.round((data.wind?.speed || 0) * 3.6),
      pressure: data.main.pressure,
      lastUpdated: new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
    
    // Cache the result
    weatherCache = { data: weatherData, timestamp: now };
    return weatherData;
    
  } catch (error) {
    console.error('Weather fetch error:', error);
    
    // Return cached data if available, otherwise fallback
    if (weatherCache.data) {
      return weatherCache.data;
    }
    
    const fallbackData = getFallbackWeather();
    weatherCache = { data: fallbackData, timestamp: Date.now() };
    return fallbackData;
  }
};