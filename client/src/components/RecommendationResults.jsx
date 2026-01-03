import React from 'react';
import { FaArrowLeft, FaStar, FaMapMarkerAlt, FaClock, FaDollarSign, FaUsers } from 'react-icons/fa';
import SearchResultCard from '../pages/SearchResultCard';

const RecommendationResults = ({ recommendations, formData, onBack, theme }) => {
  return (
    <div className="flex-1 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors
              ${theme === 'dark' 
                ? 'border-slate-600 text-slate-300 hover:bg-slate-700' 
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            <FaArrowLeft />
            Back to Form
          </button>
          
          <h1 className={`text-3xl font-bold mt-4 mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Your Personalized Nepal Recommendations
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
            Based on your preferences, we've found {recommendations.length} perfect matches for your adventure
          </p>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((recommendation) => (
            <SearchResultCard
              key={recommendation.id}
              place={recommendation}
              theme={theme}
            />
          ))}
        </div>

        {/* Summary */}
        <div className={`
          mt-12 p-6 rounded-2xl border
          ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}
        `}>
          <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Trip Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>Duration</p>
              <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {formData.duration} days
              </p>
            </div>
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>Travelers</p>
              <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {formData.travellers} people
              </p>
            </div>
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>Budget</p>
              <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {formData.budget}
              </p>
            </div>
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>Season</p>
              <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {formData.season}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationResults;