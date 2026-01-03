import { useState, useEffect, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext";
import {
  FaPlay,
  FaArrowRight,
  FaMountain,
  FaGlobe,
  FaCompass,
  FaRoute,
  FaMapMarkerAlt,
  FaStar,
  FaHeart,
  FaCamera,
  FaPlane,
  FaTree,
  FaSun,
  FaMoon,
  FaSnowflake,
  FaLeaf,
  FaWater,
  FaFire,
  FaWind,
  FaCloud,
  FaBolt,
  FaRocket,
  FaGem,
  FaMagic
} from "react-icons/fa";

const SplashScreen = ({ onStart }) => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [animationPhase, setAnimationPhase] = useState('loading'); // loading, ready, exit
  const [particles, setParticles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const audioRef = useRef(null);

  // Initialize particles
  useEffect(() => {
    const particleIcons = [
      FaMountain, FaGlobe, FaCompass, FaRoute, FaMapMarkerAlt, FaStar,
      FaHeart, FaCamera, FaPlane, FaTree, FaSun, FaMoon, FaSnowflake,
      FaLeaf, FaWater, FaFire, FaWind, FaCloud, FaBolt, FaGem
    ];

    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      icon: particleIcons[Math.floor(Math.random() * particleIcons.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      opacity: Math.random() * 0.6 + 0.2,
      speed: Math.random() * 2 + 0.5,
      direction: Math.random() * 360,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 4,
      color: ['text-blue-400', 'text-teal-400', 'text-emerald-400', 'text-cyan-400', 'text-indigo-400'][Math.floor(Math.random() * 5)]
    }));

    setParticles(newParticles);
  }, []);

  // Loading simulation
  useEffect(() => {
    const loadingSteps = [
      { progress: 25, delay: 200, message: "Initializing adventure..." },
      { progress: 50, delay: 300, message: "Loading destinations..." },
      { progress: 75, delay: 250, message: "Preparing experiences..." },
      { progress: 100, delay: 200, message: "Ready to explore!" }
    ];

    let currentStep = 0;
    const runLoadingStep = () => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep];
        setTimeout(() => {
          setLoadingProgress(step.progress);
          if (step.progress === 100) {
            setTimeout(() => {
              setIsLoading(false);
              setShowContent(true);
              setAnimationPhase('ready');
            }, 400);
          } else {
            currentStep++;
            runLoadingStep();
          }
        }, step.delay);
      }
    };

    runLoadingStep();
  }, []);

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 2
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Particle animation
  useEffect(() => {
    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + Math.cos(particle.direction * Math.PI / 180) * particle.speed * 0.1) % 100,
        y: (particle.y + Math.sin(particle.direction * Math.PI / 180) * particle.speed * 0.1) % 100,
        rotation: particle.rotation + particle.rotationSpeed
      })));
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  // Handle start with animation
  const handleStart = () => {
    console.log("SplashScreen handleStart called");
    setAnimationPhase('exit');
    
    // Play sound effect (optional)
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // Ignore audio play errors
      });
    }

    // Ensure the onStart callback is called after animation
    setTimeout(() => {
      console.log("Calling onStart callback");
      if (onStart && typeof onStart === 'function') {
        onStart();
      } else {
        console.error("onStart is not a function:", onStart);
      }
    }, 800);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!isLoading) {
          handleStart();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isLoading]);

  return (
    <div
      ref={containerRef}
      className={`
        relative w-full h-screen overflow-hidden cursor-pointer
        transition-all duration-1000
        ${animationPhase === 'exit' ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}
      `}
      onClick={!isLoading ? () => {
        console.log("Splash screen clicked, isLoading:", isLoading);
        handleStart();
      } : () => console.log("Splash screen clicked but still loading")}
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        {/* Base Gradient */}
        <div className={`
          absolute inset-0 transition-all duration-1000
          ${theme === 'dark'
            ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900'
            : 'bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600'
          }
        `}></div>

        {/* Animated Gradient Overlay */}
        <div className={`
          absolute inset-0 opacity-60
          bg-gradient-to-br from-emerald-500/30 via-cyan-500/30 to-blue-500/30
          animate-pulse
        `}></div>

        {/* Parallax Background Elements */}
        <div 
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`
          }}
        >
          {/* Large Background Shapes */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-emerald-300/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Animated Particles */}
        <div className="absolute inset-0">
          {particles.map((particle) => {
            const ParticleIcon = particle.icon;
            return (
              <div
                key={particle.id}
                className={`absolute ${particle.color} transition-all duration-1000`}
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  fontSize: `${particle.size}px`,
                  opacity: particle.opacity,
                  transform: `rotate(${particle.rotation}deg) translate(${mousePosition.x * 5}px, ${mousePosition.y * 5}px)`,
                  filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))'
                }}
              >
                <ParticleIcon />
              </div>
            );
          })}
        </div>

        {/* Geometric Patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpolygon points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px',
            animation: 'float 20s ease-in-out infinite'
          }}></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        {/* Loading Phase */}
        {isLoading && (
          <div className="space-y-8 animate-fade-in">
            {/* Logo Animation */}
            <div className="relative">
              <div className="w-32 h-32 mx-auto mb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl backdrop-blur-sm border border-white/30 flex items-center justify-center animate-pulse">
                  <FaRocket className="text-6xl text-white animate-bounce" />
                </div>
                <div className="absolute -inset-4 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-xl animate-ping"></div>
              </div>
            </div>

            {/* Brand Name */}
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-black text-white leading-none">
                <span className="bg-gradient-to-r from-white via-cyan-200 to-emerald-300 bg-clip-text text-transparent animate-pulse">
                  Roamio
                </span>
                <br />
                <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent animate-pulse delay-500">
                  Wanderly
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-cyan-100 font-light animate-fade-in delay-1000">
                Discover Nepal's Hidden Treasures
              </p>
            </div>

            {/* Loading Progress */}
            <div className="w-full max-w-md space-y-4">
              <div className="relative">
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all duration-500 ease-out relative"
                    style={{ width: `${loadingProgress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full animate-pulse"></div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-cyan-200">
                <span>Loading...</span>
                <span>{loadingProgress}%</span>
              </div>
            </div>

            {/* Loading Dots */}
            <div className="flex space-x-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-white/60 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                ></div>
              ))}
            </div>
          </div>
        )}

        {/* Ready Phase */}
        {showContent && !isLoading && (
          <div className={`
            space-y-12 animate-fade-in
            ${animationPhase === 'exit' ? 'animate-fade-out' : ''}
          `}>
            {/* Hero Logo */}
            <div className="relative">
              <div className="w-40 h-40 mx-auto mb-8 relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 rounded-3xl backdrop-blur-lg border border-white/40 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <FaMagic className="text-7xl text-white group-hover:animate-spin" />
                </div>
                <div className="absolute -inset-6 bg-gradient-to-br from-cyan-400/30 to-emerald-500/30 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute -inset-8 bg-gradient-to-br from-blue-400/20 to-teal-500/20 rounded-full blur-3xl animate-ping"></div>
              </div>
            </div>

            {/* Main Title */}
            <div className="space-y-6">
              <h1 className="text-7xl md:text-9xl font-black text-white leading-none tracking-tight">
                <span className="bg-gradient-to-r from-white via-cyan-200 to-emerald-300 bg-clip-text text-transparent drop-shadow-2xl">
                  Roamio
                </span>
                <br />
                <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl">
                  Wanderly
                </span>
              </h1>
              
              <div className="space-y-4">
                <p className="text-2xl md:text-3xl text-cyan-100 font-light leading-relaxed">
                  Discover Nepal's Hidden Treasures
                </p>
                <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                  From the world's highest peaks to ancient temples, embark on extraordinary adventures 
                  with expert local guidance
                </p>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { icon: FaMountain, title: "Epic Treks", desc: "Himalayan adventures" },
                { icon: FaCamera, title: "Cultural Sites", desc: "Ancient heritage" },
                { icon: FaHeart, title: "Local Experiences", desc: "Authentic journeys" }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                >
                  <feature.icon className="text-4xl text-cyan-300 mb-4 mx-auto group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-cyan-200 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="space-y-8">
              <button
                onClick={() => {
                  console.log("Start button clicked");
                  handleStart();
                }}
                className="group relative px-12 py-6 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                <span className="relative z-10 flex items-center gap-4">
                  <FaPlay className="group-hover:animate-pulse" />
                  Start Your Adventure
                  <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
              </button>

              <div className="flex items-center justify-center gap-8 text-sm text-cyan-200">
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-400" />
                  <span>Premium Experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaGlobe className="text-blue-400" />
                  <span>Local Expertise</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaGem className="text-emerald-400" />
                  <span>Unforgettable Memories</span>
                </div>
              </div>

              <p className="text-white/60 text-sm animate-pulse">
                Click anywhere or press Enter to begin
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Audio Element (optional) */}
      <audio ref={audioRef} preload="auto">
        <source src="/sounds/start-sound.mp3" type="audio/mpeg" />
      </audio>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-out {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(1.1); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        
        .animate-fade-out {
          animation: fade-out 0.8s ease-in forwards;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
