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
  FaCalendarAlt,
  FaClock,
  FaRoute,
  FaCompass,
  FaHeart,
  FaStar,
  FaUsers,
  FaLeaf,
  FaMountain,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaDownload,
  FaShare,
  FaEye,
  FaCheckCircle,
  FaMapPin,
  FaWalking,
  FaCar,
  FaBus,
  FaMotorcycle
} from 'react-icons/fa';

const Itinerary = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('create');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentItinerary, setCurrentItinerary] = useState(null);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Sample itinerary templates
  const itineraryTemplates = [
    {
      id: 'everest-trek',
      title: 'Everest Base Camp Trek',
      duration: '14 Days',
      difficulty: 'Challenging',
      type: 'Adventure',
      image: '🏔️',
      description: 'Classic trek to the base of the world\'s highest mountain',
      highlights: ['Everest Base Camp', 'Kala Patthar', 'Namche Bazaar', 'Tengboche Monastery'],
      days: [
        { day: 1, title: 'Fly to Lukla, Trek to Phakding', activities: ['Flight', 'Trekking'], duration: '3-4 hours', accommodation: 'Tea House' },
        { day: 2, title: 'Trek to Namche Bazaar', activities: ['Trekking', 'Acclimatization'], duration: '6-8 hours', accommodation: 'Tea House' },
        { day: 3, title: 'Acclimatization Day in Namche', activities: ['Rest', 'Exploration', 'Shopping'], duration: 'Full day', accommodation: 'Tea House' }
      ]
    },
    {
      id: 'annapurna-circuit',
      title: 'Annapurna Circuit Trek',
      duration: '12 Days',
      difficulty: 'Moderate',
      type: 'Adventure',
      image: '🌄',
      description: 'Diverse landscapes from subtropical to alpine zones',
      highlights: ['Thorong La Pass', 'Muktinath Temple', 'Poon Hill', 'Hot Springs'],
      days: [
        { day: 1, title: 'Drive to Besisahar, Trek to Bhulbhule', activities: ['Drive', 'Trekking'], duration: '4-5 hours', accommodation: 'Tea House' },
        { day: 2, title: 'Trek to Jagat', activities: ['Trekking', 'Village visits'], duration: '6-7 hours', accommodation: 'Tea House' }
      ]
    },
    {
      id: 'kathmandu-cultural',
      title: 'Kathmandu Cultural Tour',
      duration: '5 Days',
      difficulty: 'Easy',
      type: 'Cultural',
      image: '🏛️',
      description: 'Explore the cultural heart of Nepal with ancient temples and palaces',
      highlights: ['Durbar Squares', 'Swayambhunath', 'Boudhanath', 'Pashupatinath'],
      days: [
        { day: 1, title: 'Arrival and Kathmandu Durbar Square', activities: ['Sightseeing', 'Photography'], duration: 'Half day', accommodation: 'Hotel' },
        { day: 2, title: 'Swayambhunath and Patan', activities: ['Temple visits', 'Cultural exploration'], duration: 'Full day', accommodation: 'Hotel' }
      ]
    },
    {
      id: 'pokhara-adventure',
      title: 'Pokhara Adventure Package',
      duration: '7 Days',
      difficulty: 'Moderate',
      type: 'Adventure',
      image: '🪂',
      description: 'Adventure capital with lakes, mountains, and extreme sports',
      highlights: ['Paragliding', 'Bungee Jump', 'Phewa Lake', 'Sarangkot Sunrise'],
      days: [
        { day: 1, title: 'Arrival and Phewa Lake', activities: ['Boating', 'Relaxation'], duration: 'Half day', accommodation: 'Resort' },
        { day: 2, title: 'Paragliding and Adventure Sports', activities: ['Paragliding', 'Zip-lining'], duration: 'Full day', accommodation: 'Resort' }
      ]
    }
  ];

  // Sample saved itineraries
  const savedItineraries = [
    {
      id: 'my-nepal-trip',
      title: 'My Nepal Adventure 2024',
      duration: '10 Days',
      status: 'In Progress',
      lastModified: '2 days ago',
      destinations: ['Kathmandu', 'Pokhara', 'Chitwan'],
      progress: 75
    },
    {
      id: 'family-trip',
      title: 'Family Trip to Nepal',
      duration: '8 Days',
      status: 'Completed',
      lastModified: '1 week ago',
      destinations: ['Kathmandu', 'Nagarkot', 'Bhaktapur'],
      progress: 100
    }
  ];

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Loading Itinerary Planner...
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
              ? 'bg-gradient-to-br from-slate-900 via-teal-900 to-cyan-900' 
              : 'bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900'
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
              <FaRoute className="text-teal-400" />
              <span className="font-semibold">Smart Trip Planning</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-emerald-300 bg-clip-text text-transparent">
                Nepal Itinerary
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                Planner
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-cyan-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Create, customize, and manage your perfect Nepal adventure with our intelligent itinerary planner
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => setActiveTab('create')}
                className="group relative px-8 py-4 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 hover:from-teal-700 hover:via-cyan-700 hover:to-blue-700 text-white rounded-2xl font-bold text-base transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl flex items-center gap-3 overflow-hidden"
              >
                <FaPlus className="text-lg" />
                <span>Create New Itinerary</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('templates')}
                className="group relative px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-semibold text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3 border border-white/20 hover:border-white/40 backdrop-blur-sm"
              >
                <FaCompass className="text-lg" />
                <span>Browse Templates</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className={`sticky top-20 z-40 ${theme === 'dark' ? 'bg-slate-900/95' : 'bg-white/95'} backdrop-blur-xl border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center overflow-x-auto py-4 space-x-1 min-h-[80px] items-center">
            {[
              { id: 'create', label: 'Create New', icon: FaPlus },
              { id: 'templates', label: 'Templates', icon: FaCompass },
              { id: 'saved', label: 'My Itineraries', icon: FaSave },
              { id: 'tips', label: 'Planning Tips', icon: FaRoute }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-colors duration-300 ${
                  activeTab === tab.id
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

      {/* Content Sections */}
      <main className="pb-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {activeTab === 'create' && <CreateItinerarySection theme={theme} />}
          {activeTab === 'templates' && <TemplatesSection templates={itineraryTemplates} theme={theme} />}
          {activeTab === 'saved' && <SavedItinerariesSection itineraries={savedItineraries} theme={theme} />}
          {activeTab === 'tips' && <PlanningTipsSection theme={theme} />}
        </div>
      </main>
    </div>
  );
};

// Create Itinerary Section
const CreateItinerarySection = ({ theme }) => (
  <div className="space-y-8">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-black mb-4">
        <span className={`bg-gradient-to-r ${
          theme === 'dark' ? 'from-teal-400 to-cyan-400' : 'from-teal-600 to-cyan-600'
        } bg-clip-text text-transparent`}>
          Create Your Perfect Itinerary
        </span>
      </h2>
      <p className={`text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
        Build a customized travel plan step by step
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Step 1: Basic Info */}
      <div className={`p-8 rounded-3xl border ${
        theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
      } shadow-lg hover:shadow-xl transition-all duration-300`}>
        <div className="text-center mb-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
            theme === 'dark' ? 'bg-gradient-to-br from-teal-600 to-cyan-600' : 'bg-gradient-to-br from-teal-500 to-cyan-500'
          } shadow-xl`}>
            <FaCalendarAlt className="text-2xl text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">Step 1: Basic Information</h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
            Set your trip duration and preferences
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Trip Duration</label>
            <select className={`w-full p-3 rounded-lg border ${
              theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-teal-500 focus:border-transparent`}>
              <option>3-5 Days</option>
              <option>1 Week</option>
              <option>2 Weeks</option>
              <option>3+ Weeks</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Travel Style</label>
            <select className={`w-full p-3 rounded-lg border ${
              theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-teal-500 focus:border-transparent`}>
              <option>Adventure</option>
              <option>Cultural</option>
              <option>Relaxation</option>
              <option>Mixed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Step 2: Destinations */}
      <div className={`p-8 rounded-3xl border ${
        theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
      } shadow-lg hover:shadow-xl transition-all duration-300`}>
        <div className="text-center mb-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
            theme === 'dark' ? 'bg-gradient-to-br from-purple-600 to-pink-600' : 'bg-gradient-to-br from-purple-500 to-pink-500'
          } shadow-xl`}>
            <FaMapMarkerAlt className="text-2xl text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">Step 2: Choose Destinations</h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
            Select places you want to visit
          </p>
        </div>
        
        <div className="space-y-3">
          {['Kathmandu', 'Pokhara', 'Chitwan', 'Everest Region', 'Annapurna Region'].map((destination) => (
            <label key={destination} className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
              <span className="text-sm font-medium">{destination}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Step 3: Activities */}
      <div className={`p-8 rounded-3xl border ${
        theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
      } shadow-lg hover:shadow-xl transition-all duration-300`}>
        <div className="text-center mb-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
            theme === 'dark' ? 'bg-gradient-to-br from-orange-600 to-red-600' : 'bg-gradient-to-br from-orange-500 to-red-500'
          } shadow-xl`}>
            <FaCamera className="text-2xl text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">Step 3: Select Activities</h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
            Pick your preferred activities
          </p>
        </div>
        
        <div className="space-y-3">
          {['Trekking', 'Cultural Tours', 'Wildlife Safari', 'Adventure Sports', 'Photography'].map((activity) => (
            <label key={activity} className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
              <span className="text-sm font-medium">{activity}</span>
            </label>
          ))}
        </div>
      </div>
    </div>

    {/* Generate Button */}
    <div className="text-center mt-12">
      <button className={`px-12 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white'
          : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white'
      }`}>
        Generate My Itinerary
      </button>
    </div>
  </div>
);

// Templates Section
const TemplatesSection = ({ templates, theme }) => (
  <div className="space-y-8">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-black mb-4">
        <span className={`bg-gradient-to-r ${
          theme === 'dark' ? 'from-teal-400 to-cyan-400' : 'from-teal-600 to-cyan-600'
        } bg-clip-text text-transparent`}>
          Ready-Made Itineraries
        </span>
      </h2>
      <p className={`text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
        Choose from our expertly crafted travel plans
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-8">
      {templates.map((template) => (
        <div key={template.id} className={`p-8 rounded-3xl border ${
          theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
        } shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1`}>
          
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{template.image}</div>
              <div>
                <h3 className="text-xl font-bold mb-1">{template.title}</h3>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <FaClock className="text-teal-500" />
                    {template.duration}
                  </span>
                  <span className={`px-2 py-1 rounded-lg text-xs ${
                    template.difficulty === 'Easy' 
                      ? 'bg-green-100 text-green-800' 
                      : template.difficulty === 'Moderate'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {template.difficulty}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className={`mb-6 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
            {template.description}
          </p>

          <div className="mb-6">
            <h4 className="font-semibold mb-3">Highlights:</h4>
            <div className="flex flex-wrap gap-2">
              {template.highlights.map((highlight, idx) => (
                <span key={idx} className={`px-3 py-1 rounded-lg text-sm ${
                  theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-700'
                }`}>
                  {highlight}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white'
                : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white'
            } shadow-lg hover:shadow-xl transform hover:scale-105`}>
              Use This Template
            </button>
            <button className={`px-4 py-3 rounded-xl border transition-all duration-300 ${
              theme === 'dark'
                ? 'border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white'
                : 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-900'
            }`}>
              <FaEye />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Saved Itineraries Section
const SavedItinerariesSection = ({ itineraries, theme }) => (
  <div className="space-y-8">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-black mb-4">
        <span className={`bg-gradient-to-r ${
          theme === 'dark' ? 'from-teal-400 to-cyan-400' : 'from-teal-600 to-cyan-600'
        } bg-clip-text text-transparent`}>
          My Itineraries
        </span>
      </h2>
      <p className={`text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
        Manage your saved travel plans
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-8">
      {itineraries.map((itinerary) => (
        <div key={itinerary.id} className={`p-8 rounded-3xl border ${
          theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
        } shadow-lg hover:shadow-xl transition-all duration-300`}>
          
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold mb-2">{itinerary.title}</h3>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <FaClock className="text-teal-500" />
                  {itinerary.duration}
                </span>
                <span className={`px-2 py-1 rounded-lg text-xs ${
                  itinerary.status === 'Completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {itinerary.status}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-teal-500">{itinerary.progress}%</span>
            </div>
            <div className={`w-full bg-gray-200 rounded-full h-2 ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'}`}>
              <div 
                className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${itinerary.progress}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold mb-3">Destinations:</h4>
            <div className="flex flex-wrap gap-2">
              {itinerary.destinations.map((destination, idx) => (
                <span key={idx} className={`px-3 py-1 rounded-lg text-sm ${
                  theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-700'
                }`}>
                  {destination}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white'
                : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white'
            } shadow-lg hover:shadow-xl transform hover:scale-105`}>
              Continue Planning
            </button>
            <button className={`px-4 py-3 rounded-xl border transition-all duration-300 ${
              theme === 'dark'
                ? 'border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white'
                : 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-900'
            }`}>
              <FaShare />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Planning Tips Section
const PlanningTipsSection = ({ theme }) => {
  const tips = [
    {
      icon: FaCalendarAlt,
      title: 'Best Time to Visit',
      description: 'October to December and March to May offer the best weather conditions for most activities.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FaMountain,
      title: 'Altitude Considerations',
      description: 'Plan acclimatization days for high-altitude destinations to avoid altitude sickness.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: FaRoute,
      title: 'Transportation Planning',
      description: 'Book domestic flights early and have backup plans due to weather-dependent schedules.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: FaHotel,
      title: 'Accommodation Booking',
      description: 'Reserve accommodations in advance, especially during peak trekking seasons.',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black mb-4">
          <span className={`bg-gradient-to-r ${
            theme === 'dark' ? 'from-teal-400 to-cyan-400' : 'from-teal-600 to-cyan-600'
          } bg-clip-text text-transparent`}>
            Planning Tips
          </span>
        </h2>
        <p className={`text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
          Expert advice for planning your Nepal adventure
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {tips.map((tip, index) => (
          <div key={index} className={`p-8 rounded-3xl border ${
            theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
          } shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1`}>
            
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${tip.color} shadow-xl`}>
              <tip.icon className="text-2xl text-white" />
            </div>
            
            <h3 className="text-xl font-bold mb-4">{tip.title}</h3>
            <p className={`leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
              {tip.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Itinerary;