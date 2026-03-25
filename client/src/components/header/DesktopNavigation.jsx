import React from 'react';
import NavigationItems from './NavigationItems';
import AuthenticationButtons from './AuthenticationButtons';

/**
 * Desktop-only right-side nav bar (hidden on mobile).
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
const DesktopNavigation = ({
    theme,
    onCalendarOpen,
    onNavigation,
    showCalendar,
    triggerRef,
    selectedLanguage,
    onLanguageChange,
}) => (
    <div className="hidden md:flex items-center gap-4 relative z-10">
        {/* Nav items pill */}
        <div className={`
      flex items-center gap-3 px-4 py-2 rounded-2xl border backdrop-blur-xl
      ${theme === 'dark'
                ? 'bg-slate-800/40 border-slate-700/40 hover:bg-slate-700/50'
                : 'bg-white/40 border-slate-200/40 hover:bg-white/60'
            }
      transition-all duration-300 hover:shadow-lg hover:scale-[1.02] transform-gpu
    `}>
            <NavigationItems
                theme={theme}
                onCalendarOpen={onCalendarOpen}
                onNavigation={onNavigation}
                showCalendar={showCalendar}
                triggerRef={triggerRef}
                selectedLanguage={selectedLanguage}
                onLanguageChange={onLanguageChange}
            />
        </div>

        {/* Auth pill */}
        <div className={`
      flex items-center gap-3 px-4 py-2 rounded-2xl border backdrop-blur-xl
      ${theme === 'dark'
                ? 'bg-slate-800/40 border-slate-700/40'
                : 'bg-white/40 border-slate-200/40'
            }
      transition-all duration-300 hover:shadow-lg hover:scale-[1.02] transform-gpu
    `}>
            <AuthenticationButtons onNavigation={onNavigation} theme={theme} />
        </div>
    </div>
);

export default DesktopNavigation;