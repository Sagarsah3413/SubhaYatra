import { useState, useEffect } from 'react';
import Footer from '../components/footer/Footer';
import { Header } from '../components/header/Header';
import { useTheme } from '../contexts/ThemeContext';
import { 
  FaRocket,
  FaHeart,
  FaGlobe,
  FaUsers,
  FaAward,
  FaStar,
  FaMapMarkerAlt,
  FaCamera,
  FaCompass,
  FaShieldAlt,
  FaLightbulb,
  FaHandshake,
  FaEye,
  FaChartLine,
  FaQuoteLeft,
  FaPlay,
  FaArrowRight,
  FaCheck,
  FaClock,
  FaUserFriends,
  FaLeaf,
  FaCode,
  FaTrophy,
  FaBuilding,
  FaPlane,
  FaRoute,
  FaBookOpen,
  FaLinkedin,
  FaTwitter,
  FaInstagram
} from 'react-icons/fa';

export default function About() {
  const { bgClass, textClass, theme } = useTheme();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Travel Blogger & Content Creator",
      location: "San Francisco, USA",
      text: "Roamio Wanderly completely transformed how I discover and plan my Nepal adventures. Their local recommendations led me to hidden gems I never would have found on my own. The personalized itineraries saved me countless hours of research.",
      rating: 5,
      image: "👩‍💻",
      trips: "47 countries visited"
    },
    {
      name: "Marco Rodriguez",
      role: "Adventure Photographer",
      location: "Barcelona, Spain", 
      text: "As a professional photographer, I need unique locations that tell stories. Roamio's local insights and off-the-beaten-path recommendations have elevated my portfolio beyond imagination. Their cultural sensitivity guidance is invaluable.",
      rating: 5,
      image: "📸",
      trips: "62 destinations captured"
    },
    {
      name: "Aisha Patel",
      role: "Digital Nomad & Entrepreneur",
      location: "Mumbai, India",
      text: "Managing a remote business while traveling requires perfect planning. Roamio's detailed logistics, WiFi quality reports, and co-working space recommendations have made my nomadic lifestyle seamless and productive.",
      rating: 5,
      image: "💼",
      trips: "89 cities worked from"
    },
    {
      name: "James Thompson",
      role: "Family Travel Specialist",
      location: "London, UK",
      text: "Planning family trips with three kids used to be overwhelming. Roamio's family-friendly filters, safety ratings, and activity suggestions for different age groups have made our vacations stress-free and memorable.",
      rating: 5,
      image: "👨‍👩‍👧‍👦",
      trips: "23 family adventures"
    }
  ];

  const teamMembers = [
    {
      name: "Suman Sharma",
      role: "Founder & Nepal Travel Expert",
      bio: "Born and raised in Kathmandu with 15+ years exploring every corner of Nepal. Former trekking guide turned digital entrepreneur. Passionate about sharing Nepal's authentic beauty with the world.",
      image: "👨‍🏔️",
      expertise: "Nepal Culture & Trekking",
      social: { linkedin: "#", twitter: "#" }
    },
    {
      name: "Priya Gurung",
      role: "Co-Founder & Cultural Ambassador", 
      bio: "Heritage preservation specialist from Pokhara. Expert in Nepali traditions, festivals, and local customs. Connects travelers with authentic cultural experiences across Nepal.",
      image: "👩‍🎨",
      expertise: "Cultural Heritage & Festivals",
      social: { linkedin: "#", twitter: "#" }
    },
    {
      name: "Pemba Sherpa",
      role: "Mountain Guide Coordinator",
      bio: "Third-generation Sherpa guide from Everest region. Coordinates with local guides and ensures safe, authentic mountain experiences. Expert in high-altitude trekking.",
      image: "🏔️",
      expertise: "Mountain Expeditions",
      social: { linkedin: "#", instagram: "#" }
    },
    {
      name: "Anita Thapa",
      role: "Community Relations Manager",
      bio: "Connects travelers with local communities across Nepal. Specializes in homestays, village tourism, and ensuring tourism benefits reach local families.",
      image: "🏘️",
      expertise: "Community Tourism",
      social: { linkedin: "#", twitter: "#" }
    }
  ];

  const achievements = [
    {
      year: "2024",
      title: "Featured Travel Platform",
      organization: "Visit Nepal 2024 Campaign",
      description: "Selected as official partner for promoting Nepal tourism globally"
    },
    {
      year: "2023", 
      title: "Best Nepal Travel Guide",
      organization: "Lonely Planet Community",
      description: "Recognized for comprehensive and authentic Nepal travel content"
    },
    {
      year: "2023",
      title: "Community Impact Award",
      organization: "Nepal Tourism Association",
      description: "Honored for supporting local communities and promoting sustainable tourism practices"
    },
    {
      year: "2022",
      title: "Digital Innovation",
      organization: "Nepal IT Awards",
      description: "Winner for innovative approach to showcasing Nepal's tourism potential"
    }
  ];

  const partnerships = [
    {
      name: "UNESCO World Heritage",
      type: "Cultural Preservation Partner",
      description: "Promoting responsible tourism to UNESCO sites worldwide"
    },
    {
      name: "National Geographic",
      type: "Content & Photography Partner", 
      description: "Collaborating on authentic storytelling and visual content"
    },
    {
      name: "Lonely Planet",
      type: "Editorial Partner",
      description: "Integrating expert travel insights and destination guides"
    },
    {
      name: "Booking.com",
      type: "Accommodation Partner",
      description: "Providing seamless booking integration for recommended stays"
    }
  ];

  const values = [
    {
      icon: FaHeart,
      title: "Passion for Discovery",
      description: "We believe every journey should spark wonder and create lasting memories. Our team lives and breathes travel, bringing authentic enthusiasm to every recommendation.",
      color: "red",
      gradient: "from-red-500 to-pink-600",
      stats: "98% customer satisfaction"
    },
    {
      icon: FaShieldAlt,
      title: "Trust & Safety First",
      description: "Your safety is our top priority. Every destination, accommodation, and experience is thoroughly vetted by our expert team and local partners.",
      color: "blue", 
      gradient: "from-blue-500 to-cyan-600",
      stats: "Zero safety incidents"
    },
    {
      icon: FaLightbulb,
      title: "Innovation & Technology",
      description: "We leverage cutting-edge technology, local expertise, and cultural insights to provide personalized travel experiences that showcase the authentic beauty of Nepal.",
      color: "yellow",
      gradient: "from-yellow-500 to-orange-600", 
      stats: "Local expertise since 2015"
    },
    {
      icon: FaLeaf,
      title: "Sustainable Tourism",
      description: "We're committed to protecting the places we love. Our recommendations prioritize eco-friendly options and support local communities.",
      color: "green",
      gradient: "from-green-500 to-emerald-600",
      stats: "Eco-friendly travel since 2020"
    }
  ];

  const milestones = [
    {
      year: "2010",
      title: "The Beginning",
      description: "Founded by Nepal travel enthusiasts with a vision to share authentic local experiences with the world",
      icon: FaRocket,
      details: "Started with a small team of local guides and cultural experts in Kathmandu"
    },
    {
      year: "2012", 
      title: "First Million Users",
      description: "Reached 1 million registered users and launched mobile applications",
      icon: FaUsers,
      details: "Expanded to iOS and Android platforms"
    },
    {
      year: "2015",
      title: "Digital Platform Launch",
      description: "Launched our comprehensive digital platform connecting travelers with authentic Nepal experiences",
      icon: FaCode,
      details: "Connected travelers with 500+ local guides and experiences"
    },
    {
      year: "2018",
      title: "Global Expansion", 
      description: "Expanded operations to cover 200+ destinations across 6 continents",
      icon: FaGlobe,
      details: "Opened offices in London, Tokyo, and São Paulo"
    },
    {
      year: "2020",
      title: "Community Platform",
      description: "Built the world's largest travel community platform with user-generated content",
      icon: FaUserFriends,
      details: "10M+ travel stories and reviews shared"
    },
    {
      year: "2022",
      title: "Sustainability Initiative",
      description: "Launched comprehensive carbon-neutral travel program",
      icon: FaLeaf,
      details: "Offset 1M+ tons of CO2 through verified projects"
    },
    {
      year: "2024",
      title: "50K Milestone",
      description: "Reached milestone of connecting travelers with authentic Nepal experiences",
      icon: FaTrophy,
      details: "Featured in Nepal Tourism Board's official guide"
    }
  ];

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} flex flex-col`}>
      <Header />
      
      {/* Ultra-Premium Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Dynamic Background */}
        <div 
          className="absolute inset-0"
          style={{
            background: theme === 'dark' 
              ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)'
              : 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 25%, #99f6e4 50%, #5eead4 75%, #2dd4bf 100%)'
          }}
        />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Travel Icons */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-10 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${4 + Math.random() * 4}s`
              }}
            >
              {[FaGlobe, FaCamera, FaCompass, FaMapMarkerAlt, FaPlane, FaRoute][i % 6]({ size: 30 + Math.random() * 30 })}
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          {/* Text Background Overlay */}
          <div className="bg-black/50 dark:bg-black/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 mb-8">
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-teal-200 to-cyan-200 dark:from-teal-200 dark:via-cyan-200 dark:to-white bg-clip-text text-transparent">
                About
              </span>
              <br />
              <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Roamio Wanderly
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-3xl text-white mb-6 max-w-4xl mx-auto leading-relaxed font-semibold">
              Your trusted travel companion, dedicated to
              <span className="font-bold text-sky-300"> transforming dreams into extraordinary adventures</span>
            </p>

            <p className="text-lg md:text-xl text-white mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
              For over a decade, we've been dedicated to showcasing Nepal's incredible diversity through authentic local connections, 
              deep cultural expertise, and an unwavering commitment to creating meaningful experiences that connect 
              travelers with Nepal's most extraordinary destinations and vibrant local communities.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button className="group relative px-10 py-5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-xl overflow-hidden">
              <span className="relative z-10 flex items-center gap-3">
                <FaRocket />
                Discover Our Story
                <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>

            <button className="group flex items-center gap-4 px-8 py-5 bg-white/10 dark:bg-slate-800/30 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 text-white rounded-2xl font-semibold text-lg hover:bg-white/20 dark:hover:bg-slate-700/50 transition-all duration-300">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FaPlay className="text-sm ml-1" />
              </div>
              Watch Our Journey
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <FaShieldAlt />
              <span className="text-sm font-medium">100% Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <FaAward />
              <span className="text-sm font-medium">Featured in Travel Guides</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUsers />
              <span className="text-sm font-medium">Local Community Partners</span>
            </div>
            <div className="flex items-center gap-2">
              <FaLeaf />
              <span className="text-sm font-medium">Eco-Tourism Advocate</span>
            </div>
          </div>
        </div>
      </section>



      {/* Company Story Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-full px-8 py-4 mb-8 border border-teal-200/50 dark:border-teal-700/50">
              <FaBookOpen className="text-teal-600 dark:text-teal-400" />
              <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">Our Story</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                From Vision to Reality
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              What started as local Nepal enthusiasts' passion for sharing hidden gems has evolved 
              into a comprehensive travel platform, connecting adventurers with authentic Nepal experiences and trusted local guides.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-4xl p-12 border border-gray-200/50 dark:border-slate-700/50 shadow-2xl">
              <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-6">The Challenge We Addressed</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                Nepal's incredible diversity was often reduced to basic trekking routes and tourist hotspots. Travelers missed authentic experiences, 
                local communities weren't benefiting from tourism, and the real Nepal remained hidden from most visitors.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Our founders, local Nepal experts Suman and Priya, combined their deep cultural knowledge and passion for authentic travel 
                to create a platform that connects travelers with genuine Nepal experiences, local guides, and hidden gems across the country.
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 rounded-4xl p-12 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px)`,
                  backgroundSize: '40px 40px'
                }}></div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-3xl font-black mb-6">Our Innovation</h3>
                <p className="text-xl leading-relaxed mb-6 text-white/90">
                  We pioneered the use of local expertise and cultural insights in travel recommendations, analyzing thousands of authentic experiences 
                  to understand what makes each destination in Nepal special for different types of travelers.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <FaLightbulb className="text-white" />
                  </div>
                  <span className="font-semibold">Local Expertise • Cultural Insights • Authentic Experiences</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Mission */}
            <div className="bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 rounded-4xl p-12 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px)`,
                  backgroundSize: '40px 40px'
                }}></div>
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-xl rounded-full px-6 py-3 mb-8 border border-white/30">
                  <FaRocket className="text-white" />
                  <span className="text-sm font-semibold text-white">Our Mission</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                  Showcasing Authentic Nepal
                </h2>
                
                <p className="text-xl leading-relaxed mb-8 text-white/90">
                  To make personalized, authentic, and transformative travel experiences accessible to everyone, 
                  regardless of their budget, experience level, or travel style. We believe every journey should 
                  be as unique as the person taking it.
                </p>

                <div className="space-y-4">
                  {[
                    "Connect travelers with authentic local experiences",
                    "Support local communities worldwide", 
                    "Make Nepal travel planning effortless and inspiring"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaCheck className="text-white text-sm" />
                      </div>
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Vision */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-4xl p-12 border border-gray-200/50 dark:border-slate-700/50 shadow-2xl">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-full px-6 py-3 mb-8 border border-teal-200/50 dark:border-teal-700/50">
                <FaEye className="text-teal-600 dark:text-teal-400" />
                <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">Our Vision</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  A World United Through Travel
                </span>
              </h2>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                To become the world's most trusted travel companion, fostering cultural understanding, 
                environmental stewardship, and meaningful connections between travelers and local communities 
                across every corner of our planet.
              </p>

              <div className="space-y-4">
                {[
                  "Showcase Nepal to travelers worldwide",
                  "Promote sustainable and responsible tourism",
                  "Preserve cultural heritage through responsible tourism"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaCheck className="text-white text-sm" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-white/80 dark:bg-slate-800/30 backdrop-blur-xl rounded-full px-8 py-4 mb-8 border border-teal-200/50 dark:border-slate-700/50">
              <FaHeart className="text-teal-600 dark:text-teal-400" />
              <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">Our Core Values</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                What Drives Us Forward
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Our values aren't just words on a wall—they're the foundation of every decision we make, 
              every feature we build, and every experience we create for our global community of travelers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-200/50 dark:border-slate-700/50 overflow-hidden transform hover:scale-105"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                <div className={`relative w-16 h-16 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                  <value.icon className="text-2xl text-white" />
                </div>
                
                <h3 className="font-black text-xl text-gray-900 dark:text-white mb-4 text-center">
                  {value.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed mb-4">
                  {value.description}
                </p>

                <div className="text-center">
                  <div className={`inline-flex items-center gap-2 bg-gradient-to-r from-${value.color}-50 to-${value.color}-100 dark:from-${value.color}-900/30 dark:to-${value.color}-800/30 rounded-full px-4 py-2 border border-${value.color}-200/50 dark:border-${value.color}-700/50`}>
                    <FaChartLine className={`text-${value.color}-600 dark:text-${value.color}-400 text-sm`} />
                    <span className={`text-sm font-semibold text-${value.color}-700 dark:text-${value.color}-300`}>{value.stats}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>









      {/* Enhanced Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <div className="mb-16">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-8 py-4 mb-8 border border-white/20">
              <FaQuoteLeft className="text-white/80" />
              <span className="text-sm font-semibold text-white/90">What Our Travelers Say</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              Trusted by Adventurers Worldwide
            </h2>
            
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Don't just take our word for it. Here's what real travelers say about their experiences with Roamio Wanderly.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-12 border border-white/20 shadow-2xl">
              <div className="text-6xl mb-6">{testimonials[activeTestimonial].image}</div>
              
              <blockquote className="text-2xl md:text-3xl font-light mb-8 leading-relaxed italic">
                "{testimonials[activeTestimonial].text}"
              </blockquote>
              
              <div className="flex items-center justify-center gap-2 mb-6">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 text-xl" />
                ))}
              </div>
              
              <div className="font-bold text-xl mb-2">{testimonials[activeTestimonial].name}</div>
              <div className="text-white/70 mb-2">{testimonials[activeTestimonial].role}</div>
              <div className="text-white/60 mb-4">{testimonials[activeTestimonial].location}</div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xl rounded-full px-4 py-2 border border-white/30">
                <FaMapMarkerAlt className="text-white/80 text-sm" />
                <span className="text-sm font-semibold text-white/90">{testimonials[activeTestimonial].trips}</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === activeTestimonial 
                      ? 'bg-white scale-125' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
