import { Link, NavLink, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import axios from "axios";

export default function Footer() {
  const location = useLocation();
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [showFullExplore, setShowFullExplore] = useState(false);
  const [email, setEmail] = useState("");

  const aboutText = `Roamio Wanderly is your trusted travel recommendation system. 
  It helps you plan personalized trips and discover destinations, hotels, restaurants, and activities tailored to your interests. 
  Explore hidden gems, receive curated suggestions, and make your travel experience unforgettable in Nepal.`;

  const exploreText = `With our Explore section, you can contribute by writing reviews or adding new places. 
  Your feedback helps other travelers make informed decisions and discover the best experiences around our country Nepal.`;

  // Refs & visibility state for reveal animations
  const aboutRef = useRef(null);
  const exploreRef = useRef(null);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [exploreVisible, setExploreVisible] = useState(false);

  useEffect(() => {
    const obsOptions = { threshold: 0.2 };
    const aboutEl = aboutRef.current;
    const exploreEl = exploreRef.current;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.target === aboutEl && e.isIntersecting) setAboutVisible(true);
        if (e.target === exploreEl && e.isIntersecting) setExploreVisible(true);
      });
    }, obsOptions);

    if (aboutEl) obs.observe(aboutEl);
    if (exploreEl) obs.observe(exploreEl);

    return () => obs.disconnect();
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (email) {
      try {
        const response = await axios.post('http://localhost:8000/users/subscribe', { email });
        alert(response.data.message || 'Subscription successful!');
        setEmail("");
      } catch (error) {
        alert('Subscription failed. Please try again.');
        console.error('Subscription error:', error);
      }
    }
  };

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-800 text-white mt-20">
      {/* Grid Layout for Professional Look */}
      <div className="max-w-7xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* About Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-amber-400">
            About Roamio Wanderly
          </h2>
          <p ref={aboutRef} className={`text-sm text-gray-300 leading-relaxed transition-opacity duration-700 ${aboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {showFullAbout ? aboutText : `${aboutText.substring(0, 150)}...`}
          </p>
          <button
            className="text-amber-400 text-sm mt-2 hover:underline"
            onClick={() => setShowFullAbout(!showFullAbout)}
          >
            {showFullAbout ? "See Less" : "See More"}
          </button>

          <div className="flex flex-col gap-2 mt-6">
            <Link
              to="/about"
              className={`text-base hover:text-teal-400 transition ${
                location.pathname === "/about" ? "text-teal-400 font-medium" : ""
              }`}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className={`text-base hover:text-teal-400 transition ${
                location.pathname === "/contact" ? "text-teal-400 font-medium" : ""
              }`}
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Explore Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-amber-400">Explore</h2>
          <p ref={exploreRef} className={`text-sm text-gray-300 leading-relaxed transition-transform duration-800 ${exploreVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'}`}>
            {showFullExplore ? exploreText : `${exploreText.substring(0, 150)}...`}
          </p>
          <button
            className="text-amber-400 text-sm mt-2 hover:underline"
            onClick={() => setShowFullExplore(!showFullExplore)}
          >
            {showFullExplore ? "See Less" : "See More"}
          </button>

          <div className="flex flex-col gap-2 mt-6">
            <NavLink
              to="/write-review"
              className={({ isActive }) =>
                `text-base transition hover:text-teal-400 ${isActive ? "text-teal-400 font-medium" : ""}`
              }
            >
              Write a Review
            </NavLink>
            <Link
              to="/add-place"
              className="text-base hover:text-teal-400 transition"
            >
              Add a Place
            </Link>
            <a
              href="https://www.google.com/maps/place/Nepal?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base hover:text-teal-400 transition"
            >
              Site Map
            </a>
          </div>

        </div>

        {/* Subscription Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-amber-400">
            Stay Updated
          </h2>
          <p className="text-sm text-gray-300 mb-4">
            Subscribe to get the latest travel updates, tour news, and hidden gems in Nepal.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="px-3 py-2 rounded-md text-white w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
            <button
              type="submit"
              className="bg-teal-400 hover:bg-amber-400 text-white font-medium px-4 py-2 rounded-md transition w-full"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Social Icons */}
      <div className="flex justify-center gap-6 pb-6">
        <a
          href={import.meta.env.VITE_FACEBOOK_URL || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl text-teal-400 hover:text-amber-400 transition"
        >
          <FaFacebook />
        </a>
        <a
          href={import.meta.env.VITE_INSTAGRAM_URL || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl text-teal-400 hover:text-amber-400 transition"
        >
          <FaInstagram />
        </a>
      </div>

      {/* Copyright */}
      <div className="text-center border-t border-teal-400 py-4 text-sm text-gray-400">
        © {new Date().getFullYear()} Roamio Wanderly. All rights reserved.
      </div>
    </footer>
  );
}