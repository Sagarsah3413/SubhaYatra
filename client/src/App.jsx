import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Header } from "./components/header/Header";
import "./App.css";
import { SignedIn, useUser } from "@clerk/clerk-react";
import SplashScreen from "./pages/SplashScreen";
import { FaSearch, FaHotel, FaUtensils, FaMapMarkedAlt, FaCamera, FaRobot } from "react-icons/fa";
import ExploreSection from "./pages/ExploreSection";
import FamousSpots from "./pages/FamousSpots";
import NaturePlaces from "./pages/NaturePlaces";
import AllPlacesDetail from "./pages/AllPlacesDetail";
import AllSpotsDetails from "./pages/AllSpotsDetail";
import AllNatureDetail from "./pages/AllNatureDetail";
import SearchBar from "./pages/SearchBar";
import SearchResultPage from "./pages/SearchResultPage";
import ChatPage from "./pages/ChatPage";
import Footer from "./components/footer/Footer";
import RecommendationPage from "./pages/RecommendationPage";
import DetailPage from "./pages/Detailpage";
import About from "./pages/About";  
import Contact from "./pages/Contact";
import WriteReview from "./pages/WriteReview";
import AddPlace from "./pages/AddPlace";
import SignUpPage from "./pages/SignUp";
import SignInPage from "./pages/SignIn";
import TravelGuide from "./pages/TravelGuide";
import Wishlist from "./pages/Wishlist";
import Help from "./pages/Help";
import ExploreNepal from "./pages/ExploreNepal";
import FAQ from "./pages/FAQ";
import NewsletterArchive from "./pages/NewsletterArchive";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { ThemeProvider } from "./contexts/ThemeContext";

// Import the video
import backgroundVideo from "./assets/IMG_8851.MP4";

// Admin Pages
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import AdminRoute from "./pages/admin/AdminRoute";

function HeaderWithNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const handleHomeClick = () => {
    if (location.pathname !== "/") navigate(-1);
  };
  return <Header onHomeClick={handleHomeClick} />;
}

