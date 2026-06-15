import React, { useState } from 'react';
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
import NavLinks from './NavLinks.jsx';
import AuthSection from './AuthSection.jsx';
import CalendarModal from './CalendarModal.jsx';
import SearchModal from './SearchModal.jsx';

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

    const {
        showSearchModal, searchQuery, setShowSearchModal, setSearchQuery, handleSearch,
    } = useSearch();

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

            {/* CENTER ── Nav links */}
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

            {/* RIGHT ── Auth */}
            <AuthSection
                theme={theme}
                clerkAvailable={clerkAvailable}
                onNavigation={(path) => navigate(path)}
                onSearchOpen={() => setShowSearchModal(true)}
            />

            {/* Modals */}
            <CalendarModal
                showCalendar={showCalendar}
                mobileAnimating={mobileAnimating}
                calendarRef={calendarRef}
                onClose={handleCalendarClose}
            />
            <SearchModal
                isOpen={showSearchModal}
                onClose={() => setShowSearchModal(false)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={handleSearch}
                theme={theme}
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