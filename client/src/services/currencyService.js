// Currency Service for fetching real exchange rates
// You can get a free API key from ExchangeRate-API: https://exchangerate-api.com/

const CURRENCY_API_KEY = import.meta.env.VITE_CURRENCY_API_KEY || 'demo_key';
const CURRENCY_BASE_URL = 'https://v6.exchangerate-api.com/v6';

// Alternative free API (no key required, but limited requests)
const FREE_CURRENCY_URL = 'https://api.exchangerate-api.com/v4/latest/NPR';

// Fallback currency data for demo purposes
const getFallbackCurrency = () => {
  // Base rates with some realistic fluctuation
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
  
  // Add small random fluctuation (±2%)
  const rates = {};
  Object.keys(baseRates).forEach(currency => {
    const fluctuation = (Math.random() - 0.5) * 0.04; // ±2%
    const newRate = baseRates[currency] * (1 + fluctuation);
    rates[currency] = currency === 'INR' || currency === 'JPY' ? 
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
    let response;
    let data;
    
    // Try the paid API first if key is available
    if (CURRENCY_API_KEY !== 'demo_key') {
      response = await fetch(`${CURRENCY_BASE_URL}/${CURRENCY_API_KEY}/latest/NPR`);
      if (response.ok) {
        data = await response.json();
        if (data.result === 'success') {
          return {
            base: data.base_code,
            rates: {
              USD: data.conversion_rates.USD?.toFixed(4) || '0.0075',
              EUR: data.conversion_rates.EUR?.toFixed(4) || '0.0069',
              GBP: data.conversion_rates.GBP?.toFixed(4) || '0.0059',
              INR: data.conversion_rates.INR?.toFixed(2) || '0.63',
              JPY: data.conversion_rates.JPY?.toFixed(2) || '1.12',
              AUD: data.conversion_rates.AUD?.toFixed(4) || '0.0115',
              CAD: data.conversion_rates.CAD?.toFixed(4) || '0.0102',
              CHF: data.conversion_rates.CHF?.toFixed(4) || '0.0067'
            },
            lastUpdated: new Date().toLocaleTimeString('en-US', { 
              hour12: false, 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            source: 'ExchangeRate-API'
          };
        }
      }
    }
    
    // Try the free API as fallback
    response = await fetch(FREE_CURRENCY_URL);
    if (response.ok) {
      data = await response.json();
      return {
        base: data.base,
        rates: {
          USD: data.rates.USD?.toFixed(4) || '0.0075',
          EUR: data.rates.EUR?.toFixed(4) || '0.0069',
          GBP: data.rates.GBP?.toFixed(4) || '0.0059',
          INR: data.rates.INR?.toFixed(2) || '0.63',
          JPY: data.rates.JPY?.toFixed(2) || '1.12',
          AUD: data.rates.AUD?.toFixed(4) || '0.0115',
          CAD: data.rates.CAD?.toFixed(4) || '0.0102',
          CHF: data.rates.CHF?.toFixed(4) || '0.0067'
        },
        lastUpdated: new Date().toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        source: 'Free API'
      };
    }
    
    throw new Error('All currency APIs failed');
    
  } catch (error) {
    console.error('Error fetching currency data:', error);
    console.log('Using demo currency data. Get a free API key from ExchangeRate-API for real data.');
    // Return fallback data on error
    return getFallbackCurrency();
  }
};

// Get currency symbol for display
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