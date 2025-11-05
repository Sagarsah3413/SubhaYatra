import React from "react";
import Pokhara from "../assets/Fspots/Pokhara.jpg";
import lumbini from "../assets/Fspots/Lumbini.jpeg";
import chitwan from "../assets/Fspots/Chitwan.jpeg";
import ABC from "../assets/Fspots/ABC.jpeg";
import Mustang from "../assets/Fspots/Mustang.jpeg";
import Pashupatinath from "../assets/Fspots/Pashupatinath.jpeg";    
import Swayambhunath from "../assets/Fspots/Swayambhunath.jpeg";
import Nagarkot from "../assets/Fspots/Nagarkot.jpeg";
import { Header } from "../../components/header/Header"; 

const famousSpots = [
  {
    id: 1,
    name: "Pokhara",
    description:
      "Pokhara, widely regarded as the tourism capital of Nepal, is a stunning valley city celebrated for its unparalleled natural beauty, adventure sports opportunities, and tranquil environment compared to the bustling Kathmandu. Nestled beneath the towering Annapurna mountain range, the city's crowning jewel is the serene Phewa Lake, where the iconic Machhapuchhre (Fishtail) peak is perfectly reflected on its surface. Beyond the breathtaking views from locations like Sarangkot and the World Peace Pagoda, Pokhara serves as the primary gateway for major Himalayan treks and a hub for thrilling activities such as paragliding, zip-lining, and rafting. The vibrant Lakeside area offers a relaxed atmosphere with numerous hotels and restaurants, while natural wonders like Devi's Fall and Gupteshwor Cave add to the city's charm. This unique blend of majestic mountains, serene lakes, and adrenaline-pumping activities makes Pokhara an essential and unforgettable Nepalese destination.",
    img: Pokhara,
  },
  {
    id: 2,
    name: "Lumbini",
    description:
      "Lumbini is a UNESCO World Heritage site of profound spiritual significance, revered globally as the birthplace of Siddhartha Gautama, who became the Buddha. Located in the Terai plains of southern Nepal, the site is a vast complex centered around the Sacred Garden and the Maya Devi Temple, which enshrines the exact spot of the Buddha's birth. An important historical marker is the 3rd-century BC Ashoka Pillar, erected by Emperor Ashoka to commemorate his visit. The surrounding area features a large monastic zone, where over 25 countries have constructed architecturally diverse monasteries representing various Buddhist traditions, fostering a unique international atmosphere of peace and learning. Visitors can also see the sacred Pushkarini pond and the imposing World Peace Pagoda, making Lumbini an essential destination for pilgrims and anyone seeking a tranquil, insightful connection to the origins of Buddhism.",
    img: lumbini,
  },
  {
    id: 3,
    name: "Chitwan National Park",
    description:
      "Chitwan National Park, another UNESCO World Heritage Site, is Nepal’s first national park and a paradise for wildlife lovers. It is home to the Bengal tiger, one-horned rhinoceros, gharials, and over 500 species of birds. Visitors can enjoy jungle safaris, canoe rides, and explore Tharu cultural villages.",
    img: chitwan,
  },
  {
    id: 4,
    name: "ABC (Annapurna Base Camp)",
    description:
      "Chitwan National Park, a UNESCO World Heritage Site established in 1973, is Nepal's first and most famous national park, located in the subtropical Terai lowlands. This former royal hunting ground is now a renowned conservation success story, protecting a rich ecosystem of lush forests, grasslands, and riverine habitats along the Rapti and Narayani rivers. It is most famous as a crucial sanctuary for endangered species, including a large population of the Greater One-Horned Rhinoceros and a viable population of the elusive Royal Bengal Tiger. Visitors can embark on exciting jungle safaris via jeep, take peaceful canoe trips to spot gharial and marsh mugger crocodiles, go on guided jungle walks, and immerse themselves in the rich culture of the local Tharu community through village visits and cultural shows. The park's abundant biodiversity also attracts birdwatchers, with over 500 species of birds, making it a spectacular destination for nature enthusiasts seeking an authentic and wild jungle experience.",
    img: ABC,
  },
  {
    id: 5,
    name: "Mustang",
    description:
      "Mustang, a remote and geographically spectacular region in the rain shadow of the Himalayas, is a former forbidden kingdom divided into Lower and Upper Mustang, accessible primarily via Jomsom airport. Upper Mustang, in particular, offers a unique, preserved slice of Tibetan Buddhist culture and history within Nepal, featuring a high-altitude, barren landscape of stunning rock formations and ancient cave dwellings. The region is famous for its centuries-old monasteries like the Lo Manthang Chogyal (Royal) Palace, the unique Tiji festival, and the ancient trade route that runs along the Kali Gandaki Gorge—the world's deepest gorge. It remains a trekker’s paradise for those seeking stark beauty, profound cultural immersion, and a journey into a land that feels suspended in time.",
    img: Mustang,
  },
  {
    id: 6,
    name: "Pashupatinath Temple",
    description:
      "Pashupatinath Temple is Nepal's most sacred Hindu pilgrimage site, located on the banks of the Bagmati River in Kathmandu and designated a UNESCO World Heritage site. This expansive complex is centered around a golden-roofed, two-tiered pagoda temple dedicated to Lord Shiva in his form as the Lord of all Animals (Pashupati), although only practicing Hindus are allowed inside the main temple. The area is a hub of spiritual energy, famous for its deeply significant ghats (cremation platforms) along the riverbank, where public Hindu funeral rites are conducted daily, offering visitors a poignant and powerful glimpse into the cycle of life and death according to Hindu tradition. The complex also encompasses hundreds of smaller shrines, temples, and sadhus (holy men) covered in ash, making it a vital center of religious activity and cultural observance.",
    img: Pashupatinath,
  },
  {
    id: 7,
    name: "Swayambhunath Stupa",
    description:
      "Swayambhunath Stupa, affectionately known as the Monkey Temple due to the large population of holy monkeys that inhabit its forested hillside, is one of the oldest and most revered Buddhist sites in the Kathmandu Valley and a UNESCO World Heritage site. Perched high on a hillock west of the city, the stupa is an iconic symbol of Nepal, featuring a massive white dome base topped by a gilded spire on which the all-seeing wisdom eyes of the Buddha are painted, looking out over the entire valley. The arduous climb up 365 stone steps is rewarded with panoramic views of Kathmandu city below, a serene spiritual atmosphere filled with spinning prayer wheels and fluttering prayer flags, and a rich history that blends Hindu and Buddhist mythologies and traditions.",
    img: Swayambhunath,
  },
  {
    id: 8,
    name: "Nagarkot",
    description:
      "Nagarkot is a scenic hill station located near Kathmandu, famous for its panoramic sunrise and sunset views over the Himalayas. On clear days, even Mount Everest can be seen from here. It’s a perfect getaway for nature lovers, photographers, and those seeking a peaceful escape from the city.Nagarkot is a picturesque hill station situated about 32 kilometers east of Kathmandu at an altitude of 2,195 meters (7,199 ft), renowned as the premier spot in the valley for spectacular Himalayan views, especially during sunrise and sunset. Its primary appeal lies in its breathtaking panoramic vista, which on a clear day stretches from the Dhaulagiri range in the west all the way to Mount Everest in the east—encompassing eight of the world's thirteen highest peaks. Once a military fort used to monitor the external activities of neighboring kingdoms, Nagarkot has evolved into a popular tourist retreat offering a peaceful escape from the city bustle, various hiking trails through forests and charming villages, and a range of accommodation options that allow visitors to soak in the crisp mountain air and majestic scenery.",
    img: Nagarkot,
  },
];

export default function AllFamousSpots() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Same Header as homepage */}
      <Header />

    <div className="px-6 py-12 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-12 text-black">
        Famous Tourist Spots in Nepal
      </h1>

      <div className="flex flex-col space-y-16">
        {famousSpots.map((spot, index) => (
          <div
            key={spot.id}
            className={`flex flex-col md:flex-row ${
              index % 2 === 1 ? "md:flex-row-reverse" : ""
            } items-center gap-8`}
          >
            {/* Image Section */}
            <div className="md:w-1/2 w-full h-72 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={spot.img}
                alt={spot.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Text Section */}
            <div className="md:w-1/2 w-full text-center md:text-left">
              <h2 className="text-2xl font-semibold text-black mb-4">
                {spot.name}
              </h2>
              <p className="text-gray-700 leading-relaxed">{spot.description}</p>
            </div>
          </div>
        ))}
           </div>
        </div>
    </div>
  );
}
