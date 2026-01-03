import React, { useState } from 'react';
import { Header } from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { useTheme } from '../contexts/ThemeContext';
import { 
  FaLifeRing, 
  FaSearch, 
  FaRocket, 
  FaMap, 
  FaHeart, 
  FaCog, 
  FaBug, 
  FaEnvelope,
  FaChevronRight,
  FaPlay,
  FaBook,
  FaQuestionCircle,
  FaUsers,
  FaPhone
} from 'react-icons/fa';

const Help = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState('getting-started');

  const helpSections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <FaRocket className="text-xl" />,
      description: 'Learn the basics of using Roamio Wanderly',
      articles: [
        {
          title: 'Creating Your Account',
          content: 'Sign up for a free account to access personalized recommendations, save your favorite places, and write reviews. Click "Sign Up" and choose to register with email or social media accounts.',
          steps: [
            'Click the "Sign Up" button in the top right corner',
            'Choose your registration method (email or social login)',
            'Fill in your basic information',
            'Verify your email address',
            'Complete your profile with travel preferences'
          ]
        },
        {
          title: 'Exploring Destinations',
          content: 'Discover Nepal\'s amazing destinations through our curated collections, search functionality, and personalized recommendations based on your interests.',
          steps: [
            'Use the search bar to find specific places',
            'Browse featured destinations on the homepage',
            'Filter results by category (hotels, restaurants, activities)',
            'Read reviews and view photos from other travelers',
            'Save places to your favorites for later'
          ]
        },
        {
          title: 'Understanding Our Recommendations',
          content: 'Our AI-powered recommendation system learns from your preferences, search history, and saved places to suggest destinations you\'ll love.',
          steps: [
            'Complete your profile with travel preferences',
            'Rate places you\'ve visited',
            'Save places that interest you',
            'Use the "Inspire My Trip" feature for personalized suggestions',
            'Provide feedback to improve recommendations'
          ]
        }
      ]
    },
    {
      id: 'navigation',
      title: 'Navigation & Search',
      icon: <FaMap className="text-xl" />,
      description: 'Master our search and navigation features',
      articles: [
        {
          title: 'Advanced Search Tips',
          content: 'Get better search results with these advanced techniques and filters to find exactly what you\'re looking for.',
          steps: [
            'Use specific keywords (e.g., "luxury hotel Pokhara")',
            'Filter by category, price range, and ratings',
            'Use location-based search for nearby places',
            'Save frequent searches for quick access',
            'Try voice search on mobile devices'
          ]
        },
        {
          title: 'Using the Interactive Map',
          content: 'Navigate Nepal visually with our interactive map feature that shows destinations, routes, and nearby attractions.',
          steps: [
            'Click on map markers to view place details',
            'Use zoom controls to explore different areas',
            'Switch between map and satellite views',
            'Get directions to your selected destinations',
            'View nearby restaurants and accommodations'
          ]
        },
        {
          title: 'Nepali Calendar Integration',
          content: 'Plan your trips around Nepal\'s festivals and seasons using our integrated Nepali calendar with cultural insights.',
          steps: [
            'Click the Calendar button in the header',
            'Browse festivals and cultural events',
            'Check weather patterns for different months',
            'Plan trips around major celebrations',
            'Learn about seasonal travel considerations'
          ]
        }
      ]
    },
    {
      id: 'reviews',
      title: 'Reviews & Ratings',
      icon: <FaHeart className="text-xl" />,
      description: 'Share your experiences and help other travelers',
      articles: [
        {
          title: 'Writing Helpful Reviews',
          content: 'Create detailed, honest reviews that help other travelers make informed decisions about their Nepal adventures.',
          steps: [
            'Visit the place page and click "Write Review"',
            'Rate different aspects (cleanliness, service, value)',
            'Write detailed, honest feedback',
            'Add photos to illustrate your experience',
            'Include tips for future visitors'
          ]
        },
        {
          title: 'Photo Guidelines',
          content: 'Share high-quality photos that showcase destinations and help other travelers visualize their experiences.',
          steps: [
            'Use good lighting and clear composition',
            'Upload photos under 5MB in JPG/PNG format',
            'Include diverse shots (exterior, interior, food, views)',
            'Respect privacy and local photography rules',
            'Add captions to provide context'
          ]
        },
        {
          title: 'Review Moderation',
          content: 'Understand our review policies and moderation process to ensure quality and authenticity of all reviews.',
          steps: [
            'Reviews are checked for authenticity',
            'Fake or spam reviews are removed',
            'You can edit reviews within 30 days',
            'Report inappropriate content using the flag button',
            'Appeals can be submitted through contact form'
          ]
        }
      ]
    },
    {
      id: 'account',
      title: 'Account Settings',
      icon: <FaCog className="text-xl" />,
      description: 'Manage your profile and preferences',
      articles: [
        {
          title: 'Profile Management',
          content: 'Keep your profile updated with current information and preferences to get the best personalized experience.',
          steps: [
            'Click your profile picture to access settings',
            'Update personal information and contact details',
            'Set travel preferences and interests',
            'Upload a profile picture',
            'Manage privacy settings'
          ]
        },
        {
          title: 'Notification Preferences',
          content: 'Control what notifications you receive and how you want to be contacted about updates and recommendations.',
          steps: [
            'Go to Account Settings > Notifications',
            'Choose email notification preferences',
            'Set mobile push notification settings',
            'Manage newsletter subscriptions',
            'Configure travel alert preferences'
          ]
        },
        {
          title: 'Privacy & Security',
          content: 'Protect your account and control how your information is used and shared on the platform.',
          steps: [
            'Enable two-factor authentication',
            'Review and update privacy settings',
            'Manage data sharing preferences',
            'Control profile visibility',
            'Download your data or delete account'
          ]
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: <FaBug className="text-xl" />,
      description: 'Solve common technical issues',
      articles: [
        {
          title: 'Login Problems',
          content: 'Resolve common login issues and regain access to your account quickly and securely.',
          steps: [
            'Check your email and password for typos',
            'Use "Forgot Password" to reset credentials',
            'Clear browser cache and cookies',
            'Try a different browser or incognito mode',
            'Contact support if problems persist'
          ]
        },
        {
          title: 'Website Performance',
          content: 'Improve your browsing experience if the website is loading slowly or not functioning properly.',
          steps: [
            'Check your internet connection speed',
            'Clear browser cache and cookies',
            'Disable browser extensions temporarily',
            'Try a different browser or device',
            'Report persistent issues to our support team'
          ]
        },
        {
          title: 'Mobile Experience',
          content: 'Optimize your mobile browsing experience and resolve common mobile-specific issues.',
          steps: [
            'Update your mobile browser to the latest version',
            'Clear mobile browser cache',
            'Check available storage space',
            'Try switching between WiFi and mobile data',
            'Use landscape mode for better map viewing'
          ]
        }
      ]
    }
  ];

  const quickLinks = [
    { title: 'Frequently Asked Questions', icon: <FaQuestionCircle />, link: '/faq', description: 'Quick answers to common questions' },
    { title: 'Contact Support', icon: <FaEnvelope />, link: '/contact', description: 'Get help from our support team' },
    { title: 'Community Guidelines', icon: <FaUsers />, link: '#', description: 'Learn about our community standards' },
    { title: 'Report an Issue', icon: <FaBug />, link: '#', description: 'Report bugs or technical problems' }
  ];

  const currentSection = helpSections.find(section => section.id === selectedSection);
  const filteredArticles = currentSection?.articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-full ${theme === 'dark' ? 'bg-teal-900/50' : 'bg-teal-100'}`}>
              <FaLifeRing className="text-4xl text-teal-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Help Center
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Everything you need to know about using Roamio Wanderly
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto relative">
            <FaSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Search help articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-4 rounded-xl border ${
                theme === 'dark' 
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg`}
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {quickLinks.map((link, index) => (
            <a
              key={index}
              href={link.link}
              className={`p-4 rounded-xl border transition-all duration-200 hover:scale-105 ${
                theme === 'dark'
                  ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              } shadow-sm hover:shadow-md`}
            >
              <div className="flex items-center mb-2">
                <div className="text-teal-600 mr-3">{link.icon}</div>
                <h3 className="font-semibold">{link.title}</h3>
              </div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {link.description}
              </p>
            </a>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className={`rounded-xl border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'} p-4`}>
              <h3 className="font-semibold mb-4">Help Topics</h3>
              <nav className="space-y-2">
                {helpSections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSection(section.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      selectedSection === section.id
                        ? 'bg-teal-600 text-white'
                        : theme === 'dark'
                          ? 'hover:bg-slate-700 text-gray-300'
                          : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="mr-3">{section.icon}</div>
                      <div>
                        <div className="font-medium">{section.title}</div>
                        <div className={`text-xs ${
                          selectedSection === section.id 
                            ? 'text-teal-100' 
                            : theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          {section.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className={`rounded-xl border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'} p-6`}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{currentSection?.title}</h2>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {currentSection?.description}
                </p>
              </div>

              {/* Articles */}
              <div className="space-y-6">
                {filteredArticles.length === 0 ? (
                  <div className="text-center py-8">
                    <FaBook className={`text-4xl mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                    <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Try adjusting your search terms or browse other sections
                    </p>
                  </div>
                ) : (
                  filteredArticles.map((article, index) => (
                    <div
                      key={index}
                      className={`p-6 rounded-lg border ${
                        theme === 'dark' ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <h3 className="text-xl font-semibold mb-3 flex items-center">
                        <FaPlay className="text-teal-600 mr-3 text-sm" />
                        {article.title}
                      </h3>
                      <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {article.content}
                      </p>
                      
                      {article.steps && (
                        <div>
                          <h4 className="font-medium mb-3 text-teal-600">Step-by-step guide:</h4>
                          <ol className="space-y-2">
                            {article.steps.map((step, stepIndex) => (
                              <li
                                key={stepIndex}
                                className={`flex items-start ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                              >
                                <span className="flex-shrink-0 w-6 h-6 bg-teal-600 text-white text-xs rounded-full flex items-center justify-center mr-3 mt-0.5">
                                  {stepIndex + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support Section */}
        <div className={`mt-12 p-8 rounded-xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white'} shadow-lg text-center`}>
          <div className="max-w-2xl mx-auto">
            <FaPhone className="text-4xl text-teal-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Still need assistance?</h3>
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Our support team is available 24/7 to help you with any questions or issues you might have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <FaEnvelope className="mr-2" />
                Contact Support
              </a>
              <a
                href="/faq"
                className={`px-8 py-3 border font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center ${
                  theme === 'dark'
                    ? 'border-slate-600 text-gray-300 hover:bg-slate-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FaQuestionCircle className="mr-2" />
                Browse FAQ
              </a>
            </div>
            <p className={`mt-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Average response time: 2-4 hours during business hours
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Help;