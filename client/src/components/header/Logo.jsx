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
                    ? 'from-[#93B8DC] to-[#F59E0B]'
                    : 'from-[#1A2E4A] to-[#2356A0]'
                }`}>
                SubhaYatra
            </span>
        </div>
    </button>
);

export default Logo;