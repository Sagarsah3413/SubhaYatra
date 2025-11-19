import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";

export default function Footer() {
  const location = useLocation();
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [showFullExplore, setShowFullExplore] = useState(false);

  const aboutText = `Roamio Wanderly is your trusted travel recommendation system. 
  It helps you plan personalized trips and discover destinations, hotels, restaurants, and activities tailored to your interests. 
  Explore hidden gems, receive curated suggestions, and make your travel experience unforgettable in Nepal`;

  const exploreText = `With our Explore section, you can contribute by writing reviews or adding new places. 
  Your feedback helps other travelers make informed decisions and discover the best experiences around our country Nepal.`;

  return (
    <footer className="bg-gray-200 text-black mt-20">

      {/* CENTERED SECTIONS */}
      <div className="max-w-6xl mx-auto py-10 px-6 flex justify-center items-start gap-20 flex-wrap">

        {/* About Section */}
        <div className="text-center max-w-sm">
          <h2 className="text-xl font-semibold mb-4">About Roamio Wanderly</h2>

          <div className="flex flex-col gap-3 mb-4 items-center">
            <Link
              to="/about"
              className={`text-base font-medium border-b-[1.5px] border-transparent hover:border-black transition-all duration-200 ${
                location.pathname === "/about" ? "border-black" : ""
              }`}
              style={{ width: "fit-content" }}
            >
              About Us
            </Link>

            <Link
              to="/contact"
              className={`text-base font-medium border-b-[1.5px] border-transparent hover:border-black transition-all duration-200 ${
                location.pathname === "/contact" ? "border-black" : ""
              }`}
              style={{ width: "fit-content" }}
            >
              Contact Us
            </Link>
          </div>

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

        {/* Explore Section */}
        <div className="text-center max-w-sm">
          <h2 className="text-xl font-semibold mb-4">Explore</h2>

          <div className="flex flex-col gap-3 mb-4 items-center">
            <Link
              to="/write-review"
              className="text-base font-medium border-b-[1.5px] border-transparent hover:border-black transition-all duration-200"
              style={{ width: "fit-content" }}
            >
              Write a Review
            </Link>

            <Link
              to="/add-place"
              className="text-base font-medium border-b-[1.5px] border-transparent hover:border-black transition-all duration-200"
              style={{ width: "fit-content" }}
            >
              Add a Place
            </Link>

            <a
              href="https://www.google.com/maps/place/Nepal?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-medium border-b-[1.5px] border-transparent hover:border-black transition-all duration-200"
              style={{ width: "fit-content" }}
            >
              Site Map
            </a>
          </div>

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

      {/* Social Icons */}
      <div className="flex justify-center gap-6 pb-4">
        <a
          href="https://www.facebook.com/sakshi.singh.691437"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl text-blue-700 hover:opacity-80 transition"
        >
          <FaFacebook />
        </a>

        <a
          href="https://www.instagram.com/sakshisingh_0817/?hl=en"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl text-pink-600 hover:opacity-80 transition"
        >
          <FaInstagram />
        </a>
      </div>

      {/* Copyright */}
      <div className="text-center border-t border-gray-400 py-4 text-sm">
        © {new Date().getFullYear()} Roamio Wanderly. All rights reserved.
      </div>

    </footer>
  );
}
