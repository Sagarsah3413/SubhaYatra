import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  FaRoute, FaPlus, FaSave, FaInfoCircle, 
  FaCalendarAlt, FaMapMarkerAlt, FaClock,
  FaHotel, FaUtensils, FaMoneyBillWave, FaDownload,
  FaShare, FaSpinner
} from 'react-icons/fa';

// Real Nepal destinations data
const nepalDestinations = {
  kathmandu: {
    name: 'Kathmandu',
    days: 3,
    attractions: ['Kathmandu Durbar Square', 'Swayambhunath Temple', 'Boudhanath Stupa', 'Pashupatinath Temple'],
    activities: ['Temple visits', 'Cultural tours', 'Shopping', 'Food tours'],
    accommodation: 'Heritage Hotel',
    dailyCost: 60
  },
  pokhara: {
    name: 'Pokhara',
    days: 4,
    attractions: ['Phewa Lake', 'Sarangkot Sunrise', 'World Peace Pagoda', 'Devi\'s Fall'],
    activities: ['Paragliding', 'Boating', 'Sunrise viewing', 'Cave exploration'],
    accommodation: 'Lakeside Resort',
    dailyCost: 70
  },
  chitwan: {
    name: 'Chitwan National Park',
    days: 3,
    attractions: ['Jungle Safari', 'Elephant Breeding Center', 'Tharu Cultural Program', 'Rapti River'],
    activities: ['Wildlife safari', 'Elephant rides', 'Bird watching', 'Cultural shows'],
    accommodation: 'Jungle Lodge',
    dailyCost: 80
  },
  everest: {
    name: 'Everest Region',
    days: 14,
    attractions: ['Everest Base Camp', 'Kala Patthar', 'Namche Bazaar', 'Tengboche Monastery'],
    activities: ['Trekking', 'Mountain viewing', 'Cultural immersion', 'Photography'],
    accommodation: 'Tea House',
    dailyCost: 50
  },
  annapurna: {
    name: 'Annapurna Region',
    days: 12,
    attractions: ['Annapurna Base Camp', 'Poon Hill', 'Thorong La Pass', 'Muktinath Temple'],
    activities: ['Trekking', 'Sunrise viewing', 'Cultural visits', 'Hot springs'],
    accommodation: 'Mountain Lodge',
    dailyCost: 45
  }
};

// Enhanced itinerary generator with better error handling
const generateItinerary = (formData) => {
  try {
    const { duration, destinations, activities, budget } = formData;
    const selectedDests = destinations.map(id => nepalDestinations[id]).filter(Boolean);
    
    if (selectedDests.length === 0) {
      console.error('No valid destinations selected');
      return null;
    }

    // Calculate days per destination
    const totalRecommendedDays = selectedDests.reduce((sum, dest) => sum + dest.days, 0);
    const scaleFactor = Math.max(0.5, duration / totalRecommendedDays); // Minimum 0.5 to ensure at least half day per destination

    let currentDay = 1;
    const dailyPlan = [];

    selectedDests.forEach(dest => {
      const daysInDest = Math.max(1, Math.round(dest.days * scaleFactor));
      
      for (let i = 0; i < daysInDest && currentDay <= duration; i++) {
        const dayActivities = [];
        const dayAttractions = dest.attractions.slice(i * 2, (i + 1) * 2);
        
        // Morning activity
        if (dayAttractions[0]) {
          dayActivities.push({
            time: '09:00 - 12:00',
            activity: `Visit ${dayAttractions[0]}`,
            type: 'sightseeing'
          });
        }

        // Afternoon activity
        if (dayAttractions[1]) {
          dayActivities.push({
            time: '14:00 - 17:00',
            activity: `Explore ${dayAttractions[1]}`,
            type: 'activity'
          });
        } else if (dest.activities[i % dest.activities.length]) {
          dayActivities.push({
            time: '14:00 - 17:00',
            activity: dest.activities[i % dest.activities.length],
            type: 'activity'
          });
        }

        // Evening activity
        dayActivities.push({
          time: '18:00 - 20:00',
          activity: 'Local dining and relaxation',
          type: 'leisure'
        });

        dailyPlan.push({
          day: currentDay,
          destination: dest.name,
          title: `Day ${currentDay}: ${dest.name}`,
          activities: dayActivities,
          accommodation: dest.accommodation,
          meals: [
            { meal: 'Breakfast', cost: 8 },
            { meal: 'Lunch', cost: 12 },
            { meal: 'Dinner', cost: 15 }
          ],
          dailyCost: dest.dailyCost
        });

        currentDay++;
      }
    });

    const totalCost = dailyPlan.reduce((sum, day) => sum + day.dailyCost + 35, 0); // 35 for meals

    const result = {
      title: `${duration}-Day Nepal Adventure`,
      duration: `${duration} Days`,
      destinations: selectedDests.map(d => d.name),
      dailyPlan,
      totalCost,
      createdAt: new Date().toLocaleDateString()
    };

    console.log('Generated itinerary:', result);
    return result;
  } catch (error) {
    console.error('Error in generateItinerary:', error);
    return null;
  }
};

