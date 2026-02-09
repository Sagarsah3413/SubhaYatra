import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { 
  FaRoute, FaPlus, FaSave, FaInfoCircle, 
  FaCalendarAlt, FaMapMarkerAlt,
  FaHotel, FaUtensils, FaMoneyBillWave, FaDownload,
  FaShare, FaSpinner, FaCheckCircle, FaMountain,
  FaCompass, FaStar, FaGlobeAsia
} from 'react-icons/fa';

// Enhanced Nepal destinations data with more comprehensive information
const nepalDestinations = {
  kathmandu: {
    name: 'Kathmandu',
    days: 3,
    attractions: [
      'Kathmandu Durbar Square', 'Swayambhunath Temple (Monkey Temple)', 
      'Boudhanath Stupa', 'Pashupatinath Temple', 'Thamel District',
      'Garden of Dreams', 'Patan Durbar Square', 'Bhaktapur Durbar Square'
    ],
    activities: [
      'Heritage site exploration', 'Cultural tours', 'Traditional shopping', 
      'Local food tours', 'Photography walks', 'Rickshaw rides',
      'Pottery workshops', 'Temple ceremonies'
    ],
    accommodation: {
      budget: 'Guesthouse in Thamel',
      mid: 'Heritage Boutique Hotel',
      luxury: '5-Star Heritage Resort'
    },
    dailyCost: { budget: 35, mid: 65, luxury: 120 },
    transportation: 'Walking, taxi, rickshaw',
    highlights: 'UNESCO World Heritage Sites, vibrant culture, ancient architecture'
  },
  pokhara: {
    name: 'Pokhara',
    days: 4,
    attractions: [
      'Phewa Lake', 'Sarangkot Sunrise Point', 'World Peace Pagoda', 
      'Devi\'s Fall', 'Gupteshwor Cave', 'International Mountain Museum',
      'Begnas Lake', 'Mahendra Cave', 'Bindabasini Temple'
    ],
    activities: [
      'Paragliding', 'Boating on Phewa Lake', 'Sunrise viewing', 
      'Cave exploration', 'Mountain biking', 'Zip-lining',
      'Ultralight flights', 'Yoga sessions', 'Lakeside walks'
    ],
    accommodation: {
      budget: 'Lakeside Guesthouse',
      mid: 'Lake View Resort',
      luxury: 'Luxury Mountain Resort'
    },
    dailyCost: { budget: 40, mid: 75, luxury: 140 },
    transportation: 'Walking, boat, taxi',
    highlights: 'Adventure sports, stunning lake views, Himalayan panorama'
  },
  chitwan: {
    name: 'Chitwan National Park',
    days: 3,
    attractions: [
      'Jungle Safari', 'Elephant Breeding Center', 'Tharu Cultural Program', 
      'Rapti River', 'Bis Hazari Tal', 'Crocodile Breeding Center',
      'Tharu Village', 'Sunset Point'
    ],
    activities: [
      'Jeep safari', 'Elephant safari', 'Bird watching', 
      'Cultural shows', 'Canoe rides', 'Nature walks',
      'Village tours', 'Wildlife photography'
    ],
    accommodation: {
      budget: 'Jungle Lodge',
      mid: 'Safari Resort',
      luxury: 'Luxury Jungle Resort'
    },
    dailyCost: { budget: 50, mid: 85, luxury: 160 },
    transportation: 'Jeep, elephant, canoe',
    highlights: 'Wildlife encounters, cultural immersion, pristine nature'
  },
  everest: {
    name: 'Everest Region',
    days: 14,
    attractions: [
      'Everest Base Camp', 'Kala Patthar', 'Namche Bazaar', 
      'Tengboche Monastery', 'Sagarmatha National Park', 'Sherpa Museum',
      'Everest View Hotel', 'Gokyo Lakes', 'Cho La Pass'
    ],
    activities: [
      'High-altitude trekking', 'Mountain photography', 'Cultural immersion', 
      'Monastery visits', 'Acclimatization hikes', 'Sherpa interactions',
      'Sunrise viewing', 'Alpine lake visits'
    ],
    accommodation: {
      budget: 'Tea House Lodge',
      mid: 'Mountain Lodge',
      luxury: 'Premium Mountain Resort'
    },
    dailyCost: { budget: 45, mid: 70, luxury: 120 },
    transportation: 'Trekking, domestic flights',
    highlights: 'World\'s highest peak, Sherpa culture, breathtaking landscapes'
  },
  annapurna: {
    name: 'Annapurna Region',
    days: 12,
    attractions: [
      'Annapurna Base Camp', 'Poon Hill', 'Thorong La Pass', 
      'Muktinath Temple', 'Ghandruk Village', 'Tatopani Hot Springs',
      'Jomsom', 'Kagbeni', 'Marpha Village'
    ],
    activities: [
      'Circuit trekking', 'Sunrise viewing', 'Cultural visits', 
      'Hot spring relaxation', 'Apple brandy tasting', 'Monastery visits',
      'Village homestays', 'Photography expeditions'
    ],
    accommodation: {
      budget: 'Tea House',
      mid: 'Mountain Lodge',
      luxury: 'Premium Trek Lodge'
    },
    dailyCost: { budget: 40, mid: 65, luxury: 110 },
    transportation: 'Trekking, jeep, domestic flights',
    highlights: 'Diverse landscapes, cultural diversity, mountain panoramas'
  },
  lumbini: {
    name: 'Lumbini',
    days: 2,
    attractions: [
      'Maya Devi Temple', 'Ashoka Pillar', 'World Peace Pagoda',
      'Lumbini Museum', 'Sacred Garden', 'Monasteries Zone',
      'Kapilvastu', 'Tilaurakot'
    ],
    activities: [
      'Pilgrimage tours', 'Meditation sessions', 'Cultural exploration',
      'Archaeological site visits', 'Peaceful walks', 'Spiritual ceremonies'
    ],
    accommodation: {
      budget: 'Pilgrim Guesthouse',
      mid: 'Heritage Hotel',
      luxury: 'Luxury Pilgrimage Resort'
    },
    dailyCost: { budget: 30, mid: 55, luxury: 100 },
    transportation: 'Walking, bicycle, rickshaw',
    highlights: 'Birthplace of Buddha, spiritual significance, peaceful atmosphere'
  }
};

