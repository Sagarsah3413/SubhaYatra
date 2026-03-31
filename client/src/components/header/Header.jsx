import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

// Hooks
import { useLocation } from '../../hooks/useLocation';
import { useCalendar } from '../../hooks/useCalendar';

// Components
import Logo from './Logo.jsx';
import NavLinks from './NavLinks.jsx';
import AuthSection from './AuthSection.jsx';
import CalendarModal from './CalendarModal.jsx';
import SearchBar from '../../pages/SearchBar.jsx';

// Dev-only
import LocationDebugPanel from './LocationDebugPanel';
import { reverseGeocodeWithMaxAccuracy } from '../../services/geocodingService';

export const Header = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { i18n } = useTranslation();
    const { user } = useUser();
    const clerkAvailable = !!user;

    const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || 'en');
    const [showSearch, setShowSearch] = useState(false);

    const handleLanguageChange = (lang) => {
        setSelectedLanguage(lang);
        i18n.changeLanguage(lang);
    };

    const {
        currentLocation, isLocationLoading, locationDebugInfo,
        showLocationDebug, setShowLocationDebug, setLocationDebugInfo,
        locationError, locationRetryCount,
        refresh: refreshLocation, addDebugLog,
    } = useLocation(selectedLanguage);

    const {
        showCalendar, mobileAnimating, calendarRef, triggerRef,
        handleCalendarOpen, handleCalendarClose,
    } = useCalendar();

    return (
        <header className={`
      fixed top-0 left-0 right-0 z-50
      h-16 px-4 sm:px-6 lg:px-10
      flex items-center justify-between gap-4
      border-b backdrop-blur-xl transition-colors duration-300
      ${theme === 'dark'
                ? 'bg-slate-900/95 border-slate-800'
                : 'bg-white/95 border-slate-200'
            }
    `}>

            {/* LEFT ── Logo */}
            <Logo onClick={() => navigate('/')} theme={theme} />

            {/* CENTER ── Search bar (when open) or Nav links */}
            {showSearch ? (
                <div className="flex-1 max-w-xl mx-4">
                    <SearchBar
                        placeholder="Search destinations, hotels, restaurants…"
                        onSearch={() => setShowSearch(false)}
                        className="w-full"
                    />
                </div>
            ) : (
                <NavLinks
                    theme={theme}
                    onNavigation={(path) => navigate(path)}
                    onCalendarOpen={handleCalendarOpen}
                    showCalendar={showCalendar}
                    triggerRef={triggerRef}
                    selectedLanguage={selectedLanguage}
                    onLanguageChange={handleLanguageChange}
                    currentLocation={currentLocation}
                    isLocationLoading={isLocationLoading}
                    onLocationRefresh={refreshLocation}
                />
            )}

            {/* RIGHT ── Auth */}
            <AuthSection
                theme={theme}
                clerkAvailable={clerkAvailable}
                onNavigation={(path) => navigate(path)}
                onSearchOpen={() => setShowSearch(s => !s)}
            />

            {/* Modals */}
            <CalendarModal
                showCalendar={showCalendar}
                mobileAnimating={mobileAnimating}
                calendarRef={calendarRef}
                onClose={handleCalendarClose}
            />

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
                    setCurrentLocation={() => { }}
                    addDebugLog={addDebugLog}
                />
            )}
        </header>
    );
};

export default Header;