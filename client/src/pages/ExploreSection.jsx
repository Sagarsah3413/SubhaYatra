import { useEffect, useRef, useState } from "react";

// ✅ Correct paths to images
import basantapur from "../assets/basantapur.jpeg";
import bhainsepati from "../assets/bhainsepati.jpeg";
import bhaktapur from "../assets/bhaktapur-durbar-square.jpeg";
import boudhanath from "../assets/boudhanath-stupa.jpeg";
import changu from "../assets/changu-narayan-temple.jpeg";
import dakshinkali from "../assets/dakshinkali-temple.jpeg";
import kathmanduDurbar from "../assets/kathmandu-durbar-square.jpeg";
import kathmandu from "../assets/kathmandu.jpeg";

// Data for cards
const places = [
  { id: 1, name: "Basantapur", img: basantapur },
  { id: 2, name: "Bhainsepati", img: bhainsepati },
  { id: 3, name: "Bhaktapur-Durbar-Square", img: bhaktapur },
  { id: 4, name: "Bouddhanath-Stupa", img: boudhanath },
  { id: 5, name: "Changu-Narayan-Temple", img: changu },
  { id: 6, name: "Dakshinkali-Temple", img: dakshinkali },
  { id: 7, name: "Kathmandu-Durbar-Square", img: kathmanduDurbar },
  { id: 8, name: "Kathmandu", img: kathmandu },
];

export default function ExploreSection() {
  const scrollRef = useRef(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let scrollAmount = 0;

    const scrollInterval = setInterval(() => {
      if (scrollContainer && !paused) {
        scrollAmount += 1; // adjust speed (lower = faster)
        if (scrollAmount >= scrollContainer.scrollWidth / 2) {
          // reset for infinite scroll
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
    <div className="p-6 flex flex-col w-full max-w-6xl mx-auto">
      <h2 className="text-black font-bold text-2xl mb-6">
        Explore experiences near Capital
      </h2>

      <div
        ref={scrollRef}
        className="flex space-x-6 overflow-x-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {places.concat(places).map((place, index) => (
          // duplicate for infinite scroll
          <div key={index} className="min-w-[250px] flex-shrink-0">
            <div className="w-full h-52 bg-gray-200 rounded-xl overflow-hidden shadow-md">
              <img
                src={place.img}
                alt={place.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-center text-black font-semibold mt-2">
              {place.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
