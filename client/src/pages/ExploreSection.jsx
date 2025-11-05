import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// ✅ Import images
import pashupatinath from "../assets/Fspots/Pashupatinath.jpeg";
import swayambhunath from "../assets/Fspots/Swayambhunath.jpeg";
import pokhara from "../assets/Fspots/Pokhara.jpg";
import annapurna from "../assets/Fspots/ABC.jpeg";
import chitwan from "../assets/Fspots/Chitwan.jpeg";
import lumbini from "../assets/Fspots/Lumbini.jpeg";
import mustang from "../assets/Fspots/Mustang.jpeg";
import nagarkot from "../assets/Fspots/Nagarkot.jpeg";

// ✅ Data for cards
const spots = [
  { id: 1, name: "Pashupatinath Temple", img: pashupatinath },
  { id: 2, name: "Swayambhunath Stupa", img: swayambhunath },
  { id: 3, name: "Pokhara", img: pokhara },
  { id: 4, name: "Annapurna Base Camp", img: annapurna },
  { id: 5, name: "Chitwan National Park", img: chitwan },
  { id: 6, name: "Lumbini", img: lumbini },
  { id: 7, name: "Mustang", img: mustang },
  { id: 8, name: "Nagarkot", img: nagarkot },
];

export default function FamousSpots() {
  const scrollRef = useRef(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let scrollAmount = 0;

    const scrollInterval = setInterval(() => {
      if (scrollContainer && !paused) {
        scrollAmount += 1; // scroll speed
        if (scrollAmount >= scrollContainer.scrollWidth / 2) {
          scrollAmount = 0; // reset for infinite loop
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
    <div className="p-6 flex flex-col w-full max-w-6xl mx-auto mt-10">
      <h2 className="text-black font-bold text-2xl mb-6">
        Famous Spots to Travel in Nepal
      </h2>

      <div
        ref={scrollRef}
        className="flex space-x-6 overflow-x-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {spots.concat(spots).map((spot, index) => (
          <div key={index} className="min-w-[250px] flex-shrink-0">
            {/* ✅ Link to all famous spots page */}
            <Link to="/famous-spots">
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
