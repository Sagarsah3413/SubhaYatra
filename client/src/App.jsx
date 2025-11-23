import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Header } from "../components/header/Header";
import "./App.css";
import { SignedIn, useUser } from "@clerk/clerk-react";
import SplashScreen from "./pages/SplashScreen";
import { FaSearch, FaHotel, FaUtensils, FaMapMarkedAlt, FaRobot, FaTimes } from "react-icons/fa";
import ExploreSection from "./pages/ExploreSection";
import FamousSpots from "./pages/FamousSpots";
import NaturePlaces from "./pages/NaturePlaces";
import AllPlacesDetail from "./pages/AllPlacesDetail";
import AllSpotsDetails from "./pages/AllSpotsDetail";
import AllNatureDetail from "./pages/AllNatureDetail";
import SearchBar from "./pages/SearchBar";
import InspireIcon from "./assets/try-icon.jpg"; // check your path
import SearchResultPage from "./pages/SearchResultPage";
import ChatPage from "./pages/ChatPage";
import Footer from "../components/footer/Footer";

function HeaderWithNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const handleHomeClick = () => {
    if (location.pathname !== "/") navigate(-1);
  };
  return <Header onHomeClick={handleHomeClick} />;
}

function MainApp() {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const [showSplash, setShowSplash] = useState(false);
  const [message, setMessage] = useState("WHERE SHALL OUR ADVENTURE BEGIN? ✨");
  const [searchPlaceholder, setSearchPlaceholder] = useState("Search everything...");
  const [showGuestChat, setShowGuestChat] = useState(false);

  useEffect(() => {
    const hasShown = sessionStorage.getItem("splashShown");
    if (!hasShown) {
      setShowSplash(true);
      sessionStorage.setItem("splashShown", "true");
    }
  }, []);

  const handleStart = () => setShowSplash(false);

  if (showSplash) return <SplashScreen onStart={handleStart} />;

  const handleInspireClick = () => {
    if (isSignedIn) navigate("/recommendation");
    else alert("✨ Please sign up to enjoy our personalized recommendation system! ✨");
  };

  // Guest chat send handler
  const handleGuestSend = () => {
    const input = document.getElementById("guest-chat-input");
    const text = input.value.trim();
    if (!text) return;

    const msgBox = document.getElementById("guest-chat-messages");

    // User message
    const userMsg = document.createElement("div");
    userMsg.className = "bg-blue-500 p-2 my-2 rounded-md self-end text-white";
    userMsg.innerText = text;
    msgBox.appendChild(userMsg);

    // Demo bot reply
    const botMsg = document.createElement("div");
    botMsg.className = "bg-gray-300 p-2 my-2 rounded-md self-start text-black";
    botMsg.innerText = "This is a demo reply."; // Replace with AI API response
    msgBox.appendChild(botMsg);

    msgBox.scrollTop = msgBox.scrollHeight;
    input.value = "";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col relative">
      {/* Header */}
      <HeaderWithNav />

      {/* Top Message */}
      <p className="font-bold text-black uppercase text-center text-xl mt-4">{message}</p>

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
        <SearchBar placeholder={searchPlaceholder} />
      </div>

      {/* Signed-in Welcome Section */}
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

      {/* Floating Inspire My Trip Button */}
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

      {/* Floating Chatbot Button */}
      <div className="fixed right-4 bottom-20 z-50 flex flex-col items-center">
        <button
          type="button"
          onClick={() => {
            if (isSignedIn) navigate("/chat");
            else setShowGuestChat(!showGuestChat);
          }}
          className="w-16 h-16 rounded-full bg-blue-500 shadow-lg flex items-center justify-center hover:scale-105 transform transition duration-300"
        >
          <FaRobot className="text-white text-2xl" />
        </button>
        <span className="text-white text-xs mt-1">Ask with Chatbot</span>
      </div>

      {/* Guest Chatbox Overlay */}
      {showGuestChat && !isSignedIn && (
        <div className="fixed right-4 bottom-44 w-96 h-[520px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white rounded-xl shadow-2xl flex flex-col overflow-hidden z-50">
          {/* Header */}
          <div className="flex justify-between items-center bg-gray-900 p-3 border-b border-gray-700">
            <span className="font-semibold">Guest Chat</span>
            <button onClick={() => setShowGuestChat(false)}>
              <FaTimes className="text-white" />
            </button>
          </div>

          {/* Signup message */}
          <div className="p-2 text-sm text-yellow-300 border-b border-gray-700">
            Sign up to save your chat history!
          </div>

          {/* Messages container */}
          <div className="flex-1 p-3 overflow-y-auto" id="guest-chat-messages">
            {/* Messages appended dynamically */}
          </div>

          {/* Input with Send button */}
          <div className="p-3 border-t border-gray-700 flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 p-2 rounded-md bg-gray-700 text-white placeholder-white focus:outline-none"
              id="guest-chat-input"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleGuestSend();
              }}
            />
            <button
              className="bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 transition text-white"
              onClick={handleGuestSend}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
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
        <Route path="/map" element={<div>Nepal Map Page</div>} />
        <Route path="/searchresult" element={<SearchResultPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;
