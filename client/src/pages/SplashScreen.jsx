import { useState, useEffect, useCallback, memo } from "react";
import { useTheme } from "../contexts/ThemeContext";

const SplashScreen = memo(({ onStart }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadingPhase, setLoadingPhase] = useState('initializing');
  const [showContent, setShowContent] = useState(false);
  const { theme } = useTheme();

  // Professional loading phases with realistic messages
  const loadingPhases = [
    { phase: 'initializing', message: 'Initializing Roamio Wanderly...', progress: 15 },
    { phase: 'connecting', message: 'Connecting to Nepal travel network...', progress: 35 },
    { phase: 'loading', message: 'Loading destination database...', progress: 60 },
    { phase: 'optimizing', message: 'Optimizing your experience...', progress: 85 },
    { phase: 'ready', message: 'Ready to explore Nepal!', progress: 100 }
  ];

  // Enhanced loading sequence with realistic timing
  useEffect(() => {
    const timers = [];
    
    loadingPhases.forEach((phase, index) => {
      const timer = setTimeout(() => {
        setLoadingPhase(phase.phase);
        setProgress(phase.progress);
      }, index * 800 + 300);
      timers.push(timer);
    });

    // Show content animation
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 100);

    // Finish loading
    const finishTimer = setTimeout(() => {
      setIsLoading(false);
    }, loadingPhases.length * 800 + 1000);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(contentTimer);
      clearTimeout(finishTimer);
    };
  }, []);

  // Memoized click handler
  const handleStart = useCallback(() => {
    if (onStart && typeof onStart === 'function') {
      onStart();
    }
  }, [onStart]);

  // Enhanced keyboard handler
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !isLoading) {
        e.preventDefault();
        handleStart();
      }
      if (e.key === 'Escape' && !isLoading) {
        e.preventDefault();
        handleStart();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isLoading, handleStart]);

  const currentPhase = loadingPhases.find(p => p.phase === loadingPhase) || loadingPhases[0];

  return (
    <div 
      className={`
        w-full h-screen relative overflow-hidden transition-all duration-1000
        ${theme === 'dark' 
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' 
          : 'bg-gradient-to-br from-slate-100 via-white to-slate-50'
        }
      `}
      onClick={!isLoading ? handleStart : undefined}
      role="button"
      tabIndex={!isLoading ? 0 : -1}
      aria-label={!isLoading ? "Start your adventure" : "Loading application"}
    >
      
      {/* Ultra-Premium Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary gradient layer */}
        <div 
          className={`
            absolute inset-0 opacity-30 transition-opacity duration-2000
            ${theme === 'dark'
              ? 'bg-gradient-to-br from-teal-900/20 via-emerald-800/15 to-cyan-900/20'
              : 'bg-gradient-to-br from-teal-50/60 via-emerald-50/40 to-cyan-50/60'
            }
          `}
          style={{
            backgroundSize: '400% 400%',
            animation: 'gradientShift 8s ease-in-out infinite'
          }}
        />
        
        {/* Floating geometric shapes */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`
                absolute rounded-full opacity-10 animate-float
                ${theme === 'dark' ? 'bg-teal-400' : 'bg-teal-600'}
              `}
              style={{
                width: `${60 + i * 20}px`,
                height: `${60 + i * 20}px`,
                left: `${10 + i * 15}%`,
                top: `${10 + i * 12}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${4 + i * 0.5}s`
              }}
            />
          ))}
        </div>
        
        {/* Premium mesh gradient overlay */}
        <div 
          className={`
            absolute inset-0 opacity-20
            ${theme === 'dark'
              ? 'bg-gradient-to-tr from-teal-600/10 via-transparent to-emerald-600/10'
              : 'bg-gradient-to-tr from-teal-500/8 via-transparent to-emerald-500/8'
            }
          `}
        />
      </div>

      {/* Main content container */}
      <div className={`
        relative z-10 flex items-center justify-center min-h-screen px-6
        transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}>
        <div className="text-center max-w-4xl mx-auto">
          
          {isLoading ? (
            // Ultra-Professional Loading Phase
            <div className="space-y-8">
              
              {/* Premium Logo Container */}
              <div className="relative mx-auto w-24 h-24 group">
                {/* Outer rotating ring */}
                <div className={`
                  absolute inset-0 rounded-full border-2 opacity-30 animate-spin-slow
                  ${theme === 'dark' ? 'border-teal-400' : 'border-teal-600'}
                `} style={{ animationDuration: '8s' }} />
                
                {/* Inner pulsing ring */}
                <div className={`
                  absolute inset-2 rounded-full border opacity-60 animate-pulse
                  ${theme === 'dark' ? 'border-emerald-400' : 'border-emerald-600'}
                `} />
                
                {/* Logo container */}
                <div className={`
                  absolute inset-3 rounded-full flex items-center justify-center backdrop-blur-xl border shadow-2xl
                  ${theme === 'dark' 
                    ? 'bg-slate-800/80 border-slate-700/50' 
                    : 'bg-white/80 border-slate-200/50'
                  }
                `}>
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-xl
                    bg-gradient-to-br from-teal-500 via-emerald-500 to-cyan-500
                    transform transition-transform duration-500 group-hover:scale-110
                  `}>
                    R
                  </div>
                </div>
                
                {/* Glow effect */}
                <div className={`
                  absolute inset-0 rounded-full blur-2xl opacity-20 animate-pulse
                  ${theme === 'dark' ? 'bg-teal-400' : 'bg-teal-500'}
                `} />
              </div>

              {/* Professional Brand Identity */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h1 className={`
                    text-4xl sm:text-5xl md:text-6xl font-black leading-none tracking-tight
                    bg-gradient-to-r bg-clip-text text-transparent
                    ${theme === 'dark'
                      ? 'from-white via-teal-100 to-emerald-100'
                      : 'from-slate-900 via-teal-800 to-emerald-800'
                    }
                  `}>
                    Roamio
                  </h1>
                  <div className={`
                    text-lg sm:text-xl md:text-2xl font-light tracking-[0.2em] uppercase
                    ${theme === 'dark' ? 'text-teal-300' : 'text-teal-700'}
                  `}>
                    Wanderly
                  </div>
                </div>
                
                <div className="space-y-3">
                  <p className={`
                    text-base sm:text-lg font-medium
                    ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}
                  `}>
                    Professional Nepal Travel Platform
                  </p>
                  <p className={`
                    text-sm sm:text-base max-w-xl mx-auto leading-relaxed
                    ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}
                  `}>
                    Discover authentic experiences, hidden gems, and cultural treasures 
                    with our expert-curated travel intelligence system
                  </p>
                </div>
              </div>

              {/* Ultra-Professional Progress System */}
              <div className="space-y-4 max-w-sm mx-auto">
                
                {/* Status Message */}
                <div className={`
                  px-6 py-3 rounded-2xl backdrop-blur-xl border
                  ${theme === 'dark' 
                    ? 'bg-slate-800/60 border-slate-700/50' 
                    : 'bg-white/60 border-slate-200/50'
                  }
                `}>
                  <div className="flex items-center justify-between">
                    <span className={`
                      text-sm font-semibold
                      ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}
                    `}>
                      {currentPhase.message}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className={`
                        w-2 h-2 rounded-full animate-pulse
                        ${theme === 'dark' ? 'bg-teal-400' : 'bg-teal-500'}
                      `} />
                      <span className={`
                        text-xs font-mono
                        ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}
                      `}>
                        {progress}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Premium Progress Bar */}
                <div className="space-y-3">
                  <div className={`
                    w-full h-3 rounded-full overflow-hidden backdrop-blur-sm
                    ${theme === 'dark' ? 'bg-slate-800/40' : 'bg-slate-200/40'}
                  `}>
                    <div 
                      className={`
                        h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden
                        bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500
                      `}
                      style={{ width: `${progress}%` }}
                      role="progressbar"
                      aria-valuenow={progress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    </div>
                  </div>
                  
                  {/* Progress indicators */}
                  <div className="flex justify-between">
                    {loadingPhases.slice(0, -1).map((phase, index) => (
                      <div
                        key={phase.phase}
                        className={`
                          w-3 h-3 rounded-full transition-all duration-500
                          ${progress >= phase.progress
                            ? theme === 'dark' ? 'bg-teal-400' : 'bg-teal-500'
                            : theme === 'dark' ? 'bg-slate-700' : 'bg-slate-300'
                          }
                        `}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Ultra-Professional Ready Phase
            <div className="space-y-8 animate-fade-in">
              
              {/* Hero Logo */}
              <div className="relative mx-auto w-28 h-28 group cursor-pointer" onClick={handleStart}>
                {/* Outer glow */}
                <div className={`
                  absolute inset-0 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500
                  ${theme === 'dark' ? 'bg-teal-400' : 'bg-teal-500'}
                `} />
                
                {/* Main container */}
                <div className={`
                  absolute inset-0 rounded-full backdrop-blur-2xl border-2 shadow-2xl transition-all duration-500 group-hover:scale-105
                  ${theme === 'dark' 
                    ? 'bg-slate-800/90 border-slate-700/50 hover:border-teal-500/50' 
                    : 'bg-white/90 border-slate-200/50 hover:border-teal-500/50'
                  }
                `}>
                  <div className="absolute inset-4 rounded-xl bg-gradient-to-br from-teal-500 via-emerald-500 to-cyan-500 flex items-center justify-center text-white font-black text-2xl shadow-xl">
                    R
                  </div>
                </div>
                
                {/* Rotating ring */}
                <div className={`
                  absolute inset-0 rounded-full border-2 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-spin-slow
                  ${theme === 'dark' ? 'border-teal-400/50' : 'border-teal-500/50'}
                `} />
              </div>

              {/* Main Brand Section */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <h1 className={`
                    text-5xl sm:text-6xl md:text-7xl font-black leading-none tracking-tight
                    bg-gradient-to-r bg-clip-text text-transparent
                    ${theme === 'dark'
                      ? 'from-white via-teal-100 to-emerald-100'
                      : 'from-slate-900 via-teal-800 to-emerald-800'
                    }
                  `}>
                    Roamio
                  </h1>
                  <div className={`
                    text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.3em] uppercase
                    ${theme === 'dark' ? 'text-teal-300' : 'text-teal-700'}
                  `}>
                    Wanderly
                  </div>
                </div>
                
                <div className="space-y-4">
                  <p className={`
                    text-lg sm:text-xl font-medium
                    ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}
                  `}>
                    Professional Nepal Travel Platform
                  </p>
                  <p className={`
                    text-base sm:text-lg max-w-2xl mx-auto leading-relaxed
                    ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}
                  `}>
                    Experience Nepal like never before with our AI-powered travel intelligence, 
                    expert local insights, and personalized journey recommendations
                  </p>
                </div>
              </div>

              {/* Premium Call to Action */}
              <div className="space-y-6">
                <button
                  onClick={handleStart}
                  className={`
                    group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg
                    bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 text-white
                    hover:from-teal-500 hover:via-emerald-500 hover:to-cyan-500
                    shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105
                    focus:outline-none focus:ring-4 focus:ring-teal-500/50 focus:ring-offset-4
                    ${theme === 'dark' ? 'focus:ring-offset-slate-900' : 'focus:ring-offset-white'}
                    overflow-hidden
                  `}
                  aria-label="Begin your Nepal adventure"
                >
                  {/* Button background effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  {/* Button content */}
                  <div className="relative flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="tracking-wide">Begin Your Journey</span>
                    <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse" />
                  </div>
                </button>

                {/* Professional Instructions */}
                <div className="space-y-2">
                  <p className={`
                    text-sm font-medium
                    ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}
                  `}>
                    Click anywhere • Press Enter • Press Space
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-xs">
                    <div className={`
                      flex items-center space-x-1 px-2 py-1 rounded
                      ${theme === 'dark' ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-100/50 text-slate-600'}
                    `}>
                      <kbd className="px-1 py-0.5 bg-white/10 rounded text-xs font-mono">Enter</kbd>
                      <span>Start</span>
                    </div>
                    <div className={`
                      flex items-center space-x-1 px-2 py-1 rounded
                      ${theme === 'dark' ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-100/50 text-slate-600'}
                    `}>
                      <kbd className="px-1 py-0.5 bg-white/10 rounded text-xs font-mono">Esc</kbd>
                      <span>Skip</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

SplashScreen.displayName = 'SplashScreen';

export default SplashScreen;