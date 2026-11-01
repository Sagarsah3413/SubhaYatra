import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

/**
 * Clickable location indicator shown in the header.
 *
 * Props:
 *   currentLocation   {string}
 *   isLocationLoading {boolean}
 *   locationError     {string|null}
 *   locationRetryCount {number}
 *   theme             {string}  'dark' | 'light'
 *   onRefresh         {Function}
 */
const LocationBadge = ({
    currentLocation,
    isLocationLoading,
    locationError,
    locationRetryCount = 0,
    theme,
    onRefresh,
}) => (
    <div
        className={`
      hidden lg:flex items-center gap-3 px-5 py-3 rounded-2xl border backdrop-blur-xl
      cursor-pointer transition-all duration-500 group relative overflow-hidden
      ${theme === 'dark'
                ? 'bg-linear-to-br from-[#1A2E4A]/90 via-[#1A2E4A]/80 to-slate-700/70 border-slate-600/50 hover:from-slate-700/95 hover:to-slate-600/80 hover:border-[#2356A0]/60'
                : 'bg-linear-to-br from-white/95 via-white/90 to-slate-50/80 border-slate-300/50 hover:from-white hover:to-slate-100/90 hover:border-[#D97706]/60'
            }
      hover:shadow-2xl hover:shadow-teal-500/30 hover:scale-[1.03] transform-gpu
      before:absolute before:inset-0 before:rounded-2xl before:bg-linear-to-br
      ${theme === 'dark'
                ? 'before:from-[#2356A0]/15 before:via-[#2356A0]/8 before:to-[#166534]/15'
                : 'before:from-[#2356A0]/12 before:via-[#2356A0]/6 before:to-[#166534]/12'
            }
      before:opacity-0 hover:before:opacity-100 before:transition-all before:duration-500
      animate-slide-in-left shadow-lg
    `}
        onClick={onRefresh}
        title="Click to refresh location"
    >
        {/* Tooltip */}
        <div className={`
      absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 rounded-xl
      text-sm font-medium pointer-events-none z-50 min-w-[280px]
      opacity-0 group-hover:opacity-100 transition-all duration-300 delay-500
      ${theme === 'dark'
                ? 'bg-[#0F1B2D]/98 text-slate-100 border border-[#2E4A6B]/60'
                : 'bg-white/98 text-slate-800 border border-slate-200/60'
            }
      backdrop-blur-2xl shadow-2xl
      before:absolute before:top-full before:left-1/2 before:transform before:-translate-x-1/2
      before:border-8 before:border-transparent
      ${theme === 'dark' ? 'before:border-t-slate-900/98' : 'before:border-t-white/98'}
    `}>
            <div className="space-y-2">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-600/30">
                    <FaMapMarkerAlt className="text-[#2356A0]" />
                    <span className="font-bold">Your Location</span>
                </div>
                <div className="text-sm">
                    {isLocationLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                            <span>{locationRetryCount > 0 ? `Retrying (${locationRetryCount}/2)...` : 'Detecting with high accuracy GPS...'}</span>
                        </div>
                    ) : (
                        <>
                            <div className="font-semibold text-[#2356A0]">{currentLocation}</div>
                            <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                Click to refresh • High accuracy mode
                            </div>
                        </>
                    )}
                </div>
                {locationError && (
                    <div className="flex items-center gap-2 text-red-400 text-xs pt-2 border-t border-red-500/20">
                        <span>⚠️</span>
                        <span>{locationError}</span>
                    </div>
                )}
            </div>
        </div>

        {/* Location icon */}
        <div className="relative shrink-0">
            <div className={`
        w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 relative
        ${theme === 'dark'
                    ? 'bg-linear-to-br from-[#2356A0]/40 to-[#1A2E4A]/30 group-hover:from-[#2356A0]/50 group-hover:to-[#1A2E4A]/40'
                    : 'bg-linear-to-br from-[#2356A0]/30 to-[#1A2E4A]/20 group-hover:from-[#2356A0]/40 group-hover:to-[#1A2E4A]/30'
                }
        ${isLocationLoading ? 'animate-pulse' : ''}
        shadow-inner
      `}>
                <FaMapMarkerAlt className={`
          text-base transition-all duration-500
          ${isLocationLoading ? 'text-amber-500 animate-bounce' : locationError ? 'text-red-500' : 'text-[#2356A0] group-hover:text-[#D97706]'}
        `} />
                <div className={`
          absolute inset-0 rounded-xl border-2 transition-all duration-500
          ${isLocationLoading ? 'border-amber-400/60 animate-ping' : 'border-[#2356A0]/0 group-hover:border-[#2356A0]/40'}
        `} />
            </div>

            {/* Status dot */}
            {!isLocationLoading && !locationError && (
                <div className="absolute -top-1 -right-1">
                    <div className="relative w-4 h-4">
                        <div className="absolute inset-0 bg-[#16a34a] rounded-full animate-pulse" />
                        <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                    </div>
                </div>
            )}
            {locationError && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                    !
                </div>
            )}
        </div>

        {/* Location text */}
        <div className="flex flex-col min-w-0 max-w-48 relative">
            <div className="relative overflow-hidden">
                <div className="location-scroll-container">
                    <span className={`
            text-sm font-bold leading-tight whitespace-nowrap inline-block
            ${theme === 'dark' ? 'text-slate-50' : 'text-slate-900'}
            group-hover:text-[#2356A0] dark:group-hover:text-[#F59E0B] transition-colors duration-500
            ${isLocationLoading ? 'animate-pulse' : 'location-scroll-text'}
          `}>
                        {isLocationLoading
                            ? locationRetryCount > 0 ? `Retrying ${locationRetryCount}/2...` : 'Detecting location...'
                            : currentLocation}
                    </span>
                </div>
                {/* Fade edges */}
                <div className={`absolute left-0 top-0 bottom-0 w-4 pointer-events-none z-10 bg-linear-to-r ${theme === 'dark' ? 'from-[#1A2E4A] to-transparent' : 'from-white to-transparent'
                    }`} />
                <div className={`absolute right-0 top-0 bottom-0 w-4 pointer-events-none z-10 bg-linear-to-l ${theme === 'dark' ? 'from-[#1A2E4A] to-transparent' : 'from-white to-transparent'
                    }`} />
            </div>

            <div className="flex items-center gap-2 mt-1">
                <div className={`
          w-1.5 h-1.5 rounded-full transition-all duration-500
          ${isLocationLoading ? 'bg-amber-400 animate-pulse' : locationError ? 'bg-red-400' : 'bg-emerald-400 group-hover:bg-[#E8EFF8]'}
        `} />
                <span className={`
          text-xs font-semibold uppercase tracking-wider opacity-80 group-hover:opacity-100 group-hover:text-[#2356A0] transition-all duration-500
          ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}
        `}>
                    {isLocationLoading ? 'Locating' : locationError ? 'Error' : 'Live GPS'}
                </span>
            </div>
        </div>

        {/* Refresh icon */}
        <div className="shrink-0 ml-2">
            {!isLocationLoading ? (
                <div className={`
          w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-500
          ${theme === 'dark' ? 'bg-[#1E3A5F]/60 group-hover:bg-[#C0392B]/40' : 'bg-slate-200/60 group-hover:bg-[#2356A0]/30'}
          opacity-70 group-hover:opacity-100 transform scale-90 group-hover:scale-100 shadow-sm group-hover:shadow-md
        `}>
                    <svg className="w-4 h-4 text-slate-400 group-hover:text-[#2356A0] transition-all duration-500 group-hover:rotate-180 transform-gpu" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                </div>
            ) : (
                <div className="w-7 h-7 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </div>

        {/* Border glow */}
        <div className={`absolute inset-0 rounded-2xl border-2 transition-all duration-500 pointer-events-none ${theme === 'dark' ? 'border-[#2356A0]/0 group-hover:border-[#2356A0]/40' : 'border-[#D97706]/0 group-hover:border-[#D97706]/50'
            }`} />
        <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-linear-to-br ${theme === 'dark' ? 'from-[#2356A0]/8 via-[#2356A0]/5 to-[#166534]/8' : 'from-[#2356A0]/8 via-[#2356A0]/5 to-[#166534]/8'
            }`} />
    </div>
);

export default LocationBadge;