import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaMapMarkerAlt, FaGlobe, FaChevronDown, FaSearch } from 'react-icons/fa';
import { SUPPORTED_LANGUAGES } from '../../constants/locationFallbacks';

/**
 * Center navigation bar.
 * - Location pill (compact, no "LIVE GPS" label)
 * - Language dropdown (flag + code only)
 * - Calendar button
 * - About button
 *
 * Props:
 *   theme, onNavigation, onCalendarOpen, showCalendar, triggerRef,
 *   selectedLanguage, onLanguageChange,
 *   currentLocation, isLocationLoading, onLocationRefresh
 */
const NavLinks = ({
    theme,
    onNavigation,
    onCalendarOpen,
    showCalendar,
    triggerRef,
    selectedLanguage,
    onLanguageChange,
    currentLocation,
    isLocationLoading,
    onLocationRefresh,
}) => {
    const { t } = useTranslation();
    const [langOpen, setLangOpen] = useState(false);
    const langRef = useRef(null);

    const selectedLang = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];

    useEffect(() => {
        const handler = (e) => {
            if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Shared nav button style
    const navBtn = (active = false) => `
    flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
    transition-all duration-200 whitespace-nowrap
    ${active
            ? theme === 'dark'
                ? 'bg-slate-700 text-white'
                : 'bg-slate-100 text-slate-900'
            : theme === 'dark'
                ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }
  `;

    return (
        <nav className="hidden md:flex items-center gap-1">

            {/* ── Location pill ─────────────────────────────────────── */}
            <button
                onClick={onLocationRefresh}
                title="Click to refresh location"
                className={`
          flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm
          transition-all duration-200 max-w-[200px] group
          ${theme === 'dark'
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }
        `}
            >
                {isLocationLoading ? (
                    <span className="w-3 h-3 border-2 border-teal-500 border-t-transparent rounded-full animate-spin shrink-0" />
                ) : (
                    <FaMapMarkerAlt className="text-teal-500 shrink-0 text-xs" />
                )}
                <span className="truncate text-xs font-medium">
                    {isLocationLoading ? 'Locating…' : currentLocation}
                </span>
            </button>

            {/* Divider */}
            <span className={`w-px h-4 mx-1 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`} />

            {/* ── Language dropdown ──────────────────────────────────── */}
            <div className="relative" ref={langRef}>
                <button
                    onClick={() => setLangOpen(!langOpen)}
                    className={navBtn(langOpen)}
                    title="Select Language"
                >
                    <span className="text-base leading-none">{selectedLang.flag}</span>
                    <span className="text-xs font-semibold tracking-wide">{selectedLang.code.toUpperCase()}</span>
                    <FaChevronDown className={`text-[10px] transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
                </button>

                {langOpen && (
                    <div className={`
            absolute top-full left-0 mt-2 w-48 rounded-xl border shadow-xl z-50 overflow-hidden
            ${theme === 'dark'
                            ? 'bg-slate-900 border-slate-700'
                            : 'bg-white border-slate-200'
                        }
          `}>
                        {SUPPORTED_LANGUAGES.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => { onLanguageChange(lang.code); setLangOpen(false); }}
                                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors duration-150
                  ${selectedLanguage === lang.code
                                        ? theme === 'dark'
                                            ? 'bg-teal-900/50 text-teal-300'
                                            : 'bg-teal-50 text-teal-700'
                                        : theme === 'dark'
                                            ? 'text-slate-300 hover:bg-slate-800'
                                            : 'text-slate-700 hover:bg-slate-50'
                                    }
                `}
                            >
                                <span className="text-base">{lang.flag}</span>
                                <span className="font-medium">{lang.name}</span>
                                <span className={`ml-auto text-xs ${selectedLanguage === lang.code
                                        ? theme === 'dark' ? 'text-teal-400' : 'text-teal-600'
                                        : theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                                    }`}>
                                    {lang.nativeName}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Divider */}
            <span className={`w-px h-4 mx-1 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`} />

            {/* ── Calendar ───────────────────────────────────────────── */}
            <button
                type="button"
                ref={triggerRef}
                onClick={onCalendarOpen}
                aria-expanded={showCalendar}
                aria-haspopup="dialog"
                className={navBtn(showCalendar)}
            >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                {t('header.calendar', 'Calendar')}
            </button>

            {/* ── About ──────────────────────────────────────────────── */}
            <button
                type="button"
                onClick={() => onNavigation('/about')}
                className={navBtn()}
            >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {t('header.about', 'About')}
            </button>
        </nav>
    );
};

export default NavLinks;