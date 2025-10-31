import React from "react";

const SplashScreen = ({ onStart }) => {
  return (
    <div className="h-screen bg-pink-200 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-6">🌄 Roamio Wanderly 🌄</h1>
      <p className="text-xl mb-10">Your ultimate travel companion!</p>
      <button
        onClick={onStart}
        className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
      >
        Get Started
      </button>
    </div>
  );
};

export default SplashScreen;
