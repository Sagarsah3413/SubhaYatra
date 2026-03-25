import React from 'react';
import { useTranslation } from 'react-i18next';
import CustomLanguageDropdown from './CustomLanguageDropdown';
import FeaturesBox from './FeaturesBox';

/**
 * Desktop nav items row: language picker | separator | features | calendar | about.
 *
 * Props:
 *   theme             {string}
 *   onCalendarOpen    {Function}
 *   onNavigation      {Function}
 *   showCalendar      {boolean}
 *   triggerRef        {React.RefObject}
 *   selectedLanguage  {string}
 *   onLanguageChange  {Function}
 */
const NavigationItems = ({
    theme,
    onCalendarOpen,
    onNavigation,
    showCalendar,
    triggerRef,
    selectedLanguage,
    onLanguageChange,
}) => {
    const { t } = useTranslation();

    return (
        <div className="flex items-center gap-3">
            {/* Language selector */}
            <div className="relative">
                <CustomLanguageDropdown
                    selectedLanguage={selectedLanguage}
                    onLanguageChange={onLanguageChange}
                    theme={theme}
                />
            </div>

            {/* Separator */}
            <div className={`w-px h-6 relative ${theme === 'dark' ? 'bg-slate-600/50' : 'bg-slate-300/50'}`}>
                <div className={`absolute inset-0 w-px bg-linear-to-b from-transparent ${theme === 'dark' ? 'via-teal-400/30' : 'via-teal-500/30'
                    } to-transparent`} />
            </div>

            {/* Features */}
            <div className="relative">
                <FeaturesBox theme={theme} onNavigation={onNavigation} />
            </div>

            {/* Calendar */}
            <button
                type="button"
                ref={triggerRef}
                onClick={onCalendarOpen}
                className={`
          group relative px-4 py-2.5 rounded-xl font-medium transition-all duration-300
          border backdrop-blur-xl transform-gpu will-change-transform overflow-hidden
          ${theme === 'dark'
                        ? 'border-teal-700/40 hover:border-teal-600/70 text-teal-100 hover:text-white hover:bg-linear-to-r hover:from-teal-900/50 hover:to-cyan-900/50'
                        : 'border-teal-200/40 hover:border-teal-300/70 text-teal-700 hover:text-teal-900 hover:bg-linear-to-r hover:from-teal-50/50 hover:to-cyan-50/50'
                    }
          hover:shadow-xl hover:scale-105 btn-professional
          ${showCalendar ? 'ring-2 ring-teal-500/50 bg-teal-500/10' : ''}
        `}
                aria-expanded={showCalendar}
                aria-haspopup="dialog"
                aria-label="Open Nepali Calendar"
                title="Nepali Calendar"
            >
                <span className="flex items-center gap-2.5 relative z-10">
                    <div className={`p-1.5 rounded-lg transition-all duration-300 ${theme === 'dark' ? 'bg-teal-800/30 group-hover:bg-teal-700/50' : 'bg-teal-100/50 group-hover:bg-teal-200/70'
                        }`}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <span className="font-semibold">{t('header.calendar')}</span>
                </span>
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-r ${theme === 'dark' ? 'from-teal-600/10 to-cyan-600/10' : 'from-teal-500/5 to-cyan-500/5'
                    }`} />
            </button>

            {/* About */}
            <button
                type="button"
                onClick={() => onNavigation('/about')}
                className={`
          group relative px-4 py-2.5 rounded-xl font-medium transition-all duration-300
          border backdrop-blur-xl transform-gpu will-change-transform overflow-hidden
          ${theme === 'dark'
                        ? 'border-slate-700/40 hover:border-slate-600/70 text-slate-200 hover:text-white hover:bg-linear-to-r hover:from-slate-800/50 hover:to-slate-700/50'
                        : 'border-slate-200/40 hover:border-slate-300/70 text-slate-700 hover:text-slate-900 hover:bg-linear-to-r hover:from-slate-50/50 hover:to-slate-100/50'
                    }
          hover:shadow-xl hover:scale-105 btn-professional
        `}
                title="About Us"
            >
                <span className="flex items-center gap-2.5 relative z-10">
                    <div className={`p-1.5 rounded-lg transition-all duration-300 ${theme === 'dark' ? 'bg-slate-700/30 group-hover:bg-slate-600/50' : 'bg-slate-100/50 group-hover:bg-slate-200/70'
                        }`}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <span className="font-semibold">{t('header.about')}</span>
                </span>
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-r ${theme === 'dark' ? 'from-slate-600/10 to-slate-500/10' : 'from-slate-400/5 to-slate-300/5'
                    }`} />
            </button>
        </div>
    );
};

export default NavigationItems;