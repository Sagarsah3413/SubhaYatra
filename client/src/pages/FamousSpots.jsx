import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

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
  { id: 1, name: "Pokhara", img: Pokhara },
  { id: 2, name: "Lumbini", img: lumbini },
  { id: 3, name: "Chitwan National Park", img: chitwan },
  { id: 4, name: "ABC", img:ABC},
  { id: 5, name: "Mustang", img:Mustang },
  { id: 6, name: "Pashupatinath", img: Pashupatinath },
  { id: 7, name: "Swayambhunath", img: Swayambhunath },
  { id: 8, name: "Nagarkot", img: Nagarkot },
];

export default function FamousSpots() {
  const scrollRef = useRef(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let scrollAmount = 0;

    const scrollInterval = setInterval(() => {
      if (scrollContainer && !paused) {
        scrollAmount += 1; // scrolling speed
        if (scrollAmount >= scrollContainer.scrollWidth / 2) {
          scrollAmount = 0; // reset for infinite scroll
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
    <div className="p-6 flex flex-col w-full max-w-6xl mx-auto">
      <h2 className="text-teal-500 font-bold text-2xl mb-6">
        Famous Tourist Spots in Nepal
      </h2>

      <div
        ref={scrollRef}
        className="flex space-x-6 overflow-x-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {spots.concat(spots).map((spot, index) => (
          <div key={index} className="min-w-[250px] flex-shrink-0">
            {/* ✅ Each spot links to /famous-places page */}
            <Link to="/all-famous-spots">

              <div className="w-full h-52 bg-gray-200 rounded-xl overflow-hidden shadow-md transform transition-transform duration-300 hover:scale-110">
                <img
                  src={spot.img}
                  alt={spot.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
            <p className="text-center text-black font-semibold mt-2">
              {spot.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
