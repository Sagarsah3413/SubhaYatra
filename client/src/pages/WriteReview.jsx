import { useEffect, useState } from "react";
import Footer from "../components/footer/Footer";
import { Header } from "../components/header/Header";
import { useTheme } from "../contexts/ThemeContext";
import { FaStar, FaCamera, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaEnvelope, FaEdit, FaHeart, FaThumbsUp, FaThumbsDown, FaTimes, FaCheck, FaUpload, FaImage, FaTrash } from "react-icons/fa";

// Import background image
import SwayambhunathImage from "../assets/Fspots/Swayambhunath.jpeg";

export default function WriteReview() {
  const { theme } = useTheme();
  const [form, setForm] = useState({
    name: "",
    email: "",
    place: "",
    visitDate: "",
    type: "Nature",
    rating: 0,
    review: "",
    recommend: "yes"
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    // create previews when images change
    if (images.length === 0) return setPreviews([]);
    const objectUrls = images.map((file) => URL.createObjectURL(file));
    setPreviews(objectUrls);
    return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  useEffect(() => {
    // restore draft from localStorage
    const draft = localStorage.getItem("writeReviewDraft");
    if (draft) setForm(JSON.parse(draft));
  }, []);

  useEffect(() => {
    localStorage.setItem("writeReviewDraft", JSON.stringify(form));
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    setImages(files);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files).slice(0, 4);
      setImages(files);
    }
  };
  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const validate = () => {
    if (!form.name.trim()) return "Please enter your name.";
    if (!form.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) return "Please enter a valid email.";
    if (!form.place.trim()) return "Please enter the place you visited.";
    if (!form.rating || form.rating < 1) return "Please select a rating.";
    if (!form.review.trim() || form.review.trim().length < 20) return "Please write a review (at least 20 characters).";
    return "";
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setSubmitting(true);
    try {
      // Try to POST to API (graceful fallback if not available)
      const data = new FormData();
      Object.entries(form).forEach(([k, val]) => data.append(k, val));
      images.forEach((file, idx) => data.append(`image_${idx + 1}`, file));

      const res = await fetch("/api/reviews", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        // fallback: show success locally
        console.warn("Review endpoint returned non-OK status", res.status);
      }

      setSubmitted(true);
      setForm({ name: "", email: "", place: "", visitDate: "", type: "Nature", rating: 0, review: "", recommend: "yes" });
      setImages([]);
      localStorage.removeItem("writeReviewDraft");
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while submitting. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const clearDraft = () => {
    setForm({ name: "", email: "", place: "", visitDate: "", type: "Nature", rating: 0, review: "", recommend: "yes" });
    setImages([]);
    localStorage.removeItem("writeReviewDraft");
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <Header />

      {/* Ultra Premium Hero Section */}
      <div className="relative overflow-hidden">
        {/* Premium Background with Video-like Effect */}
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'}`}></div>
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${SwayambhunathImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        
        {/* Premium Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        {/* Ultra Premium Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
          <div className="text-center">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-400/30 backdrop-blur-xl mb-8 shadow-2xl">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <FaEdit className="text-white text-sm" />
              </div>
              <span className="text-teal-300 font-black text-lg">Share Your Experience</span>
            </div>
            
            {/* Massive Typography */}
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white mb-8 tracking-tight leading-none">
              Write a
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 animate-pulse">
                Review
              </span>
            </h1>
            
            {/* Premium Description */}
            <p className="text-xl lg:text-2xl text-gray-300 max-w-5xl mx-auto leading-relaxed mb-12 font-medium">
              Share your travel experience and help fellow travelers discover 
              <span className="text-teal-300 font-black"> amazing places</span> in Nepal. 
              Your insights make a difference in someone's journey.
            </p>
            
            {/* Ultra Premium Stats */}
            <div className="flex flex-wrap justify-center gap-12 text-lg">
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <FaEdit className="text-white text-lg" />
                </div>
                <div>
                  <div className="text-3xl font-black text-white">1K+</div>
                  <div className="text-sm font-medium">Reviews</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <FaMapMarkerAlt className="text-white text-lg" />
                </div>
                <div>
                  <div className="text-3xl font-black text-white">500+</div>
                  <div className="text-sm font-medium">Places</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <FaHeart className="text-white text-lg" />
                </div>
                <div>
                  <div className="text-3xl font-black text-white">Trusted</div>
                  <div className="text-sm font-medium">Community</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Ultra Premium Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-20">
        
        {/* Ultra Premium Form Container */}
        <div className={`${theme === 'dark' ? 'bg-slate-800/95' : 'bg-white/95'} rounded-4xl shadow-2xl border-2 ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'} backdrop-blur-2xl p-8 lg:p-16 relative overflow-hidden`}>
          
          {/* Premium Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, currentColor 2px, transparent 2px)`,
              backgroundSize: '30px 30px'
            }}></div>
          </div>
          
          {/* Ultra Premium Form Header */}
          <div className="relative z-10 text-center mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/50 dark:to-cyan-900/50 border border-teal-200 dark:border-teal-700 mb-6">
              <FaEdit className="text-teal-600 dark:text-teal-400 text-lg" />
              <span className="text-teal-700 dark:text-teal-300 font-black text-lg">Review Form</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
              Tell Us About
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600">
                Your Journey
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-300 max-w-3xl mx-auto font-medium">Your experience matters. Help others discover amazing places through your authentic review.</p>
          </div>

          {/* Success Message */}
          {submitted && (
            <div className="relative z-10 mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-700 rounded-3xl shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <FaCheck className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-green-800 dark:text-green-300 font-black text-xl mb-1">✓ Review Submitted Successfully!</p>
                  <p className="text-green-700 dark:text-green-400 font-medium">Thank you for sharing your experience. Your review will help other travelers.</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="relative z-10 mb-8 p-6 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-2 border-red-200 dark:border-red-700 rounded-3xl shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <FaTimes className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-red-800 dark:text-red-300 font-black text-xl mb-1">Please Fix the Following:</p>
                  <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Ultra Premium Form */}
          <form onSubmit={submitForm} className="relative z-10 space-y-12">
            
            {/* Personal Information Section */}
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-4">
                  Personal
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600 ml-3">Information</span>
                </h3>
                <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mx-auto"></div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Name Field */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <label className="block text-lg font-black text-gray-900 dark:text-white mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
                          <FaUser className="text-white text-sm" />
                        </div>
                        <span>Full Name</span>
                      </div>
                    </label>
                    <input 
                      name="name" 
                      value={form.name} 
                      onChange={handleChange} 
                      className={`w-full px-6 py-5 border-2 ${theme === 'dark' ? 'border-slate-600 bg-slate-700/50 text-white placeholder-slate-400' : 'border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-500'} rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 text-lg font-medium`}
                      placeholder="Enter your full name" 
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <label className="block text-lg font-black text-gray-900 dark:text-white mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                          <FaEnvelope className="text-white text-sm" />
                        </div>
                        <span>Email Address</span>
                      </div>
                    </label>
                    <input 
                      name="email" 
                      value={form.email} 
                      onChange={handleChange} 
                      type="email"
                      className={`w-full px-6 py-5 border-2 ${theme === 'dark' ? 'border-slate-600 bg-slate-700/50 text-white placeholder-slate-400' : 'border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-500'} rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 text-lg font-medium`}
                      placeholder="your.email@example.com" 
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Trip Details Section */}
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-4">
                  Trip
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 ml-3">Details</span>
                </h3>
                <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mx-auto"></div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Place Field */}
                <div className="lg:col-span-2 group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <label className="block text-lg font-black text-gray-900 dark:text-white mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                          <FaMapMarkerAlt className="text-white text-sm" />
                        </div>
                        <span>Place Visited</span>
                      </div>
                    </label>
                    <input 
                      name="place" 
                      value={form.place} 
                      onChange={handleChange} 
                      className={`w-full px-6 py-5 border-2 ${theme === 'dark' ? 'border-slate-600 bg-slate-700/50 text-white placeholder-slate-400' : 'border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-500'} rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 text-lg font-medium`}
                      placeholder="Name of attraction, hotel, or restaurant" 
                    />
                  </div>
                </div>

                {/* Visit Date Field */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <label className="block text-lg font-black text-gray-900 dark:text-white mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                          <FaCalendarAlt className="text-white text-sm" />
                        </div>
                        <span>Visit Date</span>
                      </div>
                    </label>
                    <input 
                      name="visitDate" 
                      value={form.visitDate} 
                      onChange={handleChange} 
                      type="date"
                      className={`w-full px-6 py-5 border-2 ${theme === 'dark' ? 'border-slate-600 bg-slate-700/50 text-white placeholder-slate-400' : 'border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-500'} rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 text-lg font-medium`}
                    />
                  </div>
                </div>
              </div>

              {/* Type and Rating Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Type Field */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <label className="block text-lg font-black text-gray-900 dark:text-white mb-4">Experience Type</label>
                    <select 
                      name="type" 
                      value={form.type} 
                      onChange={handleChange} 
                      className={`w-full px-6 py-5 border-2 ${theme === 'dark' ? 'border-slate-600 bg-slate-700/50 text-white' : 'border-gray-200 bg-gray-50/50 text-gray-900'} rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 appearance-none cursor-pointer text-lg font-medium`}
                    >
                      <option value="Nature">🌿 Nature & Wildlife</option>
                      <option value="Cultural">🏛️ Cultural & Heritage</option>
                      <option value="Adventure">🏔️ Adventure & Trekking</option>
                      <option value="City">🏙️ City & Urban</option>
                      <option value="Relaxation">🧘 Relaxation & Wellness</option>
                    </select>
                  </div>
                </div>

                {/* Rating Field */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <label className="block text-lg font-black text-gray-900 dark:text-white mb-4">Your Rating</label>
                    <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-200 dark:border-amber-700">
                      <StarRating value={form.rating} onChange={(r) => setForm((s) => ({ ...s, rating: r }))} />
                      <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                        {form.rating ? `${form.rating}/5` : "Select Rating"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Review Content Section */}
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-4">
                  Your
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 ml-3">Experience</span>
                </h3>
                <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto"></div>
              </div>
              
              {/* Review Textarea */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <label className="block text-lg font-black text-gray-900 dark:text-white mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <FaEdit className="text-white text-sm" />
                      </div>
                      <span>Share Your Experience</span>
                    </div>
                  </label>
                  <textarea 
                    name="review" 
                    value={form.review} 
                    onChange={handleChange} 
                    rows={8}
                    className={`w-full px-6 py-5 border-2 ${theme === 'dark' ? 'border-slate-600 bg-slate-700/50 text-white placeholder-slate-400' : 'border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-500'} rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 resize-none text-lg font-medium leading-relaxed`}
                    placeholder="Share what made this place special, tips for other travelers, highlights of your visit, and anything others should know. Be detailed and honest - your insights help fellow travelers make informed decisions."
                  />
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-500 dark:text-slate-400 font-medium">
                      {form.review.length} characters (minimum 20 required)
                    </div>
                    <div className={`text-sm font-bold ${form.review.length >= 20 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                      {form.review.length >= 20 ? '✓ Good length' : 'Need more details'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendation and Photos Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recommendation Field */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <label className="block text-lg font-black text-gray-900 dark:text-white mb-4">Would You Recommend?</label>
                    <div className="flex gap-4">
                      <button 
                        type="button" 
                        onClick={() => setForm((s) => ({ ...s, recommend: "yes" }))} 
                        className={`flex-1 flex items-center justify-center gap-3 py-5 px-6 rounded-2xl font-black text-lg transition-all duration-300 transform hover:scale-105 ${
                          form.recommend === "yes" 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-2xl' 
                            : `${theme === 'dark' ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                        }`}
                      >
                        <FaThumbsUp className="text-xl" />
                        <span>Yes</span>
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setForm((s) => ({ ...s, recommend: "no" }))} 
                        className={`flex-1 flex items-center justify-center gap-3 py-5 px-6 rounded-2xl font-black text-lg transition-all duration-300 transform hover:scale-105 ${
                          form.recommend === "no" 
                            ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-2xl' 
                            : `${theme === 'dark' ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                        }`}
                      >
                        <FaThumbsDown className="text-xl" />
                        <span>No</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Photo Upload Field */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <label className="block text-lg font-black text-gray-900 dark:text-white mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                          <FaCamera className="text-white text-sm" />
                        </div>
                        <span>Upload Photos (max 4)</span>
                      </div>
                    </label>
                    
                    {/* Drag and Drop Area */}
                    <div 
                      className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
                        dragActive 
                          ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' 
                          : `${theme === 'dark' ? 'border-slate-600 bg-slate-700/30' : 'border-gray-300 bg-gray-50'} hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20`
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        onChange={handleFiles} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      />
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
                          <FaUpload className="text-white text-2xl" />
                        </div>
                        <p className="text-lg font-black text-gray-900 dark:text-white mb-2">
                          Drag & drop photos here
                        </p>
                        <p className="text-gray-600 dark:text-slate-400 font-medium">
                          or click to browse files
                        </p>
                      </div>
                    </div>

                    {/* Image Previews */}
                    {previews.length > 0 && (
                      <div className="mt-6 grid grid-cols-2 gap-4">
                        {previews.map((src, idx) => (
                          <div key={idx} className="relative group/img">
                            <div className="aspect-square rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-slate-600 shadow-xl">
                              <img src={src} alt={`preview-${idx}`} className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-110" />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-2xl"
                            >
                              <FaTimes className="text-sm" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Ultra Premium Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
              <button 
                type="submit" 
                disabled={submitting} 
                className="group relative inline-flex items-center gap-4 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 text-white font-black px-12 py-6 rounded-2xl hover:from-teal-600 hover:via-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed text-xl relative overflow-hidden"
              >
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                  {submitting ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FaCheck className="text-lg" />
                  )}
                </div>
                <span>{submitting ? "Submitting Review..." : "Submit Review"}</span>
                
                {/* Premium Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
              
              <button 
                type="button" 
                onClick={clearDraft}
                className="inline-flex items-center gap-3 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white font-bold text-lg transition-colors duration-300 px-6 py-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                <FaTrash className="text-sm" />
                <span>Clear Draft</span>
              </button>
            </div>
          </form>
        </div>

        {/* Ultra Premium Disclaimer */}
        <div className="mt-12 text-center">
          <div className={`max-w-4xl mx-auto p-8 ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/50'} rounded-3xl backdrop-blur-xl border ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'} shadow-2xl`}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <FaHeart className="text-white text-sm" />
              </div>
              <h4 className="text-xl font-black text-gray-900 dark:text-white">Community Guidelines</h4>
            </div>
            <p className="text-gray-600 dark:text-slate-300 leading-relaxed font-medium">
              By submitting your review, you confirm that it's based on your genuine experience and contains truthful information. 
              Please avoid inappropriate language or personal data. Our team may review and moderate submissions to maintain 
              quality and help fellow travelers make informed decisions.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Ultra Premium Star Rating Component
function StarRating({ value = 0, onChange }) {
  const [hover, setHover] = useState(0);
  
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          className="group relative transition-all duration-300 transform hover:scale-125 focus:outline-none"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
          <FaStar 
            className={`relative w-10 h-10 transition-all duration-300 ${
              (hover || value) >= i 
                ? 'text-amber-400 drop-shadow-lg' 
                : 'text-gray-300 dark:text-slate-600'
            }`}
          />
        </button>
      ))}
    </div>
  );
}