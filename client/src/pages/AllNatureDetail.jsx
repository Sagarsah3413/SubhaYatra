import Shivapuri from "../assets/Nature/Shivapuri.jpeg";
import Lomanthang from "../assets/Nature/Lomanthang.jpeg";
import Langtang from "../assets/Nature/Langtang.jpeg";
import Bardiya from "../assets/Nature/Bardiya.jpeg";
import Khaptad from "../assets/Nature/Khaptad.jpeg";
import Gosaikunda from "../assets/Nature/Gosaikunda.jpeg";
import Shuklaphanta from "../assets/Nature/Shuklaphanta.jpeg";
import Ghandruk from "../assets/Nature/Ghandruk.jpeg";
import { Header } from "../../components/header/Header";


const places = [
    {
        id: 1,
        name: "Shivapuri",
        img: Shivapuri,
        description:
          "Basantapur is the historical and cultural epicenter of Kathmandu, most famous for hosting the magnificent Kathmandu Durbar Square, a UNESCO World Heritage site that served as the royal residence for Malla and Shah kings. This area is a dense concentration of ancient history and stunning Newari architecture, featuring more than fifty temples, intricately carved wooden structures, and palaces. Key landmarks include the Kumari Ghar, the residence of the living goddess Kumari; the Hanuman Dhoka Palace Museum; the imposing Kal Bhairav statue; and the multi-story Basantapur Tower. Despite sustaining damage in the 2015 earthquake, ongoing restorations have preserved its status as a vibrant hub where history comes alive amidst bustling markets and traditional street life, offering a profound glimpse into Nepal's royal past and continuing cultural traditions.",
      },
      {
        id: 2,
        name: "Lomanthang (Upper Mustang)",
        img: Lomanthang,
        description:
          "Bhainsepati is a rapidly developing, prime suburban area located in the Lalitpur district of the Kathmandu Valley, known for balancing the tranquility of a peaceful residential retreat with access to modern urban amenities. It has become a sought-after neighborhood for families, high-ranking government officials, and expatriates due to its well-planned infrastructure, less congested roads, and greener environment compared to the core city center. The area features numerous modern housing colonies and gated communities, such as Karyabinayak Homes, offering secure living with facilities like gyms, swimming pools, and landscaped gardens. Bhainsepati provides a self-sufficient lifestyle with access to top-tier educational institutions, quality healthcare facilities like Nepal Medi-City Hospital, shopping centers, and recreational areas nearby. Its strategic location, just a short drive from the Ekantakuna Ring Road and traditional Newari settlements like Khokana and Bungamati, ensures easy connectivity to the rest of the Kathmandu Valley while offering a quieter, healthier place to live. ",
      },
      {
        id: 3,
        name: "Langtang Valley",
        img: Langtang,
        description:
          "Bhaktapur Durbar Square, a UNESCO World Heritage site, is the beautifully preserved former royal palace complex of the Malla kings, showcasing the zenith of Newari art and architecture in the Kathmandu Valley. Known as Nepal's 'City of Devotees', the square functions as an open-air museum, featuring a harmonious blend of pagoda- and shikhara-style temples, intricate wood carvings, and vibrant living culture. Key architectural marvels include the stunning 55-Window Palace, renowned for its masterful craftsmanship, and the exquisite Golden Gate, described as one of the most beautiful pieces of art in the entire kingdom. The complex is also home to the iconic, five-story Nyatapola Temple, Nepal's tallest pagoda, and the Vatsala Temple with its barking bell, alongside lively areas like Pottery Square where ancient traditions still thrive. Despite damage from past earthquakes, particularly in 1934 and 2015, extensive restoration efforts using traditional methods have ensured the square remains a captivating, traffic-free glimpse into Nepal's regal past and enduring cultural identity. ",
      },
      {
        id: 4,
        name: "Bardiya National Park",
        img: Bardiya,
        description:
          "Bauddhanath Stupa, a magnificent UNESCO World Heritage site, is the largest spherical stupa in Nepal and one of the largest in the world, serving as the spiritual heart of Tibetan Buddhism outside of Tibet itself. Built sometime after 600 AD, this colossal structure is designed as a massive three-dimensional mandala, symbolizing the Buddhist cosmos and the path to enlightenment. Its iconic architecture features a massive whitewashed dome representing water, topped by a square harmika painted with the all-seeing eyes of the Buddha looking in all four directions, and a gilded spire with thirteen steps symbolizing the stages to Nirvana. The stupa is a vibrant center for pilgrimage, where devotees perform kora (clockwise circumambulation), spin prayer wheels, and light butter lamps amidst a serene atmosphere that is particularly moving during morning and evening prayers. Surrounded by numerous monasteries, shops, and restaurants, the area provides a rich cultural experience and a powerful sense of peace and spiritual energy for visitors and pilgrims alike. ",
      },
      {
        id: 5,
        name: "Khaptad National Park",
        img: Khaptad,
        description:
          "Changu Narayan Temple, a UNESCO World Heritage site, is considered the oldest functioning Hindu temple in Nepal, with a history dating back to the 4th century AD. Perched on a hilltop near Bhaktapur, the temple is dedicated to Lord Vishnu (Narayan) and is renowned for its exceptional Newari-style architecture and intricate stone, wood, and metal carvings that reflect the artistry of the Licchavi period. The main, two-tiered pagoda-style shrine is surrounded by a courtyard filled with ancient sculptures and inscriptions, including Nepal's oldest stone inscription dating from 464 AD, which details the military exploits of King Manadeva I. Notable artworks within the complex include a 7th-century stone carving of Vishnu riding his mythical vehicle Garuda (an image featured on Nepal's 10-rupee banknote) and a statue of Vishnu in his Narsingha (half-man, half-lion) incarnation. The site offers a peaceful retreat from the city bustle and provides panoramic views of the Kathmandu Valley, serving as a vital pilgrimage site and a testament to the region's rich cultural and artistic history. ",
      },
      {
        id: 6,
        name: "Gosaikunda Lake",
        img: Gosaikunda,
        description:
          "Dakshinkali Temple is one of Nepal's most significant Hindu pilgrimage sites, situated in a forested valley approximately 22 kilometers south of Kathmandu at the confluence of two sacred rivers. Dedicated to the powerful goddess Kali, a fierce manifestation of Durga who destroys evil, the temple's name translates to Kali of the South. The core of the shrine features an open-air setting housing a black stone idol of the four-armed goddess. This site is famous for its long-standing tradition of ritual animal sacrifice, which occurs primarily on Tuesdays and Saturdays and intensifies during the Dashain festival, as devotees offer male animals to appease the deity and receive blessings. For Hindus, these rituals are a profound act of devotion and a unique cultural spectacle, with large crowds gathering for worship and subsequent feasting. Visitors can observe the vibrant, intense atmosphere and rituals from the surrounding viewing terraces, though entry to the immediate inner sanctum is reserved for Hindu devotees. The temple complex also includes smaller shrines dedicated to other deities, nestled within the lush greenery of the surrounding hills, making it a spiritually charged and culturally rich destination. ",
      },
      {
        id: 7,
        name: "Shuklaphanta Wildlife Reserve",
        img: Shuklaphanta,
        description:
          "Kathmandu Durbar Square, a UNESCO World Heritage site and the historical heart of the capital, is an ancient complex of palaces, courtyards, and temples that served as the royal residence for the Malla and Shah kings of Nepal. This vibrant area, also known as Hanuman Dhoka Durbar Square, is a living museum of Newari architecture, celebrated for its intricate wood carvings, multi-tiered pagodas, and stunning stone sculptures. Key attractions within the square include the Kumari Ghar, the traditional home of Nepal's living goddess the Hanuman Dhoka Palace Museum complex; the massive stone statue of Kaal Bhairav; and the nine-story Basantapur Tower. Although the site suffered significant damage during the 2015 Gorkha earthquake, extensive and ongoing reconstruction efforts have preserved its historical integrity and bustling atmosphere, where religious ceremonies and cultural festivals like Indra Jatra continue to take place amidst locals and tourists alike. ",
      },
      {
        id: 8,
        name: "Ghandruk Village",
        img: Ghandruk,
        description:
          "Kathmandu, the bustling capital and largest metropolis of Nepal, serves as the historical, cultural, political, and economic heart of the country. Situated in the bowl-shaped Kathmandu Valley, the city is a mesmerizing tapestry where ancient traditions blend seamlessly with modernity. It is renowned for its dense concentration of UNESCO World Heritage sites, including the historic Kathmandu Durbar Square, the majestic Swayambhunath Stupa (Monkey Temple), the colossal Bauddhanath Stupa, and the sacred Pashupatinath Temple. The city's urban landscape is a labyrinth of narrow alleys, vibrant markets like Thamel and Asan, countless Hindu temples and Buddhist stupas, and Newari architectural masterpieces featuring intricate wood carvings. Despite rapid modernization, which brings challenges of congestion and pollution, Kathmandu retains a deeply spiritual and chaotic energy, serving as the primary gateway for international tourists and a unique living museum that embodies the resilient spirit and rich cultural heritage of the Nepali people.",
      },
    ];
    export default function AllNatureDetail() {
      return (
        <div className="min-h-screen bg-gray-50">
          {/* ✅ Same Header as homepage */}
          <Header />
    
          {/* ✅ Content Section */}
          <div className="max-w-6xl mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
              Explore Nature Places in Nepal
            </h1>
    
            <div className="space-y-16">
              {places.map((place, index) => (
                <div
                  key={place.id}
                  className={`flex flex-col md:flex-row items-center gap-10 ${
                    index % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Image */}
                  <div className="md:w-1/2 w-full overflow-hidden rounded-2xl shadow-lg">
                    <img
                      src={place.img}
                      alt={place.name}
                      className="w-full h-80 object-cover transform transition-transform duration-300 hover:scale-110"
                    />
                  </div>
    
                  {/* Text */}
                  <div className="md:w-1/2 w-full">
                    <h2 className="text-2xl font-semibold text-pink-700 mb-3">
                      {place.name}
                    </h2>
                    <p className="text-gray-700 leading-relaxed">{place.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
  