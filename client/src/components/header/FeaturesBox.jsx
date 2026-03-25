import React, { useState, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

/**
 * "Features" dropdown button in the desktop nav.
 *
 * Props:
 *   theme        {string}
 *   onNavigation {Function}
 */
const FeaturesBox = ({ theme, onNavigation }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const featureCategories = [
        {
            title: 'Core Features',
            icon: '🎯',
            color: 'from-teal-500 to-cyan-500',
            features: [
                { name: 'Add Place', path: '/add-place', icon: '➕', description: 'Share your discovery' },
                { name: 'My Wishlist', path: '/wishlist', icon: '❤️', description: 'Saved places' },
            ],
        },
    ];

    const handleFeatureClick = (feature) => {
        if (feature.action) feature.action();
        else if (feature.path) onNavigation(feature.path);
        setIsOpen(false);
    };

    const totalFeatures = featureCategories.reduce((t, c) => t + c.features.length, 0);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 border backdrop-blur-xl transform-gpu will-change-transform relative overflow-hidden group ${theme === 'dark'
                    ? 'border-teal-700/40 hover:border-teal-600/70 hover:bg-linear-to-r hover:from-teal-900/50 hover:to-cyan-900/50 hover:shadow-xl hover:shadow-teal-900/30 hover:scale-105 text-teal-100 hover:text-white'
                    : 'border-teal-200/40 hover:border-teal-300/70 hover:bg-linear-to-r hover:from-teal-50/50 hover:to-cyan-50/50 hover:shadow-xl hover:shadow-teal-200/30 hover:scale-105 text-teal-700 hover:text-teal-900'
                    } before:absolute before:inset-0 before:bg-linear-to-r ${theme === 'dark' ? 'before:from-teal-600/10 before:to-cyan-600/10' : 'before:from-teal-500/5 before:to-cyan-500/5'
                    } before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300`}
                title="Explore All Features"
            >
                <span className="text-lg">🌟</span>
                <span>Features</span>
                <svg
                    className={`w-4 h-4 transition-all duration-300 ${isOpen ? 'rotate-180 text-teal-500' : 'text-slate-500 hover:text-teal-500'}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className={`absolute top-full right-0 mt-2 w-[400px] max-w-[90vw] rounded-2xl backdrop-blur-2xl border shadow-2xl z-50 overflow-hidden ${theme === 'dark' ? 'bg-slate-900/95 border-slate-700/50' : 'bg-white/95 border-slate-200/50'
                    }`}>
                    {/* Header */}
                    <div className={`px-6 py-4 border-b ${theme === 'dark'
                        ? 'bg-linear-to-r from-slate-800/60 to-slate-700/60 border-slate-700/50'
                        : 'bg-linear-to-r from-slate-50/80 to-gray-50/80 border-slate-200/50'
                        }`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-linear-to-br from-teal-500/20 to-cyan-500/20 rounded-xl">
                                    <span className="text-2xl">🌟</span>
                                </div>
                                <div>
                                    <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                                        Features
                                    </h3>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Essential Nepal travel tools
                                    </p>
                                </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${theme === 'dark'
                                ? 'bg-teal-900/50 text-teal-300 border border-teal-700/50'
                                : 'bg-teal-50/80 text-teal-700 border border-teal-200/50'
                                }`}>
                                {totalFeatures} Features
                            </div>
                        </div>
                    </div>

                    {/* Feature grid */}
                    <div className="p-6 max-h-[70vh] overflow-y-auto">
                        {featureCategories.map((category, idx) => (
                            <div key={idx} className="space-y-3">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className={`p-2 rounded-lg bg-linear-to-r ${category.color}/20`}>
                                        <span className="text-lg">{category.icon}</span>
                                    </div>
                                    <h4 className={`font-bold text-sm ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                                        {category.title}
                                    </h4>
                                </div>

                                <div className="space-y-2">
                                    {category.features.map((feature, fIdx) => (
                                        <button
                                            key={fIdx}
                                            onClick={() => handleFeatureClick(feature)}
                                            className={`w-full p-4 text-left rounded-xl transition-all duration-200 flex items-center space-x-4 group hover:scale-[1.02] ${theme === 'dark'
                                                ? 'hover:bg-slate-800/50 text-slate-300 hover:text-white border border-slate-700/30 hover:border-slate-600/50'
                                                : 'hover:bg-slate-50/70 text-slate-600 hover:text-slate-900 border border-slate-200/30 hover:border-slate-300/50'
                                                }`}
                                        >
                                            <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-linear-to-r ${category.color}/20 group-hover:scale-105 transition-transform duration-200`}>
                                                <span className="text-xl">{feature.icon}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-base mb-1">{feature.name}</div>
                                                <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    {feature.description}
                                                </div>
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className={`px-6 py-4 border-t text-center ${theme === 'dark' ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50/60 border-slate-200/50'
                        }`}>
                        <div className="flex items-center justify-center space-x-4 text-sm">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>Core features active</span>
                            </div>
                            <div className="w-px h-4 bg-slate-300 dark:bg-slate-600" />
                            <div className="flex items-center space-x-2">
                                <span className="text-lg">🎯</span>
                                <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>Essential tools only</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeaturesBox;