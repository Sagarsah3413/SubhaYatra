import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { 
  FaRoute, FaPlus, FaSave, FaInfoCircle, 
  FaCalendarAlt, FaMapMarkerAlt, FaClock,
  FaHotel, FaUtensils, FaMoneyBillWave, FaDownload,
  FaShare, FaSpinner, FaCheckCircle
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

    // Calculate optimal days per destination
    const totalRecommendedDays = selectedDests.reduce((sum, dest) => sum + dest.days, 0);
    let remainingDays = duration;
    const destinationDays = [];

    // Distribute days more intelligently
    selectedDests.forEach((dest, index) => {
      if (index === selectedDests.length - 1) {
        // Last destination gets remaining days
        destinationDays.push(Math.max(1, remainingDays));
      } else {
        // Calculate proportional days, minimum 1 day
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
        
        // Create varied daily schedules
        if (dayInDest === 0) {
          // Arrival day - lighter schedule
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
          // Departure day - morning activities only
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
          // Full day schedule
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

        // Calculate daily costs based on budget
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

    // Calculate comprehensive costs
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

// Helper function to generate day-specific tips
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

// Helper function to generate itinerary summary
const generateItinerarySummary = (destinations, duration, budget) => {
  const destNames = destinations.map(d => d.name).join(', ');
  const budgetDesc = budget === 'budget' ? 'budget-friendly' : 
                    budget === 'luxury' ? 'luxury' : 'mid-range';
  
  return `A ${duration}-day ${budgetDesc} adventure through ${destNames}, featuring cultural immersion, natural beauty, and authentic Nepalese experiences. This itinerary balances must-see attractions with local experiences, ensuring a comprehensive exploration of Nepal's diverse offerings.`;
};

const Itinerary = () => {
  const { theme } = useTheme();
  const { showSuccess } = useToast();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('create');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState(null);
  
  // Get preselected destination from navigation state
  const preselectedDestination = location.state?.preselectedDestination;
  
  // Form state with default selections for easier testing
  const [formData, setFormData] = useState({
    duration: 7,
    destinations: ['kathmandu'], // Default selection for easier testing
    activities: [],
    budget: 'mid'
  });

  // Debug log on component mount and handle preselected destination
  React.useEffect(() => {
    console.log('Itinerary component mounted');
    console.log('Initial form data:', formData);
    console.log('Nepal destinations available:', Object.keys(nepalDestinations));
    console.log('Preselected destination:', preselectedDestination);
    
    // Show notification if destination was preselected
    if (preselectedDestination) {
      showSuccess(
        "Destination Added",
        `${preselectedDestination.name} has been added to your itinerary planner. Customize your trip below!`
      );
      
      // Try to match the destination to existing Nepal destinations
      const matchedDestination = findMatchingDestination(preselectedDestination.name);
      if (matchedDestination) {
        setFormData(prev => ({
          ...prev,
          destinations: [matchedDestination]
        }));
      }
    }
  }, [preselectedDestination, showSuccess]);

  // Function to find matching destination
  const findMatchingDestination = (destinationName) => {
    const name = destinationName.toLowerCase();
    
    // Direct matches
    if (name.includes('kathmandu') || name.includes('durbar') || name.includes('swayambhu') || name.includes('boudha')) return 'kathmandu';
    if (name.includes('pokhara') || name.includes('phewa') || name.includes('sarangkot')) return 'pokhara';
    if (name.includes('chitwan') || name.includes('safari') || name.includes('jungle')) return 'chitwan';
    if (name.includes('everest') || name.includes('kala patthar') || name.includes('namche')) return 'everest';
    if (name.includes('annapurna') || name.includes('poon hill') || name.includes('ghandruk')) return 'annapurna';
    if (name.includes('lumbini') || name.includes('buddha') || name.includes('maya devi')) return 'lumbini';
    
    // Default to kathmandu for other destinations
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
      // Simulate processing time for better UX
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
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <FaRoute className="text-teal-400" />
            <span className="font-semibold">Real Itinerary Generator</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            Nepal Itinerary Planner
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Generate real, detailed travel plans for your Nepal adventure with day-by-day activities and costs
          </p>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className={`sticky top-20 z-40 ${theme === 'dark' ? 'bg-slate-900/95' : 'bg-white/95'} backdrop-blur-xl border-b`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center py-4 space-x-4">
            {[
              { id: 'create', label: 'Create Plan', icon: FaPlus },
              { id: 'generated', label: 'Your Itinerary', icon: FaRoute, show: generatedItinerary },
              { id: 'tips', label: 'Travel Tips', icon: FaInfoCircle }
            ].filter(tab => tab.show !== false).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg'
                    : theme === 'dark'
                      ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon />
                <span>{tab.label}</span>
                {tab.id === 'generated' && generatedItinerary && (
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="pb-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          
          {/* Create Itinerary Tab */}
          {activeTab === 'create' && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Create Your Nepal Itinerary</h2>
                <p className="text-lg text-gray-600">Build a real travel plan with detailed activities and costs</p>
              </div>

              {/* Preselected Destination Info */}
              {preselectedDestination && (
                <div className={`p-6 rounded-2xl mb-8 border-2 border-dashed ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30' 
                    : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300/50'
                }`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                      <FaCheckCircle className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Destination Added to Your Plan
                      </h3>
                      <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        We've pre-selected this destination based on your interest
                      </p>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/70'}`}>
                    <div className="flex items-start gap-3">
                      <FaMapMarkerAlt className="text-purple-500 mt-1" />
                      <div>
                        <h4 className={`font-semibold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {preselectedDestination.name}
                        </h4>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                          {preselectedDestination.location}
                        </p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          {preselectedDestination.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`mt-4 p-3 rounded-lg ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                    <div className="flex items-center justify-between">
                      <p className={`text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                        💡 <strong>Tip:</strong> Select additional destinations below to create a comprehensive Nepal itinerary, 
                        or adjust the trip duration to focus more time on this area.
                      </p>
                      <button
                        onClick={() => {
                          // Quick generate itinerary for this destination
                          const matchedDest = findMatchingDestination(preselectedDestination.name);
                          setFormData(prev => ({
                            ...prev,
                            destinations: [matchedDest],
                            duration: nepalDestinations[matchedDest]?.days || 7
                          }));
                          handleGenerateItinerary();
                        }}
                        className="ml-4 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                      >
                        Quick Plan
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-8">
                {/* Duration Selection */}
                <div className={`p-8 rounded-3xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FaCalendarAlt className="text-2xl text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Trip Duration</h3>
                  </div>
                  <select 
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                    className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}`}
                  >
                    <option value={3}>3 Days</option>
                    <option value={5}>5 Days</option>
                    <option value={7}>1 Week</option>
                    <option value={10}>10 Days</option>
                    <option value={14}>2 Weeks</option>
                  </select>
                </div>

                {/* Destination Selection */}
                <div className={`p-8 rounded-3xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FaMapMarkerAlt className="text-2xl text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Destinations</h3>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(nepalDestinations).map(([id, dest]) => (
                      <label key={id} className="flex items-center space-x-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={formData.destinations.includes(id)}
                          onChange={() => toggleDestination(id)}
                          className="w-4 h-4 text-teal-600 rounded" 
                        />
                        <div>
                          <span className="font-medium">{dest.name}</span>
                          <div className="text-sm text-gray-500">{dest.days} days recommended</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Budget Selection */}
                <div className={`p-8 rounded-3xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FaMoneyBillWave className="text-2xl text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Budget Level</h3>
                  </div>
                  <select 
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}`}
                  >
                    <option value="budget">Budget ($30-60/day) - Guesthouses, local transport, street food</option>
                    <option value="mid">Mid-range ($70-120/day) - Hotels, private transport, restaurant meals</option>
                    <option value="luxury">Luxury ($130-250/day) - Resorts, private guides, premium experiences</option>
                  </select>
                </div>
              </div>

              {/* Generate Button */}
              <div className="text-center mt-12">
                <button 
                  onClick={handleGenerateItinerary}
                  disabled={isGenerating || formData.destinations.length === 0}
                  className={`px-12 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center gap-3 mx-auto ${
                    isGenerating || formData.destinations.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white transform hover:scale-105 shadow-xl'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Generating Your Itinerary...
                    </>
                  ) : (
                    <>
                      <FaRoute />
                      Generate Real Itinerary
                    </>
                  )}
                </button>
                
                {formData.destinations.length === 0 && (
                  <p className="text-red-500 text-sm mt-2">Please select at least one destination</p>
                )}
                
                {/* Debug Info */}
                <div className="mt-4 text-xs text-gray-500">
                  <p>Selected destinations: {formData.destinations.join(', ') || 'None'}</p>
                  <p>Duration: {formData.duration} days</p>
                  <p>Budget: {formData.budget}</p>
                </div>
              </div>
            </div>
          )}

          {/* Generated Itinerary Tab */}
          {activeTab === 'generated' && (
            <div className="space-y-8">
              {generatedItinerary ? (
                <>
                  {/* Header */}
                  <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">{generatedItinerary.title}</h2>
                    <p className="text-lg text-gray-600 mb-2">
                      {generatedItinerary.summary}
                    </p>
                    <p className="text-md text-gray-500 mb-6">
                      Created on {generatedItinerary.createdAt} • Budget Level: {generatedItinerary.budgetLevel.charAt(0).toUpperCase() + generatedItinerary.budgetLevel.slice(1)} • Total Cost: ${generatedItinerary.totalCost}
                    </p>
                    
                    <div className="flex justify-center gap-4">
                      <button className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:from-teal-700 hover:to-cyan-700 transition-all">
                        <FaSave />
                        Save Itinerary
                      </button>
                      <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                        <FaDownload />
                        Download PDF
                      </button>
                      <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                        <FaShare />
                        Share
                      </button>
                    </div>
                  </div>

                  {/* Daily Itinerary */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold mb-6">Daily Itinerary</h3>
                    
                    {generatedItinerary.dailyPlan.map((day) => (
                      <div key={day.day} className={`p-8 rounded-3xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
                        
                        {/* Day Header */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                              {day.day}
                            </div>
                            <div>
                              <h4 className="text-xl font-bold">{day.title}</h4>
                              <p className="text-gray-600">
                                Daily Cost: ${day.dailyCost + day.meals.reduce((sum, meal) => sum + (meal.included ? meal.cost : 0), 0)}
                              </p>
                              {day.highlights && (
                                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                                  🌟 {day.highlights}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Activities */}
                        <div className="space-y-4 mb-6">
                          {day.activities.map((activity, index) => (
                            <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                              <div className="w-24 text-sm font-medium text-gray-600 dark:text-gray-400 flex-shrink-0">
                                {activity.time}
                              </div>
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-900 dark:text-white">{activity.activity}</h5>
                                {activity.description && (
                                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{activity.description}</p>
                                )}
                                <span className={`inline-block px-2 py-1 rounded text-xs mt-2 ${
                                  activity.type === 'sightseeing' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                  activity.type === 'activity' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                  activity.type === 'logistics' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                                  activity.type === 'dining' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                                  'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                }`}>
                                  {activity.type}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Tips */}
                        {day.tips && (
                          <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500">
                            <h5 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                              <FaInfoCircle />
                              Daily Tip
                            </h5>
                            <p className="text-blue-800 dark:text-blue-200 text-sm">{day.tips}</p>
                          </div>
                        )}

                        {/* Accommodation, Meals & Transportation */}
                        <div className="grid md:grid-cols-3 gap-6">
                          <div>
                            <h5 className="font-semibold mb-3 flex items-center gap-2">
                              <FaHotel className="text-blue-500" />
                              Accommodation
                            </h5>
                            <p className="text-gray-700 dark:text-gray-300">{day.accommodation}</p>
                            <p className="text-sm text-gray-500">${day.dailyCost}/night</p>
                          </div>
                          
                          <div>
                            <h5 className="font-semibold mb-3 flex items-center gap-2">
                              <FaUtensils className="text-orange-500" />
                              Meals
                            </h5>
                            <div className="space-y-1">
                              {day.meals.map((meal, index) => (
                                <div key={index} className="flex justify-between text-sm">
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
                            <div>
                              <h5 className="font-semibold mb-3 flex items-center gap-2">
                                <FaRoute className="text-green-500" />
                                Transportation
                              </h5>
                              <p className="text-gray-700 dark:text-gray-300 text-sm">{day.transportation}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cost Summary */}
                  <div className={`p-8 rounded-3xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <FaMoneyBillWave className="text-green-500" />
                      Cost Breakdown
                    </h3>
                    
                    {generatedItinerary.costBreakdown && (
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Accommodation</span>
                            <span className="font-semibold">${generatedItinerary.costBreakdown.accommodation}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Meals</span>
                            <span className="font-semibold">${generatedItinerary.costBreakdown.meals}</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Transportation</span>
                            <span className="font-semibold">${generatedItinerary.costBreakdown.transportation}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Activities & Tours</span>
                            <span className="font-semibold">${generatedItinerary.costBreakdown.activities}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                      <div className="flex justify-between items-center text-2xl font-bold">
                        <span>Total Trip Cost</span>
                        <span className="text-teal-600">${generatedItinerary.totalCost}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Complete {generatedItinerary.budgetLevel} package for {generatedItinerary.duration.toLowerCase()} • 
                        Average ${Math.round(generatedItinerary.totalCost / parseInt(generatedItinerary.duration))}/day per person
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaRoute className="text-3xl text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">No Itinerary Generated Yet</h3>
                  <p className="text-gray-600 mb-6">Create your first itinerary using the form in the "Create Plan" tab.</p>
                  <button 
                    onClick={() => setActiveTab('create')}
                    className="px-8 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all duration-300"
                  >
                    Create Itinerary
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Travel Tips Tab */}
          {activeTab === 'tips' && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Nepal Travel Tips</h2>
                <p className="text-lg text-gray-600">Essential advice for your Nepal adventure</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className={`p-8 rounded-3xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
                  <h3 className="text-xl font-bold mb-4">🗓️ Best Time to Visit</h3>
                  <p>October to December and March to May offer the best weather conditions for most activities.</p>
                </div>
                <div className={`p-8 rounded-3xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
                  <h3 className="text-xl font-bold mb-4">🏔️ Altitude Considerations</h3>
                  <p>Plan acclimatization days for high-altitude destinations to avoid altitude sickness.</p>
                </div>
                <div className={`p-8 rounded-3xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
                  <h3 className="text-xl font-bold mb-4">🎒 Packing Essentials</h3>
                  <p>Bring layers, comfortable hiking boots, sunscreen, and a good camera for stunning landscapes.</p>
                </div>
                <div className={`p-8 rounded-3xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
                  <h3 className="text-xl font-bold mb-4">💰 Budget Planning</h3>
                  <p>Budget $30-150 per day depending on accommodation level and activities chosen.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Itinerary;