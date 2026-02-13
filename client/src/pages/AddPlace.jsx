import { useState, useEffect, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useToast } from "../contexts/ToastContext";
import Footer from "../components/footer/Footer";
import { Header } from "../components/header/Header";

const SUGGESTED_TAGS = ["waterfall", "hiking", "temple", "photography", "camping", "hot-springs", "trekking", "wildlife", "heritage", "scenic", "adventure", "peaceful"];

export default function AddPlace() {
  const { bgClass, textClass } = useTheme();
  const { showToast } = useToast();
  const [form, setForm] = useState({ 
    submissionType: "place", // new field: place, hotel, restaurant
    name: "", 
    location: "", 
    type: "Nature", 
    tags: [], 
    description: "",
    // Hotel-specific fields
    priceRange: "",
    rating: "",
    // Restaurant-specific fields
    cuisine: "",
    priceLevel: ""
  });
  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [successModal, setSuccessModal] = useState(null);
  const [backendStatus, setBackendStatus] = useState("checking"); // checking, online, offline

  const fileInputRef = useRef(null);

  // Check backend status on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch("http://localhost:8000/", { method: "GET" });
        if (response.ok) {
          setBackendStatus("online");
        } else {
          setBackendStatus("offline");
        }
      } catch (error) {
        setBackendStatus("offline");
      }
    };
    checkBackend();
  }, []);

  useEffect(() => {
    if (!images.length) return setPreviews([]);
    const urls = images.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [images]);

  const setField = (name, value) => {
    setForm((s) => ({ ...s, [name]: value }));
    // live validation clear - remove the error instead of setting to undefined
    setErrors((e) => {
      const newErrors = { ...e };
      delete newErrors[name];
      return newErrors;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setField(name, value);
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    const val = tagInput.trim().toLowerCase();
    if (!val) return setTagInput("");
    if (!form.tags.includes(val)) setForm((s) => ({ ...s, tags: [...s.tags, val] }));
    setTagInput("");
  };

  const handleTagKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag(e);
    }
  };

  const removeTag = (t) => setForm((s) => ({ ...s, tags: s.tags.filter((x) => x !== t) }));

  const handleFiles = (filesList) => {
    const files = Array.from(filesList)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, 6); // allow up to 6
    setImages(files);
    setCoverIndex(0);
    setIsDragging(false);
  };

  const onFileChange = (e) => handleFiles(e.target.files);

  // Drag & Drop
  const onDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer?.files) handleFiles(e.dataTransfer.files);
    setIsDragging(false);
  };
  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e) => setIsDragging(false);

  const validateFields = () => {
    const errs = {};
    
    // Dynamic label for name field
    const nameLabel = form.submissionType === 'hotel' ? 'Hotel name' : form.submissionType === 'restaurant' ? 'Restaurant name' : 'Place name';
    
    // Name validation
    if (!form.name.trim()) {
      errs.name = `${nameLabel} is required.`;
    } else if (form.name.trim().length < 3) {
      errs.name = `${nameLabel} must be at least 3 characters.`;
    } else if (form.name.trim().length > 100) {
      errs.name = `${nameLabel} must be less than 100 characters.`;
    }
    
    // Description validation
    if (!form.description.trim()) {
      errs.description = "Description is required.";
    } else if (form.description.trim().length < 20) {
      errs.description = `Description must be at least 20 characters (currently ${form.description.trim().length}).`;
    } else if (form.description.trim().length > 2000) {
      errs.description = "Description must be less than 2000 characters.";
    }
    
    // Location validation (optional but recommended)
    if (form.location.trim() && form.location.trim().length < 3) {
      errs.location = "Location must be at least 3 characters if provided.";
    }
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRemoveImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setCoverIndex((prev) => (idx === prev ? 0 : prev > idx ? prev - 1 : prev));
  };

  const confirmReset = () => {
    if (window.confirm("Reset the form? All changes will be lost.")) {
      setForm({ 
        submissionType: "place",
        name: "", 
        location: "", 
        type: "Nature", 
        tags: [], 
        description: "",
        priceRange: "",
        rating: "",
        cuisine: "",
        priceLevel: ""
      });
      setImages([]);
      setTagInput("");
      fileInputRef.current && (fileInputRef.current.value = null);
      setErrors({});
      setMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateFields()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setMessage("Please fix the errors above before submitting.");
      return;
    }

    setSubmitting(true);
    setProgress(0);

    const data = new FormData();
    data.append("submission_type", form.submissionType); // Add submission type
    data.append("name", form.name.trim());
    data.append("location", form.location.trim());
    data.append("type", form.type);
    data.append("description", form.description.trim());
    data.append("tags", form.tags.join(","));
    
    // Add type-specific fields
    if (form.submissionType === "hotel") {
      data.append("price_range", form.priceRange);
      data.append("rating", form.rating || "4.0");
    } else if (form.submissionType === "restaurant") {
      data.append("cuisine", form.cuisine);
      data.append("price_level", form.priceLevel);
      data.append("rating", form.rating || "4.0");
    }
    
    // Add images with proper naming
    images.forEach((file, idx) => {
      data.append(`image_${idx + 1}`, file);
    });
    data.append("cover_index", coverIndex);

    try {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent);
        }
      };

      xhr.onload = () => {
        setSubmitting(false);
        
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const res = JSON.parse(xhr.responseText || "{}");
            
            if (res.success || res.place_id) {
              const submissionTypeLabel = form.submissionType === 'hotel' ? 'Hotel' : form.submissionType === 'restaurant' ? 'Restaurant' : 'Place';
              showToast('success', `🎉 ${submissionTypeLabel} submitted successfully! Awaiting admin approval.`);
              
              setSuccessModal({ 
                id: res.place_id || 'pending', 
                name: form.name 
              });
              
              // Reset form
              setForm({ 
                submissionType: "place",
                name: "", 
                location: "", 
                type: "Nature", 
                tags: [], 
                description: "",
                priceRange: "",
                rating: "",
                cuisine: "",
                priceLevel: ""
              });
              setImages([]);
              setProgress(0);
              setTagInput("");
              if (fileInputRef.current) fileInputRef.current.value = null;
              setErrors({});
              setMessage("");
            } else {
              const successMsg = "✓ Place submitted successfully! Awaiting review.";
              setMessage(successMsg);
              showToast('success', successMsg);
              setTimeout(() => {
                setForm({ 
                  submissionType: "place",
                  name: "", 
                  location: "", 
                  type: "Nature", 
                  tags: [], 
                  description: "",
                  priceRange: "",
                  rating: "",
                  cuisine: "",
                  priceLevel: ""
                });
                setImages([]);
                setProgress(0);
                setTagInput("");
                if (fileInputRef.current) fileInputRef.current.value = null;
                setErrors({});
                setMessage("");
              }, 3000);
            }
          } catch (error) {
            console.error("Response parsing error:", error);
            const successMsg = "✓ Place submitted successfully! Awaiting review.";
            setMessage(successMsg);
            showToast('success', successMsg);
            setTimeout(() => {
              setForm({ 
                submissionType: "place",
                name: "", 
                location: "", 
                type: "Nature", 
                tags: [], 
                description: "",
                priceRange: "",
                rating: "",
                cuisine: "",
                priceLevel: ""
              });
              setImages([]);
              setProgress(0);
              setTagInput("");
              if (fileInputRef.current) fileInputRef.current.value = null;
              setErrors({});
              setMessage("");
            }, 3000);
          }
        } else {
          // Handle error responses
          try {
            const errorData = JSON.parse(xhr.responseText || "{}");
            const errorMsg = errorData.error || errorData.message || "Failed to submit place";
            const fullErrorMsg = `❌ Error: ${errorMsg}. Please try again.`;
            setMessage(fullErrorMsg);
            showToast('error', errorMsg);
            console.error("Server error:", errorData);
          } catch {
            const errorMsg = `❌ Server error (${xhr.status}). Please check your connection and try again.`;
            setMessage(errorMsg);
            showToast('error', `Server error (${xhr.status})`);
          }
        }
      };
      
      xhr.onerror = () => {
        setSubmitting(false);
        setProgress(0);
        const errorMsg = "❌ Network error. Please check if the backend server is running at http://localhost:8000";
        setMessage(errorMsg);
        showToast('error', 'Network error. Backend server may not be running.');
        console.error("Network error - backend may not be running");
      };
      
      xhr.ontimeout = () => {
        setSubmitting(false);
        setProgress(0);
        setMessage("❌ Request timeout. Please try again.");
      };

      xhr.open("POST", "http://localhost:8000/api/places", true);
      xhr.timeout = 30000; // 30 second timeout
      xhr.send(data);
      
    } catch (error) {
      setSubmitting(false);
      setProgress(0);
      setMessage("❌ Unexpected error occurred. Please try again.");
      console.error("Submit error:", error);
    }
  };

  return (
    <div className={`${bgClass} ${textClass} min-h-screen overflow-hidden`}>
      <Header />

      {/* Professional Hero Section */}
      <div className="relative h-96 overflow-hidden mt-16">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-800/90 to-teal-900/85"></div>
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-teal-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative h-full max-w-7xl mx-auto flex flex-col items-start justify-center text-left px-6 lg:px-8 py-8">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 backdrop-blur-sm border border-teal-400/30 rounded-full px-4 py-2 mb-4">
            <svg className="w-4 h-4 text-teal-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-teal-200 text-sm font-semibold tracking-wide">Community Contribution</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-4 tracking-tight">
            Share Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-300">Discovery</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-200 max-w-3xl leading-relaxed font-light">
            Help fellow travelers discover Nepal's hidden gems. Share places, hotels, or restaurants and contribute to our growing community of explorers.
          </p>
          
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Professional Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/60 overflow-hidden">
          
          {/* Card Header */}
          <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Place Information</h2>
                <p className="text-sm text-slate-600 mt-1">Fill in the details below to share your discovery with the community</p>
              </div>
              <div className="hidden lg:flex items-center gap-3">
                {/* Backend Status Indicator */}
                <div className={`flex items-center gap-2 rounded-lg px-4 py-2 border shadow-sm ${
                  backendStatus === "online" 
                    ? "bg-emerald-50 border-emerald-200" 
                    : backendStatus === "offline"
                    ? "bg-rose-50 border-rose-200"
                    : "bg-slate-50 border-slate-200"
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    backendStatus === "online" 
                      ? "bg-emerald-500 animate-pulse" 
                      : backendStatus === "offline"
                      ? "bg-rose-500"
                      : "bg-slate-400 animate-pulse"
                  }`}></div>
                  <span className={`text-xs font-semibold ${
                    backendStatus === "online" 
                      ? "text-emerald-700" 
                      : backendStatus === "offline"
                      ? "text-rose-700"
                      : "text-slate-600"
                  }`}>
                    {backendStatus === "online" ? "Server Online" : backendStatus === "offline" ? "Server Offline" : "Checking..."}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Backend Offline Warning */}
            {backendStatus === "offline" && (
              <div className="mt-4 p-3 bg-rose-100 border border-rose-300 rounded-lg">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-rose-800">Backend Server Not Running</p>
                    <p className="text-xs text-rose-700 mt-1">Please start the backend server at <code className="bg-rose-200 px-1 rounded">http://localhost:8000</code> before submitting.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error Alert */}
          {Object.keys(errors).filter(key => errors[key]).length > 0 && (
            <div role="alert" className="mx-8 mt-6 p-4 rounded-xl bg-gradient-to-r from-rose-50 to-red-50 border-l-4 border-rose-500 shadow-sm">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <h3 className="font-bold text-rose-800 text-sm">Please Review Your Submission</h3>
                  <p className="text-rose-700 text-sm mt-1">There {Object.keys(errors).filter(key => errors[key]).length === 1 ? 'is 1 error' : `are ${Object.keys(errors).filter(key => errors[key]).length} errors`} that need your attention:</p>
                  <ul className="mt-2 space-y-1">
                    {Object.entries(errors)
                      .filter(([field, message]) => message) // Only show errors with actual messages
                      .map(([field, message]) => (
                        <li key={field} className="text-rose-700 text-sm flex items-start gap-2">
                          <span className="text-rose-500 font-bold">•</span>
                          <span><strong className="capitalize">{field}:</strong> {message}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Success/Error Message */}
          {message && (
            <div role="status" className={`mx-8 mt-6 p-4 rounded-xl border-l-4 shadow-sm ${message.startsWith('✓') ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-500' : 'bg-gradient-to-r from-rose-50 to-red-50 border-rose-500'}`}>
              <div className="flex items-start gap-3">
                {message.startsWith('✓') ? (
                  <svg className="w-5 h-5 text-emerald-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-rose-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                <p className={`text-sm font-medium ${message.startsWith('✓') ? 'text-emerald-800' : 'text-rose-800'}`}>{message}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Submission Type Selector */}
            <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-indigo-200 shadow-lg">
              <label className="flex items-center gap-2 text-base font-black text-slate-800 mb-4">
                <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                What are you submitting? <span className="text-rose-500">*</span>
              </label>
              <p className="text-sm text-slate-600 mb-4">Choose the type of submission based on your dataset category</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Place Option */}
                <button
                  type="button"
                  onClick={() => setField("submissionType", "place")}
                  className={`group relative p-6 rounded-xl border-2 transition-all duration-300 ${
                    form.submissionType === "place"
                      ? "border-teal-500 bg-teal-50 shadow-lg scale-105"
                      : "border-slate-300 bg-white hover:border-teal-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`p-4 rounded-full transition-colors duration-300 ${
                      form.submissionType === "place"
                        ? "bg-teal-500"
                        : "bg-slate-100 group-hover:bg-teal-100"
                    }`}>
                      <svg className={`w-8 h-8 ${
                        form.submissionType === "place" ? "text-white" : "text-slate-600 group-hover:text-teal-600"
                      }`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg ${
                        form.submissionType === "place" ? "text-teal-700" : "text-slate-800"
                      }`}>Place / Destination</h3>
                      <p className="text-xs text-slate-600 mt-1">Tourist spots, landmarks, attractions</p>
                    </div>
                    {form.submissionType === "place" && (
                      <div className="absolute top-3 right-3">
                        <svg className="w-6 h-6 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>

                {/* Hotel Option */}
                <button
                  type="button"
                  onClick={() => setField("submissionType", "hotel")}
                  className={`group relative p-6 rounded-xl border-2 transition-all duration-300 ${
                    form.submissionType === "hotel"
                      ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                      : "border-slate-300 bg-white hover:border-blue-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`p-4 rounded-full transition-colors duration-300 ${
                      form.submissionType === "hotel"
                        ? "bg-blue-500"
                        : "bg-slate-100 group-hover:bg-blue-100"
                    }`}>
                      <svg className={`w-8 h-8 ${
                        form.submissionType === "hotel" ? "text-white" : "text-slate-600 group-hover:text-blue-600"
                      }`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg ${
                        form.submissionType === "hotel" ? "text-blue-700" : "text-slate-800"
                      }`}>Hotel / Accommodation</h3>
                      <p className="text-xs text-slate-600 mt-1">Hotels, lodges, guesthouses</p>
                    </div>
                    {form.submissionType === "hotel" && (
                      <div className="absolute top-3 right-3">
                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>

                {/* Restaurant Option */}
                <button
                  type="button"
                  onClick={() => setField("submissionType", "restaurant")}
                  className={`group relative p-6 rounded-xl border-2 transition-all duration-300 ${
                    form.submissionType === "restaurant"
                      ? "border-orange-500 bg-orange-50 shadow-lg scale-105"
                      : "border-slate-300 bg-white hover:border-orange-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`p-4 rounded-full transition-colors duration-300 ${
                      form.submissionType === "restaurant"
                        ? "bg-orange-500"
                        : "bg-slate-100 group-hover:bg-orange-100"
                    }`}>
                      <svg className={`w-8 h-8 ${
                        form.submissionType === "restaurant" ? "text-white" : "text-slate-600 group-hover:text-orange-600"
                      }`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg ${
                        form.submissionType === "restaurant" ? "text-orange-700" : "text-slate-800"
                      }`}>Restaurant / Dining</h3>
                      <p className="text-xs text-slate-600 mt-1">Restaurants, cafes, eateries</p>
                    </div>
                    {form.submissionType === "restaurant" && (
                      <div className="absolute top-3 right-3">
                        <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                
                {/* Dynamic Name Field */}
                <div className="group">
                  <label htmlFor="place-name" className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                    <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {form.submissionType === 'hotel' ? 'Hotel Name' : form.submissionType === 'restaurant' ? 'Restaurant Name' : 'Place Name'} <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    id="place-name" 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    aria-required="true" 
                    aria-invalid={errors.name ? "true" : "false"} 
                    className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-4 focus:ring-teal-500/20 transition-all duration-200 text-slate-900 ${errors.name ? 'border-rose-400 bg-rose-50 focus:border-rose-500' : 'border-slate-200 focus:border-teal-500 bg-white'}`} 
                    placeholder={
                      form.submissionType === 'hotel' 
                        ? 'e.g., Hotel Everest View, Yak & Yeti Hotel' 
                        : form.submissionType === 'restaurant'
                        ? 'e.g., Fire and Ice Pizzeria, Bhojan Griha'
                        : 'e.g., Phewa Lake, Annapurna Base Camp'
                    } 
                  />
                  {errors.name && (
                    <div className="flex items-center gap-2 text-rose-600 text-sm mt-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.name}
                    </div>
                  )}
                </div>

                {/* Location & Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label htmlFor="place-location" className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
                      </svg>
                      Location
                      <span className="text-xs font-normal text-slate-500">(recommended)</span>
                    </label>
                    <input 
                      id="place-location" 
                      name="location" 
                      value={form.location} 
                      onChange={handleChange} 
                      className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 text-slate-900 ${
                        errors.location 
                          ? 'border-rose-400 bg-rose-50 focus:border-rose-500' 
                          : 'border-slate-200 focus:border-blue-500 bg-white'
                      }`}
                      placeholder="e.g., Pokhara, Gandaki Province" 
                    />
                    {errors.location && (
                      <div className="flex items-center gap-2 text-rose-600 text-sm mt-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.location}
                      </div>
                    )}
                  </div>

                  <div className="group">
                    <label htmlFor="place-type" className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                      </svg>
                      Category
                    </label>
                    <select 
                      id="place-type" 
                      name="type" 
                      value={form.type} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white text-slate-900"
                    >
                      <option value="Nature">Nature</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Adventure">Adventure</option>
                      <option value="City">City</option>
                      <option value="Relaxation">Relaxation</option>
                      <option value="Religious">Religious</option>
                      <option value="Historical">Historical</option>
                      <option value="Wildlife">Wildlife</option>
                    </select>
                  </div>
                </div>

                {/* Conditional Fields for Hotel */}
                {form.submissionType === "hotel" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2 mb-4">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        <h3 className="text-lg font-bold text-blue-900">Hotel Details</h3>
                      </div>
                    </div>
                    
                    <div className="group">
                      <label htmlFor="price-range" className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                        </svg>
                        Price Range
                      </label>
                      <select 
                        id="price-range" 
                        name="priceRange" 
                        value={form.priceRange} 
                        onChange={handleChange} 
                        className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white text-slate-900"
                      >
                        <option value="">Select price range</option>
                        <option value="Budget ($10-30)">Budget ($10-30)</option>
                        <option value="Mid-range ($30-80)">Mid-range ($30-80)</option>
                        <option value="Luxury ($80+)">Luxury ($80+)</option>
                      </select>
                    </div>

                    <div className="group">
                      <label htmlFor="hotel-rating" className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                        <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Rating (optional)
                      </label>
                      <input 
                        id="hotel-rating" 
                        name="rating" 
                        type="number" 
                        min="1" 
                        max="5" 
                        step="0.1"
                        value={form.rating} 
                        onChange={handleChange} 
                        className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white text-slate-900"
                        placeholder="e.g., 4.5"
                      />
                    </div>
                  </div>
                )}

                {/* Conditional Fields for Restaurant */}
                {form.submissionType === "restaurant" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-orange-50 rounded-xl border-2 border-orange-200">
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2 mb-4">
                        <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                        </svg>
                        <h3 className="text-lg font-bold text-orange-900">Restaurant Details</h3>
                      </div>
                    </div>
                    
                    <div className="group">
                      <label htmlFor="cuisine" className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                        <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        Cuisine Type
                      </label>
                      <input 
                        id="cuisine" 
                        name="cuisine" 
                        value={form.cuisine} 
                        onChange={handleChange} 
                        className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 bg-white text-slate-900"
                        placeholder="e.g., Nepali, Indian, Chinese"
                      />
                    </div>

                    <div className="group">
                      <label htmlFor="price-level" className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                        </svg>
                        Price Level
                      </label>
                      <select 
                        id="price-level" 
                        name="priceLevel" 
                        value={form.priceLevel} 
                        onChange={handleChange} 
                        className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 bg-white text-slate-900"
                      >
                        <option value="">Select price level</option>
                        <option value="$ (Budget)">$ (Budget)</option>
                        <option value="$$ (Moderate)">$$ (Moderate)</option>
                        <option value="$$$ (Expensive)">$$$ (Expensive)</option>
                        <option value="$$$$ (Very Expensive)">$$$$ (Very Expensive)</option>
                      </select>
                    </div>

                    <div className="group">
                      <label htmlFor="restaurant-rating" className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                        <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Rating (optional)
                      </label>
                      <input 
                        id="restaurant-rating" 
                        name="rating" 
                        type="number" 
                        min="1" 
                        max="5" 
                        step="0.1"
                        value={form.rating} 
                        onChange={handleChange} 
                        className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 bg-white text-slate-900"
                        placeholder="e.g., 4.5"
                      />
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="group">
                  <label htmlFor="place-description" className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea 
                    id="place-description" 
                    name="description" 
                    value={form.description} 
                    onChange={handleChange} 
                    rows={7} 
                    className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-4 focus:ring-emerald-500/20 resize-none transition-all duration-200 text-slate-900 ${errors.description ? 'border-rose-400 bg-rose-50 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500 bg-white'}`} 
                    placeholder="Share what makes this place special. Include tips for visitors, best time to visit, what to expect, and any insider knowledge that would help fellow travelers..."
                  ></textarea>
                  <div className="flex justify-between items-center mt-3">
                    {errors.description ? (
                      <div className="flex items-center gap-2 text-rose-600 text-sm">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.description}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className={form.description.length >= 20 ? 'text-emerald-600 font-semibold' : form.description.length >= 10 ? 'text-amber-600' : ''}>
                          {form.description.length} / 2000 characters
                          {form.description.length < 20 && ` (${20 - form.description.length} more needed)`}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Markdown supported
                      </span>
                      <span>•</span>
                      <span>Be specific & helpful</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                    <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    Tags
                  </label>
                  <p className="text-xs text-slate-500 mb-3 flex items-center gap-2">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Add descriptive tags to help travelers discover this place
                  </p>
                  
                  <div className="flex gap-2 items-center">
                    <input 
                      name="tags" 
                      value={tagInput} 
                      onChange={(e) => setTagInput(e.target.value)} 
                      onKeyDown={handleTagKey} 
                      className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-700 focus:ring-4 focus:ring-slate-500/20 focus:border-slate-500 transition-all duration-200" 
                      placeholder="Type a tag and press Enter" 
                    />
                    <button 
                      type="button"
                      onClick={handleAddTag} 
                      className="px-6 py-3 bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Add
                    </button>
                  </div>

                  {/* Selected Tags */}
                  {form.tags.length > 0 && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-2 mb-3">
                        <svg className="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-semibold text-slate-700">{form.tags.length} tag{form.tags.length !== 1 ? 's' : ''} added</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {form.tags.map((t) => (
                          <span key={t} className="inline-flex items-center gap-2 bg-white border-2 border-slate-200 text-slate-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200">
                            <span className="text-amber-600">#</span>{t}
                            <button 
                              type="button"
                              aria-label={`Remove ${t}`} 
                              onClick={() => removeTag(t)} 
                              className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-full p-0.5 transition-colors duration-200"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Tags */}
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-2">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Suggested tags
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {SUGGESTED_TAGS.map((s) => (
                        <button 
                          key={s} 
                          type="button" 
                          onClick={() => { if (!form.tags.includes(s)) setForm((sf) => ({ ...sf, tags: [...sf.tags, s] })); }} 
                          disabled={form.tags.includes(s)}
                          className={`text-xs px-3 py-1.5 rounded-full border-2 transition-all duration-200 ${
                            form.tags.includes(s) 
                              ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
                              : 'bg-white border-slate-300 text-slate-700 hover:border-slate-500 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}
              <aside className="lg:col-span-1">
                <div className="sticky top-6">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                    <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    Photos
                    <span className="text-xs font-normal text-slate-500">(optional, up to 6 images)</span>
                  </label>

                  {/* Drag & Drop Zone */}
                  <div 
                    onDrop={onDrop} 
                    onDragOver={onDragOver} 
                    onDragLeave={onDragLeave} 
                    className={`relative border-3 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${
                      isDragging 
                        ? 'border-teal-500 bg-gradient-to-br from-teal-50 to-blue-50 shadow-lg scale-105' 
                        : 'border-slate-300 bg-gradient-to-br from-slate-50 to-white hover:border-teal-400 hover:bg-teal-50/30'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-center">
                        <div className={`p-4 rounded-full ${isDragging ? 'bg-teal-100' : 'bg-slate-100'} transition-colors duration-300`}>
                          <svg className={`w-8 h-8 ${isDragging ? 'text-teal-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          {isDragging ? 'Drop images here!' : 'Drag & drop images'}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">or</p>
                        <button 
                          type="button" 
                          onClick={() => fileInputRef.current.click()} 
                          className="mt-2 px-4 py-2 bg-slate-700 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          Browse Files
                        </button>
                      </div>
                      
                      <p className="text-xs text-slate-400">
                        PNG, JPG, WEBP up to 10MB each
                      </p>
                    </div>
                    
                    <input 
                      ref={fileInputRef} 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={onFileChange} 
                      className="hidden" 
                    />
                  </div>

                  {/* Image Previews */}
                  {previews.length > 0 && (
                    <div className="mt-6 space-y-4">
                      {/* Cover Image */}
                      <div className="relative rounded-xl overflow-hidden shadow-lg border-2 border-teal-500">
                        <img 
                          src={previews[coverIndex]} 
                          alt="cover-preview" 
                          className="w-full h-48 object-cover" 
                        />
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center gap-1 bg-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Cover Photo
                          </span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                          <p className="text-white text-xs font-semibold">This will be the main image</p>
                        </div>
                      </div>

                      {/* Thumbnails */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                            All Images ({images.length}/6)
                          </p>
                          <span className="text-xs text-slate-500">Click to set as cover</span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3">
                          {previews.map((src, idx) => (
                            <div 
                              key={idx} 
                              className={`group relative rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                                coverIndex === idx 
                                  ? 'border-teal-500 shadow-lg scale-105' 
                                  : 'border-slate-200 hover:border-indigo-400 hover:shadow-md'
                              }`}
                            >
                              <img 
                                src={src} 
                                alt={`preview-${idx}`} 
                                className="w-full h-24 object-cover" 
                              />
                              
                              {/* Overlay Controls */}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200">
                                <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <button 
                                    type="button" 
                                    onClick={() => setCoverIndex(idx)} 
                                    className="bg-white text-slate-700 px-2 py-1 text-xs font-semibold rounded shadow-lg hover:bg-slate-700 hover:text-white transition-colors duration-200"
                                  >
                                    {coverIndex === idx ? '✓ Cover' : 'Set Cover'}
                                  </button>
                                  <button 
                                    type="button" 
                                    aria-label="Remove image" 
                                    onClick={() => handleRemoveImage(idx)} 
                                    className="bg-rose-500 text-white p-1.5 text-xs rounded shadow-lg hover:bg-rose-600 transition-colors duration-200"
                                  >
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              
                              {/* Cover Badge */}
                              {coverIndex === idx && (
                                <div className="absolute top-1 left-1">
                                  <span className="inline-flex items-center bg-teal-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                    ★
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Upload Progress */}
                      {progress > 0 && (
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-blue-900">Uploading...</span>
                            <span className="text-sm font-bold text-blue-600">{progress}%</span>
                          </div>
                          <div className="w-full bg-blue-100 rounded-full h-2.5 overflow-hidden">
                            <div 
                              style={{ width: `${progress}%` }} 
                              className="h-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 rounded-full"
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {errors.images && (
                    <div className="mt-3 flex items-center gap-2 text-rose-600 text-sm">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.images}
                    </div>
                  )}

                  {/* Pro Tips */}
                  <div className="mt-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <div>
                        <h4 className="text-sm font-bold text-amber-900 mb-2">Pro Tips</h4>
                        <ul className="text-xs text-amber-800 space-y-1">
                          <li>• Use high-quality, well-lit photos</li>
                          <li>• Show different angles & perspectives</li>
                          <li>• Include people for scale (optional)</li>
                          <li>• Avoid heavily filtered images</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>

            {/* Submit Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t-2 border-slate-100">
              <div className="flex items-center gap-4">
                <button 
                  type="submit" 
                  disabled={submitting || Object.keys(errors).filter(key => errors[key]).length > 0 || backendStatus === "offline"} 
                  className="group relative px-8 py-4 bg-slate-800 text-white rounded-xl font-bold text-lg hover:bg-slate-900 transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {submitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </>
                    ) : backendStatus === "offline" ? (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                        </svg>
                        Server Offline
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                        </svg>
                        Submit Place
                      </>
                    )}
                  </span>
                </button>

                <button 
                  type="button" 
                  onClick={confirmReset} 
                  className="px-6 py-4 text-slate-600 hover:text-slate-800 font-semibold rounded-xl hover:bg-slate-100 transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Reset Form
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>All submissions are reviewed within 24 hours</span>
              </div>
            </div>
          </form>
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-teal-100 rounded-lg">
                <svg className="w-6 h-6 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-800">Quality Review</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Our team reviews every submission to ensure accuracy and quality before publishing to the community.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-800">Community Impact</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Help thousands of travelers discover amazing places and create unforgettable memories in Nepal.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-800">Recognition</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Get credited as a contributor and build your reputation within our travel community.
            </p>
          </div>
        </div>

        {/* Submission Guidelines */}
        <div className="mt-12 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 border border-indigo-200 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-100 rounded-xl flex-shrink-0">
              <svg className="w-8 h-8 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-black text-slate-800 mb-4">Submission Guidelines</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-indigo-100">
                  <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    What to Include
                  </h4>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• Accurate place name and location</li>
                    <li>• Detailed, helpful description (20+ chars)</li>
                    <li>• Relevant tags for discoverability</li>
                    <li>• High-quality photos (optional)</li>
                    <li>• Best time to visit tips</li>
                  </ul>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-indigo-100">
                  <h4 className="font-bold text-rose-900 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                    </svg>
                    What to Avoid
                  </h4>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• Duplicate submissions</li>
                    <li>• Inaccurate or misleading info</li>
                    <li>• Low-quality or copyrighted images</li>
                    <li>• Promotional or spam content</li>
                    <li>• Incomplete descriptions</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 p-3 bg-amber-100 rounded-lg border border-amber-300">
                <p className="text-sm text-amber-900 flex items-start gap-2">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Pro Tip:</strong> The more detailed and accurate your submission, the faster it will be approved. Include insider tips and personal experiences to make your contribution stand out!</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Professional Success Modal */}
      {successModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-6 rounded-t-2xl">
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 bg-white rounded-full shadow-lg">
                  <svg className="w-12 h-12 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-black text-white text-center">Submission Successful!</h3>
              <p className="text-teal-50 text-center mt-2 text-sm">Your place has been received</p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 mb-1">
                      Thank you for contributing <span className="text-teal-600">"{successModal.name}"</span>
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Your submission is now under review. Our team will verify the information and publish it within 24 hours. You'll receive a notification once it's live.
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-teal-50 rounded-lg border border-teal-200">
                  <div className="text-xl font-bold text-teal-600">24h</div>
                  <div className="text-xs text-teal-700">Review Time</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-xl font-bold text-blue-600">✓</div>
                  <div className="text-xs text-blue-700">Verified</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-xl font-bold text-purple-600">+1</div>
                  <div className="text-xs text-purple-700">Contribution</div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-50 rounded-b-2xl flex gap-3">
              <button 
                onClick={() => setSuccessModal(null)} 
                className="flex-1 px-4 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
              >
                Add Another Place
              </button>
              <button 
                onClick={() => { setSuccessModal(null); window.location.href = '/'; }} 
                className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-900 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
