import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Header } from "../components/header/Header";
import "./App.css";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import SplashScreen from "./pages/SplashScreen";
import { FaSearch, FaHotel, FaUtensils, FaMapMarkedAlt } from "react-icons/fa";
import ExploreSection from "./pages/ExploreSection";
import FamousSpots from "./pages/FamousSpots";
import NaturePlaces from "./pages/NaturePlaces";
import AllPlacesDetail from "./pages/AllPlacesDetail";
import AllSpotsDetails from "./pages/AllSpotsDetail";
import AllNatureDetail from "./pages/AllNatureDetail";
import InspireIcon from "./assets/try-icon.jpg"; // make sure this path is correct

function HeaderWithNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleHomeClick = () => {
    if (location.pathname !== "/") {
      navigate(-1);
    }
  };

  return <Header onHomeClick={handleHomeClick} />;
}

function MainApp() {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const [showSplash, setShowSplash] = useState(false);
  const [message, setMessage] = useState("WHERE SHALL OUR ADVENTURE BEGIN? ✨");
  const [searchPlaceholder, setSearchPlaceholder] = useState("Search everything...");

  useEffect(() => {
    const hasShown = sessionStorage.getItem("splashShown");
    if (!hasShown) {
      setShowSplash(true);
      sessionStorage.setItem("splashShown", "true");
    }
  }, []);

  const handleStart = () => setShowSplash(false);

  if (showSplash) {
    return <SplashScreen onStart={handleStart} />;
  }

  // Handle Inspire My Trip click
  const handleInspireClick = () => {
    if (isSignedIn) {
      navigate("/recommendation");
    } else {
      alert(
        "✨ Please sign up to enjoy our personalized recommendation system! ✨"
      );
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col relative">
      {/* Header */}
      <HeaderWithNav />

      {/* Top Message */}
      {message && (
        <p className="font-bold text-black uppercase text-center text-xl mt-4">
          {message}
        </p>
      )}

      {/* Category Buttons */}
      <div className="flex justify-center gap-12 mt-6">
        <button
          className={`flex items-center gap-2 px-2 py-1 font-semibold text-pink-600 transition border-b-2 ${
            message === "WHERE SHALL OUR ADVENTURE BEGIN? ✨" ? "border-pink-600" : "border-transparent"
          }`}
          onClick={() => {
            setMessage("WHERE SHALL OUR ADVENTURE BEGIN? ✨");
            setSearchPlaceholder("Search everything...");
          }}
        >
          <FaSearch /> Search All
        </button>

        <button
          className={`flex items-center gap-2 px-2 py-1 font-semibold text-pink-600 transition border-b-2 ${
            message === "A COZY STAY AWAITS… 🏨" ? "border-pink-600" : "border-transparent"
          }`}
          onClick={() => {
            setMessage("A COZY STAY AWAITS… 🏨");
            setSearchPlaceholder("Search Hotels...");
          }}
        >
          <FaHotel /> Hotels
        </button>

        <button
          className={`flex items-center gap-2 px-2 py-1 font-semibold text-pink-600 transition border-b-2 ${
            message === "EXCITING EXPERIENCES AHEAD! 🎢" ? "border-pink-600" : "border-transparent"
          }`}
          onClick={() => {
            setMessage("EXCITING EXPERIENCES AHEAD! 🎢");
            setSearchPlaceholder("Search Things To Do...");
          }}
        >
          <FaMapMarkedAlt /> Things To Do
        </button>

        <button
          className={`flex items-center gap-2 px-2 py-1 font-semibold text-pink-600 transition border-b-2 ${
            message === "TIME TO TANTALIZE YOUR TASTE BUDS 🍴" ? "border-pink-600" : "border-transparent"
          }`}
          onClick={() => {
            setMessage("TIME TO TANTALIZE YOUR TASTE BUDS 🍴");
            setSearchPlaceholder("Search Restaurants...");
          }}
        >
          <FaUtensils /> Restaurants
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mt-8 w-full">
        <div className="flex w-fit min-w-[640px]">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-full px-4 py-3 pl-10 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>

          <button
            type="button"
            className="px-6 bg-black text-white rounded-r-md hover:bg-gray-900 transition"
            onClick={() => alert("Search clicked!")}
          >
            Search
          </button>
        </div>
      </div>

      {/* Signed-in Content */}
      <SignedIn>
        <div className="mx-auto mt-6 p-6 bg-white rounded-lg shadow-md flex flex-col items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Welcome!</h2>
          <p className="text-gray-600 mt-2">Here you go and enjoy!</p>
        </div>
      </SignedIn>

      {/* Sections */}
      <ExploreSection />
      <FamousSpots />
      <NaturePlaces />

      {/* Floating Inspire My Trip button near search bar */}
      <div className="fixed left-4 top-40 z-50 flex flex-col items-center">
        <button
          onClick={handleInspireClick}
          className="w-20 h-20 rounded-full overflow-hidden shadow-lg relative flex items-center justify-center hover:scale-105 transform transition duration-300"
          style={{
            backgroundImage: `url(${InspireIcon})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <span className="text-black font-semibold text-center text-sm">
            Inspire My Trip!
          </span>
        </button>
      </div>
    </div>
  );
}

// Routing
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/all-places-detail" element={<AllPlacesDetail />} />
        <Route path="/all-famous-spots" element={<AllSpotsDetails />} />
        <Route path="/all-nature-places" element={<AllNatureDetail />} />
        <Route path="/recommendation" element={<div>Recommendation Page</div>} />
      </Routes>
    </Router>
  );
}

export default App;
