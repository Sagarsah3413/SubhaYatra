import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignUpButton, UserButton } from '@clerk/clerk-react';
import { useTheme } from '../../contexts/ThemeContext';
import {
  FaHome,
  FaSearch,
  FaMapMarkedAlt,
  FaRobot,
  FaStar,
  FaUser,
  FaPen,
  FaPlus,
  FaInfoCircle,
  FaEnvelope,
  FaCalendarAlt,
  FaSun,
  FaMoon,
  FaTimes,
  FaMountain,
  FaTree,
  FaMap,
  FaNewspaper,
  FaQuestionCircle,
  FaLifeRing,
  FaShieldAlt,
  FaFileContract,
  FaCog,
  FaHeart,
  FaBookmark,
  FaHistory,
  FaBell,
  FaLanguage
} from 'react-icons/fa';

const Sidebar = ({ isOpen, onClose, onOpenCalendar }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  // Compact menu items - organized and essential only
  const menuItems = [
    {
      title: 'Main',
      items: [
        { icon: FaHome, label: 'Home', path: '/' },
        { icon: FaSearch, label: 'Search', path: '/searchresult' },
        { icon: FaMapMarkedAlt, label: 'Map', path: '/map' },
        { icon: FaRobot, label: 'AI Chat', path: '/chat' },
        { icon: FaStar, label: 'Recommendations', path: '/recommendation' },
      ]
    },
    {
      title: 'Explore',
      items: [
        { icon: FaMountain, label: 'Famous Spots', path: '/all-famous-spots' },
        { icon: FaTree, label: 'Nature Places', path: '/all-nature-places' },
        { icon: FaMap, label: 'All Places', path: '/all-places-detail' },
      ]
    },
    {
      title: 'Account',
      items: [
        { icon: FaUser, label: 'Profile', path: '/profile' },
        { icon: FaHeart, label: 'Favorites', path: '/favorites' },
        { icon: FaBookmark, label: 'Saved Places', path: '/saved-places' },
        { icon: FaHistory, label: 'History', path: '/travel-history' },
      ]
    },
    {
      title: 'Community',
      items: [
        { icon: FaPen, label: 'Write Review', path: '/write-review' },
        { icon: FaPlus, label: 'Add Place', path: '/add-place' },
        { icon: FaNewspaper, label: 'Newsletter', path: '/newsletter-archive' },
      ]
    },
    {
      title: 'Info',
      items: [
        { icon: FaInfoCircle, label: 'About Us', path: '/about' },
        { icon: FaEnvelope, label: 'Contact', path: '/contact' },
        { icon: FaCalendarAlt, label: 'Calendar', action: () => {
          onOpenCalendar();
          onClose();
        }},
        { icon: FaQuestionCircle, label: 'FAQ', path: '/faq' },
        { icon: FaLifeRing, label: 'Help', path: '/help' },
      ]
    },
    {
      title: 'Legal',
      items: [
        { icon: FaShieldAlt, label: 'Privacy', path: '/privacy-policy' },
        { icon: FaFileContract, label: 'Terms', path: '/terms-of-service' },
      ]
    }
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Ultra Modern Full Desktop Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-80 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-slate-900/98 via-slate-800/95 to-slate-900/98 text-white border-r border-slate-700/30' 
            : 'bg-gradient-to-br from-white/98 via-gray-50/95 to-white/98 text-gray-900 border-r border-gray-200/30'
        } shadow-2xl z-50 transform transition-all duration-500 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col backdrop-blur-2xl`}>
        
        {/* Ultra Professional Header */}
        <div className={`flex items-center justify-between p-6 ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-slate-800/90 to-slate-700/80 border-b border-slate-600/20' 
            : 'bg-gradient-to-r from-white/95 to-gray-50/90 border-b border-gray-200/20'
        } backdrop-blur-xl shadow-lg relative overflow-hidden`}>
          
          {/* Premium Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                radial-gradient(circle at 25% 50%, rgba(6, 182, 212, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 75% 50%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)
              `,
              backgroundSize: '200px 200px'
            }}></div>
          </div>
          
          <div className="flex items-center space-x-4 relative z-10">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-teal-500 via-emerald-500 to-cyan-500 shadow-xl shadow-teal-500/30' 
                : 'bg-gradient-to-br from-blue-500 via-teal-600 to-cyan-600 shadow-xl shadow-blue-500/30'
            } transform hover:scale-110 transition-all duration-300 border-2 border-white/20`}>
              <span className="text-white text-xl font-black">R</span>
            </div>
            <div>
              <h1 className={`text-xl font-black tracking-tight ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Roamio <span className="text-teal-500">Wanderly</span>
              </h1>
              <p className={`text-sm font-medium ${
                theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
              }`}>
                Your Travel Companion
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className={`p-3 rounded-xl transition-all duration-300 relative z-10 ${
              theme === 'dark' 
                ? 'hover:bg-slate-700/60 text-slate-400 hover:text-white hover:scale-110 hover:rotate-90' 
                : 'hover:bg-gray-100/80 text-gray-500 hover:text-gray-700 hover:scale-110 hover:rotate-90'
            } shadow-lg backdrop-blur-sm border border-white/10`}>
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Ultra Modern Menu */}
        <div className={`flex-1 overflow-y-auto py-6 px-4 sidebar-scroll ${theme === 'dark' ? 'dark' : ''}`}>
          {menuItems.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-8">
              
              {/* Premium Section Header */}
              <div className={`px-4 py-3 ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-slate-800/60 to-slate-700/40 border border-slate-600/20' 
                  : 'bg-gradient-to-r from-gray-50/80 to-white/60 border border-gray-200/30'
              } rounded-xl mb-4 backdrop-blur-sm shadow-lg relative overflow-hidden`}>
                
                {/* Section Header Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `
                      radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.4) 0%, transparent 70%),
                      radial-gradient(circle at 80% 50%, rgba(16, 185, 129, 0.4) 0%, transparent 70%)
                    `,
                    backgroundSize: '100px 100px'
                  }}></div>
                </div>
                
                <div className="flex items-center space-x-3 relative z-10">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-400/30' 
                      : 'bg-gradient-to-br from-blue-500/20 to-teal-500/20 border border-blue-400/30'
                  } shadow-lg`}>
                    <span className={`text-sm font-bold ${
                      theme === 'dark' ? 'text-teal-400' : 'text-blue-600'
                    }`}>
                      {section.title.charAt(0)}
                    </span>
                  </div>
                  <h3 className={`text-sm font-bold tracking-wide ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>
                    {section.title}
                  </h3>
                  <div className={`flex-1 h-px ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-r from-slate-600/50 to-transparent' 
                      : 'bg-gradient-to-r from-gray-300/50 to-transparent'
                  }`}></div>
                </div>
              </div>
              
              {/* Premium Menu Items */}
              <div className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    onClick={() => item.path ? handleNavigation(item.path) : item.action && item.action()}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-300 group relative overflow-hidden ${
                      theme === 'dark' 
                        ? 'hover:bg-gradient-to-r hover:from-slate-700/60 hover:to-slate-600/40 hover:shadow-xl hover:shadow-slate-900/30 hover:border hover:border-slate-600/30' 
                        : 'hover:bg-gradient-to-r hover:from-white hover:to-gray-50/80 hover:shadow-xl hover:shadow-gray-200/60 hover:border hover:border-gray-300/40'
                    } transform hover:scale-[1.02] hover:-translate-y-1`}>
                    
                    {/* Premium Hover Background */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ${
                      theme === 'dark' 
                        ? 'bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-cyan-500/10' 
                        : 'bg-gradient-to-r from-blue-50/80 via-teal-50/60 to-cyan-50/80'
                    } rounded-xl`}></div>
                    
                    {/* Premium Icon Container */}
                    <div className={`p-3 rounded-xl mr-4 transition-all duration-300 relative z-10 ${
                      theme === 'dark' 
                        ? 'text-slate-400 group-hover:text-teal-400 group-hover:bg-teal-400/15 group-hover:shadow-xl group-hover:shadow-teal-400/20 group-hover:scale-110' 
                        : 'text-gray-500 group-hover:text-blue-600 group-hover:bg-blue-50/80 group-hover:shadow-xl group-hover:shadow-blue-500/20 group-hover:scale-110'
                    } border border-transparent group-hover:border-current/20`}>
                      <item.icon className="text-lg" />
                    </div>
                    
                    {/* Premium Text Content */}
                    <div className="flex-1 relative z-10">
                      <span className={`text-base font-semibold block ${
                        theme === 'dark' ? 'text-slate-200 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'
                      }`}>
                        {item.label}
                      </span>
                      <span className={`text-xs font-medium ${
                        theme === 'dark' ? 'text-slate-500 group-hover:text-slate-400' : 'text-gray-500 group-hover:text-gray-600'
                      }`}>
                        {item.path ? `Navigate to ${item.label.toLowerCase()}` : 'Execute action'}
                      </span>
                    </div>
                    
                    {/* Premium Arrow Indicator */}
                    <div className={`opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 relative z-10 ${
                      theme === 'dark' ? 'text-teal-400' : 'text-blue-600'
                    }`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Ultra Modern Settings Section */}
          <div className="mb-8">
            <div className={`px-4 py-3 ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-slate-800/60 to-slate-700/40 border border-slate-600/20' 
                : 'bg-gradient-to-r from-gray-50/80 to-white/60 border border-gray-200/30'
            } rounded-xl mb-4 backdrop-blur-sm shadow-lg relative overflow-hidden`}>
              
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `
                    radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.4) 0%, transparent 70%),
                    radial-gradient(circle at 80% 50%, rgba(16, 185, 129, 0.4) 0%, transparent 70%)
                  `,
                  backgroundSize: '100px 100px'
                }}></div>
              </div>
              
              <div className="flex items-center space-x-3 relative z-10">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30' 
                    : 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30'
                } shadow-lg`}>
                  <FaCog className={`text-sm ${
                    theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                  }`} />
                </div>
                <h3 className={`text-sm font-bold tracking-wide ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>
                  Settings
                </h3>
                <div className={`flex-1 h-px ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-slate-600/50 to-transparent' 
                    : 'bg-gradient-to-r from-gray-300/50 to-transparent'
                }`}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => {
                  toggleTheme();
                  onClose();
                }}
                className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  theme === 'dark' 
                    ? 'hover:bg-gradient-to-r hover:from-slate-700/60 hover:to-slate-600/40 hover:shadow-xl hover:shadow-slate-900/30 hover:border hover:border-slate-600/30' 
                    : 'hover:bg-gradient-to-r hover:from-white hover:to-gray-50/80 hover:shadow-xl hover:shadow-gray-200/60 hover:border hover:border-gray-300/40'
                } transform hover:scale-[1.02] hover:-translate-y-1`}>
                
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-yellow-500/10' 
                    : 'bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/80'
                } rounded-xl`}></div>
                
                <div className={`p-3 rounded-xl mr-4 transition-all duration-300 relative z-10 ${
                  theme === 'dark' 
                    ? 'text-slate-400 group-hover:text-amber-400 group-hover:bg-amber-400/15 group-hover:shadow-xl group-hover:shadow-amber-400/20 group-hover:scale-110' 
                    : 'text-gray-500 group-hover:text-indigo-600 group-hover:bg-indigo-50/80 group-hover:shadow-xl group-hover:shadow-indigo-500/20 group-hover:scale-110'
                } border border-transparent group-hover:border-current/20`}>
                  {theme === 'light' ? <FaMoon className="text-lg" /> : <FaSun className="text-lg" />}
                </div>
                
                <div className="flex-1 relative z-10">
                  <span className={`text-base font-semibold block ${
                    theme === 'dark' ? 'text-slate-200 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'
                  }`}>
                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                  </span>
                  <span className={`text-xs font-medium ${
                    theme === 'dark' ? 'text-slate-500 group-hover:text-slate-400' : 'text-gray-500 group-hover:text-gray-600'
                  }`}>
                    Switch to {theme === 'light' ? 'dark' : 'light'} theme
                  </span>
                </div>
                
                <div className={`opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 relative z-10 ${
                  theme === 'dark' ? 'text-amber-400' : 'text-indigo-600'
                }`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
              
              <button
                onClick={() => handleNavigation('/notifications')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  theme === 'dark' 
                    ? 'hover:bg-gradient-to-r hover:from-slate-700/60 hover:to-slate-600/40 hover:shadow-xl hover:shadow-slate-900/30 hover:border hover:border-slate-600/30' 
                    : 'hover:bg-gradient-to-r hover:from-white hover:to-gray-50/80 hover:shadow-xl hover:shadow-gray-200/60 hover:border hover:border-gray-300/40'
                } transform hover:scale-[1.02] hover:-translate-y-1`}>
                
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-red-500/10 via-pink-500/5 to-rose-500/10' 
                    : 'bg-gradient-to-r from-red-50/80 via-pink-50/60 to-rose-50/80'
                } rounded-xl`}></div>
                
                <div className={`p-3 rounded-xl mr-4 transition-all duration-300 relative z-10 ${
                  theme === 'dark' 
                    ? 'text-slate-400 group-hover:text-red-400 group-hover:bg-red-400/15 group-hover:shadow-xl group-hover:shadow-red-400/20 group-hover:scale-110' 
                    : 'text-gray-500 group-hover:text-red-600 group-hover:bg-red-50/80 group-hover:shadow-xl group-hover:shadow-red-500/20 group-hover:scale-110'
                } border border-transparent group-hover:border-current/20`}>
                  <FaBell className="text-lg" />
                </div>
                
                <div className="flex-1 relative z-10">
                  <span className={`text-base font-semibold block ${
                    theme === 'dark' ? 'text-slate-200 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'
                  }`}>
                    Notifications
                  </span>
                  <span className={`text-xs font-medium ${
                    theme === 'dark' ? 'text-slate-500 group-hover:text-slate-400' : 'text-gray-500 group-hover:text-gray-600'
                  }`}>
                    Manage your alerts
                  </span>
                </div>
                
                <div className={`opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 relative z-10 ${
                  theme === 'dark' ? 'text-red-400' : 'text-red-600'
                }`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
              
              <button
                onClick={() => handleNavigation('/language')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  theme === 'dark' 
                    ? 'hover:bg-gradient-to-r hover:from-slate-700/60 hover:to-slate-600/40 hover:shadow-xl hover:shadow-slate-900/30 hover:border hover:border-slate-600/30' 
                    : 'hover:bg-gradient-to-r hover:from-white hover:to-gray-50/80 hover:shadow-xl hover:shadow-gray-200/60 hover:border hover:border-gray-300/40'
                } transform hover:scale-[1.02] hover:-translate-y-1`}>
                
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-teal-500/10' 
                    : 'bg-gradient-to-r from-green-50/80 via-emerald-50/60 to-teal-50/80'
                } rounded-xl`}></div>
                
                <div className={`p-3 rounded-xl mr-4 transition-all duration-300 relative z-10 ${
                  theme === 'dark' 
                    ? 'text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-400/15 group-hover:shadow-xl group-hover:shadow-emerald-400/20 group-hover:scale-110' 
                    : 'text-gray-500 group-hover:text-emerald-600 group-hover:bg-emerald-50/80 group-hover:shadow-xl group-hover:shadow-emerald-500/20 group-hover:scale-110'
                } border border-transparent group-hover:border-current/20`}>
                  <FaLanguage className="text-lg" />
                </div>
                
                <div className="flex-1 relative z-10">
                  <span className={`text-base font-semibold block ${
                    theme === 'dark' ? 'text-slate-200 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'
                  }`}>
                    Language
                  </span>
                  <span className={`text-xs font-medium ${
                    theme === 'dark' ? 'text-slate-500 group-hover:text-slate-400' : 'text-gray-500 group-hover:text-gray-600'
                  }`}>
                    Change app language
                  </span>
                </div>
                
                <div className={`opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 relative z-10 ${
                  theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                }`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          {/* Ultra Modern Account Section */}
          <div className="mb-8">
            <div className={`px-4 py-3 ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-slate-800/60 to-slate-700/40 border border-slate-600/20' 
                : 'bg-gradient-to-r from-gray-50/80 to-white/60 border border-gray-200/30'
            } rounded-xl mb-4 backdrop-blur-sm shadow-lg relative overflow-hidden`}>
              
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `
                    radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.4) 0%, transparent 70%),
                    radial-gradient(circle at 80% 50%, rgba(16, 185, 129, 0.4) 0%, transparent 70%)
                  `,
                  backgroundSize: '100px 100px'
                }}></div>
              </div>
              
              <div className="flex items-center space-x-3 relative z-10">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30' 
                    : 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30'
                } shadow-lg`}>
                  <FaUser className={`text-sm ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                </div>
                <h3 className={`text-sm font-bold tracking-wide ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>
                  Account
                </h3>
                <div className={`flex-1 h-px ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-slate-600/50 to-transparent' 
                    : 'bg-gradient-to-r from-gray-300/50 to-transparent'
                }`}></div>
              </div>
            </div>
            
            <div className="px-2">
              <SignedOut>
                <SignUpButton>
                  <button className={`w-full py-4 px-6 rounded-xl text-base font-bold transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden group ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-teal-500 via-emerald-600 to-cyan-600 hover:from-teal-400 hover:via-emerald-500 hover:to-cyan-500 text-white shadow-xl hover:shadow-2xl hover:shadow-teal-500/30'
                      : 'bg-gradient-to-r from-blue-600 via-teal-600 to-cyan-600 hover:from-blue-500 hover:via-teal-500 hover:to-cyan-500 text-white shadow-xl hover:shadow-2xl hover:shadow-blue-500/30'
                  } border border-white/20`}>
                    
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="flex items-center justify-center space-x-3 relative z-10">
                      <FaUser className="text-lg" />
                      <span className="tracking-wide">Sign In / Register</span>
                    </div>
                  </button>
                </SignUpButton>
              </SignedOut>
              
              <SignedIn>
                <div className={`flex justify-center p-4 rounded-xl ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-slate-700/60 to-slate-600/40 border border-slate-600/30' 
                    : 'bg-gradient-to-r from-white to-gray-50/80 border border-gray-200/30'
                } shadow-xl backdrop-blur-sm`}>
                  <div className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
                    theme === 'dark' ? 'bg-slate-600/50 shadow-xl shadow-slate-900/30' : 'bg-white shadow-xl shadow-gray-200/50'
                  } border border-white/20`}>
                    <UserButton />
                  </div>
                </div>
              </SignedIn>
            </div>
          </div>
        </div>

        {/* Ultra Modern Footer */}
        <div className={`p-6 ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-slate-800/90 to-slate-700/80 border-t border-slate-600/20' 
            : 'bg-gradient-to-r from-white/95 to-gray-50/90 border-t border-gray-200/20'
        } backdrop-blur-xl shadow-lg relative overflow-hidden`}>
          
          {/* Footer Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                radial-gradient(circle at 25% 50%, rgba(6, 182, 212, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 75% 50%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)
              `,
              backgroundSize: '150px 150px'
            }}></div>
          </div>
          
          <div className="relative z-10">
            {/* Status and Version */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full animate-pulse ${
                  theme === 'dark' ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' : 'bg-green-500 shadow-lg shadow-green-500/50'
                }`}></div>
                <span className={`text-sm font-semibold ${
                  theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
                }`}>
                  System Online
                </span>
              </div>
              
              <div className={`px-3 py-1.5 rounded-lg ${
                theme === 'dark' ? 'bg-slate-700/60 border border-slate-600/30' : 'bg-gray-100 border border-gray-200/30'
              } shadow-lg`}>
                <span className={`text-sm font-mono font-bold ${
                  theme === 'dark' ? 'text-teal-400' : 'text-blue-600'
                }`}>
                  v3.0
                </span>
              </div>
            </div>
            
            {/* Company Info */}
            <div className={`text-center py-4 px-4 rounded-xl ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-slate-700/40 to-slate-600/30 border border-slate-600/20' 
                : 'bg-gradient-to-r from-gray-50/80 to-white/60 border border-gray-200/30'
            } shadow-lg backdrop-blur-sm`}>
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/30' 
                    : 'bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/30'
                } border border-white/20`}>
                  <span className="text-white text-xs font-black">R</span>
                </div>
                <span className={`text-sm font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>
                  Roamio Wanderly
                </span>
              </div>
              
              <p className={`text-xs font-medium ${
                theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
              }`}>
                © 2024 • Premium Travel Experience
              </p>
              
              <div className="flex items-center justify-center space-x-2 mt-2">
                <div className={`w-1 h-1 rounded-full ${
                  theme === 'dark' ? 'bg-teal-500/60' : 'bg-blue-500/60'
                }`}></div>
                <span className={`text-xs font-medium ${
                  theme === 'dark' ? 'text-slate-500' : 'text-gray-400'
                }`}>
                  Made with ❤️ for travelers
                </span>
                <div className={`w-1 h-1 rounded-full ${
                  theme === 'dark' ? 'bg-teal-500/60' : 'bg-blue-500/60'
                }`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;