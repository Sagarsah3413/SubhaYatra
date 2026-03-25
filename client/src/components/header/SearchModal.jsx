import React from 'react';
import { FaSearch } from 'react-icons/fa';

/**
 * Full-screen search modal.
 *
 * Props:
 *   isOpen        {boolean}
 *   onClose       {Function}
 *   searchQuery   {string}
 *   setSearchQuery {Function}
 *   onSearch      {Function}  - navigates to results and closes modal
 *   theme         {string}
 */
const SearchModal = ({ isOpen, onClose, searchQuery, setSearchQuery, onSearch, theme }) => {
    if (!isOpen) return null;

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') onSearch();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className={`w-full max-w-2xl mx-4 rounded-2xl shadow-2xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Search Places
                        </h3>
                        <button
                            onClick={onClose}
                            className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                                }`}
                        >
                            ✕
                        </button>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Search for destinations, hotels, restaurants..."
                            className={`w-full px-4 py-3 pr-12 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-teal-500 ${theme === 'dark'
                                ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                }`}
                            autoFocus
                        />
                        <button
                            onClick={onSearch}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-linear-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all"
                        >
                            <FaSearch />
                        </button>
                    </div>

                    <p className={`mt-3 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Press Enter or click the search icon to search
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SearchModal;