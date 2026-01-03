import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaStar, FaArrowRight, FaMountain, FaHeart } from "react-icons/fa";

// Import the video
import backgroundVideo from "../assets/IMG_8851.MP4";

// Importing famous tourist spot images
import Pokhara from "../assets/Fspots/Pokhara.jpg";
import lumbini from "../assets/Fspots/Lumbini.jpeg";
import chitwan from "../assets/Fspots/Chitwan.jpeg";
import ABC from "../assets/Fspots/ABC.jpeg";
import Mustang from "../assets/Fspots/Mustang.jpeg";
import Pashupatinath from "../assets/Fspots/Pashupatinath.jpeg";
import Swayambhunath from "../assets/Fspots/Swayambhunath.jpeg";
import Nagarkot from "../assets/Fspots/Nagarkot.jpeg";

const spots = [
  { 
    id: 1, 
    name: "Pokhara", 
    img: Pokhara,
    rating: 4.9,
    category: "Lake City",
    description: "Serene lakes surrounded by towering Himalayan peaks",
    visitors: "2M+ annually",
    highlight: "Adventure Hub"
  },
  { 
    id: 2, 
    name: "Lumbini", 
    img: lumbini,
    rating: 4.8,
    category: "UNESCO Site",
    description: "Sacred birthplace of Lord Buddha and pilgrimage destination",
    visitors: "500K+ annually",
    highlight: "Spiritual Journey"
  },
  { 
    id: 3, 
    name: "Chitwan National Park", 
    img: chitwan,
    rating: 4.7,
    category: "Wildlife Reserve",
    description: "UNESCO World Heritage wildlife sanctuary with diverse fauna",
    visitors: "300K+ annually",
    highlight: "Wildlife Safari"
  },
  { 
    id: 4, 
    name: "Annapurna Base Camp", 
    img: ABC,
    rating: 4.9,
    category: "Trekking",
    description: "World-renowned trekking route through diverse landscapes",
    visitors: "150K+ annually",
    highlight: "Epic Trek"
  },
  { 
    id: 5, 
    name: "Upper Mustang", 
    img: Mustang,
    rating: 4.6,
    category: "Hidden Kingdom",
    description: "Ancient forbidden kingdom with unique Tibetan culture",
    visitors: "25K+ annually",
    highlight: "Exclusive Access"
  },
  { 
    id: 6, 
    name: "Pashupatinath", 
    img: Pashupatinath,
    rating: 4.8,
    category: "Hindu Temple",
    description: "Sacred Hindu temple complex on the banks of Bagmati River",
    visitors: "1M+ annually",
    highlight: "Sacred Site"
  },
  { 
    id: 7, 
    name: "Swayambhunath", 
    img: Swayambhunath,
    rating: 4.7,
    category: "Buddhist Stupa",
    description: "Ancient Buddhist stupa offering panoramic valley views",
    visitors: "800K+ annually",
    highlight: "Monkey Temple"
  },
  { 
    id: 8, 
    name: "Nagarkot", 
    img: Nagarkot,
    rating: 4.5,
    category: "Hill Station",
    description: "Popular hill station famous for sunrise and mountain views",
    visitors: "400K+ annually",
    highlight: "Sunrise Views"
  },
];

export default function FamousSpots() {
  const scrollRef = useRef(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let scrollAmount = 0;

    const scrollInterval = setInterval(() => {
      if (scrollContainer && !paused) {
        scrollAmount += 0.5;
        if (scrollAmount >= scrollContainer.scrollWidth / 2) {
          scrollAmount = 0;
        }
        scrollContainer.scrollTo({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    }, 20);

    return () => clearInterval(scrollInterval);
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
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-teal-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-20 max-w-8xl mx-auto px-6">
        {/* Premium Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-xl rounded-full px-8 py-4 mb-8 border border-white/30">
            <FaMountain className="text-white" />
            <span className="text-sm font-semibold text-white">Must-Visit Destinations</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Famous Tourist Spots
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              in Nepal
            </span>
          </h2>
          
          <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Discover Nepal's most iconic destinations, from sacred temples to breathtaking mountain vistas
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
            {spots.concat(spots).map((spot, index) => (
              <div key={index} className="min-w-[350px] flex-shrink-0 group">
                <Link to="/all-famous-spots" className="block">
                  <div className="relative bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 hover:scale-105 border border-gray-100 dark:border-slate-700">
                    {/* Image Container */}
                    <div className="relative h-72 overflow-hidden">
                      <img
                        src={spot.img}
                        alt={spot.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                        <span className="text-xs font-bold text-gray-900 dark:text-white">{spot.category}</span>
                      </div>
                      
                      {/* Rating Badge */}
                      <div className="absolute top-4 right-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm px-3 py-2 rounded-full flex items-center gap-1 border border-white/20">
                        <FaStar className="text-yellow-500 text-sm" />
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{spot.rating}</span>
                      </div>
                      
                      {/* Highlight Badge */}
                      <div className="absolute bottom-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full">
                        <span className="text-xs font-bold">{spot.highlight}</span>
                      </div>
                      
                      {/* Hover Arrow */}
                      <div className="absolute bottom-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 border border-white/30">
                        <FaArrowRight className="text-white" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight flex-1">
                          {spot.name}
                        </h3>
                        <FaHeart className="text-gray-300 hover:text-red-500 transition-colors duration-200 cursor-pointer ml-3 mt-1" />
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                        {spot.description}
                      </p>
                      
                      {/* Stats and Action */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                            <FaMapMarkerAlt className="text-sm" />
                            <span className="text-sm font-medium">Nepal</span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {spot.visitors}
                          </div>
                        </div>
                        <div className="text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200">
                          Discover →
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
              to="/all-famous-spots"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <span>View All Famous Spots</span>
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
