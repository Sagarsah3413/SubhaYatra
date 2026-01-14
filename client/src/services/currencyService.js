// Optimized Currency Service with caching and error handling
const CURRENCY_API_KEY = import.meta.env.VITE_CURRENCY_API_KEY || 'demo_key';
const CURRENCY_BASE_URL = 'https://v6.exchangerate-api.com/v6';
const FREE_CURRENCY_URL = 'https://api.exchangerate-api.com/v4/latest/NPR';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// In-memory cache
let currencyCache = {
  data: null,
  timestamp: 0
};

// Optimized fallback currency data
const getFallbackCurrency = () => {
  const baseRates = {
    USD: 0.0075,
    EUR: 0.0069,
    GBP: 0.0059,
    INR: 0.63,
    JPY: 1.12,
    AUD: 0.0115,
    CAD: 0.0102,
    CHF: 0.0067
  };
  
  // Add small random fluctuation (±1%)
  const rates = {};
  Object.keys(baseRates).forEach(currency => {
    const fluctuation = (Math.random() - 0.5) * 0.02;
    const newRate = baseRates[currency] * (1 + fluctuation);
    rates[currency] = ['INR', 'JPY'].includes(currency) ? 
      newRate.toFixed(2) : newRate.toFixed(4);
  });
  
  return {
    base: 'NPR',
    rates,
    lastUpdated: new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    source: 'Demo Data'
  };
};

export const fetchCurrencyData = async () => {
  try {
    // Check cache first
    const now = Date.now();
    if (currencyCache.data && (now - currencyCache.timestamp) < CACHE_DURATION) {
      return currencyCache.data;
    }

    // Use fallback for demo
    if (CURRENCY_API_KEY === 'demo_key') {
      const fallbackData = getFallbackCurrency();
      currencyCache = { data: fallbackData, timestamp: now };
      return fallbackData;
    }

    // Fetch with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    let response = await fetch(
      `${CURRENCY_BASE_URL}/${CURRENCY_API_KEY}/latest/NPR`,
      { signal: controller.signal }
    );
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      if (data.result === 'success') {
        const currencyData = {
          base: data.base_code,
          rates: {
            USD: (data.conversion_rates.USD || 0.0075).toFixed(4),
            EUR: (data.conversion_rates.EUR || 0.0069).toFixed(4),
            GBP: (data.conversion_rates.GBP || 0.0059).toFixed(4),
            INR: (data.conversion_rates.INR || 0.63).toFixed(2),
            JPY: (data.conversion_rates.JPY || 1.12).toFixed(2),
            AUD: (data.conversion_rates.AUD || 0.0115).toFixed(4),
            CAD: (data.conversion_rates.CAD || 0.0102).toFixed(4),
            CHF: (data.conversion_rates.CHF || 0.0067).toFixed(4)
          },
          lastUpdated: new Date().toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          source: 'ExchangeRate-API'
        };
        
        currencyCache = { data: currencyData, timestamp: now };
        return currencyData;
      }
    }
    
    // Fallback to free API
    response = await fetch(FREE_CURRENCY_URL);
    if (response.ok) {
      const data = await response.json();
      const currencyData = {
        base: data.base,
        rates: {
          USD: (data.rates.USD || 0.0075).toFixed(4),
          EUR: (data.rates.EUR || 0.0069).toFixed(4),
          GBP: (data.rates.GBP || 0.0059).toFixed(4),
          INR: (data.rates.INR || 0.63).toFixed(2),
          JPY: (data.rates.JPY || 1.12).toFixed(2),
          AUD: (data.rates.AUD || 0.0115).toFixed(4),
          CAD: (data.rates.CAD || 0.0102).toFixed(4),
          CHF: (data.rates.CHF || 0.0067).toFixed(4)
        },
        lastUpdated: new Date().toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        source: 'Free API'
      };
      
      currencyCache = { data: currencyData, timestamp: now };
      return currencyData;
    }
    
    throw new Error('All currency APIs failed');
    
  } catch (error) {
    console.error('Currency fetch error:', error);
    
    // Return cached data if available, otherwise fallback
    if (currencyCache.data) {
      return currencyCache.data;
    }
    
    const fallbackData = getFallbackCurrency();
    currencyCache = { data: fallbackData, timestamp: Date.now() };
    return fallbackData;
  }
};

// Optimized currency symbol mapping
export const getCurrencySymbol = (code) => {
  const symbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
    AUD: 'A$',
    CAD: 'C$',
    CHF: 'Fr',
    NPR: 'Rs'
  };
  return symbols[code] || code;
};