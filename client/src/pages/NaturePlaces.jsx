import { useEffect, useRef } from "react";

import Shivapuri from "../assets/Nature/shivapuri.jpeg";
import Lomanthang from "../assets/Nature/lomanthang.jpeg";
import Langtang from "../assets/Nature/langtang.jpeg";
import Bardiya from "../assets/Nature/bardiya.jpeg";
import Khaptad from "../assets/Nature/khaptad.jpeg";
import Gosaikunda from "../assets/Nature/gosaikunda.jpeg";
import Shuklaphanta from "../assets/Nature/shuklaphanta.jpeg";
import Ghandruk from "../assets/Nature/ghandruk.jpeg";

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

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let scrollAmount = 0;

    const scrollInterval = setInterval(() => {
      if (scrollContainer) {
        scrollAmount += 1;
        if (scrollAmount >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
          scrollAmount = 0;
        }
        scrollContainer.scrollTo({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    }, 20);

    return () => clearInterval(scrollInterval);
  }, []);

  return (
    <div className="p-6 flex flex-col w-full max-w-6xl mx-auto">
      {/* Title aligned to the right */}
      <h2 className="text-black font-bold text-2xl mb-6 text-left">
        Nature Spots of Nepal
      </h2>

      {/* Scrolling card container */}
      <div ref={scrollRef} className="flex space-x-6 overflow-x-hidden">
        {places.map((place) => (
          <div
            key={place.id}
            className="min-w-[250px] flex-shrink-0"
          >
            <div className="w-full h-52 bg-gray-200 rounded-xl overflow-hidden shadow-md hover:scale-105 transition-transform duration-300">
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
