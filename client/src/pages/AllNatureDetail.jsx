import React from 'react';
import { useNavigate } from 'react-router-dom';
import Shivapuri from "../assets/Nature/Shivapuri.jpeg";
import Lomanthang from "../assets/Nature/Lomanthang.jpeg";
import Langtang from "../assets/Nature/Langtang.jpeg";
import Bardiya from "../assets/Nature/Bardiya.jpeg";
import Khaptad from "../assets/Nature/Khaptad.jpeg";
import Gosaikunda from "../assets/Nature/Gosaikunda.jpeg";
import Shuklaphanta from "../assets/Nature/Shuklaphanta.jpeg";
import Ghandruk from "../assets/Nature/Ghandruk.jpeg";
import { Header } from "../components/header/Header";
import Footer from "../components/footer/Footer";

const places = [
  {
    id: 1,
    name: "Shivapuri National Park",
    img: Shivapuri,
    category: "National Park",
    region: "Central Nepal",
    elevation: "2,732m",
    bestTime: "Oct-Dec, Mar-May",
    duration: "1-2 days",
    difficulty: "Moderate",
    rating: 4.6,
    reviews: 342,
    highlights: ["Hiking Trails", "Bird Watching", "Monastery Views", "Sunrise Point"],
    description: "Shivapuri National Park, located on the northern fringe of Kathmandu Valley, is a pristine wilderness sanctuary offering spectacular mountain views and diverse ecosystems. The park encompasses the sacred Shivapuri Peak at 2,732 meters, providing panoramic vistas of the Himalayas including Ganesh Himal, Langtang, and Jugal ranges. Rich in biodiversity, it hosts over 300 bird species, making it a paradise for birdwatchers and nature enthusiasts."
  },
  {
    id: 2,
    name: "Lomanthang (Upper Mustang)",
    img: Lomanthang,
    category: "Cultural Landscape",
    region: "Western Nepal",
    elevation: "3,840m",
    bestTime: "May-Oct",
    duration: "10-14 days",
    difficulty: "Challenging",
    rating: 4.9,
    reviews: 156,
    highlights: ["Ancient Kingdom", "Tibetan Culture", "Desert Landscape", "Royal Palace"],
    description: "Lomanthang, the ancient walled capital of the former Kingdom of Lo in Upper Mustang, is a mystical destination that preserves centuries-old Tibetan Buddhist culture in its purest form. This remote high-altitude desert region, often called the 'Last Forbidden Kingdom,' remained closed to outsiders until 1992, maintaining its authentic medieval character."
  },
  {
    id: 3,
    name: "Langtang Valley",
    img: Langtang,
    category: "Trekking Valley",
    region: "Central Nepal",
    elevation: "3,430m",
    bestTime: "Oct-Dec, Mar-May",
    duration: "7-10 days",
    difficulty: "Moderate",
    rating: 4.7,
    reviews: 523,
    highlights: ["Glacier Views", "Tamang Culture", "Alpine Lakes", "Yak Cheese"],
    description: "Langtang Valley, known as the 'Valley of Glaciers,' is a spectacular high-altitude destination that combines stunning mountain scenery with rich Tamang cultural heritage. Located just north of Kathmandu, this pristine valley offers an accessible yet rewarding trekking experience through diverse landscapes ranging from subtropical forests to alpine meadows."
  },
  {
    id: 4,
    name: "Bardiya National Park",
    img: Bardiya,
    category: "Wildlife Reserve",
    region: "Western Nepal",
    elevation: "152m",
    bestTime: "Oct-Apr",
    duration: "2-4 days",
    difficulty: "Easy",
    rating: 4.8,
    reviews: 287,
    highlights: ["Royal Bengal Tigers", "One-horned Rhinos", "Elephant Safari", "Karnali River"],
    description: "Bardiya National Park, Nepal's largest national park, is a pristine wilderness sanctuary in the western Terai region, renowned for its exceptional wildlife diversity and successful conservation efforts. Covering 968 square kilometers of sal forests, grasslands, and riverine habitats along the Karnali River, the park is home to the highest density of Royal Bengal tigers in Nepal."
  },
  {
    id: 5,
    name: "Khaptad National Park",
    img: Khaptad,
    category: "National Park",
    region: "Far Western Nepal",
    elevation: "3,050m",
    bestTime: "Apr-Jun, Sep-Nov",
    duration: "3-5 days",
    difficulty: "Moderate",
    rating: 4.4,
    reviews: 198,
    highlights: ["Rolling Meadows", "Medicinal Plants", "Spiritual Retreat", "Khaptad Baba"],
    description: "Khaptad National Park, located in the far western hills of Nepal, is a unique high-altitude plateau sanctuary known for its rolling grasslands, pristine forests, and spiritual significance. Named after the revered hermit Khaptad Baba who meditated here for decades, the park encompasses 225 square kilometers of diverse ecosystems."
  },
  {
    id: 6,
    name: "Gosaikunda Lake",
    img: Gosaikunda,
    category: "Sacred Lake",
    region: "Central Nepal",
    elevation: "4,380m",
    bestTime: "May-Sep",
    duration: "5-7 days",
    difficulty: "Challenging",
    rating: 4.8,
    reviews: 445,
    highlights: ["Sacred Pilgrimage", "Alpine Lakes", "Janai Purnima Festival", "Mountain Views"],
    description: "Gosaikunda Lake, a sacred alpine lake system in the Langtang National Park, is one of Nepal's most revered pilgrimage destinations, combining spiritual significance with breathtaking natural beauty. Located at 4,380 meters, this pristine glacial lake is believed by Hindus to have been created by Lord Shiva's trident."
  },
  {
    id: 7,
    name: "Shuklaphanta Wildlife Reserve",
    img: Shuklaphanta,
    category: "Wildlife Reserve",
    region: "Far Western Nepal",
    elevation: "174m",
    bestTime: "Nov-Apr",
    duration: "2-3 days",
    difficulty: "Easy",
    rating: 4.5,
    reviews: 167,
    highlights: ["Swamp Deer", "Grassland Ecosystem", "Bird Watching", "Rani Tal Lake"],
    description: "Shuklaphanta Wildlife Reserve, located in the far western Terai region, is Nepal's premier grassland ecosystem and home to the largest herd of swamp deer (barasingha) in the world. Covering 305 square kilometers of pristine grasslands, forests, and wetlands, the reserve represents one of the finest examples of Terai ecosystem conservation."
  },
  {
    id: 8,
    name: "Ghandruk Village",
    img: Ghandruk,
    category: "Mountain Village",
    region: "Western Nepal",
    elevation: "1,940m",
    bestTime: "Oct-Dec, Mar-May",
    duration: "2-4 days",
    difficulty: "Easy-Moderate",
    rating: 4.7,
    reviews: 612,
    highlights: ["Gurung Culture", "Annapurna Views", "Traditional Architecture", "Eco-Tourism"],
    description: "Ghandruk Village, a picturesque Gurung settlement in the Annapurna region, is renowned as one of Nepal's most beautiful mountain villages and a model for community-based eco-tourism. Perched on a hillside at 1,940 meters, the village offers spectacular panoramic views of Annapurna South, Hiunchuli, and Machhapuchhre (Fishtail) peaks."
  }
];

