import React, { useState, useEffect } from 'react';
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
        {/* Dynamic Background */}
        <div 
          className="absolute inset-0"
          style={{
            background: theme === 'dark' 
              ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)'
              : 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 25%, #99f6e4 50%, #5eead4 75%, #2dd4bf 100%)'
          }}
        />

        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Travel Icons */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-10 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${6 + Math.random() * 6}s`
              }}
            >
              {[FaGlobe, FaCamera, FaCompass, FaMapMarkerAlt, FaPlane, FaHeart][i % 6]({ 
                size: 20 + Math.random() * 40 
              })}
            </div>
          ))}

          {/* Geometric Patterns */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-20 w-32 h-32 border-2 border-teal-500 rotate-45 animate-spin-slow"></div>
            <div className="absolute bottom-32 right-32 w-24 h-24 border-2 border-cyan-500 rotate-12 animate-pulse"></div>
            <div className="absolute top-1/2 left-10 w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full animate-bounce"></div>
            <div className="absolute bottom-20 left-1/3 w-20 h-20 border border-emerald-400 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex items-center justify-center min-h-full py-12 px-4">
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

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/about')}
                  className="group relative px-8 py-4 bg-white/10 dark:bg-slate-800/30 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 text-white rounded-2xl font-semibold hover:bg-white/20 dark:hover:bg-slate-700/50 transition-all duration-300 flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FaPlay className="text-sm ml-1" />
                  </div>
                  <span>Explore Nepal</span>
                </button>

                <button 
                  onClick={() => navigate('/guide')}
                  className="group flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-300"
                >
                  <span>Itinerary</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Right Side - Sign In Form */}
            <div className={`${isLoaded ? 'animate-in slide-in-from-right-8 duration-1000 delay-300' : 'opacity-0'} flex justify-center lg:justify-end`}>
              <div className="w-full max-w-md">
                {/* Form Container */}
                <div className="bg-white/10 dark:bg-slate-800/30 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-2xl">
                  {/* Form Header */}
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                      <FaLock className="text-white text-xl" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
                      Welcome Back
                    </h2>
                    <p className="text-white/70">
                      Sign in to your account and continue your journey
                    </p>
                  </div>

                  {/* Clerk Sign In Component */}
                  <div className="mb-6">
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
                    <a 
                      href="/sign-up" 
                      className="text-teal-300 hover:text-teal-200 font-semibold transition-colors duration-300"
                    >
                      Sign up for free
                    </a>
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

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-in {
          animation-fill-mode: both;
        }
        
        .slide-in-from-left-8 {
          animation: slideInFromLeft 1s ease-out;
        }
        
        .slide-in-from-right-8 {
          animation: slideInFromRight 1s ease-out;
        }
        
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-2rem);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(2rem);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}