// Enhanced itinerary generator with comprehensive planning
const generateItinerary = (formData) => {
  try {
    const { duration, destinations, budget = 'mid' } = formData;
    const selectedDests = destinations.map(id => nepalDestinations[id]).filter(Boolean);
    
    if (selectedDests.length === 0) {
      console.error('No valid destinations selected');
      return null;
    }

    const totalRecommendedDays = selectedDests.reduce((sum, dest) => sum + dest.days, 0);
    let remainingDays = duration;
    const destinationDays = [];

    selectedDests.forEach((dest, index) => {
      if (index === selectedDests.length - 1) {
        destinationDays.push(Math.max(1, remainingDays));
      } else {
        const proportionalDays = Math.max(1, Math.round((dest.days / totalRecommendedDays) * duration));
        const assignedDays = Math.min(proportionalDays, remainingDays - (selectedDests.length - index - 1));
        destinationDays.push(assignedDays);
        remainingDays -= assignedDays;
      }
    });

    let currentDay = 1;
    const dailyPlan = [];

    selectedDests.forEach((dest, destIndex) => {
      const daysInDest = destinationDays[destIndex];
      
      for (let dayInDest = 0; dayInDest < daysInDest && currentDay <= duration; dayInDest++) {
        const dayActivities = [];
        
        if (dayInDest === 0) {
          dayActivities.push({
            time: '10:00 - 12:00',
            activity: `Arrive in ${dest.name} and check-in`,
            type: 'logistics',
            description: `Settle into your ${dest.accommodation[budget]} and get oriented`
          });
          
          dayActivities.push({
            time: '14:00 - 17:00',
            activity: dest.attractions[0] ? `Explore ${dest.attractions[0]}` : 'City orientation walk',
            type: 'sightseeing',
            description: 'Get your first taste of the local culture and atmosphere'
          });
          
          dayActivities.push({
            time: '18:00 - 20:00',
            activity: 'Welcome dinner and local cuisine',
            type: 'dining',
            description: 'Try authentic local dishes and plan upcoming days'
          });
        } else if (dayInDest === daysInDest - 1 && daysInDest > 1) {
          dayActivities.push({
            time: '08:00 - 11:00',
            activity: dest.activities[dayInDest % dest.activities.length] || 'Final exploration',
            type: 'activity',
            description: 'Last chance to experience the highlights'
          });
          
          dayActivities.push({
            time: '11:30 - 13:00',
            activity: 'Check-out and departure preparations',
            type: 'logistics',
            description: 'Pack up and prepare for next destination or departure'
          });
        } else {
          dayActivities.push({
            time: '08:00 - 11:30',
            activity: dest.attractions[dayInDest % dest.attractions.length] || `${dest.name} morning exploration`,
            type: 'sightseeing',
            description: 'Start the day with the most popular attractions'
          });
          
          dayActivities.push({
            time: '13:00 - 17:00',
            activity: dest.activities[dayInDest % dest.activities.length] || 'Cultural activities',
            type: 'activity',
            description: 'Immerse yourself in local experiences and adventures'
          });
          
          dayActivities.push({
            time: '17:30 - 19:00',
            activity: dest.attractions[(dayInDest + 1) % dest.attractions.length] || 'Evening exploration',
            type: 'sightseeing',
            description: 'Discover more attractions in the golden hour'
          });
          
          dayActivities.push({
            time: '19:30 - 21:00',
            activity: 'Dinner and cultural experience',
            type: 'dining',
            description: 'Enjoy local cuisine and evening entertainment'
          });
        }

        const baseCost = dest.dailyCost[budget] || dest.dailyCost.mid;
        const mealCosts = budget === 'budget' ? [6, 10, 12] : 
                         budget === 'luxury' ? [15, 25, 35] : [8, 15, 20];

        dailyPlan.push({
          day: currentDay,
          destination: dest.name,
          title: `Day ${currentDay}: ${dest.name}${dayInDest === 0 ? ' (Arrival)' : dayInDest === daysInDest - 1 && daysInDest > 1 ? ' (Departure)' : ''}`,
          activities: dayActivities,
          accommodation: dest.accommodation[budget],
          meals: [
            { meal: 'Breakfast', cost: mealCosts[0], included: dayInDest > 0 },
            { meal: 'Lunch', cost: mealCosts[1], included: true },
            { meal: 'Dinner', cost: mealCosts[2], included: true }
          ],
          dailyCost: baseCost,
          transportation: dest.transportation,
          highlights: dest.highlights,
          tips: generateDayTips(dest, dayInDest, budget)
        });

        currentDay++;
      }
    });

    const accommodationCost = dailyPlan.reduce((sum, day) => sum + day.dailyCost, 0);
    const mealCost = dailyPlan.reduce((sum, day) => 
      sum + day.meals.reduce((mealSum, meal) => mealSum + (meal.included ? meal.cost : 0), 0), 0
    );
    const transportationCost = Math.round(duration * (budget === 'budget' ? 15 : budget === 'luxury' ? 40 : 25));
    const activitiesCost = Math.round(duration * (budget === 'budget' ? 20 : budget === 'luxury' ? 60 : 35));
    
    const totalCost = accommodationCost + mealCost + transportationCost + activitiesCost;

    const result = {
      title: `${duration}-Day ${selectedDests.map(d => d.name).join(' & ')} Adventure`,
      duration: `${duration} Days`,
      destinations: selectedDests.map(d => d.name),
      budgetLevel: budget,
      dailyPlan,
      costBreakdown: {
        accommodation: accommodationCost,
        meals: mealCost,
        transportation: transportationCost,
        activities: activitiesCost,
        total: totalCost
      },
      totalCost,
      createdAt: new Date().toLocaleDateString(),
      summary: generateItinerarySummary(selectedDests, duration, budget)
    };

    console.log('Generated comprehensive itinerary:', result);
    return result;
  } catch (error) {
    console.error('Error in generateItinerary:', error);
    return null;
  }
};

