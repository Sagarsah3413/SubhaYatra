import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Manages search modal state and search submission.
 *
 * Returns:
 *   showSearchModal   {boolean}
 *   searchQuery       {string}
 *   setShowSearchModal {Function}
 *   setSearchQuery    {Function}
 *   handleSearch      {Function} - call with no args to navigate to results
 */
export const useSearch = () => {
    const navigate = useNavigate();
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        if (!searchQuery.trim()) return;
        navigate(`/searchresult?query=${encodeURIComponent(searchQuery)}`);
        setShowSearchModal(false);
        setSearchQuery('');
    };

    return {
        showSearchModal,
        searchQuery,
        setShowSearchModal,
        setSearchQuery,
        handleSearch,
    };
};