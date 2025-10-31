import { useState } from "react";
import { Header } from "../components/header/Header";
import "./App.css";
import { SignedIn } from "@clerk/clerk-react";
import SplashScreen from "./pages/SplashScreen"; // adjust path if needed

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [message, setMessage] = useState("");

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
        <p className="font-bold text-black uppercase text-center text-xl mt-8">

          {message}
        </p>
      )}

      {/* Buttons immediately below message */}
      <div className="flex flex-wrap justify-center gap-4 mt-7">
        <button
          className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition"
          onClick={() => setMessage("WHERE SHALL OUR ADVENTURE BEGIN? ✨")}
        >
          Search All
        </button>
        <button
          className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition"
          onClick={() => setMessage("A COZY STAY AWAITS… 🏨")}
        >
          Hotels
        </button>
        <button
          className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition"
          onClick={() => setMessage("EXCITING EXPERIENCES AHEAD! 🎢")}
        >
          Things To Do
        </button>
        <button
          className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition"
          onClick={() => setMessage("TIME TO TANTALIZE YOUR TASTE BUDS 🍴")}
        >
          Restaurants
        </button>
      </div>

      {/* Signed-in content */}
      <SignedIn>
        <div className="mx-auto mt-4 p-6 bg-white rounded-lg shadow-md flex flex-col items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Welcome 💖</h2>
          <p className="text-gray-600 mt-2">Here you go and enjoy! 😉</p>
        </div>
      </SignedIn>
    </div>
  );
}

export default App;
