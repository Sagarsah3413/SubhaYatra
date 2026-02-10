import { useEffect, useState } from "react";
import Footer from "../components/footer/Footer";
import { Header } from "../components/header/Header";
import { useTheme } from "../contexts/ThemeContext";
import { FaStar, FaCamera, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaEnvelope, FaEdit, FaHeart, FaThumbsUp, FaThumbsDown, FaTimes, FaCheck, FaUpload, FaImage, FaTrash } from "react-icons/fa";

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

      const res = await fetch("http://localhost:8000/api/reviews", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Review endpoint returned non-OK status", res.status, errorData);
        setError(errorData.error || "Failed to submit review. Please try again.");
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
      setForm({ name: "", email: "", place: "", visitDate: "", type: "Nature", rating: 0, review: "", recommend: "yes" });
      setImages([]);
      localStorage.removeItem("writeReviewDraft");
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error(err);
      setError("Failed to submit review. Please check your connection and try again.");
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

      {/* Professional Hero Section */}
      <div className="relative overflow-hidden">
        {/* Clean Gradient Background */}
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-teal-900/20 to-slate-900' : 'bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50'}`}></div>
        
        {/* Subtle Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center">
            {/* Badge */}
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${theme === 'dark' ? 'bg-teal-500/20 border-teal-400/30' : 'bg-white/80 border-teal-200'} border backdrop-blur-xl mb-8 shadow-lg`}>
              <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <FaEdit className="text-white text-sm" />
              </div>
              <span className={`${theme === 'dark' ? 'text-teal-300' : 'text-teal-700'} font-bold text-lg`}>Share Your Experience</span>
            </div>
            
            {/* Title */}
            <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-6 tracking-tight leading-tight`}>
              Write a
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 mt-2">
                Review
              </span>
            </h1>
            
            {/* Description */}
            <p className={`text-xl lg:text-2xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-4xl mx-auto leading-relaxed mb-12`}>
              Share your travel experience and help fellow travelers discover amazing places in Nepal.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FaEdit className="text-white text-lg" />
                </div>
                <div className="text-left">
                  <div className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>1K+</div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Reviews</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FaMapMarkerAlt className="text-white text-lg" />
                </div>
                <div className="text-left">
                  <div className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>500+</div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Places</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FaHeart className="text-white text-lg" />
                </div>
                <div className="text-left">
                  <div className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Trusted</div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Community</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Professional Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-20">
        
        {/* Professional Form Container */}
        <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-3xl shadow-xl border ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'} p-8 lg:p-12`}>
          
          {/* Form Header */}
          <div className="text-center mb-10">
            <div className={`inline-flex items-center gap-3 px-5 py-2 rounded-full ${theme === 'dark' ? 'bg-teal-900/30 border-teal-700' : 'bg-teal-50 border-teal-200'} border mb-6`}>
              <FaEdit className={`${theme === 'dark' ? 'text-teal-400' : 'text-teal-600'} text-lg`} />
              <span className={`${theme === 'dark' ? 'text-teal-300' : 'text-teal-700'} font-bold text-lg`}>Review Form</span>
            </div>
            <h2 className={`text-4xl lg:text-5xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
              Tell Us About Your Journey
            </h2>
            <p className={`text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
              Your experience matters. Help others discover amazing places through your authentic review.
            </p>
          </div>

          {/* Success Message */}
          {submitted && (
            <div className={`mb-8 p-6 ${theme === 'dark' ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'} border-2 rounded-2xl`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <FaCheck className="text-white text-xl" />
                </div>
                <div>
                  <p className={`${theme === 'dark' ? 'text-green-300' : 'text-green-800'} font-bold text-xl mb-1`}>Review Submitted Successfully!</p>
                  <p className={`${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>Thank you for sharing your experience.</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className={`mb-8 p-6 ${theme === 'dark' ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'} border-2 rounded-2xl`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-600 rounded-xl flex items-center justify-center">
                  <FaTimes className="text-white text-xl" />
                </div>
                <div>
                  <p className={`${theme === 'dark' ? 'text-red-300' : 'text-red-800'} font-bold text-xl mb-1`}>Please Fix the Following:</p>
                  <p className={`${theme === 'dark' ? 'text-red-400' : 'text-red-700'}`}>{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Professional Form */}
          <form onSubmit={submitForm} className="space-y-10">
            
            {/* Personal Information Section */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
                  Personal Information
                </h3>
                <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mx-auto"></div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Name Field */}
                <div>
                  <label className={`block text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>
                    <div className="flex items-center gap-2">
                      <FaUser className="text-teal-500" />
                      <span>Full Name</span>
                    </div>
                  </label>
                  <input 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    className={`w-full px-5 py-4 border-2 ${theme === 'dark' ? 'border-slate-600 bg-slate-700 text-white placeholder-slate-400' : 'border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500'} rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-lg`}
                    placeholder="Enter your full name" 
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className={`block text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-blue-500" />
                      <span>Email Address</span>
                    </div>
                  </label>
                  <input 
                    name="email" 
                    value={form.email} 
                    onChange={handleChange} 
                    type="email"
                    className={`w-full px-5 py-4 border-2 ${theme === 'dark' ? 'border-slate-600 bg-slate-700 text-white placeholder-slate-400' : 'border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500'} rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-lg`}
                    placeholder="your.email@example.com" 
                  />
                </div>
              </div>
            </div>
            {/* Trip Details Section */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
                  Trip Details
                </h3>
                <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mx-auto"></div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Place Field */}
                <div className="lg:col-span-2">
                  <label className={`block text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-cyan-500" />
                      <span>Place Visited</span>
                    </div>
                  </label>
                  <input 
                    name="place" 
                    value={form.place} 
                    onChange={handleChange} 
                    className={`w-full px-5 py-4 border-2 ${theme === 'dark' ? 'border-slate-600 bg-slate-700 text-white placeholder-slate-400' : 'border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500'} rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-lg`}
                    placeholder="Name of attraction, hotel, or restaurant" 
                  />
                </div>

                {/* Visit Date Field */}
                <div>
                  <label className={`block text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-purple-500" />
                      <span>Visit Date</span>
                    </div>
                  </label>
                  <input 
                    name="visitDate" 
                    value={form.visitDate} 
                    onChange={handleChange} 
                    type="date"
                    className={`w-full px-5 py-4 border-2 ${theme === 'dark' ? 'border-slate-600 bg-slate-700 text-white' : 'border-gray-300 bg-gray-50 text-gray-900'} rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-lg`}
                  />
                </div>
              </div>

              {/* Type and Rating Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Type Field */}
                <div>
                  <label className={`block text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>Experience Type</label>
                  <select 
                    name="type" 
                    value={form.type} 
                    onChange={handleChange} 
                    className={`w-full px-5 py-4 border-2 ${theme === 'dark' ? 'border-slate-600 bg-slate-700 text-white' : 'border-gray-300 bg-gray-50 text-gray-900'} rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all appearance-none cursor-pointer text-lg`}
                  >
                    <option value="Nature">🌿 Nature & Wildlife</option>
                    <option value="Cultural">🏛️ Cultural & Heritage</option>
                    <option value="Adventure">🏔️ Adventure & Trekking</option>
                    <option value="City">🏙️ City & Urban</option>
                    <option value="Relaxation">🧘 Relaxation & Wellness</option>
                  </select>
                </div>

                {/* Rating Field */}
                <div>
                  <label className={`block text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>Your Rating</label>
                  <div className={`flex items-center gap-6 p-4 ${theme === 'dark' ? 'bg-amber-900/20 border-amber-700' : 'bg-amber-50 border-amber-200'} rounded-xl border`}>
                    <StarRating value={form.rating} onChange={(r) => setForm((s) => ({ ...s, rating: r }))} />
                    <div className={`text-xl font-bold ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}>
                      {form.rating ? `${form.rating}/5` : "Select Rating"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Review Content Section */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
                  Your Experience
                </h3>
                <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto"></div>
              </div>
              
              {/* Review Textarea */}
              <div>
                <label className={`block text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>
                  <div className="flex items-center gap-2">
                    <FaEdit className="text-indigo-500" />
                    <span>Share Your Experience</span>
                  </div>
                </label>
                <textarea 
                  name="review" 
                  value={form.review} 
                  onChange={handleChange} 
                  rows={8}
                  className={`w-full px-5 py-4 border-2 ${theme === 'dark' ? 'border-slate-600 bg-slate-700 text-white placeholder-slate-400' : 'border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500'} rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all resize-none text-lg leading-relaxed`}
                  placeholder="Share what made this place special, tips for other travelers, highlights of your visit, and anything others should know. Be detailed and honest - your insights help fellow travelers make informed decisions."
                />
                <div className="flex items-center justify-between mt-3">
                  <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                    {form.review.length} characters (minimum 20 required)
                  </div>
                  <div className={`text-sm font-bold ${form.review.length >= 20 ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') : (theme === 'dark' ? 'text-red-400' : 'text-red-500')}`}>
                    {form.review.length >= 20 ? '✓ Good length' : 'Need more details'}
                  </div>
                </div>
              </div>

              {/* Recommendation and Photos Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recommendation Field */}
                <div>
                  <label className={`block text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>Would You Recommend?</label>
                  <div className="flex gap-4">
                    <button 
                      type="button" 
                      onClick={() => setForm((s) => ({ ...s, recommend: "yes" }))} 
                      className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                        form.recommend === "yes" 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' 
                          : `${theme === 'dark' ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                      }`}
                    >
                      <FaThumbsUp />
                      <span>Yes</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setForm((s) => ({ ...s, recommend: "no" }))} 
                      className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                        form.recommend === "no" 
                          ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg' 
                          : `${theme === 'dark' ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                      }`}
                    >
                      <FaThumbsDown />
                      <span>No</span>
                    </button>
                  </div>
                </div>

                {/* Photo Upload Field */}
                <div>
                  <label className={`block text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>
                    <div className="flex items-center gap-2">
                      <FaCamera className="text-pink-500" />
                      <span>Upload Photos (max 4)</span>
                    </div>
                  </label>
                  
                  {/* Drag and Drop Area */}
                  <div 
                    className={`relative border-2 border-dashed rounded-xl p-6 transition-all ${
                      dragActive 
                        ? `${theme === 'dark' ? 'border-teal-500 bg-teal-900/20' : 'border-teal-500 bg-teal-50'}` 
                        : `${theme === 'dark' ? 'border-slate-600 bg-slate-700/30 hover:border-teal-400 hover:bg-teal-900/20' : 'border-gray-300 bg-gray-50 hover:border-teal-400 hover:bg-teal-50'}`
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
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <FaUpload className="text-white text-xl" />
                        </div>
                        <p className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1`}>
                          Drag & drop photos here
                        </p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                          or click to browse files
                        </p>
                      </div>
                    </div>

                    {/* Image Previews */}
                    {previews.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        {previews.map((src, idx) => (
                          <div key={idx} className="relative group/img">
                            <div className={`aspect-square rounded-xl overflow-hidden border-2 ${theme === 'dark' ? 'border-slate-600' : 'border-gray-200'}`}>
                              <img src={src} alt={`preview-${idx}`} className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-110" />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all"
                            >
                              <FaTimes className="text-xs" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <button 
                type="submit" 
                disabled={submitting} 
                className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 text-white font-bold px-10 py-4 rounded-xl hover:from-teal-600 hover:via-cyan-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting Review...</span>
                  </>
                ) : (
                  <>
                    <FaCheck />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
              
              <button 
                type="button" 
                onClick={clearDraft}
                className={`inline-flex items-center gap-2 ${theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} font-bold text-lg transition-colors px-6 py-3 rounded-xl`}
              >
                <FaTrash className="text-sm" />
                <span>Clear Draft</span>
              </button>
            </div>
          </form>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 text-center">
          <div className={`max-w-4xl mx-auto p-6 ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white/50 border-gray-200'} rounded-2xl backdrop-blur-xl border`}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <FaHeart className="text-blue-500" />
              <h4 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Community Guidelines</h4>
            </div>
            <p className={`${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'} leading-relaxed`}>
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

// Star Rating Component
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
          className="transition-all duration-300 transform hover:scale-110 focus:outline-none"
        >
          <FaStar 
            className={`w-8 h-8 transition-all ${
              (hover || value) >= i 
                ? 'text-amber-400' 
                : 'text-gray-300 dark:text-slate-600'
            }`}
          />
        </button>
      ))}
    </div>
  );
}