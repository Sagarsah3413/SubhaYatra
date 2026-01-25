import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useUser } from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom";

// Components
import { Header } from "../components/header/Header";
import Footer from "../components/footer/Footer";

export default function RecommendationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn, isLoaded } = useUser();

  // ✅ State (notes removed)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    travellers: "",
    tripTypes: [],
  });

  const [errors, setErrors] = useState({});

  // 🔐 Auth check
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/sign-in");
    }
  }, [isLoaded, isSignedIn, navigate]);

  const handleHomeClick = () => {
    if (location.pathname !== "/") navigate(-1);
  };

  const tripOptions = [
    "⛰️ Natural Attractions",
    "🧗 Trekking & Adventures",
    "🛕 Cultural & Religious Sites",
    "🏡 Village & Rural Tourism",
    "🏙️ Urban & Modern Attractions",
  ];

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.age) newErrors.age = "Age is required";
    if (!formData.phone || formData.phone.replace(/\D/g, "").length < 10)
      newErrors.phone = "Enter a valid phone number";
    if (!formData.travellers)
      newErrors.travellers = "Select number of travellers";
    if (formData.tripTypes.length === 0)
      newErrors.tripTypes = "Select a trip type";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🚀 Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    navigate("/recommendation-results", {
      state: {
        preferences: {
          ...formData,
          tripType: formData.tripTypes[0], // backend friendly
        },
      },
    });
  };

  // ⏳ Loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-teal-600" />
      </div>
    );
  }

  if (!isSignedIn) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onHomeClick={handleHomeClick} />

      {/* Welcome */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold">🎉 Welcome!</h2>
          <p className="text-sm opacity-90">
            Let us personalize your Nepal trip
          </p>
        </div>
      </div>

      <div className="flex justify-center py-10 px-4 flex-1">
        <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-md">
          <h1 className="text-2xl font-bold text-center mb-1">
            Travel Preferences
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Tell us what you love, we’ll do the rest ✨
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="font-medium">Name</label>
              <input
                type="text"
                className="w-full mt-1 p-3 border rounded-lg"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="font-medium">Age</label>
              <select
                className="w-full mt-1 p-3 border rounded-lg"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
              >
                <option value="">Select age</option>
                {[...Array(100)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              {errors.age && (
                <p className="text-red-500 text-sm">{errors.age}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="font-medium">Phone</label>
              <PhoneInput
                country="np"
                value={formData.phone}
                onChange={(phone) =>
                  setFormData({ ...formData, phone })
                }
                inputStyle={{ width: "100%", height: "48px" }}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>

            {/* Travellers */}
            <div>
              <label className="font-medium">Travellers</label>
              <select
                className="w-full mt-1 p-3 border rounded-lg"
                value={formData.travellers}
                onChange={(e) =>
                  setFormData({ ...formData, travellers: e.target.value })
                }
              >
                <option value="">Select</option>
                {[...Array(20)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              {errors.travellers && (
                <p className="text-red-500 text-sm">
                  {errors.travellers}
                </p>
              )}
            </div>

            {/* Trip Types */}
            <div>
              <label className="font-medium mb-2 block">
                Preferred Trip Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                {tripOptions.map((type) => {
                  const selected = formData.tripTypes[0] === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, tripTypes: [type] })
                      }
                      className={`h-24 rounded-xl border font-medium transition
                        ${
                          selected
                            ? "bg-stone-700 text-white"
                            : "bg-stone-100 hover:bg-stone-200"
                        }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
              {errors.tripTypes && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.tripTypes}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800"
            >
              Show My Recommendations
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
