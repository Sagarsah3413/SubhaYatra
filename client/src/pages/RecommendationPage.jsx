import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useUser } from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

// Components
import { Header } from "../components/header/Header";
import Footer from "../components/footer/Footer";

export default function RecommendationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn, isLoaded } = useUser();
  const { theme } = useTheme();

  // State
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    travellers: "",
    tripDuration: "",
    tripTypes: [],
  });

  const [errors, setErrors] = useState({});

  // Auth check
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/sign-in");
    }
  }, [isLoaded, isSignedIn, navigate]);

  const handleHomeClick = () => {
    if (location.pathname !== "/") navigate(-1);
  };

  const tripOptions = [
    { icon: "⛰️", title: "Natural Attractions", desc: "Mountains & landscapes" },
    { icon: "🧗", title: "Trekking & Adventures", desc: "Hiking & outdoor" },
    { icon: "🛕", title: "Cultural & Religious", desc: "Temples & heritage" },
    { icon: "🏡", title: "Village & Rural", desc: "Local experiences" },
    { icon: "🏙️", title: "Urban & Modern", desc: "Cities & attractions" },
  ];

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.age) newErrors.age = "Age is required";
    if (!formData.phone || formData.phone.replace(/\D/g, "").length < 10)
      newErrors.phone = "Enter a valid phone number";
    if (!formData.travellers)
      newErrors.travellers = "Select number of travellers";
    if (!formData.tripDuration)
      newErrors.tripDuration = "Select trip duration";
    if (formData.tripTypes.length === 0)
      newErrors.tripTypes = "Select at least one trip type";
    // Allow 1 or 2 selections (removed max validation)

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    navigate("/recommendation-results", {
      state: {
        preferences: {
          ...formData,
          tripType: formData.tripTypes[0],
        },
      },
    });
  };

  // Loading
  if (!isLoaded) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="animate-spin h-12 w-12 rounded-full border-4 border-teal-500 border-t-transparent mx-auto mb-4" />
          <p className={theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) return null;

  return (
    <div className={`min-h-screen flex flex-col ${
      theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100'
    }`}>
      <Header onHomeClick={handleHomeClick} />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 80% 50%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)`,
            backgroundSize: '800px 800px'
          }}></div>
        </div>

        <div className={`relative py-12 px-4 text-center ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-slate-800/50 via-slate-900/50 to-slate-800/50' 
            : 'bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-emerald-500/10'
        }`}>
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 mb-4">
              <span className="text-2xl">✨</span>
              <span className={`text-sm font-semibold ${
                theme === 'dark' ? 'text-teal-400' : 'text-teal-600'
              }`}>
                Personalized Recommendations
              </span>
            </div>
            
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Plan Your Perfect
              <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent"> Nepal Journey</span>
            </h1>
            
            <p className={`text-lg ${
              theme === 'dark' ? 'text-slate-300' : 'text-gray-600'
            }`}>
              Tell us your preferences and we'll craft the perfect itinerary just for you
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className={`rounded-3xl shadow-2xl overflow-hidden ${
            theme === 'dark' 
              ? 'bg-slate-800/50 border border-slate-700/50' 
              : 'bg-white/80 border border-white/50'
          } backdrop-blur-xl`}>
            
            {/* Form Header */}
            <div className={`px-8 py-6 border-b ${
              theme === 'dark' ? 'border-slate-700/50' : 'border-gray-200/50'
            }`}>
              <h2 className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Your Travel Preferences
              </h2>
              <p className={`text-sm mt-1 ${
                theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
              }`}>
                Help us understand what makes your perfect trip
              </p>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Name */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-slate-200' : 'text-gray-700'
                }`}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                    theme === 'dark'
                      ? 'bg-slate-900/50 border-slate-600 text-white placeholder-slate-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20'
                  } outline-none`}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <span>⚠️</span> {errors.name}
                  </p>
                )}
              </div>

              {/* Age & Travellers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Age */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-slate-200' : 'text-gray-700'
                  }`}>
                    Age
                  </label>
                  <select
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                      theme === 'dark'
                        ? 'bg-slate-900/50 border-slate-600 text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20'
                    } outline-none`}
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                  >
                    <option value="">Select age</option>
                    {[...Array(100)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} years
                      </option>
                    ))}
                  </select>
                  {errors.age && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <span>⚠️</span> {errors.age}
                    </p>
                  )}
                </div>

                {/* Travellers */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    theme === 'dark' ? 'text-slate-200' : 'text-gray-700'
                  }`}>
                    Number of Travellers
                  </label>
                  <select
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                      theme === 'dark'
                        ? 'bg-slate-900/50 border-slate-600 text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20'
                    } outline-none`}
                    value={formData.travellers}
                    onChange={(e) =>
                      setFormData({ ...formData, travellers: e.target.value })
                    }
                  >
                    <option value="">Select</option>
                    {[...Array(20)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'person' : 'people'}
                      </option>
                    ))}
                  </select>
                  {errors.travellers && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <span>⚠️</span> {errors.travellers}
                    </p>
                  )}
                </div>
              </div>

              {/* Trip Duration */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-slate-200' : 'text-gray-700'
                }`}>
                  <span className="flex items-center gap-2">
                    <span>📅</span>
                    <span>Trip Duration</span>
                  </span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { value: "1-3", label: "1-3 Days", icon: "🌅" },
                    { value: "4-7", label: "4-7 Days", icon: "🗓️" },
                    { value: "8-14", label: "8-14 Days", icon: "📆" },
                    { value: "15+", label: "15+ Days", icon: "🌍" },
                  ].map((duration) => {
                    const selected = formData.tripDuration === duration.value;
                    return (
                      <button
                        key={duration.value}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, tripDuration: duration.value })
                        }
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                          selected
                            ? 'border-teal-500 bg-teal-500/10 shadow-lg shadow-teal-500/20'
                            : theme === 'dark'
                              ? 'border-slate-600 bg-slate-900/30 hover:border-slate-500 hover:bg-slate-900/50'
                              : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        <div className="text-2xl mb-1">{duration.icon}</div>
                        <div className={`text-sm font-semibold ${
                          selected
                            ? 'text-teal-600 dark:text-teal-400'
                            : theme === 'dark'
                              ? 'text-slate-200'
                              : 'text-gray-900'
                        }`}>
                          {duration.label}
                        </div>
                        {selected && (
                          <div className="mt-2 flex justify-center">
                            <div className="w-4 h-4 rounded-full bg-teal-500 flex items-center justify-center">
                              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                {errors.tripDuration && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <span>⚠️</span> {errors.tripDuration}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-slate-200' : 'text-gray-700'
                }`}>
                  Phone Number
                </label>
                <PhoneInput
                  country="np"
                  value={formData.phone}
                  onChange={(phone) =>
                    setFormData({ ...formData, phone })
                  }
                  inputStyle={{
                    width: "100%",
                    height: "48px",
                    borderRadius: "12px",
                    backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.5)' : 'white',
                    borderColor: theme === 'dark' ? 'rgb(71, 85, 105)' : 'rgb(209, 213, 219)',
                    color: theme === 'dark' ? 'white' : 'rgb(17, 24, 39)',
                  }}
                  buttonStyle={{
                    borderRadius: "12px 0 0 12px",
                    backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.5)' : 'white',
                    borderColor: theme === 'dark' ? 'rgb(71, 85, 105)' : 'rgb(209, 213, 219)',
                  }}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <span>⚠️</span> {errors.phone}
                  </p>
                )}
              </div>

              {/* Trip Types - Select 1 or 2 (Optional) */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  theme === 'dark' ? 'text-slate-200' : 'text-gray-700'
                }`}>
                  <span className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span>🎯</span>
                      <span>Preferred Trip Types</span>
                    </span>
                    <span className={`text-xs font-normal px-3 py-1 rounded-full ${
                      formData.tripTypes.length === 0
                        ? theme === 'dark' ? 'bg-slate-700 text-slate-400' : 'bg-gray-200 text-gray-500'
                        : formData.tripTypes.length === 2
                          ? 'bg-teal-500/20 text-teal-600 dark:text-teal-400'
                          : 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400'
                    }`}>
                      {formData.tripTypes.length}/2 selected
                    </span>
                  </span>
                </label>
                <p className={`text-xs mb-3 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                }`}>
                  Choose 1 or 2 trip types that interest you most (optional to select 2)
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tripOptions.map((option) => {
                    const optionValue = `${option.icon} ${option.title}`;
                    const selected = formData.tripTypes.includes(optionValue);
                    const selectionIndex = formData.tripTypes.indexOf(optionValue);
                    const isDisabled = !selected && formData.tripTypes.length >= 2;
                    
                    return (
                      <button
                        key={option.title}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => {
                          if (selected) {
                            // Remove if already selected
                            setFormData({
                              ...formData,
                              tripTypes: formData.tripTypes.filter(t => t !== optionValue)
                            });
                          } else if (formData.tripTypes.length < 2) {
                            // Add if less than 2 selected
                            setFormData({
                              ...formData,
                              tripTypes: [...formData.tripTypes, optionValue]
                            });
                          }
                        }}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left group relative ${
                          selected
                            ? 'border-teal-500 bg-teal-500/10 shadow-lg shadow-teal-500/20'
                            : isDisabled
                              ? theme === 'dark'
                                ? 'border-slate-700 bg-slate-900/20 opacity-50 cursor-not-allowed'
                                : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                              : theme === 'dark'
                                ? 'border-slate-600 bg-slate-900/30 hover:border-slate-500 hover:bg-slate-900/50'
                                : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-3xl">{option.icon}</span>
                          <div className="flex-1">
                            <div className={`font-semibold text-sm mb-0.5 ${
                              selected
                                ? 'text-teal-600 dark:text-teal-400'
                                : theme === 'dark'
                                  ? 'text-slate-200'
                                  : 'text-gray-900'
                            }`}>
                              {option.title}
                            </div>
                            <div className={`text-xs ${
                              theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                            }`}>
                              {option.desc}
                            </div>
                          </div>
                          {selected && (
                            <div className="flex-shrink-0">
                              <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                  {selectionIndex + 1}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Selection indicator */}
                        {selected && (
                          <div className="absolute top-2 right-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              selectionIndex === 0
                                ? 'bg-gradient-to-br from-teal-500 to-cyan-500'
                                : 'bg-gradient-to-br from-cyan-500 to-emerald-500'
                            } shadow-lg`}>
                              <span className="text-white text-xs font-bold">
                                {selectionIndex + 1}
                              </span>
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                {errors.tripTypes && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <span>⚠️</span> {errors.tripTypes}
                  </p>
                )}
                {formData.tripTypes.length > 0 && !errors.tripTypes && (
                  <div className={`mt-3 p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-teal-500/10 border border-teal-500/20' : 'bg-teal-50 border border-teal-200'
                  }`}>
                    <p className={`text-xs font-medium ${
                      theme === 'dark' ? 'text-teal-400' : 'text-teal-700'
                    }`}>
                      ✨ Selected: {formData.tripTypes.map((type, idx) => (
                        <span key={idx}>
                          {type.split(' ').slice(1).join(' ')}
                          {idx < formData.tripTypes.length - 1 ? ' & ' : ''}
                        </span>
                      ))}
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 hover:from-teal-700 hover:via-cyan-700 hover:to-emerald-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <span>Get My Recommendations</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
