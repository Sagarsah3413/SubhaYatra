import React from 'react';
import { FaBrain, FaLightbulb, FaDollarSign, FaHeart } from 'react-icons/fa';

const AIInsights = ({ insights, theme }) => {
  if (!insights || insights.length === 0) return null;

  const getInsightIcon = (type) => {
    switch (type) {
      case 'preference': return FaHeart;
      case 'budget': return FaDollarSign;
      case 'insight': return FaLightbulb;
      default: return FaBrain;
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'preference': return 'text-red-500';
      case 'budget': return 'text-green-500';
      case 'insight': return 'text-yellow-500';
      default: return 'text-blue-500';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        AI Insights
      </h3>
      {insights.map((insight, index) => {
        const Icon = getInsightIcon(insight.type);
        const colorClass = getInsightColor(insight.type);
        
        return (
          <div
            key={insight.timestamp || index}
            className={`
              flex items-start gap-3 p-4 rounded-lg border animate-fade-in
              ${theme === 'dark' 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-white border-gray-200'
              }
            `}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <Icon className={`text-lg mt-0.5 ${colorClass}`} />
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
              {insight.message}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default AIInsights;