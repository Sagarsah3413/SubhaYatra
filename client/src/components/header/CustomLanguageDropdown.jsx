import React, { useState, useRef, useEffect } from 'react';
import { FaGlobe } from 'react-icons/fa';
import { SUPPORTED_LANGUAGES } from '../../constants/locationFallbacks';

/**
 * Dropdown for selecting the UI language.
 *
 * Props:
 *   selectedLanguage  {string}    BCP-47 code, e.g. 'en'
 *   onLanguageChange  {Function}  called with the new language code
 *   theme             {string}    'dark' | 'light'
 */
const CustomLanguageDropdown = ({ selectedLanguage, onLanguageChange, theme }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedLang = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (code) => {
        onLanguageChange(code);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center space-x-2 font-semibold text-sm transition-colors duration-300 min-w-20 ${theme === 'dark' ? 'text-slate-100 hover:text-white' : 'text-slate-700 hover:text-slate-900'
                    }`}
                title="Select Language"
            >
                <span>{selectedLang.flag}</span>
                <span>{selectedLang.code.toUpperCase()}</span>
                <svg
                    className={`w-3 h-3 text-slate-500 transition-all duration-300 ${isOpen ? 'rotate-180 text-[#2356A0]' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className={`absolute top-full right-0 mt-2 w-64 rounded-2xl backdrop-blur-2xl border shadow-2xl z-50 overflow-hidden ${theme === 'dark'
                    ? 'bg-[#0F1B2D]/95 border-[#2E4A6B]/50'
                    : 'bg-white/95 border-slate-200/50'
                    }`}>
                    {/* Header */}
                    <div className={`px-4 py-3 border-b ${theme === 'dark'
                        ? 'bg-linear-to-r from-[#1A2E4A]/60 to-slate-700/60 border-[#2E4A6B]/50'
                        : 'bg-linear-to-r from-slate-50/80 to-gray-50/80 border-slate-200/50'
                        }`}>
                        <div className="flex items-center space-x-2">
                            <FaGlobe className="text-[#2356A0] text-sm" />
                            <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                                Choose Language
                            </span>
                        </div>
                    </div>

                    {/* Options */}
                    <div className="py-2 max-h-80 overflow-y-auto">
                        {SUPPORTED_LANGUAGES.map((language) => (
                            <button
                                key={language.code}
                                onClick={() => handleSelect(language.code)}
                                className={`w-full px-4 py-3 text-left transition-all duration-200 flex items-center space-x-3 group ${selectedLanguage === language.code
                                    ? theme === 'dark'
                                        ? 'bg-linear-to-r from-[#2356A0]/50 to-[#1A2E4A]/50 text-white border-l-4 border-[#D97706]'
                                        : 'bg-linear-to-r from-[#2356A0]/80 to-[#1A2E4A]/80 text-[#2356A0] border-l-4 border-[#2356A0]'
                                    : theme === 'dark'
                                        ? 'text-slate-300 hover:bg-[#1A2E4A]/60 hover:text-white'
                                        : 'text-slate-700 hover:bg-slate-50/80 hover:text-slate-900'
                                    }`}
                            >
                                <span className="text-xl">{language.flag}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-sm">{language.name}</span>
                                        <span className="text-xs font-medium opacity-75">{language.code.toUpperCase()}</span>
                                    </div>
                                    <div className={`text-xs mt-0.5 ${selectedLanguage === language.code
                                        ? theme === 'dark' ? 'text-[#2356A0]' : 'text-[#2356A0]'
                                        : theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                                        }`}>
                                        {language.nativeName}
                                    </div>
                                </div>
                                {selectedLanguage === language.code && (
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#2356A0] text-white">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className={`px-4 py-2 border-t text-center ${theme === 'dark' ? 'bg-[#1A2E4A]/40 border-[#2E4A6B]/50' : 'bg-slate-50/60 border-slate-200/50'
                        }`}>
                        <span className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            More languages coming soon
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomLanguageDropdown;