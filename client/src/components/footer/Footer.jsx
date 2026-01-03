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
    <footer className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white mt-32">
      {/* Ultra Premium Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-teal-600/20 via-cyan-600/15 to-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-emerald-600/15 via-green-600/10 to-teal-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-600/10 via-pink-600/8 to-rose-600/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Premium Animated Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2306b6d4' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        ></div>
      </div>
      {/* Super Ultra-Professional Live Information Bar */}
      <div className="relative bg-gradient-to-r from-slate-900/95 via-slate-800/90 to-slate-900/95 border-b border-slate-700/30 backdrop-blur-2xl">
        {/* Premium Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/5 via-cyan-600/3 to-blue-600/5"></div>
        
        <div className="relative max-w-7xl mx-auto px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-center items-center gap-8">
            
            {/* Enhanced Weather Widget Container */}
            <div className="group relative bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-yellow-500/15 border-2 border-amber-500/30 rounded-2xl px-6 py-4 backdrop-blur-xl shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 hover:scale-105">
              {/* Premium Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-amber-500/30 to-orange-500/30 rounded-2xl shadow-xl border border-amber-400/20">
                    <FaCloudSun className="text-amber-400 text-2xl drop-shadow-lg" />
                  </div>
                  <div>
                    <span className="text-lg font-bold text-amber-400 drop-shadow-md">{t('footer.liveWeather')}</span>
                    <div className="text-xs text-amber-300/80 font-medium">Real-time updates</div>
                  </div>
                </div>
                {weatherLoading ? (
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-6 w-6 border-3 border-amber-400 border-t-transparent shadow-lg"></div>
                      <div className="absolute inset-0 animate-ping rounded-full h-6 w-6 border border-amber-400/50"></div>
                    </div>
                    <span className="text-sm text-gray-300 font-medium">{t('footer.loading')}</span>
                  </div>
                ) : weather ? (
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center space-x-2 bg-gradient-to-r from-slate-800/80 to-slate-700/80 px-4 py-2 rounded-xl border border-slate-600/50 shadow-lg backdrop-blur-sm">
                      <FaMapMarkerAlt className="text-teal-400 text-sm drop-shadow-sm" />
                      <span className="text-sm text-gray-200 font-semibold">{weather.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-gradient-to-r from-slate-800/80 to-slate-700/80 px-4 py-2 rounded-xl border border-slate-600/50 shadow-lg backdrop-blur-sm">
                      <FaThermometerHalf className="text-red-400 text-sm drop-shadow-sm" />
                      <span className="text-lg font-black text-white drop-shadow-md">{weather.temperature}°C</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-gradient-to-r from-slate-800/80 to-slate-700/80 px-4 py-2 rounded-xl border border-slate-600/50 shadow-lg backdrop-blur-sm">
                      <span className="text-sm text-gray-200 font-medium">{weather.condition}</span>
                      <span className="text-2xl drop-shadow-lg">{weather.icon}</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400 font-medium">{t('footer.weatherUnavailable')}</span>
                )}
              </div>
            </div>

            {/* Enhanced Currency Widget Container */}
            <div className="group relative bg-gradient-to-br from-green-500/15 via-emerald-500/10 to-teal-500/15 border-2 border-green-500/30 rounded-2xl px-6 py-4 backdrop-blur-xl shadow-2xl hover:shadow-green-500/20 transition-all duration-500 hover:scale-105">
              {/* Premium Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-2xl shadow-xl border border-green-400/20">
                    <FaDollarSign className="text-green-400 text-2xl drop-shadow-lg" />
                  </div>
                  <div>
                    <span className="text-lg font-bold text-green-400 drop-shadow-md">{t('footer.exchangeRates')}</span>
                    <div className="text-xs text-green-300/80 font-medium">Live rates</div>
                  </div>
                </div>
                {currencyLoading ? (
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-6 w-6 border-3 border-green-400 border-t-transparent shadow-lg"></div>
                      <div className="absolute inset-0 animate-ping rounded-full h-6 w-6 border border-green-400/50"></div>
                    </div>
                    <span className="text-sm text-gray-300 font-medium">{t('footer.loadingRates')}</span>
                  </div>
                ) : currency ? (
                  <div className="flex flex-col lg:flex-row items-center gap-4">
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="text-gray-300 font-semibold">1 NPR =</span>
                      <span className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 px-3 py-2 rounded-lg text-white font-bold border border-slate-600/50 shadow-lg backdrop-blur-sm">{getCurrencySymbol('USD')}{currency.rates.USD}</span>
                      <span className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 px-3 py-2 rounded-lg text-white font-bold border border-slate-600/50 shadow-lg backdrop-blur-sm">{getCurrencySymbol('EUR')}{currency.rates.EUR}</span>
                      <span className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 px-3 py-2 rounded-lg text-white font-bold border border-slate-600/50 shadow-lg backdrop-blur-sm">{getCurrencySymbol('GBP')}{currency.rates.GBP}</span>
                      <span className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 px-3 py-2 rounded-lg text-white font-bold border border-slate-600/50 shadow-lg backdrop-blur-sm">{getCurrencySymbol('INR')}{currency.rates.INR}</span>
                    </div>
                    <span className="text-xs text-gray-400 bg-gradient-to-r from-slate-800/60 to-slate-700/60 px-3 py-2 rounded-lg border border-slate-600/30 backdrop-blur-sm">{t('footer.updated')}: {currency.lastUpdated}</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400 font-medium">{t('footer.ratesUnavailable')}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Super Ultra-Professional Main Footer Content */}
      <div className="relative max-w-7xl mx-auto py-16 px-8">
        {/* Floating Elements */}
        <div className="absolute top-8 left-8 w-32 h-32 bg-gradient-to-br from-teal-500/10 to-cyan-500/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-8 right-8 w-24 h-24 bg-gradient-to-br from-purple-500/8 to-pink-500/5 rounded-full blur-xl animate-pulse delay-1000"></div>
        
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Ultra-Premium Company Info Container */}
          <div className="lg:col-span-2 group relative">
            {/* Premium Background with Multiple Layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/60 via-slate-700/40 to-slate-800/60 rounded-3xl backdrop-blur-2xl border border-slate-600/40 shadow-2xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-amber-500/5 rounded-3xl"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/20 via-cyan-500/15 to-blue-500/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            
            <div className="relative p-8">
              {/* Ultra-Premium Logo Section */}
              <div className="flex items-center mb-6 group/logo">
                <div className="relative mr-4">
                  {/* Multi-layered Icon Container */}
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/30 to-amber-500/30 rounded-2xl blur-md animate-pulse"></div>
                  <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-700/80 to-slate-600/80 rounded-2xl border-2 border-teal-500/40 shadow-2xl backdrop-blur-xl">
                    <span className="text-4xl drop-shadow-2xl transform group-hover/logo:scale-110 transition-transform duration-500">🌄</span>
                    {/* Floating Sparkles */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full animate-ping opacity-75"></div>
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full animate-pulse delay-500"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-black bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
                    Roamio Wanderly
                  </h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-pulse"></div>
                    <p className="text-sm font-semibold text-gray-300">Your Nepal Travel Companion</p>
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-amber-400 rounded-full animate-pulse"></div>
                      <div className="w-1 h-1 bg-teal-400 rounded-full animate-pulse delay-200"></div>
                      <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-400"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced About Text with Premium Styling */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-700/20 to-slate-600/20 rounded-2xl backdrop-blur-sm"></div>
                <div className="relative p-6 rounded-2xl border border-slate-600/30">
                  <p ref={aboutRef} className={`text-sm text-gray-200 leading-relaxed font-medium transition-all duration-700 ${aboutVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
                    {showFullAbout ? aboutText : `${aboutText.substring(0, 120)}...`}
                  </p>
                  <button
                    className="mt-3 inline-flex items-center space-x-2 text-teal-400 text-sm font-semibold hover:text-teal-300 transition-all duration-300 group/btn"
                    onClick={() => setShowFullAbout(!showFullAbout)}
                  >
                    <span>{showFullAbout ? t('footer.showLess') : t('footer.readMore')}</span>
                    <svg className={`w-4 h-4 transform transition-transform duration-300 ${showFullAbout ? 'rotate-180' : ''} group-hover/btn:translate-x-1`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Ultra-Premium Social Links */}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-semibold text-gray-300 mr-2">Connect:</span>
                <a
                  href={import.meta.env.VITE_FACEBOOK_URL || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/social relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-blue-600/30 rounded-2xl blur-md opacity-0 group-hover/social:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600/20 to-blue-700/30 rounded-2xl border border-blue-500/40 text-blue-400 hover:text-blue-300 hover:border-blue-400/60 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-blue-500/25">
                    <FaFacebook className="text-xl" />
                  </div>
                </a>
                <a
                  href={import.meta.env.VITE_INSTAGRAM_URL || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/social relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 to-purple-600/30 rounded-2xl blur-md opacity-0 group-hover/social:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-pink-600/20 to-purple-700/30 rounded-2xl border border-pink-500/40 text-pink-400 hover:text-pink-300 hover:border-pink-400/60 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-pink-500/25">
                    <FaInstagram className="text-xl" />
                  </div>
                </a>
                

              </div>
            </div>
          </div>

          {/* Ultra-Premium Company Links Container */}
          <div className="group relative">
            {/* Premium Background Layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 via-slate-700/30 to-slate-800/50 rounded-3xl backdrop-blur-xl border border-slate-600/40 shadow-xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 rounded-3xl"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-cyan-500/15 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            
            <div className="relative p-8">
              {/* Enhanced Company Section */}
              <div className="mb-8">
                <h3 className="text-lg font-black mb-6 bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent flex items-center">
                  <div className="relative mr-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full animate-ping opacity-50"></div>
                  </div>
                  {t('footer.company')}
                </h3>
                <div className="space-y-4">
                  <Link 
                    to="/about" 
                    className={`group/link flex items-center space-x-3 p-3 rounded-2xl transition-all duration-300 hover:bg-slate-700/30 hover:backdrop-blur-sm border border-transparent hover:border-slate-600/30 ${location.pathname === "/about" ? "bg-teal-500/10 border-teal-500/30 text-teal-300" : "text-gray-300 hover:text-white"}`}
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-slate-700/50 to-slate-600/50 rounded-xl border border-slate-600/40 group-hover/link:border-teal-500/40 transition-all duration-300">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-semibold group-hover/link:translate-x-1 transform transition-transform duration-300">{t('footer.aboutUs')}</span>
                    <svg className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transform translate-x-0 group-hover/link:translate-x-1 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                  <Link 
                    to="/contact" 
                    className={`group/link flex items-center space-x-3 p-3 rounded-2xl transition-all duration-300 hover:bg-slate-700/30 hover:backdrop-blur-sm border border-transparent hover:border-slate-600/30 ${location.pathname === "/contact" ? "bg-teal-500/10 border-teal-500/30 text-teal-300" : "text-gray-300 hover:text-white"}`}
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-slate-700/50 to-slate-600/50 rounded-xl border border-slate-600/40 group-hover/link:border-teal-500/40 transition-all duration-300">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <span className="font-semibold group-hover/link:translate-x-1 transform transition-transform duration-300">{t('footer.contact')}</span>
                    <svg className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transform translate-x-0 group-hover/link:translate-x-1 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
              
              {/* Enhanced Support Section */}
              <div>
                <h3 className="text-lg font-black mb-6 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent flex items-center">
                  <div className="relative mr-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full animate-ping opacity-50"></div>
                  </div>
                  {t('footer.support')}
                </h3>
                <div className="space-y-4">
                  <Link 
                    to="/help" 
                    className={`group/link flex items-center space-x-3 p-3 rounded-2xl transition-all duration-300 hover:bg-slate-700/30 hover:backdrop-blur-sm border border-transparent hover:border-slate-600/30 ${location.pathname === "/help" ? "bg-amber-500/10 border-amber-500/30 text-amber-300" : "text-gray-300 hover:text-white"}`}
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-slate-700/50 to-slate-600/50 rounded-xl border border-slate-600/40 group-hover/link:border-amber-500/40 transition-all duration-300">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-semibold group-hover/link:translate-x-1 transform transition-transform duration-300">{t('footer.helpCenter')}</span>
                    <svg className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transform translate-x-0 group-hover/link:translate-x-1 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                  <Link 
                    to="/faq" 
                    className={`group/link flex items-center space-x-3 p-3 rounded-2xl transition-all duration-300 hover:bg-slate-700/30 hover:backdrop-blur-sm border border-transparent hover:border-slate-600/30 ${location.pathname === "/faq" ? "bg-amber-500/10 border-amber-500/30 text-amber-300" : "text-gray-300 hover:text-white"}`}
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-slate-700/50 to-slate-600/50 rounded-xl border border-slate-600/40 group-hover/link:border-amber-500/40 transition-all duration-300">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-semibold group-hover/link:translate-x-1 transform transition-transform duration-300">{t('footer.faq')}</span>
                    <svg className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transform translate-x-0 group-hover/link:translate-x-1 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Ultra-Premium Community & Resources Container */}
          <div className="group relative">
            {/* Premium Background Layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 via-slate-700/30 to-slate-800/50 rounded-3xl backdrop-blur-xl border border-slate-600/40 shadow-xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 rounded-3xl"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/15 via-pink-500/10 to-rose-500/15 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            
            <div className="relative p-8">
              {/* Enhanced Community Section */}
              <div className="mb-8">
                <h3 className="text-lg font-black mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center">
                  <div className="relative mr-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-ping opacity-50"></div>
                  </div>
                  {t('footer.community')}
                </h3>
                <div className="space-y-4">
                  <NavLink 
                    to="/write-review" 
                    className={({ isActive }) => `group/link flex items-center space-x-3 p-3 rounded-2xl transition-all duration-300 hover:bg-slate-700/30 hover:backdrop-blur-sm border border-transparent hover:border-slate-600/30 ${isActive ? "bg-purple-500/10 border-purple-500/30 text-purple-300" : "text-gray-300 hover:text-white"}`}
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-slate-700/50 to-slate-600/50 rounded-xl border border-slate-600/40 group-hover/link:border-purple-500/40 transition-all duration-300">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <span className="font-semibold group-hover/link:translate-x-1 transform transition-transform duration-300">{t('footer.writeReview')}</span>
                    <svg className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transform translate-x-0 group-hover/link:translate-x-1 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </NavLink>
                  <Link 
                    to="/add-place" 
                    className="group/link flex items-center space-x-3 p-3 rounded-2xl transition-all duration-300 hover:bg-slate-700/30 hover:backdrop-blur-sm border border-transparent hover:border-slate-600/30 text-gray-300 hover:text-white"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-slate-700/50 to-slate-600/50 rounded-xl border border-slate-600/40 group-hover/link:border-purple-500/40 transition-all duration-300">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-semibold group-hover/link:translate-x-1 transform transition-transform duration-300">{t('footer.addPlace')}</span>
                    <svg className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transform translate-x-0 group-hover/link:translate-x-1 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
              
              {/* Enhanced Resources Section */}
              <div>
                <h3 className="text-lg font-black mb-6 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent flex items-center">
                  <div className="relative mr-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full animate-ping opacity-50"></div>
                  </div>
                  {t('footer.resources')}
                </h3>
                <div className="space-y-4">
                  <Link 
                    to="/newsletter-archive" 
                    className={`group/link flex items-center space-x-3 p-3 rounded-2xl transition-all duration-300 hover:bg-slate-700/30 hover:backdrop-blur-sm border border-transparent hover:border-slate-600/30 ${location.pathname === "/newsletter-archive" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "text-gray-300 hover:text-white"}`}
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-slate-700/50 to-slate-600/50 rounded-xl border border-slate-600/40 group-hover/link:border-emerald-500/40 transition-all duration-300">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <span className="font-semibold group-hover/link:translate-x-1 transform transition-transform duration-300">{t('footer.newsletter')}</span>
                    <svg className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transform translate-x-0 group-hover/link:translate-x-1 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                  <a 
                    href="https://www.google.com/maps/place/Nepal?hl=en" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="group/link flex items-center space-x-3 p-3 rounded-2xl transition-all duration-300 hover:bg-slate-700/30 hover:backdrop-blur-sm border border-transparent hover:border-slate-600/30 text-gray-300 hover:text-white"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-slate-700/50 to-slate-600/50 rounded-xl border border-slate-600/40 group-hover/link:border-emerald-500/40 transition-all duration-300">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-semibold group-hover/link:translate-x-1 transform transition-transform duration-300">{t('footer.siteMap')}</span>
                    <svg className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transform translate-x-0 group-hover/link:translate-x-1 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Ultra-Premium Newsletter & Legal Container */}
          <div className="group relative">
            {/* Premium Background with Multiple Layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/60 via-slate-700/40 to-slate-800/60 rounded-3xl backdrop-blur-2xl border border-slate-600/40 shadow-2xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/8 via-purple-500/5 to-pink-500/8 rounded-3xl"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/15 to-pink-500/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            
            {/* Floating Particles */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full animate-pulse"></div>
            <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse delay-500"></div>
            <div className="absolute top-1/2 right-8 w-1 h-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full animate-pulse delay-1000"></div>
            
            <div className="relative p-8">
              {/* Ultra-Premium Stay Updated Section */}
              <div className="mb-8">
                <div className="flex items-center mb-6 group/header">
                  <div className="relative mr-4">
                    {/* Multi-layered Icon Container */}
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/30 to-purple-500/30 rounded-2xl blur-md animate-pulse"></div>
                    <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-slate-700/80 to-slate-600/80 rounded-2xl border-2 border-teal-500/40 shadow-2xl backdrop-blur-xl group-hover/header:border-purple-500/40 transition-all duration-500">
                      <svg className="w-6 h-6 text-teal-400 group-hover/header:text-purple-400 transition-colors duration-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      {/* Floating Sparkles */}
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full animate-ping opacity-75"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black bg-gradient-to-r from-teal-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-none">
                      {t('footer.stayUpdated')}
                    </h3>
                    <p className="text-sm text-gray-300 mt-1 font-medium">Get exclusive travel insights & updates</p>
                  </div>
                </div>
                
                {/* Ultra-Premium Newsletter Form */}
                <form onSubmit={handleSubscribe} className="mb-8">
                  <div className="relative group/form">
                    {/* Premium Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 via-purple-500/15 to-pink-500/20 rounded-2xl blur-lg opacity-0 group-hover/form:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative flex bg-gradient-to-r from-slate-700/80 via-slate-600/70 to-slate-700/80 rounded-xl border border-slate-600/50 overflow-hidden backdrop-blur-xl shadow-xl group-hover/form:border-teal-500/40 transition-all duration-500">
                      <div className="flex-1 relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t('footer.yourEmail')}
                          className="w-full px-4 py-2.5 text-xs bg-transparent text-white placeholder-gray-400 focus:outline-none font-medium"
                          required
                        />
                        {/* Input Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-purple-500/5 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none rounded-l-xl"></div>
                      </div>
                      
                      <button
                        type="submit"
                        className="relative px-4 py-2.5 bg-gradient-to-r from-teal-600 via-purple-600 to-pink-600 hover:from-teal-500 hover:via-purple-500 hover:to-pink-500 text-white text-xs font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center space-x-2 shadow-lg hover:shadow-teal-500/25 group/btn"
                      >
                        {/* Button Background Animation */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                        
                        <svg className="w-3 h-3 relative z-10 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span className="relative z-10 hidden sm:inline">Subscribe</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Enhanced Trust Indicators */}
                  <div className="flex items-center justify-center mt-3 space-x-2 text-xs">
                    <div className="flex items-center space-x-1 bg-gradient-to-r from-slate-700/20 to-slate-600/20 px-1.5 py-0.5 rounded border border-slate-600/10 backdrop-blur-sm">
                      <svg className="w-2.5 h-2.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-400 font-medium text-xs">No spam</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-gradient-to-r from-slate-700/20 to-slate-600/20 px-1.5 py-0.5 rounded border border-slate-600/10 backdrop-blur-sm">
                      <svg className="w-2.5 h-2.5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-400 font-medium text-xs">Secure</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-gradient-to-r from-slate-700/20 to-slate-600/20 px-1.5 py-0.5 rounded border border-slate-600/10 backdrop-blur-sm">
                      <svg className="w-2.5 h-2.5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-400 font-medium text-xs">Weekly</span>
                    </div>
                  </div>
                </form>
              </div>
              
              {/* Ultra-Premium Legal Section */}
              <div className="relative border-t border-slate-600/40 pt-6">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
                
                <h4 className="text-lg font-black mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center">
                  <div className="relative mr-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-ping opacity-50"></div>
                  </div>
                  {t('footer.legal')}
                </h4>
                
                <div className="grid grid-cols-1 gap-3">
                  <Link 
                    to="/privacy-policy" 
                    className={`group/legal relative overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                      location.pathname === "/privacy-policy" 
                        ? "bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border-teal-500/50 text-teal-300" 
                        : "bg-gradient-to-r from-slate-700/50 to-slate-600/50 border-slate-600/50 text-gray-300 hover:border-teal-500/40 hover:text-white"
                    }`}
                  >
                    {/* Premium Background Animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 opacity-0 group-hover/legal:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative flex items-center space-x-3 p-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-slate-600/50 to-slate-500/50 rounded-xl border border-slate-500/40 group-hover/legal:border-teal-500/40 transition-all duration-300">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="font-bold flex-1">Privacy Policy</span>
                      <svg className="w-5 h-5 opacity-0 group-hover/legal:opacity-100 transform translate-x-0 group-hover/legal:translate-x-1 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </Link>
                  
                  <Link 
                    to="/terms-of-service" 
                    className={`group/legal relative overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                      location.pathname === "/terms-of-service" 
                        ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/50 text-purple-300" 
                        : "bg-gradient-to-r from-slate-700/50 to-slate-600/50 border-slate-600/50 text-gray-300 hover:border-purple-500/40 hover:text-white"
                    }`}
                  >
                    {/* Premium Background Animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover/legal:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative flex items-center space-x-3 p-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-slate-600/50 to-slate-500/50 rounded-xl border border-slate-500/40 group-hover/legal:border-purple-500/40 transition-all duration-300">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="font-bold flex-1">Terms of Service</span>
                      <svg className="w-5 h-5 opacity-0 group-hover/legal:opacity-100 transform translate-x-0 group-hover/legal:translate-x-1 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ultra-Premium Bottom Bar */}
      <div className="relative border-t border-slate-700/50 bg-gradient-to-r from-slate-900/80 via-slate-800/70 to-slate-900/80 backdrop-blur-2xl">
        {/* Premium Border Gradient */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-2 left-1/4 w-16 h-16 bg-gradient-to-br from-teal-500/5 to-cyan-500/3 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-2 right-1/3 w-12 h-12 bg-gradient-to-br from-purple-500/4 to-pink-500/3 rounded-full blur-lg animate-pulse delay-1000"></div>
        
        <div className="relative max-w-7xl mx-auto px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Enhanced Copyright Section */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl border border-teal-500/30 shadow-lg">
                  <span className="text-lg">©</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-200">
                    {new Date().getFullYear()} Roamio Wanderly
                  </p>
                  <p className="text-xs text-gray-400 font-medium">
                    {t('footer.allRightsReserved')}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Enhanced Brand Message */}
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-3 bg-gradient-to-r from-slate-700/50 to-slate-600/50 px-4 py-2 rounded-xl border border-slate-600/30 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-red-400 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300 font-medium">{t('footer.madeWithLove')}</span>
                </div>
              </div>
              
              <div className="w-px h-6 bg-gradient-to-b from-transparent via-slate-500/50 to-transparent"></div>
              
              <div className="flex items-center space-x-3 bg-gradient-to-r from-slate-700/50 to-slate-600/50 px-4 py-2 rounded-xl border border-slate-600/30 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300 font-medium">{t('footer.servingTravelers')}</span>
                </div>
              </div>
            </div>
            
            {/* Premium Stats Badge */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 px-4 py-2 rounded-xl border border-teal-500/30 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-300 font-bold">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}