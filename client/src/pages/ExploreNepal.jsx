import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Header } from '../components/header/Header';
import Footer from '../components/footer/Footer';

export default function ExploreNepal() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [selectedProvince, setSelectedProvince] = useState(null);

  // Nepal provinces and major destinations data
  const nepalProvinces = {
    koshi: {
      name: "Koshi Province",
      capital: "Biratnagar",
      area: "25,905 km²",
      population: "4.9 million",
      color: "#059669",
      districts: ["Bhojpur", "Dhankuta", "Ilam", "Jhapa", "Khotang", "Morang", "Okhaldhunga", "Panchthar", "Sankhuwasabha", "Solukhumbu", "Sunsari", "Taplejung", "Terhathum", "Udayapur"],
      languages: ["Nepali", "Limbu", "Rai", "Sherpa", "Tamang", "Newari", "Maithili"],
      climate: "Subtropical to Alpine (varies from 60m to 8,848m elevation)",
      economy: "Agriculture, Tea production, Tourism, Hydropower, Industrial manufacturing",
      geography: "Extends from the Terai plains at 60m elevation to Mount Everest at 8,848m, encompassing tropical forests, terraced hills, and glaciated peaks.",
      culture: "Rich indigenous cultures including Sherpa, Rai, and Limbu communities with unique traditions, festivals, and architectural styles. Home to ancient trade routes between Tibet and Nepal.",
      description: "Eastern Nepal's gateway featuring the world's most diverse landscapes from the Terai plains to the highest peaks on Earth. This province encompasses everything from tropical jungles to glaciated summits, making it a microcosm of Nepal's incredible geographical and cultural diversity.",
      majorDestinations: [
        {
          name: "Mount Everest (Sagarmatha)",
          type: "Mountain Peak",
          elevation: "8,848m",
          location: "Solukhumbu District, Sagarmatha National Park",
          description: "The world's highest mountain, known as Sagarmatha in Nepali and Chomolungma in Tibetan. A sacred peak for local Sherpa communities and the ultimate mountaineering challenge.",
          detailedInfo: "Mount Everest stands as Earth's highest point above sea level, located in the Mahalangur Himal sub-range of the Himalayas. The mountain was formed approximately 60 million years ago when the Indian and Eurasian tectonic plates collided. The Sherpa people consider it sacred, calling it 'Chomolungma' meaning 'Goddess Mother of the World'. First summited by Edmund Hillary and Tenzing Norgay in 1953, it continues to attract climbers from around the world while serving as the economic backbone for Sherpa communities.",
          bestTimeToVisit: "March-May (Spring) and September-November (Autumn) for trekking; May for climbing",
          trekking: "Everest Base Camp Trek (12-16 days), Three Passes Trek (18-20 days), Gokyo Lakes Trek (12-15 days)",
          wildlife: "Snow leopard, Himalayan tahr, musk deer, Himalayan black bear, blue sheep, red panda, over 118 bird species",
          vegetation: "Alpine shrubs, rhododendrons (Nepal's national flower), juniper, birch forests, glacial moraines above 5,000m",
          highlights: ["Everest Base Camp (5,364m)", "Kala Patthar Viewpoint (5,545m)", "Sherpa Villages (Namche Bazaar, Tengboche)", "Sagarmatha National Park", "Tengboche Monastery", "Sherpa Culture Museum", "Gokyo Lakes", "Island Peak"],
          culturalSignificance: "Sacred to Sherpa Buddhism with ancient monasteries like Tengboche (founded 1916). Traditional Sherpa architecture, centuries-old trade routes, and the birthplace of modern mountaineering culture. Home to the Sherpa people who have been the backbone of Himalayan expeditions.",
          challenges: "Extreme altitude with risk of altitude sickness, unpredictable weather patterns, avalanche zones, crevasse fields, and the 'death zone' above 8,000m",
          facilities: "Well-developed trekking infrastructure with tea houses, lodges, helicopter rescue services, satellite communication, medical posts, and Lukla airport (world's most dangerous airport)"
        },
        {
          name: "Makalu",
          type: "Mountain Peak", 
          elevation: "8,485m",
          location: "Sankhuwasabha District, Makalu-Barun National Park",
          description: "The fifth highest mountain in the world, renowned for its perfect pyramid shape and extremely challenging climbing routes. Part of the pristine Makalu-Barun ecosystem.",
          detailedInfo: "Makalu is famous for its perfect pyramid structure with four sharp ridges, making it one of the most aesthetically pleasing peaks in the Himalayas. The mountain is notoriously difficult to climb due to its steep pitches and knife-edge ridges. The Makalu-Barun area represents one of the world's few remaining pristine mountain ecosystems, with an incredible diversity of flora and fauna.",
          bestTimeToVisit: "March-May and September-November for trekking; May for climbing attempts",
          trekking: "Makalu Base Camp Trek (18-22 days), Makalu Circuit Trek (20-24 days)",
          wildlife: "Red panda, snow leopard, Himalayan black bear, musk deer, clouded leopard, over 400 bird species including the endangered spiny babbler",
          vegetation: "Subtropical forests with sal and bamboo, temperate forests with rhododendron and oak, alpine meadows, and glacial zones",
          highlights: ["Makalu Base Camp (4,870m)", "Pristine Wilderness Experience", "Rare Wildlife Sanctuary", "Alpine Lakes", "Barun Valley", "Sherpani Col Pass", "Traditional Rai and Sherpa Villages"],
          culturalSignificance: "Remote area preserving traditional lifestyles of Sherpa and Rai communities. Ancient trade routes and Buddhist monasteries. The region maintains its authentic culture due to limited outside influence.",
          challenges: "Extremely remote location requiring extensive preparation, technical climbing sections, severe weather conditions, limited rescue facilities, and permit restrictions",
          facilities: "Basic tea houses in lower regions, camping required for higher elevations, limited communication, porter support essential, helicopter rescue possible but expensive"
        },
        {
          name: "Kanchenjunga",
          type: "Mountain Peak",
          elevation: "8,586m", 
          location: "Taplejung District, Kanchenjunga Conservation Area",
          description: "The third highest mountain in the world, sacred to local communities and offering one of Nepal's most remote and pristine trekking experiences.",
          detailedInfo: "Kanchenjunga, meaning 'Five Treasures of Snow', refers to its five peaks representing the five repositories of God: gold, silver, gems, grain, and holy books. It's considered sacred by both Sikkimese and Nepalese people. The mountain remained unclimbed until 1955, and climbers traditionally stop short of the actual summit out of respect for local religious beliefs.",
          bestTimeToVisit: "March-May and September-November for trekking; climbing season is May",
          trekking: "Kanchenjunga Base Camp Trek (24-26 days), Kanchenjunga Circuit Trek (26-28 days)",
          wildlife: "Snow leopard, red panda, Himalayan black bear, blue sheep, musk deer, takin, over 250 bird species",
          vegetation: "Tropical forests in lower elevations, temperate forests with rhododendron and magnolia, alpine vegetation, glacial zones",
          highlights: ["North and South Base Camps", "Sacred Mountain Views", "Remote Trekking Experience", "Diverse Flora and Fauna", "Yalung Glacier", "Traditional Limbu Villages", "Oktang Monastery"],
          culturalSignificance: "Sacred to Hindu and Buddhist traditions, home to Limbu and Sherpa communities with ancient shamanistic practices. Traditional architecture and lifestyle preserved due to remoteness. Ancient pilgrimage and trade routes.",
          challenges: "Very remote location requiring special permits, extreme weather conditions, limited infrastructure, high altitude challenges, and cultural sensitivity requirements",
          facilities: "Basic camping facilities, very limited tea houses, porter support essential, restricted area permits required, limited rescue services"
        },
        {
          name: "Biratnagar",
          type: "Industrial City",
          elevation: "72m",
          location: "Morang District, Terai Plains",
          description: "Nepal's second largest city and industrial capital, serving as the economic hub of eastern Nepal with rich cultural diversity and modern amenities.",
          detailedInfo: "Biratnagar, established in the early 20th century, is Nepal's industrial capital and second-largest city. Named after the legendary King Birat mentioned in the Mahabharata, the city has grown from a small trading post to a major industrial center. It serves as the gateway to eastern Nepal and is crucial for trade with India.",
          bestTimeToVisit: "October-March (cool and dry season), avoid monsoon season (June-September)",
          attractions: "Koshi Tappu Wildlife Reserve, Baraha Kshetra Temple, Industrial heritage tours, Local markets",
          wildlife: "Wild water buffalo, spotted deer, blue bull, gharial crocodile, over 200 bird species in nearby Koshi Tappu",
          vegetation: "Tropical deciduous forests, grasslands, wetlands, agricultural areas with rice and jute cultivation",
          highlights: ["Industrial Heritage Sites", "Koshi River and Barrage", "Cultural Diversity", "Traditional Markets", "Transportation Hub", "Educational Institutions", "Jute Mills", "Religious Sites"],
          culturalSignificance: "Melting pot of various ethnic groups including Madhesi, Newar, and hill communities. Traditional festivals like Chhath Puja, modern urban culture, and industrial heritage.",
          economy: "Jute processing, sugar production, rice mills, manufacturing, trade with India, transportation services",
          facilities: "Biratnagar Airport, modern hospitals, universities, hotels, restaurants, shopping centers, industrial zones, good road connectivity"
        },
        {
          name: "Ilam Tea Gardens",
          type: "Agricultural Region",
          elevation: "1,200-2,000m",
          location: "Ilam District, Eastern Hills",
          description: "Nepal's premier tea-producing region, famous for high-quality orthodox tea and scenic hill stations with panoramic Himalayan views.",
          detailedInfo: "Ilam is often called the 'Tea Garden of Nepal' due to its extensive tea plantations established during the British colonial period in the 1860s. The region produces some of the world's finest orthodox tea, competing with Darjeeling tea in quality and flavor. The cool climate, adequate rainfall, and well-drained soil create perfect conditions for tea cultivation.",
          bestTimeToVisit: "March-May for tea plucking season and clear mountain views, September-November for post-monsoon clarity",
          attractions: "Tea factory tours, Kanyam tea gardens, Sandakphu viewpoint, Mai Pokhari lake, Antu Danda sunrise point",
          wildlife: "Red panda, leopard, wild boar, barking deer, various bird species including the endangered spiny babbler",
          vegetation: "Tea plantations, subtropical forests, rhododendron forests, bamboo groves, cardamom cultivation",
          highlights: ["Orthodox Tea Production", "Scenic Hill Stations", "Himalayan Panoramas", "Tea Factory Tours", "Kanyam Village", "Sunrise Views from Antu Danda", "Traditional Tea Culture"],
          culturalSignificance: "Tea culture heritage spanning over 150 years, traditional hill communities, blend of Nepali and indigenous cultures, tea festivals and traditions",
          economy: "Premium tea production and export, agriculture, eco-tourism, cardamom cultivation, dairy farming",
          facilities: "Tea estate accommodations, local homestays, transportation networks, tea processing facilities, tourist information centers"
        }
      ]
    },
    madhesh: {
      name: "Madhesh Province", 
      capital: "Janakpur",
      area: "9,661 km²",
      population: "6.1 million",
      color: "#0891b2",
      description: "Southern plains region known for fertile agricultural land and significant religious sites.",
      majorDestinations: [
        {
          name: "Janakpur",
          type: "Religious City",
          elevation: "74m",
          description: "Sacred city and birthplace of Goddess Sita, featuring beautiful temples and rich Hindu culture.",
          highlights: ["Janaki Temple", "Ram Mandir", "Sacred Ponds", "Mithila Art"]
        },
        {
          name: "Chitwan National Park",
          type: "National Park",
          elevation: "150m",
          description: "UNESCO World Heritage site famous for one-horned rhinoceros, Bengal tigers, and diverse wildlife.",
          highlights: ["One-horned Rhino", "Bengal Tigers", "Elephant Safari", "Bird Watching"]
        },
        {
          name: "Parsa National Park",
          type: "National Park", 
          elevation: "150m",
          description: "Tropical and subtropical forest ecosystem home to tigers, leopards, and various bird species.",
          highlights: ["Tiger Reserve", "Sal Forests", "Wildlife Safari", "Bird Species"]
        }
      ]
    },
    bagmati: {
      name: "Bagmati Province",
      capital: "Hetauda", 
      area: "20,300 km²",
      population: "6.2 million",
      color: "#7c3aed",
      description: "Central Nepal province containing the capital Kathmandu and numerous UNESCO World Heritage sites.",
      majorDestinations: [
        {
          name: "Kathmandu",
          type: "Capital City",
          elevation: "1,400m",
          description: "Nepal's capital and largest city, featuring ancient palaces, temples, and vibrant street life.",
          highlights: ["Durbar Square", "Swayambhunath Stupa", "Thamel District", "Royal Palace"]
        },
        {
          name: "Bhaktapur",
          type: "Ancient City",
          elevation: "1,401m", 
          description: "Medieval city known for its well-preserved architecture, pottery, and traditional Newari culture.",
          highlights: ["55-Window Palace", "Nyatapola Temple", "Pottery Square", "Traditional Architecture"]
        },
        {
          name: "Patan",
          type: "Historic City",
          elevation: "1,400m",
          description: "Ancient city famous for its artistic heritage, metal crafts, and beautiful Durbar Square.",
          highlights: ["Patan Durbar Square", "Golden Temple", "Metal Crafts", "Buddhist Monasteries"]
        },
        {
          name: "Nagarkot",
          type: "Hill Station",
          elevation: "2,195m",
          description: "Popular hill station offering panoramic views of the Himalayas including Mount Everest on clear days.",
          highlights: ["Himalayan Views", "Sunrise/Sunset", "Mountain Panorama", "Hiking Trails"]
        }
      ]
    },
    gandaki: {
      name: "Gandaki Province",
      capital: "Pokhara",
      area: "21,504 km²", 
      population: "2.4 million",
      color: "#dc2626",
      description: "Central-western province featuring the Annapurna range and adventure tourism capital Pokhara.",
      majorDestinations: [
        {
          name: "Pokhara",
          type: "Lake City",
          elevation: "822m",
          description: "Adventure tourism capital with beautiful lakes, mountain views, and gateway to Annapurna treks.",
          highlights: ["Phewa Lake", "Annapurna Views", "Adventure Sports", "Peace Pagoda"]
        },
        {
          name: "Annapurna Circuit",
          type: "Trekking Route",
          elevation: "5,416m (Thorong La Pass)",
          description: "World-famous trekking circuit offering diverse landscapes, cultures, and mountain views.",
          highlights: ["Thorong La Pass", "Diverse Landscapes", "Mountain Villages", "Hot Springs"]
        },
        {
          name: "Manang",
          type: "Mountain Village",
          elevation: "3,519m",
          description: "High-altitude village on the Annapurna Circuit known for Tibetan culture and acclimatization.",
          highlights: ["Tibetan Culture", "High Altitude", "Mountain Views", "Ancient Monasteries"]
        },
        {
          name: "Muktinath",
          type: "Religious Site",
          elevation: "3,710m",
          description: "Sacred pilgrimage site for both Hindus and Buddhists, featuring eternal flames and holy springs.",
          highlights: ["Sacred Temple", "Eternal Flames", "Pilgrimage Site", "Mountain Views"]
        }
      ]
    },
    lumbini: {
      name: "Lumbini Province",
      capital: "Deukhuri",
      area: "22,288 km²",
      population: "5.1 million", 
      color: "#059669",
      description: "Western province home to Buddha's birthplace and significant Buddhist pilgrimage sites.",
      majorDestinations: [
        {
          name: "Lumbini",
          type: "UNESCO World Heritage Site",
          elevation: "150m",
          description: "Birthplace of Lord Buddha and one of the most important Buddhist pilgrimage sites in the world.",
          highlights: ["Maya Devi Temple", "Ashoka Pillar", "Sacred Garden", "International Monasteries"]
        },
        {
          name: "Tilaurakot",
          type: "Archaeological Site",
          elevation: "147m",
          description: "Ancient city believed to be the capital of the Shakya kingdom and Buddha's childhood home.",
          highlights: ["Ancient Ruins", "Archaeological Museum", "Buddhist Heritage", "Historical Significance"]
        },
        {
          name: "Banke National Park",
          type: "National Park",
          elevation: "153m",
          description: "Protected area in the Terai region known for tigers, elephants, and diverse wildlife.",
          highlights: ["Tiger Conservation", "Elephant Herds", "Sal Forests", "Wildlife Safari"]
        }
      ]
    },
    karnali: {
      name: "Karnali Province",
      capital: "Birendranagar",
      area: "27,984 km²",
      population: "1.7 million",
      color: "#ea580c", 
      description: "Largest and least populated province featuring remote wilderness and pristine mountain landscapes.",
      majorDestinations: [
        {
          name: "Rara Lake",
          type: "Alpine Lake",
          elevation: "2,990m",
          description: "Nepal's largest lake surrounded by pristine forests and snow-capped mountains in remote western Nepal.",
          highlights: ["Pristine Wilderness", "Crystal Clear Waters", "Rare Wildlife", "Trekking Destination"]
        },
        {
          name: "Shey Phoksundo Lake",
          type: "Alpine Lake", 
          elevation: "3,611m",
          description: "Stunning turquoise lake in Dolpo region, featured in the film 'Himalaya' and known for its beauty.",
          highlights: ["Turquoise Waters", "Dolpo Culture", "Remote Location", "Pristine Nature"]
        },
        {
          name: "Dolpo",
          type: "Remote Region",
          elevation: "3,000-5,000m",
          description: "Remote trans-Himalayan region with Tibetan culture, ancient monasteries, and pristine landscapes.",
          highlights: ["Tibetan Culture", "Ancient Monasteries", "Remote Trekking", "Unique Landscape"]
        }
      ]
    },
    sudurpashchim: {
      name: "Sudurpashchim Province",
      capital: "Godawari",
      area: "19,539 km²", 
      population: "2.7 million",
      color: "#7c2d12",
      description: "Far-western province known for its cultural diversity and the sacred Kailash region.",
      majorDestinations: [
        {
          name: "Api Nampa",
          type: "Mountain Peak",
          elevation: "7,132m",
          description: "Highest peak in the far west of Nepal, part of the Api Himal range near the Tibet border.",
          highlights: ["Remote Peak", "Technical Climbing", "Pristine Wilderness", "Border Region"]
        },
        {
          name: "Khaptad National Park",
          type: "National Park",
          elevation: "1,400-3,300m",
          description: "High-altitude national park known for its rolling grasslands, medicinal herbs, and spiritual significance.",
          highlights: ["Rolling Grasslands", "Medicinal Plants", "Spiritual Site", "Diverse Ecosystem"]
        },
        {
          name: "Shuklaphanta National Park",
          type: "National Park",
          elevation: "174m",
          description: "Terai region park famous for its large population of swamp deer and diverse bird species.",
          highlights: ["Swamp Deer", "Bird Watching", "Grasslands", "Wildlife Safari"]
        }
      ]
    }
  };

  return (
    <div className={theme === 'dark' ? 'bg-slate-900 text-white min-h-screen' : 'bg-gray-50 text-gray-900 min-h-screen'}>
      <Header />
      
      {/* Hero Section with Video Background */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23059669;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%230891b2;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grad)' /%3E%3C/svg%3E"
            onError={(e) => {
              // Fallback if video fails to load
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'block';
            }}
          >
            {/* High-quality Nepal tourism videos */}
            <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
            <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4" type="video/mp4" />
            
            {/* Your browser does not support the video tag */}
          </video>
          
          {/* Fallback background if video fails */}
          <div 
            className="w-full h-full bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-700 hidden"
            style={{
              backgroundImage: `
                linear-gradient(135deg, rgba(6, 182, 212, 0.8) 0%, rgba(59, 130, 246, 0.8) 50%, rgba(147, 51, 234, 0.8) 100%),
                url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M20 20h60v60H20z' fill='none' stroke='%23ffffff' stroke-width='0.5' opacity='0.1'/%3E%3Cpath d='M30 30l40 20-40 20z' fill='%23ffffff' opacity='0.2'/%3E%3C/svg%3E")
              `,
              backgroundSize: 'cover, 100px 100px',
              backgroundPosition: 'center, center',
              backgroundRepeat: 'no-repeat, repeat'
            }}
          ></div>
          
          {/* Video Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
          
          {/* Video Controls (Optional) */}
          <div className="absolute bottom-4 right-4 z-20">
            <button 
              onClick={(e) => {
                const video = e.target.closest('.relative').querySelector('video');
                if (video) {
                  if (video.muted) {
                    video.muted = false;
                    e.target.innerHTML = '🔊';
                  } else {
                    video.muted = true;
                    e.target.innerHTML = '🔇';
                  }
                }
              }}
              className="w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/20"
              title="Toggle sound"
            >
              🔇
            </button>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center text-white">
          <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-8 py-3 mb-8 border border-white/20">
            <span className="text-white font-semibold">Discover Nepal's Three Regions</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-teal-200 to-cyan-200 bg-clip-text text-transparent">
              Explore
            </span>
            <br />
            <span className="text-white drop-shadow-2xl">Nepal</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-12 leading-relaxed drop-shadow-lg">
            From the towering peaks of the Himalayas to the lush plains of Terai, 
            experience Nepal's incredible diversity across three distinct geographical regions.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <div className="text-center">
              <p className="text-lg text-white/90 mb-4">
                Discover Nepal's incredible diversity across three distinct geographical regions
              </p>
            </div>

            <button 
              onClick={() => document.getElementById('regions')?.scrollIntoView({ behavior: 'smooth' })}
              className="group flex items-center gap-4 text-white/80 hover:text-white transition-colors duration-300"
            >
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/30">
                <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-lg font-semibold drop-shadow-lg">Discover Regions</span>
            </button>
          </div>

          {/* Region Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-4 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/20">
                <span className="text-3xl">🏔️</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">Himalayan Region</h3>
              <p className="text-white/80 text-sm drop-shadow">World's highest peaks and alpine adventures</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-4 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/20">
                <span className="text-3xl">⛰️</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">Hilly Region</h3>
              <p className="text-white/80 text-sm drop-shadow">Rolling hills and cultural heritage sites</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-4 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/20">
                <span className="text-3xl">🌾</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">Terai Region</h3>
              <p className="text-white/80 text-sm drop-shadow">Fertile plains and wildlife sanctuaries</p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Interactive Nepal Map Section */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/50 dark:to-cyan-900/50 rounded-full px-8 py-4 mb-8 backdrop-blur-sm border border-teal-200 dark:border-teal-700">
                <div className="w-3 h-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full animate-pulse"></div>
                <span className="text-teal-700 dark:text-teal-300 font-bold text-lg">Explore by Region</span>
                <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full animate-pulse"></div>
              </div>
              
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
                <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Interactive
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">Nepal Map</span>
              </h2>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
                Discover Nepal's seven provinces through our premium interactive experience. 
                Click on any region to unlock detailed insights about its unique attractions, 
                cultural heritage, and natural wonders.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">From Himalayas to Terai Plains</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">7 Provinces • 77 Districts</span>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Premium Nepal Map Container */}
                <div className="lg:col-span-2">
                  <div className="relative bg-gradient-to-br from-white via-gray-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-3xl p-10 shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                    
                    {/* Premium Background Pattern */}
                    <div className="absolute inset-0 opacity-5 dark:opacity-10">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `
                          radial-gradient(circle at 25% 25%, rgba(6, 182, 212, 0.3) 0%, transparent 50%),
                          radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                          linear-gradient(45deg, transparent 49%, rgba(6, 182, 212, 0.1) 50%, transparent 51%)
                        `,
                        backgroundSize: '100px 100px, 150px 150px, 20px 20px'
                      }}></div>
                    </div>

                    {/* Header with Premium Styling */}
                    <div className="relative z-10 text-center mb-8">
                      <div className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-2xl px-6 py-3 mb-4 backdrop-blur-sm border border-teal-200 dark:border-teal-700">
                        <div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></div>
                        <span className="text-teal-700 dark:text-teal-300 font-bold">Federal Democratic Republic</span>
                        <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"></div>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2">Seven Provinces of Nepal</h3>
                      <p className="text-gray-600 dark:text-gray-400 font-medium">Click any province to explore detailed information</p>
                    </div>
                    
                    {/* Premium SVG Map of Nepal */}
                    <div className="relative bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-6 mb-8 border-2 border-gray-200 dark:border-slate-600 shadow-inner">
                      <svg viewBox="0 0 800 400" className="w-full h-auto rounded-xl overflow-hidden">
                        {/* Premium Background with Gradient */}
                        <defs>
                          <linearGradient id="mapBg" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={theme === 'dark' ? '#1e293b' : '#f8fafc'} />
                            <stop offset="50%" stopColor={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                            <stop offset="100%" stopColor={theme === 'dark' ? '#1e293b' : '#f8fafc'} />
                          </linearGradient>
                          
                          {/* Glow Effects for Selected Province */}
                          <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                            <feMerge> 
                              <feMergeNode in="coloredBlur"/>
                              <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                          </filter>
                          
                          {/* Drop Shadow */}
                          <filter id="dropshadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3"/>
                          </filter>
                        </defs>
                        
                        <rect width="800" height="400" fill="url(#mapBg)" />
                        
                        {/* Province 1 - Koshi (Far East) */}
                        <path
                          d="M600 100 L750 120 L780 180 L750 220 L680 200 L620 160 Z"
                          fill={selectedProvince === 'koshi' ? '#059669' : (theme === 'dark' ? '#475569' : '#e2e8f0')}
                          stroke={selectedProvince === 'koshi' ? '#10b981' : (theme === 'dark' ? '#64748b' : '#374151')}
                          strokeWidth={selectedProvince === 'koshi' ? "3" : "2"}
                          className="cursor-pointer transition-all duration-500 hover:opacity-80 transform-gpu"
                          style={{
                            filter: selectedProvince === 'koshi' ? 'url(#glow) url(#dropshadow)' : 'url(#dropshadow)',
                            transformOrigin: 'center'
                          }}
                          onClick={() => setSelectedProvince(selectedProvince === 'koshi' ? null : 'koshi')}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.filter = 'url(#glow) url(#dropshadow)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.filter = selectedProvince === 'koshi' ? 'url(#glow) url(#dropshadow)' : 'url(#dropshadow)';
                          }}
                        />
                        <text x="680" y="160" textAnchor="middle" className="text-sm font-bold pointer-events-none" fill={theme === 'dark' ? '#f1f5f9' : '#1e293b'}>
                          Koshi
                        </text>
                        
                        {/* Province 2 - Madhesh (South) */}
                        <path
                          d="M400 250 L620 260 L680 300 L650 340 L400 330 Z"
                          fill={selectedProvince === 'madhesh' ? '#0891b2' : (theme === 'dark' ? '#475569' : '#e2e8f0')}
                          stroke={selectedProvince === 'madhesh' ? '#06b6d4' : (theme === 'dark' ? '#64748b' : '#374151')}
                          strokeWidth={selectedProvince === 'madhesh' ? "3" : "2"}
                          className="cursor-pointer transition-all duration-500 hover:opacity-80 transform-gpu"
                          style={{
                            filter: selectedProvince === 'madhesh' ? 'url(#glow) url(#dropshadow)' : 'url(#dropshadow)',
                            transformOrigin: 'center'
                          }}
                          onClick={() => setSelectedProvince(selectedProvince === 'madhesh' ? null : 'madhesh')}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.filter = 'url(#glow) url(#dropshadow)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.filter = selectedProvince === 'madhesh' ? 'url(#glow) url(#dropshadow)' : 'url(#dropshadow)';
                          }}
                        />
                        <text x="540" y="300" textAnchor="middle" className="text-sm font-bold pointer-events-none" fill={theme === 'dark' ? '#f1f5f9' : '#1e293b'}>
                          Madhesh
                        </text>
                        
                        {/* Province 3 - Bagmati (Central) */}
                        <path
                          d="M400 150 L550 140 L600 180 L580 220 L450 230 L400 200 Z"
                          fill={selectedProvince === 'bagmati' ? '#7c3aed' : (theme === 'dark' ? '#475569' : '#e2e8f0')}
                          stroke={selectedProvince === 'bagmati' ? '#8b5cf6' : (theme === 'dark' ? '#64748b' : '#374151')}
                          strokeWidth={selectedProvince === 'bagmati' ? "3" : "2"}
                          className="cursor-pointer transition-all duration-500 hover:opacity-80 transform-gpu"
                          style={{
                            filter: selectedProvince === 'bagmati' ? 'url(#glow) url(#dropshadow)' : 'url(#dropshadow)',
                            transformOrigin: 'center'
                          }}
                          onClick={() => setSelectedProvince(selectedProvince === 'bagmati' ? null : 'bagmati')}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.filter = 'url(#glow) url(#dropshadow)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.filter = selectedProvince === 'bagmati' ? 'url(#glow) url(#dropshadow)' : 'url(#dropshadow)';
                          }}
                        />
                        <text x="500" y="185" textAnchor="middle" className="text-sm font-bold pointer-events-none" fill={theme === 'dark' ? '#f1f5f9' : '#1e293b'}>
                          Bagmati
                        </text>
                        
                        {/* Province 4 - Gandaki (Central-West) */}
                        <path
                          d="M250 120 L400 130 L420 180 L380 220 L280 210 L230 160 Z"
                          fill={selectedProvince === 'gandaki' ? '#dc2626' : (theme === 'dark' ? '#475569' : '#e2e8f0')}
                          stroke={selectedProvince === 'gandaki' ? '#ef4444' : (theme === 'dark' ? '#64748b' : '#374151')}
                          strokeWidth={selectedProvince === 'gandaki' ? "3" : "2"}
                          className="cursor-pointer transition-all duration-500 hover:opacity-80 transform-gpu"
                          style={{
                            filter: selectedProvince === 'gandaki' ? 'url(#glow) url(#dropshadow)' : 'url(#dropshadow)',
                            transformOrigin: 'center'
                          }}
                          onClick={() => setSelectedProvince(selectedProvince === 'gandaki' ? null : 'gandaki')}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.filter = 'url(#glow) url(#dropshadow)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.filter = selectedProvince === 'gandaki' ? 'url(#glow) url(#dropshadow)' : 'url(#dropshadow)';
                          }}
                        />
                        <text x="325" y="170" textAnchor="middle" className="text-sm font-bold pointer-events-none" fill={theme === 'dark' ? '#f1f5f9' : '#1e293b'}>
                          Gandaki
                        </text>
                        
                        {/* Province 5 - Lumbini (South-West) */}
                        <path
                          d="M150 200 L350 210 L380 260 L350 300 L150 290 Z"
                          fill={selectedProvince === 'lumbini' ? '#059669' : (theme === 'dark' ? '#475569' : '#e2e8f0')}
                          stroke={selectedProvince === 'lumbini' ? '#10b981' : (theme === 'dark' ? '#64748b' : '#374151')}
                          strokeWidth={selectedProvince === 'lumbini' ? "3" : "2"}
                          className="cursor-pointer transition-all duration-500 hover:opacity-80 transform-gpu"
                          style={{
                            filter: selectedProvince === 'lumbini' ? 'url(#glow) url(#dropshadow)' : 'url(#dropshadow)',
                            transformOrigin: 'center'
                          }}
                          onClick={() => setSelectedProvince(selectedProvince === 'lumbini' ? null : 'lumbini')}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.filter = 'url(#glow) url(#dropshadow)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.filter = selectedProvince === 'lumbini' ? 'url(#glow) url(#dropshadow)' : 'url(#dropshadow)';
                          }}
                        />
                        <text x="265" y="255" textAnchor="middle" className="text-sm font-bold pointer-events-none" fill={theme === 'dark' ? '#f1f5f9' : '#1e293b'}>
                          Lumbini
                        </text>
                        
                        {/* Province 6 - Karnali (Mid-West) */}
                        <path
                          d="M50 80 L220 90 L250 140 L220 180 L80 170 L30 120 Z"
                          fill={selectedProvince === 'karnali' ? '#ea580c' : (theme === 'dark' ? '#475569' : '#e2e8f0')}
                          stroke={selectedProvince === 'karnali' ? '#f97316' : (theme === 'dark' ? '#64748b' : '#374151')}
                          strokeWidth={selectedProvince === 'karnali' ? "3" : "2"}
                          className="cursor-pointer transition-all duration-500 hover:opacity-80 transform-gpu"
                          style={{
                            filter: selectedProvince === 'karnali' ? 'url(#glow) url(#dropshadow)' : 'url(#dropshadow)',
                            transformOrigin: 'center'
                          }}
                          onClick={() => setSelectedProvince(selectedProvince === 'karnali' ? null : 'karnali')}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.filter = 'url(#glow) url(#dropshadow)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.filter = selectedProvince === 'karnali' ? 'url(#glow) url(#dropshadow)' : 'url(#dropshadow)';
                          }}
                        />
                        <text x="140" y="135" textAnchor="middle" className="text-sm font-bold pointer-events-none" fill={theme === 'dark' ? '#f1f5f9' : '#1e293b'}>
                          Karnali
                        </text>
                        
                        {/* Province 7 - Sudurpashchim (Far West) */}
                        <path
                          d="M20 150 L150 160 L180 200 L150 240 L50 230 L20 190 Z"
                          fill={selectedProvince === 'sudurpashchim' ? '#7c2d12' : (theme === 'dark' ? '#475569' : '#e2e8f0')}
                          stroke={selectedProvince === 'sudurpashchim' ? '#a3472a' : (theme === 'dark' ? '#64748b' : '#374151')}
                          strokeWidth={selectedProvince === 'sudurpashchim' ? "3" : "2"}
                          className="cursor-pointer transition-all duration-500 hover:opacity-80 transform-gpu"
                          style={{
                            filter: selectedProvince === 'sudurpashchim' ? 'url(#glow) url(#dropshadow)' : 'url(#dropshadow)',
                            transformOrigin: 'center'
                          }}
                          onClick={() => setSelectedProvince(selectedProvince === 'sudurpashchim' ? null : 'sudurpashchim')}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.filter = 'url(#glow) url(#dropshadow)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.filter = selectedProvince === 'sudurpashchim' ? 'url(#glow) url(#dropshadow)' : 'url(#dropshadow)';
                          }}
                        />
                        <text x="100" y="200" textAnchor="middle" className="text-sm font-bold pointer-events-none" fill={theme === 'dark' ? '#f1f5f9' : '#1e293b'}>
                          Sudurpashchim
                        </text>
                        
                        {/* Premium Compass Rose */}
                        <g transform="translate(60, 350)">
                          <circle cx="0" cy="0" r="30" fill="none" stroke={theme === 'dark' ? '#64748b' : '#374151'} strokeWidth="2"/>
                          <circle cx="0" cy="0" r="25" fill="rgba(6, 182, 212, 0.1)" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="1"/>
                          <path d="M0,-22 L6,0 L0,22 L-6,0 Z" fill="url(#compassGradient)"/>
                          <defs>
                            <linearGradient id="compassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#0891b2" />
                              <stop offset="100%" stopColor="#0e7490" />
                            </linearGradient>
                          </defs>
                          <text x="0" y="-35" textAnchor="middle" className="text-sm font-bold" fill={theme === 'dark' ? '#f1f5f9' : '#1e293b'}>N</text>
                          <text x="0" y="45" textAnchor="middle" className="text-xs font-medium" fill={theme === 'dark' ? '#94a3b8' : '#64748b'}>Compass</text>
                        </g>
                      </svg>
                    </div>

                    {/* Premium Alternative Grid Map */}
                    <div className="mb-8">
                      <div className="text-center mb-6">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Alternative Province Selection</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Quick access to all provinces</p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(nepalProvinces).map(([key, province]) => (
                          <button
                            key={key}
                            onClick={() => setSelectedProvince(selectedProvince === key ? null : key)}
                            className={`group relative p-5 rounded-2xl text-left transition-all duration-500 border-2 transform hover:scale-105 ${
                              selectedProvince === key 
                                ? 'border-teal-500 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 text-teal-800 dark:text-teal-200 shadow-xl scale-105' 
                                : 'border-gray-200 dark:border-slate-600 bg-gradient-to-br from-white to-gray-50 dark:from-slate-700 dark:to-slate-800 hover:border-teal-300 dark:hover:border-teal-600 hover:shadow-lg'
                            }`}
                          >
                            {/* Premium Background Effect */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-white/50 to-transparent dark:via-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            
                            <div className="relative z-10">
                              <div className="flex items-center gap-3 mb-3">
                                <div 
                                  className="w-5 h-5 rounded-full shadow-lg border-2 border-white dark:border-slate-600"
                                  style={{ backgroundColor: province.color }}
                                ></div>
                                <span className="font-bold text-sm">{province.name}</span>
                              </div>
                              <div className="space-y-1">
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                  <span className="font-medium">Capital:</span> {province.capital}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                  <span className="font-medium">Population:</span> {province.population}
                                </div>
                              </div>
                            </div>
                            
                            {/* Selection Indicator */}
                            {selectedProvince === key && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Premium Map Legend */}
                    <div className="bg-gradient-to-r from-gray-50 to-white dark:from-slate-700 dark:to-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-600">
                      <h4 className="text-lg font-bold mb-4 text-center text-gray-900 dark:text-white">Province Legend</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(nepalProvinces).map(([key, province]) => (
                          <button
                            key={key}
                            onClick={() => setSelectedProvince(selectedProvince === key ? null : key)}
                            className={`group flex items-center gap-3 p-3 rounded-xl text-sm transition-all duration-300 ${
                              selectedProvince === key 
                                ? 'bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/50 dark:to-cyan-900/50 text-teal-800 dark:text-teal-200 shadow-lg transform scale-105' 
                                : 'bg-white dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 hover:shadow-md hover:scale-102'
                            }`}
                          >
                            <div 
                              className="w-4 h-4 rounded-full shadow-md border-2 border-white dark:border-slate-600 group-hover:scale-110 transition-transform duration-300"
                              style={{ backgroundColor: province.color }}
                            ></div>
                            <span className="font-semibold truncate">{province.name}</span>
                            
                            {selectedProvince === key && (
                              <div className="ml-auto w-4 h-4 bg-teal-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Premium Province Information Panel */}
                <div className="lg:col-span-1">
                  <div className="sticky top-8 bg-gradient-to-br from-white via-gray-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-slate-700 h-full min-h-[600px] overflow-hidden">
                    
                    {/* Premium Background Pattern */}
                    <div className="absolute inset-0 opacity-5 dark:opacity-10">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `
                          radial-gradient(circle at 75% 25%, rgba(6, 182, 212, 0.3) 0%, transparent 50%),
                          radial-gradient(circle at 25% 75%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)
                        `,
                        backgroundSize: '150px 150px, 100px 100px'
                      }}></div>
                    </div>

                    <div className="relative z-10 h-full flex flex-col">
                      {selectedProvince ? (
                        <div className="flex-1">
                          {/* Province Header */}
                          <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-2xl px-6 py-3 mb-4 backdrop-blur-sm border border-teal-200 dark:border-teal-700">
                              <div 
                                className="w-4 h-4 rounded-full shadow-lg border-2 border-white dark:border-slate-600 animate-pulse"
                                style={{ backgroundColor: nepalProvinces[selectedProvince].color }}
                              ></div>
                              <span className="text-teal-700 dark:text-teal-300 font-bold">Selected Province</span>
                            </div>
                            
                            <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2">
                              {nepalProvinces[selectedProvince].name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 font-medium">
                              Explore detailed information below
                            </p>
                          </div>
                          
                          {/* Province Stats */}
                          <div className="space-y-4 mb-8">
                            <div className="bg-gradient-to-r from-white to-gray-50 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-4 border border-gray-200 dark:border-slate-600 shadow-lg">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                  <div>
                                    <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Capital City</span>
                                    <div className="font-bold text-lg text-gray-900 dark:text-white">{nepalProvinces[selectedProvince].capital}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-white to-gray-50 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-4 border border-gray-200 dark:border-slate-600 shadow-lg">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                  <div>
                                    <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Area</span>
                                    <div className="font-bold text-lg text-gray-900 dark:text-white">{nepalProvinces[selectedProvince].area}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-white to-gray-50 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-4 border border-gray-200 dark:border-slate-600 shadow-lg">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Population</span>
                                    <div className="font-bold text-lg text-gray-900 dark:text-white">{nepalProvinces[selectedProvince].population}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Province Description */}
                          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-teal-200 dark:border-teal-700 mb-8">
                            <h4 className="text-lg font-bold text-teal-800 dark:text-teal-300 mb-3">About This Province</h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                              {nepalProvinces[selectedProvince].description}
                            </p>
                          </div>
                          
                          {/* Call to Action */}
                          <div className="text-center bg-gradient-to-r from-gray-50 to-white dark:from-slate-700 dark:to-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-600">
                            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Detailed Information</h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              Scroll down to discover comprehensive details about destinations, culture, and attractions in this province.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-center">
                          <div className="text-center py-12">
                            <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                              <svg className="w-10 h-10 text-teal-600 dark:text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Select a Province</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 max-w-xs mx-auto leading-relaxed">
                              Click on any province in the interactive map or use the selection buttons to discover detailed information about Nepal's regions.
                            </p>
                            
                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl p-3 border border-teal-200 dark:border-teal-700">
                                <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">7</div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">Provinces</div>
                              </div>
                              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-3 border border-blue-200 dark:border-blue-700">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">77</div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">Districts</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ultra Premium Complete Guide to Province */}
          {selectedProvince && (
            <div className="mb-32 relative overflow-hidden">
              {/* Premium Background Pattern */}
              <div className="absolute inset-0 opacity-5 dark:opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `
                    radial-gradient(circle at 25% 25%, rgba(6, 182, 212, 0.4) 0%, transparent 50%),
                    radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.4) 0%, transparent 50%),
                    radial-gradient(circle at 50% 10%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)
                  `,
                  backgroundSize: '800px 800px, 600px 600px, 1000px 1000px'
                }}></div>
              </div>

              <div className="relative z-10 max-w-7xl mx-auto">
                <div className="bg-gradient-to-br from-white via-gray-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-3xl p-12 shadow-2xl border-2 border-gray-200 dark:border-slate-700 overflow-hidden">
                  
                  {/* Premium Floating Elements */}
                  <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-gradient-to-br from-blue-400/15 to-indigo-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                  <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-cyan-400/10 to-teal-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>

                  <div className="relative z-10">
                    {/* Ultra Premium Header */}
                    <div className="text-center mb-16">
                      <div className="inline-flex items-center gap-4 bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/50 dark:to-cyan-900/50 rounded-full px-10 py-5 mb-8 backdrop-blur-sm border-2 border-teal-200 dark:border-teal-700 shadow-2xl">
                        <div className="w-4 h-4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full animate-pulse"></div>
                        <span className="text-teal-700 dark:text-teal-300 font-black text-xl">Province Guide</span>
                        <div className="w-4 h-4 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                      </div>
                      
                      <h3 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
                        <span className="text-gray-900 dark:text-white">Complete Guide to</span>
                        <br />
                        <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                          {nepalProvinces[selectedProvince].name}
                        </span>
                      </h3>
                      
                      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                        Discover comprehensive information about this remarkable province, from cultural heritage 
                        to major destinations and everything in between.
                      </p>
                    </div>

                    {/* Ultra Premium Province Overview Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
                      
                      {/* Province Overview Card */}
                      <div className="group relative bg-gradient-to-br from-white to-teal-50 dark:from-slate-700 dark:to-teal-900/20 rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 transform-gpu border-2 border-teal-200 dark:border-teal-700 overflow-hidden">
                        
                        {/* Premium Background Effects */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                        <div className="absolute -bottom-5 -left-5 w-24 h-24 bg-gradient-to-br from-cyan-400/15 to-teal-400/15 rounded-full blur-xl group-hover:scale-125 transition-transform duration-1000"></div>
                        
                        <div className="relative z-10">
                          {/* Premium Header */}
                          <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-2xl font-black text-gray-900 dark:text-white">Province Overview</h4>
                              <p className="text-teal-600 dark:text-teal-400 font-semibold">Essential Information</p>
                            </div>
                          </div>
                          
                          {/* Premium Stats Grid */}
                          <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-2xl border border-teal-200 dark:border-teal-700">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <span className="font-bold text-gray-600 dark:text-gray-300">Capital City</span>
                              </div>
                              <span className="font-black text-xl text-gray-900 dark:text-white">{nepalProvinces[selectedProvince].capital}</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl border border-blue-200 dark:border-blue-700">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <span className="font-bold text-gray-600 dark:text-gray-300">Total Area</span>
                              </div>
                              <span className="font-black text-xl text-gray-900 dark:text-white">{nepalProvinces[selectedProvince].area}</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl border border-purple-200 dark:border-purple-700">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                  </svg>
                                </div>
                                <span className="font-bold text-gray-600 dark:text-gray-300">Population</span>
                              </div>
                              <span className="font-black text-xl text-gray-900 dark:text-white">{nepalProvinces[selectedProvince].population}</span>
                            </div>
                          </div>

                          {/* Districts Section */}
                          {nepalProvinces[selectedProvince].districts && (
                            <div className="mt-8">
                              <h5 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Districts</h5>
                              <div className="flex flex-wrap gap-2">
                                {nepalProvinces[selectedProvince].districts.map((district, idx) => (
                                  <span key={idx} className="px-4 py-2 bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/50 dark:to-cyan-900/50 text-teal-700 dark:text-teal-300 rounded-full text-sm font-semibold border border-teal-200 dark:border-teal-700 hover:scale-105 transition-transform duration-300">
                                    {district}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Cultural & Geographic Info Card */}
                      <div className="group relative bg-gradient-to-br from-white to-blue-50 dark:from-slate-700 dark:to-blue-900/20 rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 transform-gpu border-2 border-blue-200 dark:border-blue-700 overflow-hidden">
                        
                        {/* Premium Background Effects */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                        <div className="absolute -bottom-5 -left-5 w-24 h-24 bg-gradient-to-br from-indigo-400/15 to-blue-400/15 rounded-full blur-xl group-hover:scale-125 transition-transform duration-1000"></div>
                        
                        <div className="relative z-10">
                          {/* Premium Header */}
                          <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-2xl font-black text-gray-900 dark:text-white">Cultural & Geographic Info</h4>
                              <p className="text-blue-600 dark:text-blue-400 font-semibold">Heritage & Environment</p>
                            </div>
                          </div>
                          
                          {/* Premium Info Grid */}
                          <div className="space-y-6">
                            {nepalProvinces[selectedProvince].languages && (
                              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl border border-blue-200 dark:border-blue-700">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                  <span className="font-bold text-gray-900 dark:text-white">Languages</span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                  {nepalProvinces[selectedProvince].languages.join(", ")}
                                </p>
                              </div>
                            )}
                            
                            {nepalProvinces[selectedProvince].climate && (
                              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl border border-green-200 dark:border-green-700">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                  <span className="font-bold text-gray-900 dark:text-white">Climate</span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                  {nepalProvinces[selectedProvince].climate}
                                </p>
                              </div>
                            )}
                            
                            {nepalProvinces[selectedProvince].economy && (
                              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl border border-amber-200 dark:border-amber-700">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                                    </svg>
                                  </div>
                                  <span className="font-bold text-gray-900 dark:text-white">Economy</span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                  {nepalProvinces[selectedProvince].economy}
                                </p>
                              </div>
                            )}
                            
                            {nepalProvinces[selectedProvince].geography && (
                              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl border border-purple-200 dark:border-purple-700">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                  <span className="font-bold text-gray-900 dark:text-white">Geography</span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                  {nepalProvinces[selectedProvince].geography}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ultra Premium About Section */}
                    <div className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-slate-700 dark:to-slate-800 rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-700 border-2 border-gray-200 dark:border-slate-600 mb-16 overflow-hidden">
                      
                      {/* Premium Background Effects */}
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-gray-400/10 to-slate-400/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-slate-400/5 to-gray-400/5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-1000"></div>
                      
                      <div className="relative z-10">
                        {/* Premium Header */}
                        <div className="flex items-center gap-4 mb-8">
                          <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-slate-700 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-3xl font-black text-gray-900 dark:text-white">About {nepalProvinces[selectedProvince].name}</h4>
                            <p className="text-gray-600 dark:text-gray-400 font-semibold">Province Description</p>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-slate-600 dark:to-slate-700 rounded-2xl p-8 border border-gray-200 dark:border-slate-600">
                          <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed mb-6">
                            {nepalProvinces[selectedProvince].description}
                          </p>
                          
                          {nepalProvinces[selectedProvince].culture && (
                            <div className="border-t border-gray-200 dark:border-slate-600 pt-6">
                              <h5 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                Cultural Heritage
                              </h5>
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {nepalProvinces[selectedProvince].culture}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Ultra Premium Major Destinations Section */}
                    <div className="group relative bg-gradient-to-br from-white to-teal-50 dark:from-slate-700 dark:to-teal-900/20 rounded-3xl p-10 shadow-2xl border-2 border-teal-200 dark:border-teal-700 overflow-hidden">
                      
                      {/* Premium Background Effects */}
                      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
                      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-cyan-400/15 to-teal-400/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                      
                      <div className="relative z-10">
                        {/* Premium Header */}
                        <div className="text-center mb-12">
                          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/50 dark:to-cyan-900/50 rounded-full px-8 py-4 mb-6 backdrop-blur-sm border border-teal-200 dark:border-teal-700 shadow-xl">
                            <div className="w-3 h-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full animate-pulse"></div>
                            <span className="text-teal-700 dark:text-teal-300 font-bold">Major Destinations</span>
                            <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                          </div>
                          
                          <h4 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
                            Explore {nepalProvinces[selectedProvince].name}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-lg">
                            Discover the most remarkable destinations this province has to offer
                          </p>
                        </div>
                        
                        {/* Ultra Premium Destinations Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {nepalProvinces[selectedProvince].majorDestinations.map((destination, index) => (
                            <div key={index} className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-slate-600 dark:to-slate-700 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 transform-gpu border-2 border-gray-200 dark:border-slate-500 overflow-hidden">
                              
                              {/* Premium Background Effects */}
                              <div className="absolute -top-5 -right-5 w-20 h-20 bg-gradient-to-br from-teal-400/10 to-cyan-400/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-1000"></div>
                              
                              <div className="relative z-10">
                                {/* Destination Header */}
                                <div className="flex items-start justify-between mb-6">
                                  <div className="flex-1">
                                    <h5 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{destination.name}</h5>
                                    <div className="flex items-center gap-3 mb-3">
                                      <span className="px-4 py-2 bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/50 dark:to-cyan-900/50 text-teal-700 dark:text-teal-300 rounded-full text-sm font-bold border border-teal-200 dark:border-teal-700">
                                        {destination.type}
                                      </span>
                                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="font-semibold">{destination.elevation}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Description */}
                                <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-6">
                                  {destination.description}
                                </p>
                                
                                {/* Key Highlights */}
                                <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-slate-500 dark:to-slate-600 rounded-2xl p-6 border border-gray-200 dark:border-slate-500">
                                  <h6 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                    Key Highlights
                                  </h6>
                                  <div className="grid grid-cols-2 gap-3">
                                    {destination.highlights.map((highlight, idx) => (
                                      <div key={idx} className="flex items-center gap-3 text-sm">
                                        <div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></div>
                                        <span className="text-gray-700 dark:text-gray-300 font-medium">{highlight}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Nepal's Three Regions Section - Ultra Professional */}
          <div id="regions" className="mb-32 relative overflow-hidden">
            {/* Premium Background Pattern */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.4) 0%, transparent 50%),
                  radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.4) 0%, transparent 50%),
                  radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)
                `,
                backgroundSize: '800px 800px, 600px 600px, 1000px 1000px'
              }}></div>
            </div>

            <div className="relative z-10">
              {/* Ultra Premium Header */}
              <div className="text-center mb-20">
                <div className="inline-flex items-center gap-4 bg-gradient-to-r from-teal-100 via-cyan-100 to-blue-100 dark:from-teal-900/50 dark:via-cyan-900/50 dark:to-blue-900/50 rounded-full px-10 py-5 mb-10 backdrop-blur-sm border-2 border-teal-200 dark:border-teal-700 shadow-2xl">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  </div>
                  <span className="text-teal-700 dark:text-teal-300 font-black text-xl">Nepal's Geography</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                    <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="w-4 h-4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '2.5s' }}></div>
                  </div>
                </div>
                
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-black mb-10 leading-tight">
                  <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    Three Distinct
                  </span>
                  <br />
                  <span className="text-gray-900 dark:text-white">Regions</span>
                </h2>
                
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-5xl mx-auto leading-relaxed mb-12">
                  Nepal's extraordinary geography creates a vertical world spanning from the world's highest peaks 
                  to fertile tropical plains, forming three distinct ecological and cultural zones that showcase 
                  the planet's most dramatic elevation changes within a single nation.
                </p>

                {/* Elevation Indicator */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl px-6 py-3 border border-blue-200 dark:border-blue-700">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
                    <span className="text-blue-700 dark:text-blue-300 font-bold text-sm">8,848m - 60m Elevation Range</span>
                  </div>
                  <div className="hidden sm:block w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl px-6 py-3 border border-green-200 dark:border-green-700">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-green-700 dark:text-green-300 font-bold text-sm">3 Unique Ecosystems</span>
                  </div>
                </div>
              </div>

              {/* Ultra Premium Region Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
                {/* Himalayan Region - Ultra Premium */}
                <div className="group relative bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-slate-800 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 transform-gpu border-2 border-blue-200 dark:border-blue-700">
                  
                  {/* Premium Background Effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                  
                  {/* Hero Image Section */}
                  <div className="relative h-80 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex items-center justify-center overflow-hidden">
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `
                          radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
                          radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)
                        `,
                        backgroundSize: '100px 100px, 150px 150px',
                        animation: 'float 6s ease-in-out infinite'
                      }}></div>
                    </div>
                    
                    {/* Premium Icon Container */}
                    <div className="relative z-10 w-32 h-32 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-white/20 shadow-2xl">
                      <div className="text-9xl group-hover:scale-110 transition-transform duration-500 filter drop-shadow-2xl">🏔️</div>
                    </div>
                    
                    {/* Floating Elements */}
                    <div className="absolute top-6 left-6 w-4 h-4 bg-white/30 rounded-full animate-pulse"></div>
                    <div className="absolute top-12 right-8 w-3 h-3 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-8 left-12 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                    
                    {/* Premium Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20"></div>
                    
                    {/* Region Info Badge */}
                    <div className="absolute bottom-6 left-6 bg-white/20 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/30">
                      <h3 className="text-2xl font-black text-white mb-1">Himalayan Region</h3>
                      <p className="text-white/90 text-sm font-semibold">Above 4,877m elevation</p>
                    </div>
                    
                    {/* Elevation Indicator */}
                    <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 border border-white/30">
                      <div className="text-white font-bold text-lg">8,848m</div>
                      <div className="text-white/80 text-xs">Peak Elevation</div>
                    </div>
                  </div>

                  {/* Premium Content Section */}
                  <div className="relative z-10 p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-gray-900 dark:text-white">Mountain Adventures</h4>
                        <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm">World's Highest Peaks</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-8">
                      Home to 8 of the world's 14 highest peaks including Mount Everest. Experience world-class 
                      trekking, mountaineering, and authentic Sherpa culture in the planet's most dramatic landscape.
                    </p>
                    
                    {/* Premium Feature List */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {[
                        { icon: "🏔️", text: "Mount Everest (8,848m)", color: "from-blue-500 to-indigo-500" },
                        { icon: "🥾", text: "Annapurna Circuit", color: "from-indigo-500 to-purple-500" },
                        { icon: "🏘️", text: "Sherpa Villages", color: "from-purple-500 to-blue-500" },
                        { icon: "🏞️", text: "Alpine Lakes", color: "from-blue-500 to-cyan-500" }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700 hover:scale-105 transition-transform duration-300">
                          <div className={`w-8 h-8 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center text-white text-sm shadow-lg`}>
                            {item.icon}
                          </div>
                          <span className="text-gray-800 dark:text-gray-200 font-semibold text-sm">{item.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Premium Stats */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-700">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">14</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">8000m+ Peaks</div>
                        </div>
                        <div>
                          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">-60°C</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Min Temp</div>
                        </div>
                        <div>
                          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">50+</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Glaciers</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hilly Region - Ultra Premium */}
                <div className="group relative bg-gradient-to-br from-white via-green-50 to-emerald-50 dark:from-slate-800 dark:via-green-900/20 dark:to-emerald-900/20 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 transform-gpu border-2 border-green-200 dark:border-green-700">
                  
                  {/* Premium Background Effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 via-emerald-600/5 to-teal-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                  
                  {/* Hero Image Section */}
                  <div className="relative h-80 bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800 flex items-center justify-center overflow-hidden">
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `
                          radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
                          radial-gradient(circle at 60% 60%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)
                        `,
                        backgroundSize: '120px 120px, 180px 180px',
                        animation: 'float 8s ease-in-out infinite reverse'
                      }}></div>
                    </div>
                    
                    {/* Premium Icon Container */}
                    <div className="relative z-10 w-32 h-32 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-white/20 shadow-2xl">
                      <div className="text-9xl group-hover:scale-110 transition-transform duration-500 filter drop-shadow-2xl">⛰️</div>
                    </div>
                    
                    {/* Floating Elements */}
                    <div className="absolute top-8 left-8 w-3 h-3 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute top-16 right-6 w-4 h-4 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                    <div className="absolute bottom-10 left-10 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '2.5s' }}></div>
                    
                    {/* Premium Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20"></div>
                    
                    {/* Region Info Badge */}
                    <div className="absolute bottom-6 left-6 bg-white/20 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/30">
                      <h3 className="text-2xl font-black text-white mb-1">Hilly Region</h3>
                      <p className="text-white/90 text-sm font-semibold">610m - 4,877m elevation</p>
                    </div>
                    
                    {/* Elevation Indicator */}
                    <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 border border-white/30">
                      <div className="text-white font-bold text-lg">1,400m</div>
                      <div className="text-white/80 text-xs">Avg Elevation</div>
                    </div>
                  </div>

                  {/* Premium Content Section */}
                  <div className="relative z-10 p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-gray-900 dark:text-white">Cultural Heritage</h4>
                        <p className="text-green-600 dark:text-green-400 font-semibold text-sm">Nepal's Cultural Heart</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-8">
                      Rolling hills dotted with ancient temples, traditional villages, and terraced farms. 
                      The cultural heart of Nepal featuring the historic Kathmandu Valley and UNESCO World Heritage sites.
                    </p>
                    
                    {/* Premium Feature List */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {[
                        { icon: "🏛️", text: "Kathmandu Valley", color: "from-green-500 to-emerald-500" },
                        { icon: "🏞️", text: "Pokhara Lakes", color: "from-emerald-500 to-teal-500" },
                        { icon: "🏺", text: "UNESCO Sites", color: "from-teal-500 to-green-500" },
                        { icon: "🏔️", text: "Hill Stations", color: "from-green-500 to-cyan-500" }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700 hover:scale-105 transition-transform duration-300">
                          <div className={`w-8 h-8 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center text-white text-sm shadow-lg`}>
                            {item.icon}
                          </div>
                          <span className="text-gray-800 dark:text-gray-200 font-semibold text-sm">{item.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Premium Stats */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-4 border border-green-200 dark:border-green-700">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-black text-green-600 dark:text-green-400">7</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">UNESCO Sites</div>
                        </div>
                        <div>
                          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">125+</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Ethnic Groups</div>
                        </div>
                        <div>
                          <div className="text-2xl font-black text-teal-600 dark:text-teal-400">30°C</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Max Temp</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terai Region - Ultra Premium */}
                <div className="group relative bg-gradient-to-br from-white via-amber-50 to-orange-50 dark:from-slate-800 dark:via-amber-900/20 dark:to-orange-900/20 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 transform-gpu border-2 border-amber-200 dark:border-amber-700">
                  
                  {/* Premium Background Effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-600/5 via-orange-600/5 to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                  
                  {/* Hero Image Section */}
                  <div className="relative h-80 bg-gradient-to-br from-amber-600 via-orange-700 to-red-800 flex items-center justify-center overflow-hidden">
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `
                          radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
                          radial-gradient(circle at 65% 65%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)
                        `,
                        backgroundSize: '140px 140px, 200px 200px',
                        animation: 'float 10s ease-in-out infinite'
                      }}></div>
                    </div>
                    
                    {/* Premium Icon Container */}
                    <div className="relative z-10 w-32 h-32 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-white/20 shadow-2xl">
                      <div className="text-9xl group-hover:scale-110 transition-transform duration-500 filter drop-shadow-2xl">🌾</div>
                    </div>
                    
                    {/* Floating Elements */}
                    <div className="absolute top-10 left-6 w-4 h-4 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-8 right-10 w-3 h-3 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute bottom-12 left-8 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
                    
                    {/* Premium Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20"></div>
                    
                    {/* Region Info Badge */}
                    <div className="absolute bottom-6 left-6 bg-white/20 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/30">
                      <h3 className="text-2xl font-black text-white mb-1">Terai Region</h3>
                      <p className="text-white/90 text-sm font-semibold">60m - 610m elevation</p>
                    </div>
                    
                    {/* Elevation Indicator */}
                    <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 border border-white/30">
                      <div className="text-white font-bold text-lg">200m</div>
                      <div className="text-white/80 text-xs">Avg Elevation</div>
                    </div>
                  </div>

                  {/* Premium Content Section */}
                  <div className="relative z-10 p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zM1 15a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H2a1 1 0 01-1-1v-2zm13-1a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-gray-900 dark:text-white">Wildlife & Plains</h4>
                        <p className="text-amber-600 dark:text-amber-400 font-semibold text-sm">Biodiversity Hotspot</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-8">
                      Fertile lowlands with dense forests and grasslands. Home to rare wildlife including 
                      Royal Bengal tigers, one-horned rhinos, and Asian elephants in pristine national parks.
                    </p>
                    
                    {/* Premium Feature List */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {[
                        { icon: "🐅", text: "Royal Bengal Tigers", color: "from-amber-500 to-orange-500" },
                        { icon: "🦏", text: "One-horned Rhinos", color: "from-orange-500 to-red-500" },
                        { icon: "🐘", text: "Asian Elephants", color: "from-red-500 to-amber-500" },
                        { icon: "🛕", text: "Lumbini (Buddha's Birthplace)", color: "from-amber-500 to-yellow-500" }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-700 hover:scale-105 transition-transform duration-300">
                          <div className={`w-8 h-8 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center text-white text-sm shadow-lg`}>
                            {item.icon}
                          </div>
                          <span className="text-gray-800 dark:text-gray-200 font-semibold text-sm">{item.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Premium Stats */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-4 border border-amber-200 dark:border-amber-700">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">12</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">National Parks</div>
                        </div>
                        <div>
                          <div className="text-2xl font-black text-orange-600 dark:text-orange-400">500+</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Bird Species</div>
                        </div>
                        <div>
                          <div className="text-2xl font-black text-red-600 dark:text-red-400">40°C</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Max Temp</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ultra Premium Comparison Chart */}
              <div className="bg-gradient-to-br from-white via-gray-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-3xl p-10 shadow-2xl border-2 border-gray-200 dark:border-slate-700 mb-16">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Regional Comparison</h3>
                  <p className="text-gray-600 dark:text-gray-400">Discover the unique characteristics of each region</p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200 dark:border-slate-600">
                        <th className="text-left py-4 px-6 font-black text-gray-900 dark:text-white">Characteristic</th>
                        <th className="text-center py-4 px-6 font-black text-blue-600 dark:text-blue-400">Himalayan</th>
                        <th className="text-center py-4 px-6 font-black text-green-600 dark:text-green-400">Hilly</th>
                        <th className="text-center py-4 px-6 font-black text-amber-600 dark:text-amber-400">Terai</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-600">
                      <tr className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-300">
                        <td className="py-4 px-6 font-semibold text-gray-900 dark:text-white">Elevation Range</td>
                        <td className="py-4 px-6 text-center text-blue-600 dark:text-blue-400 font-bold">4,877m - 8,848m</td>
                        <td className="py-4 px-6 text-center text-green-600 dark:text-green-400 font-bold">610m - 4,877m</td>
                        <td className="py-4 px-6 text-center text-amber-600 dark:text-amber-400 font-bold">60m - 610m</td>
                      </tr>
                      <tr className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-300">
                        <td className="py-4 px-6 font-semibold text-gray-900 dark:text-white">Climate</td>
                        <td className="py-4 px-6 text-center text-gray-600 dark:text-gray-400">Alpine/Arctic</td>
                        <td className="py-4 px-6 text-center text-gray-600 dark:text-gray-400">Temperate</td>
                        <td className="py-4 px-6 text-center text-gray-600 dark:text-gray-400">Subtropical/Tropical</td>
                      </tr>
                      <tr className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-300">
                        <td className="py-4 px-6 font-semibold text-gray-900 dark:text-white">Main Attractions</td>
                        <td className="py-4 px-6 text-center text-gray-600 dark:text-gray-400">Trekking, Mountaineering</td>
                        <td className="py-4 px-6 text-center text-gray-600 dark:text-gray-400">Culture, Heritage Sites</td>
                        <td className="py-4 px-6 text-center text-gray-600 dark:text-gray-400">Wildlife, National Parks</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Add floating animation keyframes */}
            <style jsx>{`
              @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-10px) rotate(2deg); }
              }
            `}</style>
          </div>

          {/* Ultra Premium Stats Section */}
          <div className="relative mb-32 overflow-hidden">
            {/* Premium Background Pattern */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  radial-gradient(circle at 25% 25%, rgba(6, 182, 212, 0.4) 0%, transparent 50%),
                  radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.4) 0%, transparent 50%),
                  radial-gradient(circle at 50% 10%, rgba(16, 185, 129, 0.3) 0%, transparent 50%),
                  radial-gradient(circle at 50% 90%, rgba(245, 158, 11, 0.3) 0%, transparent 50%)
                `,
                backgroundSize: '600px 600px, 800px 800px, 1000px 1000px, 700px 700px'
              }}></div>
            </div>

            <div className="relative z-10">
              {/* Premium Header */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-4 bg-gradient-to-r from-teal-100 via-cyan-100 to-blue-100 dark:from-teal-900/50 dark:via-cyan-900/50 dark:to-blue-900/50 rounded-full px-10 py-5 mb-8 backdrop-blur-sm border-2 border-teal-200 dark:border-teal-700 shadow-2xl">
                  <div className="w-4 h-4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full animate-pulse"></div>
                  <span className="text-teal-700 dark:text-teal-300 font-black text-xl">Nepal by Numbers</span>
                  <div className="w-4 h-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
                
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    Incredible
                  </span>
                  <br />
                  <span className="text-gray-900 dark:text-white">Statistics</span>
                </h2>
                
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Discover the remarkable numbers that define Nepal's extraordinary natural and cultural heritage
                </p>
              </div>

              {/* Ultra Premium Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                
                {/* UNESCO Sites */}
                <div className="group relative bg-gradient-to-br from-white via-teal-50 to-cyan-50 dark:from-slate-800 dark:via-teal-900/20 dark:to-cyan-900/20 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 transform-gpu border-2 border-teal-200 dark:border-teal-700 overflow-hidden">
                  
                  {/* Premium Background Effects */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                  <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-to-br from-cyan-400/15 to-teal-400/15 rounded-full blur-xl group-hover:scale-125 transition-transform duration-1000"></div>
                  
                  <div className="relative z-10 text-center">
                    {/* Premium Icon */}
                    <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                    </div>
                    
                    {/* Animated Counter */}
                    <div className="text-5xl md:text-6xl font-black text-transparent bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text mb-3 group-hover:scale-110 transition-transform duration-500">
                      8
                    </div>
                    
                    <div className="text-gray-700 dark:text-gray-300 font-bold text-lg mb-2">UNESCO Sites</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">World Heritage Recognition</div>
                    
                    {/* Premium Progress Bar */}
                    <div className="mt-4 bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left"></div>
                    </div>
                  </div>
                </div>

                {/* 8000m+ Peaks */}
                <div className="group relative bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-slate-800 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 transform-gpu border-2 border-blue-200 dark:border-blue-700 overflow-hidden">
                  
                  {/* Premium Background Effects */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                  <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-to-br from-indigo-400/15 to-blue-400/15 rounded-full blur-xl group-hover:scale-125 transition-transform duration-1000"></div>
                  
                  <div className="relative z-10 text-center">
                    {/* Premium Icon */}
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    
                    {/* Animated Counter */}
                    <div className="text-5xl md:text-6xl font-black text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text mb-3 group-hover:scale-110 transition-transform duration-500">
                      14
                    </div>
                    
                    <div className="text-gray-700 dark:text-gray-300 font-bold text-lg mb-2">8000m+ Peaks</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">World's Highest Mountains</div>
                    
                    {/* Premium Progress Bar */}
                    <div className="mt-4 bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>

                {/* Ethnic Groups */}
                <div className="group relative bg-gradient-to-br from-white via-purple-50 to-pink-50 dark:from-slate-800 dark:via-purple-900/20 dark:to-pink-900/20 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 transform-gpu border-2 border-purple-200 dark:border-purple-700 overflow-hidden">
                  
                  {/* Premium Background Effects */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                  <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-to-br from-pink-400/15 to-purple-400/15 rounded-full blur-xl group-hover:scale-125 transition-transform duration-1000"></div>
                  
                  <div className="relative z-10 text-center">
                    {/* Premium Icon */}
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                    </div>
                    
                    {/* Animated Counter */}
                    <div className="text-5xl md:text-6xl font-black text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text mb-3 group-hover:scale-110 transition-transform duration-500">
                      125+
                    </div>
                    
                    <div className="text-gray-700 dark:text-gray-300 font-bold text-lg mb-2">Ethnic Groups</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">Cultural Diversity</div>
                    
                    {/* Premium Progress Bar */}
                    <div className="mt-4 bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>

                {/* Climate Zones */}
                <div className="group relative bg-gradient-to-br from-white via-amber-50 to-orange-50 dark:from-slate-800 dark:via-amber-900/20 dark:to-orange-900/20 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 transform-gpu border-2 border-amber-200 dark:border-amber-700 overflow-hidden">
                  
                  {/* Premium Background Effects */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                  <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-to-br from-orange-400/15 to-amber-400/15 rounded-full blur-xl group-hover:scale-125 transition-transform duration-1000"></div>
                  
                  <div className="relative z-10 text-center">
                    {/* Premium Icon */}
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    
                    {/* Animated Counter */}
                    <div className="text-5xl md:text-6xl font-black text-transparent bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text mb-3 group-hover:scale-110 transition-transform duration-500">
                      12
                    </div>
                    
                    <div className="text-gray-700 dark:text-gray-300 font-bold text-lg mb-2">Climate Zones</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">Ecological Diversity</div>
                    
                    {/* Premium Progress Bar */}
                    <div className="mt-4 bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left" style={{ animationDelay: '0.6s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ultra Premium What We Offer Section */}
          <div className="relative mb-32 overflow-hidden">
            {/* Premium Background Pattern */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 30%, rgba(6, 182, 212, 0.4) 0%, transparent 50%),
                  radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.4) 0%, transparent 50%),
                  radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.3) 0%, transparent 50%),
                  radial-gradient(circle at 60% 20%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)
                `,
                backgroundSize: '800px 800px, 600px 600px, 1000px 1000px, 700px 700px'
              }}></div>
            </div>

            <div className="relative z-10">
              {/* Ultra Premium Header */}
              <div className="text-center mb-20">
                <div className="inline-flex items-center gap-4 bg-gradient-to-r from-teal-100 via-cyan-100 to-blue-100 dark:from-teal-900/50 dark:via-cyan-900/50 dark:to-blue-900/50 rounded-full px-12 py-6 mb-10 backdrop-blur-sm border-2 border-teal-200 dark:border-teal-700 shadow-2xl">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  </div>
                  <span className="text-teal-700 dark:text-teal-300 font-black text-2xl">Our Platform</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-teal-500 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="w-4 h-4 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full animate-pulse" style={{ animationDelay: '2.5s' }}></div>
                  </div>
                </div>
                
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-black mb-10 leading-tight">
                  <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    What We
                  </span>
                  <br />
                  <span className="text-gray-900 dark:text-white">Offer</span>
                </h2>
                
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-5xl mx-auto leading-relaxed mb-12">
                  Our comprehensive platform provides detailed information, interactive maps, and authentic insights 
                  to help you discover Nepal's incredible diversity through cutting-edge technology and expert knowledge.
                </p>

                {/* Premium Feature Indicators */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <div className="flex items-center gap-3 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl px-6 py-3 border border-teal-200 dark:border-teal-700">
                    <div className="w-3 h-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full animate-pulse"></div>
                    <span className="text-teal-700 dark:text-teal-300 font-bold text-sm">6 Core Features</span>
                  </div>
                  <div className="hidden sm:block w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl px-6 py-3 border border-blue-200 dark:border-blue-700">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-blue-700 dark:text-blue-300 font-bold text-sm">Premium Experience</span>
                  </div>
                </div>
              </div>

              {/* Ultra Premium Feature Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
                
                {/* Interactive Province Maps */}
                <div className="group relative bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-slate-800 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 transform-gpu border-2 border-blue-200 dark:border-blue-700 overflow-hidden">
                  
                  {/* Premium Background Effects */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-indigo-400/15 to-blue-400/15 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-1000"></div>
                  
                  <div className="relative z-10 text-center">
                    {/* Premium Icon Container */}
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
                      </svg>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-4">Interactive Province Maps</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-6">
                      Explore Nepal's 7 provinces through our premium clickable maps with detailed information about each region, 
                      including districts, demographics, and cultural highlights.
                    </p>
                    
                    {/* Premium Feature Tags */}
                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">7 Provinces</span>
                      <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-semibold">77 Districts</span>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">Interactive</span>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-700">
                      <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                        Click any province above to explore
                      </span>
                    </div>
                  </div>
                </div>

                {/* Detailed Destination Guides */}
                <div className="group relative bg-gradient-to-br from-white via-green-50 to-emerald-50 dark:from-slate-800 dark:via-green-900/20 dark:to-emerald-900/20 rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 transform-gpu border-2 border-green-200 dark:border-green-700 overflow-hidden">
                  
                  {/* Premium Background Effects */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-emerald-400/15 to-green-400/15 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-1000"></div>
                  
                  <div className="relative z-10 text-center">
                    {/* Premium Icon Container */}
                    <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-4">Detailed Destination Guides</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-6">
                      In-depth information about major destinations including elevation, wildlife, vegetation, 
                      cultural significance, best visiting times, and practical details.
                    </p>
                    
                    {/* Premium Feature Tags */}
                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold">Comprehensive</span>
                      <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-semibold">Educational</span>
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold">Detailed</span>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-4 border border-green-200 dark:border-green-700">
                      <span className="text-green-600 dark:text-green-400 font-bold text-sm">
                        Educational and comprehensive content
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cultural Heritage Information */}
                <div className="group relative bg-gradient-to-br from-white via-purple-50 to-pink-50 dark:from-slate-800 dark:via-purple-900/20 dark:to-pink-900/20 rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 transform-gpu border-2 border-purple-200 dark:border-purple-700 overflow-hidden">
                  
                  {/* Premium Background Effects */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-pink-400/15 to-purple-400/15 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-1000"></div>
                  
                  <div className="relative z-10 text-center">
                    {/* Premium Icon Container */}
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                      </svg>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-4">Cultural Heritage Information</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-6">
                      Learn about Nepal's diverse ethnic groups, languages, traditions, and cultural significance 
                      of various destinations with authentic local insights.
                    </p>
                    
                    {/* Premium Feature Tags */}
                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold">125+ Groups</span>
                      <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-xs font-semibold">Authentic</span>
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold">Local Insights</span>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-4 border border-purple-200 dark:border-purple-700">
                      <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">
                        Authentic cultural knowledge
                      </span>
                    </div>
                  </div>
                </div>

                {/* Geographic Exploration */}
                <div className="group relative bg-gradient-to-br from-white via-teal-50 to-cyan-50 dark:from-slate-800 dark:via-teal-900/20 dark:to-cyan-900/20 rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 transform-gpu border-2 border-teal-200 dark:border-teal-700 overflow-hidden">
                  
                  {/* Premium Background Effects */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-cyan-400/15 to-teal-400/15 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-1000"></div>
                  
                  <div className="relative z-10 text-center">
                    {/* Premium Icon Container */}
                    <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-4">Geographic Exploration</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-6">
                      Discover Nepal's three distinct regions - Himalayan, Hilly, and Terai - with detailed 
                      information about elevation ranges, climate, and unique characteristics.
                    </p>
                    
                    {/* Premium Feature Tags */}
                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                      <span className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-xs font-semibold">3 Regions</span>
                      <span className="px-3 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full text-xs font-semibold">12 Climates</span>
                      <span className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-xs font-semibold">Detailed</span>
                    </div>
                    
                    <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl p-4 border border-teal-200 dark:border-teal-700">
                      <span className="text-teal-600 dark:text-teal-400 font-bold text-sm">
                        From 60m to 8,848m elevation
                      </span>
                    </div>
                  </div>
                </div>

                {/* Wildlife & Biodiversity */}
                <div className="group relative bg-gradient-to-br from-white via-emerald-50 to-green-50 dark:from-slate-800 dark:via-emerald-900/20 dark:to-green-900/20 rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 transform-gpu border-2 border-emerald-200 dark:border-emerald-700 overflow-hidden">
                  
                  {/* Premium Background Effects */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-green-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-green-400/15 to-emerald-400/15 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-1000"></div>
                  
                  <div className="relative z-10 text-center">
                    {/* Premium Icon Container */}
                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zM1 15a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H2a1 1 0 01-1-1v-2zm13-1a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-4">Wildlife & Biodiversity</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-6">
                      Comprehensive information about Nepal's incredible biodiversity, from snow leopards 
                      in the Himalayas to tigers in the Terai, with vegetation details.
                    </p>
                    
                    {/* Premium Feature Tags */}
                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                      <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-semibold">500+ Species</span>
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold">12 Parks</span>
                      <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-semibold">Flora & Fauna</span>
                    </div>
                    
                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl p-4 border border-emerald-200 dark:border-emerald-700">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                        Flora and fauna insights
                      </span>
                    </div>
                  </div>
                </div>

                {/* Educational Platform */}
                <div className="group relative bg-gradient-to-br from-white via-orange-50 to-amber-50 dark:from-slate-800 dark:via-orange-900/20 dark:to-amber-900/20 rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 transform-gpu border-2 border-orange-200 dark:border-orange-700 overflow-hidden">
                  
                  {/* Premium Background Effects */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-amber-400/15 to-orange-400/15 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-1000"></div>
                  
                  <div className="relative z-10 text-center">
                    {/* Premium Icon Container */}
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-4">Educational Platform</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-6">
                      Our platform serves as an educational resource with university-level content about 
                      Nepal's geography, history, culture, and natural heritage.
                    </p>
                    
                    {/* Premium Feature Tags */}
                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                      <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-semibold">University Level</span>
                      <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-semibold">Research Quality</span>
                      <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-semibold">Educational</span>
                    </div>
                    
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl p-4 border border-orange-200 dark:border-orange-700">
                      <span className="text-orange-600 dark:text-orange-400 font-bold text-sm">
                        Research-quality information
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ultra Premium Nepal Information Hub Section */}
          <div className="relative mb-20 overflow-hidden">
            {/* Premium Background Pattern */}
            <div className="absolute inset-0 opacity-10 dark:opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.6) 0%, transparent 50%),
                  radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.6) 0%, transparent 50%),
                  radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.4) 0%, transparent 50%)
                `,
                backgroundSize: '1000px 1000px, 800px 800px, 1200px 1200px'
              }}></div>
            </div>

            <div className="relative z-10 bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-700 text-white rounded-3xl p-16 shadow-2xl border border-teal-400/30 overflow-hidden">
              
              {/* Premium Floating Elements */}
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
              <div className="absolute top-10 right-10 w-32 h-32 bg-blue-400/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
              
              {/* Premium Content Container */}
              <div className="relative z-10 text-center">
                
                {/* Ultra Premium Header */}
                <div className="mb-12">
                  <div className="inline-flex items-center gap-4 bg-white/20 backdrop-blur-md rounded-full px-10 py-4 mb-8 border border-white/30 shadow-2xl">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-white/80 rounded-full animate-pulse"></div>
                      <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                      <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                    </div>
                    <span className="text-white font-black text-xl">Complete Information Hub</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                      <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                      <div className="w-4 h-4 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '2.5s' }}></div>
                    </div>
                  </div>
                  
                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
                    <span className="text-white drop-shadow-2xl">Your Complete</span>
                    <br />
                    <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
                      Nepal Information Hub
                    </span>
                  </h2>
                  
                  <p className="text-xl md:text-2xl text-white/90 max-w-5xl mx-auto leading-relaxed mb-12 drop-shadow-lg">
                    Our comprehensive platform combines interactive maps, comprehensive destination guides, cultural insights, 
                    and educational resources to provide you with the most detailed information about Nepal available online.
                  </p>

                  {/* Premium Statistics Bar */}
                  <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
                    <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/30">
                      <div className="w-3 h-3 bg-white/80 rounded-full animate-pulse"></div>
                      <span className="text-white font-bold text-sm">6 Core Features</span>
                    </div>
                    <div className="hidden sm:block w-2 h-2 bg-white/40 rounded-full"></div>
                    <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/30">
                      <div className="w-3 h-3 bg-white/80 rounded-full animate-pulse"></div>
                      <span className="text-white font-bold text-sm">University-Level Content</span>
                    </div>
                    <div className="hidden sm:block w-2 h-2 bg-white/40 rounded-full"></div>
                    <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/30">
                      <div className="w-3 h-3 bg-white/80 rounded-full animate-pulse"></div>
                      <span className="text-white font-bold text-sm">Premium Experience</span>
                    </div>
                  </div>
                </div>

                {/* Ultra Premium Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  
                  {/* Interactive Maps */}
                  <div className="group relative bg-white/15 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-2xl hover:bg-white/20 hover:scale-105 transition-all duration-500 overflow-hidden">
                    
                    {/* Premium Background Effects */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                    <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-cyan-400/20 rounded-full blur-xl group-hover:scale-125 transition-transform duration-1000"></div>
                    
                    <div className="relative z-10 text-center">
                      {/* Premium Icon Container */}
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-white/40">
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
                        </svg>
                      </div>
                      
                      <h3 className="text-2xl font-black text-white mb-4 drop-shadow-lg">Interactive Maps</h3>
                      <p className="text-white/90 text-base leading-relaxed mb-4 drop-shadow">
                        Click and explore all 7 provinces with detailed information, demographics, and cultural highlights
                      </p>
                      
                      {/* Premium Feature Tags */}
                      <div className="flex flex-wrap gap-2 justify-center">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-semibold border border-white/30">7 Provinces</span>
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-semibold border border-white/30">Interactive</span>
                      </div>
                    </div>
                  </div>

                  {/* Educational Content */}
                  <div className="group relative bg-white/15 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-2xl hover:bg-white/20 hover:scale-105 transition-all duration-500 overflow-hidden">
                    
                    {/* Premium Background Effects */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                    <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-blue-400/20 rounded-full blur-xl group-hover:scale-125 transition-transform duration-1000"></div>
                    
                    <div className="relative z-10 text-center">
                      {/* Premium Icon Container */}
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-white/40">
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                        </svg>
                      </div>
                      
                      <h3 className="text-2xl font-black text-white mb-4 drop-shadow-lg">Educational Content</h3>
                      <p className="text-white/90 text-base leading-relaxed mb-4 drop-shadow">
                        University-level information about geography, culture, and history with research-quality depth
                      </p>
                      
                      {/* Premium Feature Tags */}
                      <div className="flex flex-wrap gap-2 justify-center">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-semibold border border-white/30">University Level</span>
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-semibold border border-white/30">Research Quality</span>
                      </div>
                    </div>
                  </div>

                  {/* Authentic Insights */}
                  <div className="group relative bg-white/15 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-2xl hover:bg-white/20 hover:scale-105 transition-all duration-500 overflow-hidden">
                    
                    {/* Premium Background Effects */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                    <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-teal-400/20 rounded-full blur-xl group-hover:scale-125 transition-transform duration-1000"></div>
                    
                    <div className="relative z-10 text-center">
                      {/* Premium Icon Container */}
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-white/40">
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                      </div>
                      
                      <h3 className="text-2xl font-black text-white mb-4 drop-shadow-lg">Authentic Insights</h3>
                      <p className="text-white/90 text-base leading-relaxed mb-4 drop-shadow">
                        Local knowledge and cultural significance of every destination with authentic perspectives
                      </p>
                      
                      {/* Premium Feature Tags */}
                      <div className="flex flex-wrap gap-2 justify-center">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-semibold border border-white/30">Local Knowledge</span>
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-semibold border border-white/30">Authentic</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Premium Call-to-Action */}
                <div className="mt-16 text-center">
                  <div className="inline-flex items-center gap-4 bg-white/20 backdrop-blur-md rounded-full px-8 py-4 border border-white/30 shadow-2xl">
                    <div className="w-3 h-3 bg-white/80 rounded-full animate-pulse"></div>
                    <span className="text-white font-bold text-lg">Start Exploring Nepal Today</span>
                    <div className="w-3 h-3 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}