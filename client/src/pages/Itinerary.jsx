import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { Header } from '../components/header/Header';
import Footer from '../components/footer/Footer';
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

// Enhanced itinerary generator with comprehensive planning using database places
const generateItinerary = (formData) => {
  try {
    const { duration, selectedPlaces, budget = 'mid' } = formData;
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 GENERATING ITINERARY');
    console.log('📅 Requested Duration:', duration, 'days');
    console.log('📍 Selected Places:', selectedPlaces.length);
    console.log('💰 Budget Level:', budget);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (!selectedPlaces || selectedPlaces.length === 0) {
      console.error('No valid destinations selected');
      return null;
    }

    // Estimate days per destination based on type and activities
    const estimateDays = (place) => {
      const type = (place.type || '').toLowerCase();
      const activities = (place.activities || '').toLowerCase();
      
      // Trekking destinations need more days
      if (type.includes('trek') || activities.includes('trek')) return 7;
      // Adventure/nature destinations
      if (type.includes('adventure') || type.includes('natural')) return 4;
      // Cultural/religious sites
      if (type.includes('cultural') || type.includes('religious')) return 3;
      // Urban/city destinations
      if (type.includes('urban') || type.includes('city')) return 3;
      // Default
      return 3;
    };

    const totalRecommendedDays = selectedPlaces.reduce((sum, place) => sum + estimateDays(place), 0);
    let remainingDays = duration;
    const destinationDays = [];

    // Distribute days across destinations, ensuring we don't exceed the total duration
    selectedPlaces.forEach((place, index) => {
      if (index === selectedPlaces.length - 1) {
        // Last destination gets all remaining days (at least 1)
        destinationDays.push(Math.max(1, remainingDays));
      } else {
        // Calculate proportional days but ensure we have enough days left for remaining destinations
        const proportionalDays = Math.max(1, Math.round((estimateDays(place) / totalRecommendedDays) * duration));
        const minDaysNeeded = selectedPlaces.length - index - 1; // At least 1 day per remaining destination
        const assignedDays = Math.min(proportionalDays, remainingDays - minDaysNeeded);
        destinationDays.push(Math.max(1, assignedDays));
        remainingDays -= Math.max(1, assignedDays);
      }
    });

    console.log('📅 Duration requested:', duration);
    console.log('📍 Destinations:', selectedPlaces.length);
    console.log('🗓️ Days per destination:', destinationDays);
    console.log('✅ Total days allocated:', destinationDays.reduce((sum, d) => sum + d, 0));

    let currentDay = 1;
    const dailyPlan = [];

    selectedPlaces.forEach((place, destIndex) => {
      const daysInDest = destinationDays[destIndex];
      
      // Parse activities and attractions
      const activities = place.activities ? place.activities.split(',').map(a => a.trim()).filter(a => a) : [];
      const tags = place.tags ? place.tags.split(',').map(t => t.trim()).filter(t => t) : [];
      
      // Determine accommodation based on place type and budget
      const getAccommodation = () => {
        const type = (place.type || '').toLowerCase();
        if (type.includes('trek')) {
          return budget === 'budget' ? 'Tea House Lodge' :
                 budget === 'luxury' ? 'Premium Mountain Lodge' : 'Mountain Lodge';
        }
        return budget === 'budget' ? 'Guesthouse' :
               budget === 'luxury' ? 'Luxury Resort' : 'Mid-range Hotel';
      };
      
      // STRICT CHECK: Stop if we've reached the duration limit
      for (let dayInDest = 0; dayInDest < daysInDest && currentDay <= duration; dayInDest++) {
        const dayActivities = [];
        
        if (dayInDest === 0) {
          // Arrival day
          dayActivities.push({
            time: '10:00 - 12:00',
            activity: `Arrive in ${place.name} and check-in`,
            type: 'logistics',
            description: `Settle into your ${getAccommodation()} and get oriented`
          });
          
          dayActivities.push({
            time: '14:00 - 17:00',
            activity: tags[0] ? `Explore ${tags[0]}` : `${place.name} orientation walk`,
            type: 'sightseeing',
            description: place.description || 'Get your first taste of the local culture and atmosphere'
          });
          
          dayActivities.push({
            time: '18:00 - 20:00',
            activity: 'Welcome dinner and local cuisine',
            type: 'dining',
            description: 'Try authentic local dishes and plan upcoming days'
          });
        } else if (dayInDest === daysInDest - 1 && daysInDest > 1) {
          // Departure day
          dayActivities.push({
            time: '08:00 - 11:00',
            activity: activities[dayInDest % activities.length] || 'Final exploration',
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
          // Full day
          dayActivities.push({
            time: '08:00 - 11:30',
            activity: tags[dayInDest % tags.length] || `${place.name} morning exploration`,
            type: 'sightseeing',
            description: 'Start the day with the most popular attractions'
          });
          
          dayActivities.push({
            time: '13:00 - 17:00',
            activity: activities[dayInDest % activities.length] || 'Cultural activities',
            type: 'activity',
            description: place.description || 'Immerse yourself in local experiences and adventures'
          });
          
          dayActivities.push({
            time: '17:30 - 19:00',
            activity: tags[(dayInDest + 1) % tags.length] || 'Evening exploration',
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

        // Calculate costs based on budget
        const baseCost = budget === 'budget' ? 35 : budget === 'luxury' ? 120 : 65;
        const mealCosts = budget === 'budget' ? [6, 10, 12] : 
                         budget === 'luxury' ? [15, 25, 35] : [8, 15, 20];

        dailyPlan.push({
          day: currentDay,
          destination: place.name,
          title: `Day ${currentDay}: ${place.name}${dayInDest === 0 ? ' (Arrival)' : dayInDest === daysInDest - 1 && daysInDest > 1 ? ' (Departure)' : ''}`,
          activities: dayActivities,
          accommodation: getAccommodation(),
          meals: [
            { meal: 'Breakfast', cost: mealCosts[0], included: dayInDest > 0 },
            { meal: 'Lunch', cost: mealCosts[1], included: true },
            { meal: 'Dinner', cost: mealCosts[2], included: true }
          ],
          dailyCost: baseCost,
          transportation: place.transportation || 'Local transport',
          highlights: `${place.type || 'Destination'} - ${place.best_season || 'Year-round'}`,
          tips: generateDayTips(place, dayInDest, budget),
          placeData: place
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

    // VALIDATION: Ensure we generated exactly the requested number of days
    const actualDays = dailyPlan.length;
    if (actualDays !== duration) {
      console.warn(`⚠️ Generated ${actualDays} days but requested ${duration} days`);
    } else {
      console.log(`✅ Successfully generated exactly ${duration} days as requested`);
    }

    const result = {
      title: `${duration}-Day ${selectedPlaces.map(p => p.name).join(' & ')} Adventure`,
      duration: `${duration} Days`,
      destinations: selectedPlaces.map(p => p.name),
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
      summary: generateItinerarySummary(selectedPlaces, duration, budget)
    };

    console.log('Generated comprehensive itinerary from database:', result);
    console.log(`📊 Final check: Requested ${duration} days, Generated ${dailyPlan.length} days`);
    return result;
  } catch (error) {
    console.error('Error in generateItinerary:', error);
    return null;
  }
};

const generateDayTips = (place, dayIndex, budget) => {
  const tips = [
    `Best time to visit ${place.name} is ${place.best_season || 'year-round'}`,
    `Don't forget to try the local specialties and traditional cuisine`,
    `Carry cash as many local vendors don't accept cards`,
    `Respect local customs and dress modestly when visiting religious sites`,
    `Stay hydrated and use sunscreen, especially at higher altitudes`
  ];
  
  if (place.difficulty_level) {
    tips.push(`Difficulty level: ${place.difficulty_level} - plan accordingly`);
  }
  
  if (budget === 'budget') {
    tips.push('Look for local eateries and guesthouses for authentic experiences at lower costs');
  } else if (budget === 'luxury') {
    tips.push('Consider hiring a private guide for personalized experiences');
  }
  
  return tips[dayIndex % tips.length];
};

const generateItinerarySummary = (places, duration, budget) => {
  const destNames = places.map(p => p.name).join(', ');
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
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [loadingPlaces, setLoadingPlaces] = useState(true);
  const [hasShownPreselectedToast, setHasShownPreselectedToast] = useState(false);
  const [hasShownTipsToast, setHasShownTipsToast] = useState(false);
  
  const preselectedDestination = location.state?.preselectedDestination;
  const openTab = location.state?.openTab; // Check if a specific tab should be opened
  const userPreferences = location.state?.userPreferences; // Get user preferences from recommendations
  
  // Initialize form data with user preferences if available
  const [formData, setFormData] = useState({
    duration: userPreferences?.tripDuration ? 
      (userPreferences.tripDuration === '1-3' ? 3 :
       userPreferences.tripDuration === '4-7' ? 7 :
       userPreferences.tripDuration === '8-14' ? 10 :
       userPreferences.tripDuration === '15+' ? 14 : 7) : 7,
    destinations: [],
    activities: [],
    budget: 'mid'
  });

  // Show user preferences info when available
  useEffect(() => {
    if (userPreferences && !hasShownPreselectedToast) {
      console.log('✅ User preferences received:', userPreferences);
      showSuccess(
        'Preferences Applied',
        `Your trip preferences have been pre-filled: ${userPreferences.travellers} traveller(s), ${userPreferences.tripDuration} days, ${userPreferences.travelMonth || 'any month'}`
      );
      setHasShownPreselectedToast(true);
    }
  }, [userPreferences, hasShownPreselectedToast, showSuccess]);

  // Open specific tab if requested (e.g., from "Get Expert Tips" button)
  useEffect(() => {
    if (openTab && !hasShownTipsToast) {
      console.log('🎯 Opening requested tab:', openTab);
      // Small delay to ensure component is mounted
      setTimeout(() => {
        setActiveTab(openTab);
        console.log('✅ Active tab set to:', openTab);
      }, 100);
      
      // Show success message if coming from detail page (only once)
      if (location.state?.fromDetailPage) {
        setTimeout(() => {
          showSuccess(
            'Travel Tips',
            'Explore expert travel tips and local insights for Nepal destinations!'
          );
          setHasShownTipsToast(true);
        }, 500);
      }
    }
  }, [openTab, location.state?.fromDetailPage, hasShownTipsToast, showSuccess]);

  // Save Itinerary to localStorage
  const handleSaveItinerary = () => {
    if (!generatedItinerary) {
      alert('No itinerary to save!');
      return;
    }

    try {
      // Get existing saved itineraries
      const savedItineraries = JSON.parse(localStorage.getItem('savedItineraries') || '[]');
      
      // Add timestamp and unique ID
      const itineraryToSave = {
        ...generatedItinerary,
        id: Date.now(),
        savedAt: new Date().toISOString()
      };
      
      // Add to saved itineraries
      savedItineraries.push(itineraryToSave);
      
      // Save back to localStorage
      localStorage.setItem('savedItineraries', JSON.stringify(savedItineraries));
      
      showSuccess(
        'Itinerary Saved!',
        'Your itinerary has been saved successfully. You can access it anytime from your saved itineraries.'
      );
    } catch (error) {
      console.error('Error saving itinerary:', error);
      alert('Failed to save itinerary. Please try again.');
    }
  };

  // Download Itinerary as PDF
  const handleDownloadPDF = () => {
    if (!generatedItinerary) {
      alert('No itinerary to download!');
      return;
    }

    try {
      // Create a formatted text version of the itinerary
      let pdfContent = `
╔════════════════════════════════════════════════════════════════╗
║                    NEPAL TRAVEL ITINERARY                      ║
╚════════════════════════════════════════════════════════════════╝

${generatedItinerary.title}
${generatedItinerary.summary}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TRIP DETAILS:
• Duration: ${generatedItinerary.duration}
• Budget Level: ${generatedItinerary.budgetLevel.charAt(0).toUpperCase() + generatedItinerary.budgetLevel.slice(1)}
• Total Cost: $${generatedItinerary.totalCost}
• Created: ${generatedItinerary.createdAt}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DAILY ITINERARY:

`;

      generatedItinerary.dailyPlan.forEach((day) => {
        pdfContent += `
┌────────────────────────────────────────────────────────────────┐
│ ${day.title.padEnd(62)} │
└────────────────────────────────────────────────────────────────┘

📍 Destination: ${day.destination}
💰 Daily Cost: $${day.dailyCost + day.meals.reduce((sum, meal) => sum + (meal.included ? meal.cost : 0), 0)}
🏨 Accommodation: ${day.accommodation}
🚗 Transportation: ${day.transportation}

ACTIVITIES:
${day.activities.map((activity, idx) => `
  ${idx + 1}. ${activity.time} - ${activity.activity}
     ${activity.description}
     [${activity.type.toUpperCase()}]
`).join('\n')}

MEALS:
${day.meals.map(meal => `  • ${meal.meal}: $${meal.cost} ${meal.included ? '✓' : '✗'}`).join('\n')}

💡 TIP: ${day.tips}

`;
      });

      pdfContent += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COST BREAKDOWN:

🏨 Accommodation:     $${generatedItinerary.costBreakdown.accommodation}
🍽️  Meals:            $${generatedItinerary.costBreakdown.meals}
🚗 Transportation:    $${generatedItinerary.costBreakdown.transportation}
🎯 Activities:        $${generatedItinerary.costBreakdown.activities}
─────────────────────────────────────────────────────────────────
💰 TOTAL:             $${generatedItinerary.costBreakdown.total}

Average per day: $${Math.round(generatedItinerary.totalCost / parseInt(generatedItinerary.duration))}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generated by Roamio Wanderly - Your Nepal Travel Companion
Visit: http://localhost:5173

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

      // Create a blob and download
      const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Nepal-Itinerary-${generatedItinerary.destinations.join('-').replace(/\s+/g, '-')}-${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showSuccess(
        'Download Started!',
        'Your itinerary is being downloaded as a text file.'
      );
    } catch (error) {
      console.error('Error downloading itinerary:', error);
      alert('Failed to download itinerary. Please try again.');
    }
  };

  // Share Itinerary
  const handleShareItinerary = async () => {
    if (!generatedItinerary) {
      alert('No itinerary to share!');
      return;
    }

    const shareText = `Check out my ${generatedItinerary.duration} Nepal travel itinerary!

${generatedItinerary.title}

Destinations: ${generatedItinerary.destinations.join(', ')}
Budget: ${generatedItinerary.budgetLevel.charAt(0).toUpperCase() + generatedItinerary.budgetLevel.slice(1)}
Total Cost: $${generatedItinerary.totalCost}

${generatedItinerary.summary}

Plan your own trip at: http://localhost:5173/itinerary`;

    // Check if Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share({
          title: generatedItinerary.title,
          text: shareText,
          url: window.location.href
        });
        showSuccess('Shared!', 'Itinerary shared successfully!');
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          // Fallback to clipboard
          copyToClipboard(shareText);
        }
      }
    } else {
      // Fallback: Copy to clipboard
      copyToClipboard(shareText);
    }
  };

  // Helper function to copy to clipboard
  const copyToClipboard = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          showSuccess(
            'Copied to Clipboard!',
            'Itinerary details copied. You can now paste and share it anywhere!'
          );
        })
        .catch((error) => {
          console.error('Error copying to clipboard:', error);
          // Fallback for older browsers
          fallbackCopyToClipboard(text);
        });
    } else {
      fallbackCopyToClipboard(text);
    }
  };

  // Fallback copy method for older browsers
  const fallbackCopyToClipboard = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      showSuccess(
        'Copied to Clipboard!',
        'Itinerary details copied. You can now paste and share it anywhere!'
      );
    } catch (error) {
      console.error('Fallback copy failed:', error);
      alert('Failed to copy to clipboard. Please copy manually.');
    }
    
    document.body.removeChild(textArea);
  };

  // Fetch available places from backend
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoadingPlaces(true);
        console.log('🔄 Fetching ALL places from backend...');
        // Fetch ALL places using 'all' parameter
        const response = await fetch('http://localhost:8000/api/places?limit=all');
        if (!response.ok) throw new Error('Failed to fetch places');
        
        const data = await response.json();
        console.log('✅ Successfully fetched places from database!');
        console.log('📊 Total places in database:', data.total);
        console.log('📦 Places loaded:', data.places.length);
        console.log('📋 First 5 places:', data.places.slice(0, 5).map(p => ({ id: p.id, name: p.name })));
        
        if (data.places.length === 0) {
          console.warn('⚠️ No places found in database!');
          showSuccess('Warning', 'No destinations found in database. Please check your backend.');
        } else if (data.places.length < data.total) {
          console.warn(`⚠️ Only loaded ${data.places.length} out of ${data.total} places`);
        }
        
        setAvailablePlaces(data.places || []);
      } catch (error) {
        console.error('❌ Error fetching places:', error);
        showSuccess('Error', 'Failed to load destinations from database. Please check if backend is running.');
      } finally {
        setLoadingPlaces(false);
        console.log('✅ Loading places complete');
      }
    };

    fetchPlaces();
  }, []);

  React.useEffect(() => {
    console.log('Itinerary component mounted');
    console.log('Preselected destination:', preselectedDestination);
    console.log('Available places loaded:', availablePlaces.length);
    
    // Only run once when both conditions are met and toast hasn't been shown
    if (preselectedDestination && availablePlaces.length > 0 && !hasShownPreselectedToast) {
      // Improved matching logic - try multiple strategies
      const findMatchingPlace = () => {
        const preselectedName = preselectedDestination.name.toLowerCase().trim();
        
        // Strategy 1: Exact ID match
        if (preselectedDestination.id) {
          const exactIdMatch = availablePlaces.find(p => p.id === preselectedDestination.id);
          if (exactIdMatch) {
            console.log('✅ Found by exact ID match:', exactIdMatch.name);
            return exactIdMatch;
          }
        }
        
        // Strategy 2: Exact name match
        const exactNameMatch = availablePlaces.find(p => 
          p.name.toLowerCase().trim() === preselectedName
        );
        if (exactNameMatch) {
          console.log('✅ Found by exact name match:', exactNameMatch.name);
          return exactNameMatch;
        }
        
        // Strategy 3: Partial name match (contains)
        const partialMatch = availablePlaces.find(p => 
          p.name.toLowerCase().includes(preselectedName) ||
          preselectedName.includes(p.name.toLowerCase())
        );
        if (partialMatch) {
          console.log('✅ Found by partial match:', partialMatch.name);
          return partialMatch;
        }
        
        // Strategy 4: Match by first significant word
        const firstWord = preselectedName.split(/[\s,\-\(\)]+/)[0];
        if (firstWord && firstWord.length > 3) {
          const wordMatch = availablePlaces.find(p => 
            p.name.toLowerCase().includes(firstWord)
          );
          if (wordMatch) {
            console.log('✅ Found by first word match:', wordMatch.name);
            return wordMatch;
          }
        }
        
        console.warn('❌ No match found for:', preselectedDestination.name);
        console.log('Available place names:', availablePlaces.slice(0, 10).map(p => p.name));
        return null;
      };
      
      const matchedPlace = findMatchingPlace();
      
      if (matchedPlace) {
        setFormData(prev => ({
          ...prev,
          destinations: [matchedPlace.id]
        }));
        
        showSuccess(
          "Destination Added",
          `${matchedPlace.name} has been added to your itinerary planner!`
        );
      } else {
        showSuccess(
          "Destination Not Found",
          `"${preselectedDestination.name}" was not found in the database. Please select from available destinations.`
        );
      }
      
      // Mark that we've shown the toast
      setHasShownPreselectedToast(true);
    }
  }, [preselectedDestination, availablePlaces, hasShownPreselectedToast, showSuccess]);

  const handleInputChange = (field, value) => {
    console.log(`Updating ${field} to:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleDestination = (placeId) => {
    console.log(`Toggling destination: ${placeId}`);
    setFormData(prev => {
      const newDestinations = prev.destinations.includes(placeId)
        ? prev.destinations.filter(id => id !== placeId)
        : [...prev.destinations, placeId];
      console.log('New destinations:', newDestinations);
      return { ...prev, destinations: newDestinations };
    });
  };

  const handleGenerateItinerary = async () => {
    if (formData.destinations.length === 0) {
      alert('Please select at least one destination');
      return;
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 Generate My Itinerary clicked');
    console.log('📅 Duration from formData:', formData.duration, 'days');
    console.log('📍 Destinations:', formData.destinations);
    console.log('💰 Budget:', formData.budget);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get selected places from availablePlaces
      const selectedPlaces = formData.destinations
        .map(id => availablePlaces.find(p => p.id === id))
        .filter(Boolean);
      
      console.log('📍 Selected places:', selectedPlaces.map(p => p.name));
      
      const itinerary = generateItinerary({
        ...formData,
        selectedPlaces
      });
      
      if (itinerary) {
        setGeneratedItinerary(itinerary);
        setActiveTab('generated');
        console.log('✅ Itinerary generated successfully!');
      } else {
        alert('Failed to generate itinerary. Please try again.');
        console.error('❌ Failed to generate itinerary');
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
      <Header />
      
      {/* Professional Hero Section with Animations */}
      <section className="relative py-24 pt-32 overflow-hidden">
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
                
                {/* User Preferences Applied Banner */}
                {userPreferences && (
                  <div 
                    className={`mt-8 p-6 rounded-2xl max-w-3xl mx-auto ${
                      theme === 'dark' 
                        ? 'bg-gradient-to-r from-teal-900/30 to-cyan-900/30 border border-teal-500/30' 
                        : 'bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200'
                    }`}
                    style={{
                      animation: 'slideDown 0.6s ease-out'
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
                        <FaCheckCircle className="text-white text-lg" />
                      </div>
                      <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Your Preferences Applied
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-3 justify-center">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        theme === 'dark' ? 'bg-slate-800 text-teal-400' : 'bg-white text-teal-600'
                      }`}>
                        👥 {userPreferences.travellers} Traveller{userPreferences.travellers !== '1' ? 's' : ''}
                      </span>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        theme === 'dark' ? 'bg-slate-800 text-cyan-400' : 'bg-white text-cyan-600'
                      }`}>
                        📅 {userPreferences.tripDuration} Days
                      </span>
                      {userPreferences.travelMonth && (
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          theme === 'dark' ? 'bg-slate-800 text-blue-400' : 'bg-white text-blue-600'
                        }`}>
                          🗓️ {userPreferences.travelMonth}
                        </span>
                      )}
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        theme === 'dark' ? 'bg-slate-800 text-purple-400' : 'bg-white text-purple-600'
                      }`}>
                        🎯 {userPreferences.age} years old
                      </span>
                    </div>
                  </div>
                )}
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
                        onClick={async () => {
                          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                          console.log('🚀 Quick Plan clicked');
                          console.log('📊 Available places:', availablePlaces.length);
                          console.log('📍 Preselected destination:', preselectedDestination);
                          console.log('✅ Current form destinations:', formData.destinations);
                          console.log('📅 Current form duration:', formData.duration, 'days');
                          console.log('👤 User preferences:', userPreferences);
                          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                          
                          // Check if destination is already selected in form
                          if (formData.destinations.length > 0) {
                            console.log('✅ Using already selected destinations from form');
                            // Use already selected destination
                            const selectedPlaces = formData.destinations
                              .map(id => {
                                const place = availablePlaces.find(p => p.id === id);
                                console.log(`  Finding place with ID ${id}:`, place ? place.name : 'NOT FOUND');
                                return place;
                              })
                              .filter(Boolean);
                            
                            console.log('📍 Selected places:', selectedPlaces.map(p => p.name));
                            
                            if (selectedPlaces.length > 0) {
                              setIsGenerating(true);
                              setTimeout(() => {
                                const itinerary = generateItinerary({
                                  ...formData,
                                  // Use the duration from formData (which includes user preferences)
                                  selectedPlaces
                                });
                                
                                if (itinerary) {
                                  setGeneratedItinerary(itinerary);
                                  setActiveTab('generated');
                                  console.log('✅ Itinerary generated successfully!');
                                } else {
                                  alert('Failed to generate itinerary. Please try again.');
                                  console.error('❌ Failed to generate itinerary');
                                }
                                setIsGenerating(false);
                              }, 1500);
                            } else {
                              alert('Selected destination not found. Please try selecting again.');
                              console.error('❌ Selected places not found in availablePlaces');
                            }
                          } else if (preselectedDestination && availablePlaces.length > 0) {
                            console.log('🔍 Trying to find preselected destination...');
                            console.log('   Looking for:', preselectedDestination.name);
                            console.log('   With ID:', preselectedDestination.id);
                            
                            // Enhanced matching function
                            const findMatch = () => {
                              const searchName = preselectedDestination.name.toLowerCase().trim();
                              console.log('   Search name:', searchName);
                              
                              // Try exact ID match first
                              if (preselectedDestination.id) {
                                const idMatch = availablePlaces.find(p => p.id === preselectedDestination.id);
                                if (idMatch) {
                                  console.log('✅ Found by ID:', idMatch.name);
                                  return idMatch;
                                }
                              }
                              
                              // Try exact name match
                              const exactMatch = availablePlaces.find(p => 
                                p.name.toLowerCase().trim() === searchName
                              );
                              if (exactMatch) {
                                console.log('✅ Found by exact name:', exactMatch.name);
                                return exactMatch;
                              }
                              
                              // Try contains match (both directions)
                              const containsMatch = availablePlaces.find(p => {
                                const placeName = p.name.toLowerCase().trim();
                                return placeName.includes(searchName) || searchName.includes(placeName);
                              });
                              if (containsMatch) {
                                console.log('✅ Found by contains:', containsMatch.name);
                                return containsMatch;
                              }
                              
                              // Try first word match
                              const firstWord = searchName.split(/[\s,\-\(\)]+/)[0];
                              if (firstWord && firstWord.length > 3) {
                                const wordMatch = availablePlaces.find(p => 
                                  p.name.toLowerCase().includes(firstWord)
                                );
                                if (wordMatch) {
                                  console.log('✅ Found by first word:', wordMatch.name);
                                  return wordMatch;
                                }
                              }
                              
                              // Try fuzzy match - remove common words and match
                              const cleanName = searchName
                                .replace(/\(.*?\)/g, '') // Remove parentheses content
                                .replace(/national park|temple|stupa|monastery|lake|mountain|mount|peak/gi, '')
                                .trim();
                              
                              if (cleanName.length > 3) {
                                const fuzzyMatch = availablePlaces.find(p => {
                                  const cleanPlaceName = p.name.toLowerCase()
                                    .replace(/\(.*?\)/g, '')
                                    .replace(/national park|temple|stupa|monastery|lake|mountain|mount|peak/gi, '')
                                    .trim();
                                  return cleanPlaceName.includes(cleanName) || cleanName.includes(cleanPlaceName);
                                });
                                if (fuzzyMatch) {
                                  console.log('✅ Found by fuzzy match:', fuzzyMatch.name);
                                  return fuzzyMatch;
                                }
                              }
                              
                              console.error('❌ No match found!');
                              console.log('   Available place names (first 20):');
                              availablePlaces.slice(0, 20).forEach((p, i) => {
                                console.log(`   ${i + 1}. ${p.name} (ID: ${p.id})`);
                              });
                              return null;
                            };
                            
                            const matchedPlace = findMatch();
                            
                            if (matchedPlace) {
                              console.log('✅ Match found! Generating itinerary...');
                              // Update form data and generate (keep existing duration from formData)
                              const updatedFormData = {
                                ...formData,
                                destinations: [matchedPlace.id]
                                // duration is already in formData from user preferences
                              };
                              setFormData(updatedFormData);
                              
                              setIsGenerating(true);
                              setTimeout(() => {
                                const selectedPlaces = [matchedPlace];
                                const itinerary = generateItinerary({
                                  ...updatedFormData,
                                  selectedPlaces
                                });
                                
                                if (itinerary) {
                                  setGeneratedItinerary(itinerary);
                                  setActiveTab('generated');
                                  console.log('✅ Itinerary generated successfully!');
                                } else {
                                  alert('Failed to generate itinerary. Please try again.');
                                  console.error('❌ Failed to generate itinerary');
                                }
                                setIsGenerating(false);
                              }, 1500);
                            } else {
                              console.error('❌ Could not find destination');
                              alert(`Could not find "${preselectedDestination.name}" in the database. Please select from available destinations below.`);
                            }
                          } else {
                            console.warn('⚠️ No destination selected or places not loaded');
                            alert('Please wait for destinations to load or select a destination below.');
                          }
                          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                        }}
                        disabled={isGenerating || loadingPlaces}
                        className="ml-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGenerating ? 'Generating...' : loadingPlaces ? 'Loading...' : 'Quick Plan'}
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
                    {userPreferences && (
                      <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                        theme === 'dark' ? 'bg-teal-900/30 text-teal-400' : 'bg-teal-100 text-teal-700'
                      }`}>
                        <FaCheckCircle />
                        <span>Pre-filled from your preferences</span>
                      </div>
                    )}
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
                    {loadingPlaces ? (
                      <div className="text-center py-8">
                        <FaSpinner className="animate-spin text-4xl mx-auto mb-4 text-teal-500" />
                        <p className="text-gray-600 dark:text-gray-400">Loading destinations from database...</p>
                      </div>
                    ) : availablePlaces.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-red-600 dark:text-red-400 font-bold mb-2">⚠️ No destinations available</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Please check if the backend is running and database is populated.</p>
                      </div>
                    ) : (
                      <>
                        <div className={`text-center py-2 px-4 rounded-lg mb-4 ${
                          theme === 'dark' ? 'bg-teal-900/30 text-teal-400' : 'bg-teal-50 text-teal-700'
                        }`}>
                          <p className="text-sm font-bold">
                            ✅ {availablePlaces.length} destinations loaded from database
                          </p>
                        </div>
                        {availablePlaces.map((place) => {
                        const isPreselected = preselectedDestination && 
                          (place.id === preselectedDestination.id || 
                           place.name.toLowerCase() === preselectedDestination.name.toLowerCase());
                        
                        return (
                          <label 
                            key={place.id} 
                            className={`flex items-center space-x-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                              formData.destinations.includes(place.id)
                                ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border-2 border-teal-500 shadow-lg'
                                : isPreselected
                                  ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-400 shadow-md'
                                  : theme === 'dark'
                                    ? 'bg-slate-700/50 hover:bg-slate-700 border-2 border-transparent'
                                    : 'bg-gray-100 hover:bg-gray-200 border-2 border-transparent'
                            }`}
                          >
                            <input 
                              type="checkbox" 
                              checked={formData.destinations.includes(place.id)}
                              onChange={() => toggleDestination(place.id)}
                              className="w-5 h-5 text-teal-600 rounded-lg focus:ring-2 focus:ring-teal-500" 
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-lg">{place.name}</span>
                                {isPreselected && (
                                  <span className="px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full font-bold">
                                    From Details
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {place.location} • {place.type || 'Destination'}
                              </div>
                              {place.best_season && (
                                <div className="text-xs text-teal-600 dark:text-teal-400 mt-1">
                                  Best: {place.best_season}
                                </div>
                              )}
                            </div>
                          </label>
                        );
                      })}
                      </>
                    )}
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
                      <button 
                        onClick={handleSaveItinerary}
                        className="px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-2xl font-bold flex items-center gap-3 hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                      >
                        <FaSave className="text-lg" />
                        Save Itinerary
                      </button>
                      <button 
                        onClick={handleDownloadPDF}
                        className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-2xl font-bold flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <FaDownload className="text-lg" />
                        Download PDF
                      </button>
                      <button 
                        onClick={handleShareItinerary}
                        className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-2xl font-bold flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
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
              {console.log('🎨 Rendering Travel Tips tab')}
              {console.log('Available places:', availablePlaces.length)}
              {console.log('Loading places:', loadingPlaces)}
              
              <div className="text-center mb-16">
                <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Nepal Travel Tips
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Essential advice and insider knowledge for your Nepal adventure
                </p>
              </div>

              {/* General Tips */}
              <div className="mb-12">
                <h3 className="text-3xl font-black mb-8 text-center">General Travel Tips</h3>
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
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Itinerary;