const generateDayTips = (destination, dayIndex, budget) => {
  const tips = [
    `Best time to visit ${destination.name} attractions is early morning to avoid crowds`,
    `Don't forget to try the local specialties and traditional cuisine`,
    `Carry cash as many local vendors don't accept cards`,
    `Respect local customs and dress modestly when visiting religious sites`,
    `Stay hydrated and use sunscreen, especially at higher altitudes`
  ];
  
  if (budget === 'budget') {
    tips.push('Look for local eateries and guesthouses for authentic experiences at lower costs');
  } else if (budget === 'luxury') {
    tips.push('Consider hiring a private guide for personalized experiences');
  }
  
  return tips[dayIndex % tips.length];
};

const generateItinerarySummary = (destinations, duration, budget) => {
  const destNames = destinations.map(d => d.name).join(', ');
  const budgetDesc = budget === 'budget' ? 'budget-friendly' : 
                    budget === 'luxury' ? 'luxury' : 'mid-range';
  
  return `A ${duration}-day ${budgetDesc} adventure through ${destNames}, featuring cultural immersion, natural beauty, and authentic Nepalese experiences.`;
};

const Itinerary = () => {
  const { theme } = useTheme();
  const { showSuccess } = useToast();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('create');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState(null);
  
  const preselectedDestination = location.state?.preselectedDestination;
  
  const [formData, setFormData] = useState({
    duration: 7,
    destinations: ['kathmandu'],
    activities: [],
    budget: 'mid'
  });

  React.useEffect(() => {
    console.log('Itinerary component mounted');
    console.log('Preselected destination:', preselectedDestination);
    
    if (preselectedDestination) {
      showSuccess(
        "Destination Added",
        `${preselectedDestination.name} has been added to your itinerary planner!`
      );
      
      const matchedDestination = findMatchingDestination(preselectedDestination.name);
      if (matchedDestination) {
        setFormData(prev => ({
          ...prev,
          destinations: [matchedDestination]
        }));
      }
    }
  }, [preselectedDestination, showSuccess]);

  const findMatchingDestination = (destinationName) => {
    const name = destinationName.toLowerCase();
    
    if (name.includes('kathmandu') || name.includes('durbar') || name.includes('swayambhu') || name.includes('boudha')) return 'kathmandu';
    if (name.includes('pokhara') || name.includes('phewa') || name.includes('sarangkot')) return 'pokhara';
    if (name.includes('chitwan') || name.includes('safari') || name.includes('jungle')) return 'chitwan';
    if (name.includes('everest') || name.includes('kala patthar') || name.includes('namche')) return 'everest';
    if (name.includes('annapurna') || name.includes('poon hill') || name.includes('ghandruk')) return 'annapurna';
    if (name.includes('lumbini') || name.includes('buddha') || name.includes('maya devi')) return 'lumbini';
    
    return 'kathmandu';
  };

  const handleInputChange = (field, value) => {
    console.log(`Updating ${field} to:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleDestination = (destId) => {
    console.log(`Toggling destination: ${destId}`);
    setFormData(prev => {
      const newDestinations = prev.destinations.includes(destId)
        ? prev.destinations.filter(id => id !== destId)
        : [...prev.destinations, destId];
      console.log('New destinations:', newDestinations);
      return { ...prev, destinations: newDestinations };
    });
  };

  const handleGenerateItinerary = async () => {
    if (formData.destinations.length === 0) {
      alert('Please select at least one destination');
      return;
    }

    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const itinerary = generateItinerary(formData);
      
      if (itinerary) {
        setGeneratedItinerary(itinerary);
        setActiveTab('generated');
      } else {
        alert('Failed to generate itinerary. Please try again.');
      }
    } catch (error) {
      console.error('Error generating itinerary:', error);
      alert('An error occurred while generating your itinerary. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Professional Hero Section with Animations */}
      <section className="relative py-24 overflow-hidden">
        {/* Animated Background */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #0f766e 0%, #0891b2 50%, #1e40af 100%)',
            animation: 'gradientShift 15s ease infinite',
            backgroundSize: '200% 200%'
          }}
        />
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${10 + Math.random() * 10}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: 0.1
              }}
            >
              {i % 4 === 0 ? <FaMountain className="text-white text-4xl" /> :
               i % 4 === 1 ? <FaCompass className="text-white text-3xl" /> :
               i % 4 === 2 ? <FaGlobeAsia className="text-white text-3xl" /> :
               <FaStar className="text-white text-2xl" />}
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white">
          <div 
            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-8 py-4 mb-8 shadow-2xl"
            style={{
              animation: 'slideDown 0.8s ease-out'
            }}
          >
            <FaRoute className="text-teal-300 text-xl" />
            <span className="font-bold text-lg">Itinerary Generator</span>
          </div>
          
          <h1 
            className="text-6xl md:text-7xl font-black mb-6 leading-tight"
            style={{
              animation: 'fadeInUp 1s ease-out',
              textShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
          >
            Plan Your Perfect
            <br />
            <span className="bg-gradient-to-r from-teal-200 via-cyan-200 to-blue-200 bg-clip-text text-transparent">
              Nepal Adventure
            </span>
          </h1>
          
          <p 
            className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed"
            style={{
              animation: 'fadeInUp 1.2s ease-out',
              textShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
          >
            Generate detailed, day-by-day travel plans with real costs, activities, and insider tips
          </p>
          
          <div 
            className="flex flex-wrap justify-center gap-6"
            style={{
              animation: 'fadeInUp 1.4s ease-out'
            }}
          >
            {[
              { icon: FaMapMarkerAlt, text: '6 Destinations' },
              { icon: FaMountain, text: 'Trek Planning' },
              { icon: FaMoneyBillWave, text: 'Budget Tracking' },
              { icon: FaRoute, text: 'Day-by-Day Plans' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                <item.icon className="text-teal-300" />
                <span className="font-semibold">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Static Navigation Tabs - New Style */}
      <section className={`${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'} py-8`}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-6">
            {[
              { id: 'create', label: 'Create Plan', icon: FaPlus, color: 'from-teal-500 to-cyan-500' },
              { id: 'generated', label: 'Your Itinerary', icon: FaRoute, show: generatedItinerary, color: 'from-purple-500 to-pink-500' },
              { id: 'tips', label: 'Travel Tips', icon: FaInfoCircle, color: 'from-orange-500 to-red-500' }
            ].filter(tab => tab.show !== false).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative p-8 rounded-3xl font-bold text-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? `bg-gradient-to-br ${tab.color} text-white shadow-2xl`
                    : theme === 'dark'
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-white text-gray-600 hover:bg-gray-100 shadow-lg'
                }`}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    activeTab === tab.id
                      ? 'bg-white/20'
                      : `bg-gradient-to-br ${tab.color}`
                  }`}>
                    <tab.icon className={`text-3xl ${activeTab === tab.id ? 'text-white' : 'text-white'}`} />
                  </div>
                  <span className="text-center">{tab.label}</span>
                  {tab.id === 'generated' && generatedItinerary && (
                    <span className="absolute top-4 right-4 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg border-2 border-white"></span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="pb-20">
        <div className="max-w-7xl mx-auto px-6 py-16">
          
          {/* Create Itinerary Tab */}
          {activeTab === 'create' && (
            <div className="space-y-12">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Create Your Nepal Itinerary
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Build a personalized travel plan with detailed activities, costs, and recommendations
                </p>
              </div>

              {/* Preselected Destination Info */}
              {preselectedDestination && (
                <div 
                  className={`p-8 rounded-3xl mb-12 border-2 border-dashed shadow-2xl ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/40' 
                      : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300/60'
                  }`}
                  style={{
                    animation: 'slideDown 0.6s ease-out'
                  }}
                >
                  <div className="flex items-center gap-5 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                      <FaCheckCircle className="text-white text-2xl" />
                    </div>
                    <div>
                      <h3 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Destination Added to Your Plan
                      </h3>
                      <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        We've pre-selected this destination based on your interest
                      </p>
                    </div>
                  </div>
                  
                  <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/80'} backdrop-blur-sm shadow-lg`}>
                    <div className="flex items-start gap-4">
                      <FaMapMarkerAlt className="text-purple-500 text-2xl mt-1" />
                      <div className="flex-1">
                        <h4 className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
                          {preselectedDestination.name}
                        </h4>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                          {preselectedDestination.location}
                        </p>
                        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          {preselectedDestination.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`mt-6 p-5 rounded-xl ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'} border ${theme === 'dark' ? 'border-blue-700/30' : 'border-blue-200'}`}>
                    <div className="flex items-center justify-between">
                      <p className={`text-sm ${theme === 'dark' ? 'text-blue-200' : 'text-blue-800'}`}>
                        💡 <strong>Tip:</strong> Select additional destinations below or adjust trip duration for a comprehensive Nepal itinerary.
                      </p>
                      <button
                        onClick={() => {
                          const matchedDest = findMatchingDestination(preselectedDestination.name);
                          setFormData(prev => ({
                            ...prev,
                            destinations: [matchedDest],
                            duration: nepalDestinations[matchedDest]?.days || 7
                          }));
                          handleGenerateItinerary();
                        }}
                        className="ml-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Quick Plan
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Duration Selection Card */}
                <div 
                  className={`p-10 rounded-3xl ${theme === 'dark' ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-white to-gray-50'} shadow-2xl border ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'} hover:shadow-3xl transition-all duration-300 transform hover:scale-105`}
                  style={{
                    animation: 'fadeInUp 0.6s ease-out'
                  }}
                >
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl">
                      <FaCalendarAlt className="text-3xl text-white" />
                    </div>
                    <h3 className="text-2xl font-black mb-2">Trip Duration</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">How long will you explore?</p>
                  </div>
                  <select 
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                    className={`w-full p-4 rounded-xl border-2 font-semibold text-lg ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'} focus:ring-4 focus:ring-teal-500/30 transition-all`}
                  >
                    <option value={3}>3 Days - Quick Escape</option>
                    <option value={5}>5 Days - Short Adventure</option>
                    <option value={7}>7 Days - One Week</option>
                    <option value={10}>10 Days - Extended Tour</option>
                    <option value={14}>14 Days - Full Experience</option>
                  </select>
                </div>

                {/* Destination Selection Card */}
                <div 
                  className={`p-10 rounded-3xl ${theme === 'dark' ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-white to-gray-50'} shadow-2xl border ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'} hover:shadow-3xl transition-all duration-300 transform hover:scale-105`}
                  style={{
                    animation: 'fadeInUp 0.8s ease-out'
                  }}
                >
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl">
                      <FaMapMarkerAlt className="text-3xl text-white" />
                    </div>
                    <h3 className="text-2xl font-black mb-2">Destinations</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Select places to visit</p>
                  </div>
                  <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
                    {Object.entries(nepalDestinations).map(([id, dest]) => (
                      <label 
                        key={id} 
                        className={`flex items-center space-x-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                          formData.destinations.includes(id)
                            ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border-2 border-teal-500 shadow-lg'
                            : theme === 'dark'
                              ? 'bg-slate-700/50 hover:bg-slate-700 border-2 border-transparent'
                              : 'bg-gray-100 hover:bg-gray-200 border-2 border-transparent'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          checked={formData.destinations.includes(id)}
                          onChange={() => toggleDestination(id)}
                          className="w-5 h-5 text-teal-600 rounded-lg focus:ring-2 focus:ring-teal-500" 
                        />
                        <div className="flex-1">
                          <span className="font-bold text-lg">{dest.name}</span>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{dest.days} days recommended</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Budget Selection Card */}
                <div 
                  className={`p-10 rounded-3xl ${theme === 'dark' ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-white to-gray-50'} shadow-2xl border ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'} hover:shadow-3xl transition-all duration-300 transform hover:scale-105`}
                  style={{
                    animation: 'fadeInUp 1s ease-out'
                  }}
                >
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl">
                      <FaMoneyBillWave className="text-3xl text-white" />
                    </div>
                    <h3 className="text-2xl font-black mb-2">Budget Level</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Choose your comfort level</p>
                  </div>
                  <select 
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    className={`w-full p-4 rounded-xl border-2 font-semibold text-base ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'} focus:ring-4 focus:ring-orange-500/30 transition-all`}
                  >
                    <option value="budget">💰 Budget ($30-60/day)</option>
                    <option value="mid">🏨 Mid-range ($70-120/day)</option>
                    <option value="luxury">✨ Luxury ($130-250/day)</option>
                  </select>
                  <div className={`mt-6 p-4 rounded-xl ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {formData.budget === 'budget' && '🎒 Guesthouses, local transport, street food'}
                      {formData.budget === 'mid' && '🏨 Hotels, private transport, restaurant meals'}
                      {formData.budget === 'luxury' && '✨ Resorts, private guides, premium experiences'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <div className="text-center mt-16">
                <button 
                  onClick={handleGenerateItinerary}
                  disabled={isGenerating || formData.destinations.length === 0}
                  className={`px-16 py-6 rounded-3xl font-black text-xl transition-all duration-500 flex items-center gap-4 mx-auto shadow-2xl ${
                    isGenerating || formData.destinations.length === 0
                      ? 'bg-gray-400 cursor-not-allowed opacity-60'
                      : 'bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 hover:from-teal-700 hover:via-cyan-700 hover:to-blue-700 text-white transform hover:scale-110 hover:shadow-3xl'
                  }`}
                  style={{
                    animation: isGenerating ? 'pulse 2s ease-in-out infinite' : 'none'
                  }}
                >
                  {isGenerating ? (
                    <>
                      <FaSpinner className="animate-spin text-2xl" />
                      Generating Your Perfect Itinerary...
                    </>
                  ) : (
                    <>
                      <FaRoute className="text-2xl" />
                      Generate My Itinerary
                    </>
                  )}
                </button>
                
                {formData.destinations.length === 0 && (
                  <p className="text-red-500 font-semibold text-base mt-4 animate-pulse">
                    ⚠️ Please select at least one destination
                  </p>
                )}
                
                <div className={`mt-8 p-6 rounded-2xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-100'} max-w-2xl mx-auto`}>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Current Selection:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="px-4 py-2 bg-teal-500/20 text-teal-600 dark:text-teal-400 rounded-full text-sm font-bold">
                      {formData.duration} Days
                    </span>
                    <span className="px-4 py-2 bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-full text-sm font-bold">
                      {formData.destinations.length} Destination{formData.destinations.length !== 1 ? 's' : ''}
                    </span>
                    <span className="px-4 py-2 bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-full text-sm font-bold">
                      {formData.budget.charAt(0).toUpperCase() + formData.budget.slice(1)} Budget
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Generated Itinerary Tab */}
          {activeTab === 'generated' && (
            <div className="space-y-12">
              {generatedItinerary ? (
                <>
                  {/* Header */}
                  <div className="text-center mb-16">
                    <div className="inline-block mb-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                        <FaCheckCircle className="text-4xl text-white" />
                      </div>
                    </div>
                    <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                      {generatedItinerary.title}
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-4 max-w-4xl mx-auto leading-relaxed">
                      {generatedItinerary.summary}
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                      <span className="px-5 py-2 bg-teal-500/20 text-teal-600 dark:text-teal-400 rounded-full text-sm font-bold">
                        📅 {generatedItinerary.createdAt}
                      </span>
                      <span className="px-5 py-2 bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-full text-sm font-bold">
                        💎 {generatedItinerary.budgetLevel.charAt(0).toUpperCase() + generatedItinerary.budgetLevel.slice(1)}
                      </span>
                      <span className="px-5 py-2 bg-green-500/20 text-green-600 dark:text-green-400 rounded-full text-sm font-bold">
                        💰 ${generatedItinerary.totalCost} Total
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-4">
                      <button className="px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-2xl font-bold flex items-center gap-3 hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
                        <FaSave className="text-lg" />
                        Save Itinerary
                      </button>
                      <button className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-2xl font-bold flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                        <FaDownload className="text-lg" />
                        Download PDF
                      </button>
                      <button className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-2xl font-bold flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                        <FaShare className="text-lg" />
                        Share
                      </button>
                    </div>
                  </div>

                  {/* Daily Itinerary */}
                  <div className="space-y-8">
                    <h3 className="text-4xl font-black mb-10 text-center">Daily Itinerary</h3>
                    
                    {generatedItinerary.dailyPlan.map((day, index) => (
                      <div 
                        key={day.day} 
                        className={`p-10 rounded-3xl ${theme === 'dark' ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-white to-gray-50'} shadow-2xl border ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'} hover:shadow-3xl transition-all duration-300`}
                        style={{
                          animation: `fadeInUp ${0.3 + index * 0.1}s ease-out`
                        }}
                      >
                        {/* Day Header */}
                        <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl">
                              {day.day}
                            </div>
                            <div>
                              <h4 className="text-2xl font-black mb-1">{day.title}</h4>
                              <p className="text-gray-600 dark:text-gray-400 font-semibold">
                                💰 Daily Cost: ${day.dailyCost + day.meals.reduce((sum, meal) => sum + (meal.included ? meal.cost : 0), 0)}
                              </p>
                              {day.highlights && (
                                <p className="text-sm text-blue-600 dark:text-blue-400 mt-2 font-semibold">
                                  🌟 {day.highlights}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Activities */}
                        <div className="space-y-5 mb-8">
                          {day.activities.map((activity, actIndex) => (
                            <div 
                              key={actIndex} 
                              className={`flex items-start gap-5 p-6 rounded-2xl ${
                                theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-100'
                              } hover:shadow-lg transition-all duration-300`}
                            >
                              <div className="w-28 text-sm font-bold text-gray-600 dark:text-gray-400 flex-shrink-0 bg-white dark:bg-slate-800 px-3 py-2 rounded-lg">
                                {activity.time}
                              </div>
                              <div className="flex-1">
                                <h5 className="font-black text-lg text-gray-900 dark:text-white mb-2">{activity.activity}</h5>
                                {activity.description && (
                                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{activity.description}</p>
                                )}
                                <span className={`inline-block px-4 py-2 rounded-xl text-xs font-bold ${
                                  activity.type === 'sightseeing' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                  activity.type === 'activity' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                  activity.type === 'logistics' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                                  activity.type === 'dining' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                                  'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                }`}>
                                  {activity.type.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Tips */}
                        {day.tips && (
                          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-l-4 border-blue-500 shadow-lg">
                            <h5 className="font-black text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-3 text-lg">
                              <FaInfoCircle className="text-xl" />
                              Daily Tip
                            </h5>
                            <p className="text-blue-800 dark:text-blue-200 font-medium">{day.tips}</p>
                          </div>
                        )}

                        {/* Accommodation, Meals & Transportation */}
                        <div className="grid md:grid-cols-3 gap-6">
                          <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                            <h5 className="font-black mb-4 flex items-center gap-3 text-lg">
                              <FaHotel className="text-blue-500 text-xl" />
                              Accommodation
                            </h5>
                            <p className="text-gray-700 dark:text-gray-300 font-semibold mb-2">{day.accommodation}</p>
                            <p className="text-sm text-gray-500 font-bold">${day.dailyCost}/night</p>
                          </div>
                          
                          <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                            <h5 className="font-black mb-4 flex items-center gap-3 text-lg">
                              <FaUtensils className="text-orange-500 text-xl" />
                              Meals
                            </h5>
                            <div className="space-y-2">
                              {day.meals.map((meal, mealIndex) => (
                                <div key={mealIndex} className="flex justify-between text-sm font-semibold">
                                  <span className={meal.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 line-through'}>
                                    {meal.meal}
                                  </span>
                                  <span className={meal.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 line-through'}>
                                    ${meal.cost}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {day.transportation && (
                            <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                              <h5 className="font-black mb-4 flex items-center gap-3 text-lg">
                                <FaRoute className="text-green-500 text-xl" />
                                Transportation
                              </h5>
                              <p className="text-gray-700 dark:text-gray-300 font-semibold">{day.transportation}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cost Summary */}
                  <div className={`p-10 rounded-3xl ${theme === 'dark' ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-white to-gray-50'} shadow-2xl border ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                    <h3 className="text-3xl font-black mb-8 flex items-center gap-3">
                      <FaMoneyBillWave className="text-green-500 text-4xl" />
                      Cost Breakdown
                    </h3>
                    
                    {generatedItinerary.costBreakdown && (
                      <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-5">
                          <div className={`flex justify-between p-5 rounded-2xl ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                            <span className="text-gray-600 dark:text-gray-400 font-bold text-lg">🏨 Accommodation</span>
                            <span className="font-black text-xl">${generatedItinerary.costBreakdown.accommodation}</span>
                          </div>
                          <div className={`flex justify-between p-5 rounded-2xl ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                            <span className="text-gray-600 dark:text-gray-400 font-bold text-lg">🍽️ Meals</span>
                            <span className="font-black text-xl">${generatedItinerary.costBreakdown.meals}</span>
                          </div>
                        </div>
                        <div className="space-y-5">
                          <div className={`flex justify-between p-5 rounded-2xl ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                            <span className="text-gray-600 dark:text-gray-400 font-bold text-lg">🚗 Transportation</span>
                            <span className="font-black text-xl">${generatedItinerary.costBreakdown.transportation}</span>
                          </div>
                          <div className={`flex justify-between p-5 rounded-2xl ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                            <span className="text-gray-600 dark:text-gray-400 font-bold text-lg">🎯 Activities & Tours</span>
                            <span className="font-black text-xl">${generatedItinerary.costBreakdown.activities}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="border-t-2 border-gray-200 dark:border-gray-600 pt-8">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-3xl font-black">Total Trip Cost</span>
                        <span className="text-4xl font-black bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                          ${generatedItinerary.totalCost}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 font-semibold text-lg">
                        Complete {generatedItinerary.budgetLevel} package for {generatedItinerary.duration.toLowerCase()} • 
                        Average ${Math.round(generatedItinerary.totalCost / parseInt(generatedItinerary.duration))}/day per person
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-20">
                  <div className="w-32 h-32 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                    <FaRoute className="text-5xl text-white" />
                  </div>
                  <h3 className="text-4xl font-black mb-6">No Itinerary Generated Yet</h3>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
                    Create your first itinerary using the form in the "Create Plan" tab and start planning your dream Nepal adventure.
                  </p>
                  <button 
                    onClick={() => setActiveTab('create')}
                    className="px-12 py-5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-2xl font-black text-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                  >
                    Create Itinerary Now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Travel Tips Tab */}
          {activeTab === 'tips' && (
            <div className="space-y-12">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Nepal Travel Tips
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Essential advice and insider knowledge for your Nepal adventure
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {[
                  { icon: '🗓️', title: 'Best Time to Visit', desc: 'October to December and March to May offer the best weather conditions for most activities.' },
                  { icon: '🏔️', title: 'Altitude Considerations', desc: 'Plan acclimatization days for high-altitude destinations to avoid altitude sickness.' },
                  { icon: '🎒', title: 'Packing Essentials', desc: 'Bring layers, comfortable hiking boots, sunscreen, and a good camera for stunning landscapes.' },
                  { icon: '💰', title: 'Budget Planning', desc: 'Budget $30-150 per day depending on accommodation level and activities chosen.' },
                  { icon: '🍜', title: 'Local Cuisine', desc: 'Try Dal Bhat, Momos, and Thukpa. Most restaurants cater to international tastes too.' },
                  { icon: '📱', title: 'Connectivity', desc: 'Get a local SIM card for data. WiFi is available in most tourist areas.' },
                  { icon: '🏥', title: 'Health & Safety', desc: 'Carry basic medicines, drink bottled water, and have travel insurance.' },
                  { icon: '🙏', title: 'Cultural Respect', desc: 'Dress modestly at temples, remove shoes before entering, and ask before photographing people.' }
                ].map((tip, index) => (
                  <div 
                    key={index}
                    className={`p-8 rounded-3xl ${theme === 'dark' ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-white to-gray-50'} shadow-2xl border ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'} hover:shadow-3xl transition-all duration-300 transform hover:scale-105`}
                    style={{
                      animation: `fadeInUp ${0.3 + index * 0.1}s ease-out`
                    }}
                  >
                    <div className="text-5xl mb-5">{tip.icon}</div>
                    <h3 className="text-2xl font-black mb-4">{tip.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">{tip.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Itinerary;
