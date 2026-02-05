import { useState, useEffect, useRef } from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer/Footer";
import { Header } from "../components/header/Header";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function ChatPage() {
  const navigate = useNavigate();
  
  // State management
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [geminiAI, setGeminiAI] = useState(null);
  const [aiStatus, setAiStatus] = useState('initializing'); // 'initializing', 'ready', 'error'

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize Gemini AI
  useEffect(() => {
    const initializeGemini = async () => {
      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        
        console.log('🔍 Debug Info:');
        console.log('- API Key from env:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND');
        console.log('- API Key length:', apiKey ? apiKey.length : 0);
        console.log('- All env vars:', Object.keys(import.meta.env));
        
        if (!apiKey || apiKey === 'your_gemini_api_key_here') {
          console.warn('⚠️ Gemini API key not configured, using fallback responses');
          setAiStatus('fallback');
          return;
        }

        console.log('🔄 Initializing Gemini AI...');
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        // Test the connection with a simple prompt
        console.log('🧪 Testing connection...');
        const testResult = await model.generateContent("Respond with exactly: 'Gemini AI Ready for Nepal Tourism'");
        const testResponse = await testResult.response;
        const responseText = testResponse.text();
        
        console.log('📝 Test response:', responseText);
        
        if (responseText && responseText.includes('Gemini')) {
          setGeminiAI(model);
          setAiStatus('ready');
          console.log('✅ Gemini AI initialized successfully:', responseText);
        } else {
          throw new Error('Invalid response from Gemini AI');
        }
      } catch (error) {
        console.error('❌ Failed to initialize Gemini AI:', error);
        console.error('Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
        setAiStatus('fallback');
      }
    };

    initializeGemini();
  }, []);

  // Simple keyword-based response system for Nepal travel
  const getNepalTravelResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Trekking related responses
    if (input.includes('trek') || input.includes('hiking') || input.includes('everest') || input.includes('annapurna') || input.includes('langtang')) {
      return `🏔️ **Popular Nepal Treks:**

• **Everest Base Camp** - 12-14 days, challenging
• **Annapurna Circuit** - 15-20 days, diverse landscapes  
• **Langtang Valley** - 7-10 days, closer to Kathmandu
• **Ghorepani Poon Hill** - 3-5 days, beginner-friendly

**Best seasons:** Spring (Mar-May) & Autumn (Sep-Nov)
**Tips:** Get TIMS card, hire local guides, pack layers.`;
    }

    // Cultural sites and temples
    if (input.includes('culture') || input.includes('temple') || input.includes('kathmandu') || input.includes('bhaktapur') || input.includes('patan') || input.includes('durbar')) {
      return `🏛️ **Top Cultural Sites:**

• **Kathmandu Durbar Square** - Royal palace complex
• **Bhaktapur Durbar Square** - Medieval architecture
• **Swayambhunath** - Monkey Temple
• **Boudhanath Stupa** - Buddhist pilgrimage site
• **Pashupatinath** - Sacred Hindu temple

**Best time:** Oct-Mar for clear weather.`;
    }

    // Food and cuisine
    if (input.includes('food') || input.includes('cuisine') || input.includes('dal bhat') || input.includes('momo') || input.includes('eat')) {
      return `� **Must-Try Nepali Food:**

• **Dal Bhat** - Rice & lentils (national dish)
• **Momos** - Steamed dumplings
• **Gundruk** - Fermented vegetable soup
• **Thukpa** - Noodle soup
• **Sel Roti** - Traditional rice bread

**Tip:** Always eat with right hand, try local tea houses.`;
    }

    // Travel planning and tips
    if (input.includes('plan') || input.includes('itinerary') || input.includes('budget') || input.includes('visa') || input.includes('travel') || input.includes('trip')) {
      return `🎒 **Nepal Travel Basics:**

**Visa:** Available on arrival ($30-125 depending on duration)
**Best time:** Oct-Nov, Mar-Apr
**Budget:** $20-30/day (budget), $40-70/day (mid-range)

**Sample 7-day trip:**
• Days 1-2: Kathmandu Valley
• Days 3-5: Pokhara & short trek
• Days 6-7: Chitwan National Park`;
    }

    // Accommodation
    if (input.includes('hotel') || input.includes('accommodation') || input.includes('stay') || input.includes('lodge') || input.includes('guesthouse')) {
      return `� **Nepal Accommodation:**

**Cities:** Luxury hotels ($100+), boutique hotels ($50-100), guesthouses ($10-25)
**Trekking:** Tea houses ($5-15), mountain lodges
**Rural:** Homestays ($10-20), community lodges

**Tip:** Book ahead in peak season (Oct-Nov, Mar-Apr).`;
    }

    // Festivals and events
    if (input.includes('festival') || input.includes('celebration') || input.includes('dashain') || input.includes('tihar') || input.includes('holi')) {
      return `🎭 **Major Nepal Festivals:**

• **Dashain** (Sep/Oct) - Biggest festival, 15 days
• **Tihar** (Oct/Nov) - Festival of lights, 5 days
• **Holi** (Mar) - Festival of colors
• **Buddha Jayanti** (May) - Buddha's birthday

**Tip:** Book accommodation early during festivals.`;
    }

    // Weather and seasons
    if (input.includes('weather') || input.includes('climate') || input.includes('season') || input.includes('temperature')) {
      return `�️ **Nepal Weather:**

**Spring (Mar-May):** 15-25°C, clear views, rhododendrons
**Summer (Jun-Sep):** 20-30°C, monsoon rains
**Autumn (Oct-Nov):** 10-20°C, best trekking weather
**Winter (Dec-Feb):** 5-15°C, cold but clear

**Pack:** Layers for temperature changes, rain gear in monsoon.`;
    }

    // Default response for general or unrecognized queries
    return `🗺️ **Nepal Travel Assistant**

I can help you with:

🏔️ **Trekking** - Routes, permits, guides
🏛️ **Culture** - Temples, heritage sites, festivals  
🍜 **Food** - Local dishes and dining
🎒 **Planning** - Visas, budgets, itineraries
🏨 **Stay** - Hotels, lodges, homestays

*What would you like to know about Nepal?*`;
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

    // Add user message
    const userMessage = { 
      sender: "user", 
      content: userText, 
      timestamp: new Date().toISOString(),
      id: Date.now()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      let botResponse;

      if (aiStatus === 'ready' && geminiAI) {
        // Use Gemini AI for intelligent responses
        const prompt = `You are Roamio AI, a concise Nepal tourism assistant for Roamio Wanderly travel platform.

USER QUESTION: "${userText}"

INSTRUCTIONS:
- Give SHORT, direct answers (2-3 sentences max for simple questions)
- Be helpful but concise - don't over-explain
- Use bullet points only when listing multiple items
- Include 1-2 practical tips maximum
- Use emojis sparingly (1-2 per response)
- If it's a complex question requiring detail, keep it under 150 words
- Focus on the most important information first
- Avoid lengthy introductions or conclusions

Provide a brief, helpful response:`;

        console.log('🤖 Generating Gemini AI response...');
        const result = await geminiAI.generateContent(prompt);
        const response = await result.response;
        botResponse = response.text();
        
        console.log('✅ Gemini AI response generated successfully');
      } else {
        // Fallback to keyword-based responses
        botResponse = getNepalTravelResponse(userText);
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
        id: Date.now() + 1
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
    <div className="min-h-screen text-white flex flex-col relative overflow-hidden">
      {/* Homepage-style Background */}
      <div className="fixed inset-0 w-full h-full z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        
        {/* Animated gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-tr from-teal-900/30 via-transparent to-cyan-900/30 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-emerald-900/20 to-transparent"></div>
        
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
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-teal-400/30 rounded-full animate-ping"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-cyan-400/40 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-emerald-400/20 rounded-full animate-bounce"></div>
        </div>
      </div>

      {/* Content Container - Above Background */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <div className="flex flex-1">
          {/* Sidebar */}
          <div className={`${
            sidebarCollapsed ? 'w-16' : 'w-80'
          } transition-all duration-300 bg-white/10 border-slate-200/20 backdrop-blur-xl border-r shadow-lg flex flex-col`}>
            
            {/* Sidebar Header */}
            <div className="p-6 border-b border-slate-200/20">
              <div className="flex items-center justify-between">
                {!sidebarCollapsed && (
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-teal-500/30 to-cyan-500/30 rounded-xl backdrop-blur-sm">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-white">
                        AI Assistant
                      </h2>
                      <p className="text-sm text-slate-300">
                        Nepal Travel Expert
                      </p>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors duration-200"
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
              <div className="p-4 space-y-3">
                <button
                  onClick={() => setMessages([])}
                  className="w-full p-4 rounded-xl font-semibold bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>New Conversation</span>
                </button>

                {/* AI Status Indicator */}
                <div className="p-3 rounded-xl bg-white/10 border border-slate-200/20 backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      aiStatus === 'ready' ? 'bg-green-500 animate-pulse' :
                      aiStatus === 'fallback' ? 'bg-yellow-500' :
                      aiStatus === 'initializing' ? 'bg-blue-500 animate-spin' :
                      'bg-red-500'
                    }`}></div>
                    <span className="text-sm text-slate-300">
                      {aiStatus === 'ready' ? 'AI Ready' :
                       aiStatus === 'fallback' ? 'Smart Mode' :
                       aiStatus === 'initializing' ? 'Starting...' :
                       'Offline'}
                    </span>
                  </div>
                </div>

                {/* Quick Tourism Topics */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-300 mb-2">Quick Topics</h3>
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

                {/* Debug Info */}
                <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-600/30 text-xs text-slate-400">
                  <div>Status: {aiStatus}</div>
                  <div>API Key: {import.meta.env.VITE_GEMINI_API_KEY ? 'Configured' : 'Missing'}</div>
                  <div>AI Object: {geminiAI ? 'Ready' : 'Not Ready'}</div>
                </div>
              </div>
            )}
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-6 border-b border-slate-200/20 bg-white/5 backdrop-blur-xl">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg">🤖</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-800"></div>
                </div>
                <div>
                  <h1 className="text-xl font-black text-white">
                    Nepal Travel Assistant
                  </h1>
                  <p className="text-sm text-slate-300">
                    {isTyping ? 'AI Assistant is typing...' : 
                     aiStatus === 'ready' ? 'Powered by Gemini AI • Ready to help' :
                     aiStatus === 'fallback' ? 'Smart Assistant • Ready to help' :
                     'Initializing AI Assistant...'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-teal-500/30 to-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                      <span className="text-4xl">🗺️</span>
                    </div>
                    <h3 className="text-2xl font-black mb-3 text-white">
                      Welcome to Nepal Travel Assistant
                    </h3>
                    <p className="text-lg mb-6 text-slate-300">
                      {aiStatus === 'ready' ? 
                        'Powered by advanced AI - Ask me anything about Nepal destinations, culture, travel tips, and more!' :
                        'Your intelligent Nepal travel companion - Ask me anything about destinations, culture, travel tips, and more!'
                      }
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                      {[
                        { icon: "🏔️", text: "Best trekking routes in Nepal" },
                        { icon: "🏛️", text: "Cultural sites in Kathmandu" },
                        { icon: "🍜", text: "Traditional Nepali cuisine" },
                        { icon: "🎒", text: "Travel planning tips" }
                      ].map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => setInput(suggestion.text)}
                          className="p-4 rounded-xl text-left bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border border-slate-200/20 hover:scale-105 hover:shadow-lg transition-all duration-200 backdrop-blur-sm"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{suggestion.icon}</span>
                            <span className="font-medium">{suggestion.text}</span>
                          </div>
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
                                : 'bg-gradient-to-br from-teal-500 to-cyan-500'
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
                                            <strong key={partIndex} className="font-black text-teal-300">{part}</strong>
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
                                        <span className="text-teal-400 mr-2">•</span>
                                        <span>{line.substring(2)}</span>
                                      </div>
                                    );
                                  }
                                  // Handle emoji lines (topics)
                                  else if (line.includes('🏔️') || line.includes('🏛️') || line.includes('🍜') || line.includes('🎒') || line.includes('🏨') || line.includes('🎭') || line.includes('🌤️') || line.includes('🗺️')) {
                                    return (
                                      <div key={index} className="font-bold text-teal-200 mb-2 text-lg">{line}</div>
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
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                        <span className="text-white text-sm">🤖</span>
                      </div>
                      <div className="rounded-2xl px-6 py-4 bg-white/10 border border-slate-200/20 backdrop-blur-sm shadow-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-slate-200/20 bg-white/5 backdrop-blur-xl">
              <div className="max-w-4xl mx-auto">
                <SignedOut>
                  <div className="text-center p-8 rounded-2xl bg-white/10 border border-slate-200/20 backdrop-blur-sm">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500/30 to-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                      <span className="text-3xl">🔐</span>
                    </div>
                    <h3 className="text-xl font-black mb-3 text-white">
                      Sign in to start chatting
                    </h3>
                    <p className="text-sm mb-6 text-slate-300">
                      Create an account or sign in to access the AI travel assistant
                    </p>
                    <div className="flex justify-center space-x-4">
                      <SignInButton>
                        <button className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                          Sign In
                        </button>
                      </SignInButton>
                      <button
                        onClick={() => navigate('/sign-up')}
                        className="px-6 py-3 font-semibold rounded-xl border-2 border-slate-300/30 text-slate-300 hover:border-slate-200/50 hover:text-white transition-all duration-300 backdrop-blur-sm"
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                </SignedOut>

                <SignedIn>
                  <div className="relative">
                    <div className="flex items-end space-x-4 p-4 rounded-2xl bg-white/10 border border-slate-200/20 backdrop-blur-sm shadow-lg">
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
                          className="w-full p-4 rounded-xl border-0 resize-none focus:outline-none bg-white/10 text-white placeholder-slate-300 focus:ring-2 focus:ring-teal-500/20 backdrop-blur-sm"
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
                            ? 'bg-slate-200/20 text-slate-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="text-xs mt-2 text-center text-slate-400">
                      Press Enter to send, Shift+Enter for new line
                    </div>
                  </div>
                </SignedIn>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}