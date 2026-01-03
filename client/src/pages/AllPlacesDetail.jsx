import React, { useState, useEffect } from "react";
import { FaStar, FaMapMarkerAlt, FaClock, FaCamera, FaHeart, FaShare, FaArrowLeft, FaCalendarAlt, FaUsers, FaRoute } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/header/Header";
import { useTheme } from "../contexts/ThemeContext";

import Basantapur from "../assets/Basantapur.jpeg";
import Bhainsepati from "../assets/Bhainsepati.jpeg";
import BhaktapurDurbarSquare from "../assets/Bhaktapur-Durbar-Square.jpeg";
import Boudhanath from "../assets/Boudhanath-Stupa.jpeg";
import ChanguNarayan from "../assets/Changu-Narayan-Temple.jpeg";
import Dakshinkali from "../assets/Dakshinkali-Temple.jpeg";
import KathmanduDurbar from "../assets/Kathmandu-Durbar-Square.jpeg";
import Kathmandu from "../assets/Kathmandu.jpeg";

const spots = [
  {
    id: 1,
    name: "Basantapur Durbar Square",
    description: "Basantapur, located in the heart of old Kathmandu, serves as the historic core and cultural heartbeat of the city, centered around the renowned Kathmandu Durbar Square, a UNESCO World Heritage Site. This vibrant public square and former royal palace complex is a stunning example of traditional Newar architecture, housing a myriad of temples, courtyards, and significant landmarks such as the Hanuman Dhoka Palace, the Kumari Ghar (residence of the Living Goddess), and the imposing Kaal Bhairav statue.",
    img: Basantapur,
    rating: 4.8,
    category: "UNESCO Heritage Site",
    visitTime: "2-3 hours",
    bestTime: "Morning (8-11 AM)",
    entryFee: "NPR 1000 (Foreigners)",
    highlights: ["Living Goddess Kumari", "Ancient Architecture", "Royal Palace Complex"],
    location: "Kathmandu Durbar Square, Kathmandu",
    established: "12th Century"
  },
  {
    id: 2,
    name: "Bhainsepati",
    description: "Bhainsepati is a rapidly developing and highly sought-after residential area located in the Lalitpur district of the Kathmandu Valley, recognized for offering a balance of suburban tranquility and modern urban conveniences. Situated approximately 3.5 km from the Ekantakuna Ring Road, it has become a prime location for high-ranking government officials, businessmen, and expatriates.",
    img: Bhainsepati,
    rating: 4.5,
    category: "Residential Area",
    visitTime: "1-2 hours",
    bestTime: "Anytime",
    entryFee: "Free",
    highlights: ["Modern Infrastructure", "Peaceful Environment", "Scenic Views"],
    location: "Lalitpur District, Kathmandu Valley",
    established: "Modern Development"
  },
  {
    id: 3,
    name: "Bhaktapur Durbar Square",
    description: "Bhaktapur Durbar Square, a UNESCO World Heritage Site, is a spectacular open museum of medieval Newar art and architecture and the historic royal palace complex of the Malla kings who ruled the Bhaktapur Kingdom. Unlike the other Durbar Squares in the Kathmandu Valley, Bhaktapur has resisted rapid modernization, preserving an authentic traditional way of life.",
    img: BhaktapurDurbarSquare,
    rating: 4.9,
    category: "UNESCO Heritage Site",
    visitTime: "3-4 hours",
    bestTime: "Early Morning (7-10 AM)",
    entryFee: "NPR 1500 (Foreigners)",
    highlights: ["Fifty-five Window Palace", "Golden Gate", "Traditional Crafts"],
    location: "Bhaktapur, Kathmandu Valley",
    established: "12th Century"
  },
  {
    id: 4,
    name: "Boudhanath Stupa",
    description: "Boudhanath Stupa, located approximately 11 km from the center and northeastern outskirts of Kathmandu, is one of the largest spherical stupas in Nepal and a focal point of Tibetan Buddhism. Recognized as a UNESCO World Heritage Site, this iconic white dome structure with a gilded tower painted with the all-seeing eyes of the Buddha serves as a major pilgrimage site.",
    img: Boudhanath,
    rating: 4.7,
    category: "Buddhist Monument",
    visitTime: "1-2 hours",
    bestTime: "Evening (5-7 PM)",
    entryFee: "NPR 400 (Foreigners)",
    highlights: ["Prayer Wheels", "Tibetan Monasteries", "Spiritual Atmosphere"],
    location: "Boudha, Kathmandu",
    established: "5th Century"
  },
  {
    id: 5,
    name: "Changu Narayan Temple",
    description: "Changu Narayan Temple is a UNESCO World Heritage Site and one of the oldest Hindu temples in the Kathmandu Valley, dedicated to Lord Vishnu. Located on a hilltop approximately 12 kilometers east of Kathmandu and north of Bhaktapur, the temple complex showcases exquisite ancient art and architecture from the Lichhavi period.",
    img: ChanguNarayan,
    rating: 4.6,
    category: "Hindu Temple",
    visitTime: "1-2 hours",
    bestTime: "Morning (8-11 AM)",
    entryFee: "NPR 300 (Foreigners)",
    highlights: ["Ancient Sculptures", "Hilltop Views", "Lichhavi Art"],
    location: "Changu, Bhaktapur",
    established: "4th Century"
  },
  {
    id: 6,
    name: "Dakshinkali Temple",
    description: "The Dakshinkali Temple is a highly significant Hindu pilgrimage site located approximately 22 kilometers south of Kathmandu, nestled at the confluence of two sacred rivers amidst a serene, forested area. Dedicated to the fierce and powerful Goddess Kali, the temple is renowned for its distinctive and intense rituals.",
    img: Dakshinkali,
    rating: 4.4,
    category: "Hindu Temple",
    visitTime: "2-3 hours",
    bestTime: "Tuesday & Saturday",
    entryFee: "Free",
    highlights: ["Goddess Kali", "Sacred Rituals", "Natural Setting"],
    location: "Pharping, Kathmandu",
    established: "Ancient"
  },
  {
    id: 7,
    name: "Kathmandu Durbar Square",
    description: "Located in the heart of Kathmandu, this square is home to the Kumari Ghar and many historic temples of the Malla era. The square represents the cultural and architectural heritage of Nepal with its intricate wood carvings and ancient palaces.",
    img: KathmanduDurbar,
    rating: 4.7,
    category: "UNESCO Heritage Site",
    visitTime: "2-3 hours",
    bestTime: "Morning (8-11 AM)",
    entryFee: "NPR 1000 (Foreigners)",
    highlights: ["Kumari Ghar", "Malla Architecture", "Historic Temples"],
    location: "Kathmandu Durbar Square, Kathmandu",
    established: "12th Century"
  },
  {
    id: 8,
    name: "Kathmandu City",
    description: "Kathmandu, the capital and most populous city of Nepal, is a vibrant metropolis nestled in a bowl-shaped valley surrounded by the Himalayas, serving as the nation's cultural, economic, and political epicenter. Renowned as the City of Temples, it is one of the world's oldest continuously inhabited places.",
    img: Kathmandu,
    rating: 4.3,
    category: "Capital City",
    visitTime: "Full Day",
    bestTime: "October to March",
    entryFee: "Free",
    highlights: ["City of Temples", "Cultural Hub", "Gateway to Himalayas"],
    location: "Kathmandu Valley, Nepal",
    established: "Ancient"
  },
];

