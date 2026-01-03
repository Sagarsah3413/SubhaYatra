import { useEffect, useRef, useState} from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaStar, FaArrowRight, FaLeaf, FaHeart, FaCamera } from "react-icons/fa";

import Shivapuri from "../assets/Nature/Shivapuri.jpeg";
import Lomanthang from "../assets/Nature/Lomanthang.jpeg";
import Langtang from "../assets/Nature/Langtang.jpeg";
import Bardiya from "../assets/Nature/Bardiya.jpeg";
import Khaptad from "../assets/Nature/Khaptad.jpeg";
import Gosaikunda from "../assets/Nature/Gosaikunda.jpeg";
import Shuklaphanta from "../assets/Nature/Shuklaphanta.jpeg";
import Ghandruk from "../assets/Nature/Ghandruk.jpeg";

const places = [
  { 
    id: 1, 
    name: "Shivapuri National Park", 
    img: Shivapuri,
    rating: 4.6,
    category: "National Park",
    description: "Pristine forest sanctuary with diverse wildlife and hiking trails",
    elevation: "2,732m",
    highlight: "Bird Watching"
  },
  { 
    id: 2, 
    name: "Lomanthang (Upper Mustang)", 
    img: Lomanthang,
    rating: 4.8,
    category: "Desert Landscape",
    description: "Ancient walled city in the trans-Himalayan desert region",
    elevation: "3,840m",
    highlight: "Forbidden Kingdom"
  },
  { 
    id: 3, 
    name: "Langtang Valley", 
    img: Langtang,
    rating: 4.9,
    category: "Alpine Valley",
    description: "Spectacular valley trek through rhododendron forests and glacial landscapes",
    elevation: "4,984m",
    highlight: "Glacier Views"
  },
  { 
    id: 4, 
    name: "Bardiya National Park", 
    img: Bardiya,
    rating: 4.7,
    category: "Wildlife Reserve",
    description: "Largest national park in Nepal's Terai region with Bengal tigers",
    elevation: "152m",
    highlight: "Tiger Safari"
  },
  { 
    id: 5, 
    name: "Khaptad National Park", 
    img: Khaptad,
    rating: 4.5,
    category: "Highland Plateau",
    description: "Peaceful plateau with rolling grasslands and spiritual significance",
    elevation: "3,050m",
    highlight: "Meditation Retreat"
  },
  { 
    id: 6, 
    name: "Gosaikunda Lake", 
    img: Gosaikunda,
    rating: 4.8,
    category: "Sacred Lake",
    description: "Holy alpine lake surrounded by towering peaks and prayer flags",
    elevation: "4,380m",
    highlight: "Pilgrimage Site"
  },
  { 
    id: 7, 
    name: "Shuklaphanta Wildlife Reserve", 
    img: Shuklaphanta,
    rating: 4.4,
    category: "Grassland Reserve",
    description: "Vast grassland ecosystem home to swamp deer and diverse bird species",
    elevation: "174m",
    highlight: "Swamp Deer"
  },
  { 
    id: 8, 
    name: "Ghandruk Village", 
    img: Ghandruk,
    rating: 4.7,
    category: "Mountain Village",
    description: "Traditional Gurung village with stunning Annapurna mountain views",
    elevation: "1,940m",
    highlight: "Cultural Experience"
  },
];

export default function NaturePlaces() {
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
    <section className="py-20 bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-slate-900 dark:via-emerald-900/10 dark:to-slate-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-green-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-teal-400/10 to-cyan-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-8xl mx-auto px-6">
        {/* Premium Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-full px-8 py-4 mb-8 border border-emerald-200 dark:border-emerald-800">
            <FaLeaf className="text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Natural Wonders</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-emerald-700 to-green-800 dark:from-white dark:via-emerald-200 dark:to-green-200 bg-clip-text text-transparent">
              Famous Natural Spots
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
              in Nepal
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Immerse yourself in Nepal's pristine wilderness, from alpine lakes to dense jungles and sacred mountains
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
            {places.concat(places).map((place, index) => (
              <div key={index} className="min-w-[350px] flex-shrink-0 group">
                <Link to="/all-nature-places" className="block">
                  <div className="relative bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 hover:scale-105 border border-gray-100 dark:border-slate-700">
                    {/* Image Container */}
                    <div className="relative h-72 overflow-hidden">
                      <img
                        src={place.img}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                        <span className="text-xs font-bold text-gray-900 dark:text-white">{place.category}</span>
                      </div>
                      
                      {/* Rating Badge */}
                      <div className="absolute top-4 right-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm px-3 py-2 rounded-full flex items-center gap-1 border border-white/20">
                        <FaStar className="text-yellow-500 text-sm" />
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{place.rating}</span>
                      </div>
                      
                      {/* Elevation Badge */}
                      <div className="absolute top-16 left-4 bg-emerald-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                        <span className="text-xs font-bold">{place.elevation}</span>
                      </div>
                      
                      {/* Highlight Badge */}
                      <div className="absolute bottom-4 left-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-2 rounded-full">
                        <span className="text-xs font-bold">{place.highlight}</span>
                      </div>
                      
                      {/* Action Icons */}
                      <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                          <FaCamera className="text-white text-sm" />
                        </div>
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                          <FaArrowRight className="text-white text-sm" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight flex-1">
                          {place.name}
                        </h3>
                        <FaHeart className="text-gray-300 hover:text-red-500 transition-colors duration-200 cursor-pointer ml-3 mt-1" />
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                        {place.description}
                      </p>
                      
                      {/* Stats and Action */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                            <FaMapMarkerAlt className="text-sm" />
                            <span className="text-sm font-medium">Nepal</span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Elevation: {place.elevation}
                          </div>
                        </div>
                        <div className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-200">
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
              to="/all-nature-places"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <span>View All Natural Spots</span>
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
