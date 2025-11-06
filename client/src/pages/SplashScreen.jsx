import React from "react";

const SplashScreen = ({ onStart }) => {
  return (
    <div
      className="w-full h-screen bg-gradient-to-br from-pink-300 to-purple-300 flex flex-col justify-center items-center cursor-pointer"
      onClick={onStart} // click anywhere triggers homepage
    >
      <h1 className="text-4xl font-bold text-white mb-4">🌄 Roamio Wanderly</h1>
      <p className="text-white text-lg">Tap anywhere to start exploring!</p>
    </div>
  );
};

export default SplashScreen;