export default function AllPlacesDetail() {
  const navigate = useNavigate();
  const { bgClass, textClass } = useTheme();
  const [favorites, setFavorites] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("rating");

  const categories = ["All", "UNESCO Heritage Site", "Hindu Temple", "Buddhist Monument", "Capital City", "Residential Area"];

  const filteredSpots = spots.filter(spot => 
    selectedCategory === "All" || spot.category === selectedCategory
  ).sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  return (
    <div className={`min-h-screen ${bgClass} ${textClass}`}>
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors duration-200"
          >
            <FaArrowLeft />
            <span>Back to Home</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-cyan-100 to-teal-100 bg-clip-text text-transparent">
                Explore Experiences
              </span>
              <br />
              <span className="text-white">Near Capital</span>
            </h1>
            <p className="text-xl md:text-2xl text-cyan-100 max-w-3xl mx-auto leading-relaxed">
              Discover the rich cultural heritage and ancient wonders surrounding Nepal's historic capital
            </p>
            
            <div className="flex flex-wrap justify-center items-center gap-8 mt-8 text-white/80">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt />
                <span>{filteredSpots.length} Destinations</span>
              </div>
              <div className="flex items-center gap-2">
                <FaStar />
                <span>UNESCO Heritage Sites</span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock />
                <span>Rich History</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-teal-600 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-slate-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            {/* Sort Options */}
            <div className="flex items-center gap-4">
              <span className="text-gray-600 dark:text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-teal-500"
              >
                <option value="rating">Rating</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Places Grid */}
      <section className="py-16 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-16">
            {filteredSpots.map((spot, index) => (
              <div
                key={spot.id}
                className={`group flex flex-col ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
                } items-center gap-12 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-slate-700`}
              >
                {/* Image Section */}
                <div className="w-full lg:w-1/2 relative">
                  <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-700">
                    <img
                      src={spot.img}
                      alt={spot.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{spot.category}</span>
                    </div>
                    
                    {/* Rating Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-2 rounded-full flex items-center gap-1">
                      <FaStar className="text-yellow-500 text-sm" />
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{spot.rating}</span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => toggleFavorite(spot.id)}
                        className={`w-12 h-12 rounded-full backdrop-blur-sm border border-white/30 flex items-center justify-center transition-colors duration-200 ${
                          favorites.has(spot.id)
                            ? "bg-red-500 text-white"
                            : "bg-white/20 text-white hover:bg-white/30"
                        }`}
                      >
                        <FaHeart />
                      </button>
                      <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-white hover:bg-white/30 transition-colors duration-200 flex items-center justify-center">
                        <FaShare />
                      </button>
                      <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-white hover:bg-white/30 transition-colors duration-200 flex items-center justify-center">
                        <FaCamera />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="w-full lg:w-1/2 space-y-6">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                      {spot.name}
                    </h2>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
                      <FaMapMarkerAlt />
                      <span>{spot.location}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    {spot.description}
                  </p>
                  
                  {/* Highlights */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Highlights</h3>
                    <div className="flex flex-wrap gap-2">
                      {spot.highlights.map((highlight, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-sm font-medium"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                        <FaClock />
                        <span className="text-sm">Visit Duration</span>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">{spot.visitTime}</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                        <FaCalendarAlt />
                        <span className="text-sm">Best Time</span>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">{spot.bestTime}</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                        <FaUsers />
                        <span className="text-sm">Entry Fee</span>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">{spot.entryFee}</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                        <FaRoute />
                        <span className="text-sm">Established</span>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">{spot.established}</span>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <button className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    Plan Your Visit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}