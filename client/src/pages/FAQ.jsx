import React, { useState } from 'react';
import { Header } from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { useTheme } from '../contexts/ThemeContext';
import { FaQuestionCircle, FaSearch, FaChevronDown, FaChevronUp, FaThumbsUp, FaThumbsDown, FaEnvelope } from 'react-icons/fa';

const FAQ = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [helpfulVotes, setHelpfulVotes] = useState({});

  const categories = [
    { id: 'all', name: 'All Questions', icon: '📋' },
    { id: 'account', name: 'Account & Profile', icon: '👤' },
    { id: 'booking', name: 'Booking & Reservations', icon: '🏨' },
    { id: 'travel', name: 'Travel & Destinations', icon: '✈️' },
    { id: 'technical', name: 'Technical Support', icon: '🔧' },
    { id: 'payment', name: 'Payment & Billing', icon: '💳' },
    { id: 'reviews', name: 'Reviews & Ratings', icon: '⭐' }
  ];

  const faqData = [
    // Account & Profile
    {
      id: 1,
      category: 'account',
      question: 'How do I create an account on Roamio Wanderly?',
      answer: 'Creating an account is simple! Click the "Sign Up" button in the top right corner of any page. You can register using your email address or sign up with Google/Facebook. Fill in your basic information, verify your email, and you\'re ready to start exploring Nepal\'s amazing destinations.',
      helpful: 0,
      notHelpful: 0
    },
    {
      id: 2,
      category: 'account',
      question: 'Can I change my profile information after registration?',
      answer: 'Yes, you can update your profile information at any time. Go to your account settings by clicking on your profile picture, then select "Edit Profile." You can change your name, email, profile picture, travel preferences, and other personal information.',
      helpful: 0,
      notHelpful: 0
    },
    {
      id: 3,
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'If you\'ve forgotten your password, click "Forgot Password" on the login page. Enter your email address, and we\'ll send you a secure link to reset your password. The link expires after 24 hours for security reasons.',
      helpful: 0,
      notHelpful: 0
    },

    // Booking & Reservations
    {
      id: 4,
      category: 'booking',
      question: 'How do I book hotels through Roamio Wanderly?',
      answer: 'We partner with trusted booking platforms to help you find the best accommodations. When you find a hotel you like, click "Book Now" and you\'ll be redirected to our partner\'s secure booking system. We don\'t handle payments directly but help you compare prices and read reviews.',
      helpful: 0,
      notHelpful: 0
    },
    {
      id: 5,
      category: 'booking',
      question: 'Can I cancel or modify my bookings?',
      answer: 'Cancellation and modification policies depend on the specific hotel or service provider. Each booking will have its own terms and conditions. Contact the booking platform directly or check your confirmation email for cancellation policies. We recommend purchasing travel insurance for added protection.',
      helpful: 0,
      notHelpful: 0
    },
    {
      id: 6,
      category: 'booking',
      question: 'Do you offer group booking discounts?',
      answer: 'Many of our partner hotels and tour operators offer group discounts for 10+ people. Contact us directly with your group size, travel dates, and preferences, and we\'ll help you find the best group rates and coordinate your bookings.',
      helpful: 0,
      notHelpful: 0
    },

    // Travel & Destinations
    {
      id: 7,
      category: 'travel',
      question: 'What\'s the best time to visit Nepal?',
      answer: 'Nepal has distinct seasons with different advantages: Spring (March-May) offers clear mountain views and blooming rhododendrons. Autumn (September-November) provides stable weather and excellent visibility. Winter (December-February) is great for lower altitude areas but challenging for high-altitude treks. Monsoon (June-August) brings lush landscapes but also rain and leeches.',
      helpful: 0,
      notHelpful: 0
    },
    {
      id: 8,
      category: 'travel',
      question: 'Do I need a visa to visit Nepal?',
      answer: 'Most visitors need a visa to enter Nepal. Tourist visas are available on arrival at Tribhuvan International Airport and major border crossings, or you can apply online in advance. Visa fees vary by duration: 15 days ($30), 30 days ($50), 90 days ($125). Some nationalities get free visas - check current requirements before traveling.',
      helpful: 0,
      notHelpful: 0
    },
    {
      id: 9,
      category: 'travel',
      question: 'What should I pack for trekking in Nepal?',
      answer: 'Essential trekking gear includes: layered clothing system, waterproof jacket, warm sleeping bag, sturdy hiking boots, trekking poles, headlamp, first aid kit, water purification tablets, and sun protection. You can buy or rent gear in Kathmandu and Pokhara. We have detailed packing lists for different seasons and trek difficulties.',
      helpful: 0,
      notHelpful: 0
    },

    // Technical Support
    {
      id: 10,
      category: 'technical',
      question: 'The website is loading slowly. What should I do?',
      answer: 'Slow loading can be caused by internet connection, browser cache, or high traffic. Try refreshing the page, clearing your browser cache, or switching to a different browser. If problems persist, check your internet connection or try accessing the site later. Contact our support team if issues continue.',
      helpful: 0,
      notHelpful: 0
    },
    {
      id: 11,
      category: 'technical',
      question: 'I can\'t upload photos to my review. Help!',
      answer: 'Photo upload issues are usually due to file size or format. Ensure your photos are under 5MB and in JPG, PNG, or WEBP format. Try resizing large images or using a different browser. Clear your browser cache and cookies, then try again. Contact support if you continue experiencing issues.',
      helpful: 0,
      notHelpful: 0
    },
    {
      id: 12,
      category: 'technical',
      question: 'Is there a mobile app for Roamio Wanderly?',
      answer: 'Currently, we offer a mobile-optimized website that works great on smartphones and tablets. We\'re developing native mobile apps for iOS and Android, which will be available in 2025. The mobile website includes all features: browsing destinations, reading reviews, and accessing your account.',
      helpful: 0,
      notHelpful: 0
    },

    // Payment & Billing
    {
      id: 13,
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept major credit cards (Visa, MasterCard, American Express), PayPal, and local payment methods through our booking partners. Payment processing is handled securely by our trusted partners. We don\'t store your payment information on our servers for security.',
      helpful: 0,
      notHelpful: 0
    },
    {
      id: 14,
      category: 'payment',
      question: 'Are there any hidden fees when booking?',
      answer: 'We believe in transparent pricing. All fees and taxes are displayed before you complete your booking. Some partners may charge booking fees or resort fees - these will be clearly shown during the booking process. We don\'t add any hidden charges to your reservations.',
      helpful: 0,
      notHelpful: 0
    },

    // Reviews & Ratings
    {
      id: 15,
      category: 'reviews',
      question: 'How do I write a review for a place I visited?',
      answer: 'To write a review, find the destination, hotel, or restaurant page and click "Write a Review." You\'ll need to be logged in to your account. Share your honest experience, rate different aspects (cleanliness, service, value), and add photos if you have them. Reviews help other travelers make informed decisions.',
      helpful: 0,
      notHelpful: 0
    },
    {
      id: 16,
      category: 'reviews',
      question: 'Can I edit or delete my reviews?',
      answer: 'Yes, you can edit or delete your reviews within 30 days of posting. Go to your profile, find "My Reviews," and select the review you want to modify. After 30 days, reviews become permanent to maintain integrity, but you can contact support for special circumstances.',
      helpful: 0,
      notHelpful: 0
    },
    {
      id: 17,
      category: 'reviews',
      question: 'What happens if I report a fake review?',
      answer: 'We take fake reviews seriously. When you report a review, our moderation team investigates within 48 hours. We check for signs of fake reviews: suspicious patterns, unverified accounts, or biased content. Confirmed fake reviews are removed, and repeat offenders may have their accounts suspended.',
      helpful: 0,
      notHelpful: 0
    }
  ];

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleHelpfulVote = (id, isHelpful) => {
    setHelpfulVotes(prev => ({
      ...prev,
      [id]: isHelpful
    }));
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-full ${theme === 'dark' ? 'bg-teal-900/50' : 'bg-teal-100'}`}>
              <FaQuestionCircle className="text-4xl text-teal-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Find quick answers to common questions about using Roamio Wanderly
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  theme === 'dark' 
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-teal-600 text-white shadow-lg'
                    : theme === 'dark'
                      ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                } border ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Showing {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''}
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className={`text-center py-12 ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'} rounded-xl`}>
              <FaQuestionCircle className={`text-4xl mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
              <h3 className="text-xl font-semibold mb-2">No questions found</h3>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Try adjusting your search terms or category filter
              </p>
            </div>
          ) : (
            filteredFAQs.map(faq => (
              <div
                key={faq.id}
                className={`rounded-xl border ${
                  theme === 'dark' 
                    ? 'bg-slate-800/50 border-slate-700' 
                    : 'bg-white border-gray-200'
                } shadow-sm hover:shadow-md transition-all duration-200`}
              >
                <button
                  onClick={() => toggleExpanded(faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-opacity-50 transition-colors duration-200"
                >
                  <h3 className="text-lg font-medium pr-4">{faq.question}</h3>
                  {expandedItems.has(faq.id) ? (
                    <FaChevronUp className="text-teal-600 flex-shrink-0" />
                  ) : (
                    <FaChevronDown className="text-teal-600 flex-shrink-0" />
                  )}
                </button>
                
                {expandedItems.has(faq.id) && (
                  <div className="px-6 pb-6">
                    <div className={`border-t pt-4 ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                      <p className={`mb-4 leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {faq.answer}
                      </p>
                      
                      {/* Helpful Voting */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Was this helpful?
                          </span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleHelpfulVote(faq.id, true)}
                              className={`p-2 rounded-lg transition-colors duration-200 ${
                                helpfulVotes[faq.id] === true
                                  ? 'bg-green-100 text-green-600'
                                  : theme === 'dark'
                                    ? 'hover:bg-slate-700 text-gray-400 hover:text-green-400'
                                    : 'hover:bg-gray-100 text-gray-500 hover:text-green-600'
                              }`}
                            >
                              <FaThumbsUp className="text-sm" />
                            </button>
                            <button
                              onClick={() => handleHelpfulVote(faq.id, false)}
                              className={`p-2 rounded-lg transition-colors duration-200 ${
                                helpfulVotes[faq.id] === false
                                  ? 'bg-red-100 text-red-600'
                                  : theme === 'dark'
                                    ? 'hover:bg-slate-700 text-gray-400 hover:text-red-400'
                                    : 'hover:bg-gray-100 text-gray-500 hover:text-red-600'
                              }`}
                            >
                              <FaThumbsDown className="text-sm" />
                            </button>
                          </div>
                        </div>
                        
                        <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                          Category: {categories.find(c => c.id === faq.category)?.name}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Contact Support Section */}
        <div className={`mt-12 p-6 rounded-xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'} shadow-lg text-center`}>
          <FaEnvelope className="text-3xl text-teal-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Still need help?</h3>
          <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Contact Support
            </a>
            <a
              href="/help"
              className={`px-6 py-3 border font-medium rounded-lg transition-colors duration-200 ${
                theme === 'dark'
                  ? 'border-slate-600 text-gray-300 hover:bg-slate-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Browse Help Center
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FAQ;