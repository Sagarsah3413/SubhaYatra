// Weather Service for fetching real weather data
// You can get a free API key from OpenWeatherMap: https://openweathermap.org/api

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'demo_key';
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Fallback weather data for demo purposes
const getFallbackWeather = () => {
  const conditions = [
    { condition: 'Sunny', icon: '☀️', temp: 22 },
    { condition: 'Partly Cloudy', icon: '⛅', temp: 19 },
    { condition: 'Cloudy', icon: '☁️', temp: 16 },
    { condition: 'Light Rain', icon: '🌦️', temp: 15 },
    { condition: 'Clear', icon: '🌤️', temp: 24 }
  ];
  
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  
  return {
    location: 'Kathmandu, Nepal',
    temperature: randomCondition.temp + Math.floor(Math.random() * 6) - 3, // ±3°C variation
    condition: randomCondition.condition,
    humidity: Math.floor(Math.random() * 30) + 50, // 50-80% range
    icon: randomCondition.icon,
    windSpeed: Math.floor(Math.random() * 10) + 5, // 5-15 km/h
    pressure: Math.floor(Math.random() * 20) + 1010, // 1010-1030 hPa
    lastUpdated: new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  };
};

export const fetchWeatherData = async () => {
  try {
    // If no API key is provided, use fallback data
    if (WEATHER_API_KEY === 'demo_key') {
      console.log('Using demo weather data. Get a free API key from OpenWeatherMap for real data.');
      return getFallbackWeather();
    }

    // Kathmandu coordinates
    const lat = 27.7172;
    const lon = 85.3240;
    
    const response = await fetch(
      `${WEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error('Weather API request failed');
    }
    
    const data = await response.json();
    
    // Map weather condition codes to emojis
    const getWeatherIcon = (code) => {
      if (code >= 200 && code < 300) return '⛈️'; // Thunderstorm
      if (code >= 300 && code < 400) return '🌦️'; // Drizzle
      if (code >= 500 && code < 600) return '🌧️'; // Rain
      if (code >= 600 && code < 700) return '❄️'; // Snow
      if (code >= 700 && code < 800) return '🌫️'; // Atmosphere
      if (code === 800) return '☀️'; // Clear
      if (code > 800) return '☁️'; // Clouds
      return '🌤️'; // Default
    };
    
    return {
      location: `${data.name}, Nepal`,
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].description.replace(/\b\w/g, l => l.toUpperCase()),
      humidity: data.main.humidity,
      icon: getWeatherIcon(data.weather[0].id),
      windSpeed: Math.round(data.wind?.speed * 3.6) || 0, // Convert m/s to km/h
      pressure: data.main.pressure,
      lastUpdated: new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
    
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Return fallback data on error
    return getFallbackWeather();
  }
};