export default function AllNatureDetail() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden bg-gradient-to-br from-blue-600 via-green-600 to-teal-600 dark:from-blue-900 dark:via-green-900 dark:to-teal-900 pt-20">
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Nepal's Natural Wonders
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
              Discover pristine wilderness, sacred lakes, and breathtaking landscapes across Nepal's diverse natural heritage
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <span className="font-semibold">{places.length}</span> Natural Destinations
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <span className="font-semibold">8</span> Protected Areas
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <span className="font-semibold">4.7★</span> Average Rating
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Places Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {places.map((place) => (
            <div key={place.id} className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-slate-700">
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={place.img} 
                  alt={place.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-gray-800 dark:text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {place.category}
                  </span>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-4 right-4">
                  <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                    <span className="text-yellow-500 text-sm">★</span>
                    <span className="text-gray-800 dark:text-white text-sm font-semibold">{place.rating}</span>
                  </div>
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white text-xl font-bold mb-1">{place.name}</h3>
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <span>📍 {place.region}</span>
                    <span>•</span>
                    <span>⛰️ {place.elevation}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Best Time</div>
                    <div className="text-sm font-semibold text-gray-800 dark:text-white">{place.bestTime}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Duration</div>
                    <div className="text-sm font-semibold text-gray-800 dark:text-white">{place.duration}</div>
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-4">
                  <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Highlights</div>
                  <div className="flex flex-wrap gap-1">
                    {place.highlights.slice(0, 3).map((highlight, index) => (
                      <span key={index} className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-md text-xs font-medium">
                        {highlight}
                      </span>
                    ))}
                    {place.highlights.length > 3 && (
                      <span className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-md text-xs font-medium">
                        +{place.highlights.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                  {place.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span>{place.rating}</span>
                    </div>
                    <div>({place.reviews} reviews)</div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      place.difficulty === 'Easy' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                      place.difficulty === 'Easy-Moderate' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' :
                      place.difficulty === 'Moderate' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' :
                      'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                    }`}>
                      {place.difficulty}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      navigate('/itinerary', { 
                        state: { 
                          preselectedDestination: {
                            name: place.name,
                            type: 'Place',
                            location: place.region,
                            description: place.description
                          }
                        }
                      });
                    }}
                    className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-200 transform hover:scale-105"
                  >
                    Plan Your Visit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}