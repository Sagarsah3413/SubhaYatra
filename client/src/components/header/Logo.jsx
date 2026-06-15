import React from 'react';

/**
 * Compact logo — icon + wordmark, no tall layout.
 * Props: onClick, theme
 */
const Logo = ({ onClick, theme }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-2.5 shrink-0 group focus:outline-none"
        aria-label="Go to home"
    >
        {/* Icon */}
        <span className="text-3xl leading-none select-none group-hover:scale-110 transition-transform duration-300">
            🌄
        </span>

        {/* Wordmark */}
        <div className="hidden sm:flex flex-col leading-none">
            <span className={`text-lg font-black tracking-tight bg-linear-to-r bg-clip-text text-transparent ${theme === 'dark'
                ? 'from-teal-300 to-emerald-300'
                : 'from-teal-600 to-emerald-600'
                }`}>
                Subha
            </span>
            <span className={`text-[11px] font-medium tracking-widest uppercase ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`}>
                Yatra
            </span>
        </div>
    </button>
);

export default Logo;