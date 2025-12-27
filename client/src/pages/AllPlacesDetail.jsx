import Basantapur from "../assets/Basantapur.jpeg";
import Bhainsepati from "../assets/Bhainsepati.jpeg";
import BhaktapurDurbarSquare from "../assets/Bhaktapur-Durbar-Square.jpeg";
import Boudhanath from "../assets/Boudhanath-Stupa.jpeg";
import ChanguNarayan from "../assets/Changu-Narayan-Temple.jpeg";
import Dakshinkali from "../assets/Dakshinkali-Temple.jpeg";
import KathmanduDurbar from "../assets/Kathmandu-Durbar-Square.jpeg";
import Kathmandu from "../assets/Kathmandu.jpeg";
import { Header } from "../components/header/Header";
import React from "react";
const spots = [
  {
    id: 1,
    name: "Basantapur Durbar Square",
    description:
      "Basantapur, located in the heart of old Kathmandu, serves as the historic core and cultural heartbeat of the city, centered around the renowned Kathmandu Durbar Square, a UNESCO World Heritage Site. This vibrant public square and former royal palace complex is a stunning example of traditional Newar architecture, housing a myriad of temples, courtyards, and significant landmarks such as the Hanuman Dhoka Palace, the Kumari Ghar (residence of the Living Goddess), and the imposing Kaal Bhairav statue. Despite suffering damage in the 2015 earthquake, Basantapur has largely been restored, maintaining its status as a bustling center of local commerce and cultural festivals, offering visitors a profound glimpse into Nepal's royal history and enduring spiritual traditions.",
    img: Basantapur,
  },
  {
    id: 2,
    name: "Bhainsepati",
    description:
      "Bhainsepati is a rapidly developing and highly sought-after residential area located in the Lalitpur district of the Kathmandu Valley, recognized for offering a balance of suburban tranquility and modern urban conveniences. Situated approximately 3.5 km from the Ekantakuna Ring Road, it has become a prime location for high-ranking government officials, businessmen, and expatriates due to its well-planned infrastructure, less congested roads, and a generally cleaner, more serene environment compared to the core city centers. The area features numerous modern housing colonies and luxury villas, proximity to quality international schools and hospitals, and scenic views of the surrounding hills and the nearby Nakkhu river, making it an ideal neighborhood for families and working professionals seeking a peaceful yet well-connected lifestyle.",
    img: Bhainsepati,
  },
  {
    id: 3,
    name: "Bhaktapur Durbar Square",
    description:
      "Bhaktapur Durbar Square, a UNESCO World Heritage Site, is a spectacular open museum of medieval Newar art and architecture and the historic royal palace complex of the Malla kings who ruled the Bhaktapur Kingdom. Unlike the other Durbar Squares in the Kathmandu Valley, Bhaktapur has resisted rapid modernization, preserving an authentic traditional way of life and featuring an impressive collection of intricately carved wooden structures, colossal pagoda temples, and ancient palaces. Key attractions within the square include the magnificent Fifty-five Window Palace, the ornate Golden Gate, and numerous shrines and statues that reflect the city's rich history as a major trade and cultural hub. Despite significant damage from past earthquakes, particularly in 2015, extensive restoration efforts have largely preserved its timeless beauty, allowing visitors to experience the unique artistic brilliance and enduring cultural traditions of the Newar people.",
    img: BhaktapurDurbarSquare,
  },
  {
    id: 4,
    name: "Boudhanath Stupa",
    description:
      "Boudhanath Stupa, located approximately 11 km from the center and northeastern outskirts of Kathmandu, is one of the largest spherical stupas in Nepal and a focal point of Tibetan Buddhism. Recognized as a UNESCO World Heritage Site, this iconic white dome structure with a gilded tower painted with the all-seeing eyes of the Buddha serves as a major pilgrimage site for Buddhists from around the world. The area around the stupa is a vibrant, bustling hub known as Little Tibet, densely populated by monks, featuring numerous monasteries, curio shops, restaurants, and cafes that cater to a strong local and international community. Pilgrims ritually circumambulate the massive dome while spinning prayer wheels and chanting mantras, creating a deeply spiritual and tranquil atmosphere that offers a profound insight into Buddhist culture and devotion.",
    img: Boudhanath,
  },
  {
    id: 5,
    name: "Changu Narayan Temple",
    description:
      "Changu Narayan Temple is a UNESCO World Heritage Site and one of the oldest Hindu temples in the Kathmandu Valley, dedicated to Lord Vishnu. Located on a hilltop approximately 12 kilometers east of Kathmandu and north of Bhaktapur, the temple complex showcases exquisite ancient art and architecture from the Lichhavi period, dating back to the 4th century. The two-tiered pagoda-style structure is renowned for its richly embossed wood and stone carvings, including sculptures of Vishnu's various incarnations and a 5th-century statue of his mount, the mythical bird Garuda. Despite being affected by the 2015 earthquake, the temple has undergone extensive restoration, and its location offers a peaceful escape with scenic views of the surrounding countryside.",
    img: ChanguNarayan,
  },
  {
    id: 6,
    name: "Dakshinkali Temple",
    description:
      "The Dakshinkali Temple is a highly significant Hindu pilgrimage site located approximately 22 kilometers south of Kathmandu, nestled at the confluence of two sacred rivers amidst a serene, forested area. Dedicated to the fierce and powerful Goddess Kali, a form of Goddess Parvati associated with destruction of evil and protection, the temple is renowned for its distinctive and intense ritual. Devotees, who believe that offerings made here will fulfill wishes and bring prosperity, flock to the temple in large numbers, especially on Tuesdays and Saturdays and during the Dashain festival, to offer male goats and cockerels to the deity. While the open-air temple itself is a modest structure housing a striking black stone idol of the four-armed goddess, the site serves as a vibrant cultural hub where pilgrims engage in elaborate pujas, enjoy family picnics with the meat, and participate in centuries-old traditions that offer a profound glimpse into Nepalese religious practices.",
    img: Dakshinkali,
  },
  {
    id: 7,
    name: "Kathmandu Durbar Square",
    description:
      "Located in the heart of Kathmandu, this square is home to the Kumari Ghar and many historic temples of the Malla era.",
    img: KathmanduDurbar,
  },
  {
    id: 8,
    name: "Kathmandu ",
    description:
      "Kathmandu, the capital and most populous city of Nepal, is a vibrant metropolis nestled in a bowl-shaped valley surrounded by the Himalayas, serving as the nation's cultural, economic, and political epicenter. Renowned as the City of Temples it is one of the world's oldest continuously inhabited places, where ancient traditions and medieval architecture seamlessly coexist with modern urban life. The city is a gateway to the majestic Himalayas and is home to several UNESCO World Heritage Sites, including the historic Durbar Squares, the sacred Pashupatinath Temple, the iconic Boudhanath Stupa, and the ancient Swayambhunath (Monkey Temple), reflecting a rich heritage influenced by both Hindu and Buddhist faiths. Its bustling streets, lively markets, numerous festivals, and the presence of the Kumari, a living goddess, offer visitors an immersive experience into Nepal's unique history and enduring spiritual practices.",
    img: Kathmandu,
  },
];

export default function AllPlacesDetail() {
  return (
    <div className="min-h-screen bg-gray-50">
          {/* ✅ Reuse header */}
          <Header />
    
    <div className="max-w-6xl mx-auto p-6 mt-10">
      <h1 className="text-3xl font-bold text-center text-black mb-12">
        Explore experiences near Capital
      </h1>

      {spots.map((spot, index) => (
        <div
          key={spot.id}
          className={`flex flex-col md:flex-row items-center gap-10 mb-16 ${
            index % 2 === 1 ? "md:flex-row-reverse" : ""
          }`}
        >
          {/* Image */}
          <div className="w-full md:w-1/2 h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300">
            <img
              src={spot.img}
              alt={spot.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Description */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {spot.name}
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              {spot.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
}