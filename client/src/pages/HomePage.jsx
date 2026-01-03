import { useState, useEffect, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { 
  FaSearch, 
  FaMountain, 
  FaTemple, 
  FaTheaterMasks, 
  FaMapMarkerAlt, 
  FaStar, 
  FaUsers,
  FaPlay,
  FaArrowRight,
  FaGlobe,
  FaCamera,
  FaHeart,
  FaShieldAlt,
  FaClock,
  FaAward,
  FaChevronDown,
  FaQuoteLeft,
  FaRobot
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function HomePage() {
  const { bgClass, textClass, theme } = useTheme();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const heroRef = useRef(null);
  const statsRef = useRef(null);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "New York, USA",
      text: "The most incredible journey of my life! Every detail was perfectly planned and the cultural immersion was beyond my expectations.",
      rating: 5,
      image: "👩‍💼"
    },
    {
      name: "Marco Rodriguez",
      location: "Barcelona, Spain", 
      text: "Roamio Wanderly made my Everest Base Camp dream come true. Professional guides, stunning views, and memories that will last forever.",
      rating: 5,
      image: "👨‍🎓"
    },
    {
      name: "Yuki Tanaka",
      location: "Tokyo, Japan",
      text: "The spiritual journey through Nepal's temples and monasteries was transformative. Highly recommend for anyone seeking authentic experiences.",
      rating: 5,
      image: "👩‍🎨"
    }
  ];

  const stats = [
    { number: "Nepal", label: "Adventure Awaits", icon: FaUsers },
    { number: "Himalayas", label: "Mountain Views", icon: FaMapMarkerAlt },
    { number: "Culture", label: "Rich Heritage", icon: FaAward },
    { number: "4.9", label: "Average Rating", icon: FaStar }
  ];

  return (
    <div className={`${bgClass} ${textClass} min-h-screen overflow-hidden`}>
      {/* Ultra-Premium Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          background: theme === 'dark' 
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)'
            : 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 25%, #99f6e4 50%, #5eead4 75%, #2dd4bf 100%)'
        }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Orbs */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full opacity-20 animate-float`}
              style={{
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: theme === 'dark' 
                  ? `radial-gradient(circle, rgba(20, 184, 166, 0.3) 0%, transparent 70%)`
                  : `radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%)`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${4 + Math.random() * 4}s`
              }}
            />
          ))}
          
          {/* Geometric Patterns */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 border-2 border-teal-500 rotate-45 animate-spin-slow"></div>
            <div className="absolute bottom-32 right-32 w-24 h-24 border-2 border-cyan-500 rotate-12 animate-pulse"></div>
            <div className="absolute top-1/2 left-10 w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full animate-bounce"></div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div 
            className={`transform transition-all duration-1000 ${
              isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
            id="hero"
            data-animate
          >
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-3 bg-white/10 dark:bg-slate-800/30 backdrop-blur-xl rounded-full px-8 py-4 mb-8 border border-white/20 dark:border-slate-700/50">
              <FaAward className="text-teal-400" />
              <span className="text-sm font-semibold text-white dark:text-teal-200">Authentic Nepal Travel Experience</span>
            </div>

            {/* Main Heading with Gradient Text */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-teal-200 to-cyan-200 dark:from-teal-200 dark:via-cyan-200 dark:to-white bg-clip-text text-transparent">
                Roamio
              </span>
              <br />
              <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Wanderly
              </span>
            </h1>

            {/* Subtitle with Typewriter Effect */}
            <p className="text-xl md:text-3xl text-white/90 dark:text-slate-200 mb-6 max-w-4xl mx-auto leading-relaxed font-light">
              Your Gateway to Nepal's Most
              <span className="font-bold bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent"> Extraordinary Adventures</span>
            </p>

            <p className="text-lg md:text-xl text-white/70 dark:text-slate-300 mb-12 max-w-3xl mx-auto">
              Discover authentic experiences, from the world's highest peaks to ancient cultural treasures, 
              with our expert-guided journeys that transform travelers into storytellers.
            </p>

            {/* Premium CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link 
                to="/search"
                className="group relative px-10 py-5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-xl overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <FaSearch />
                  Start Your Journey
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </Link>

              <Link 
                to="/recommendation"
                className="group relative px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-xl overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <FaCamera />
                  Inspire My Trip
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </Link>

              <button className="group flex items-center gap-4 px-8 py-5 bg-white/10 dark:bg-slate-800/30 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 text-white rounded-2xl font-semibold text-lg hover:bg-white/20 dark:hover:bg-slate-700/50 transition-all duration-300">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FaPlay className="text-sm ml-1" />
                </div>
                Watch Our Story
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-white/60 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <FaShieldAlt />
                <span className="text-sm font-medium">100% Safe & Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <FaAward />
                <span className="text-sm font-medium">Trusted Nepal Guide</span>
              </div>
              <div className="flex items-center gap-2">
                <FaHeart />
                <span className="text-sm font-medium">Discover Hidden Nepal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <FaChevronDown className="text-white/60 text-2xl" />
        </div>
      </section>

      {/* Ultra-Premium Stats Section */}
      <section 
        ref={statsRef}
        className="py-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-y border-gray-200/50 dark:border-slate-700/50"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div 
            className={`grid grid-cols-2 md:grid-cols-4 gap-8 transform transition-all duration-1000 ${
              isVisible.stats ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
            id="stats"
            data-animate
          >
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <stat.icon className="text-2xl text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Search & Categories Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          {/* Premium Search Container */}
          <div 
            className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl p-12 md:p-16 rounded-4xl shadow-2xl border border-gray-200/50 dark:border-slate-700/50 max-w-6xl mx-auto mb-20 transform transition-all duration-1000 ${
              isVisible.search ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
            id="search"
            data-animate
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-full px-8 py-4 mb-8 border border-teal-200/50 dark:border-teal-700/50">
                <FaGlobe className="text-teal-600 dark:text-teal-400" />
                <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">Plan Your Perfect Journey</span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-teal-700 to-cyan-800 dark:from-white dark:via-teal-200 dark:to-cyan-200 bg-clip-text text-transparent">
                  Discover Nepal's Hidden Gems
                </span>
              </h2>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Explore Nepal's most captivating destinations with our AI-powered recommendations and expert local guidance
              </p>
            </div>
            
            {/* Ultra-Premium Search Bar */}
            <div className="mb-12">
              <div className="relative max-w-3xl mx-auto group">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative bg-white dark:bg-slate-700 rounded-3xl shadow-2xl border-2 border-gray-200 dark:border-slate-600 overflow-hidden">
                  <input
                    type="text"
                    placeholder="Search destinations, experiences, or adventures..."
                    className="w-full px-8 py-6 pl-16 text-lg bg-transparent border-none focus:outline-none focus:ring-0 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <FaSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-3 rounded-2xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl">
                    Search
                  </button>
                </div>
              </div>
            </div>
            
            {/* Premium Feature Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: FaMountain,
                  title: "Mountain Adventures",
                  desc: "Trek through the world's highest peaks and pristine valleys with expert Sherpa guides",
                  color: "teal",
                  gradient: "from-teal-500 to-teal-600"
                },
                {
                  icon: FaTemple,
                  title: "Sacred Heritage",
                  desc: "Explore ancient temples and UNESCO World Heritage sites with cultural historians",
                  color: "cyan",
                  gradient: "from-cyan-500 to-cyan-600"
                },
                {
                  icon: FaTheaterMasks,
                  title: "Cultural Immersion",
                  desc: "Experience authentic traditions and connect with local communities",
                  color: "emerald",
                  gradient: "from-emerald-500 to-emerald-600"
                }
              ].map((category, index) => (
                <div 
                  key={index}
                  className="group relative p-8 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 rounded-3xl hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-200/50 dark:border-slate-600/50 overflow-hidden transform hover:scale-105"
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  
                  {/* Icon Container */}
                  <div className={`relative w-20 h-20 bg-gradient-to-br ${category.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                    <category.icon className="text-3xl text-white" />
                  </div>
                  
                  <h3 className={`font-black text-2xl text-${category.color}-800 dark:text-${category.color}-200 mb-4 text-center`}>
                    {category.title}
                  </h3>
                  
                  <p className={`text-${category.color}-700 dark:text-${category.color}-300 text-center leading-relaxed`}>
                    {category.desc}
                  </p>
                  
                  {/* Hover Arrow */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <FaArrowRight className={`text-${category.color}-600`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ultra-Premium Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <div className="mb-16">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-8 py-4 mb-8 border border-white/20">
              <FaQuoteLeft className="text-white/80" />
              <span className="text-sm font-semibold text-white/90">What Our Travelers Say</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              Stories That Inspire
            </h2>
          </div>

          {/* Testimonial Carousel */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-12 border border-white/20 shadow-2xl">
              <div className="text-6xl mb-6">{testimonials[currentTestimonial].image}</div>
              
              <blockquote className="text-2xl md:text-3xl font-light mb-8 leading-relaxed italic">
                "{testimonials[currentTestimonial].text}"
              </blockquote>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 text-xl" />
                ))}
              </div>
              
              <div className="font-bold text-xl">{testimonials[currentTestimonial].name}</div>
              <div className="text-white/70">{testimonials[currentTestimonial].location}</div>
            </div>

            {/* Testimonial Indicators */}
            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-white scale-125' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ultra-Premium CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 via-transparent to-cyan-600/20 animate-pulse"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="mb-12">
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Ready to Begin Your
              </span>
              <br />
              <span className="text-white">Nepal Adventure?</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of travelers who have discovered the magic of Nepal with our expert guidance, 
              personalized experiences, and unforgettable memories that last a lifetime.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              to="/recommendation"
              className="group relative px-12 py-6 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-xl overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                <FaCamera />
                Start Planning Now
                <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </Link>

            <Link 
              to="/contact"
              className="group px-12 py-6 border-2 border-white/30 text-white hover:bg-white hover:text-gray-900 rounded-2xl font-bold text-xl transition-all duration-300 backdrop-blur-xl"
            >
              <span className="flex items-center gap-3">
                <FaUsers />
                Contact Expert
              </span>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-12 text-gray-400">
            <div className="flex items-center gap-3">
              <FaShieldAlt className="text-2xl text-teal-400" />
              <div>
                <div className="font-semibold text-white">100% Secure</div>
                <div className="text-sm">SSL Protected</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaClock className="text-2xl text-cyan-400" />
              <div>
                <div className="font-semibold text-white">24/7 Support</div>
                <div className="text-sm">Always Available</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaAward className="text-2xl text-blue-400" />
              <div>
                <div className="font-semibold text-white">Nepal Certified</div>
                <div className="text-sm">Tourism Board Approved</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}