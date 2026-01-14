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
        alert(response.data.message || 'Subscription successful!');
        setEmail("");
      } catch (error) {
        alert('Subscription failed. Please try again.');
        console.error('Subscription error:', error);
      }
    }
  };

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-800 text-white mt-20">
      {/* Live Information Bar */}
      <div className="bg-slate-800/80 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row justify-center items-center gap-6">
            
            {/* Weather Widget Container */}
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl px-4 py-3 backdrop-blur-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-amber-500/20 rounded-lg">
                    <FaCloudSun className="text-amber-400 text-lg" />
                  </div>
                  <span className="text-sm font-semibold text-amber-400">{t('footer.liveWeather')}</span>
                </div>
                {weatherLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-amber-400 border-t-transparent"></div>
                    <span className="text-xs text-gray-300">{t('footer.loading')}</span>
                  </div>
                ) : weather ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center space-x-1 bg-slate-700/50 px-2 py-1 rounded-md">
                      <FaMapMarkerAlt className="text-teal-400 text-xs" />
                      <span className="text-xs text-gray-200 font-medium">{weather.location}</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-slate-700/50 px-2 py-1 rounded-md">
                      <FaThermometerHalf className="text-red-400 text-xs" />
                      <span className="text-sm font-bold text-white">{weather.temperature}°C</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-slate-700/50 px-2 py-1 rounded-md">
                      <span className="text-xs text-gray-200">{weather.condition}</span>
                      <span className="text-lg">{weather.icon}</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">{t('footer.weatherUnavailable')}</span>
                )}
              </div>
            </div>

            {/* Currency Widget Container */}
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl px-4 py-3 backdrop-blur-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <FaDollarSign className="text-green-400 text-lg" />
                  </div>
                  <span className="text-sm font-semibold text-green-400">{t('footer.exchangeRates')}</span>
                </div>
                {currencyLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-400 border-t-transparent"></div>
                    <span className="text-xs text-gray-300">{t('footer.loadingRates')}</span>
                  </div>
                ) : currency ? (
                  <div className="flex flex-col lg:flex-row items-center gap-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-gray-300 font-medium">1 NPR =</span>
                      <span className="bg-slate-700/50 px-2 py-1 rounded text-white font-bold">{getCurrencySymbol('USD')}{currency.rates.USD}</span>
                      <span className="bg-slate-700/50 px-2 py-1 rounded text-white font-bold">{getCurrencySymbol('EUR')}{currency.rates.EUR}</span>
                      <span className="bg-slate-700/50 px-2 py-1 rounded text-white font-bold">{getCurrencySymbol('GBP')}{currency.rates.GBP}</span>
                      <span className="bg-slate-700/50 px-2 py-1 rounded text-white font-bold">{getCurrencySymbol('INR')}{currency.rates.INR}</span>
                    </div>
                    <span className="text-xs text-gray-400 bg-slate-700/30 px-2 py-1 rounded">{t('footer.updated')}: {currency.lastUpdated}</span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">{t('footer.ratesUnavailable')}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content - Separated Containers */}
      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          
          {/* Company Info Container */}
          <div className="lg:col-span-2 bg-slate-800/30 rounded-xl p-6 border border-slate-700/30">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">🌄</span>
              <div>
                <h2 className="text-lg font-bold text-amber-400">Roamio Wanderly</h2>
                <p className="text-xs text-gray-400">Your Nepal Travel Companion</p>
              </div>
            </div>
            <p ref={aboutRef} className={`text-sm text-gray-300 leading-relaxed mb-4 transition-opacity duration-700 ${aboutVisible ? 'opacity-100' : 'opacity-0'}`}>
              {showFullAbout ? aboutText : `${aboutText.substring(0, 120)}...`}
            </p>
            <button
              className="text-amber-400 text-xs hover:underline mb-4 transition-colors duration-200"
              onClick={() => setShowFullAbout(!showFullAbout)}
            >
              {showFullAbout ? t('footer.showLess') : t('footer.readMore')}
            </button>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <a
                href={import.meta.env.VITE_FACEBOOK_URL || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-blue-600/20 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-blue-600/30 transition-all duration-200"
              >
                <FaFacebook className="text-xl" />
              </a>
              <a
                href={import.meta.env.VITE_INSTAGRAM_URL || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-pink-600/20 rounded-lg text-pink-400 hover:text-pink-300 hover:bg-pink-600/30 transition-all duration-200"
              >
                <FaInstagram className="text-xl" />
              </a>
            </div>
          </div>

          {/* Company Links Container */}
          <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/30">
            <h3 className="text-sm font-semibold mb-4 text-amber-400 flex items-center">
              <span className="w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
              {t('footer.company')}
            </h3>
            <div className="space-y-3">
              <Link to="/about" className={`block text-sm hover:text-teal-400 transition-colors duration-200 hover:translate-x-1 transform ${location.pathname === "/about" ? "text-teal-400" : "text-gray-300"}`}>
                {t('footer.aboutUs')}
              </Link>
              <Link to="/contact" className={`block text-sm hover:text-teal-400 transition-colors duration-200 hover:translate-x-1 transform ${location.pathname === "/contact" ? "text-teal-400" : "text-gray-300"}`}>
                {t('footer.contact')}
              </Link>
            </div>
            
            <h3 className="text-sm font-semibold mb-4 mt-6 text-amber-400 flex items-center">
              <span className="w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
              {t('footer.support')}
            </h3>
            <div className="space-y-3">
              <Link to="/help" className={`block text-sm hover:text-teal-400 transition-colors duration-200 hover:translate-x-1 transform ${location.pathname === "/help" ? "text-teal-400" : "text-gray-300"}`}>
                {t('footer.helpCenter')}
              </Link>
              <Link to="/faq" className={`block text-sm hover:text-teal-400 transition-colors duration-200 hover:translate-x-1 transform ${location.pathname === "/faq" ? "text-teal-400" : "text-gray-300"}`}>
                {t('footer.faq')}
              </Link>
            </div>
          </div>

          {/* Community & Resources Container */}
          <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/30">
            <h3 className="text-sm font-semibold mb-4 text-amber-400 flex items-center">
              <span className="w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
              {t('footer.community')}
            </h3>
            <div className="space-y-3">
              <NavLink to="/write-review" className={({ isActive }) => `block text-sm transition-colors duration-200 hover:translate-x-1 transform hover:text-teal-400 ${isActive ? "text-teal-400" : "text-gray-300"}`}>
                {t('footer.writeReview')}
              </NavLink>
              <Link to="/add-place" className="block text-sm text-gray-300 hover:text-teal-400 transition-colors duration-200 hover:translate-x-1 transform">
                {t('footer.addPlace')}
              </Link>
            </div>
            
            <h3 className="text-sm font-semibold mb-4 mt-6 text-amber-400 flex items-center">
              <span className="w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
              {t('footer.resources')}
            </h3>
            <div className="space-y-3">
              <Link to="/newsletter-archive" className={`block text-sm hover:text-teal-400 transition-colors duration-200 hover:translate-x-1 transform ${location.pathname === "/newsletter-archive" ? "text-teal-400" : "text-gray-300"}`}>
                {t('footer.newsletter')}
              </Link>
              <a href="https://www.google.com/maps/place/Nepal?hl=en" target="_blank" rel="noopener noreferrer" className="block text-sm text-gray-300 hover:text-teal-400 transition-colors duration-200 hover:translate-x-1 transform">
                {t('footer.siteMap')}
              </a>
            </div>
          </div>

          {/* Newsletter & Legal Container - Enhanced Compact Design */}
          <div className="bg-gradient-to-br from-slate-800/40 via-slate-700/30 to-slate-800/40 rounded-2xl p-6 border border-slate-600/30 backdrop-blur-sm relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-amber-500/5 pointer-events-none"></div>
            
            {/* Stay Updated Section */}
            <div className="relative">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-teal-500/20 to-amber-500/20 rounded-xl mr-3 border border-teal-500/30">
                  <svg className="w-4 h-4 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-none">{t('footer.stayUpdated')}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Get travel insights & updates</p>
                </div>
              </div>
              
              {/* Compact Newsletter Form */}
              <form onSubmit={handleSubscribe} className="mb-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-amber-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex bg-slate-700/60 rounded-xl border border-slate-600/50 overflow-hidden backdrop-blur-sm">
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
                      className="px-4 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white text-sm font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span className="hidden sm:inline">Go</span>
                    </button>
                  </div>
                </div>
                
                {/* Trust indicators */}
                <div className="flex items-center justify-center mt-3 space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>No spam</span>
                  </div>
                  <div className="w-px h-3 bg-gray-600"></div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span>Secure</span>
                  </div>
                  <div className="w-px h-3 bg-gray-600"></div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-3 h-3 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Weekly</span>
                  </div>
                </div>
              </form>
            </div>
            
            {/* Compact Legal Section */}
            <div className="relative border-t border-slate-600/30 pt-4">
              <h4 className="text-xs font-semibold mb-3 text-gray-300 flex items-center">
                <svg className="w-3 h-3 text-amber-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 7v11c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V7l-7-5zM10 4.5L15 8v9H5V8l5-3.5z" clipRule="evenodd" />
                </svg>
                {t('footer.legal')}
              </h4>
              <div className="flex flex-wrap gap-2">
                <Link 
                  to="/privacy-policy" 
                  className={`inline-flex items-center px-3 py-1.5 text-xs rounded-lg border transition-all duration-200 hover:scale-105 ${
                    location.pathname === "/privacy-policy" 
                      ? "bg-teal-500/20 border-teal-500/40 text-teal-300" 
                      : "bg-slate-700/50 border-slate-600/50 text-gray-300 hover:bg-slate-600/50 hover:border-slate-500/50 hover:text-white"
                  }`}
                >
                  <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Privacy
                </Link>
                <Link 
                  to="/terms-of-service" 
                  className={`inline-flex items-center px-3 py-1.5 text-xs rounded-lg border transition-all duration-200 hover:scale-105 ${
                    location.pathname === "/terms-of-service" 
                      ? "bg-teal-500/20 border-teal-500/40 text-teal-300" 
                      : "bg-slate-700/50 border-slate-600/50 text-gray-300 hover:bg-slate-600/50 hover:border-slate-500/50 hover:text-white"
                  }`}
                >
                  <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                  </svg>
                  Terms
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700/50 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} Roamio Wanderly. {t('footer.allRightsReserved')}.
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <span>{t('footer.madeWithLove')}</span>
              <span>•</span>
              <span>{t('footer.servingTravelers')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}