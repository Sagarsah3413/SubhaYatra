import { useState, useEffect, useCallback, memo } from "react";
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

// Import the video, Nepal image, and hotel service
import backgroundVideo from "./assets/IMG_8851.MP4";
import nepalImage from "./assets/nepal.jpg";
import { hotelService } from "./services/hotelService";

// Optimized InspireButton component
const InspireButton = memo(({ isSignedIn, onClick, theme }) => (
  <div className="fixed top-20 right-4 md:top-24 md:right-6 z-50">
    <div className="relative group">
      {/* Background Glow Effect */}
      <div className={`absolute -inset-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 ${
        theme === "dark" 
          ? "bg-gradient-to-r from-purple-600/20 via-pink-600/15 to-indigo-600/20" 
          : "bg-gradient-to-r from-purple-500/15 via-pink-500/10 to-indigo-500/15"
      } blur-xl`} />
      
      <button
        onClick={onClick}
        className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full backdrop-blur-xl border-2 transition-all duration-300 transform-gpu will-change-transform group-hover:scale-110 ${
          theme === "dark" 
            ? "bg-white/20 border-white/30 hover:border-white/50 shadow-2xl hover:shadow-white/20" 
            : "bg-white/95 border-gray-200/60 hover:border-gray-300/80 shadow-2xl hover:shadow-gray-300/50"
        }`}
        title={isSignedIn ? "Inspire My Trip" : "Sign in to get personalized recommendations"}
      >
        {/* Icon Container */}
        <div className={`absolute inset-2 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 ${
          theme === "dark" 
            ? "bg-gradient-to-br from-purple-600 to-pink-600" 
            : "bg-gradient-to-br from-purple-500 to-pink-500"
        }`}>
          <FaCamera className="text-white text-lg md:text-xl group-hover:scale-110 transition-transform duration-300" />
          
          {/* Lock overlay when not signed in */}
          {!isSignedIn && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Floating Sparkle */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce shadow-lg">
          <span className="text-white text-xs font-bold">✨</span>
        </div>
        
        {/* Professional Ring Effect */}
        <div className={`absolute inset-0 rounded-full border-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
          theme === "dark" 
            ? "border-purple-400/50" 
            : "border-purple-500/50"
        } animate-pulse`}></div>
        
        {/* Shine Effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </button>
      
      {/* Professional Tooltip */}
      <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-3 px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap ${
        theme === "dark" 
          ? "bg-gray-900/95 text-white border border-gray-700/50" 
          : "bg-white/95 text-gray-800 border border-gray-200/50"
      } shadow-xl backdrop-blur-sm`}>
        <span className="text-sm font-semibold">
          {isSignedIn ? "Inspire My Trip" : "Sign in Required"}
        </span>
        {!isSignedIn && (
          <div className="text-xs text-gray-500 mt-1">
            Get personalized recommendations
          </div>
        )}
        <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 ${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        }`}></div>
      </div>
    </div>
  </div>
));

InspireButton.displayName = 'InspireButton';

// Compact CategoryButton component
const CategoryButton = memo(({ isActive, onClick, icon: Icon, title, description, gradient, bgGradient, borderColor }) => (
  <button 
    className={`group relative bg-gradient-to-br ${bgGradient} rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 transform-gpu border-2 overflow-hidden ${
      isActive 
        ? `border-${borderColor}-500 scale-105` 
        : `border-${borderColor}-200 dark:border-${borderColor}-700 hover:border-${borderColor}-400 dark:hover:border-${borderColor}-600`
    }`}
    onClick={onClick}
  >
    {/* Compact Background Effects */}
    <div className={`absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-${borderColor}-400/20 to-${borderColor === 'teal' ? 'cyan' : borderColor === 'amber' ? 'orange' : borderColor === 'purple' ? 'pink' : 'green'}-400/20 rounded-full blur-xl group-hover:scale-125 transition-transform duration-700`}></div>
    <div className={`absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-br from-${borderColor === 'teal' ? 'cyan' : borderColor === 'amber' ? 'orange' : borderColor === 'purple' ? 'pink' : 'green'}-400/15 to-${borderColor}-400/15 rounded-full blur-lg group-hover:scale-110 transition-transform duration-700`}></div>
    
    <div className="relative z-10 text-center">
      {/* Compact Icon Container */}
      <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-400`}>
        <Icon className="text-lg text-white" />
      </div>
      
      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-xs font-medium leading-tight">{description}</p>
      
      {/* Compact Active Indicator */}
      {isActive && (
        <div className={`absolute top-2 right-2 w-2.5 h-2.5 bg-gradient-to-r from-${borderColor}-500 to-${borderColor === 'teal' ? 'cyan' : borderColor === 'amber' ? 'orange' : borderColor === 'purple' ? 'pink' : 'green'}-500 rounded-full animate-pulse border border-white dark:border-slate-800`}></div>
      )}
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

  // Optimized theme state
  const [theme] = useState(() => localStorage.getItem("theme") ?? "dark");
  
  // Optimized splash screen state
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem("splashShown"));
  
  // Optimized message state
  const [message, setMessage] = useState(() => t('homepage.welcome'));
  const [searchPlaceholder, setSearchPlaceholder] = useState(() => t('homepage.searchPlaceholder'));

  // Hotel count state
  const [hotelCount, setHotelCount] = useState(0);

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
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.7)" }}
        >
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
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
      
      {/* Welcome Back Explorer Section - Ultra Professional Design */}
      <SignedIn>
        <div className="mx-auto mt-24 mb-8 max-w-6xl relative px-4">
          {/* Professional Container with Enhanced Styling */}
          <div className="relative bg-gradient-to-br from-white/98 via-slate-50/95 to-white/98 dark:from-slate-900/98 dark:via-slate-800/95 dark:to-slate-900/98 backdrop-blur-2xl rounded-3xl border-2 border-white/40 dark:border-slate-700/40 shadow-2xl hover:shadow-3xl transition-all duration-700 overflow-hidden group">
            
            {/* Premium Glass Effect Border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/20 via-transparent to-white/20 dark:from-slate-600/20 dark:via-transparent dark:to-slate-600/20 pointer-events-none"></div>
            
            {/* Background Image - Nepal.jpg */}
            <div 
              className="absolute inset-0 opacity-75 dark:opacity-60 transition-opacity duration-700 group-hover:opacity-85 dark:group-hover:opacity-70"
              style={{
                backgroundImage: `url(${nepalImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                filter: 'brightness(1.1) contrast(1.2) saturate(1.1)'
              }}
            />
            
            {/* Professional Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-white/70 to-white/85 dark:from-slate-900/85 dark:via-slate-900/70 dark:to-slate-900/85"></div>
            
            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, rgba(6, 182, 212, 0.4) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)
              `,
              backgroundSize: '400px 400px'
            }}></div>
            
            {/* Professional Top Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-500/60 to-transparent"></div>
            
            {/* Content Container */}
            <div className="relative p-10 md:p-12 text-center z-10">
              
              {/* Professional Header Section */}
              <div className="mb-8">
                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-full px-4 py-2 mb-4 border border-teal-200/50 dark:border-teal-700/50 shadow-sm">
                  <div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full animate-pulse"></div>
                  <span className="text-teal-700 dark:text-teal-300 font-semibold text-sm tracking-wide">PERSONALIZED EXPERIENCE</span>
                </div>
                
                {/* Main Welcome Message */}
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 leading-tight tracking-tight">
                  <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    {t('homepage.welcomeBack')}
                  </span>
                </h2>
                
                {/* Professional Subtitle */}
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-medium">
                  {t('homepage.personalizedAdventure')}
                </p>
              </div>
              
              {/* Professional Stats Section */}
              <div className="grid grid-cols-3 gap-6 mb-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-teal-600 dark:text-teal-400 mb-1">450+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Destinations</div>
                </div>
                <div className="text-center border-x border-gray-200/50 dark:border-slate-700/50">
                  <div className="text-2xl md:text-3xl font-bold text-cyan-600 dark:text-cyan-400 mb-1">500+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Hotels</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">450+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Restaurants</div>
                </div>
              </div>
              
              {/* Professional Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {/* Primary CTA Button */}
                <button 
                  onClick={() => navigate('/explore-nepal')}
                  className="group relative px-8 py-4 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 hover:from-teal-700 hover:via-cyan-700 hover:to-blue-700 text-white rounded-2xl font-bold text-base transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl flex items-center gap-3 overflow-hidden min-w-[200px] justify-center"
                >
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  {/* Icon */}
                  <div className="relative z-10 p-1 bg-white/20 rounded-lg">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012-2v-1a2 2 0 012-2h1.945M15 8a3 3 0 11-6 0 3 3 0 016 0zm-3 7h.01M9 5a2 2 0 012-2h.01a2 2 0 012 2H9z" />
                    </svg>
                  </div>
                  
                  {/* Text */}
                  <span className="relative z-10 font-bold">{t('homepage.exploreNepal')}</span>
                  
                  {/* Arrow */}
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Secondary Button */}
                <button 
                  onClick={() => navigate('/guide')}
                  className="group relative px-8 py-4 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white rounded-2xl font-semibold text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3 border-2 border-gray-200/50 dark:border-slate-600/50 hover:border-gray-300/70 dark:hover:border-slate-500/70 min-w-[200px] justify-center backdrop-blur-sm"
                >
                  {/* Icon */}
                  <svg className="w-5 h-5 text-teal-600 dark:text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  
                  {/* Text */}
                  <span>Itinerary</span>
                  
                  {/* Arrow */}
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {/* Professional Footer Note */}
              <div className="mt-8 pt-6 border-t border-gray-200/30 dark:border-slate-700/30">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  ✨ Curated experiences tailored just for you
                </p>
              </div>
            </div>
            
            {/* Professional Corner Accents */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-teal-500/10 to-transparent rounded-br-3xl"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-cyan-500/10 to-transparent rounded-tl-3xl"></div>
          </div>
        </div>
      </SignedIn>

      {/* Ultra Premium Adventure Message */}
      <div className="relative mt-8 mb-12 overflow-hidden">
        {/* Premium Background Pattern */}
        <div className="absolute inset-0 opacity-10 dark:opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 30% 30%, rgba(6, 182, 212, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 70% 70%, rgba(59, 130, 246, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 50% 10%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)
            `,
            backgroundSize: '600px 600px, 800px 800px, 1000px 1000px'
          }}></div>
        </div>

        <div className="relative z-10 text-center">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-100 via-cyan-100 to-blue-100 dark:from-teal-900/50 dark:via-cyan-900/50 dark:to-blue-900/50 rounded-full px-6 py-2.5 mb-4 backdrop-blur-sm border-2 border-teal-200 dark:border-teal-700 shadow-xl">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-1 h-1 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
            <span className="text-teal-700 dark:text-teal-300 font-bold text-base">{t('homepage.adventureAwaits')}</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
              <div className="w-1.5 h-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
              <div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '2.5s' }}></div>
            </div>
          </div>
          
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black mb-3 leading-tight">
            <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
              {message}
            </span>
          </h1>
        </div>
      </div>

      {/* Compact Category Navigation */}
      <div className="relative mb-8 overflow-hidden">
        {/* Premium Background Effects */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 25% 50%, rgba(6, 182, 212, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 75% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)
            `,
            backgroundSize: '800px 800px, 600px 600px'
          }}></div>
        </div>

        <div className="relative z-10 flex flex-wrap justify-center gap-4 max-w-5xl mx-auto px-4">
          
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
      <div className="relative mb-12 overflow-hidden">
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
          <div className="w-full bg-gradient-to-r from-white/95 to-gray-50/95 dark:from-slate-800/95 dark:to-slate-700/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border-2 border-gray-200 dark:border-slate-600">
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