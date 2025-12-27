import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Header } from "./components/header/Header";
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
import InspireIcon from "./assets/try-icon.jpg";
import SearchResultPage from "./pages/SearchResultPage";
import ChatPage from "./pages/ChatPage";
import Footer from "./components/footer/Footer";
import RecommendationPage from "./pages/RecommendationPage";
import DetailPage from "./pages/DetailPage";
import About from "./pages/About";  
import Contact from "./pages/Contact";
import WriteReview from "./pages/WriteReview";
import AddPlace from "./pages/AddPlace";

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
  const [theme, setTheme] = useState(() => {
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
  const [showGuestChat, setShowGuestChat] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("splashShown")) {
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

  const handleGuestSend = () => {
    const input = document.getElementById("guest-chat-input");
    const text = input.value.trim();
    if (!text) return;

    const msgBox = document.getElementById("guest-chat-messages");

    const userMsg = document.createElement("div");
    userMsg.className = "bg-blue-500 p-2 my-2 rounded-md self-end text-white";
    userMsg.innerText = text;
    msgBox.appendChild(userMsg);

    const botMsg = document.createElement("div");
    botMsg.className = "bg-gray-300 p-2 my-2 rounded-md self-start text-black";
    botMsg.innerText = "This is a demo reply."; 
    msgBox.appendChild(botMsg);

    msgBox.scrollTop = msgBox.scrollHeight;
    input.value = "";
  };

  return (
    <div className={`min-h-screen ${bgClass} ${theme === "dark" ? "text-white" : "text-black"} flex flex-col relative`}>
      <HeaderWithNav />
      <div className="absolute right-4 top-20 z-50">
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="px-3 py-1 rounded-md bg-teal-500 text-white shadow"
          aria-label="Toggle theme"
        >
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
      </div>

      <p className="font-bold text-black uppercase text-center text-xl mt-4">{message}</p>

      {/* Category Buttons */}
      <div className="flex justify-center gap-12 mt-6">
        <button className={`flex items-center gap-2 px-2 py-1 font-semibold text-teal-600 transition border-b-2 ${message === "WHERE SHALL OUR ADVENTURE BEGIN? ✨" ? "border-amber-600" : "border-transparent"}`} onClick={() => { setMessage("WHERE SHALL OUR ADVENTURE BEGIN? ✨"); setSearchPlaceholder("Search everything..."); }}>
          <FaSearch /> Search All
        </button>
        <button className={`flex items-center gap-2 px-2 py-1 font-semibold text-teal-600 transition border-b-2 ${message === "A COZY STAY AWAITS… 🏨" ? "border-amber-600" : "border-transparent"}`} onClick={() => { setMessage("A COZY STAY AWAITS… 🏨"); setSearchPlaceholder("Search Hotels..."); }}>
          <FaHotel /> Hotels
        </button>
        <button className={`flex items-center gap-2 px-2 py-1 font-semibold text-teal-600 transition border-b-2 ${message === "EXCITING EXPERIENCES AHEAD! 🎢" ? "border-amber-600" : "border-transparent"}`} onClick={() => { setMessage("EXCITING EXPERIENCES AHEAD! 🎢"); setSearchPlaceholder("Search Things To Do..."); }}>
          <FaMapMarkedAlt /> Things To Do
        </button>
        <button className={`flex items-center gap-2 px-2 py-1 font-semibold text-teal-600 transition border-b-2 ${message === "TIME TO TANTALIZE YOUR TASTE BUDS 🍴" ? "border-amber-600" : "border-transparent"}`} onClick={() => { setMessage("TIME TO TANTALIZE YOUR TASTE BUDS 🍴"); setSearchPlaceholder("Search Restaurants..."); }}>
          <FaUtensils /> Restaurants
        </button>
      </div>

      <div className="flex justify-center mt-8 w-full">
        <SearchBar placeholder={searchPlaceholder} />
      </div>

      <SignedIn>
        <div className="mx-auto mt-6 p-6 bg-teal-50 rounded-lg shadow-md flex flex-col items-center border-2 border-teal-600 transition-transform transform hover:scale-105 duration-300 ease-in-out">
          <h2 className="text-2xl font-semibold text-teal-700">Welcome!</h2>
          <p className="text-teal-600 mt-2">Here you go and enjoy!</p>
        </div>
      </SignedIn>

      <ExploreSection />
      <FamousSpots />
      <NaturePlaces />

      {/* Inspire Button */}
      <div className="fixed left-4 top-40 z-50 flex flex-col items-center">
        <button onClick={handleInspireClick} className="w-20 h-20 rounded-full overflow-hidden shadow-lg relative flex items-center justify-center hover:scale-105 transform transition duration-300" style={{ backgroundImage: `url(${InspireIcon})`, backgroundSize: "cover", backgroundPosition: "center" }}>
          <span className="text-black font-semibold text-center text-sm">Inspire My Trip!</span>
        </button>
      </div>

      {/* Chatbot */}
      <div className="fixed right-4 bottom-20 z-50 flex flex-col items-center">
        <button type="button" onClick={() => { isSignedIn ? navigate("/chat") : setShowGuestChat(!showGuestChat); }} className="w-16 h-16 rounded-full bg-teal-500 shadow-lg flex items-center justify-center hover:scale-105 transform transition duration-300">
          <FaRobot className="text-amber-600 text-2xl" />
        </button>
        <span className="text-black text-xs mt-1">Ask with Chatbot</span>
      </div>

      {showGuestChat && !isSignedIn && (
        <div className="fixed right-4 bottom-44 w-96 h-[520px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white rounded-xl shadow-2xl flex flex-col overflow-hidden z-50">
          <div className="flex justify-between items-center bg-gray-900 p-3 border-b border-gray-700">
            <span className="font-semibold">Guest Chat</span>
            <button onClick={() => setShowGuestChat(false)}>
              <FaTimes className="text-white" />
            </button>
          </div>
          <div className="p-2 text-sm text-yellow-300 border-b border-gray-700">Sign up to save your chat history!</div>
          <div className="flex-1 p-3 overflow-y-auto" id="guest-chat-messages"></div>
          <div className="p-3 border-t border-gray-700 flex gap-2">
            <input type="text" placeholder="Type your message..." className="flex-1 p-2 rounded-md bg-gray-700 text-white placeholder-white focus:outline-none" id="guest-chat-input" onKeyDown={(e) => { if (e.key === "Enter") handleGuestSend(); }} />
            <button className="bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 transition text-white" onClick={handleGuestSend}>Send</button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

// App with Routes including Admin
function App() {
  return (
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
        <Route path="/write-review" element={<WriteReview />} />
        <Route path="/add-place" element={<AddPlace />} />

        {/* Admin */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
