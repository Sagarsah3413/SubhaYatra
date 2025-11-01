import { useState } from "react";
import { Header } from "../components/header/Header";
import "./App.css";
import { SignedIn } from "@clerk/clerk-react";
import SplashScreen from "./pages/SplashScreen"; // adjust path if needed
import { FaSearch, FaHotel, FaUtensils, FaMapMarkedAlt } from "react-icons/fa";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [message, setMessage] = useState("WHERE SHALL OUR ADVENTURE BEGIN? ✨");
  const [searchPlaceholder, setSearchPlaceholder] = useState("Search everything...");

  const handleStart = () => setShowSplash(false);

  if (showSplash) {
    return <SplashScreen onStart={handleStart} />;
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <Header />

      {/* Message just below header */}
      {message && (
        <p className="font-bold text-black uppercase text-center text-xl mt-4">
          {message}
        </p>
      )}

      {/* Buttons below message */}
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

      {/* Search bar below buttons */}
      {/* Search bar below buttons */}
<div className="flex justify-center mt-8 w-full">
  <div className="flex w-fit min-w-[640px]">
    {/* Input with icon */}
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

    {/* Search button */}
    <button
      type="button"
      className="px-6 bg-black text-white rounded-r-md hover:bg-gray-900 transition"
      onClick={() => alert("Search clicked!")}
    >
      Search
    </button>
  </div>
</div>


      {/* Signed-in content */}
      <SignedIn>
        <div className="mx-auto mt-6 p-6 bg-white rounded-lg shadow-md flex flex-col items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Welcome!</h2>
          <p className="text-gray-600 mt-2">Here you go and enjoy!</p>
        </div>
      </SignedIn>
    </div>
  );
}

export default App;
