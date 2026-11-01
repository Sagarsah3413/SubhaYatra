import { useState, useEffect, useCallback, memo, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Header } from "./components/header/Header";
import "./App.css";
import { SignedIn, useUser } from "@clerk/clerk-react";
import SplashScreen from "./pages/SplashScreen";
import { FaSearch, FaHotel, FaUtensils, FaMapMarkedAlt, FaCompass, FaRobot } from "react-icons/fa";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastProvider } from "./contexts/ToastContext";
import { useTranslation } from 'react-i18next';
import ScrollToTop from "./components/ScrollToTop";
import { useUserSync } from "./hooks/useUserSync";

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
const SearchResultPage = lazy(() => import("./pages/SearchResultPageNew"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const RecommendationPage = lazy(() => import("./pages/RecommendationPage"));
const PlaceDetailView = lazy(() => import("./pages/PlaceDetailView"));
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
const ExplorerPage = lazy(() => import("./pages/explorer/ExplorerPage"));
const FAQ = lazy(() => import("./pages/FAQ"));
const NewsletterArchive = lazy(() => import("./pages/NewsletterArchive"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));

// Admin Pages
const Login = lazy(() => import("./pages/admin/Login"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminRoute = lazy(() => import("./pages/admin/AdminRoute"));

// Test Pages - Removed (cleanup completed)

// Import the Nepal image and hotel service
import nepalImage from "./assets/nepal.jpg";
import { hotelService } from "./services/hotelService";

// Ultra Professional InspireButton component with scroll detection
const InspireButton = memo(({ isSignedIn, onClick, theme }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Only show button at the very top of the page (first 300px)
      // Hide completely when scrolling down
      if (currentScrollY > 300) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
  <div className={`fixed top-36 left-12 md:top-40 md:left-16 z-50 transition-all duration-500 ${
    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-20 pointer-events-none'
  }`}>
    <div className="relative group">
      {/* Enhanced Premium Background Glow - More Visible */}
      <button
        onClick={onClick}
        className={`relative w-12 h-12 md:w-14 md:h-14 rounded-full border transition-all duration-300 hover:scale-105 active:scale-95 ${
          theme === "dark"
            ? "bg-navy-800 border-navy-700 hover:border-navy-500/60 hover:bg-slate-750 shadow-lg shadow-black/20"
            : "bg-white border-slate-200 hover:border-amber-400/60 shadow-md shadow-black/8"
        }`}
        title={isSignedIn ? "Inspire My Journey" : "Sign in for personalized recommendations"}
      >
        {/* Icon */}
        <div className={`absolute inset-0 rounded-full flex items-center justify-center ${
          theme === "dark" ? "text-amber-400" : "text-navy-500"
        }`}>
          <FaCompass className="text-lg md:text-xl" />
        </div>

        {/* Lock badge — only when signed out */}
        {!isSignedIn && (
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${
            theme === "dark" ? "bg-navy-700 border border-slate-600" : "bg-white border border-slate-200 shadow-sm"
          }`}>
            <svg className={`w-2.5 h-2.5 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </button>

      {/* Tooltip */}
      <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none ${
        theme === "dark"
          ? "bg-navy-800 text-slate-200 border border-navy-700"
          : "bg-white text-slate-700 border border-slate-200 shadow-sm"
      }`}>
        {isSignedIn ? "Inspire My Journey" : "Sign in for recommendations"}
        <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 ${
          theme === "dark" ? "bg-navy-800 border-l border-t border-navy-700" : "bg-white border-l border-t border-slate-200"
        }`} />
      </div>
    </div>
  </div>
  );
});

InspireButton.displayName = 'InspireButton';

// Restrained editorial CategoryButton — solid tokens, no decorative gradients
const CategoryButton = memo(({ isActive, onClick, icon: Icon, title, description }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={isActive}
    className={`group flex items-start gap-3 text-left rounded-xl border px-4 py-3 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
      isActive
        ? "border-amber-500 bg-amber-50 dark:bg-navy-800 dark:border-amber-400"
        : "border-surface-300 bg-white hover:border-navy-400 dark:border-navy-700 dark:bg-navy-900 dark:hover:border-navy-500"
    }`}
  >
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
        isActive
          ? "bg-amber-500 text-white"
          : "bg-surface-100 text-navy-600 dark:bg-navy-800 dark:text-amber-400"
      }`}
    >
      <Icon className="text-base" />
    </span>
    <span className="min-w-0">
      <span className="block text-sm font-semibold text-navy-900 dark:text-white">{title}</span>
      <span className="block text-xs text-surface-600 dark:text-slate-400">{description}</span>
    </span>
  </button>
));

CategoryButton.displayName = 'CategoryButton';

// Memoized Header component
const HeaderWithNav = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return <Header />;
});

HeaderWithNav.displayName = 'HeaderWithNav';

// Optimized MainApp component
const MainApp = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isSignedIn } = useUser() || { isSignedIn: false };

  useUserSync(); // sync Clerk user to backend on every login/logout

  // Optimized theme state
  const [theme] = useState(() => localStorage.getItem("theme") ?? "dark");
  
  // Optimized splash screen state
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem("splashShown"));
  
  // Optimized message state
  const [message, setMessage] = useState(() => t('homepage.welcome'));
  const [searchPlaceholder, setSearchPlaceholder] = useState(() => t('homepage.searchPlaceholder'));
  
  // Category filter state for search
  const [activeCategory, setActiveCategory] = useState("all");

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
      setActiveCategory("all");
    }, [t]),
    
    hotels: useCallback(() => {
      setMessage(t('homepage.welcomeMessage'));
      setSearchPlaceholder(t('homepage.searchHotels'));
      setActiveCategory("hotel");
    }, [t]),
    
    activities: useCallback(() => {
      setMessage(t('homepage.experienceMessage'));
      setSearchPlaceholder(t('homepage.searchActivities'));
      setActiveCategory("place");
    }, [t]),
    
    restaurants: useCallback(() => {
      setMessage(t('homepage.foodMessage'));
      setSearchPlaceholder(t('homepage.searchRestaurants'));
      setActiveCategory("restaurant");
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
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-surface-50 text-navy-900 dark:bg-navy-950 dark:text-white">
      {/* Clean solid page background */}
      <div className="fixed inset-0 w-full h-full z-0 bg-surface-50 dark:bg-navy-950"></div>

      {/* Content Container - Above Background */}
      <div className="relative z-10 flex flex-col min-h-screen">
      {/* Inspire My Trip Logo - Top Right */}
      <InspireButton 
        isSignedIn={isSignedIn} 
        onClick={handleInspireClick} 
        theme={theme} 
      />

      <HeaderWithNav />
      
      {/* Welcome Back — full-bleed editorial Himalayan hero */}
      <SignedIn>
        <section className="relative mx-auto mt-20 mb-10 w-full max-w-6xl px-4">
          <div className="relative overflow-hidden rounded-2xl">
            {/* Himalayan heritage backdrop */}
            <img
              src={nepalImage}
              alt="The Himalayas of Nepal"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Scrim for legible contrast in both themes */}
            <div className="absolute inset-0 bg-navy-950/70" aria-hidden="true"></div>

            <div className="relative z-10 px-8 py-16 md:px-14 md:py-24 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
                SubhaYatra
              </p>
              <h2 className="mt-4 text-4xl md:text-5xl font-semibold leading-tight text-white">
                Welcome back, explorer
              </h2>
              <p className="mt-5 max-w-lg text-base md:text-lg leading-relaxed text-slate-200">
                Curated journeys through the heart of the Himalayas — heritage
                squares, mountain trails, and the living culture of Nepal.
              </p>

              {hotelCount > 0 && (
                <p className="mt-6 text-sm text-slate-300">
                  <span className="font-semibold text-white">{hotelCount}</span>{" "}
                  stays ready to explore
                </p>
              )}

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/explore-nepal')}
                  className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-navy-950 transition-colors duration-200 hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
                >
                  Explore Nepal
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/guide')}
                  className="inline-flex items-center justify-center rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
                >
                  Plan Journey
                </button>
              </div>
            </div>
          </div>
        </section>
      </SignedIn>

      {/* Adventure prompt — simple editorial heading */}
      <div className="mt-10 mb-10 px-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
          {t('homepage.adventureAwaits')}
        </p>
        <h1 className="mt-3 text-2xl md:text-4xl font-semibold leading-tight tracking-tight text-navy-900 dark:text-white">
          {message}
        </h1>
      </div>

      {/* Category navigation — restrained, consistent */}
      <div className="mb-10 px-4">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <CategoryButton
            isActive={message === t('homepage.welcome')}
            onClick={categoryHandlers.searchAll}
            icon={FaSearch}
            title={t('homepage.searchAll')}
            description={t('homepage.everythingNepal')}
          />
          <CategoryButton
            isActive={message === t('homepage.welcomeMessage')}
            onClick={categoryHandlers.hotels}
            icon={FaHotel}
            title={t('homepage.hotels')}
            description={t('homepage.cozyStays')}
          />
          <CategoryButton
            isActive={message === t('homepage.experienceMessage')}
            onClick={categoryHandlers.activities}
            icon={FaMapMarkedAlt}
            title={t('homepage.thingsToDo')}
            description={t('homepage.excitingExperiences')}
          />
          <CategoryButton
            isActive={message === t('homepage.foodMessage')}
            onClick={categoryHandlers.restaurants}
            icon={FaUtensils}
            title={t('homepage.restaurants')}
            description={t('homepage.tasteAdventures')}
          />
        </div>
      </div>

      {/* Search bar container — restrained card */}
      <div className="mb-16 px-4">
        <div className="mx-auto w-full max-w-4xl rounded-2xl border border-surface-300 bg-white p-6 shadow-sm dark:border-navy-700 dark:bg-navy-900">
          <SearchBar placeholder={searchPlaceholder} category={activeCategory} />
        </div>
      </div>

      <Suspense fallback={<div className="flex justify-center items-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-500"></div></div>}>
        <ExploreSection />
        <FamousSpots />
        <NaturePlaces />
      </Suspense>

      <Suspense fallback={<div className="flex justify-center items-center py-4"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-navy-500"></div></div>}>
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
    <button
      onClick={onClick}
      className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-full border transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm ${
        theme === "dark"
          ? "bg-navy-800 border-navy-700 hover:border-navy-500/50 text-slate-300 hover:text-amber-400"
          : "bg-white border-slate-200 hover:border-amber-400/60 text-slate-600 hover:text-navy-600 shadow-md"
      }`}
    >
      <FaRobot className="text-sm shrink-0" />
      <span className="text-xs font-medium whitespace-nowrap">Travel Expert</span>
    </button>
  </div>
));

ChatButton.displayName = 'ChatButton';

// Optimized App with Routes including Admin
const App = memo(() => (
  <ThemeProvider>
    <ToastProvider>
      <Router>
        <ScrollToTop />
        <Suspense fallback={
          <div className="min-h-screen bg-navy-900 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-500 mx-auto mb-4"></div>
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
            <Route path="/place/:placeId" element={<PlaceDetailView />} />
            <Route path="/details" element={<DetailPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/guide" element={<Itinerary />} />
            <Route path="/itinerary" element={<Itinerary />} />
            <Route path="/explore-nepal" element={<ExploreNepal />} />
            <Route path="/explore" element={<ExplorerPage />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/help" element={<Help />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/newsletter-archive" element={<NewsletterArchive />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/write-review" element={<WriteReview />} />
            <Route path="/add-place" element={<AddPlace />} />
            <Route path="/recommendation-results"element={<RecommendationResults />} />
            
            {/* Authentication */}
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/sign-in" element={<SignInPage />} />

            {/* Admin */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
          </Routes>
        </Suspense>
      </Router>
    </ToastProvider>
  </ThemeProvider>
));

App.displayName = 'App';

export default App;

