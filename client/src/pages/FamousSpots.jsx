import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaStar,
  FaArrowRight,
  FaMountain,
  FaHeart,
  FaRoute,
} from "react-icons/fa";

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
    highlight: "Adventure Hub",
  },
  {
    id: 2,
    name: "Lumbini",
    img: lumbini,
    rating: 4.8,
    category: "UNESCO Site",
    description: "Sacred birthplace of Lord Buddha and pilgrimage destination",
    visitors: "500K+ annually",
    highlight: "Spiritual Journey",
  },
  {
    id: 3,
    name: "Chitwan National Park",
    img: chitwan,
    rating: 4.7,
    category: "Wildlife Reserve",
    description: "UNESCO World Heritage wildlife sanctuary with diverse fauna",
    visitors: "300K+ annually",
    highlight: "Wildlife Safari",
  },
  {
    id: 4,
    name: "Annapurna Base Camp",
    img: ABC,
    rating: 4.9,
    category: "Trekking",
    description: "World-renowned trekking route through diverse landscapes",
    visitors: "150K+ annually",
    highlight: "Epic Trek",
  },
  {
    id: 5,
    name: "Upper Mustang",
    img: Mustang,
    rating: 4.6,
    category: "Hidden Kingdom",
    description: "Ancient forbidden kingdom with unique Tibetan culture",
    visitors: "25K+ annually",
    highlight: "Exclusive Access",
  },
  {
    id: 6,
    name: "Pashupatinath",
    img: Pashupatinath,
    rating: 4.8,
    category: "Hindu Temple",
    description: "Sacred Hindu temple complex on the banks of Bagmati River",
    visitors: "1M+ annually",
    highlight: "Sacred Site",
  },
  {
    id: 7,
    name: "Swayambhunath",
    img: Swayambhunath,
    rating: 4.7,
    category: "Buddhist Stupa",
    description: "Ancient Buddhist stupa offering panoramic valley views",
    visitors: "800K+ annually",
    highlight: "Monkey Temple",
  },
  {
    id: 8,
    name: "Nagarkot",
    img: Nagarkot,
    rating: 4.5,
    category: "Hill Station",
    description: "Popular hill station famous for sunrise and mountain views",
    visitors: "400K+ annually",
    highlight: "Sunrise Views",
  },
];

export default function FamousSpots() {
  const scrollRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const navigate = useNavigate();

  // Scrolling effect
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
      {/* Static Gradient Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-soil-dark via-soil-mid to-soil-dark"></div>

        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-soil-dark/80 via-soil-dark/60 to-soil-dark/80"></div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-himalayan-sky/10 to-forest-deep/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-meadow/10 to-forest-mid/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-20 max-w-8xl mx-auto px-6">
        {/* Premium Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-xl rounded-full px-8 py-4 mb-8 border border-white/30">
            <FaMountain className="text-gold" />
            <span className="text-sm font-semibold text-white">
              Must-Visit Destinations
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-forest-light to-gold bg-clip-text text-transparent">
              Famous Tourist Spots
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#15803D] via-amber-600 to-yellow-700 bg-clip-text text-transparent">
              in Nepal
            </span>
          </h2>

          <p className="text-xl text-sand max-w-3xl mx-auto leading-relaxed">
            Discover Nepal's most iconic destinations, from sacred temples to
            breathtaking mountain vistas
          </p>
        </div>

        {/* Professional Scrolling Gallery */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex space-x-8 overflow-x-hidden cursor-pointer pb-6"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {spots.concat(spots).map((spot, index) => (
              <div key={index} className="min-w-[350px] flex-shrink-0 group">
                <div className="block">
                  <div
                    className="relative overflow-hidden rounded-3xl
            bg-[#FFFDF8] dark:bg-soil-mid
            border border-[#E9E5DA] dark:border-forest-deep
            shadow-sm hover:shadow-lg
            transition-all duration-500
            transform hover:-translate-y-1"
                  >
                    {/* Image Container */}
                    <Link to="/all-famous-spots">
                      <div className="relative h-72 overflow-hidden">
                        <img
                          src={spot.img}
                          alt={spot.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent"></div>

                        {/* Category Badge */}
                       <div
  className="absolute top-4 left-4 z-10 
    bg-[#244A35]/95 px-4 py-2 rounded-full
    border border-gray-200 shadow-md"
>
  <span className="text-xs font-bold text-white">
    {spot.category}
  </span>
</div>

                        {/* Rating Badge */}
                        <div className="absolute top-4 right-4 bg-[#244A35]/95 dark:bg-soil-mid/95 backdrop-blur-sm px-3 py-2 rounded-full flex items-center gap-1 border border-white/20 dark:border-forest-deep">
                          <FaStar className="text-gold text-sm" />
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {spot.rating}
                          </span>
                        </div>

                        {/* Highlight Badge */}
                        <div
                          className="absolute bottom-4 left-4
                  bg-[#244A35]/95 dark:bg-forest-deep/95
                  text-white px-4 py-2 rounded-full
                  border border-white/15"
                        >
                          <span className="text-xs font-semibold">
                            {spot.highlight}
                          </span>
                        </div>

                        {/* Hover Arrow */}
                        <div
                          className="absolute bottom-4 right-4
                  w-11 h-11 bg-black/25 backdrop-blur-sm
                  rounded-full flex items-center justify-center
                  opacity-0 group-hover:opacity-100
                  transition-all duration-300
                  translate-y-2 group-hover:translate-y-0
                  border border-white/40"
                        >
                          <FaArrowRight className="text-white" />
                        </div>
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight flex-1">
                          {spot.name}
                        </h3>
                        <FaHeart className="text-clay hover:text-vermillion transition-colors duration-200 cursor-pointer ml-3 mt-1" />
                      </div>

                      <p className="text-gray-600 dark:text-sand text-sm leading-relaxed mb-4">
                        {spot.description}
                      </p>

                      {/* Stats and Action */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex flex-col gap-1">
                          <div
                            className="flex items-center gap-2
                    text-[#315C43] dark:text-forest-light"
                          >
                            <FaMapMarkerAlt className="text-sm" />
                            <span className="text-sm font-medium">Nepal</span>
                          </div>
                          <div className="text-xs text-clay dark:text-sand">
                            {spot.visitors}
                          </div>
                        </div>
                        <div
                          className="text-[#315C43] dark:text-forest-light
                  font-semibold text-sm
                  group-hover:text-[#8A6825] dark:group-hover:text-gold
                  transition-colors duration-200"
                        >
                          Discover →
                        </div>
                      </div>

                      {/* Plan to Visit Button */}
                      <button
                        onClick={() => {
                          console.log("Button clicked!", spot.name);
                          navigate("/itinerary", {
                            state: {
                              preselectedDestination: {
                                name: spot.name,
                                type: "Place",
                                location: "Nepal",
                                description: spot.description,
                              },
                            },
                          });
                        }}
                        className="w-full
                  bg-[#315C43] hover:bg-[#244A35]
                  dark:bg-forest-mid dark:hover:bg-forest-deep
                  text-white py-3 px-4 rounded-xl
                  font-semibold text-sm
                  transition-all duration-300
                  shadow-sm hover:shadow-md
                  flex items-center justify-center gap-2
                  focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-[#A67C28]
                  focus-visible:ring-offset-2
                  dark:focus-visible:ring-offset-soil-mid"
                      >
                        <FaRoute />
                        Plan Your Visit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link
              to="/all-famous-spots"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-forest-mid to-gold hover:from-forest-deep hover:to-gold-dark text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
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
