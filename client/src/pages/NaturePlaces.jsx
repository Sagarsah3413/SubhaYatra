import { useEffect, useRef, useState} from "react";
import Shivapuri from "../assets/Nature/Shivapuri.jpeg";
import Lomanthang from "../assets/Nature/Lomanthang.jpeg";
import Langtang from "../assets/Nature/Langtang.jpeg";
import Bardiya from "../assets/Nature/Bardiya.jpeg";
import Khaptad from "../assets/Nature/Khaptad.jpeg";
import Gosaikunda from "../assets/Nature/Gosaikunda.jpeg";
import Shuklaphanta from "../assets/Nature/Shuklaphanta.jpeg";
import Ghandruk from "../assets/Nature/Ghandruk.jpeg";
import { Link } from "react-router-dom";

const places = [
  { id: 1, name: "Shivapuri National Park", img: Shivapuri },
  { id: 2, name: "Lomanthang (Upper Mustang)", img: Lomanthang },
  { id: 3, name: "Langtang Valley", img: Langtang },
  { id: 4, name: "Bardiya National Park", img: Bardiya },
  { id: 5, name: "Khaptad National Park", img: Khaptad },
  { id: 6, name: "Gosaikunda Lake", img: Gosaikunda },
  { id: 7, name: "Shuklaphanta Wildlife Reserve", img: Shuklaphanta },
  { id: 8, name: "Ghandruk Village", img: Ghandruk },
];

export default function NaturePlaces() {
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
        Famous Natural Spots in Nepal
      </h2>

      <div
        ref={scrollRef}
        className="flex space-x-6 overflow-x-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {places.concat(places).map((places, index) => (
          <div key={index} className="min-w-[250px] flex-shrink-0">
            {/* ✅ Each spot links to /famous-places page */}
            <Link to="/all-nature-places">

              <div className="w-full h-52 bg-gray-200 rounded-xl overflow-hidden shadow-md transform transition-transform duration-300 hover:scale-110">
                <img
                  src={places.img}
                  alt={places.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
            <p className="text-center text-black font-semibold mt-2">
              {places.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
