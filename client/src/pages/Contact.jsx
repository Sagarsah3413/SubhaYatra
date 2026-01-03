import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Footer from "../components/footer/Footer";
import { Header } from '../components/header/Header';
import { useTheme } from '../contexts/ThemeContext';
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock, 
  FaPaperPlane,
  FaCheckCircle,
  FaGlobe,
  FaHeadset,
  FaShieldAlt,
  FaAward,
  FaUsers,
  FaStar,
  FaQuestionCircle,
  FaChevronDown,
  FaChevronUp,
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaArrowRight,
  FaCalendarAlt,
  FaComments,
  FaLightbulb
} from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Contact() {
  const { bgClass, textClass, theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    travelType: '',
    budget: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [isVisible, setIsVisible] = useState({});
  const formRef = useRef(null);

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert('Please fill in all required fields.');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSubmitted(true);
    setIsSubmitting(false);
    setFormData({ 
      name: '', 
      email: '', 
      phone: '',
      subject: '', 
      travelType: '',
      budget: '',
      message: '' 
    });
    
    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactMethods = [
    {
      icon: FaPhone,
      title: 'Call Us',
      subtitle: 'Speak with our travel experts',
      info: '+977-1-234567',
      action: 'Call Now',
      color: 'emerald',
      gradient: 'from-emerald-500 to-green-600'
    },
    {
      icon: FaEnvelope,
      title: 'Email Us',
      subtitle: 'Get detailed responses',
      info: 'info@roamiowanderly.com',
      action: 'Send Email',
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      icon: FaWhatsapp,
      title: 'WhatsApp',
      subtitle: 'Quick chat support',
      info: '+977-98-12345678',
      action: 'Chat Now',
      color: 'green',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      icon: FaCalendarAlt,
      title: 'Book Consultation',
      subtitle: 'Free 30-min planning session',
      info: 'Available Mon-Fri',
      action: 'Schedule',
      color: 'purple',
      gradient: 'from-purple-500 to-indigo-600'
    }
  ];

  const officeInfo = [
    { icon: FaMapMarkerAlt, title: 'Address', info: 'Chaksibari Marg, Thamel-26, Kathmandu 44600, Nepal', color: 'text-red-500' },
    { icon: FaClock, title: 'Business Hours', info: 'Mon-Fri: 9AM-6PM, Sat-Sun: 10AM-4PM', color: 'text-blue-500' },
    { icon: FaGlobe, title: 'Languages', info: 'English, Nepali, Hindi, Chinese', color: 'text-green-500' },
    { icon: FaHeadset, title: '24/7 Support', info: 'Emergency assistance available', color: 'text-purple-500' }
  ];

  const faqs = [
    {
      category: 'general',
      question: "How do I get personalized travel recommendations?",
      answer: "Simply create an account and complete our travel preference quiz. Our AI-powered system analyzes your interests, budget, travel style, and past experiences to provide tailored recommendations that match your unique preferences."
    },
    {
      category: 'general',
      question: "What makes Roamio Wanderly different from other travel platforms?",
      answer: "We combine local expertise with advanced AI technology to provide authentic, personalized experiences. Our team of local guides and travel experts ensure every recommendation is current, safe, and culturally respectful."
    },
    {
      category: 'booking',
      question: "Can I book tours and accommodations through your platform?",
      answer: "We partner with trusted local operators and verified accommodations. While we provide recommendations and facilitate connections, bookings are handled by our certified partners to ensure the best rates and authentic experiences."
    },
    {
      category: 'booking',
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, bank transfers, and local payment methods. All transactions are secured with 256-bit SSL encryption and processed through certified payment gateways."
    },
    {
      category: 'support',
      question: "Do you provide travel insurance recommendations?",
      answer: "Yes, we partner with leading travel insurance providers to offer comprehensive coverage options. Our travel advisors can help you choose the right insurance based on your destination, activities, and travel duration."
    },
    {
      category: 'support',
      question: "What if I need help during my trip?",
      answer: "Our 24/7 emergency support team is always available. You'll receive emergency contact numbers and have access to our mobile app with real-time assistance, local emergency services, and instant communication with our support team."
    }
  ];

  const socialLinks = [
    { icon: FaFacebook, name: 'Facebook', color: 'text-blue-600', url: '#' },
    { icon: FaInstagram, name: 'Instagram', color: 'text-pink-600', url: '#' },
    { icon: FaTwitter, name: 'Twitter', color: 'text-blue-400', url: '#' },
    { icon: FaLinkedin, name: 'LinkedIn', color: 'text-blue-700', url: '#' }
  ];

  const filteredFAQs = faqs.filter(faq => faq.category === activeTab);

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} flex flex-col overflow-hidden`}>
      <Header />
      
      {/* Ultra-Premium Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
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
          {/* Floating Contact Icons */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`absolute opacity-10 animate-float`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${4 + Math.random() * 4}s`
              }}
            >
              {[FaPhone, FaEnvelope, FaComments, FaHeadset][i % 4]({ size: 40 + Math.random() * 20 })}
            </div>
          ))}
          
          {/* Geometric Patterns */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-20 w-32 h-32 border-2 border-teal-500 rotate-45 animate-spin-slow"></div>
            <div className="absolute bottom-32 right-32 w-24 h-24 border-2 border-cyan-500 rotate-12 animate-pulse"></div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <div 
            className={`transform transition-all duration-1000 ${
              isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
            id="hero"
            data-animate
          >
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-3 bg-white/10 dark:bg-slate-800/30 backdrop-blur-xl rounded-full px-8 py-4 mb-8 border border-white/20 dark:border-slate-700/50">
              <FaHeadset className="text-teal-400" />
              <span className="text-sm font-semibold text-white dark:text-teal-200">24/7 Expert Support Available</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-teal-200 to-cyan-200 dark:from-teal-200 dark:via-cyan-200 dark:to-white bg-clip-text text-transparent">
                Get In
              </span>
              <br />
              <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-3xl text-white/90 dark:text-slate-200 mb-6 max-w-4xl mx-auto leading-relaxed font-light">
              Ready to plan your
              <span className="font-bold bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent"> dream adventure?</span>
            </p>

            <p className="text-lg md:text-xl text-white/70 dark:text-slate-300 mb-12 max-w-3xl mx-auto">
              Our travel experts are here to help you create unforgettable experiences. 
              Reach out anytime for personalized assistance and expert guidance.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-white/60 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <FaShieldAlt />
                <span className="text-sm font-medium">Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <FaAward />
                <span className="text-sm font-medium">Nepal Tourism Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <FaUsers />
                <span className="text-sm font-medium">Authentic Nepal Experiences</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className="py-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4">
          <div 
            className={`text-center mb-16 transform transition-all duration-1000 ${
              isVisible.methods ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
            id="methods"
            data-animate
          >
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-full px-8 py-4 mb-8 border border-teal-200/50 dark:border-teal-700/50">
              <FaComments className="text-teal-600 dark:text-teal-400" />
              <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">Multiple Ways to Connect</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-teal-700 to-cyan-800 dark:from-white dark:via-teal-200 dark:to-cyan-200 bg-clip-text text-transparent">
                Choose Your Preferred
              </span>
              <br />
              <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Communication Method
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <div 
                key={index}
                className={`group relative bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-200/50 dark:border-slate-700/50 overflow-hidden transform hover:scale-105 ${
                  isVisible.methods ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${method.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Icon Container */}
                <div className={`relative w-16 h-16 bg-gradient-to-br ${method.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                  <method.icon className="text-2xl text-white" />
                </div>
                
                <h3 className="font-black text-xl text-gray-900 dark:text-white mb-2 text-center">
                  {method.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 text-center mb-4 text-sm">
                  {method.subtitle}
                </p>
                
                <p className={`text-${method.color}-600 dark:text-${method.color}-400 text-center font-semibold mb-6`}>
                  {method.info}
                </p>
                
                <button className={`w-full bg-gradient-to-r ${method.gradient} hover:shadow-lg text-white py-3 px-6 rounded-xl transition-all duration-300 font-semibold flex items-center justify-center gap-2 group-hover:shadow-xl`}>
                  {method.action}
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Ultra-Premium Contact Form */}
            <div 
              ref={formRef}
              className={`transform transition-all duration-1000 ${
                isVisible.form ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}
              id="form"
              data-animate
            >
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-4xl shadow-2xl p-12 border border-gray-200/50 dark:border-slate-700/50 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, currentColor 2px, transparent 2px)`,
                    backgroundSize: '30px 30px'
                  }}></div>
                </div>

                <div className="relative z-10">
                  <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-full px-6 py-3 mb-6 border border-teal-200/50 dark:border-teal-700/50">
                      <FaPaperPlane className="text-teal-600 dark:text-teal-400" />
                      <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">Send Us a Message</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
                      <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                        Let's Plan Your Adventure
                      </span>
                    </h2>
                    
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      Fill out the form below and our travel experts will get back to you within 24 hours with personalized recommendations.
                    </p>
                  </div>

                  {/* Success Message */}
                  {submitted && (
                    <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-2xl animate-fade-in">
                      <div className="flex items-center gap-3">
                        <FaCheckCircle className="text-green-600 text-2xl" />
                        <div>
                          <p className="text-green-800 dark:text-green-200 font-bold text-lg">Message Sent Successfully!</p>
                          <p className="text-green-700 dark:text-green-300 text-sm">We'll get back to you within 24 hours with personalized recommendations.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name and Email Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="group">
                        <label htmlFor="name" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                          Full Name *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-6 py-4 bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 group-hover:border-teal-300 dark:group-hover:border-teal-600"
                            placeholder="Your full name"
                          />
                        </div>
                      </div>

                      <div className="group">
                        <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                          Email Address *
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-6 py-4 bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 group-hover:border-teal-300 dark:group-hover:border-teal-600"
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Phone and Travel Type Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="group">
                        <label htmlFor="phone" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-6 py-4 bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 group-hover:border-teal-300 dark:group-hover:border-teal-600"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>

                      <div className="group">
                        <label htmlFor="travelType" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                          Travel Type
                        </label>
                        <select
                          id="travelType"
                          name="travelType"
                          value={formData.travelType}
                          onChange={handleChange}
                          className="w-full px-6 py-4 bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 text-gray-900 dark:text-white group-hover:border-teal-300 dark:group-hover:border-teal-600"
                        >
                          <option value="">Select travel type</option>
                          <option value="adventure">Adventure & Trekking</option>
                          <option value="cultural">Cultural & Heritage</option>
                          <option value="luxury">Luxury Travel</option>
                          <option value="family">Family Vacation</option>
                          <option value="solo">Solo Travel</option>
                          <option value="group">Group Tour</option>
                        </select>
                      </div>
                    </div>

                    {/* Subject and Budget Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="group">
                        <label htmlFor="subject" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                          Subject *
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-6 py-4 bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 group-hover:border-teal-300 dark:group-hover:border-teal-600"
                          placeholder="How can we help you?"
                        />
                      </div>

                      <div className="group">
                        <label htmlFor="budget" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                          Budget Range
                        </label>
                        <select
                          id="budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          className="w-full px-6 py-4 bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 text-gray-900 dark:text-white group-hover:border-teal-300 dark:group-hover:border-teal-600"
                        >
                          <option value="">Select budget range</option>
                          <option value="budget">Budget ($500 - $1,500)</option>
                          <option value="mid-range">Mid-range ($1,500 - $3,000)</option>
                          <option value="luxury">Luxury ($3,000 - $5,000)</option>
                          <option value="premium">Premium ($5,000+)</option>
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="group">
                      <label htmlFor="message" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="6"
                        className="w-full px-6 py-4 bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 resize-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 group-hover:border-teal-300 dark:group-hover:border-teal-600"
                        placeholder="Tell us about your dream trip, travel dates, group size, special interests, or any specific questions you have..."
                      ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-5 px-8 rounded-2xl transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Sending Message...
                          </>
                        ) : (
                          <>
                            <FaPaperPlane />
                            Send Message
                            <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                          </>
                        )}
                      </span>
                      
                      {/* Button shine effect */}
                      {!isSubmitting && (
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Contact Information & Map */}
            <div className="space-y-8">
              {/* Office Information */}
              <div 
                className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-4xl shadow-2xl p-10 border border-gray-200/50 dark:border-slate-700/50 transform transition-all duration-1000 ${
                  isVisible.info ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}
                id="info"
                data-animate
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-full px-6 py-3 mb-6 border border-teal-200/50 dark:border-teal-700/50">
                    <FaMapMarkerAlt className="text-teal-600 dark:text-teal-400" />
                    <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">Visit Our Office</span>
                  </div>
                  
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
                    <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                      Office Information
                    </span>
                  </h2>
                </div>

                <div className="space-y-6">
                  {officeInfo.map((item, idx) => (
                    <div key={idx} className="group flex items-start space-x-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all duration-300 cursor-pointer">
                      <div className={`w-12 h-12 ${item.color} bg-gray-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <item.icon className="text-xl" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.info}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social Media Links */}
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-700">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-center">Follow Us</h3>
                  <div className="flex justify-center space-x-4">
                    {socialLinks.map((social, idx) => (
                      <a
                        key={idx}
                        href={social.url}
                        className={`w-12 h-12 ${social.color} bg-gray-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-lg`}
                        title={social.name}
                      >
                        <social.icon className="text-xl" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interactive Map */}
              <div 
                className={`bg-white dark:bg-slate-800 rounded-4xl shadow-2xl p-8 border border-gray-200/50 dark:border-slate-700/50 transform transition-all duration-1000 ${
                  isVisible.map ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}
                id="map"
                data-animate
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Find Us on Map</h3>
                <div className="h-80 rounded-3xl overflow-hidden shadow-xl">
                  <MapContainer
                    center={[27.7172, 85.3240]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[27.7172, 85.3240]}>
                      <Popup>
                        <div className="text-center p-2">
                          <strong className="text-lg">Roamio Wanderly</strong><br />
                          <span className="text-gray-600">Chaksibari Marg, Thamel-26</span><br />
                          <span className="text-gray-600">Kathmandu, Nepal</span><br />
                          <span className="text-sm text-teal-600">Your Gateway to Nepal</span>
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ultra-Premium FAQ Section */}
      <section className="py-24 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <div 
            className={`text-center mb-16 transform transition-all duration-1000 ${
              isVisible.faq ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
            id="faq"
            data-animate
          >
            <div className="inline-flex items-center gap-3 bg-white/80 dark:bg-slate-800/30 backdrop-blur-xl rounded-full px-8 py-4 mb-8 border border-teal-200/50 dark:border-slate-700/50">
              <FaQuestionCircle className="text-teal-600 dark:text-teal-400" />
              <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">Frequently Asked Questions</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Got Questions?
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">We Have Answers</span>
            </h2>
          </div>

          {/* FAQ Categories */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-2 border border-gray-200/50 dark:border-slate-700/50">
              {[
                { id: 'general', label: 'General', icon: FaLightbulb },
                { id: 'booking', label: 'Booking', icon: FaCalendarAlt },
                { id: 'support', label: 'Support', icon: FaHeadset }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <tab.icon />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-slate-700/50 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-300"
                >
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </h3>
                  <div className={`transform transition-transform duration-300 ${expandedFAQ === idx ? 'rotate-180' : ''}`}>
                    <FaChevronDown className="text-teal-600 dark:text-teal-400" />
                  </div>
                </button>
                
                {expandedFAQ === idx && (
                  <div className="px-8 pb-6 animate-fade-in">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