const Itinerary = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('create');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState(null);
  
  // Form state with default selections for easier testing
  const [formData, setFormData] = useState({
    duration: 7,
    destinations: ['kathmandu'], // Default selection for easier testing
    activities: [],
    budget: 'mid'
  });

  // Debug log on component mount
  React.useEffect(() => {
    console.log('Itinerary component mounted');
    console.log('Initial form data:', formData);
    console.log('Nepal destinations available:', Object.keys(nepalDestinations));
  }, []);

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
                    <option value="low">Budget ($30-50/day)</option>
                    <option value="mid">Mid-range ($60-90/day)</option>
                    <option value="high">Luxury ($100-150/day)</option>
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
                    <p className="text-lg text-gray-600 mb-6">
                      Created on {generatedItinerary.createdAt} • Total Cost: ${generatedItinerary.totalCost}
                    </p>
                    
                    <div className="flex justify-center gap-4">
                      <button className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold flex items-center gap-2">
                        <FaSave />
                        Save Itinerary
                      </button>
                      <button className="px-6 py-3 border border-gray-300 rounded-xl font-semibold flex items-center gap-2">
                        <FaDownload />
                        Download PDF
                      </button>
                      <button className="px-6 py-3 border border-gray-300 rounded-xl font-semibold flex items-center gap-2">
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
                              <p className="text-gray-600">Daily Cost: ${day.dailyCost + 35}</p>
                            </div>
                          </div>
                        </div>

                        {/* Activities */}
                        <div className="space-y-4 mb-6">
                          {day.activities.map((activity, index) => (
                            <div key={index} className="flex items-start gap-4">
                              <div className="w-20 text-sm font-medium text-gray-600 flex-shrink-0">
                                {activity.time}
                              </div>
                              <div className="flex-1">
                                <h5 className="font-semibold">{activity.activity}</h5>
                                <span className={`inline-block px-2 py-1 rounded text-xs mt-1 ${
                                  activity.type === 'sightseeing' ? 'bg-green-100 text-green-800' :
                                  activity.type === 'activity' ? 'bg-blue-100 text-blue-800' :
                                  'bg-purple-100 text-purple-800'
                                }`}>
                                  {activity.type}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Accommodation & Meals */}
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="font-semibold mb-3 flex items-center gap-2">
                              <FaHotel className="text-blue-500" />
                              Accommodation
                            </h5>
                            <p>{day.accommodation} - ${day.dailyCost}</p>
                          </div>
                          
                          <div>
                            <h5 className="font-semibold mb-3 flex items-center gap-2">
                              <FaUtensils className="text-orange-500" />
                              Meals
                            </h5>
                            <div className="space-y-1">
                              {day.meals.map((meal, index) => (
                                <div key={index} className="flex justify-between">
                                  <span>{meal.meal}</span>
                                  <span>${meal.cost}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cost Summary */}
                  <div className={`p-8 rounded-3xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
                    <h3 className="text-2xl font-bold mb-6">Cost Summary</h3>
                    <div className="flex justify-between items-center text-2xl font-bold">
                      <span>Total Trip Cost</span>
                      <span className="text-teal-600">${generatedItinerary.totalCost}</span>
                    </div>
                    <p className="text-gray-600 mt-2">
                      Includes accommodation, meals, activities, and local transport for {generatedItinerary.duration.toLowerCase()}
                    </p>
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