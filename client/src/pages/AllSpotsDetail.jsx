import React from "react";
import { Header } from "../components/header/Header";

// ✅ Import images
import Pokhara from "../assets/Fspots/Pokhara.jpg";
import Lumbini from "../assets/Fspots/Lumbini.jpeg";
import Chitwan from "../assets/Fspots/Chitwan.jpeg";
import ABC from "../assets/Fspots/ABC.jpeg";
import Mustang from "../assets/Fspots/Mustang.jpeg";
import Pashupatinath from "../assets/Fspots/Pashupatinath.jpeg";
import Swayambhunath from "../assets/Fspots/Swayambhunath.jpeg";
import Nagarkot from "../assets/Fspots/Nagarkot.jpeg";

// ✅ All famous spots data
const famousSpots = [
  {
    id: 1,
    name: "Pokhara",
    description:
      "Pokhara, the tourism capital of Nepal, is a stunning valley city famous for its serene lakes, adventure sports, and breathtaking views of the Annapurna range. Highlights include Phewa Lake, Sarangkot, the World Peace Pagoda, and Gupteshwor Cave.",
    img: Pokhara,
  },
  {
    id: 2,
    name: "Lumbini",
    description:
      "Lumbini is the birthplace of Lord Buddha and a UNESCO World Heritage Site. It features the sacred Maya Devi Temple, Ashoka Pillar, monasteries built by different countries, and peaceful gardens symbolizing global Buddhism.",
    img: Lumbini,
  },
  {
    id: 3,
    name: "Chitwan National Park",
    description:
      "Chitwan National Park, Nepal’s first national park, is home to the one-horned rhinoceros, Bengal tigers, elephants, and over 500 species of birds. Jungle safaris, canoe rides, and Tharu cultural shows make it a must-visit.",
    img: Chitwan,
  },
  {
    id: 4,
    name: "Annapurna Base Camp (ABC)",
    description:
      "The Annapurna Base Camp trek offers dramatic Himalayan views, charming Gurung villages, and natural hot springs. It’s one of Nepal’s most scenic and rewarding trekking routes.",
    img: ABC,
  },
  {
    id: 5,
    name: "Mustang",
    description:
      "Mustang, the former Forbidden Kingdom, offers a surreal desert landscape, ancient monasteries, and Tibetan-influenced culture. The walled city of Lo Manthang and the Tiji Festival are highlights.",
    img: Mustang,
  },
  {
    id: 6,
    name: "Pashupatinath Temple",
    description:
      "Pashupatinath Temple, located on the banks of the Bagmati River in Kathmandu, is the most sacred Hindu temple in Nepal. It’s a spiritual center dedicated to Lord Shiva and known for its religious rituals and cremation ghats.",
    img: Pashupatinath,
  },
  {
    id: 7,
    name: "Swayambhunath Stupa",
    description:
      "Swayambhunath, or the Monkey Temple, is an ancient Buddhist stupa perched on a hill overlooking Kathmandu. Its all-seeing Buddha eyes and prayer flags represent peace and wisdom.",
    img: Swayambhunath,
  },
  {
    id: 8,
    name: "Nagarkot",
    description:
      "Nagarkot, a peaceful hill station near Kathmandu, is famous for sunrise and sunset views over the Himalayas, including Mount Everest on clear days. It’s ideal for photography, hiking, and relaxation.",
    img: Nagarkot,
  },
];

export default function AllPlacesDetail() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Reuse header */}
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-black mb-12">
          Detailed Overview of Nepal’s Most Famous Places
        </h1>

        <div className="flex flex-col space-y-20">
          {famousSpots.map((spot, index) => (
            <div
              key={spot.id}
              className={`flex flex-col md:flex-row ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              } items-center gap-10`}
            >
              {/* Image */}
              <div className="md:w-1/2 w-full h-80 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={spot.img}
                  alt={spot.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Text */}
              <div className="md:w-1/2 w-full text-center md:text-left">
                <h2 className="text-2xl font-semibold text-black mb-4">
                  {spot.name}
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {spot.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
