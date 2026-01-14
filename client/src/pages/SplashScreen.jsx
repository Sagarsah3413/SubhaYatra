import { useState, useEffect, useCallback, memo } from "react";

const SplashScreen = memo(({ onStart }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Optimized loading sequence
  useEffect(() => {
    const intervals = [
      { delay: 200, progress: 25 },
      { delay: 400, progress: 50 },
      { delay: 600, progress: 75 },
      { delay: 800, progress: 100 }
    ];

    const timers = intervals.map(({ delay, progress }) =>
      setTimeout(() => setProgress(progress), delay)
    );

    const finishTimer = setTimeout(() => setIsLoading(false), 1000);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finishTimer);
    };
  }, []);

  // Memoized click handler
  const handleStart = useCallback(() => {
    if (onStart && typeof onStart === 'function') {
      onStart();
    }
  }, [onStart]);

  // Memoized keyboard handler
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !isLoading) {
        e.preventDefault();
        handleStart();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isLoading, handleStart]);

  return (
    <div 
      className="w-full h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center overflow-hidden"
      onClick={!isLoading ? handleStart : undefined}
      role="button"
      tabIndex={!isLoading ? 0 : -1}
      aria-label={!isLoading ? "Start your adventure" : "Loading application"}
    >
      {/* Optimized background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-blue-500/10" />
      
      {/* Main content container */}
      <div className="relative z-10 text-center text-white px-4 max-w-2xl mx-auto">
        {isLoading ? (
          // Loading phase - optimized for performance
          <div className="space-y-6">
            {/* Simple logo container */}
            <div className="w-16 h-16 mx-auto bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-2xl" role="img" aria-label="rocket">🚀</span>
            </div>
            
            {/* Brand title */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight">
                <span className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                  Roamio
                </span>
                <br />
                <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
                  Wanderly
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-cyan-100 font-light">
                Discover Nepal's Hidden Treasures
              </p>
            </div>

            {/* Optimized progress bar */}
            <div className="w-full max-w-sm mx-auto space-y-3">
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </div>
              <div className="flex justify-between text-sm text-cyan-200">
                <span>Loading...</span>
                <span>{progress}%</span>
              </div>
            </div>
          </div>
        ) : (
          // Ready phase - optimized layout
          <div className="space-y-8">
            {/* Hero logo */}
            <div className="w-20 h-20 mx-auto bg-white/30 rounded-2xl flex items-center justify-center backdrop-blur-lg border border-white/20">
              <span className="text-3xl" role="img" aria-label="rocket">🚀</span>
            </div>
            
            {/* Main title and description */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-tight">
                <span className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                  Roamio
                </span>
                <br />
                <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
                  Wanderly
                </span>
              </h1>
              
              <div className="space-y-3">
                <p className="text-xl sm:text-2xl text-cyan-100 font-light">
                  Discover Nepal's Hidden Treasures
                </p>
                <p className="text-base sm:text-lg text-white/80 max-w-xl mx-auto leading-relaxed">
                  From the world's highest peaks to ancient temples, embark on extraordinary adventures 
                  with expert local guidance
                </p>
              </div>
            </div>

            {/* Call to action */}
            <div className="space-y-4">
              <button
                onClick={handleStart}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                aria-label="Start your adventure"
              >
                <span>▶</span>
                <span>Start Your Adventure</span>
                <span>→</span>
              </button>

              <p className="text-white/60 text-sm">
                Click anywhere or press Enter to begin
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

SplashScreen.displayName = 'SplashScreen';

export default SplashScreen;