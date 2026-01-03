import React, { useState, useEffect } from "react";
import { FaStar, FaMapMarkerAlt, FaClock, FaCamera, FaHeart, FaShare, FaArrowLeft, FaCalendarAlt, FaUsers, FaMountain, FaRoute, FaTemperatureHigh } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/header/Header";
import { useTheme } from "../contexts/ThemeContext";

// ✅ Import images
import Pokhara from "../assets/Fspots/Pokhara.jpg";
import Lumbini from "../assets/Fspots/Lumbini.jpeg";
import Chitwan from "../assets/Fspots/Chitwan.jpeg";
import ABC from "../assets/Fspots/ABC.jpeg";
import Mustang from "../assets/Fspots/Mustang.jpeg";
import Pashupatinath from "../assets/Fspots/Pashupatinath.jpeg";
import Swayambhunath from "../assets/Fspots/Swayambhunath.jpeg";
import Nagarkot from "../assets/Fspots/Nagarkot.jpeg";

// ✅ Enhanced famous spots data
const famousSpots = [
  {
    id: 1,
    name: "Pokhara",
    description: "Pokhara, the tourism capital of Nepal, is a stunning valley city famous for its serene lakes, adventure sports, and breathtaking views of the Annapurna range. This enchanting destination offers the perfect blend of natural beauty and thrilling activities, making it a paradise for both adventure seekers and peace lovers.",
    img: Pokhara,
    rating: 4.9,
    category: "Lake City",
    visitTime: "3-5 days",
    bestTime: "October to March",
    entryFee: "Free",
    altitude: "822m",
    highlights: ["Phewa Lake", "Sarangkot Sunrise", "World Peace Pagoda", "Adventure Sports"],
    location: "Gandaki Province, Nepal",
    established: "Ancient Settlement",
    activities: ["Paragliding", "Boating", "Trekking", "Zip-lining"],
    temperature: "15-25°C"
  },
  {
    id: 2,
    name: "Lumbini",
    description: "Lumbini is the birthplace of Lord Buddha and a UNESCO World Heritage Site that holds immense spiritual significance for millions of Buddhists worldwide. This sacred pilgrimage destination features ancient ruins, peaceful monasteries, and beautiful gardens that create an atmosphere of tranquility and enlightenment.",
    img: Lumbini,
    rating: 4.8,
    category: "UNESCO Heritage Site",
    visitTime: "1-2 days",
    bestTime: "October to March",
    entryFee: "Free",
    altitude: "150m",
    highlights: ["Maya Devi Temple", "Ashoka Pillar", "International Monasteries", "Sacred Garden"],
    location: "Rupandehi District, Nepal",
    established: "6th Century BC",
    activities: ["Meditation", "Pilgrimage", "Cultural Tours", "Photography"],
    temperature: "20-30°C"
  },
  {
    id: 3,
    name: "Chitwan National Park",
    description: "Chitwan National Park, Nepal's first national park and a UNESCO World Heritage Site, is home to the endangered one-horned rhinoceros, Bengal tigers, and over 500 species of birds. This pristine wilderness offers incredible wildlife experiences and insights into the rich biodiversity of the Terai region.",
    img: Chitwan,
    rating: 4.7,
    category: "National Park",
    visitTime: "2-3 days",
    bestTime: "October to March",
    entryFee: "NPR 2000 (Foreigners)",
    altitude: "150m",
    highlights: ["One-horned Rhino", "Bengal Tigers", "Elephant Safari", "Tharu Culture"],
    location: "Chitwan District, Nepal",
    established: "1973",
    activities: ["Jungle Safari", "Canoe Rides", "Bird Watching", "Cultural Shows"],
    temperature: "20-35°C"
  },
  {
    id: 4,
    name: "Annapurna Base Camp",
    description: "The Annapurna Base Camp trek is one of Nepal's most spectacular and accessible Himalayan adventures, offering dramatic mountain views, diverse landscapes, and rich cultural experiences. This iconic trek takes you through rhododendron forests, traditional villages, and alpine meadows to the heart of the Annapurna Sanctuary.",
    img: ABC,
    rating: 4.9,
    category: "Trekking Destination",
    visitTime: "10-14 days",
    bestTime: "March-May, September-November",
    entryFee: "NPR 3000 (ACAP Permit)",
    altitude: "4,130m",
    highlights: ["Annapurna Sanctuary", "Gurung Villages", "Hot Springs", "Mountain Views"],
    location: "Annapurna Region, Nepal",
    established: "Trekking Route",
    activities: ["Trekking", "Photography", "Cultural Immersion", "Mountain Climbing"],
    temperature: "-10 to 20°C"
  },
  {
    id: 5,
    name: "Upper Mustang",
    description: "Upper Mustang, the former Forbidden Kingdom, offers a surreal desert landscape reminiscent of Tibet, with ancient monasteries, cave dwellings, and a unique culture that has remained unchanged for centuries. This restricted area provides an extraordinary glimpse into a preserved Himalayan civilization.",
    img: Mustang,
    rating: 4.6,
    category: "Restricted Area",
    visitTime: "10-12 days",
    bestTime: "March to November",
    entryFee: "USD 500 (10 days)",
    altitude: "3,840m",
    highlights: ["Lo Manthang", "Ancient Monasteries", "Cave Dwellings", "Tiji Festival"],
    location: "Mustang District, Nepal",
    established: "Ancient Kingdom",
    activities: ["Cultural Tours", "Monastery Visits", "Photography", "Horseback Riding"],
    temperature: "-5 to 15°C"
  },
  {
    id: 6,
    name: "Pashupatinath Temple",
    description: "Pashupatinath Temple, located on the sacred banks of the Bagmati River, is the most revered Hindu temple in Nepal and one of the most significant Shiva temples in the world. This spiritual center attracts thousands of pilgrims and offers profound insights into Hindu religious practices and beliefs.",
    img: Pashupatinath,
    rating: 4.8,
    category: "Hindu Temple",
    visitTime: "2-3 hours",
    bestTime: "Early Morning or Evening",
    entryFee: "NPR 1000 (Foreigners)",
    altitude: "1,317m",
    highlights: ["Sacred Shiva Temple", "Cremation Ghats", "Religious Rituals", "Bagmati River"],
    location: "Kathmandu, Nepal",
    established: "5th Century",
    activities: ["Temple Visits", "Religious Ceremonies", "Photography", "Spiritual Tours"],
    temperature: "15-25°C"
  },
  {
    id: 7,
    name: "Swayambhunath Stupa",
    description: "Swayambhunath, affectionately known as the Monkey Temple, is an ancient Buddhist stupa perched atop a hill overlooking the Kathmandu Valley. This sacred site, with its iconic all-seeing Buddha eyes and colorful prayer flags, represents the harmony between Hindu and Buddhist traditions in Nepal.",
    img: Swayambhunath,
    rating: 4.7,
    category: "Buddhist Stupa",
    visitTime: "1-2 hours",
    bestTime: "Early Morning or Sunset",
    entryFee: "NPR 200 (Foreigners)",
    altitude: "1,372m",
    highlights: ["Buddha Eyes", "Prayer Flags", "Valley Views", "Monkey Population"],
    location: "Kathmandu, Nepal",
    established: "5th Century",
    activities: ["Temple Visits", "Photography", "Meditation", "Sunrise/Sunset Views"],
    temperature: "15-25°C"
  },
  {
    id: 8,
    name: "Nagarkot",
    description: "Nagarkot, a peaceful hill station located on the rim of the Kathmandu Valley, is renowned for its spectacular sunrise and sunset views over the Himalayas, including glimpses of Mount Everest on clear days. This serene destination offers a perfect escape from the bustling city life with its fresh mountain air and panoramic vistas.",
    img: Nagarkot,
    rating: 4.5,
    category: "Hill Station",
    visitTime: "1-2 days",
    bestTime: "October to March",
    entryFee: "Free",
    altitude: "2,175m",
    highlights: ["Himalayan Views", "Sunrise/Sunset", "Mount Everest Views", "Fresh Air"],
    location: "Bhaktapur District, Nepal",
    established: "Hill Station",
    activities: ["Hiking", "Photography", "Relaxation", "Nature Walks"],
    temperature: "10-20°C"
  },
];

