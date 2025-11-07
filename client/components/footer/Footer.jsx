import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Footer() {
  const location = useLocation();
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [showFullExplore, setShowFullExplore] = useState(false);

  // Website description
  const aboutText = `Roamio Wanderly is your trusted travel recommendation system. 
It helps you plan personalized trips and discover destinations, hotels, restaurants, and activities tailored to your interests. 
Explore hidden gems, receive curated suggestions, and make your travel experience unforgettable in Nepal`;

  const exploreText = `With our Explore section, you can contribute by writing reviews or adding new places. 
Your feedback helps other travelers make informed decisions and discover the best experiences around our country Nepal.`;

  return (
    <footer className="bg-gray-200 text-black mt-20">
      <div className="max-w-6xl mx-auto py-10 px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left section - About */}
        <div>
          <h2 className="text-xl font-semibold mb-4">About Roamio Wanderly</h2>
          <div className="flex flex-col gap-3 mb-4">
            <Link
              to="/about"
              className={`text-base font-medium self-start border-b-[1.5px] border-transparent hover:border-black transition-all duration-200 ${
                location.pathname === "/about" ? "border-black" : ""
              }`}
              style={{ width: "fit-content" }}
            >
              About Us
            </Link>

            <Link
              to="/contact"
              className={`text-base font-medium self-start border-b-[1.5px] border-transparent hover:border-black transition-all duration-200 ${
                location.pathname === "/contact" ? "border-black" : ""
              }`}
              style={{ width: "fit-content" }}
            >
              Contact Us
            </Link>
          </div>

          {/* About Text */}
          <p className="text-sm text-gray-700">
            {showFullAbout ? aboutText : `${aboutText.substring(0, 150)}...`}
          </p>
          <button
            className="text-pink-600 text-sm mt-2 hover:underline"
            onClick={() => setShowFullAbout(!showFullAbout)}
          >
            {showFullAbout ? "See Less" : "See More"}
          </button>
        </div>

        {/* Middle section - Explore */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Explore</h2>
          <div className="flex flex-col gap-3 mb-4">
            <Link
              to="/write-review"
              className="text-base font-medium self-start border-b-[1.5px] border-transparent hover:border-black transition-all duration-200"
              style={{ width: "fit-content" }}
            >
              Write a Review
            </Link>

            <Link
              to="/add-place"
              className="text-base font-medium self-start border-b-[1.5px] border-transparent hover:border-black transition-all duration-200"
              style={{ width: "fit-content" }}
            >
              Add a Place
            </Link>

            {/* ✅ Site Map Link opens Google Maps in new tab */}
            <a
              href="https://www.google.com/maps/place/Nepal?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-medium self-start border-b-[1.5px] border-transparent hover:border-black transition-all duration-200"
              style={{ width: "fit-content" }}
            >
              Site Map
            </a>
          </div>

          {/* Optional Explore description */}
          <p className="text-sm text-gray-700">
            {showFullExplore ? exploreText : `${exploreText.substring(0, 150)}...`}
          </p>
          <button
            className="text-pink-600 text-sm mt-2 hover:underline"
            onClick={() => setShowFullExplore(!showFullExplore)}
          >
            {showFullExplore ? "See Less" : "See More"}
          </button>
        </div>
      </div>

      {/* Footer bottom line */}
      <div className="text-center border-t border-gray-400 py-4 text-sm">
        © {new Date().getFullYear()} Roamio Wanderly. All rights reserved.
      </div>
    </footer>
  );
}
