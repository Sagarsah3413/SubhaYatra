import React, { useState, useRef, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
import {
    FaBars, FaCompass, FaCamera, FaBookOpen, FaGlobe,
    FaMapMarkerAlt, FaQuestionCircle, FaPlusCircle,
} from 'react-icons/fa';

/**
 * Hamburger menu with a full-screen dropdown.
 * Contains navigation links, language selector and location refresh.
 *
 * Props:
 *   theme                {string}
 *   onNavigation         {Function}
 *   forceRefreshLocation {Function}
 *   selectedLanguage     {string}
 *   handleLanguageChange {Function}
 */
const MenuBar = ({ theme, onNavigation, forceRefreshLocation, selectedLanguage, handleLanguageChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    // const { t } = useTranslation();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMenuClick = (item) => {
        if (item.action) item.action();
        else if (item.path) onNavigation(item.path);
        setIsOpen(false);
    };

    const menuItems = [
        {
            category: 'Explore',
            icon: FaCompass,
            color: 'teal',
            items: [
                { name: 'Home', path: '/', icon: '🏠', description: 'Back to home' },
                { name: 'Explore Nepal', path: '/explore-nepal', icon: '🗺️', description: 'Discover Nepal' },
                { name: 'All Places', path: '/all-places-detail', icon: '📍', description: 'View all places' },
                { name: 'Famous Spots', path: '/all-famous-spots', icon: '⭐', description: 'Popular locations' },
                { name: 'Nature Places', path: '/all-nature-places', icon: '🌲', description: 'Natural beauty' },
            ],
        },
        {
            category: 'Plan',
            icon: FaBookOpen,
            color: 'purple',
            items: [
                { name: 'Recommendations', path: '/recommendation', icon: '💡', description: 'Get suggestions' },
                { name: 'Itinerary', path: '/guide', icon: '📋', description: 'Plan your trip' },
                { name: 'Wishlist', path: '/wishlist', icon: '❤️', description: 'Saved places' },
            ],
        },
        {
            category: 'Support',
            icon: FaQuestionCircle,
            color: 'cyan',
            items: [
                { name: 'About', path: '/about', icon: 'ℹ️', description: 'About us' },
                { name: 'Contact', path: '/contact', icon: '📧', description: 'Get in touch' },
                { name: 'Help', path: '/help', icon: '❓', description: 'Need help' },
                { name: 'FAQ', path: '/faq', icon: '💭', description: 'Common questions' },
            ],
        },
    ];

    const colorClasses = {
        teal: { bg: { dark: 'bg-teal-600/20', light: 'bg-teal-500/15' }, text: 'text-teal-600 dark:text-teal-400' },
        purple: { bg: { dark: 'bg-purple-600/20', light: 'bg-purple-500/15' }, text: 'text-purple-600 dark:text-purple-400' },
        cyan: { bg: { dark: 'bg-cyan-600/20', light: 'bg-cyan-500/15' }, text: 'text-cyan-600 dark:text-cyan-400' },
    };

    const languages = [
        { code: 'en', flag: '🇬🇧', name: 'English' },
        { code: 'ne', flag: '🇳🇵', name: 'नेपाली' },
        { code: 'hi', flag: '🇮🇳', name: 'हिन्दी' },
        { code: 'zh', flag: '🇨🇳', name: '中文' },
        { code: 'ja', flag: '🇯🇵', name: '日本語' },
        { code: 'ko', flag: '🇰🇷', name: '한국어' },
    ];

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-center w-11 h-11 rounded-xl font-semibold text-sm transition-all duration-300 border backdrop-blur-xl transform-gpu will-change-transform relative overflow-hidden group ${theme === 'dark'
                    ? 'border-slate-700/40 hover:border-teal-600/60 hover:bg-linear-to-br hover:from-slate-800/60 hover:to-slate-700/60 hover:shadow-xl hover:shadow-teal-900/20 hover:scale-105 text-slate-200 hover:text-white'
                    : 'border-slate-200/40 hover:border-teal-500/60 hover:bg-linear-to-br hover:from-white/60 hover:to-slate-50/60 hover:shadow-xl hover:shadow-teal-500/20 hover:scale-105 text-slate-700 hover:text-slate-900'
                    } ${isOpen ? 'border-teal-500/60 bg-teal-500/10' : ''}`}
                title="Navigation Menu"
            >
                <FaBars className={`text-lg transition-all duration-300 ${isOpen ? 'text-teal-500 rotate-90' : ''}`} />
                {isOpen && <div className="absolute inset-0 bg-linear-to-br from-teal-500/10 to-cyan-500/10 rounded-xl" />}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div
                    className={`fixed left-4 top-32 w-80 rounded-2xl backdrop-blur-2xl border shadow-2xl z-60 overflow-hidden ${theme === 'dark'
                        ? 'bg-slate-900/98 border-slate-700/50 shadow-slate-900/60'
                        : 'bg-white/98 border-slate-200/50 shadow-slate-900/20'
                        }`}
                    style={{ maxHeight: 'calc(100vh - 140px)' }}
                >
                    {/* Header */}
                    <div className={`px-5 py-4 border-b ${theme === 'dark'
                        ? 'bg-linear-to-br from-slate-800/60 to-slate-800/40 border-slate-700/50'
                        : 'bg-linear-to-br from-slate-50/80 to-white/80 border-slate-200/50'
                        }`}>
                        <div className="flex items-center gap-3 mb-1">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme === 'dark'
                                ? 'bg-linear-to-br from-teal-600/30 to-cyan-600/20'
                                : 'bg-linear-to-br from-teal-500/20 to-cyan-500/15'
                                }`}>
                                <FaBars className="text-lg text-teal-600 dark:text-teal-400" />
                            </div>
                            <div>
                                <h3 className={`text-base font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                                    Navigation
                                </h3>
                                <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                    Quick access to all features
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable body */}
                    <div
                        className="overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 dark:scrollbar-thumb-slate-400 scrollbar-track-transparent"
                        style={{ maxHeight: 'calc(100vh - 240px)' }}
                    >
                        {/* Location + Language */}
                        <div className={`px-5 py-4 border-b ${theme === 'dark' ? 'border-slate-700/50 bg-slate-800/20' : 'border-slate-200/50 bg-slate-50/30'
                            }`}>
                            {/* Location card */}
                            <div
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl border mb-3 cursor-pointer transition-all duration-300 group hover:scale-[1.02] transform-gpu ${theme === 'dark'
                                    ? 'bg-linear-to-br from-slate-800/60 to-slate-800/40 border-slate-700/50 hover:border-teal-600/50 hover:shadow-lg hover:shadow-teal-900/20'
                                    : 'bg-linear-to-br from-white/80 to-slate-50/60 border-slate-200/50 hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-500/20'
                                    }`}
                                onClick={() => typeof forceRefreshLocation === 'function' && forceRefreshLocation()}
                                title="Click to refresh location"
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${theme === 'dark'
                                    ? 'bg-linear-to-br from-teal-600/30 to-cyan-600/20'
                                    : 'bg-linear-to-br from-teal-500/20 to-cyan-500/15'
                                    }`}>
                                    <FaMapMarkerAlt className="text-base text-teal-600 dark:text-teal-400" />
                                </div>
                                <div className="flex-1">
                                    <div className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                                        Location
                                    </div>
                                    <div className={`text-[10px] font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Click to refresh
                                    </div>
                                </div>
                            </div>

                            {/* Language grid */}
                            <div className={`rounded-xl border overflow-hidden ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200/50'
                                }`}>
                                <div className={`flex items-center gap-3 px-4 py-3 border-b ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200/50'
                                    }`}>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${theme === 'dark'
                                        ? 'bg-linear-to-br from-cyan-600/30 to-blue-600/20'
                                        : 'bg-linear-to-br from-cyan-500/20 to-blue-500/15'
                                        }`}>
                                        <FaGlobe className="text-base text-cyan-600 dark:text-cyan-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                                            Language
                                        </div>
                                        <div className={`text-[10px] font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                            Choose your preference
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3 grid grid-cols-2 gap-2">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => typeof handleLanguageChange === 'function' && handleLanguageChange(lang.code)}
                                            className={`px-3 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 border hover:scale-105 transform-gpu ${selectedLanguage === lang.code
                                                ? theme === 'dark'
                                                    ? 'bg-linear-to-br from-teal-600 to-cyan-600 text-white shadow-lg border-teal-500/50'
                                                    : 'bg-linear-to-br from-teal-500 to-cyan-500 text-white shadow-lg border-teal-400/50'
                                                : theme === 'dark'
                                                    ? 'bg-slate-700/40 text-slate-300 hover:bg-slate-700/60 border-slate-600/40 hover:border-slate-500/60'
                                                    : 'bg-slate-50/40 text-slate-600 hover:bg-slate-100/60 border-slate-200/40 hover:border-slate-300/60'
                                                }`}
                                        >
                                            <span className="text-base">{lang.flag}</span>
                                            <span>{lang.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Menu items */}
                        <div className="p-4">
                            {menuItems.map((category, idx) => (
                                <div key={category.category} className={idx > 0 ? 'mt-5' : ''}>
                                    <div className="flex items-center gap-2.5 mb-3 px-2">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme === 'dark'
                                            ? colorClasses[category.color].bg.dark
                                            : colorClasses[category.color].bg.light
                                            }`}>
                                            <category.icon className={`text-sm ${colorClasses[category.color].text}`} />
                                        </div>
                                        <div className={`text-xs font-black uppercase tracking-wider ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                                            }`}>
                                            {category.category}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        {category.items.map((item) => (
                                            <button
                                                key={item.path || item.name}
                                                onClick={() => handleMenuClick(item)}
                                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-left group border ${theme === 'dark'
                                                    ? 'hover:bg-slate-800/60 text-slate-200 hover:text-white border-transparent hover:border-slate-700/50 hover:shadow-lg'
                                                    : 'hover:bg-slate-50/60 text-slate-700 hover:text-slate-900 border-transparent hover:border-slate-200/50 hover:shadow-md'
                                                    }`}
                                            >
                                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-xl transition-all duration-200 ${theme === 'dark' ? 'bg-slate-800/60 group-hover:bg-slate-700/60' : 'bg-slate-100/60 group-hover:bg-slate-200/60'
                                                    }`}>
                                                    {item.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-semibold text-sm mb-0.5">{item.name}</div>
                                                    <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                                        {item.description}
                                                    </div>
                                                </div>
                                                <svg
                                                    className={`w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 shrink-0 ${theme === 'dark' ? 'text-teal-400' : 'text-teal-600'
                                                        }`}
                                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className={`px-5 py-3 border-t text-center ${theme === 'dark' ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50/60 border-slate-200/50'
                        }`}>
                        <p className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            Roamio Wanderly © 2024
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuBar;