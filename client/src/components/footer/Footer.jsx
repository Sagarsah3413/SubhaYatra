import { Link, NavLink, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { FaFacebook, FaInstagram, FaCloudSun, FaDollarSign, FaMapMarkerAlt, FaThermometerHalf } from "react-icons/fa";
import axios from "axios";
import { fetchWeatherData } from "../../services/weatherService";
import { fetchCurrencyData, getCurrencySymbol } from "../../services/currencyService";

export default function Footer() {
  const location = useLocation();
  const { t } = useTranslation();
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState(null);
  const [weather, setWeather] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [currencyLoading, setCurrencyLoading] = useState(true);

  const aboutText = t('footer.companyDescription');

  // Refs & visibility state for reveal animations
  const aboutRef = useRef(null);
  const [aboutVisible, setAboutVisible] = useState(false);

  // Fetch weather data for Kathmandu
  useEffect(() => {
    const loadWeather = async () => {
      setWeatherLoading(true);
      try {
        const weatherData = await fetchWeatherData();
        setWeather(weatherData);
      } catch (error) {
        console.error('Weather fetch error:', error);
      } finally {
        setWeatherLoading(false);
      }
    };

    loadWeather();
    // Update weather every 10 minutes
    const weatherInterval = setInterval(loadWeather, 600000);
    return () => clearInterval(weatherInterval);
  }, []);

  // Fetch currency exchange rates
  useEffect(() => {
    const loadCurrency = async () => {
      setCurrencyLoading(true);
      try {
        const currencyData = await fetchCurrencyData();
        setCurrency(currencyData);
      } catch (error) {
        console.error('Currency fetch error:', error);
      } finally {
        setCurrencyLoading(false);
      }
    };

    loadCurrency();
    // Update currency every 30 minutes
    const currencyInterval = setInterval(loadCurrency, 1800000);
    return () => clearInterval(currencyInterval);
  }, []);

  useEffect(() => {
    const obsOptions = { threshold: 0.2 };
    const aboutEl = aboutRef.current;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.target === aboutEl && e.isIntersecting) setAboutVisible(true);
      });
    }, obsOptions);

    if (aboutEl) obs.observe(aboutEl);

    return () => obs.disconnect();
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (email) {
      try {
        const response = await axios.post('http://localhost:8000/users/subscribe', { email });
        
        // Show professional success notification
        setNotification({
          type: 'success',
          title: 'Subscription Confirmed',
          message: 'Welcome to Roamio Wanderly! Your subscription is now active.',
          details: `Thank you for joining our community of travelers. You'll receive curated Nepal travel insights, exclusive destination guides, and expert recommendations delivered to your inbox.`,
          timestamp: new Date().toLocaleTimeString()
        });
        
        setEmail("");
        
        // Auto-hide notification after 8 seconds
        setTimeout(() => {
          setNotification(null);
        }, 8000);
        
      } catch (error) {
        // Show professional error notification
        setNotification({
          type: 'error',
          title: 'Subscription Unsuccessful',
          message: 'We encountered an issue processing your subscription.',
          details: error.response?.data?.message || 'Please verify your email address and try again. If the issue persists, our support team is here to assist you.',
          timestamp: new Date().toLocaleTimeString()
        });
        
        console.error('Subscription error:', error);
        
        // Auto-hide error notification after 6 seconds
        setTimeout(() => {
          setNotification(null);
        }, 6000);
      }
    } else {
      // Show validation notification
      setNotification({
        type: 'warning',
        title: 'Email Address Required',
        message: 'Please provide your email address to continue.',
        details: 'Enter a valid email address to subscribe to our newsletter and receive exclusive travel content and updates.',
        timestamp: new Date().toLocaleTimeString()
      });
      
      // Auto-hide validation notification after 4 seconds
      setTimeout(() => {
        setNotification(null);
      }, 4000);
    }
  };

  return (
    <footer className="bg-gradient-to-b from-slate-900/95 via-slate-800/95 to-slate-900/95 text-white mt-20 relative backdrop-blur-sm">
      
      {/* Ultra-Professional Notification System */}
      {notification && (
        <div className="fixed top-6 right-6 z-[9999] max-w-md w-full">
          <div className={`
            relative overflow-hidden rounded-2xl backdrop-blur-2xl border shadow-2xl transform transition-all duration-700 ease-out
            ${notification.type === 'success' 
              ? 'bg-gradient-to-br from-emerald-50/95 via-teal-50/95 to-cyan-50/95 border-emerald-200/50 shadow-emerald-500/20' 
              : notification.type === 'error'
              ? 'bg-gradient-to-br from-red-50/95 via-rose-50/95 to-pink-50/95 border-red-200/50 shadow-red-500/20'
              : 'bg-gradient-to-br from-amber-50/95 via-yellow-50/95 to-orange-50/95 border-amber-200/50 shadow-amber-500/20'
            }
            animate-in slide-in-from-right-full fade-in duration-700
          `}>
            
            {/* Premium Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent pointer-events-none"></div>
            <div className={`
              absolute top-0 left-0 right-0 h-1 
              ${notification.type === 'success' 
                ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500' 
                : notification.type === 'error'
                ? 'bg-gradient-to-r from-red-500 via-rose-500 to-pink-500'
                : 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500'
              }
            `}></div>
            
            {/* Content Container */}
            <div className="relative p-6">
              
              {/* Header Section */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {/* Status Icon */}
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-xl shadow-lg
                    ${notification.type === 'success' 
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white' 
                      : notification.type === 'error'
                      ? 'bg-gradient-to-br from-red-500 to-rose-600 text-white'
                      : 'bg-gradient-to-br from-amber-500 to-orange-600 text-white'
                    }
                  `}>
                    {notification.type === 'success' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {notification.type === 'error' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                    {notification.type === 'warning' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Title and Timestamp */}
                  <div>
                    <h3 className={`
                      font-bold text-lg leading-tight
                      ${notification.type === 'success' 
                        ? 'text-emerald-900' 
                        : notification.type === 'error'
                        ? 'text-red-900'
                        : 'text-amber-900'
                      }
                    `}>
                      {notification.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-600 mt-0.5">
                      {notification.timestamp}
                    </p>
                  </div>
                </div>
                
                {/* Close Button */}
                <button
                  onClick={() => setNotification(null)}
                  className={`
                    group flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95
                    ${notification.type === 'success' 
                      ? 'hover:bg-emerald-100 text-emerald-600 hover:text-emerald-800' 
                      : notification.type === 'error'
                      ? 'hover:bg-red-100 text-red-600 hover:text-red-800'
                      : 'hover:bg-amber-100 text-amber-600 hover:text-amber-800'
                    }
                  `}
                  aria-label="Close notification"
                >
                  <svg className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Message Section */}
              <div className="space-y-3">
                <p className={`
                  font-semibold text-base leading-relaxed
                  ${notification.type === 'success' 
                    ? 'text-emerald-800' 
                    : notification.type === 'error'
                    ? 'text-red-800'
                    : 'text-amber-800'
                  }
                `}>
                  {notification.message}
                </p>
                
                <p className="text-sm leading-relaxed text-slate-700">
                  {notification.details}
                </p>
              </div>
              
              {/* Action Section for Success */}
              {notification.type === 'success' && (
                <div className="mt-4 pt-4 border-t border-emerald-200/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-emerald-700">
                        Subscription Active
                      </span>
                    </div>
                    <button
                      onClick={() => setNotification(null)}
                      className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      Got it!
                    </button>
                  </div>
                </div>
              )}
              
              {/* Progress Bar */}
              <div className={`
                absolute bottom-0 left-0 h-1 rounded-b-2xl transition-all duration-100 ease-linear
                ${notification.type === 'success' 
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-500' 
                  : notification.type === 'error'
                  ? 'bg-gradient-to-r from-red-400 to-rose-500'
                  : 'bg-gradient-to-r from-amber-400 to-orange-500'
                }
              `}
                style={{
                  width: notification.type === 'success' ? '100%' : notification.type === 'error' ? '100%' : '100%',
                  animation: `shrink ${notification.type === 'success' ? '8s' : notification.type === 'error' ? '6s' : '4s'} linear forwards`
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Smart Professional Background */}
      <div className="absolute inset-0 opacity-4">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 50%, rgba(6, 182, 212, 0.06) 0%, transparent 50%),
            radial-gradient(circle at 75% 50%, rgba(16, 185, 129, 0.06) 0%, transparent 50%)
          `,
          backgroundSize: '600px 600px'
        }}></div>
      </div>

      {/* Smart Professional Live Information Bar */}
      <div className="relative bg-slate-800/85 border-b border-slate-600/25 backdrop-blur-md">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-400/15 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row justify-center items-center gap-6">
            
            {/* Smart Weather Widget */}
            <div className="group bg-gradient-to-r from-amber-500/8 to-orange-500/8 border border-amber-400/20 rounded-xl px-4 py-3 backdrop-blur-sm hover:border-amber-400/30 transition-all duration-300 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-transparent rounded-xl pointer-events-none"></div>
              <div className="relative flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-amber-500/20 rounded-lg border border-amber-400/25">
                    <FaCloudSun className="text-amber-400 text-lg" />
                  </div>
                  <span className="text-sm font-black text-amber-300 tracking-wide">{t('footer.liveWeather')}</span>
                </div>
                {weatherLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-amber-400 border-t-transparent"></div>
                    <span className="text-xs text-gray-300 font-medium">{t('footer.loading')}</span>
                  </div>
                ) : weather ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center space-x-1 bg-slate-700/60 px-2 py-1 rounded-md border border-slate-600/30">
                      <FaMapMarkerAlt className="text-teal-400 text-xs" />
                      <span className="text-xs text-gray-200 font-medium tracking-wide">{weather.location}</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-slate-700/60 px-2 py-1 rounded-md border border-slate-600/30">
                      <FaThermometerHalf className="text-red-400 text-xs" />
                      <span className="text-sm font-bold text-white tracking-wide">{weather.temperature}°C</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-slate-700/60 px-2 py-1 rounded-md border border-slate-600/30">
                      <span className="text-xs text-gray-200 font-medium">{weather.condition}</span>
                      <span className="text-lg">{weather.icon}</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400 font-medium">{t('footer.weatherUnavailable')}</span>
                )}
              </div>
            </div>

            {/* Smart Currency Widget */}
            <div className="group bg-gradient-to-r from-emerald-500/8 to-teal-500/8 border border-emerald-400/20 rounded-xl px-4 py-3 backdrop-blur-sm hover:border-emerald-400/30 transition-all duration-300 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-transparent rounded-xl pointer-events-none"></div>
              <div className="relative flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-400/25">
                    <FaDollarSign className="text-emerald-400 text-lg" />
                  </div>
                  <span className="text-sm font-black text-emerald-300 tracking-wide">{t('footer.exchangeRates')}</span>
                </div>
                {currencyLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-400 border-t-transparent"></div>
                    <span className="text-xs text-gray-300 font-medium">{t('footer.loadingRates')}</span>
                  </div>
                ) : currency ? (
                  <div className="flex flex-col lg:flex-row items-center gap-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-gray-300 font-medium tracking-wide">1 NPR =</span>
                      <span className="bg-slate-700/60 px-2 py-1 rounded text-white font-bold border border-slate-600/30">{getCurrencySymbol('USD')}{currency.rates.USD}</span>
                      <span className="bg-slate-700/60 px-2 py-1 rounded text-white font-bold border border-slate-600/30">{getCurrencySymbol('EUR')}{currency.rates.EUR}</span>
                      <span className="bg-slate-700/60 px-2 py-1 rounded text-white font-bold border border-slate-600/30">{getCurrencySymbol('GBP')}{currency.rates.GBP}</span>
                      <span className="bg-slate-700/60 px-2 py-1 rounded text-white font-bold border border-slate-600/30">{getCurrencySymbol('INR')}{currency.rates.INR}</span>
                    </div>
                    <span className="text-xs text-gray-400 bg-slate-700/40 px-2 py-1 rounded border border-slate-600/25 font-medium">{t('footer.updated')}: {currency.lastUpdated}</span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400 font-medium">{t('footer.ratesUnavailable')}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Professional Main Footer Content */}
      <div className="relative max-w-7xl mx-auto py-8 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          
          {/* Professional Company Info Container */}
          <div className="lg:col-span-2 group bg-slate-800/50 rounded-xl p-6 border border-slate-600/30 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/4 to-transparent rounded-xl pointer-events-none"></div>
            <div className="relative">
              <div className="flex items-center mb-4 group-hover:scale-[1.02] transition-transform duration-300">
                <div className="p-3 bg-gradient-to-br from-teal-500/20 to-amber-500/20 rounded-xl mr-3 border border-teal-500/25">
                  <span className="text-3xl">🌄</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-black text-white tracking-wide mb-1 animate-fade-in-up text-glow-hover">
                    <span className="text-amber-400 hover:text-amber-300 transition-all duration-500 hover:scale-105 inline-block">Roamio</span> 
                    <span className="text-teal-400 hover:text-teal-300 transition-all duration-500 hover:scale-105 inline-block">Wanderly</span>
                  </h2>
                  <p className="text-xs text-gray-300 font-semibold tracking-wider animate-fade-in-up animation-delay-200 hover:text-white transition-colors duration-300 uppercase">
                    Your Premium Nepal Travel Companion
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-200 leading-relaxed font-semibold tracking-wide animate-fade-in-up animation-delay-400 hover:text-gray-100 transition-all duration-500 hover:translate-x-1">
                  {showFullAbout 
                    ? (aboutText || "Roamio Wanderly is your trusted travel recommendation system. It helps you plan personalized trips and discover destinations across Nepal with AI-powered insights and local expertise.")
                    : `${(aboutText || "Roamio Wanderly is your trusted travel recommendation system. It helps you plan personalized trips and discover destinations across Nepal with AI-powered insights and local expertise.").substring(0, 120)}...`
                  }
                </p>
              </div>
              <div className="mb-4">
                <button
                  className="group/btn inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 text-xs font-black transition-all duration-300 hover:translate-x-1 animate-fade-in-up animation-delay-600 hover:scale-105 tracking-wider uppercase"
                  onClick={() => setShowFullAbout(!showFullAbout)}
                >
                  <span className="tracking-wide">{showFullAbout ? t('footer.showLess') : t('footer.readMore')}</span>
                  <svg className={`w-3 h-3 transition-transform duration-300 ${showFullAbout ? 'rotate-180' : ''} group-hover/btn:scale-110`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              
              {/* Professional Social Links */}
              <div className="flex items-center space-x-4">
                <a
                  href={import.meta.env.VITE_FACEBOOK_URL || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/social p-2 bg-blue-600/20 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-blue-600/30 transition-all duration-300 hover:scale-110 border border-blue-600/30"
                >
                  <FaFacebook className="text-xl" />
                </a>
                <a
                  href={import.meta.env.VITE_INSTAGRAM_URL || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/social p-2 bg-pink-600/20 rounded-lg text-pink-400 hover:text-pink-300 hover:bg-pink-600/30 transition-all duration-300 hover:scale-110 border border-pink-600/30"
                >
                  <FaInstagram className="text-xl" />
                </a>
              </div>
            </div>
          </div>

          {/* Smart Company Links Container */}
          <div className="group bg-slate-800/30 rounded-xl p-6 border border-slate-600/25 backdrop-blur-sm hover:bg-slate-800/40 transition-all duration-300 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/2 to-transparent rounded-xl pointer-events-none"></div>
            <div className="relative">
              <h3 className="text-sm font-black mb-4 flex items-center group-hover:scale-[1.02] transition-transform duration-300">
                <span className="w-2 h-2 bg-gradient-to-r from-teal-400 to-amber-400 rounded-full mr-2"></span>
                <span className="tracking-wide">
                  <span className="text-amber-400 hover:text-amber-300 transition-colors duration-300">Com</span>
                  <span className="text-teal-400 hover:text-teal-300 transition-colors duration-300">pany</span>
                </span>
              </h3>
              <div className="space-y-3">
                <Link to="/about" className={`group/link flex items-center text-sm transition-all duration-300 hover:translate-x-1 ${location.pathname === "/about" ? "text-teal-400" : "text-gray-300 hover:text-white"}`}>
                  <div className="w-1 h-1 bg-current rounded-full mr-2 opacity-60 group-hover/link:opacity-100"></div>
                  <span className="font-semibold tracking-wide">{t('footer.aboutUs')}</span>
                </Link>
                <Link to="/contact" className={`group/link flex items-center text-sm transition-all duration-300 hover:translate-x-1 ${location.pathname === "/contact" ? "text-teal-400" : "text-gray-300 hover:text-white"}`}>
                  <div className="w-1 h-1 bg-current rounded-full mr-2 opacity-60 group-hover/link:opacity-100"></div>
                  <span className="font-semibold tracking-wide">{t('footer.contact')}</span>
                </Link>
              </div>
              
              <h3 className="text-sm font-black mb-4 mt-6 flex items-center group-hover:scale-[1.02] transition-transform duration-300">
                <span className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mr-2"></span>
                <span className="tracking-wide">
                  <span className="text-amber-400 hover:text-amber-300 transition-colors duration-300">Sup</span>
                  <span className="text-teal-400 hover:text-teal-300 transition-colors duration-300">port</span>
                </span>
              </h3>
              <div className="space-y-3">
                <Link to="/help" className={`group/link flex items-center text-sm transition-all duration-300 hover:translate-x-1 ${location.pathname === "/help" ? "text-teal-400" : "text-gray-300 hover:text-white"}`}>
                  <div className="w-1 h-1 bg-current rounded-full mr-2 opacity-60 group-hover/link:opacity-100"></div>
                  <span className="font-semibold tracking-wide">{t('footer.helpCenter')}</span>
                </Link>
                <Link to="/faq" className={`group/link flex items-center text-sm transition-all duration-300 hover:translate-x-1 ${location.pathname === "/faq" ? "text-teal-400" : "text-gray-300 hover:text-white"}`}>
                  <div className="w-1 h-1 bg-current rounded-full mr-2 opacity-60 group-hover/link:opacity-100"></div>
                  <span className="font-semibold tracking-wide">{t('footer.faq')}</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Smart Community & Resources Container */}
          <div className="group bg-slate-800/30 rounded-xl p-6 border border-slate-600/25 backdrop-blur-sm hover:bg-slate-800/40 transition-all duration-300 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/2 to-transparent rounded-xl pointer-events-none"></div>
            <div className="relative">
              <h3 className="text-sm font-black mb-4 flex items-center group-hover:scale-[1.02] transition-transform duration-300">
                <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-2"></span>
                <span className="tracking-wide">
                  <span className="text-amber-400 hover:text-amber-300 transition-colors duration-300">Commu</span>
                  <span className="text-teal-400 hover:text-teal-300 transition-colors duration-300">nity</span>
                </span>
              </h3>
              <div className="space-y-3">
                <NavLink to="/write-review" className={({ isActive }) => `group/link flex items-center text-sm transition-all duration-300 hover:translate-x-1 ${isActive ? "text-teal-400" : "text-gray-300 hover:text-white"}`}>
                  <div className="w-1 h-1 bg-current rounded-full mr-2 opacity-60 group-hover/link:opacity-100"></div>
                  <span className="font-semibold tracking-wide">{t('footer.writeReview')}</span>
                </NavLink>
                <Link to="/add-place" className="group/link flex items-center text-sm text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1">
                  <div className="w-1 h-1 bg-current rounded-full mr-2 opacity-60 group-hover/link:opacity-100"></div>
                  <span className="font-semibold tracking-wide">{t('footer.addPlace')}</span>
                </Link>
                <Link to="/wishlist" className="group/link flex items-center text-sm text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1">
                  <div className="w-1 h-1 bg-current rounded-full mr-2 opacity-60 group-hover/link:opacity-100"></div>
                  <span className="font-semibold tracking-wide">Wishlist</span>
                </Link>
              </div>
              
              <h3 className="text-sm font-black mb-4 mt-6 flex items-center group-hover:scale-[1.02] transition-transform duration-300">
                <span className="w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full mr-2"></span>
                <span className="tracking-wide">
                  <span className="text-amber-400 hover:text-amber-300 transition-colors duration-300">Resour</span>
                  <span className="text-teal-400 hover:text-teal-300 transition-colors duration-300">ces</span>
                </span>
              </h3>
              <div className="space-y-3">
                <Link to="/newsletter-archive" className={`group/link flex items-center text-sm transition-all duration-300 hover:translate-x-1 ${location.pathname === "/newsletter-archive" ? "text-teal-400" : "text-gray-300 hover:text-white"}`}>
                  <div className="w-1 h-1 bg-current rounded-full mr-2 opacity-60 group-hover/link:opacity-100"></div>
                  <span className="font-semibold tracking-wide">{t('footer.newsletter')}</span>
                </Link>
                <Link to="/guide" className="group/link flex items-center text-sm text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1">
                  <div className="w-1 h-1 bg-current rounded-full mr-2 opacity-60 group-hover/link:opacity-100"></div>
                  <span className="font-semibold tracking-wide">Itinerary Planner</span>
                </Link>
                <Link to="/explore-nepal" className="group/link flex items-center text-sm text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1">
                  <div className="w-1 h-1 bg-current rounded-full mr-2 opacity-60 group-hover/link:opacity-100"></div>
                  <span className="font-semibold tracking-wide">Explore Nepal</span>
                </Link>
                <a href="https://www.google.com/maps/place/Nepal?hl=en" target="_blank" rel="noopener noreferrer" className="group/link flex items-center text-sm text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1">
                  <div className="w-1 h-1 bg-current rounded-full mr-2 opacity-60 group-hover/link:opacity-100"></div>
                  <span className="font-semibold tracking-wide">{t('footer.siteMap')}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Smart Newsletter & Legal Container - LARGER */}
          <div className="lg:col-span-2 group bg-gradient-to-br from-slate-800/45 via-slate-700/35 to-slate-800/45 rounded-2xl p-8 border border-slate-600/30 backdrop-blur-sm hover:bg-gradient-to-br hover:from-slate-800/55 hover:via-slate-700/45 hover:to-slate-800/55 transition-all duration-300 relative overflow-hidden">
            {/* Smart Glass Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/4 via-transparent to-white/2 rounded-2xl pointer-events-none"></div>
            
            {/* Smart Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/4 via-transparent to-amber-500/4 pointer-events-none"></div>
            
            {/* Clean Professional Newsletter Section */}
            <div className="relative">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-teal-500/15 rounded-xl mr-4 border border-teal-500/25">
                  <svg className="w-6 h-6 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-wide">
                    <span className="text-amber-400 hover:text-amber-300 transition-all duration-500 hover:scale-105 inline-block">Stay</span>{' '}
                    <span className="text-teal-400 hover:text-teal-300 transition-all duration-500 hover:scale-105 inline-block">Updated</span>
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 font-semibold">Curated travel insights delivered weekly</p>
                </div>
              </div>
              
              {/* Clean Newsletter Form */}
              <form onSubmit={handleSubscribe} className="mb-6">
                <div className="relative">
                  <div className="flex bg-slate-700/60 rounded-xl border border-slate-600/50 overflow-hidden">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('footer.yourEmail')}
                      className="flex-1 px-4 py-3 text-sm bg-transparent text-white placeholder-gray-400 focus:outline-none"
                      required
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold transition-colors duration-200 flex items-center justify-center min-w-[100px]"
                    >
                      <span>Subscribe</span>
                    </button>
                  </div>
                </div>
                
                {/* Clean Trust Indicators */}
                <div className="flex items-center justify-center mt-4 space-x-6 text-xs text-gray-500">
                  <div className="flex items-center space-x-1.5">
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">No spam</span>
                  </div>
                  <div className="w-px h-4 bg-gray-600"></div>
                  <div className="flex items-center space-x-1.5">
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">Secure</span>
                  </div>
                  <div className="w-px h-4 bg-gray-600"></div>
                  <div className="flex items-center space-x-1.5">
                    <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold">Weekly</span>
                  </div>
                </div>
              </form>
            </div>
            
            {/* Smart Legal Section */}
            <div className="relative border-t border-slate-600/30 pt-6">
              <h4 className="text-sm font-semibold mb-4 flex items-center group-hover:scale-[1.02] transition-transform duration-300">
                <svg className="w-4 h-4 text-amber-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 7v11c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V7l-7-5zM10 4.5L15 8v9H5V8l5-3.5z" clipRule="evenodd" />
                </svg>
                <span className="font-black tracking-wide">
                  <span className="text-amber-400 hover:text-amber-300 transition-colors duration-300">Le</span>
                  <span className="text-teal-400 hover:text-teal-300 transition-colors duration-300">gal</span>
                </span>
              </h4>
              <div className="flex flex-wrap gap-3">
                <Link 
                  to="/privacy-policy" 
                  className={`inline-flex items-center px-4 py-2 text-sm rounded-lg border transition-all duration-300 hover:scale-105 backdrop-blur-sm ${
                    location.pathname === "/privacy-policy" 
                      ? "bg-teal-500/20 border-teal-500/40 text-teal-300" 
                      : "bg-slate-700/60 border-slate-600/50 text-gray-300 hover:bg-slate-600/60 hover:border-slate-500/50 hover:text-white"
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium tracking-wide">Privacy Policy</span>
                </Link>
                <Link 
                  to="/terms-of-service" 
                  className={`inline-flex items-center px-4 py-2 text-sm rounded-lg border transition-all duration-300 hover:scale-105 backdrop-blur-sm ${
                    location.pathname === "/terms-of-service" 
                      ? "bg-teal-500/20 border-teal-500/40 text-teal-300" 
                      : "bg-slate-700/60 border-slate-600/50 text-gray-300 hover:bg-slate-600/60 hover:border-slate-500/50 hover:text-white"
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium tracking-wide">Terms of Service</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Professional Bottom Bar */}
      <div className="relative border-t border-slate-600/30 bg-slate-800/60 backdrop-blur-md">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-400/15 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="flex items-center space-x-3">
              <p className="text-xs text-gray-400 font-light tracking-wide">
                © {new Date().getFullYear()} <span className="font-medium text-gray-300">Roamio Wanderly</span>. {t('footer.allRightsReserved')}.
              </p>
              <div className="hidden md:flex items-center space-x-1">
                <div className="w-1 h-1 bg-teal-500/60 rounded-full"></div>
                <div className="w-0.5 h-0.5 bg-emerald-500/60 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-gray-400 font-light">
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span className="tracking-wide">{t('footer.madeWithLove')}</span>
              </div>
              <span className="text-gray-600">•</span>
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="tracking-wide">{t('footer.servingTravelers')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}