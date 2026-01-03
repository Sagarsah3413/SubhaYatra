import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaStar, FaArrowRight } from "react-icons/fa";

// Import the video
import backgroundVideo from "../assets/IMG_8851.MP4";

// ✅ Import all images
import Basantapur from "../assets/Basantapur.jpeg";
import Bhainsepati from "../assets/Bhainsepati.jpeg";
import BhaktapurDurbarSquare from "../assets/Bhaktapur-Durbar-Square.jpeg";
import Boudhanath from "../assets/Boudhanath-Stupa.jpeg";
import ChanguNarayan from "../assets/Changu-Narayan-Temple.jpeg";
import Dakshinkali from "../assets/Dakshinkali-Temple.jpeg";
import KathmanduDurbar from "../assets/Kathmandu-Durbar-Square.jpeg";
import Kathmandu from "../assets/Kathmandu.jpeg";

// ✅ Enhanced spots data with professional details
const spots = [
  { 
    id: 1, 
    name: "Basantapur Durbar Square", 
    img: Basantapur,
    rating: 4.8,
    category: "Heritage Site",
    description: "Ancient royal palace complex with stunning architecture"
  },
  { 
    id: 2, 
    name: "Bhainsepati", 
    img: Bhainsepati,
    rating: 4.5,
    category: "Cultural Site",
    description: "Traditional Newari settlement with authentic culture"
  },
  { 
    id: 3, 
    name: "Bhaktapur Durbar Square", 
    img: BhaktapurDurbarSquare,
    rating: 4.9,
    category: "UNESCO Site",
    description: "Medieval city showcasing exquisite craftsmanship"
  },
  { 
    id: 4, 
    name: "Boudhanath Stupa", 
    img: Boudhanath,
    rating: 4.7,
    category: "Buddhist Site",
    description: "One of the largest Buddhist stupas in the world"
  },
  { 
    id: 5, 
    name: "Changu Narayan Temple", 
    img: ChanguNarayan,
    rating: 4.6,
    category: "Hindu Temple",
    description: "Ancient temple dedicated to Lord Vishnu"
  },
  { 
    id: 6, 
    name: "Dakshinkali Temple", 
    img: Dakshinkali,
    rating: 4.4,
    category: "Hindu Temple",
    description: "Sacred temple dedicated to Goddess Kali"
  },
  { 
    id: 7, 
    name: "Kathmandu Durbar Square", 
    img: KathmanduDurbar,
    rating: 4.8,
    category: "Royal Palace",
    description: "Historic seat of royalty with magnificent palaces"
  },
  { 
    id: 8, 
    name: "Kathmandu City View", 
    img: Kathmandu,
    rating: 4.3,
    category: "City Experience",
    description: "Panoramic views of the bustling capital city"
  },
];

export default function ExploreSection() {
  const scrollRef = useRef(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let scrollAmount = 0;
    let animationFrame;

    const step = () => {
      if (scrollContainer && !paused) {
        scrollAmount += 0.5;
        if (scrollAmount >= scrollContainer.scrollWidth / 2) {
          scrollAmount = 0;
        }
        scrollContainer.scrollLeft = scrollAmount;
      }
      animationFrame = requestAnimationFrame(step);
    };

    animationFrame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrame);
  }, [paused]);

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.6)" }}
        >
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Video Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/70"></div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-400/10 to-cyan-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-indigo-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-20 max-w-8xl mx-auto px-6">
        {/* Premium Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-xl rounded-full px-8 py-4 mb-8 border border-white/30">
            <FaMapMarkerAlt className="text-white" />
            <span className="text-sm font-semibold text-white">Kathmandu Valley Experiences</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-teal-200 to-cyan-200 bg-clip-text text-transparent">
              Explore Experiences
            </span>
            <br />
            <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
              Near Capital
            </span>
          </h2>
          
          <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Discover the rich cultural heritage and ancient wonders surrounding Nepal's historic capital
          </p>
        </div>

        {/* Professional Scrolling Gallery */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex space-x-8 overflow-x-hidden cursor-pointer pb-4"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {spots.concat(spots).map((place, index) => (
              <div key={index} className="min-w-[320px] flex-shrink-0 group">
                <Link to="/all-places-detail" className="block">
                  <div className="relative bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 hover:scale-105 border border-gray-100 dark:border-slate-700">
                    {/* Image Container */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={place.img}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-4 py-2 rounded-full">
                        <span className="text-xs font-bold text-gray-900 dark:text-white">{place.category}</span>
                      </div>
                      
                      {/* Rating Badge */}
                      <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-2 rounded-full flex items-center gap-1">
                        <FaStar className="text-yellow-500 text-sm" />
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{place.rating}</span>
                      </div>
                      
                      {/* Hover Arrow */}
                      <div className="absolute bottom-4 right-4 w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <FaArrowRight className="text-white" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                        {place.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                        {place.description}
                      </p>
                      
                      {/* Action Button */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                          <FaMapMarkerAlt className="text-sm" />
                          <span className="text-sm font-medium">Kathmandu Valley</span>
                        </div>
                        <div className="text-teal-600 dark:text-teal-400 font-semibold text-sm group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors duration-200">
                          Explore →
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          
          {/* View All Button */}
          <div className="text-center mt-12">
            <Link 
              to="/all-places-detail"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <span>View All Experiences</span>
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}