function MainApp() {
  const [theme] = useState(() => {
    return localStorage.getItem("theme") ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [theme]);

  const bgClass = theme === "light" ? "bg-gray-100" : "bg-slate-900";
  const navigate = useNavigate();

  // Check Clerk user
  const { isSignedIn } = useUser() || { isSignedIn: false };

  const [showSplash, setShowSplash] = useState(false);
  const [message, setMessage] = useState("WHERE SHALL OUR ADVENTURE BEGIN? ✨");
  const [searchPlaceholder, setSearchPlaceholder] = useState("Search everything...");

  useEffect(() => {
    if (!sessionStorage.getItem("splashShown")) {
      setShowSplash(true);
      sessionStorage.setItem("splashShown", "true");
    }
  }, []);

  const handleStart = () => setShowSplash(false);
  if (showSplash) return <SplashScreen onStart={handleStart} />;

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
      <div className="fixed top-20 right-4 md:top-24 md:right-6 z-50">
        <div className="relative group">
          {/* Background Glow Effect */}
          <div className={`absolute -inset-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 ${
            theme === "dark" 
              ? "bg-gradient-to-r from-purple-600/20 via-pink-600/15 to-indigo-600/20" 
              : "bg-gradient-to-r from-purple-500/15 via-pink-500/10 to-indigo-500/15"
          } blur-xl`} />
          
          <button
            onClick={() => {
              // Check if user is signed in before navigating
              if (isSignedIn) {
                navigate("/recommendation");
              } else {
                // Redirect to sign-in page if not authenticated
                navigate("/sign-in");
              }
            }}
            className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full backdrop-blur-xl border-2 transition-all duration-300 transform-gpu will-change-transform group-hover:scale-110 ${
              theme === "dark" 
                ? "bg-white/20 border-white/30 hover:border-white/50 shadow-2xl hover:shadow-white/20" 
                : "bg-white/95 border-gray-200/60 hover:border-gray-300/80 shadow-2xl hover:shadow-gray-300/50"
            }`}
            title={isSignedIn ? "Inspire My Trip - Travel Recommendations" : "Sign in to get personalized travel recommendations"}
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

      <HeaderWithNav />
      
      {/* Welcome Back Explorer Section - Show First for Signed In Users */}
      <SignedIn>
        <div className="mx-auto mt-8 mb-6 max-w-4xl relative group">
          {/* Premium Background with Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 via-cyan-600/15 to-emerald-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
          
          {/* Main Container */}
          <div className="relative bg-gradient-to-br from-white/95 via-slate-50/90 to-white/95 dark:from-slate-800/95 dark:via-slate-700/90 dark:to-slate-800/95 backdrop-blur-2xl rounded-3xl border-2 border-teal-200/60 dark:border-teal-700/60 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
            
            {/* Premium Top Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500"></div>
            
            {/* Subtle Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent dark:from-slate-600/20 pointer-events-none rounded-3xl"></div>
            
            {/* Content */}
            <div className="relative p-8 text-center">
              {/* Welcome Icon */}
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              
              {/* Welcome Message */}
              <h2 className="text-3xl md:text-4xl font-black text-transparent bg-gradient-to-r from-teal-700 via-cyan-700 to-emerald-700 dark:from-teal-300 dark:via-cyan-300 dark:to-emerald-300 bg-clip-text mb-4 leading-tight">
                Welcome Back, Explorer!
              </h2>
              
              {/* Subtitle */}
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto leading-relaxed">
                Your personalized Nepal adventure awaits. Discover hidden gems, authentic experiences, 
                and create memories that will last a lifetime.
              </p>
              
              {/* Premium Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center justify-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-2xl border border-teal-200/50 dark:border-teal-700/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-600/80 transition-all duration-300">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm0 8a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Travel Recommendations</span>
                </div>
                
                <div className="flex items-center justify-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-2xl border border-teal-200/50 dark:border-teal-700/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-600/80 transition-all duration-300">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Wishlist</span>
                </div>
                
                <div className="flex items-center justify-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-2xl border border-teal-200/50 dark:border-teal-700/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-600/80 transition-all duration-300">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Chat Support</span>
                </div>
              </div>
              
              {/* Call to Action */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="relative group">
                  <button 
                    onClick={() => navigate('/explore-nepal')}
                    className="group px-8 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-2xl font-bold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012-2v-1a2 2 0 012-2h1.945M15 8a3 3 0 11-6 0 3 3 0 016 0zm-3 7h.01M9 5a2 2 0 012-2h.01a2 2 0 012 2H9z" />
                    </svg>
                    Explore Nepal
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <button 
                  onClick={() => navigate('/wishlist')}
                  className="group px-8 py-3 border-2 border-teal-600/50 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-2xl font-bold text-sm transition-all duration-300 backdrop-blur-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  View Wishlist
                </button>
              </div>
            </div>
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
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-teal-100 via-cyan-100 to-blue-100 dark:from-teal-900/50 dark:via-cyan-900/50 dark:to-blue-900/50 rounded-full px-8 py-4 mb-6 backdrop-blur-sm border-2 border-teal-200 dark:border-teal-700 shadow-2xl">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
            <span className="text-teal-700 dark:text-teal-300 font-black text-lg">Adventure Awaits</span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
              <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
              <div className="w-3 h-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '2.5s' }}></div>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight">
            <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
              {message}
            </span>
          </h1>
        </div>
      </div>

      {/* Ultra Premium Category Navigation */}
      <div className="relative mb-12 overflow-hidden">
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

        <div className="relative z-10 flex flex-wrap justify-center gap-6 max-w-6xl mx-auto px-4">
          
          {/* Search All - Ultra Premium */}
          <button 
            className={`group relative bg-gradient-to-br from-white via-teal-50 to-cyan-50 dark:from-slate-800 dark:via-teal-900/20 dark:to-cyan-900/20 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 transform-gpu border-2 overflow-hidden ${
              message === "WHERE SHALL OUR ADVENTURE BEGIN? ✨" 
                ? "border-teal-500 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 scale-105" 
                : "border-teal-200 dark:border-teal-700 hover:border-teal-400 dark:hover:border-teal-600"
            }`}
            onClick={() => { 
              setMessage("WHERE SHALL OUR ADVENTURE BEGIN? ✨"); 
              setSearchPlaceholder("Search everything..."); 
            }}
          >
            {/* Premium Background Effects */}
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-cyan-400/15 to-teal-400/15 rounded-full blur-xl group-hover:scale-125 transition-transform duration-1000"></div>
            
            <div className="relative z-10 text-center">
              {/* Premium Icon Container */}
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <FaSearch className="text-xl text-white" />
              </div>
              
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1">Search All</h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">Everything Nepal</p>
              
              {/* Premium Active Indicator */}
              {message === "WHERE SHALL OUR ADVENTURE BEGIN? ✨" && (
                <div className="absolute top-3 right-3 w-3 h-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full animate-pulse border-2 border-white dark:border-slate-800"></div>
              )}
            </div>
          </button>

          {/* Hotels - Ultra Premium */}
          <button 
            className={`group relative bg-gradient-to-br from-white via-amber-50 to-orange-50 dark:from-slate-800 dark:via-amber-900/20 dark:to-orange-900/20 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 transform-gpu border-2 overflow-hidden ${
              message === "A COZY STAY AWAITS… 🏨" 
                ? "border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 scale-105" 
                : "border-amber-200 dark:border-amber-700 hover:border-amber-400 dark:hover:border-amber-600"
            }`}
            onClick={() => { 
              setMessage("A COZY STAY AWAITS… 🏨"); 
              setSearchPlaceholder("Search Hotels..."); 
            }}
          >
            {/* Premium Background Effects */}
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-orange-400/15 to-amber-400/15 rounded-full blur-xl group-hover:scale-125 transition-transform duration-1000"></div>
            
            <div className="relative z-10 text-center">
              {/* Premium Icon Container */}
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <FaHotel className="text-xl text-white" />
              </div>
              
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1">Hotels</h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">Cozy Stays</p>
              
              {/* Premium Active Indicator */}
              {message === "A COZY STAY AWAITS… 🏨" && (
                <div className="absolute top-3 right-3 w-3 h-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-pulse border-2 border-white dark:border-slate-800"></div>
              )}
            </div>
          </button>

          {/* Things To Do - Ultra Premium */}
          <button 
            className={`group relative bg-gradient-to-br from-white via-purple-50 to-pink-50 dark:from-slate-800 dark:via-purple-900/20 dark:to-pink-900/20 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 transform-gpu border-2 overflow-hidden ${
              message === "EXCITING EXPERIENCES AHEAD! 🎢" 
                ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 scale-105" 
                : "border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-600"
            }`}
            onClick={() => { 
              setMessage("EXCITING EXPERIENCES AHEAD! 🎢"); 
              setSearchPlaceholder("Search Things To Do..."); 
            }}
          >
            {/* Premium Background Effects */}
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-pink-400/15 to-purple-400/15 rounded-full blur-xl group-hover:scale-125 transition-transform duration-1000"></div>
            
            <div className="relative z-10 text-center">
              {/* Premium Icon Container */}
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <FaMapMarkedAlt className="text-xl text-white" />
              </div>
              
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1">Things To Do</h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">Exciting Experiences</p>
              
              {/* Premium Active Indicator */}
              {message === "EXCITING EXPERIENCES AHEAD! 🎢" && (
                <div className="absolute top-3 right-3 w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse border-2 border-white dark:border-slate-800"></div>
              )}
            </div>
          </button>

          {/* Restaurants - Ultra Premium */}
          <button 
            className={`group relative bg-gradient-to-br from-white via-emerald-50 to-green-50 dark:from-slate-800 dark:via-emerald-900/20 dark:to-green-900/20 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 transform-gpu border-2 overflow-hidden ${
              message === "TIME TO TANTALIZE YOUR TASTE BUDS 🍴" 
                ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 scale-105" 
                : "border-emerald-200 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-600"
            }`}
            onClick={() => { 
              setMessage("TIME TO TANTALIZE YOUR TASTE BUDS 🍴"); 
              setSearchPlaceholder("Search Restaurants..."); 
            }}
          >
            {/* Premium Background Effects */}
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-green-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-green-400/15 to-emerald-400/15 rounded-full blur-xl group-hover:scale-125 transition-transform duration-1000"></div>
            
            <div className="relative z-10 text-center">
              {/* Premium Icon Container */}
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <FaUtensils className="text-xl text-white" />
              </div>
              
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1">Restaurants</h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">Taste Adventures</p>
              
              {/* Premium Active Indicator */}
              {message === "TIME TO TANTALIZE YOUR TASTE BUDS 🍴" && (
                <div className="absolute top-3 right-3 w-3 h-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full animate-pulse border-2 border-white dark:border-slate-800"></div>
              )}
            </div>
          </button>
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

      <ExploreSection />
      <FamousSpots />
      <NaturePlaces />

      <Footer />

      {/* Floating Chatbot Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => navigate("/chat")}
          className="group block"
        >
          <div className="relative">
            {/* Pulsing Ring */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full animate-ping opacity-75"></div>
            
            {/* Main Button */}
            <div className="relative w-16 h-16 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 group-hover:rotate-12">
              <FaRobot className="text-white text-2xl" />
            </div>
            
            {/* Tooltip */}
            <div className={`absolute bottom-full right-0 mb-2 px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ${
              theme === "dark" 
                ? "bg-gray-900 text-white" 
                : "bg-gray-800 text-white"
            }`}>
              Chat with Travel Expert
              <div className={`absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
                theme === "dark" ? "border-t-gray-900" : "border-t-gray-800"
              }`}></div>
            </div>
          </div>
        </button>
      </div>
      
      </div>
    </div>
  );
}

// App with Routes including Admin
function App() {
  return (
    <ThemeProvider>
      <Router>
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
          <Route path="/guide" element={<TravelGuide />} />
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
      </Router>
    </ThemeProvider>
  );
}

export default App;