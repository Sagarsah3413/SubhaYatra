import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import NepaliCalendar from '../../pages/NepaliCalendar';

/**
 * Portal-rendered Nepali calendar modal with slide-up animation.
 *
 * Props:
 *   showCalendar      {boolean}
 *   mobileAnimating   {boolean}
 *   calendarRef       {React.RefObject}
 *   onClose           {Function}
 */
const CalendarModal = ({ showCalendar, mobileAnimating, calendarRef, onClose }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedView, setSelectedView] = useState('calendar');
    const [quickDate, setQuickDate] = useState('');
    const [selectedTimeZone, setSelectedTimeZone] = useState('Asia/Kathmandu');
    const [jumpError, setJumpError] = useState('');
    const [isJumping, setIsJumping] = useState(false);
    const [jumpToDate, setJumpToDate] = useState(null);

    // Live clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!showCalendar) return null;

    // ── helpers ───────────────────────────────────────────────────────────────
    const formatTime = (date) =>
        date.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const validateDateInput = (dateString) => {
        if (!dateString?.trim()) return { isValid: false, errorMessage: 'Please enter a date' };
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return { isValid: false, errorMessage: 'Invalid date format' };
            const year = date.getFullYear();
            if (year < 1900 || year > 2100) return { isValid: false, errorMessage: 'Date must be between 1900 and 2100' };
            return { isValid: true, parsedDate: date };
        } catch {
            return { isValid: false, errorMessage: 'Invalid date format' };
        }
    };

    const handleQuickDateJump = () => {
        if (!quickDate) { setJumpError('Please enter a date'); return; }
        const validation = validateDateInput(quickDate);
        if (!validation.isValid) { setJumpError(validation.errorMessage); return; }
        setJumpError('');
        setIsJumping(true);
        setJumpToDate(validation.parsedDate);
    };

    const handleQuickDateChange = (e) => {
        setQuickDate(e.target.value);
        if (jumpError) setJumpError('');
    };

    const handleJumpComplete = () => { setIsJumping(false); setJumpToDate(null); };
    const handleJumpError = (err) => { setIsJumping(false); setJumpToDate(null); setJumpError(err || 'Failed to navigate to date'); };

    // ── JSX ───────────────────────────────────────────────────────────────────
    const modalContent = (
        <div
            className="fixed inset-0 flex items-center justify-center backdrop-blur-2xl bg-black/10"
            style={{
                zIndex: 99999,
                backgroundImage: `
          radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(255,255,255,0.06) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(255,255,255,0.04) 0%, transparent 50%)
        `,
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="nepali-calendar-title"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-linear-to-br from-black/70 via-black/50 to-black/70"
                onClick={onClose}
                style={{
                    backgroundImage: `
            linear-gradient(135deg, rgba(0,0,0,0.1) 0%, transparent 50%, rgba(0,0,0,0.1) 100%),
            radial-gradient(ellipse at top left, rgba(255,255,255,0.1) 0%, transparent 70%),
            radial-gradient(ellipse at bottom right, rgba(255,255,255,0.05) 0%, transparent 70%)
          `,
                }}
            />

            {/* Modal card */}
            <div
                ref={calendarRef}
                className={`relative w-full max-w-2xl mx-6 transform transition-all duration-700 ease-out ${mobileAnimating
                    ? 'translate-y-0 opacity-100 scale-100 rotate-0 blur-0'
                    : 'translate-y-16 opacity-0 scale-90 rotate-2 blur-sm'
                    }`}
                style={{
                    zIndex: 100000,
                    marginTop: '-1vh',
                    filter: mobileAnimating
                        ? 'drop-shadow(0 40px 80px rgba(0,0,0,0.4))'
                        : 'drop-shadow(0 20px 40px rgba(0,0,0,0.2))',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative bg-white/98 backdrop-blur-3xl rounded-4xl border-2 border-white/30 overflow-hidden shadow-2xl ring-1 ring-black/5">
                    <div className="absolute -inset-1 bg-linear-to-r from-white/20 via-white/10 to-white/20 rounded-4xl blur-xl opacity-50 -z-10" />

                    {/* Header */}
                    <div className="relative bg-linear-to-r from-slate-50/95 via-white/98 to-slate-50/95 backdrop-blur-2xl border-b border-white/40">
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-slate-400/60 to-transparent" />
                        <div className="absolute inset-0 bg-linear-to-b from-white/50 via-transparent to-transparent pointer-events-none" />

                        <div className="relative px-6 py-3 border-b border-slate-200/40">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="relative group">
                                        <div className="w-8 h-8 bg-linear-to-br from-slate-600 via-slate-700 to-slate-900 rounded-xl flex items-center justify-center shadow-lg ring-1 ring-slate-900/20">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="space-y-0.5">
                                        <h2 id="nepali-calendar-title" className="text-sm font-bold text-slate-900 tracking-tight leading-none font-serif">
                                            Nepali Calendar
                                        </h2>
                                        <p className="text-xs font-medium text-slate-600 leading-none">Professional System</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <div className="flex items-center space-x-1.5">
                                        <div className="flex items-center space-x-1 px-2 py-0.5 bg-slate-100/60 rounded">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                            <span className="text-xs font-medium text-slate-500">Live</span>
                                        </div>
                                        <div className="flex items-center space-x-1 px-2 py-0.5 bg-slate-100/60 rounded">
                                            <svg className="w-2.5 h-2.5 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-xs font-mono text-slate-600">{formatTime(currentTime)}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={onClose}
                                        className="group relative w-7 h-7 rounded-lg bg-slate-100/90 hover:bg-slate-200/90 border border-slate-200/60 hover:border-slate-300/60 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm hover:shadow-md"
                                        aria-label="Close calendar"
                                    >
                                        <svg className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-800 transition-all duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Toolbar */}
                        <div className="px-6 py-2 bg-linear-to-r from-slate-50/80 via-white/90 to-slate-50/80 border-b border-slate-200/30">
                            <div className="flex items-center justify-between text-xs">
                                {/* View toggle */}
                                <div className="flex items-center space-x-1">
                                    <span className="text-xs font-medium text-slate-600 mr-1">View:</span>
                                    <button
                                        onClick={() => setSelectedView('calendar')}
                                        className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${selectedView === 'calendar'
                                            ? 'bg-slate-200/80 text-slate-800 shadow-sm'
                                            : 'text-slate-600 hover:bg-slate-100/60 hover:text-slate-800'
                                            }`}
                                    >
                                        <span className="mr-1">📅</span>Cal
                                    </button>
                                </div>

                                {/* Date jump */}
                                <div className="flex items-center space-x-1">
                                    <span className="text-xs font-medium text-slate-600">Jump:</span>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={quickDate}
                                            onChange={handleQuickDateChange}
                                            onKeyDown={(e) => e.key === 'Enter' && handleQuickDateJump()}
                                            className={`px-2 py-0.5 text-xs border rounded bg-white/80 focus:outline-none focus:ring-1 w-24 ${jumpError ? 'border-red-300 focus:ring-red-300/50' : 'border-slate-200 focus:ring-slate-300/50'
                                                }`}
                                            aria-label="Select date to jump to"
                                        />
                                        {jumpError && (
                                            <div className="absolute top-full left-0 mt-1 px-2 py-1 bg-red-100 border border-red-300 rounded text-xs text-red-700 whitespace-nowrap z-10 shadow-lg" role="alert">
                                                {jumpError}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleQuickDateJump}
                                        disabled={isJumping}
                                        className={`px-2 py-0.5 text-white text-xs font-medium rounded transition-colors duration-200 ${isJumping ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-600 hover:bg-slate-700'
                                            }`}
                                        aria-label="Jump to selected date"
                                    >
                                        {isJumping ? '...' : 'Go'}
                                    </button>
                                </div>

                                {/* Timezone */}
                                <div className="flex items-center space-x-1">
                                    <select
                                        value={selectedTimeZone}
                                        onChange={(e) => setSelectedTimeZone(e.target.value)}
                                        className="px-2 py-0.5 text-xs border border-slate-200 rounded bg-white/80 focus:outline-none focus:ring-1 focus:ring-slate-300/50"
                                    >
                                        <option value="Asia/Kathmandu">NPT</option>
                                        <option value="UTC">UTC</option>
                                        <option value="America/New_York">EST</option>
                                        <option value="Europe/London">GMT</option>
                                        <option value="Asia/Tokyo">JST</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Calendar content */}
                    <div className="relative p-3 bg-linear-to-b from-white/50 via-transparent to-white/30">
                        <div className="absolute inset-0 rounded-b-4xl shadow-inner pointer-events-none opacity-30" />
                        <div className="relative bg-white/20 rounded-xl p-2 backdrop-blur-sm">
                            {selectedView === 'calendar' && (
                                <NepaliCalendar
                                    full
                                    mobile={false}
                                    onClose={onClose}
                                    jumpToDate={jumpToDate}
                                    onJumpComplete={handleJumpComplete}
                                    onJumpError={handleJumpError}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default CalendarModal;