import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Header } from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { useNavigate, useLocation } from "react-router-dom";

export default function RecommendationPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleHomeClick = () => {
    if (location.pathname !== "/") navigate(-1);
  };

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    travellers: "",
    tripTypes: [],
    notes: "",
  });

  const [errors, setErrors] = useState({});

  const tripOptions = [
    "⛰️Natural Attractions",
    "🧗Trekking & Adventures",
    "🛕Cultural and Religious Sites",
    "🏡Village & Rural Tourism",
    "🏙️Urban & Modern Attractions",
  ];

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.age) newErrors.age = "Select a valid age.";

    if (!formData.phone || formData.phone.length < 8)
      newErrors.phone = "Phone number is invalid.";

    if (!formData.travellers)
      newErrors.travellers = "Select number of travellers.";

    if (formData.tripTypes.length === 0)
      newErrors.tripTypes = "Please select a trip type.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Saved Preferences:", formData);
      window.location.href = "/recommendation-results";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header onHomeClick={handleHomeClick} />

      <div className="flex justify-center py-10 px-4 flex-1">
        <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-md">
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            Fill this before we recommend your travel
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Help us personalize your Nepal experience
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-medium">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
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

            {/* Age Dropdown */}
            <div>
              <label className="block text-gray-700 font-medium">Age</label>
              <select
                className="w-full mt-1 p-3 border rounded-lg"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
              >
                <option value="">Select Age</option>
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

            {/* Phone Number */}
            <div>
              <label className="block text-gray-700 font-medium">
                Phone Number
              </label>
              <PhoneInput
                country={"np"}
                value={formData.phone}
                onChange={(phone) => setFormData({ ...formData, phone })}
                inputStyle={{ width: "100%" }}
                buttonStyle={{ borderRadius: "8px" }}
                dropdownStyle={{ borderRadius: "8px" }}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>

            {/* Travellers Dropdown */}
            <div>
              <label className="block text-gray-700 font-medium">
                Number of Travellers
              </label>
              <select
                className="w-full mt-1 p-3 border rounded-lg"
                value={formData.travellers}
                onChange={(e) =>
                  setFormData({ ...formData, travellers: e.target.value })
                }
              >
                <option value="">Select Travellers</option>
                {[...Array(20)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              {errors.travellers && (
                <p className="text-red-500 text-sm">{errors.travellers}</p>
              )}
            </div>

            {/* Trip Types */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Preferred Trip Type
              </label>

              <div className="grid grid-cols-1 gap-3">
                {tripOptions.map((type) => {
                  const isSelected = formData.tripTypes[0] === type;

                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, tripTypes: [type] })
                      }
                      className={`w-full p-3 rounded-lg border text-center transition 
                        ${
                          isSelected
                            ? "bg-red-600 text-white border-red-700"
                            : "bg-gray-200 text-gray-800 border-gray-300"
                        }
                      `}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>

              {errors.tripTypes && (
                <p className="text-red-500 text-sm mt-2">{errors.tripTypes}</p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-gray-700 font-medium">
                Notes / Special Requests
              </label>
              <textarea
                placeholder="Write any special requests..."
                className="w-full mt-1 p-3 border rounded-lg h-24"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              ></textarea>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg font-medium"
            >
              Show My Recommendations
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
