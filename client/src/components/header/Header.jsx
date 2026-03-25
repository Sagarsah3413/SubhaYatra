import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

// Hooks
import { useLocation } from '../../hooks/useLocation';
import { useCalendar } from '../../hooks/useCalendar';
import { useSearch } from '../../hooks/useSearch';

// Components
import Logo from './Logo.jsx';
import LocationBadge from './LocationBadge.jsx';
import MenuBar from './MenuBar.jsx';
import DesktopNavigation from './DesktopNavigation.jsx';
import CalendarModal from './CalendarModal.jsx';
import SearchModal from './SearchModal.jsx';

// Dev-only debug panel (tree-shaken in production)
import LocationDebugPanel from './LocationDebugPanel';
import { reverseGeocodeWithMaxAccuracy } from '../../services/geocodingService';

export const Header = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { i18n } = useTranslation();
    const { user } = useUser();
    const clerkAvailable = !!user;

    // ── language ──────────────────────────────────────────────────────────────
    const [selectedLanguage, setSelectedLanguage] = React.useState(i18n.language || 'en');

    const handleLanguageChange = (language) => {
        setSelectedLanguage(language);
        i18n.changeLanguage(language);
    };

    // ── hooks ─────────────────────────────────────────────────────────────────
    const {
        currentLocation,
        isLocationLoading,
        locationError,
        locationRetryCount,
        locationDebugInfo,
        showLocationDebug,
        setShowLocationDebug,
        setLocationDebugInfo,
        refresh: refreshLocation,
        addDebugLog,
    } = useLocation(selectedLanguage);

    const {
        showCalendar,
        mobileAnimating,
        calendarRef,
        triggerRef,
        handleCalendarOpen,
        handleCalendarClose,
    } = useCalendar();

    const {
        showSearchModal,
        searchQuery,
        setShowSearchModal,
        setSearchQuery,
        handleSearch,
    } = useSearch();

    // ── navigation ────────────────────────────────────────────────────────────
    const handleNavigation = (path) => navigate(path);
    const handleLogoClick = () => navigate('/');

    // ── render ────────────────────────────────────────────────────────────────
    return (
        <header className={`
      fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out transform-gpu will-change-transform
      ${theme === 'dark'
                ? 'bg-linear-to-r from-slate-950/99 via-slate-900/97 to-slate-950/99 border-slate-700/30'
                : 'bg-linear-to-r from-white/99 via-slate-50/97 to-white/99 border-slate-200/30'
            }
      backdrop-blur-3xl border-b shadow-2xl
      ${theme === 'dark' ? 'shadow-slate-900/60' : 'shadow-slate-900/15'}
      h-28 px-8 sm:px-12 lg:px-16
      flex items-center justify-between
      before:absolute before:inset-0 before:bg-linear-to-r
      ${theme === 'dark'
                ? 'before:from-teal-600/4 before:via-cyan-500/2 before:to-emerald-600/4'
                : 'before:from-teal-500/3 before:via-cyan-400/1 before:to-emerald-500/3'
            }
      before:opacity-0 hover:before:opacity-100 before:transition-all before:duration-1000
      after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px
      after:bg-linear-to-r after:from-transparent after:via-teal-500/30 after:to-transparent
      after:opacity-0 hover:after:opacity-100 after:transition-all after:duration-700
    `}>

            {/* Left: menu + logo + location */}
            <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 relative z-10">
                <MenuBar
                    theme={theme}
                    onNavigation={handleNavigation}
                    forceRefreshLocation={refreshLocation}
                    selectedLanguage={selectedLanguage}
                    handleLanguageChange={handleLanguageChange}
                />

                <Logo onClick={handleLogoClick} theme={theme} />

                <LocationBadge
                    currentLocation={currentLocation}
                    isLocationLoading={isLocationLoading}
                    locationError={locationError}
                    locationRetryCount={locationRetryCount}
                    theme={theme}
                    onRefresh={refreshLocation}
                />
            </div>

            {/* Right: desktop nav */}
            <DesktopNavigation
                theme={theme}
                onCalendarOpen={handleCalendarOpen}
                onNavigation={handleNavigation}
                showCalendar={showCalendar}
                triggerRef={triggerRef}
                selectedLanguage={selectedLanguage}
                onLanguageChange={handleLanguageChange}
            />

            {/* Calendar portal */}
            <CalendarModal
                showCalendar={showCalendar}
                mobileAnimating={mobileAnimating}
                calendarRef={calendarRef}
                onClose={handleCalendarClose}
            />

            {/* Search modal */}
            <SearchModal
                isOpen={showSearchModal}
                onClose={() => setShowSearchModal(false)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={handleSearch}
                theme={theme}
            />

            {/* Debug panel — dev builds only */}
            {import.meta.env.DEV && showLocationDebug && (
                <LocationDebugPanel
                    isLocationLoading={isLocationLoading}
                    currentLocation={currentLocation}
                    locationError={locationError}
                    locationRetryCount={locationRetryCount}
                    locationDebugInfo={locationDebugInfo}
                    setLocationDebugInfo={setLocationDebugInfo}
                    setShowLocationDebug={setShowLocationDebug}
                    selectedLanguage={selectedLanguage}
                    forceRefreshLocation={refreshLocation}
                    reverseGeocodeWithMaxAccuracy={reverseGeocodeWithMaxAccuracy}
                    setCurrentLocation={() => { }} // passed through addDebugLog path
                    addDebugLog={addDebugLog}
                />
            )}
        </header>
    );
};

export default Header;