import { useState, useEffect, useCallback, memo, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Header } from "./components/header/Header";
import "./App.css";
import { SignedIn, useUser } from "@clerk/clerk-react";
import SplashScreen from "./pages/SplashScreen";
import { FaSearch, FaHotel, FaUtensils, FaMapMarkedAlt, FaCamera, FaRobot } from "react-icons/fa";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useTranslation } from 'react-i18next';

// Lazy load components for better performance
import { lazy, Suspense } from "react";
import SearchBar from "./pages/SearchBar";
import RecommendationResults from "./pages/RecommendationResults";

const ExploreSection = lazy(() => import("./pages/ExploreSection"));
const FamousSpots = lazy(() => import("./pages/FamousSpots"));
const NaturePlaces = lazy(() => import("./pages/NaturePlaces"));
const Footer = lazy(() => import("./components/footer/Footer"));

// Lazy load page components
const AllPlacesDetail = lazy(() => import("./pages/AllPlacesDetail"));
const AllSpotsDetails = lazy(() => import("./pages/AllSpotsDetail"));
const AllNatureDetail = lazy(() => import("./pages/AllNatureDetail"));
const SearchResultPage = lazy(() => import("./pages/SearchResultPage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const RecommendationPage = lazy(() => import("./pages/RecommendationPage"));
const DetailPage = lazy(() => import("./pages/Detailpage"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const WriteReview = lazy(() => import("./pages/WriteReview"));
const AddPlace = lazy(() => import("./pages/AddPlace"));
const SignUpPage = lazy(() => import("./pages/SignUp"));
const SignInPage = lazy(() => import("./pages/SignIn"));
const Itinerary = lazy(() => import("./pages/Itinerary"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Help = lazy(() => import("./pages/Help"));
const ExploreNepal = lazy(() => import("./pages/ExploreNepal"));
const FAQ = lazy(() => import("./pages/FAQ"));
const NewsletterArchive = lazy(() => import("./pages/NewsletterArchive"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));

// Admin Pages
const Login = lazy(() => import("./pages/admin/Login"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminRoute = lazy(() => import("./pages/admin/AdminRoute"));

// Import the Nepal image and hotel service
import nepalImage from "./assets/nepal.jpg";
import { hotelService } from "./services/hotelService";

// Ultra Professional InspireButton component
const InspireButton = memo(({ isSignedIn, onClick, theme }) => (
  <div className="fixed top-20 right-4 md:top-24 md:right-6 z-50">
    <div className="relative group">
      {/* Premium Background Glow */}
      <div className={`absolute -inset-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 ${
        theme === "dark" 
          ? "bg-gradient-to-r from-teal-600/20 via-emerald-600/15 to-cyan-600/20" 
          : "bg-gradient-to-r from-teal-500/15 via-emerald-500/10 to-cyan-500/15"
      } blur-2xl`} />
      
      <button
        onClick={onClick}
        className={`relative w-16 h-16 md:w-18 md:h-18 rounded-full backdrop-blur-2xl border transition-all duration-500 transform-gpu will-change-transform group-hover:scale-110 ${
          theme === "dark" 
            ? "bg-slate-900/95 border-slate-700/50 hover:border-slate-600/70 shadow-2xl hover:shadow-teal-500/20" 
            : "bg-white/98 border-slate-200/50 hover:border-slate-300/70 shadow-2xl hover:shadow-teal-500/30"
        }`}
        title={isSignedIn ? "Inspire My Journey" : "Sign in for personalized recommendations"}
      >
        {/* Premium Glass Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 dark:from-slate-700/20 dark:via-transparent dark:to-slate-700/10 rounded-full pointer-events-none"></div>
        
        {/* Executive Icon Container */}
        <div className={`absolute inset-3 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${
          theme === "dark" 
            ? "bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-600" 
            : "bg-gradient-to-br from-teal-500 via-emerald-500 to-cyan-500"
        } shadow-xl`}>
          <FaCamera className="text-white text-xl md:text-2xl group-hover:scale-110 transition-transform duration-500 drop-shadow-sm" />
          
          {/* Premium Lock overlay */}
          {!isSignedIn && (
            <div className="absolute inset-0 bg-slate-900/60 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg className="w-5 h-5 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Premium Sparkle */}
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
          <span className="text-white text-sm font-bold drop-shadow-sm">✨</span>
        </div>
        
        {/* Executive Ring Effect */}
        <div className={`absolute inset-0 rounded-full border-2 opacity-0 group-hover:opacity-100 transition-all duration-500 ${
          theme === "dark" 
            ? "border-teal-400/40" 
            : "border-teal-500/40"
        } animate-pulse`}></div>
        
        {/* Premium Shine Effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </button>
      
      {/* Executive Tooltip */}
      <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-4 px-4 py-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 whitespace-nowrap ${
        theme === "dark" 
          ? "bg-slate-900/98 text-white border border-slate-700/50" 
          : "bg-white/98 text-slate-800 border border-slate-200/50"
      } shadow-2xl backdrop-blur-xl`}>
        <span className="text-sm font-semibold tracking-wide">
          {isSignedIn ? "Inspire My Journey" : "Premium Access Required"}
        </span>
        {!isSignedIn && (
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Personalized travel recommendations
          </div>
        )}
        <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 rotate-45 ${
          theme === "dark" ? "bg-slate-900 border-l border-t border-slate-700/50" : "bg-white border-l border-t border-slate-200/50"
        }`}></div>
      </div>
    </div>
  </div>
));

InspireButton.displayName = 'InspireButton';

// Clean CategoryButton component without background
const CategoryButton = memo(({ isActive, onClick, icon: Icon, title, description, gradient, bgGradient, borderColor }) => (
  <button 
    className={`group relative backdrop-blur-xl rounded-2xl p-6 transition-all duration-500 hover:scale-105 transform-gpu border overflow-hidden ${
      isActive 
        ? `border-${borderColor}-400/50 scale-105` 
        : `border-slate-200/40 dark:border-slate-700/40 hover:border-${borderColor}-300/60 dark:hover:border-${borderColor}-600/60`
    }`}
    onClick={onClick}
  >
    <div className="relative z-10 text-center">
      {/* Executive Icon Container */}
      <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:scale-110 group-hover:rotate-1 transition-all duration-500 backdrop-blur-sm`}>
        <Icon className="text-xl text-white drop-shadow-sm" />
      </div>
      
      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2 tracking-wide">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed tracking-wide">{description}</p>
      
      {/* Premium Active Indicator */}
      {isActive && (
        <div className="absolute top-3 right-3 flex items-center gap-1">
          <div className={`w-2 h-2 bg-gradient-to-r from-${borderColor}-500 to-${borderColor === 'teal' ? 'emerald' : borderColor === 'amber' ? 'orange' : borderColor === 'purple' ? 'pink' : 'green'}-500 rounded-full shadow-sm`}></div>
          <div className={`w-1.5 h-1.5 bg-gradient-to-r from-${borderColor === 'teal' ? 'emerald' : borderColor === 'amber' ? 'orange' : borderColor === 'purple' ? 'pink' : 'green'}-500 to-${borderColor}-500 rounded-full shadow-sm animate-pulse`}></div>
        </div>
      )}
      
      {/* Premium Bottom Accent */}
      <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-px bg-gradient-to-r from-transparent via-${borderColor}-400/30 to-transparent transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
    </div>
  </button>
));

CategoryButton.displayName = 'CategoryButton';

// Memoized Header component
const HeaderWithNav = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleHomeClick = useCallback(() => {
    if (location.pathname !== "/") navigate(-1);
  }, [location.pathname, navigate]);
  
  return <Header onHomeClick={handleHomeClick} />;
});

HeaderWithNav.displayName = 'HeaderWithNav';

// Optimized MainApp component
const MainApp = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isSignedIn } = useUser() || { isSignedIn: false };
  const videoRef = useRef(null);

  // Optimized theme state
  const [theme] = useState(() => localStorage.getItem("theme") ?? "dark");
  
  // Optimized splash screen state
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem("splashShown"));
  
  // Optimized message state
  const [message, setMessage] = useState(() => t('homepage.welcome'));
  const [searchPlaceholder, setSearchPlaceholder] = useState(() => t('homepage.searchPlaceholder'));

  // Hotel count state
  const [hotelCount, setHotelCount] = useState(0);

  // Simplified video playback effect
  useEffect(() => {
    const video = videoRef.current;
    if (video && !showSplash) {
      console.log('Setting up homepage video...');
      
      const attemptPlay = async () => {
        try {
          video.muted = true;
          video.volume = 0;
          await video.play();
          console.log('✅ Homepage video playing successfully');
        } catch (error) {
          console.error('❌ Homepage video autoplay failed:', error);
          // Try again after a delay
          setTimeout(() => {
            video.muted = true;
            video.play().catch(e => console.error('Homepage video second attempt failed:', e));
          }, 1000);
        }
      };

      // Try to play when video is ready
      if (video.readyState >= 3) {
        attemptPlay();
      } else {
        video.addEventListener('canplay', attemptPlay, { once: true });
      }
    }
  }, [showSplash]);

  // Memoized handlers
  const handleStart = useCallback(() => {
    setShowSplash(false);
    sessionStorage.setItem("splashShown", "true");
  }, []);

  const handleInspireClick = useCallback(() => {
    if (isSignedIn) {
      navigate("/recommendation");
    } else {
      navigate("/sign-in");
    }
  }, [isSignedIn, navigate]);

  const handleChatClick = useCallback(() => {
    navigate("/chat");
  }, [navigate]);

  // Fetch hotel count
  useEffect(() => {
    const fetchHotelCount = async () => {
      try {
        console.log('Fetching hotel count...');
        const count = await hotelService.getHotelCount();
        console.log('Hotel count received:', count);
        setHotelCount(count);
      } catch (error) {
        console.error('Error fetching hotel count:', error);
        setHotelCount(0);
      }
    };

    fetchHotelCount();
  }, []);

  // Memoized category handlers
  const categoryHandlers = {
    searchAll: useCallback(() => {
      setMessage(t('homepage.welcome'));
      setSearchPlaceholder(t('homepage.searchPlaceholder'));
    }, [t]),
    
    hotels: useCallback(() => {
      setMessage(t('homepage.welcomeMessage'));
      setSearchPlaceholder(t('homepage.searchHotels'));
    }, [t]),
    
    activities: useCallback(() => {
      setMessage(t('homepage.experienceMessage'));
      setSearchPlaceholder(t('homepage.searchActivities'));
    }, [t]),
    
    restaurants: useCallback(() => {
      setMessage(t('homepage.foodMessage'));
      setSearchPlaceholder(t('homepage.searchRestaurants'));
    }, [t])
  };

  // Theme effect
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  if (showSplash) {
    return <SplashScreen onStart={handleStart} />;
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative overflow-hidden">
      {/* Video Background */}
      <div className="fixed inset-0 w-full h-full z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.7)" }}
          onError={(e) => {
            console.error('Homepage video failed to load:', e);
            console.log('Video error details:', e.target.error);
            // Hide video on error and show fallback background
            e.target.style.display = 'none';
          }}
          onLoadStart={() => console.log('Homepage video loading started')}
          onCanPlay={() => console.log('Homepage video can play')}
          onPlay={() => console.log('Homepage video started playing')}
        >
          <source src="/IMG_8851.MP4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Fallback gradient background */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          style={{ zIndex: -1 }}
        ></div>
        
        {/* Video Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/30 to-slate-900/50"></div>
      </div>

      {/* Content Container - Above Video */}
      <div className="relative z-10 flex flex-col min-h-screen">
      {/* Inspire My Trip Logo - Top Right */}
      <InspireButton 
        isSignedIn={isSignedIn} 
        onClick={handleInspireClick} 
        theme={theme} 
      />

      <HeaderWithNav />
      
      {/* Welcome Back Explorer Section - Ultra Professional Tourism Design */}
      <SignedIn>
        <div className="mx-auto mt-20 mb-6 max-w-6xl relative px-4">
          {/* Ultra Professional Container */}
          <div className="relative bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl rounded-3xl border border-slate-200/30 dark:border-slate-700/30 shadow-2xl hover:shadow-3xl transition-all duration-700 overflow-hidden group">
            
            {/* Premium Glass Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-white/20 dark:from-slate-800/40 dark:via-transparent dark:to-slate-800/20 pointer-events-none"></div>
            
            {/* Nepal Background Image - Ultra Subtle */}
            <div 
              className="absolute inset-0 opacity-30 dark:opacity-20 transition-opacity duration-700 group-hover:opacity-40 dark:group-hover:opacity-30"
              style={{
                backgroundImage: `url(${nepalImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                filter: 'brightness(1.3) contrast(0.8) saturate(0.7) blur(0.5px)'
              }}
            />
            
            {/* Professional Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-white/95 dark:from-slate-900/95 dark:via-slate-900/90 dark:to-slate-900/95"></div>
            
            {/* Premium Top Border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/40 to-transparent"></div>
            
            {/* Ultra Professional Content */}
            <div className="relative p-12 md:p-16 text-center z-10">
              
              {/* Executive Header */}
              <div className="mb-10">
                {/* Premium Status Badge */}
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/60 dark:to-slate-700/60 rounded-full px-6 py-3 mb-6 border border-slate-200/50 dark:border-slate-600/50 shadow-lg backdrop-blur-sm">
                  <div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full shadow-sm"></div>
                  <span className="text-slate-700 dark:text-slate-300 font-semibold text-sm tracking-wider uppercase">Premium Experience</span>
                  <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-sm"></div>
                </div>
                
                {/* Executive Welcome Message */}
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
                  <span className="font-extralight">Welcome Back,</span>
                  <br />
                  <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent font-medium">
                    Explorer
                  </span>
                </h2>
                
                {/* Professional Subtitle */}
                <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-light tracking-wide">
                  Curated journeys through the heart of the Himalayas
                </p>
              </div>
              
              {/* Executive Stats Section */}
              <div className="grid grid-cols-3 gap-8 mb-12 max-w-2xl mx-auto">
                <div className="text-center group">
                  <div className="text-3xl md:text-4xl font-light text-teal-600 dark:text-teal-400 mb-2 group-hover:scale-105 transition-transform duration-300">450<span className="text-2xl md:text-3xl">+</span></div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Destinations</div>
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent mx-auto mt-2"></div>
                </div>
                <div className="text-center group border-x border-slate-200/40 dark:border-slate-700/40">
                  <div className="text-3xl md:text-4xl font-light text-emerald-600 dark:text-emerald-400 mb-2 group-hover:scale-105 transition-transform duration-300">500<span className="text-2xl md:text-3xl">+</span></div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Accommodations</div>
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent mx-auto mt-2"></div>
                </div>
                <div className="text-center group">
                  <div className="text-3xl md:text-4xl font-light text-cyan-600 dark:text-cyan-400 mb-2 group-hover:scale-105 transition-transform duration-300">450<span className="text-2xl md:text-3xl">+</span></div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Experiences</div>
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mx-auto mt-2"></div>
                </div>
              </div>
              
              {/* Executive Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                {/* Primary Executive Button */}
                <button 
                  onClick={() => navigate('/explore-nepal')}
                  className="group relative px-10 py-4 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 hover:from-teal-700 hover:via-emerald-700 hover:to-cyan-700 text-white rounded-2xl font-medium text-base transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl flex items-center gap-4 min-w-[220px] justify-center overflow-hidden"
                >
                  {/* Premium Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  {/* Executive Icon */}
                  <div className="relative z-10 p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012-2v-1a2 2 0 012-2h1.945M15 8a3 3 0 11-6 0 3 3 0 016 0zm-3 7h.01M9 5a2 2 0 012-2h.01a2 2 0 012 2H9z" />
                    </svg>
                  </div>
                  
                  <span className="relative z-10 font-medium tracking-wide">Explore Nepal</span>
                  
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Secondary Executive Button */}
                <button 
                  onClick={() => navigate('/guide')}
                  className="group relative px-10 py-4 bg-white/95 dark:bg-slate-800/95 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-2xl font-medium text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-4 border border-slate-200/50 dark:border-slate-600/50 hover:border-slate-300/70 dark:hover:border-slate-500/70 min-w-[220px] justify-center backdrop-blur-sm"
                >
                  <svg className="w-5 h-5 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <span className="tracking-wide">Plan Journey</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Subtle Corner Accents */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-teal-500/5 to-transparent rounded-br-3xl"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-emerald-500/5 to-transparent rounded-tl-3xl"></div>
          </div>
        </div>
      </SignedIn>

      {/* Ultra Professional Adventure Message */}
      <div className="relative mt-8 mb-10 overflow-hidden">
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-slate-50/95 via-white/95 to-slate-50/95 dark:from-slate-800/95 dark:via-slate-900/95 dark:to-slate-800/95 rounded-full px-8 py-4 mb-6 backdrop-blur-xl border border-slate-200/40 dark:border-slate-700/40 shadow-xl">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full shadow-sm"></div>
              <div className="w-1.5 h-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full shadow-sm animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-1 h-1 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full shadow-sm animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
            <span className="text-slate-700 dark:text-slate-300 font-medium text-base tracking-wider">{t('homepage.adventureAwaits')}</span>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full shadow-sm animate-pulse" style={{ animationDelay: '1.5s' }}></div>
              <div className="w-1.5 h-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full shadow-sm animate-pulse" style={{ animationDelay: '2s' }}></div>
              <div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full shadow-sm"></div>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 dark:from-slate-200 dark:via-white dark:to-slate-200 bg-clip-text text-transparent">
              {message}
            </span>
          </h1>
        </div>
      </div>

      {/* Ultra Professional Category Navigation */}
      <div className="relative mb-12 overflow-hidden">
        {/* Premium Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 25% 50%, rgba(6, 182, 212, 0.2) 0%, transparent 60%),
              radial-gradient(circle at 75% 50%, rgba(16, 185, 129, 0.2) 0%, transparent 60%)
            `,
            backgroundSize: '1000px 1000px, 800px 800px'
          }}></div>
        </div>

        <div className="relative z-10 flex flex-wrap justify-center gap-6 max-w-6xl mx-auto px-4">
          
          {/* Search All - Ultra Premium */}
          <CategoryButton
            isActive={message === t('homepage.welcome')}
            onClick={categoryHandlers.searchAll}
            icon={FaSearch}
            title={t('homepage.searchAll')}
            description={t('homepage.everythingNepal')}
            gradient="from-teal-500 to-cyan-600"
            bgGradient="from-white via-teal-50 to-cyan-50 dark:from-slate-800 dark:via-teal-900/20 dark:to-cyan-900/20"
            borderColor="teal"
          />

          {/* Hotels - Ultra Premium */}
          <CategoryButton
            isActive={message === t('homepage.welcomeMessage')}
            onClick={categoryHandlers.hotels}
            icon={FaHotel}
            title={t('homepage.hotels')}
            description={t('homepage.cozyStays')}
            gradient="from-amber-500 to-orange-600"
            bgGradient="from-white via-amber-50 to-orange-50 dark:from-slate-800 dark:via-amber-900/20 dark:to-orange-900/20"
            borderColor="amber"
          />

          {/* Things To Do - Ultra Premium */}
          <CategoryButton
            isActive={message === t('homepage.experienceMessage')}
            onClick={categoryHandlers.activities}
            icon={FaMapMarkedAlt}
            title={t('homepage.thingsToDo')}
            description={t('homepage.excitingExperiences')}
            gradient="from-purple-500 to-pink-600"
            bgGradient="from-white via-purple-50 to-pink-50 dark:from-slate-800 dark:via-purple-900/20 dark:to-pink-900/20"
            borderColor="purple"
          />

          {/* Restaurants - Ultra Premium */}
          <CategoryButton
            isActive={message === t('homepage.foodMessage')}
            onClick={categoryHandlers.restaurants}
            icon={FaUtensils}
            title={t('homepage.restaurants')}
            description={t('homepage.tasteAdventures')}
            gradient="from-emerald-500 to-green-600"
            bgGradient="from-white via-emerald-50 to-green-50 dark:from-slate-800 dark:via-emerald-900/20 dark:to-green-900/20"
            borderColor="emerald"
          />
        </div>
      </div>

      {/* Ultra Premium Search Bar Container */}
      <div className="relative mb-12 overflow-visible">
        {/* Premium Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)
            `,
            backgroundSize: '600px 600px'
          }}></div>
        </div>

        <div className="relative z-10 flex justify-center max-w-4xl mx-auto px-4">
          <div className="w-full bg-gradient-to-r from-white/95 to-gray-50/95 dark:from-slate-800/95 dark:to-slate-700/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border-2 border-gray-200 dark:border-slate-600 overflow-visible">
            <SearchBar placeholder={searchPlaceholder} />
          </div>
        </div>
      </div>

      <Suspense fallback={<div className="flex justify-center items-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div></div>}>
        <ExploreSection />
        <FamousSpots />
        <NaturePlaces />
      </Suspense>

      <Suspense fallback={<div className="flex justify-center items-center py-4"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500"></div></div>}>
        <Footer />
      </Suspense>

      {/* Floating Chatbot Button */}
      <ChatButton onClick={handleChatClick} theme={theme} />
      
      </div>
    </div>
  );
});

MainApp.displayName = 'MainApp';

// Optimized ChatButton component
const ChatButton = memo(({ onClick, theme }) => (
  <div className="fixed bottom-6 right-6 z-50">
    <button onClick={onClick} className="group block">
      <div className="relative">
        {/* Pulsing Ring */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full animate-ping opacity-75"></div>
        
        {/* Main Button */}
        <div className="relative w-16 h-16 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 group-hover:rotate-12">
          <FaRobot className="text-white text-2xl" />
        </div>
        
        {/* Tooltip */}
        <div className={`absolute bottom-full right-0 mb-2 px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-800 text-white"
        }`}>
          Chat with Travel Expert
          <div className={`absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
            theme === "dark" ? "border-t-gray-900" : "border-t-gray-800"
          }`}></div>
        </div>
      </div>
    </button>
  </div>
));

ChatButton.displayName = 'ChatButton';

// Optimized App with Routes including Admin
const App = memo(() => (
  <ThemeProvider>
    <Router>
      <Suspense fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading...</p>
          </div>
        </div>
      }>
        <Routes>
          {/* Public */}
          <Route path="/" element={<MainApp />} />
          <Route path="/all-places-detail" element={<AllPlacesDetail />} />
          <Route path="/all-famous-spots" element={<AllSpotsDetails />} />
          <Route path="/all-nature-places" element={<AllNatureDetail />} />
          <Route path="/map" element={<div>Nepal Map Page</div>} />
          <Route path="/searchresult" element={<SearchResultPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/recommendation" element={<RecommendationPage />} />
          <Route path="/details" element={<DetailPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/guide" element={<Itinerary />} />
          <Route path="/explore-nepal" element={<ExploreNepal />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/help" element={<Help />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/newsletter-archive" element={<NewsletterArchive />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/write-review" element={<WriteReview />} />
          <Route path="/add-place" element={<AddPlace />} />
          <Route path="/recommendation-results"element={<RecommendationResults />}/>
          
          {/* Authentication */}
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/sign-in" element={<SignInPage />} />

          {/* Admin */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
        </Routes>
      </Suspense>
    </Router>
  </ThemeProvider>
));

App.displayName = 'App';

export default App;

