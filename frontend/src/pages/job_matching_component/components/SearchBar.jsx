import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiSend, FiInfo } from 'react-icons/fi';

// Search suggestions (mock data - could be fetched from API)
const SEARCH_SUGGESTIONS = [
    'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'React Developer', 'Node.js Developer', 'Python Developer',
    'Data Analyst', 'UI/UX Designer', 'DevOps Engineer',
    'Software Engineer', 'Web Developer', 'Mobile Developer'
];

export default function SearchBar({ value, onChange, onSearch, isLoading = false, embedded = false }) {
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    
    const searchInputRef = useRef(null);
    const suggestionsRef = useRef(null);
    
    // Debounced search effect
    useEffect(() => {
        if (!value || value.length < 2) {
            setFilteredSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        
        const debounceTimer = setTimeout(() => {
            const suggestions = SEARCH_SUGGESTIONS.filter(suggestion =>
                suggestion.toLowerCase().includes(value.toLowerCase())
            ).slice(0, 5);
            
            setFilteredSuggestions(suggestions);
            setShowSuggestions(suggestions.length > 0);
        }, 300);
        
        return () => clearTimeout(debounceTimer);
    }, [value]);
    
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!onSearch || isLoading) return;
        
        setIsSearching(true);
        setShowSuggestions(false);
        
        try {
            await onSearch();
        } finally {
            setTimeout(() => setIsSearching(false), 500);
        }
    };
    
    // Handle input change
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        onChange?.(newValue);
        setSelectedSuggestionIndex(-1);
    };
    
    // Handle suggestion click
    const handleSuggestionClick = (suggestion) => {
        onChange?.(suggestion);
        setShowSuggestions(false);
        searchInputRef.current?.focus();
        // Auto-trigger search after selecting suggestion
        setTimeout(() => onSearch?.(), 100);
    };
    
    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (!showSuggestions || filteredSuggestions.length === 0) {
            return;
        }
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedSuggestionIndex(prev => 
                    prev < filteredSuggestions.length - 1 ? prev + 1 : 0
                );
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                setSelectedSuggestionIndex(prev => 
                    prev > 0 ? prev - 1 : filteredSuggestions.length - 1
                );
                break;
                
            case 'Enter':
                if (selectedSuggestionIndex >= 0) {
                    e.preventDefault();
                    handleSuggestionClick(filteredSuggestions[selectedSuggestionIndex]);
                }
                break;
                
            case 'Escape':
                setShowSuggestions(false);
                setSelectedSuggestionIndex(-1);
                searchInputRef.current?.blur();
                break;
        }
    };
    
    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    return (
        <div className="modern-search-container" style={{ position: 'relative' }}>
            <form
                className={embedded ? '' : 'glass-panel'}
                onSubmit={handleSubmit}
                style={{ marginBottom: 0, padding: embedded ? 0 : undefined }}
            >
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="job-search">
                        <FiSearch style={{ marginRight: '8px' }} /> Search Jobs
                    </label>
                    
                    <div style={{ position: 'relative' }}>
                        <input
                            ref={searchInputRef}
                            id="job-search"
                            className="form-input"
                            value={value}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            onFocus={() => {
                                if (filteredSuggestions.length > 0) {
                                    setShowSuggestions(true);
                                }
                            }}
                            placeholder="Search by title, company, skills, or keywords..."
                            style={{
                                paddingRight: '120px',
                                fontSize: '16px',
                                transition: 'all var(--transition-fast)'
                            }}
                        />
                        
                        <button
                            className="btn-primary"
                            type="submit"
                            disabled={isSearching || isLoading}
                            style={{
                                position: 'absolute',
                                right: '8px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                padding: '10px 20px',
                                minWidth: '100px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            {isSearching || isLoading ? (
                                <>
                                    <span style={{
                                        display: 'inline-block',
                                        animation: 'spin 1s linear infinite',
                                        fontSize: '14px'
                                    }}><FiSearch /></span>
                                    Searching
                                </>
                            ) : (
                                <>
                                    <FiSend style={{ marginRight: '6px' }} /> Search
                                </>
                            )}
                        </button>
                    </div>
                    
                    {/* Search Stats */}
                    {value && (
                        <div style={{ 
                            marginTop: '8px',
                            fontSize: '12px',
                            color: 'var(--secondary-500)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <FiInfo size={14} /> Tip: Use keywords like "React", "Remote", or company names
                            </span>
                        </div>
                    )}
                </div>
            </form>
            
            {/* Search Suggestions */}
            {showSuggestions && filteredSuggestions.length > 0 && (
                <div
                    ref={suggestionsRef}
                    className="search-suggestions"
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                        background: 'var(--glass-bg)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '16px',
                        marginTop: '8px',
                        boxShadow: 'var(--glass-shadow)',
                        overflow: 'hidden',
                        animation: 'slideInDown 0.2s ease-out'
                    }}
                >
                    <div style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid var(--glass-border)',
                        fontSize: '12px',
                        color: 'var(--secondary-500)',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <FiInfo /> Search Suggestions
                        </div>
                    </div>
                    
                    {filteredSuggestions.map((suggestion, index) => (
                        <div
                            key={suggestion}
                            className="suggestion-item"
                            onClick={() => handleSuggestionClick(suggestion)}
                            style={{
                                padding: '12px 16px',
                                cursor: 'pointer',
                                transition: 'all var(--transition-fast)',
                                backgroundColor: selectedSuggestionIndex === index 
                                    ? 'var(--primary-100)' 
                                    : 'transparent',
                                borderLeft: selectedSuggestionIndex === index 
                                    ? '3px solid var(--primary-500)' 
                                    : '3px solid transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                fontSize: '14px'
                            }}
                            onMouseEnter={() => setSelectedSuggestionIndex(index)}
                        >
                            <span><FiSearch /></span>
                            <span>{suggestion}</span>
                        </div>
                    ))}
                </div>
            )}
            
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes slideInDown {
                    0% {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .suggestion-item:hover {
                    background: var(--primary-50) !important;
                }
            `}</style>
        </div>
    );
}
