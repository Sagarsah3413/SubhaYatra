import { useState, useEffect } from 'react';
import { SignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Header } from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { 
  FaShieldAlt, 
  FaRocket, 
  FaUsers, 
  FaGlobe, 
  FaLock, 
  FaCheckCircle,
  FaArrowRight,
  FaPlay,
  FaStar,
  FaHeart,
  FaCompass,
  FaMapMarkerAlt,
  FaCamera,
  FaPlane
} from 'react-icons/fa';

export default function SignInPage() {
  const { theme, bgClass, textClass } = useTheme();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} flex flex-col overflow-hidden`}>
      <Header />
      
      {/* Ultra-Premium Hero Section */}
      <section className="flex-1 relative overflow-hidden">
        {/* Animated Gradient Background - Using inline styles like Header */}
        <div 
          className="absolute inset-0"
          style={{
            background: theme === 'dark' 
              ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)'
              : 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 25%, #99f6e4 50%, #5eead4 75%, #2dd4bf 100%)',
            backgroundSize: '400% 400%',
            animation: 'gradient-shift-bg 15s ease infinite'
          }}
        />

        {/* Animated Mesh Gradient Overlay - Using inline styles like Header */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: theme === 'dark'
              ? 'radial-gradient(circle at 20% 50%, rgba(20, 184, 166, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(14, 165, 233, 0.2) 0%, transparent 50%)'
              : 'radial-gradient(circle at 20% 50%, rgba(20, 184, 166, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.4) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(14, 165, 233, 0.3) 0%, transparent 50%)',
            backgroundSize: '200% 200%',
            animation: 'mesh-gradient 20s ease-in-out infinite'
          }}
        />

        {/* Ultra-Premium Enterprise Background - Same as Header */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.025] pointer-events-none overflow-hidden">
          {/* Primary gradient layer with animation */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 10% 20%, rgba(6, 182, 212, 0.6) 0%, transparent 70%),
              radial-gradient(circle at 90% 80%, rgba(59, 130, 246, 0.4) 0%, transparent 70%),
              radial-gradient(circle at 50% 5%, rgba(16, 185, 129, 0.35) 0%, transparent 80%),
              radial-gradient(circle at 20% 90%, rgba(139, 92, 246, 0.3) 0%, transparent 60%),
              radial-gradient(circle at 80% 10%, rgba(236, 72, 153, 0.25) 0%, transparent 65%)
            `,
            backgroundSize: '1600px 1600px, 1200px 1200px, 1800px 1800px, 800px 800px, 1000px 1000px',
            animation: 'float 25s ease-in-out infinite'
          }}></div>
          
          {/* Secondary geometric pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(45deg, transparent 47%, rgba(6, 182, 212, 0.03) 48%, rgba(6, 182, 212, 0.03) 52%, transparent 53%),
              linear-gradient(-45deg, transparent 47%, rgba(16, 185, 129, 0.02) 48%, rgba(16, 185, 129, 0.02) 52%, transparent 53%),
              linear-gradient(90deg, transparent 47%, rgba(59, 130, 246, 0.015) 48%, rgba(59, 130, 246, 0.015) 52%, transparent 53%)
            `,
            backgroundSize: '120px 120px, 80px 80px, 200px 200px'
          }}></div>
          
          {/* Tertiary dot pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at center, rgba(6, 182, 212, 0.08) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            opacity: 0.3
          }}></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Travel Icons with Parallax */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float-parallax ${8 + Math.random() * 8}s ease-in-out infinite`,
                animationDelay: `${i * 0.4}s`
              }}
            >
              {[FaGlobe, FaCamera, FaCompass, FaMapMarkerAlt, FaPlane, FaHeart][i % 6]({ 
                size: 20 + Math.random() * 50,
                className: "drop-shadow-lg"
              })}
            </div>
          ))}

          {/* Animated Geometric Patterns */}
          <div className="absolute inset-0 opacity-10">
            {/* Rotating Squares */}
            <div 
              className="absolute top-20 left-20 w-32 h-32 border-2 border-teal-500"
              style={{
                transform: 'rotate(45deg)',
                animation: 'spin-slow-signin 25s linear infinite'
              }}
            ></div>
            <div 
              className="absolute top-40 right-40 w-40 h-40 border-2 border-cyan-400"
              style={{
                transform: 'rotate(12deg)',
                animation: 'spin-reverse 30s linear infinite'
              }}
            ></div>
            
            {/* Pulsing Circles */}
            <div 
              className="absolute bottom-32 right-32 w-24 h-24 border-2 border-cyan-500 rounded-full"
              style={{
                animation: 'pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}
            ></div>
            <div 
              className="absolute top-1/3 right-1/4 w-32 h-32 border border-emerald-400 rounded-full"
              style={{
                animation: 'ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite'
              }}
            ></div>
            
            {/* Floating Orbs */}
            <div 
              className="absolute top-1/2 left-10 w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full blur-xl"
              style={{
                animation: 'float-orb 8s ease-in-out infinite'
              }}
            ></div>
            <div 
              className="absolute bottom-1/4 right-1/3 w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-xl"
              style={{
                animation: 'float-orb-delayed 10s ease-in-out infinite 2s'
              }}
            ></div>
            <div 
              className="absolute top-1/4 left-1/3 w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-xl"
              style={{
                animation: 'float-orb-slow 12s ease-in-out infinite 1s'
              }}
            ></div>
            
            {/* Animated Lines */}
            <div 
              className="absolute bottom-20 left-1/3 w-20 h-20 border border-emerald-400 rounded-full"
              style={{
                animation: 'scale-pulse 3s ease-in-out infinite'
              }}
            ></div>
            <div 
              className="absolute top-1/4 right-1/4 w-1 h-32 bg-gradient-to-b from-transparent via-teal-400 to-transparent"
              style={{
                animation: 'slide-vertical 4s ease-in-out infinite'
              }}
            ></div>
            <div 
              className="absolute bottom-1/3 left-1/4 w-32 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
              style={{
                animation: 'slide-horizontal 5s ease-in-out infinite'
              }}
            ></div>
          </div>

          {/* Particle System */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <div
                key={`particle-${i}`}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `particle ${3 + Math.random() * 4}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: Math.random() * 0.5 + 0.2
                }}
              />
            ))}
          </div>

          {/* Animated Wave Pattern */}
          <div className="absolute bottom-0 left-0 right-0 h-64 opacity-10">
            <svg className="absolute bottom-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path 
                style={{ animation: 'wave 8s ease-in-out infinite' }}
                fill="currentColor" 
                fillOpacity="0.3" 
                d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              />
            </svg>
            <svg className="absolute bottom-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path 
                style={{ animation: 'wave-delayed 10s ease-in-out infinite 1s' }}
                fill="currentColor" 
                fillOpacity="0.2" 
                d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              />
            </svg>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex items-center justify-center min-h-full py-20 px-4 mt-20">
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Welcome Content */}
            <div className={`${isLoaded ? 'animate-in slide-in-from-left-8 duration-1000' : 'opacity-0'} space-y-8`}>
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-3 bg-white/10 dark:bg-slate-800/30 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20 dark:border-slate-700/50">
                <FaRocket className="text-teal-400" />
                <span className="text-sm font-semibold text-white dark:text-teal-200">Welcome Back, Explorer!</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight">
                  <span className="bg-gradient-to-r from-white via-teal-200 to-cyan-200 dark:from-teal-200 dark:via-cyan-200 dark:to-white bg-clip-text text-transparent">
                    Continue Your
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Adventure
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-white/90 dark:text-slate-200 leading-relaxed max-w-2xl">
                  Sign in to access your personalized travel recommendations, saved destinations, and 
                  <span className="font-bold text-sky-300"> continue exploring the world's hidden gems</span>
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: FaUsers, title: "Nepal Explorer", desc: "Discover hidden gems" },
                  { icon: FaGlobe, title: "Local Insights", desc: "Authentic experiences" },
                  { icon: FaStar, title: "Expert Reviews", desc: "Curated experiences" },
                  { icon: FaShieldAlt, title: "Trusted Guide", desc: "Safe & reliable" }
                ].map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-3 bg-white/5 dark:bg-slate-800/20 backdrop-blur-sm rounded-2xl p-4 border border-white/10 dark:border-slate-700/30 hover:bg-white/10 dark:hover:bg-slate-700/30 transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <feature.icon className="text-white text-sm" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{feature.title}</div>
                      <div className="text-white/70 text-xs">{feature.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Sign In Form */}
            <div className={`${isLoaded ? 'animate-in slide-in-from-right-8 duration-1000 delay-300' : 'opacity-0'} flex justify-center lg:justify-end`}>
              <div className="w-full max-w-md">
                {/* Form Container */}
                <div className="bg-white/10 dark:bg-slate-800/30 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-2xl relative z-20">
                  {/* Form Header */}
                  <div className="text-center mb-8 relative z-30">
                    <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                      <FaLock className="text-white text-xl" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-white mb-2 relative z-30">
                      Welcome Back
                    </h2>
                    <p className="text-white/70 relative z-30">
                      Sign in to your account and continue your journey
                    </p>
                  </div>

                  {/* Clerk Sign In Component */}
                  <div className="mb-6 relative z-30">
                    <SignIn 
                      appearance={{
                        elements: {
                          rootBox: "w-full",
                          card: `bg-transparent shadow-none border-0 p-0`,
                          headerTitle: `text-white text-xl font-bold mb-2`,
                          headerSubtitle: `text-white/70 text-sm mb-6`,
                          formButtonPrimary: 
                            'w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-0',
                          formFieldInput: `w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl py-4 px-4 backdrop-blur-sm focus:bg-white/20 focus:border-teal-400 transition-all duration-300`,
                          formFieldLabel: `text-white/90 font-semibold mb-2 text-sm`,
                          dividerLine: `bg-white/20`,
                          dividerText: `text-white/60 text-sm`,
                          socialButtonsBlockButton: `w-full bg-white/10 border border-white/20 text-white hover:bg-white/20 rounded-xl py-3 px-4 backdrop-blur-sm transition-all duration-300 font-semibold`,
                          footerActionLink: 'text-teal-300 hover:text-teal-200 font-semibold transition-colors duration-300',
                          identityPreviewText: 'text-white/80',
                          identityPreviewEditButton: 'text-teal-300 hover:text-teal-200',
                          formResendCodeLink: 'text-teal-300 hover:text-teal-200',
                          otpCodeFieldInput: 'bg-white/10 border-white/20 text-white text-center rounded-xl',
                          formFieldSuccessText: 'text-emerald-300',
                          formFieldErrorText: 'text-red-300',
                          alertClerkAPIResponseError: 'bg-red-500/20 border-red-400/50 text-red-200 rounded-xl',
                          formFieldHintText: 'text-white/60'
                        }
                      }}
                      redirectUrl="/"
                      signUpUrl="/sign-up"
                    />
                  </div>

                  {/* Security Features */}
                  <div className="space-y-3">
                    {[
                      { icon: FaShieldAlt, text: "256-bit SSL encryption" },
                      { icon: FaCheckCircle, text: "Two-factor authentication" },
                      { icon: FaLock, text: "Privacy protected" }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3 text-white/70">
                        <feature.icon className="text-teal-400 text-sm" />
                        <span className="text-sm">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 text-center">
                  <p className="text-white/60 text-sm">
                    Don't have an account?{' '}
                    <button
                      onClick={() => navigate('/sign-up')}
                      className="text-teal-300 hover:text-teal-200 font-semibold transition-colors duration-300 cursor-pointer hover:underline"
                    >
                      Sign up for free
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
      </section>

      <Footer />
    </div>
  );
}
