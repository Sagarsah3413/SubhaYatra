import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// ✅ Import all images
import Basantapur from "../assets/Basantapur.jpeg";
import Bhainsepati from "../assets/Bhainsepati.jpeg";
import BhaktapurDurbarSquare from "../assets/Bhaktapur-Durbar-Square.jpeg";
import Boudhanath from "../assets/Boudhanath-Stupa.jpeg";
import ChanguNarayan from "../assets/Changu-Narayan-Temple.jpeg";
import Dakshinkali from "../assets/Dakshinkali-Temple.jpeg";
import KathmanduDurbar from "../assets/Kathmandu-Durbar-Square.jpeg";
import Kathmandu from "../assets/Kathmandu.jpeg";

// ✅ Define spots data
const spots = [
  { id: 1, name: "Basantapur Durbar Square", img: Basantapur },
  { id: 2, name: "Bhainsepati", img: Bhainsepati },
  { id: 3, name: "Bhaktapur Durbar Square", img: BhaktapurDurbarSquare },
  { id: 4, name: "Boudhanath Stupa", img: Boudhanath },
  { id: 5, name: "Changu Narayan Temple", img: ChanguNarayan },
  { id: 6, name: "Dakshinkali Temple", img: Dakshinkali },
  { id: 7, name: "Kathmandu Durbar Square", img: KathmanduDurbar },
  { id: 8, name: "Kathmandu City View", img: Kathmandu },
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
        scrollAmount += 1;
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
    <div className="p-6 flex flex-col w-full max-w-6xl mx-auto mt-10">
      <h2 className="text-teal-500 font-bold text-2xl mb-6">
        Explore Experiences Near Capital
      </h2>

      <div
        ref={scrollRef}
        className="flex space-x-6 overflow-x-hidden cursor-pointer"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {spots.concat(spots).map((place, index) => (
          <div key={index} className="min-w-[250px] flex-shrink-0">
            {/* ✅ Clicking goes to AllPlacesDetail page */}
            <Link to="/all-places-detail">
              <div className="w-full h-52 bg-gray-200 rounded-xl overflow-hidden shadow-md transform transition-transform duration-300 hover:scale-110">
                <img
                  src={place.img}
                  alt={place.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
            <p className="text-center text-black font-semibold mt-2">
              {place.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}