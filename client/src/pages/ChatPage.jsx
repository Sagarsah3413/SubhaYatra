import { useState, useEffect, useRef } from "react";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer/Footer";
import { Header } from "../components/header/Header";
import { CohereClient } from "cohere-ai";
import chatService from "../services/chatService";
import Toast from "../components/Toast";

export default function ChatPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  
  // State management
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [cohereAI, setCohereAI] = useState(null);
  const [aiStatus, setAiStatus] = useState('initializing'); // 'initializing', 'ready', 'error', 'fallback'
  
  // Chat history state
  const [chatHistory, setChatHistory] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchHistory, setShowSearchHistory] = useState(false);

  // Currency mode: 'USD' | 'NPR' | 'INR'
  const [currency, setCurrency] = useState('USD');
  const CURRENCY_RATES = { USD: 1, NPR: 133, INR: 83 };
  const CURRENCY_SYMBOLS = { USD: '$', NPR: 'रू', INR: '₹' };
  const cycleCurrency = () => {
    setCurrency(c => c === 'USD' ? 'NPR' : c === 'NPR' ? 'INR' : 'USD');
  };

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize Cohere AI
  useEffect(() => {
    const initializeAI = async () => {
      try {
        const cohereApiKey = import.meta.env.VITE_COHERE_API_KEY;
        
        console.log('🔍 Cohere Debug Info:');
        console.log('- API Key from env:', cohereApiKey ? `${cohereApiKey.substring(0, 10)}...` : 'NOT FOUND');
        
        if (!cohereApiKey || cohereApiKey === 'your_cohere_api_key_here') {
          console.warn('⚠️ Cohere API key not configured, using fallback responses');
          setAiStatus('fallback');
          return;
        }

        console.log('🔄 Initializing Cohere AI...');
        const cohere = new CohereClient({
          token: cohereApiKey,
        });
        
        // Test the connection with a simple prompt
        console.log('🧪 Testing Cohere API...');
        const testResponse = await cohere.chat({
          message: "Say 'OK'",
          model: "command-r7b-12-2024",
        });
        
        console.log('✅ Cohere API works! Response:', testResponse.text);
        setCohereAI(cohere);
        setAiStatus('ready');
        console.log('✅ Cohere AI initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize Cohere AI:', error.message);
        console.warn('⚠️ Using fallback responses');
        setAiStatus('fallback');
      }
    };

    initializeAI();
  }, []);

  // Load chat history and search history when user is available
  useEffect(() => {
    if (user?.id) {
      loadChatHistory();
      loadSearchHistory();
    }
  }, [user?.id]);

  // Load chat history
  const loadChatHistory = async () => {
    if (!user?.id) return;
    
    try {
      setLoadingHistory(true);
      const history = await chatService.getChatHistory(user.id, 20);
      setChatHistory(history);
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Load search history
  const loadSearchHistory = async () => {
    if (!user?.id) return;
    
    try {
      const searches = await chatService.getSearchHistory(user.id, 50);
      const formattedSearches = chatService.formatSearchHistory(searches);
      setSearchHistory(formattedSearches);
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  // Create new chat - just reset UI; handleSend will create the backend record on first message
  const createNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
  };

  // Load messages from a specific chat
  const loadChatMessages = async (chatId) => {
    try {
      const messages = await chatService.getChatMessages(chatId);
      const formattedMessages = messages.map(msg => ({
        id: msg.id,
        sender: msg.sender,
        content: msg.content,
        timestamp: msg.timestamp
      }));
      setMessages(formattedMessages);
      setCurrentChatId(chatId);
    } catch (error) {
      console.error('Error loading chat messages:', error);
    }
  };

  // Search in chat history
  const searchChats = async (query) => {
    if (!user?.id || !query.trim()) {
      setChatHistory(await chatService.getChatHistory(user.id, 20));
      return;
    }
    
    try {
      const results = await chatService.searchChats(user.id, query);
      setChatHistory(results);
    } catch (error) {
      console.error('Error searching chats:', error);
    }
  };

  // Toggle favorite search
  const toggleFavoriteSearch = async (searchId) => {
    try {
      await chatService.toggleFavoriteSearch(searchId);
      await loadSearchHistory(); // Refresh search history
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Delete search history entry
  const deleteSearchEntry = async (searchId) => {
    try {
      await chatService.deleteSearchHistory(searchId);
      await loadSearchHistory(); // Refresh search history
    } catch (error) {
      console.error('Error deleting search entry:', error);
    }
  };

  // Simple keyword-based response system for Nepal travel
  const getNepalTravelResponse = (userInput) => {
    const input = userInput.toLowerCase();
    const sym = CURRENCY_SYMBOLS[currency];
    const r = CURRENCY_RATES[currency]; // multiplier from USD

    const usd = (amount) => {
      const converted = Math.round(amount * r);
      return `${sym}${currency === 'USD' ? amount : converted.toLocaleString()}`;
    };
    
    // Greetings
    if (['hi', 'hello', 'hey', 'namaste', 'good morning', 'good afternoon', 'good evening', 'greetings'].some(g => input.includes(g))) {
      return `🙏 **Namaste! Welcome to SubhaYatra!**

I'm your Nepal travel assistant. I can help you with:

🏔️ **Trekking & Adventure** — EBC, Annapurna, Langtang and more
🏛️ **Culture & Heritage** — Durbar Squares, temples, festivals
🍜 **Food & Cuisine** — Dal Bhat, Momos, Newari food
🗓️ **Festival Calendar** — Dashain, Tihar, Indra Jatra and more
🎒 **Trip Planning** — Itineraries, budgets, best seasons
🏨 **Accommodation** — Hotels, lodges, tea houses

What would you like to explore about Nepal?`;
    }

    // SubhaYatra app features
    if (input.includes('subhayatra') || input.includes('app') || input.includes('feature') || input.includes('how to use') || input.includes('itinerary planner') || input.includes('explore section')) {
      return `📱 **SubhaYatra Features:**

• **Itinerary Planner** — Build custom day-by-day plans, select destinations, set your budget & travel style
• **Explore Nepal** — Browse 1,057+ verified destinations with photos and details
• **Famous Spots** — Top-rated attractions across all regions
• **Festival Calendar** — Nepali BS calendar with upcoming festivals and events
• **Hotel & Restaurant Search** — Filter by location, budget, and ratings
• **AI Assistant (me!)** — Get personalized travel advice 24/7
• **Saved Favorites** — Bookmark places and itineraries to your account

💡 **Tip:** Start with the *Itinerary Planner* — select your destinations, travel style, and duration, then let the AI generate a complete trip plan for you!`;
    }

    // Trekking related responses
    if (input.includes('trek') || input.includes('hiking') || input.includes('everest') || input.includes('annapurna') || input.includes('langtang') || input.includes('poon hill') || input.includes('manaslu') || input.includes('mustang')) {
      return `🏔️ **Popular Nepal Treks:**

| Trek | Duration | Difficulty | Max Altitude |
|------|----------|------------|--------------|
| Everest Base Camp | 12-14 days | Hard | 5,364m |
| Annapurna Circuit | 15-20 days | Moderate-Hard | 5,416m |
| Annapurna Base Camp | 9-12 days | Moderate | 4,130m |
| Langtang Valley | 7-10 days | Moderate | 3,870m |
| Ghorepani Poon Hill | 3-5 days | Easy | 3,210m |
| Manaslu Circuit | 14-17 days | Hard | 5,160m |

📋 **Permits required:**
• TIMS Card (NPR 2,000)
• National Park/Conservation Area entry fees
• Restricted area permits (Mustang, Manaslu, etc.)

🗓️ **Best seasons:** Spring (Mar–May) & Autumn (Sep–Nov)
💡 **Tip:** Hire a licensed local guide — it supports the community and keeps you safe.`;
    }

    // Cultural sites and temples
    if (input.includes('culture') || input.includes('temple') || input.includes('kathmandu') || input.includes('bhaktapur') || input.includes('patan') || input.includes('durbar') || input.includes('stupa') || input.includes('heritage')) {
      return `🏛️ **Top Cultural Sites in Nepal:**

**Kathmandu Valley (UNESCO Heritage):**
• Kathmandu Durbar Square — Ancient royal palace complex
• Bhaktapur Durbar Square — Best-preserved medieval town
• Patan Durbar Square — Newari art & architecture
• Swayambhunath (Monkey Temple) — Buddhist hilltop stupa
• Boudhanath Stupa — Largest stupa in Nepal, Tibetan Buddhist hub
• Pashupatinath Temple — Sacred Hindu cremation site (Hindu-only entry)

**Beyond the Valley:**
• Lumbini — Birthplace of Siddhartha Gautama (Buddha)
• Changu Narayan — Oldest temple in the valley (5th century)
• Manakamana — Goddess temple, accessible by cable car
• Muktinath — Sacred to both Hindus and Buddhists (Mustang)

🕐 **Best time to visit:** Oct–Mar for clear skies
💡 **Dress modestly** when entering temples — cover shoulders and knees.`;
    }

    // Food and cuisine
    if (input.includes('food') || input.includes('cuisine') || input.includes('dal bhat') || input.includes('momo') || input.includes('eat') || input.includes('restaurant') || input.includes('drink') || input.includes('thukpa')) {
      return `🍜 **Must-Try Nepali Food & Drinks:**

**Staples:**
• **Dal Bhat** — Lentil soup + rice + vegetables. Unlimited refills on treks! 🏆
• **Momos** — Steamed/fried dumplings, Nepal's #1 street food
• **Thukpa** — Hearty Tibetan noodle soup, perfect in mountains

**Newari Specialties (Kathmandu Valley):**
• **Chatamari** — Rice crepe with toppings ("Nepali pizza")
• **Juju Dhau** — Bhaktapur's famous sweet curd (king yogurt)
• **Kwati** — 9-bean soup, festival food

**Snacks & Sweets:**
• **Sel Roti** — Crispy rice donuts, festival staple
• **Yomari** — Sweet steamed dumpling, Newari festival food
• **Gundruk** — Fermented leafy greens, tangy and earthy

**Drinks:**
• **Chiya** — Spiced Nepali milk tea (better than chai!)
• **Tongba** — Millet beer in bamboo pot, eastern Nepal tradition
• **Raksi** — Traditional distilled spirit

🏨 Use **SubhaYatra's Restaurant Search** to find top-rated dining near your destination!`;
    }

    // Travel planning and tips
    if (input.includes('plan') || input.includes('itinerary') || input.includes('budget') || input.includes('visa') || input.includes('travel') || input.includes('trip') || input.includes('tourist')) {
      return `🎒 **Nepal Travel Basics:**

**Visa:**
• On arrival at Kathmandu (TIA): 15-day ${usd(30)}, 30-day ${usd(50)}, 90-day ${usd(125)}
• Free for Indian nationals
• Apply online at: immigration.gov.np

**Best Time to Visit:**
• 🌸 Spring (Mar–May): Rhododendrons, clear views, trekking
• 🍂 Autumn (Sep–Nov): Peak season, Dashain & Tihar festivals
• ❄️ Winter (Dec–Feb): Good for Kathmandu, Chitwan, Lumbini
• 🌧️ Monsoon (Jun–Aug): Lush, fewer crowds, avoid high treks

**Daily Budget:**
| Style | Accommodation | Food | Total/day |
|-------|--------------|------|-----------|
| Budget | ${usd(8)}–${usd(15)} | ${usd(5)}–${usd(10)} | ~${usd(25)}–${usd(35)} |
| Mid-range | ${usd(25)}–${usd(60)} | ${usd(15)}–${usd(25)} | ~${usd(50)}–${usd(80)} |
| Luxury | ${usd(100)}+ | ${usd(30)}+ | ${usd(150)}+ |

**Sample 7-Day Itinerary:**
• Days 1–2: Kathmandu Valley heritage tour
• Days 3–4: Fly to Pokhara, Phewa Lake, Sarangkot sunrise
• Day 5: Pokhara adventure (paragliding/boating)
• Days 6–7: Chitwan National Park jungle safari

💡 **Use SubhaYatra's Itinerary Planner** to build your personalized trip!`;
    }

    // Accommodation
    if (input.includes('hotel') || input.includes('accommodation') || input.includes('stay') || input.includes('lodge') || input.includes('guesthouse') || input.includes('hostel')) {
      return `🏨 **Nepal Accommodation Guide:**

**Cities (Kathmandu, Pokhara, Chitwan):**
• Budget guesthouses/hostels: ${usd(8)}–${usd(20)}/night
• Mid-range boutique hotels: ${usd(30)}–${usd(80)}/night
• Luxury heritage/5-star hotels: ${usd(100)}–${usd(300)}+/night
• Popular areas: Thamel (KTM), Lakeside (Pokhara)

**Trekking Routes:**
• Tea houses: ${usd(5)}–${usd(15)}/night (basic rooms, included meals optional)
• Mountain lodges: ${usd(10)}–${usd(25)}/night (better facilities)
• Homestays: ${usd(10)}–${usd(20)}/night (authentic local experience)

**Note:** During peak season (Oct–Nov, Mar–Apr) book at least 2–3 months ahead in popular spots!

🔍 **Search hotels on SubhaYatra** — filter by location, price, and rating to find the perfect fit.`;
    }

    // Festivals and events
    if (input.includes('festival') || input.includes('dashain') || input.includes('tihar') || input.includes('holi') || input.includes('indra jatra') || input.includes('bisket') || input.includes('buddha jayanti') || input.includes('celebration')) {
      return `🎭 **Major Nepal Festivals (Nepali Calendar):**

| Festival | BS Month | Highlights |
|----------|----------|------------|
| Bisket Jatra | Baisakh 1 | Nepali New Year — chariot festival in Bhaktapur |
| Buddha Jayanti | Baisakh 15 | Buddha's birthday — Lumbini & Boudhanath |
| Indra Jatra | Bhadra/Ashwin | Kumari chariot procession in Kathmandu |
| Dashain | Ashwin | Biggest festival — tika, blessings, kite flying (15 days) |
| Tihar | Kartik | Festival of lights — Laxmi puja, Bhai Tika, Deusi |
| Chhath | Kartik | Sun worship — spectacular riverside gatherings |
| Yomari Punhi | Mangsir | Newari harvest festival with sweet dumplings |
| Magh Sankranti | Magh 1 | Tharu festival & winter bathing in holy rivers |
| Shiva Ratri | Falgun | Night of Shiva — massive gathering at Pashupatinath |
| Holi | Falgun | Festival of colors |
| Ghode Jatra | Chaitra | Horse parade at Tundikhel, Kathmandu |

📅 **Check SubhaYatra's Festival Calendar** for upcoming events in BS dates!`;
    }

    // Weather and seasons
    if (input.includes('weather') || input.includes('climate') || input.includes('season') || input.includes('temperature') || input.includes('monsoon') || input.includes('rain')) {
      return `🌤️ **Nepal Weather by Season:**

| Season | BS Months | Temp (KTM) | Trekking |
|--------|-----------|-----------|---------|
| Spring | Baisakh–Jestha (Apr–May) | 15–28°C | ✅ Excellent |
| Pre-Monsoon | Jestha–Ashadh (May–Jun) | 20–30°C | ⚠️ Getting wet |
| Monsoon | Ashadh–Bhadra (Jun–Sep) | 22–30°C | ❌ Avoid high treks |
| Autumn | Ashwin–Kartik (Sep–Nov) | 10–25°C | ✅ Best season |
| Winter | Mangsir–Falgun (Nov–Feb) | 2–18°C | ⚠️ Cold at altitude |

🌸 **Spring highlights:** Rhododendrons blooming, clear mountain views
🍂 **Autumn highlights:** Best visibility, Dashain & Tihar festivals
❄️ **Winter note:** Great for Kathmandu, Chitwan, Lumbini; snow blocks high passes

**Pack:** Layers for temperature swings, rain gear in monsoon, sunscreen always!`;
    }

    // Regions / provinces
    if (input.includes('province') || input.includes('region') || input.includes('pokhara') || input.includes('chitwan') || input.includes('lumbini') || input.includes('mustang') || input.includes('ilam') || input.includes('rara')) {
      return `🗺️ **Nepal's Key Regions:**

**Bagmati Province (Central):**
• Kathmandu Valley — heritage, culture, gateway to Nepal
• Namobuddha, Dhulikhel, Bandipur

**Gandaki Province (West-Central):**
• Pokhara — adventure capital, Phewa Lake, paragliding
• Annapurna & Manaslu trek regions, Mustang

**Madhesh Province (Southern Terai):**
• Janakpur — birthplace of Sita, Janaki Temple
• Birgunj — major India-Nepal border crossing

**Lumbini Province (Southwest):**
• Lumbini — birthplace of Buddha 🌿
• Bardia National Park — remote wildlife safari

**Sudurpashchim Province (Far West):**
• Rara Lake — most remote, pristine beauty
• Api Nampa Conservation Area

**Koshi Province (East):**
• Ilam — rolling tea gardens
• Taplejung — Kanchenjunga trek base

💡 Use **SubhaYatra's Explore section** to browse destinations in each region!`;
    }

    // Default response for general or unrecognized queries
    return `🗺️ **SubhaYatra — Nepal Travel Assistant**

I can help you with:

🏔️ **Trekking** — Routes, permits, packing lists, guides
🏛️ **Culture & Heritage** — Temples, UNESCO sites, Newari art
🍜 **Food** — Local dishes, restaurants, tea house culture
🎭 **Festivals** — Nepali BS calendar, Dashain, Tihar and more
🎒 **Trip Planning** — Visas, budgets, best seasons, safety
🏨 **Accommodation** — Hotels, lodges, tea houses, homestays
📱 **App Features** — Itinerary Planner, Explore, Festival Calendar

💡 *Try asking: "Plan a 7-day trip to Nepal", "Best treks for beginners", or "What festivals are in Dashain?"*`;
  };

  // Smart Mode response - Shows statistics but no database access
  const getSmartModeResponse = (userInput) => {
    const input = userInput.toLowerCase();
    const sym = CURRENCY_SYMBOLS[currency];
    const r = CURRENCY_RATES[currency];
    const usd = (amount) => {
      const converted = Math.round(amount * r);
      return `${sym}${currency === 'USD' ? amount : converted.toLocaleString()}`;
    };
    
    // Check for greetings
    const greetings = ['hi', 'hello', 'hey', 'namaste', 'good morning', 'good afternoon', 'good evening'];
    const isGreeting = greetings.some(greeting => input.includes(greeting));
    
    if (isGreeting) {
      return `🙏 **Namaste! Welcome to SubhaYatra!**

I'm your Nepal travel assistant, currently running in **Smart Mode**.

**📊 SubhaYatra Database:**
• 🗺️ **1,057 Destinations** — Verified places across all 7 provinces
• 🏨 **718 Hotels** — Budget guesthouses to 5-star luxury
• 🍜 **512 Restaurants** — Authentic Nepali, Newari, and international cuisine
• 🎭 **805 Events** — Cultural festivals and seasonal activities

**What I can help with right now:**
• General Nepal travel tips and planning advice
• Trek routes, permits, and best seasons
• Cultural insights, festivals, and food
• Itinerary ideas and budget guidance
• SubhaYatra app features and how to use them

What would you like to know about Nepal?`;
    }
    
    // Check for database/statistics queries
    const statsKeywords = ['how many', 'total', 'count', 'database', 'data', 'statistics', 'stats'];
    const isStatsQuery = statsKeywords.some(keyword => input.includes(keyword));
    
    if (isStatsQuery) {
      return `**📊 SubhaYatra Database Overview:**

**🗺️ Destinations: 1,057 verified locations**
• Coverage: All 7 provinces of Nepal
• Categories: Natural attractions, cultural sites, trekking routes, adventure spots, religious sites

**🏨 Accommodations: 718 properties**
• Range: Budget guesthouses (${usd(8)}/night) to luxury resorts (${usd(300)}+/night)
• Ratings: 2.5–5.0 stars
• Locations: Cities, trekking routes, and rural areas

**🍜 Restaurants: 512 establishments**
• Cuisines: Nepali, Newari, Tibetan, Indian, Chinese, Continental
• Price range: ${usd(2)}–${usd(40)} per meal
• Includes: Tea houses, rooftop restaurants, local daal bhat places

**🎭 Events: 805 cultural activities**
• Major festivals: Dashain, Tihar, Indra Jatra, Bisket Jatra, Holi, and more
• Coverage: Year-round BS calendar events
• Includes: Religious ceremonies, cultural shows, seasonal activities

*For detailed information on specific places, hotels, or restaurants, Active Mode (Cohere AI) gives you live database access.*`;
    }

    // SubhaYatra app questions
    if (input.includes('subhayatra') || input.includes('app') || input.includes('feature') || input.includes('itinerary') || input.includes('planner')) {
      return `📱 **SubhaYatra Features:**

• **Itinerary Planner** — Select destinations, duration, budget & travel style → AI generates a full trip plan
• **Explore Nepal** — Browse 1,057+ destinations with photos, descriptions, and ratings
• **Famous Spots** — Curated highlights across Nepal's regions
• **Festival Calendar** — BS calendar with upcoming Nepali festivals and events
• **Hotel & Restaurant Search** — Filter by location, price, and reviews
• **AI Assistant (me!)** — Nepal travel advice, trip planning, cultural info
• **User Accounts** — Save itineraries and bookmark favorites

💡 **Quick start:** Go to the *Itinerary Planner*, pick your destinations, set your preferences, and let the AI generate a personalized Nepal trip!`;
    }

    // Fallback to keyword travel responses
    return getNepalTravelResponse(userInput);
  };

  // Delete chat
  const deleteChat = async (chatId) => {
    if (!confirm('Are you sure you want to delete this chat? This action cannot be undone.')) {
      return;
    }
    
    try {
      await chatService.deleteChat(chatId);
      
      // If deleted chat was current, clear messages
      if (currentChatId === chatId) {
        setCurrentChatId(null);
        setMessages([]);
      }
      
      // Refresh chat history
      await loadChatHistory();
      
      console.log('✅ Chat deleted successfully');
    } catch (error) {
      console.error('Error deleting chat:', error);
      alert('Failed to delete chat. Please try again.');
    }
  };

  // Clear all chat history
  const clearAllChats = async () => {
    if (!user?.id) return;
    
    if (!confirm('Are you sure you want to delete ALL chat history? This action cannot be undone.')) {
      return;
    }
    
    try {
      // Delete all chats one by one
      for (const chat of chatHistory) {
        await chatService.deleteChat(chat.id);
      }
      
      // Clear current chat
      setCurrentChatId(null);
      setMessages([]);
      
      // Refresh chat history
      await loadChatHistory();
      
      console.log('✅ All chats cleared successfully');
    } catch (error) {
      console.error('Error clearing all chats:', error);
      alert('Failed to clear all chats. Please try again.');
    }
  };

  // Clear all search history
  const clearAllSearchHistory = async () => {
    if (!user?.id) return;
    
    if (!confirm('Are you sure you want to delete ALL search history? This action cannot be undone.')) {
      return;
    }
    
    try {
      await chatService.clearSearchHistory(user.id);
      
      // Refresh search history
      await loadSearchHistory();
      
      console.log('✅ All search history cleared successfully');
    } catch (error) {
      console.error('Error clearing search history:', error);
      alert('Failed to clear search history. Please try again.');
    }
  };

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    setInput("");
    setIsTyping(true);

    // Create new chat if none exists and get the chat ID to use
    let chatIdToUse = currentChatId;
    if (!chatIdToUse && user?.id) {
      try {
        const newChat = await chatService.createChat(user.id, userText.length > 30 ? userText.substring(0, 27) + "..." : userText);
        chatIdToUse = newChat.chat_id;
        setCurrentChatId(chatIdToUse);
        // Refresh sidebar so the new chat appears immediately
        await loadChatHistory();
        console.log('✅ New chat created with ID:', chatIdToUse);
      } catch (error) {
        console.error('❌ Error creating chat:', error);
      }
    }

    // Add user message to UI immediately
    const userMessage = { 
      sender: "user", 
      content: userText, 
      timestamp: new Date().toISOString(),
      id: Date.now()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      let botResponse;

      // Only try backend API if in Active Mode (aiStatus === 'ready')
      if (chatIdToUse && user?.id && aiStatus === 'ready') {
        try {
          const response = await chatService.sendMessage(chatIdToUse, userText, user.id);
          botResponse = response.reply;
          
          // Refresh chat history and search history
          await loadChatHistory();
          await loadSearchHistory();
          
          console.log('✅ Message sent via backend API (Active Mode)');
        } catch (apiError) {
          console.warn('⚠️ Backend API failed, falling back to local AI:', apiError);
          // Fall through to local AI processing
        }
      }

      // Fallback to local AI processing if backend failed or not available
      if (!botResponse) {
        if (aiStatus === 'ready' && cohereAI) {
          // Active Mode - Use Cohere AI for detailed responses
          try {
            console.log('🤖 Using Cohere AI for response...');
            const response = await cohereAI.chat({
              message: userText,
              model: "command-r7b-12-2024",
              preamble: `You are SubhaYatra's AI travel assistant — an expert guide for Nepal travel. SubhaYatra is a Nepal travel platform that helps users discover destinations, plan itineraries, find hotels and restaurants, explore cultural festivals, and book trips across Nepal.

## About SubhaYatra
- The platform covers 1,057+ verified destinations, 718+ hotels, 512+ restaurants, and 805+ cultural events across all 7 provinces of Nepal.
- Users can: explore famous spots, plan custom itineraries, view Nepali calendar festivals, get recommendations based on their travel style, and chat with you for personalized advice.
- The app uses Nepali culture deeply — featuring Nepali calendar (BS dates), festivals like Dashain, Tihar, Indra Jatra, Bisket Jatra, and regional food, art, and traditions.

## Nepal Context
- Nepal sits between India and China in South Asia, home to 8 of the world's 14 highest peaks including Mt. Everest (8,849m).
- Capital: Kathmandu. Major cities: Pokhara, Chitwan, Lumbini, Janakpur, Biratnagar.
- Official language: Nepali. Religion: Hinduism (majority), Buddhism, others.
- Currency: Nepali Rupee (NPR). Approx. 1 USD ≈ 133 NPR.
- Time Zone: UTC+5:45 (unique 45-minute offset).
- Nepal uses the Bikram Sambat (BS) calendar — currently BS 2083 (2026 AD). Months: Baisakh, Jestha, Ashadh, Shrawan, Bhadra, Ashwin, Kartik, Mangsir, Poush, Magh, Falgun, Chaitra.

## Key Destinations
- **Kathmandu Valley**: Pashupatinath, Boudhanath Stupa, Swayambhunath, Kathmandu/Patan/Bhaktapur Durbar Squares, Garden of Dreams, Thamel, Asan Bazaar.
- **Pokhara**: Phewa Lake, Sarangkot, World Peace Pagoda, Devi's Fall, Davis Fall, Begnas Lake, Barahi Temple, International Mountain Museum.
- **Chitwan**: Chitwan National Park (UNESCO), elephant safaris, jungle walks, tharu cultural shows, birdwatching, river rafting on Rapti.
- **Lumbini**: Birthplace of Buddha, Maya Devi Temple, Ashoka Pillar, international monasteries.
- **Mustang**: Lo Manthang walled city, ancient caves, Tibetan culture, apple orchards (restricted area permit required).
- **Bandipur**: Hilltop newari town, panoramic Himalayan views.
- **Ilam**: Tea gardens, rolling hills, sunrise viewpoints in eastern Nepal.
- **Rara Lake**: Remote, pristine, largest lake in Nepal (Karnali province).

## Major Treks
- **Everest Base Camp (EBC)**: 12-14 days from Lukla, altitude 5,364m, permit: Sagarmatha NP + TIMS.
- **Annapurna Circuit**: 15-20 days, 160-230 km, crosses Thorong La pass (5,416m).
- **Annapurna Base Camp (ABC)**: 9-12 days, moderate, good for beginners.
- **Langtang Valley**: 7-10 days, closest major trek to Kathmandu.
- **Ghorepani Poon Hill**: 3-5 days, beginner-friendly, sunrise Himalayan panorama.
- **Manaslu Circuit**: 14-17 days, remote, restricted area permit required.
- **Upper Mustang**: 12-15 days, arid Tibetan-like landscape.
- **Permits needed**: TIMS card (NPR 2,000), National Park entry fees, and restricted area permits where applicable.

## Best Times to Visit
- **Spring (Baisakh–Jestha / Mar–May)**: Best for trekking, rhododendrons in bloom, clear mountain views.
- **Autumn (Ashwin–Mangsir / Sep–Nov)**: Peak season, best visibility, festivals (Dashain, Tihar).
- **Winter (Poush–Magh / Dec–Feb)**: Cold in mountains but good for Kathmandu/Chitwan/Lumbini. Clear skies.
- **Monsoon (Ashadh–Bhadra / Jun–Aug)**: Heavy rain, leeches on trails, but lush greenery and fewer crowds.

## Festivals (Nepali Calendar)
- **Dashain** (Ashwin): Biggest Hindu festival, 15 days, tika ceremony, kite flying.
- **Tihar** (Kartik): Festival of lights, Laxmi puja, Deusi-Bhailo, Bhai Tika.
- **Holi** (Falgun): Festival of colors.
- **Indra Jatra** (Bhadra/Ashwin): Kumari jatra in Kathmandu, chariot processions.
- **Bisket Jatra** (Baisakh 1): Nepali New Year celebrated in Bhaktapur.
- **Buddha Jayanti** (Baisakh 15): Buddha's birthday, celebrated in Lumbini & Boudhanath.
- **Krishna Janmashtami** (Bhadra): Celebrated at Patan's Krishna Mandir.
- **Ghode Jatra** (Chaitra): Horse parade at Tundikhel, Kathmandu.
- **Magh Sankranti** (Magh 1): Winter festival, tharu celebrations in Chitwan/Bardia.

## Food & Cuisine
- **Dal Bhat**: National dish — lentil soup, rice, vegetables, pickle. Unlimited refills in trekking lodges.
- **Momos**: Steamed or fried dumplings, most popular street food.
- **Thukpa**: Tibetan noodle soup, common in mountain regions.
- **Sel Roti**: Crispy rice donut, festival staple.
- **Gundruk**: Fermented leafy greens, tangy flavor.
- **Chatamari**: Newari rice crepe, often called "Nepali pizza."
- **Kwati**: Mixed bean soup, eaten during Janai Purnima.
- **Juju Dhau**: Bhaktapur's famous king curd (yogurt), must-try.
- **Tongba**: Millet beer from a bamboo container, popular in eastern Nepal and trekking areas.
- **Local tip**: Always eat with the right hand; try tea houses (bhatti) for authentic local meals.

## Travel Logistics
- **Visa**: On arrival at Tribhuvan International Airport (KTM). 15-day: $30, 30-day: $50, 90-day: $125. Free for Indian nationals.
- **Entry**: Tribhuvan International Airport (Kathmandu) is the main international gateway.
- **Internal transport**: Domestic flights (Yeti Air, Buddha Air, Shree Airlines), local buses, tourist buses, jeeps, motorcycles.
- **Budget**: $20-35/day (budget), $40-70/day (mid-range), $100+/day (luxury).
- **Safety**: Generally safe; altitude sickness is a real concern above 3,000m — acclimatize properly.
- **Health**: Drink bottled/treated water, be careful with street food hygiene, carry basic medicines.
- **Mobile**: Ncell and NTC SIM cards available at airport; good 4G coverage in cities, patchy in mountains.

## SubhaYatra App Features (reference for feature-related questions)
- **Itinerary Planner**: Build day-by-day custom itineraries, select destinations, set budget & travel style, generate AI plans.
- **Explore Section**: Browse all destinations with photos, descriptions, ratings, and map info.
- **Famous Spots**: Highlighted top attractions across Nepal.
- **Festival Calendar**: Nepali BS calendar showing upcoming festivals and cultural events.
- **Hotel & Restaurant Search**: Filter by location, budget, cuisine, and ratings.
- **User Accounts**: Save itineraries, bookmark favorites, track past trips (via Clerk auth).
- **Recommendations**: Personalized destination suggestions based on user preferences.

## Behavior Guidelines
- Be warm, conversational, and enthusiastic about Nepal — it's an extraordinary country.
- When a user asks about a specific place, give practical visitor info: how to get there, what to see, best time, tips.
- When helping plan a trip, ask clarifying questions (duration, budget, interests, fitness level).
- Suggest SubhaYatra features naturally when relevant — e.g., "You can plan this route in SubhaYatra's Itinerary Planner."
- Use both Nepali cultural terms and English for better context (e.g., "Dashain — Nepal's biggest festival").
- Format answers clearly with headers, bullets, and emojis where helpful.
- If asked about app bugs, limitations, or account issues, acknowledge and suggest contacting support.
- Never make up specific prices, dates, or flight schedules — qualify uncertain info.
- The user's preferred currency is **${currency}** (symbol: ${CURRENCY_SYMBOLS[currency]}). When mentioning any prices or costs, always express them in ${currency} using the symbol ${CURRENCY_SYMBOLS[currency]}. Conversion: 1 USD = 133 NPR = 83 INR.`,
            });
            botResponse = response.text;
            console.log('✅ Cohere AI response generated');
          } catch (error) {
            console.error('❌ Cohere AI error:', error);
            botResponse = getNepalTravelResponse(userText);
          }
          console.log('✅ Using AI response (Active Mode)');
        } else {
          // Smart Mode (fallback) - Shows statistics but no database access
          botResponse = getSmartModeResponse(userText);
          console.log('⚠️ Smart Mode: Statistics only, no database access');
        }

        // Try to save messages to backend even when using local AI
        if (user?.id && chatIdToUse) {
          try {
            // Save the conversation to backend
            const saveResponse = await fetch(`${chatService.API_BASE_URL || 'http://localhost:8000/api/chat'}/save-local`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                chat_id: chatIdToUse,
                user_id: user.id,
                user_message: userText,
                bot_response: botResponse
              })
            });
            
            if (!saveResponse.ok) {
              throw new Error(`Failed to save messages: ${saveResponse.statusText}`);
            }
            
            // Save to search history
            await chatService.saveSearchHistory(
              user.id, 
              userText, 
              chatIdToUse, 
              botResponse.length > 200 ? botResponse.substring(0, 197) + "..." : botResponse
            );
            
            // Refresh histories
            await loadChatHistory();
            await loadSearchHistory();
            
            console.log('✅ Messages saved to backend successfully');
          } catch (error) {
            console.error('⚠️ Error saving to backend, messages will be lost on refresh:', error);
            // Continue anyway - at least show the messages in UI
          }
        } else {
          console.warn('⚠️ Cannot save messages: missing user ID or chat ID');
        }
      }

      const botMessage = {
        sender: "bot",
        content: botResponse,
        timestamp: new Date().toISOString(),
        id: Date.now() + 1
      };
      
      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error('❌ Error generating AI response:', error);
      
      // Fallback to keyword-based response on error
      const fallbackResponse = getNepalTravelResponse(userText);
      
      const botMessage = {
        sender: "bot",
        content: fallbackResponse,
        timestamp: new Date().toISOString(),
        id: Date.now() + 1,
        isError: true
      };
      
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen text-white flex flex-col relative chat-page-container">
      {/* Homepage-style Background */}
      <div className="fixed inset-0 w-full h-full z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900"></div>
        
        {/* Animated gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-tr from-navy-700/30 via-transparent to-navy-700/30 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-success/20 to-transparent"></div>
        
        {/* Nepal map background */}
        <div 
          className="absolute inset-0 opacity-45 bg-center bg-no-repeat bg-contain mix-blend-overlay"
          style={{
            backgroundImage: `url('/client/src/assets/nepal.jpg')`,
            filter: 'brightness(0.6) contrast(1.2)'
          }}
        ></div>
        
        {/* Animated particles/dots */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-navy-500/30 rounded-full animate-ping"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-navy-100/40 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-success-bg/20 rounded-full animate-bounce"></div>
        </div>
      </div>

      {/* Content Container - Above Background */}
      <div className="relative z-10 flex flex-col h-screen overflow-hidden pt-16">
        <Header />

        {/* Full Page Chat Layout - Fixed Height */}
        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Sidebar */}
          <div className={`${
            sidebarCollapsed ? 'w-20' : 'w-80'
          } transition-all duration-300 bg-navy-900/80 backdrop-blur-2xl border-r border-navy-700/30 flex flex-col shadow-2xl`}>
            
            {/* Sidebar Header */}
            <div className="p-5 border-b border-navy-700/30 bg-gradient-to-br from-navy-800/50 to-navy-900/50">
              <div className="flex items-center justify-between">
                {!sidebarCollapsed && (
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-gradient-to-br from-navy-600/20 to-navy-700/20 rounded-xl backdrop-blur-sm border border-navy-500/20 shadow-lg">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white tracking-tight">AI Assistant</h2>
                      <p className="text-xs text-slate-400 font-medium">Nepal Travel Expert</p>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-2.5 rounded-xl hover:bg-navy-700/50 text-slate-400 hover:text-white transition-all duration-200 hover:scale-105"
                  title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                  <svg className={`w-5 h-5 transition-transform duration-300 ${
                    sidebarCollapsed ? 'rotate-180' : ''
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {!sidebarCollapsed && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Action Buttons */}
                <div className="p-4 space-y-3 border-b border-navy-700/30">
                  <button
                    onClick={createNewChat}
                    className="w-full p-4 rounded-xl font-semibold bg-gradient-to-r from-navy-600 to-navy-700 hover:from-navy-700 hover:to-navy-700 text-white shadow-xl hover:shadow-2xl hover:shadow-teal-500/20 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>New Conversation</span>
                  </button>

                  {/* AI Status Indicator */}
                  <div className="p-3.5 rounded-xl bg-navy-800/60 border border-navy-700/40 backdrop-blur-sm shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        aiStatus === 'ready' ? 'bg-green-500 animate-pulse shadow-lg shadow-green-500/50' :
                        aiStatus === 'fallback' ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50' :
                        aiStatus === 'initializing' ? 'bg-blue-500 animate-spin' :
                        'bg-red-500 shadow-lg shadow-red-500/50'
                      }`}></div>
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-300 font-medium">
                          {aiStatus === 'ready' ? 'Active Mode' :
                           aiStatus === 'fallback' ? 'Smart Mode' :
                           aiStatus === 'initializing' ? 'Starting...' :
                           'Offline'}
                        </span>
                        {aiStatus === 'ready' && (
                          <span className="text-xs text-slate-400">
                            🚀 Cohere AI
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* History Toggle Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowSearchHistory(false)}
                      className={`flex-1 p-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        !showSearchHistory 
                          ? 'bg-gradient-to-r from-navy-600/20 to-navy-700/20 text-amber-300 border border-navy-500/40 shadow-lg' 
                          : 'bg-navy-800/40 text-slate-400 hover:bg-navy-700/40 hover:text-slate-300 border border-navy-700/30'
                      }`}
                    >
                      💬 Chats
                    </button>
                    <button
                      onClick={() => setShowSearchHistory(true)}
                      className={`flex-1 p-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        showSearchHistory 
                          ? 'bg-gradient-to-r from-navy-600/20 to-navy-700/20 text-amber-300 border border-navy-500/40 shadow-lg' 
                          : 'bg-navy-800/40 text-slate-400 hover:bg-navy-700/40 hover:text-slate-300 border border-navy-700/30'
                      }`}
                    >
                      🔍 History
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="p-4 border-b border-navy-700/30">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={showSearchHistory ? "Search history..." : "Search chats..."}
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (!showSearchHistory) {
                          searchChats(e.target.value);
                        }
                      }}
                      className="w-full p-3 pl-10 rounded-xl bg-navy-800/60 border border-navy-700/40 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-500/30 focus:border-navy-500/50 transition-all duration-200 shadow-inner"
                    />
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto">
                  {!showSearchHistory ? (
                    /* Chat History */
                    <div className="p-4">
                      {/* Clear All Button */}
                      {chatHistory.length > 0 && (
                        <div className="mb-3 flex justify-between items-center">
                          <span className="text-xs text-slate-400 font-medium">
                            {chatHistory.length} {chatHistory.length === 1 ? 'Chat' : 'Chats'}
                          </span>
                          <button
                            onClick={clearAllChats}
                            className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2 py-1 rounded transition-colors"
                          >
                            Clear All
                          </button>
                        </div>
                      )}
                      
                      {loadingHistory ? (
                        <div className="text-center py-8">
                          <div className="animate-spin w-6 h-6 border-2 border-navy-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                          <p className="text-sm text-slate-400">Loading chats...</p>
                        </div>
                      ) : chatHistory.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="w-12 h-12 bg-navy-700/50 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <span className="text-2xl">💬</span>
                          </div>
                          <p className="text-sm text-slate-400">No chat history yet</p>
                          <p className="text-xs text-slate-500 mt-1">Start a conversation to see it here</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {chatHistory.map((chat) => (
                            <button
                              key={chat.id}
                              onClick={() => loadChatMessages(chat.id)}
                              className={`w-full p-3 rounded-lg text-left transition-all duration-200 group ${
                                currentChatId === chat.id
                                  ? 'bg-navy-600/20 border border-navy-500/30 text-amber-200'
                                  : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-transparent hover:border-slate-200/20'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-sm truncate mb-1">
                                    {chat.title}
                                  </h4>
                                  <div className="flex items-center space-x-2 text-xs opacity-70">
                                    <span>{chat.message_count} messages</span>
                                    <span>•</span>
                                    <span>{chatService.getTimeAgo(chat.updated_at)}</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteChat(chat.id);
                                    }}
                                    className="p-1 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300"
                                    title="Delete chat"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Search History */
                    <div className="p-4">
                      {/* Clear All Button */}
                      {searchHistory.length > 0 && (
                        <div className="mb-3 flex justify-between items-center">
                          <span className="text-xs text-slate-400 font-medium">
                            {searchHistory.length} {searchHistory.length === 1 ? 'Search' : 'Searches'}
                          </span>
                          <button
                            onClick={clearAllSearchHistory}
                            className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2 py-1 rounded transition-colors"
                          >
                            Clear All
                          </button>
                        </div>
                      )}
                      
                      {searchHistory.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="w-12 h-12 bg-navy-700/50 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <span className="text-2xl">🔍</span>
                          </div>
                          <p className="text-sm text-slate-400">No search history yet</p>
                          <p className="text-xs text-slate-500 mt-1">Your searches will appear here</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {searchHistory
                            .filter(search => 
                              !searchQuery || 
                              search.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (search.response_summary && search.response_summary.toLowerCase().includes(searchQuery.toLowerCase()))
                            )
                            .map((search) => (
                            <div
                              key={search.id}
                              className="p-3 rounded-lg bg-white/5 border border-slate-200/10 hover:bg-white/10 hover:border-slate-200/20 transition-all duration-200 group"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg">{search.icon}</span>
                                  <span className="text-xs px-2 py-1 rounded-full bg-navy-700/50 text-slate-300 capitalize">
                                    {search.query_type}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => toggleFavoriteSearch(search.id)}
                                    className={`p-1 rounded transition-colors ${
                                      search.is_favorite 
                                        ? 'text-yellow-400 hover:text-yellow-300' 
                                        : 'text-slate-400 hover:text-yellow-400'
                                    }`}
                                  >
                                    <svg className="w-3 h-3" fill={search.is_favorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => deleteSearchEntry(search.id)}
                                    className="p-1 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              
                              <button
                                onClick={() => setInput(search.query)}
                                className="w-full text-left"
                              >
                                <p className="text-sm text-white font-medium mb-1 hover:text-amber-300 transition-colors">
                                  {search.shortQuery}
                                </p>
                                {search.shortSummary && (
                                  <p className="text-xs text-slate-400 mb-2 line-clamp-2">
                                    {search.shortSummary}
                                  </p>
                                )}
                                <div className="flex items-center justify-between text-xs text-slate-500">
                                  <span>{search.timeAgo}</span>
                                  {search.is_favorite && (
                                    <span className="text-yellow-400">⭐</span>
                                  )}
                                </div>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick Topics (only show when not in search history mode) */}
                {!showSearchHistory && (
                  <div className="p-4 border-t border-slate-200/20">
                    <h3 className="text-sm font-semibold text-slate-300 mb-2">Quick Topics</h3>
                    <div className="space-y-2">
                      {[
                        { icon: "🏔️", text: "Trekking Routes", query: "What are the best trekking routes in Nepal?" },
                        { icon: "🏛️", text: "Cultural Sites", query: "Tell me about cultural heritage sites in Nepal" },
                        { icon: "🍜", text: "Local Cuisine", query: "What should I eat in Nepal?" },
                        { icon: "🎒", text: "Travel Planning", query: "Help me plan a 10-day trip to Nepal" }
                      ].map((topic, index) => (
                        <button
                          key={index}
                          onClick={() => setInput(topic.query)}
                          className="w-full p-2 rounded-lg text-left bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-slate-200/10 hover:border-slate-200/20 transition-all duration-200 text-sm"
                        >
                          <div className="flex items-center space-x-2">
                            <span>{topic.icon}</span>
                            <span>{topic.text}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-navy-900/30 backdrop-blur-sm">
            {/* Chat Header */}
            <div className="p-6 border-b border-navy-700/50 bg-navy-800/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-navy-600 to-navy-700 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-xl">🤖</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-slate-900 animate-pulse"></div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-black text-white">Nepal Travel Assistant</h1>
                    <p className="text-sm text-slate-400">
                      {isTyping ? 'AI is typing...' : 
                       aiStatus === 'ready' ? 'Active Mode • Cohere AI' :
                       aiStatus === 'fallback' ? 'Smart Mode • Limited responses' :
                       'Initializing...'}
                    </p>
                  </div>
                </div>
                
                {/* AI Status Badge + Currency Toggle */}
                <div className="flex items-center gap-3">
                  {/* Currency Toggle */}
                  {/* <button
                    onClick={cycleCurrency}
                    title="Switch currency: USD → NPR → INR"
                    className="px-3 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition-all duration-200 hover:scale-105"
                  >
                    <span>{CURRENCY_SYMBOLS[currency]}</span>
                    <span>{currency}</span>
                    <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </button> */}

                  {/* AI Status Badge */}
                  <div className={`px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2 ${
                    aiStatus === 'ready' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    aiStatus === 'fallback' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    aiStatus === 'initializing' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      aiStatus === 'ready' ? 'bg-green-500 animate-pulse' :
                      aiStatus === 'fallback' ? 'bg-yellow-500' :
                      aiStatus === 'initializing' ? 'bg-blue-500 animate-spin' :
                      'bg-red-500'
                    }`}></div>
                    <span>
                      {aiStatus === 'ready' ? 'Active Mode' :
                       aiStatus === 'fallback' ? 'Smart Mode' :
                       aiStatus === 'initializing' ? 'Starting...' :
                       'Offline'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 chat-messages-area">
              <div className="max-w-5xl mx-auto space-y-6">
                {messages.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-br from-navy-600/30 to-navy-700/30 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                      <span className="text-5xl">🗺️</span>
                    </div>
                    <h3 className="text-4xl font-black mb-4 text-white">Welcome to Nepal Travel Assistant</h3>
                    <p className="text-xl mb-8 text-slate-300 max-w-2xl mx-auto">
                      {aiStatus === 'ready' ? 
                        'Active Mode with Cohere AI - Ask me anything about Nepal destinations, hotels, restaurants, culture, travel tips, and more!' :
                        'Smart Mode with limited responses - For full AI-powered travel information, please ensure Active Mode is enabled.'}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                      {[
                        { icon: "🏔️", text: "Best trekking routes" },
                        { icon: "🏛️", text: "Cultural sites" },
                        { icon: "🍜", text: "Local cuisine" },
                        { icon: "🎒", text: "Travel planning" }
                      ].map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => setInput(suggestion.text)}
                          className="p-6 rounded-2xl text-center bg-navy-800/50 hover:bg-navy-700/50 text-slate-300 hover:text-white border border-navy-700/50 hover:border-slate-600 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        >
                          <div className="text-4xl mb-3">{suggestion.icon}</div>
                          <span className="text-sm font-semibold">{suggestion.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                        <div className={`flex items-start space-x-3 ${
                          message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}>
                          {/* Avatar */}
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            message.sender === 'user'
                              ? 'bg-gradient-to-br from-blue-500 to-purple-500'
                              : message.isError
                                ? 'bg-gradient-to-br from-red-500 to-pink-500'
                                : 'bg-gradient-to-br from-navy-600 to-navy-700'
                          }`}>
                            <span className="text-white text-sm">
                              {message.sender === 'user' ? '👤' : message.isError ? '⚠️' : '🤖'}
                            </span>
                          </div>

                          {/* Message Bubble */}
                          <div className={`rounded-2xl px-6 py-4 shadow-lg backdrop-blur-sm ${
                            message.sender === 'user'
                              ? 'bg-blue-500/90 text-white'
                              : message.isError
                                ? 'bg-red-500/20 text-red-200 border border-red-400/30'
                                : 'bg-white/10 text-slate-200 border border-slate-200/20'
                          }`}>
                            <div className="prose prose-sm max-w-none text-inherit">
                              <div className="leading-relaxed whitespace-pre-wrap">
                                {message.content.split('\n').map((line, index) => {
                                  // Handle bold text with **text**
                                  if (line.includes('**')) {
                                    const parts = line.split('**');
                                    return (
                                      <div key={index} className="mb-1">
                                        {parts.map((part, partIndex) => 
                                          partIndex % 2 === 1 ? (
                                            <strong key={partIndex} className="font-black text-amber-300">{part}</strong>
                                          ) : (
                                            <span key={partIndex}>{part}</span>
                                          )
                                        )}
                                      </div>
                                    );
                                  }
                                  // Handle bullet points
                                  else if (line.startsWith('• ')) {
                                    return (
                                      <div key={index} className="mb-1 ml-4 flex items-start">
                                        <span className="text-amber-400 mr-2">•</span>
                                        <span>{line.substring(2)}</span>
                                      </div>
                                    );
                                  }
                                  // Handle emoji lines (topics)
                                  else if (line.includes('🏔️') || line.includes('🏛️') || line.includes('🍜') || line.includes('🎒') || line.includes('🏨') || line.includes('🎭') || line.includes('🌤️') || line.includes('🗺️')) {
                                    return (
                                      <div key={index} className="font-bold text-amber-200 mb-2 text-lg">{line}</div>
                                    );
                                  }
                                  // Regular lines
                                  else {
                                    return (
                                      <div key={index} className="mb-1">{line}</div>
                                    );
                                  }
                                })}
                              </div>
                            </div>
                            {message.timestamp && (
                              <div className={`text-xs mt-2 opacity-70 ${
                                message.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
                              }`}>
                                {formatTime(message.timestamp)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-navy-600 to-navy-700 rounded-xl flex items-center justify-center">
                        <span className="text-white text-sm">🤖</span>
                      </div>
                      <div className="rounded-2xl px-6 py-4 bg-white/10 border border-slate-200/20 backdrop-blur-sm shadow-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-navy-600 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-navy-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-navy-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-navy-700/50 bg-navy-800/30">
              <div className="max-w-5xl mx-auto">
                <SignedOut>
                  <div className="text-center p-8 rounded-2xl bg-navy-800/50 border border-navy-700/50">
                    <div className="w-16 h-16 bg-gradient-to-br from-navy-600/30 to-navy-700/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">🔐</span>
                    </div>
                    <h3 className="text-2xl font-black mb-3 text-white">Sign in to start chatting</h3>
                    <p className="text-sm mb-6 text-slate-400">Create an account or sign in to access the AI travel assistant</p>
                    <div className="flex justify-center space-x-4">
                      <SignInButton>
                        <button className="px-6 py-3 bg-gradient-to-r from-navy-600 to-navy-700 hover:from-navy-700 hover:to-navy-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                          Sign In
                        </button>
                      </SignInButton>
                      <button
                        onClick={() => navigate('/sign-up')}
                        className="px-6 py-3 font-semibold rounded-xl border-2 border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white transition-all"
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                </SignedOut>

                <SignedIn>
                  <div className="flex items-end space-x-4">
                    <div className="flex-1">
                      <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                        placeholder="Ask me anything about Nepal..."
                        rows={1}
                        className="w-full p-4 rounded-xl border-0 resize-none focus:outline-none bg-navy-800/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-navy-500/30 backdrop-blur-sm"
                        style={{ minHeight: '56px', maxHeight: '120px' }}
                        onInput={(e) => {
                          e.target.style.height = 'auto';
                          e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                        }}
                      />
                    </div>
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isTyping}
                      className={`p-4 rounded-xl font-semibold transition-all duration-300 ${
                        !input.trim() || isTyping
                          ? 'bg-navy-700/50 text-slate-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-navy-600 to-navy-700 hover:from-navy-700 hover:to-navy-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                      }`}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-slate-400">
                      Press Enter to send, Shift+Enter for new line
                    </div>
                    {/* <button
                      onClick={cycleCurrency}
                      title="Switch currency"
                      className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                    >
                      <span>{CURRENCY_SYMBOLS[currency]}</span>
                      <span>{currency}</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </button> */}
                  </div>
                </SignedIn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}