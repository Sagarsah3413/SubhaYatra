import React from "react";
import { UserButton, SignUpButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    // Navigate to homepage without reloading
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full px-6 py-4 bg-pink-100 border-b shadow-sm flex justify-between items-center">
      {/* Logo + App Name */}
      <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
        <span className="text-2xl md:text-2xl font-bold">🌄</span>
        <span className="ml-0 text-2xl md:text-2xl font-serif Times New Roman text-pink-500 hidden md:inline">
          Roamio Wanderly
        </span>
      </div>

      {/* Navigation / Sign Up / UserButton */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="px-2 py-1 text-pink-600 hover:text-pink-800 font-semibold"
        >
          Home
        </button>
        <button className="px-2 py-1 text-pink-600 hover:text-pink-800 font-semibold">
          About Us
        </button>
        <button className="px-2 py-1 text-pink-600 hover:text-pink-800 font-semibold">
          Contact Us
        </button>

        {/* Sign Up / UserButton */}
        <SignedOut>
          <SignUpButton>
            <button className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </header>
  );
};
