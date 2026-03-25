import React from 'react';

/**
 * Roamio Wanderly logo with hover animations.
 * Props: onClick, theme
 */
const Logo = ({ onClick, theme }) => (
    <div
        className="flex items-center cursor-pointer group transform-gpu will-change-transform"
        onClick={onClick}
    >
        <div className="relative mr-5">
            <div className={`absolute -inset-3 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 ${theme === 'dark'
                ? 'bg-linear-to-r from-teal-600/30 via-cyan-600/20 to-emerald-600/30'
                : 'bg-linear-to-r from-teal-500/20 via-cyan-500/15 to-emerald-500/20'
                } blur-2xl animate-pulse`} />
            <span className="relative text-5xl font-bold transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 filter drop-shadow-2xl min-w-14 flex items-center justify-center">
                🌄
            </span>
        </div>

        <div className="hidden md:flex flex-col min-w-0">
            <div className="flex items-baseline">
                <span className={`text-3xl font-black tracking-tight bg-linear-to-r ${theme === 'dark'
                    ? 'from-teal-300 via-emerald-300 to-cyan-300'
                    : 'from-teal-600 via-emerald-600 to-cyan-600'
                    } text-transparent bg-clip-text font-sans whitespace-nowrap transition-all duration-500`}>
                    Roamio
                </span>
                <span className={`text-xl font-light ml-3 tracking-wider transition-all duration-500 whitespace-nowrap ${theme === 'dark' ? 'text-slate-300 group-hover:text-slate-100' : 'text-slate-500 group-hover:text-slate-700'
                    }`}>
                    Wanderly
                </span>
            </div>
            <div className={`h-1 w-0 group-hover:w-full transition-all duration-700 ${theme === 'dark'
                ? 'bg-linear-to-r from-teal-400 via-emerald-400 to-cyan-400'
                : 'bg-linear-to-r from-teal-600 via-emerald-600 to-cyan-600'
                } rounded-full shadow-lg`} />
        </div>
    </div>
);

export default Logo;