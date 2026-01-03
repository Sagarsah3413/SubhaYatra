import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { 
  FaMapMarkerAlt, 
  FaPlane, 
  FaHotel, 
  FaUtensils, 
  FaCamera, 
  FaShieldAlt, 
  FaMoneyBillWave, 
  FaCalendarAlt,
  FaThermometerHalf,
  FaUmbrella,
  FaMountain,
  FaPassport,
  FaMedkit,
  FaWifi,
  FaLanguage,
  FaClock,
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheckCircle,
  FaGlobe,
  FaRoute,
  FaCompass,
  FaHeart,
  FaStar,
  FaUsers,
  FaLeaf,
  FaTree,
  FaSnowflake,
  FaSun,
  FaCloudRain,
  FaWind
} from 'react-icons/fa';

const TravelGuide = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle section change without scrolling
  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    // Prevent any scrolling behavior
    window.scrollTo({ top: window.pageYOffset, behavior: 'auto' });
  };

  // Travel Guide Data
  const guideData = {
    overview: {
      title: "Nepal Travel Guide",
      subtitle: "Your Complete Guide to the Land of the Himalayas",
      description: "Discover Nepal's incredible diversity - from the world's highest peaks to ancient temples, vibrant culture, and warm hospitality.",
      highlights: [
        { icon: FaMountain, title: "8 of 14 World's Highest Peaks", desc: "Including Mount Everest" },
        { icon: FaHeart, title: "UNESCO World Heritage Sites", desc: "10 cultural and natural sites" },
        { icon: FaUsers, title: "125+ Ethnic Groups", desc: "Rich cultural diversity" },
        { icon: FaLeaf, title: "Diverse Ecosystems", desc: "From tropical to alpine zones" }
      ]
    },
    
    planning: {
      title: "Trip Planning Essentials",
      sections: [
        {
          id: 'when-to-visit',
          title: 'Best Time to Visit',
          icon: FaCalendarAlt,
          content: [
            {
              season: 'Autumn (Sep-Nov)',
              icon: FaLeaf,
              weather: 'Clear skies, perfect visibility',
              temp: '15-25°C',
              activities: ['Trekking', 'Mountain views', 'Festivals'],
              pros: ['Best mountain views', 'Stable weather', 'Clear skies'],
              cons: ['Peak season crowds', 'Higher prices']
            },
            {
              season: 'Spring (Mar-May)',
              icon: FaTree,
              weather: 'Warm, blooming rhododendrons',
              temp: '20-30°C',
              activities: ['Trekking', 'Wildlife viewing', 'Photography'],
              pros: ['Rhododendron blooms', 'Good weather', 'Wildlife active'],
              cons: ['Some afternoon clouds', 'Pre-monsoon heat']
            },
            {
              season: 'Winter (Dec-Feb)',
              icon: FaSnowflake,
              weather: 'Cold but clear',
              temp: '5-15°C',
              activities: ['Lower altitude treks', 'Cultural tours', 'Wildlife'],
              pros: ['Clear mountain views', 'Fewer crowds', 'Lower prices'],
              cons: ['Cold temperatures', 'High altitude snow']
            },
            {
              season: 'Monsoon (Jun-Aug)',
              icon: FaCloudRain,
              weather: 'Heavy rainfall, cloudy',
              temp: '25-35°C',
              activities: ['Cultural tours', 'Upper Mustang', 'Rain shadow areas'],
              pros: ['Lush green landscapes', 'Fewer tourists', 'Cultural festivals'],
              cons: ['Heavy rains', 'Leeches on trails', 'Flight delays']
            }
          ]
        },
        {
          id: 'visa-requirements',
          title: 'Visa & Entry Requirements',
          icon: FaPassport,
          content: [
            {
              type: 'Tourist Visa',
              duration: '15/30/90 days',
              fee: '$30/$50/$125',
              requirements: ['Valid passport (6+ months)', 'Passport photos', 'Visa fee'],
              notes: 'Available on arrival or online'
            },
            {
              type: 'Visa on Arrival',
              locations: ['Tribhuvan Airport', 'Land borders'],
              payment: 'USD, EUR, or equivalent',
              processing: '15-30 minutes',
              notes: 'Bring exact change and photos'
            }
          ]
        },
        {
          id: 'budget-planning',
          title: 'Budget Planning',
          icon: FaMoneyBillWave,
          content: [
            {
              category: 'Budget Traveler',
              daily: '$15-25',
              accommodation: 'Guesthouses, hostels',
              food: 'Local restaurants, dal bhat',
              transport: 'Local buses, walking',
              activities: 'Free temples, hiking'
            },
            {
              category: 'Mid-Range Traveler',
              daily: '$40-80',
              accommodation: 'Hotels, lodges',
              food: 'Mix of local and international',
              transport: 'Private transport, domestic flights',
              activities: 'Guided tours, trekking permits'
            },
            {
              category: 'Luxury Traveler',
              daily: '$150-300+',
              accommodation: '5-star hotels, luxury lodges',
              food: 'Fine dining, international cuisine',
              transport: 'Private vehicles, helicopter tours',
              activities: 'Premium experiences, private guides'
            }
          ]
        }
      ]
    },

    destinations: {
      title: "Top Destinations",
      regions: [
        {
          id: 'kathmandu-valley',
          name: 'Kathmandu Valley',
          icon: FaGlobe,
          description: 'Cultural heart of Nepal with ancient temples and palaces',
          highlights: ['Durbar Squares', 'Swayambhunath', 'Boudhanath', 'Pashupatinath'],
          bestFor: ['Culture', 'History', 'Architecture', 'Shopping'],
          duration: '2-4 days',
          difficulty: 'Easy'
        },
        {
          id: 'everest-region',
          name: 'Everest Region',
          icon: FaMountain,
          description: 'Home to the world\'s highest peak and Sherpa culture',
          highlights: ['Everest Base Camp', 'Namche Bazaar', 'Tengboche Monastery', 'Kala Patthar'],
          bestFor: ['Trekking', 'Mountain views', 'Adventure', 'Photography'],
          duration: '12-16 days',
          difficulty: 'Challenging'
        },
        {
          id: 'annapurna-region',
          name: 'Annapurna Region',
          icon: FaRoute,
          description: 'Diverse landscapes from subtropical to alpine zones',
          highlights: ['Annapurna Circuit', 'Poon Hill', 'Annapurna Base Camp', 'Muktinath'],
          bestFor: ['Trekking', 'Diverse scenery', 'Hot springs', 'Sunrise views'],
          duration: '7-21 days',
          difficulty: 'Moderate to Challenging'
        },
        {
          id: 'pokhara',
          name: 'Pokhara',
          icon: FaHeart,
          description: 'Adventure capital with lakes and mountain views',
          highlights: ['Phewa Lake', 'Sarangkot', 'World Peace Pagoda', 'Adventure sports'],
          bestFor: ['Relaxation', 'Adventure sports', 'Lake activities', 'Mountain views'],
          duration: '2-5 days',
          difficulty: 'Easy to Moderate'
        },
        {
          id: 'chitwan',
          name: 'Chitwan National Park',
          icon: FaLeaf,
          description: 'Wildlife paradise in the subtropical lowlands',
          highlights: ['Rhino spotting', 'Elephant safari', 'Jungle walks', 'Tharu culture'],
          bestFor: ['Wildlife', 'Safari', 'Bird watching', 'Cultural experiences'],
          duration: '2-3 days',
          difficulty: 'Easy'
        }
      ]
    },

    practical: {
      title: "Practical Information",
      sections: [
        {
          id: 'health-safety',
          title: 'Health & Safety',
          icon: FaMedkit,
          tips: [
            'Get travel insurance with helicopter evacuation coverage',
            'Consult a travel doctor 4-6 weeks before departure',
            'Carry a comprehensive first aid kit',
            'Stay hydrated and acclimatize gradually',
            'Be aware of altitude sickness symptoms',
            'Use water purification tablets or bottled water',
            'Protect against sun exposure at high altitudes'
          ],
          vaccinations: ['Hepatitis A & B', 'Typhoid', 'Japanese Encephalitis', 'Routine vaccines'],
          emergency: {
            police: '100',
            ambulance: '102',
            fire: '101',
            tourist_helpline: '1144'
          }
        },
        {
          id: 'communication',
          title: 'Communication & Connectivity',
          icon: FaWifi,
          info: [
            {
              type: 'Internet',
              details: 'WiFi available in most hotels and cafes in cities. Limited in remote areas.',
              cost: 'Usually free in accommodations'
            },
            {
              type: 'Mobile Network',
              details: 'Good coverage in populated areas. Ncell and NTC are main providers.',
              cost: 'SIM cards: $2-5, Data packages: $5-15'
            },
            {
              type: 'Language',
              details: 'Nepali is official. English widely spoken in tourist areas.',
              phrases: ['Namaste (Hello)', 'Dhanyabad (Thank you)', 'Maaf garnuhos (Excuse me)']
            }
          ]
        },
        {
          id: 'transportation',
          title: 'Getting Around',
          icon: FaRoute,
          options: [
            {
              type: 'Domestic Flights',
              pros: ['Fast', 'Scenic views', 'Access to remote areas'],
              cons: ['Weather dependent', 'Expensive', 'Weight limits'],
              cost: '$100-300 per flight',
              tips: 'Book early, flexible dates, morning flights preferred'
            },
            {
              type: 'Tourist Buses',
              pros: ['Comfortable', 'AC', 'Reliable'],
              cons: ['More expensive than local', 'Fixed schedule'],
              cost: '$5-20 per journey',
              tips: 'Book through hotels or agencies'
            },
            {
              type: 'Local Buses',
              pros: ['Very cheap', 'Authentic experience', 'Frequent'],
              cons: ['Crowded', 'Uncomfortable', 'Slow'],
              cost: '$1-5 per journey',
              tips: 'Early morning departures, bring snacks'
            },
            {
              type: 'Private Vehicle',
              pros: ['Flexible', 'Comfortable', 'Direct routes'],
              cons: ['Expensive', 'Road conditions vary'],
              cost: '$50-150 per day',
              tips: 'Hire through reputable agencies'
            }
          ]
        }
      ]
    },

    culture: {
      title: "Culture & Etiquette",
      sections: [
        {
          id: 'cultural-norms',
          title: 'Cultural Norms',
          icon: FaUsers,
          guidelines: [
            {
              category: 'Greetings',
              dos: ['Use "Namaste" with palms together', 'Slight bow shows respect', 'Smile warmly'],
              donts: ['Avoid handshakes with opposite gender', 'Don\'t point with single finger']
            },
            {
              category: 'Religious Sites',
              dos: ['Remove shoes before entering', 'Dress modestly', 'Ask before photographing'],
              donts: ['Don\'t touch religious objects', 'Avoid leather items in Hindu temples']
            },
            {
              category: 'Social Interactions',
              dos: ['Accept hospitality graciously', 'Use right hand for eating', 'Show respect to elders'],
              donts: ['Don\'t refuse offered food/tea', 'Avoid public displays of affection']
            }
          ]
        },
        {
          id: 'festivals',
          title: 'Major Festivals',
          icon: FaStar,
          events: [
            {
              name: 'Dashain',
              month: 'September/October',
              duration: '15 days',
              significance: 'Biggest Hindu festival celebrating good over evil',
              experience: 'Family gatherings, kite flying, animal sacrifices, feasts'
            },
            {
              name: 'Tihar',
              month: 'October/November',
              duration: '5 days',
              significance: 'Festival of lights honoring different animals and relationships',
              experience: 'Oil lamps, decorations, singing, dancing, gambling'
            },
            {
              name: 'Holi',
              month: 'March',
              duration: '2 days',
              significance: 'Festival of colors celebrating spring',
              experience: 'Color throwing, water fights, music, dancing'
            }
          ]
        }
      ]
    }
  };

  // Filter and search functionality
  const filteredContent = (content) => {
    if (!searchQuery) return content;
    return content.filter(item => 
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Loading Travel Guide...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className={`absolute inset-0 ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900' 
              : 'bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900'
          }`}></div>
          <div className="absolute inset-0 bg-black/20"></div>
          
          {/* Animated Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-cyan-300/30 rounded-full animate-ping"></div>
            <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-teal-300/25 rounded-full animate-pulse delay-1000"></div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white">
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-white/20">
              <FaCompass className="text-teal-400" />
              <span className="font-semibold">Complete Travel Guide</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-emerald-300 bg-clip-text text-transparent">
                Nepal Travel
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                Guide
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-cyan-100 mb-4 max-w-4xl mx-auto leading-relaxed">
              {guideData.overview.description}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {guideData.overview.highlights.map((highlight, index) => (
              <div key={index} className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:transform hover:-translate-y-1">
                  <highlight.icon className="text-3xl text-teal-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-bold text-sm mb-2">{highlight.title}</h3>
                  <p className="text-xs text-cyan-200">{highlight.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className={`sticky top-20 z-40 ${theme === 'dark' ? 'bg-slate-900/95' : 'bg-white/95'} backdrop-blur-xl border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center overflow-x-auto py-4 space-x-1 min-h-[80px] items-center">
            {[
              { id: 'overview', label: 'Overview', icon: FaInfoCircle },
              { id: 'planning', label: 'Planning', icon: FaCalendarAlt },
              { id: 'destinations', label: 'Destinations', icon: FaMapMarkerAlt },
              { id: 'practical', label: 'Practical Info', icon: FaShieldAlt },
              { id: 'culture', label: 'Culture', icon: FaUsers }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={(e) => {
                  e.preventDefault();
                  handleSectionChange(tab.id);
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-colors duration-300 ${
                  activeSection === tab.id
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg'
                    : theme === 'dark'
                      ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="text-lg" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search travel guide..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-6 py-4 rounded-2xl border-2 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                }`}
              />
              <FaCompass className="absolute right-6 top-1/2 transform -translate-y-1/2 text-teal-500 text-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <main className="pb-20">
        <div className="relative">
          {activeSection === 'overview' && (
            <div className="animate-in fade-in duration-300">
              <OverviewSection data={guideData.overview} theme={theme} />
            </div>
          )}
          
          {activeSection === 'planning' && (
            <div className="animate-in fade-in duration-300">
              <PlanningSection data={guideData.planning} theme={theme} />
            </div>
          )}
          
          {activeSection === 'destinations' && (
            <div className="animate-in fade-in duration-300">
              <DestinationsSection data={guideData.destinations} theme={theme} />
            </div>
          )}
          
          {activeSection === 'practical' && (
            <div className="animate-in fade-in duration-300">
              <PracticalSection data={guideData.practical} theme={theme} />
            </div>
          )}
          
          {activeSection === 'culture' && (
            <div className="animate-in fade-in duration-300">
              <CultureSection data={guideData.culture} theme={theme} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Overview Section Component
const OverviewSection = ({ data, theme }) => (
  <section className="max-w-7xl mx-auto px-6">
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-black mb-6">
        <span className={`bg-gradient-to-r ${
          theme === 'dark' 
            ? 'from-teal-400 to-cyan-400' 
            : 'from-teal-600 to-cyan-600'
        } bg-clip-text text-transparent`}>
          {data.title}
        </span>
      </h2>
      <p className={`text-xl leading-relaxed max-w-4xl mx-auto ${
        theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
      }`}>
        {data.subtitle}
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {data.highlights.map((highlight, index) => (
        <div key={index} className="group">
          <div className={`p-8 rounded-3xl border transition-all duration-500 hover:transform hover:-translate-y-2 ${
            theme === 'dark'
              ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
              : 'bg-white border-gray-200 hover:border-gray-300'
          } shadow-lg hover:shadow-2xl`}>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-teal-600 to-cyan-600'
                : 'bg-gradient-to-br from-teal-500 to-cyan-500'
            } shadow-xl`}>
              <highlight.icon className="text-2xl text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-center">{highlight.title}</h3>
            <p className={`text-center leading-relaxed ${
              theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
            }`}>
              {highlight.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

// Planning Section Component  
const PlanningSection = ({ data, theme }) => (
  <section className="max-w-7xl mx-auto px-6">
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-black mb-6">
        <span className={`bg-gradient-to-r ${
          theme === 'dark' 
            ? 'from-teal-400 to-cyan-400' 
            : 'from-teal-600 to-cyan-600'
        } bg-clip-text text-transparent`}>
          {data.title}
        </span>
      </h2>
    </div>

    <div className="space-y-16">
      {data.sections.map((section, index) => (
        <div key={section.id} className={`p-8 rounded-3xl border ${
          theme === 'dark'
            ? 'bg-slate-800/30 border-slate-700'
            : 'bg-white border-gray-200'
        } shadow-xl`}>
          <div className="flex items-center gap-4 mb-8">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-teal-600 to-cyan-600'
                : 'bg-gradient-to-br from-teal-500 to-cyan-500'
            } shadow-lg`}>
              <section.icon className="text-xl text-white" />
            </div>
            <h3 className="text-2xl font-bold">{section.title}</h3>
          </div>

          {section.id === 'when-to-visit' && (
            <div className="grid md:grid-cols-2 gap-8">
              {section.content.map((season, idx) => (
                <div key={idx} className={`p-6 rounded-2xl border ${
                  theme === 'dark'
                    ? 'bg-slate-700/50 border-slate-600'
                    : 'bg-gray-50 border-gray-200'
                } hover:shadow-lg transition-all duration-300`}>
                  <div className="flex items-center gap-3 mb-4">
                    <season.icon className="text-2xl text-teal-500" />
                    <h4 className="text-xl font-bold">{season.season}</h4>
                  </div>
                  <div className="space-y-3">
                    <p className={`${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
                      <strong>Weather:</strong> {season.weather}
                    </p>
                    <p className={`${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
                      <strong>Temperature:</strong> {season.temp}
                    </p>
                    <div>
                      <strong className={theme === 'dark' ? 'text-green-400' : 'text-green-600'}>Pros:</strong>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {season.pros.map((pro, i) => (
                          <li key={i} className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong className={theme === 'dark' ? 'text-red-400' : 'text-red-600'}>Cons:</strong>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {season.cons.map((con, i) => (
                          <li key={i} className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {section.id === 'budget-planning' && (
            <div className="grid md:grid-cols-3 gap-8">
              {section.content.map((budget, idx) => (
                <div key={idx} className={`p-6 rounded-2xl border ${
                  theme === 'dark'
                    ? 'bg-slate-700/50 border-slate-600'
                    : 'bg-gray-50 border-gray-200'
                } hover:shadow-lg transition-all duration-300`}>
                  <h4 className="text-xl font-bold mb-4 text-center">{budget.category}</h4>
                  <div className="text-center mb-4">
                    <span className="text-3xl font-black text-teal-500">{budget.daily}</span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>/day</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <strong>Accommodation:</strong>
                      <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                        {budget.accommodation}
                      </p>
                    </div>
                    <div>
                      <strong>Food:</strong>
                      <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                        {budget.food}
                      </p>
                    </div>
                    <div>
                      <strong>Transport:</strong>
                      <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                        {budget.transport}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  </section>
);

// Destinations Section Component
const DestinationsSection = ({ data, theme }) => (
  <section className="max-w-7xl mx-auto px-6">
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-black mb-6">
        <span className={`bg-gradient-to-r ${
          theme === 'dark' 
            ? 'from-teal-400 to-cyan-400' 
            : 'from-teal-600 to-cyan-600'
        } bg-clip-text text-transparent`}>
          {data.title}
        </span>
      </h2>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {data.regions.map((region, index) => (
        <div key={region.id} className="group">
          <div className={`p-8 rounded-3xl border transition-all duration-500 hover:transform hover:-translate-y-2 ${
            theme === 'dark'
              ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
              : 'bg-white border-gray-200 hover:border-gray-300'
          } shadow-lg hover:shadow-2xl`}>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-teal-600 to-cyan-600'
                : 'bg-gradient-to-br from-teal-500 to-cyan-500'
            } shadow-xl`}>
              <region.icon className="text-2xl text-white" />
            </div>
            
            <h3 className="text-xl font-bold mb-3">{region.name}</h3>
            <p className={`mb-4 leading-relaxed ${
              theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
            }`}>
              {region.description}
            </p>
            
            <div className="space-y-3 mb-6">
              <div>
                <strong className="text-sm">Highlights:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {region.highlights.map((highlight, idx) => (
                    <span key={idx} className={`px-2 py-1 rounded-lg text-xs ${
                      theme === 'dark'
                        ? 'bg-slate-700 text-slate-300'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span><strong>Duration:</strong> {region.duration}</span>
                <span className={`px-2 py-1 rounded-lg ${
                  region.difficulty === 'Easy' 
                    ? 'bg-green-100 text-green-800' 
                    : region.difficulty === 'Moderate' || region.difficulty.includes('Moderate')
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                }`}>
                  {region.difficulty}
                </span>
              </div>
            </div>
            
            <button className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white'
                : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white'
            } shadow-lg hover:shadow-xl transform hover:scale-105`}>
              Learn More
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
);

// Practical Section Component
const PracticalSection = ({ data, theme }) => (
  <section className="max-w-7xl mx-auto px-6">
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-black mb-6">
        <span className={`bg-gradient-to-r ${
          theme === 'dark' 
            ? 'from-teal-400 to-cyan-400' 
            : 'from-teal-600 to-cyan-600'
        } bg-clip-text text-transparent`}>
          {data.title}
        </span>
      </h2>
    </div>

    <div className="space-y-12">
      {data.sections.map((section, index) => (
        <div key={section.id} className={`p-8 rounded-3xl border ${
          theme === 'dark'
            ? 'bg-slate-800/30 border-slate-700'
            : 'bg-white border-gray-200'
        } shadow-xl`}>
          <div className="flex items-center gap-4 mb-8">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-teal-600 to-cyan-600'
                : 'bg-gradient-to-br from-teal-500 to-cyan-500'
            } shadow-lg`}>
              <section.icon className="text-xl text-white" />
            </div>
            <h3 className="text-2xl font-bold">{section.title}</h3>
          </div>

          {section.id === 'health-safety' && (
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-bold mb-4">Essential Tips</h4>
                <ul className="space-y-2">
                  {section.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                      <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
                        {tip}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-bold mb-4">Emergency Contacts</h4>
                <div className="space-y-3">
                  {Object.entries(section.emergency).map(([key, value]) => (
                    <div key={key} className={`p-3 rounded-lg ${
                      theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'
                    }`}>
                      <div className="flex justify-between">
                        <span className="capitalize font-medium">
                          {key.replace('_', ' ')}
                        </span>
                        <span className="font-bold text-teal-500">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {section.id === 'transportation' && (
            <div className="grid md:grid-cols-2 gap-8">
              {section.options.map((option, idx) => (
                <div key={idx} className={`p-6 rounded-2xl border ${
                  theme === 'dark'
                    ? 'bg-slate-700/50 border-slate-600'
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <h4 className="text-lg font-bold mb-4">{option.type}</h4>
                  <div className="space-y-3">
                    <div>
                      <strong className="text-green-600">Pros:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {option.pros.map((pro, i) => (
                          <li key={i} className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong className="text-red-600">Cons:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {option.cons.map((con, i) => (
                          <li key={i} className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-2 border-t border-gray-200 dark:border-slate-600">
                      <strong>Cost:</strong> <span className="text-teal-500 font-bold">{option.cost}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  </section>
);

// Culture Section Component
const CultureSection = ({ data, theme }) => (
  <section className="max-w-7xl mx-auto px-6">
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-black mb-6">
        <span className={`bg-gradient-to-r ${
          theme === 'dark' 
            ? 'from-teal-400 to-cyan-400' 
            : 'from-teal-600 to-cyan-600'
        } bg-clip-text text-transparent`}>
          {data.title}
        </span>
      </h2>
    </div>

    <div className="space-y-12">
      {data.sections.map((section, index) => (
        <div key={section.id} className={`p-8 rounded-3xl border ${
          theme === 'dark'
            ? 'bg-slate-800/30 border-slate-700'
            : 'bg-white border-gray-200'
        } shadow-xl`}>
          <div className="flex items-center gap-4 mb-8">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-teal-600 to-cyan-600'
                : 'bg-gradient-to-br from-teal-500 to-cyan-500'
            } shadow-lg`}>
              <section.icon className="text-xl text-white" />
            </div>
            <h3 className="text-2xl font-bold">{section.title}</h3>
          </div>

          {section.id === 'cultural-norms' && (
            <div className="grid md:grid-cols-3 gap-8">
              {section.guidelines.map((guideline, idx) => (
                <div key={idx} className={`p-6 rounded-2xl border ${
                  theme === 'dark'
                    ? 'bg-slate-700/50 border-slate-600'
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <h4 className="text-lg font-bold mb-4">{guideline.category}</h4>
                  <div className="space-y-4">
                    <div>
                      <strong className="text-green-600 flex items-center gap-2">
                        <FaCheckCircle /> Do's:
                      </strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        {guideline.dos.map((item, i) => (
                          <li key={i} className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong className="text-red-600 flex items-center gap-2">
                        <FaExclamationTriangle /> Don'ts:
                      </strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        {guideline.donts.map((item, i) => (
                          <li key={i} className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {section.id === 'festivals' && (
            <div className="grid md:grid-cols-3 gap-8">
              {section.events.map((event, idx) => (
                <div key={idx} className={`p-6 rounded-2xl border ${
                  theme === 'dark'
                    ? 'bg-slate-700/50 border-slate-600'
                    : 'bg-gray-50 border-gray-200'
                } hover:shadow-lg transition-all duration-300`}>
                  <div className="flex items-center gap-3 mb-4">
                    <FaStar className="text-2xl text-yellow-500" />
                    <h4 className="text-lg font-bold">{event.name}</h4>
                  </div>
                  <div className="space-y-2">
                    <p><strong>When:</strong> {event.month}</p>
                    <p><strong>Duration:</strong> {event.duration}</p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                      <strong>Significance:</strong> {event.significance}
                    </p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                      <strong>Experience:</strong> {event.experience}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  </section>
);

export default TravelGuide;