export default function AllSpotsDetails() {
  const navigate = useNavigate();
  const { bgClass, textClass } = useTheme();
  const [favorites, setFavorites] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("rating");

  const categories = ["All", "Lake City", "UNESCO Heritage Site", "National Park", "Trekking Destination", "Restricted Area", "Hindu Temple", "Buddhist Stupa", "Hill Station"];

  const filteredSpots = famousSpots.filter(spot => 
    selectedCategory === "All" || spot.category === selectedCategory
  ).sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "altitude") return parseInt(b.altitude) - parseInt(a.altitude);
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
      <section className="relative py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
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
              <span className="bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
                Famous Tourist Spots
              </span>
              <br />
              <span className="text-white">in Nepal</span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
              Discover Nepal's most iconic destinations, from sacred temples to breathtaking mountain vistas
            </p>
            
            <div className="flex flex-wrap justify-center items-center gap-8 mt-8 text-white/80">
              <div className="flex items-center gap-2">
                <FaMountain />
                <span>{filteredSpots.length} Destinations</span>
              </div>
              <div className="flex items-center gap-2">
                <FaStar />
                <span>World-Class Attractions</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCamera />
                <span>Unforgettable Experiences</span>
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
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 text-sm ${
                    selectedCategory === category
                      ? "bg-purple-600 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-slate-700"
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
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-purple-500"
              >
                <option value="rating">Rating</option>
                <option value="name">Name</option>
                <option value="altitude">Altitude</option>
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
                    
                    {/* Altitude Badge */}
                    <div className="absolute top-16 left-4 bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                      <span className="text-xs font-bold">{spot.altitude}</span>
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
                          className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Activities */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Activities</h3>
                    <div className="flex flex-wrap gap-2">
                      {spot.activities.map((activity, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                        >
                          {activity}
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
                        <FaTemperatureHigh />
                        <span className="text-sm">Temperature</span>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">{spot.temperature}</span>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
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