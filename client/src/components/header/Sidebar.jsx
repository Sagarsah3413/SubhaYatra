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

      {/* Professional Compact Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-36 ${
          theme === 'dark' 
            ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white border-r border-slate-700/50' 
            : 'bg-gradient-to-b from-white via-gray-50 to-white text-gray-900 border-r border-gray-200/50'
        } shadow-2xl z-50 transform transition-all duration-500 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col backdrop-blur-xl`}>
        {/* Professional Header */}
        <div className={`flex items-center justify-between p-3 ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-slate-800/80 to-slate-700/60 border-b border-slate-600/30' 
            : 'bg-gradient-to-r from-white/90 to-gray-50/80 border-b border-gray-200/30'
        } backdrop-blur-xl shadow-sm`}>
          <div className="flex items-center space-x-2">
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
              theme === 'dark' ? 'bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 shadow-lg shadow-amber-500/25' : 'bg-gradient-to-br from-blue-500 via-teal-600 to-cyan-600 shadow-lg shadow-blue-500/25'
            } transform hover:scale-110 transition-transform duration-300`}>
              <span className="text-white text-xs font-bold">R</span>
            </div>
            <div>
              <span className={`text-xs font-bold tracking-wide ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Roamio
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-all duration-300 ${
              theme === 'dark' 
                ? 'hover:bg-slate-700/50 text-slate-400 hover:text-white hover:scale-110' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700 hover:scale-110'
            }`}>
            <FaTimes className="text-xs" />
          </button>
        </div>

        {/* Professional Menu */}
        <div className={`flex-1 overflow-y-auto py-2 sidebar-scroll ${theme === 'dark' ? 'dark' : ''}`}>
          {menuItems.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              <div className={`px-3 py-2 ${
                theme === 'dark' ? 'bg-slate-800/40 border border-slate-600/30' : 'bg-gray-50/60 border border-gray-200/40'
              } mx-2 rounded-lg mb-2 backdrop-blur-sm shadow-sm`}>
                <h3 className={`text-[10px] font-bold uppercase tracking-wider ${
                  theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
                }`}>
                  {section.title}
                </h3>
              </div>
              <div className="space-y-1 px-2">
                {section.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    onClick={() => item.path ? handleNavigation(item.path) : item.action && item.action()}
                    className={`w-full flex items-center px-2 py-2 text-left rounded-lg transition-all duration-300 group relative overflow-hidden ${
                      theme === 'dark' 
                        ? 'hover:bg-slate-700/40 hover:shadow-lg hover:shadow-slate-900/30 hover:border hover:border-slate-600/30' 
                        : 'hover:bg-white hover:shadow-md hover:shadow-gray-200/60 hover:border hover:border-gray-300/50'
                    } transform hover:scale-[1.02] hover:-translate-y-0.5`}>
                    {/* Hover effect background */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      theme === 'dark' ? 'bg-gradient-to-r from-slate-700/20 to-slate-600/20' : 'bg-gradient-to-r from-blue-50/50 to-teal-50/50'
                    }`}></div>
                    <div className={`p-1.5 rounded-md mr-2 transition-all duration-300 relative z-10 ${
                      theme === 'dark' 
                        ? 'text-slate-400 group-hover:text-amber-400 group-hover:bg-amber-400/10 group-hover:shadow-lg group-hover:shadow-amber-400/20' 
                        : 'text-gray-500 group-hover:text-blue-600 group-hover:bg-blue-50 group-hover:shadow-lg group-hover:shadow-blue-500/20'
                    }`}>
                      <item.icon className="text-xs" />
                    </div>
                    <span className={`text-[10px] font-semibold relative z-10 truncate ${
                      theme === 'dark' ? 'text-slate-200 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'
                    }`}>
                      {item.label}
                    </span>
                    {/* Arrow indicator */}
                    <div className={`ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 group-hover:translate-x-0 ${
                      theme === 'dark' ? 'text-slate-500' : 'text-gray-400'
                    }`}>
                      <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Professional Settings Section */}
          <div className="mb-6">
            <div className={`px-3 py-2 ${
              theme === 'dark' ? 'bg-slate-800/40 border border-slate-600/30' : 'bg-gray-50/60 border border-gray-200/40'
            } mx-2 rounded-lg mb-2 backdrop-blur-sm shadow-sm`}>
              <h3 className={`text-[10px] font-bold uppercase tracking-wider ${
                theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
              }`}>
                Settings
              </h3>
            </div>
            <div className="space-y-1 px-2">
              <button
                onClick={() => {
                  toggleTheme();
                  onClose();
                }}
                className={`w-full flex items-center px-2 py-2 text-left rounded-lg transition-all duration-300 group relative overflow-hidden ${
                  theme === 'dark' 
                    ? 'hover:bg-slate-700/40 hover:shadow-lg hover:shadow-slate-900/30 hover:border hover:border-slate-600/30' 
                    : 'hover:bg-white hover:shadow-md hover:shadow-gray-200/60 hover:border hover:border-gray-300/50'
                } transform hover:scale-[1.02] hover:-translate-y-0.5`}>
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  theme === 'dark' ? 'bg-gradient-to-r from-slate-700/20 to-slate-600/20' : 'bg-gradient-to-r from-blue-50/50 to-teal-50/50'
                }`}></div>
                <div className={`p-1.5 rounded-md mr-2 transition-all duration-300 relative z-10 ${
                  theme === 'dark' 
                    ? 'text-slate-400 group-hover:text-amber-400 group-hover:bg-amber-400/10 group-hover:shadow-lg group-hover:shadow-amber-400/20' 
                    : 'text-gray-500 group-hover:text-blue-600 group-hover:bg-blue-50 group-hover:shadow-lg group-hover:shadow-blue-500/20'
                }`}>
                  {theme === 'light' ? <FaMoon className="text-xs" /> : <FaSun className="text-xs" />}
                </div>
                <span className={`text-[10px] font-semibold relative z-10 truncate ${
                  theme === 'dark' ? 'text-slate-200 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'
                }`}>
                  {theme === 'light' ? 'Dark' : 'Light'}
                </span>
                <div className={`ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 group-hover:translate-x-0 ${
                  theme === 'dark' ? 'text-slate-500' : 'text-gray-400'
                }`}>
                  <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
              
              <button
                onClick={() => handleNavigation('/notifications')}
                className={`w-full flex items-center px-2 py-2 text-left rounded-lg transition-all duration-300 group relative overflow-hidden ${
                  theme === 'dark' 
                    ? 'hover:bg-slate-700/40 hover:shadow-lg hover:shadow-slate-900/30 hover:border hover:border-slate-600/30' 
                    : 'hover:bg-white hover:shadow-md hover:shadow-gray-200/60 hover:border hover:border-gray-300/50'
                } transform hover:scale-[1.02] hover:-translate-y-0.5`}>
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  theme === 'dark' ? 'bg-gradient-to-r from-slate-700/20 to-slate-600/20' : 'bg-gradient-to-r from-blue-50/50 to-teal-50/50'
                }`}></div>
                <div className={`p-1.5 rounded-md mr-2 transition-all duration-300 relative z-10 ${
                  theme === 'dark' 
                    ? 'text-slate-400 group-hover:text-amber-400 group-hover:bg-amber-400/10 group-hover:shadow-lg group-hover:shadow-amber-400/20' 
                    : 'text-gray-500 group-hover:text-blue-600 group-hover:bg-blue-50 group-hover:shadow-lg group-hover:shadow-blue-500/20'
                }`}>
                  <FaBell className="text-xs" />
                </div>
                <span className={`text-[10px] font-semibold relative z-10 truncate ${
                  theme === 'dark' ? 'text-slate-200 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'
                }`}>
                  Alerts
                </span>
                <div className={`ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 group-hover:translate-x-0 ${
                  theme === 'dark' ? 'text-slate-500' : 'text-gray-400'
                }`}>
                  <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
              
              <button
                onClick={() => handleNavigation('/language')}
                className={`w-full flex items-center px-2 py-2 text-left rounded-lg transition-all duration-300 group relative overflow-hidden ${
                  theme === 'dark' 
                    ? 'hover:bg-slate-700/40 hover:shadow-lg hover:shadow-slate-900/30 hover:border hover:border-slate-600/30' 
                    : 'hover:bg-white hover:shadow-md hover:shadow-gray-200/60 hover:border hover:border-gray-300/50'
                } transform hover:scale-[1.02] hover:-translate-y-0.5`}>
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  theme === 'dark' ? 'bg-gradient-to-r from-slate-700/20 to-slate-600/20' : 'bg-gradient-to-r from-blue-50/50 to-teal-50/50'
                }`}></div>
                <div className={`p-1.5 rounded-md mr-2 transition-all duration-300 relative z-10 ${
                  theme === 'dark' 
                    ? 'text-slate-400 group-hover:text-amber-400 group-hover:bg-amber-400/10 group-hover:shadow-lg group-hover:shadow-amber-400/20' 
                    : 'text-gray-500 group-hover:text-blue-600 group-hover:bg-blue-50 group-hover:shadow-lg group-hover:shadow-blue-500/20'
                }`}>
                  <FaCog className="text-xs" />
                </div>
                <span className={`text-[10px] font-semibold relative z-10 truncate ${
                  theme === 'dark' ? 'text-slate-200 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'
                }`}>
                  Settings
                </span>
                <div className={`ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 group-hover:translate-x-0 ${
                  theme === 'dark' ? 'text-slate-500' : 'text-gray-400'
                }`}>
                  <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          {/* Professional Account Section */}
          <div className="mb-6">
            <div className={`px-3 py-2 ${
              theme === 'dark' ? 'bg-slate-800/40 border border-slate-600/30' : 'bg-gray-50/60 border border-gray-200/40'
            } mx-2 rounded-lg mb-2 backdrop-blur-sm shadow-sm`}>
              <h3 className={`text-[10px] font-bold uppercase tracking-wider ${
                theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
              }`}>
                Account
              </h3>
            </div>
            <div className="px-2">
              <SignedOut>
                <SignUpButton>
                  <button className={`w-full py-2 px-3 rounded-lg text-[10px] font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-0.5 relative overflow-hidden group ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 hover:from-amber-400 hover:via-orange-500 hover:to-red-500 text-white shadow-lg hover:shadow-xl hover:shadow-amber-500/25'
                      : 'bg-gradient-to-r from-blue-600 via-teal-600 to-cyan-600 hover:from-blue-500 hover:via-teal-500 hover:to-cyan-500 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25'
                  }`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10">Login</span>
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <div className="flex justify-center p-2">
                  <div className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                    theme === 'dark' ? 'bg-slate-700/50 shadow-lg shadow-slate-900/30' : 'bg-white shadow-lg shadow-gray-200/50'
                  }`}>
                    <UserButton />
                  </div>
                </div>
              </SignedIn>
            </div>
          </div>

          {/* Professional Footer */}
          <div className={`p-3 ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-slate-800/80 to-slate-700/60 border-t border-slate-600/30' 
              : 'bg-gradient-to-r from-white/90 to-gray-50/80 border-t border-gray-200/30'
          } backdrop-blur-xl shadow-sm`}>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  theme === 'dark' ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' : 'bg-green-500 shadow-lg shadow-green-500/50'
                }`}></div>
                <span className={`text-[10px] font-semibold ${
                  theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
                }`}>
                  Online
                </span>
              </div>
              <div className={`px-1.5 py-0.5 rounded-md ${
                theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-100'
              }`}>
                <span className={`text-[9px] font-mono font-semibold ${
                  theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                }`}>
                  v2.1
                </span>
              </div>
            </div>
            <div className={`text-center py-1.5 px-2 rounded-lg ${
              theme === 'dark' ? 'bg-slate-700/30 border border-slate-600/20' : 'bg-gray-50 border border-gray-200/30'
            }`}>
              <p className={`text-[9px] font-semibold ${
                theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
              }`}>
                2024 Roamio
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;