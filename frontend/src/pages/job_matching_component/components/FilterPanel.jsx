import React, { useState } from 'react';
import { FiTarget, FiBriefcase, FiMapPin, FiDollarSign, FiTrash2, FiSettings, FiGrid, FiSend, FiX } from 'react-icons/fi';

// Salary range presets
const SALARY_PRESETS = [
    { label: 'Any Salary', min: '', max: '' },
    { label: '$500 - $1000', min: 500, max: 1000 },
    { label: '$1000 - $1500', min: 1000, max: 1500 },
    { label: '$1500 - $2000', min: 1500, max: 2000 },
    { label: '$2000+', min: 2000, max: '' }
];

// Location suggestions
const LOCATION_SUGGESTIONS = [
    'Remote', 'New York', 'San Francisco', 'London', 'Campus', 
    'Los Angeles', 'Chicago', 'Boston', 'Seattle', 'Austin'
];

// Multi-range slider component
function SalaryRangeSlider({ minValue, maxValue, onChange }) {
    const [localMin, setLocalMin] = useState(minValue || 0);
    const [localMax, setLocalMax] = useState(maxValue || 3000);
    
    const handleMinChange = (e) => {
        const value = parseInt(e.target.value);
        setLocalMin(value);
        onChange?.({ min: value, max: localMax });
    };
    
    const handleMaxChange = (e) => {
        const value = parseInt(e.target.value);
        setLocalMax(value);
        onChange?.({ min: localMin, max: value });
    };
    
    return (
        <div className="salary-range-slider" style={{ position: 'relative', padding: '10px 0' }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '10px',
                alignItems: 'center'
            }}>
                <span style={{ 
                    background: 'var(--primary-100)',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: 'var(--primary-700)'
                }}>
                    ${localMin}
                </span>
                <span style={{ color: 'var(--secondary-500)', fontSize: '14px' }}>to</span>
                <span style={{ 
                    background: 'var(--primary-100)',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: 'var(--primary-700)'
                }}>
                    ${localMax}
                </span>
            </div>
            
            <div style={{ position: 'relative', height: '6px', marginBottom: '8px' }}>
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '6px',
                    background: 'var(--secondary-200)',
                    borderRadius: '3px'
                }}></div>
                
                <div style={{
                    position: 'absolute',
                    height: '6px',
                    background: 'var(--primary-500)',
                    borderRadius: '3px',
                    left: `${(localMin / 3000) * 100}%`,
                    width: `${((localMax - localMin) / 3000) * 100}%`
                }}></div>
                
                <input
                    type="range"
                    min="0"
                    max="3000"
                    value={localMin}
                    onChange={handleMinChange}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '6px',
                        background: 'transparent',
                        outline: 'none',
                        appearance: 'none',
                        pointerEvents: 'none'
                    }}
                />
                
                <input
                    type="range"
                    min="0"
                    max="3000"
                    value={localMax}
                    onChange={handleMaxChange}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '6px',
                        background: 'transparent',
                        outline: 'none',
                        appearance: 'none',
                        pointerEvents: 'none'
                    }}
                />
            </div>
        </div>
    );
}

// Filter chip component
function FilterChip({ label, isActive, onClick, onRemove }) {
    return (
        <div
            className="filter-chip"
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                background: isActive ? 'var(--primary-500)' : 'var(--secondary-100)',
                color: isActive ? 'white' : 'var(--secondary-600)',
                border: '1px solid ' + (isActive ? 'var(--primary-500)' : 'var(--secondary-300)')
            }}
            onClick={onClick}
        >
            {label}
            {isActive && onRemove && (
                <button
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '12px',
                        padding: '0',
                        marginLeft: '4px'
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                >
                    <FiX />
                </button>
            )}
        </div>
    );
}

export default function FilterPanel({ filters, onChange, onApply, embedded = false, showApplyButton = true }) {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [localFilters, setLocalFilters] = useState(filters);
    
    const set = (patch) => {
        const newFilters = { ...localFilters, ...patch };
        setLocalFilters(newFilters);
        onChange?.(newFilters);
    };
    
    const handleSalaryPreset = (preset) => {
        set({ 
            minSalary: preset.min.toString(),
            maxSalary: preset.max.toString()
        });
    };
    
    const handleSalaryRangeChange = ({ min, max }) => {
        set({
            minSalary: min.toString(),
            maxSalary: max.toString()
        });
    };
    
    const clearAllFilters = () => {
        const clearedFilters = {
            jobType: '',
            location: '',
            minSalary: '',
            maxSalary: ''
        };
        setLocalFilters(clearedFilters);
        onChange?.(clearedFilters);
    };
    
    const hasActiveFilters = Object.values(localFilters).some(value => value && value.toString().trim());
    
    return (
        <div
            className={embedded ? '' : 'glass-panel'}
            style={{
                position: 'relative',
                padding: embedded ? 0 : '16px'
            }}
        >
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '12px'
            }}>
                <h3 style={{ 
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: '700',
                    color: 'var(--secondary-800)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <FiTarget /> Filter Jobs
                </h3>
                
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {hasActiveFilters && (
                        <button
                            className="btn-secondary"
                            onClick={clearAllFilters}
                            style={{ fontSize: '12px', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                            <FiTrash2 size={14} /> Clear All
                        </button>
                    )}
                    
                    <button
                        className="btn-secondary"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        style={{ fontSize: '12px', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                        {showAdvanced ? <><FiGrid size={14} /> Basic</> : <><FiSettings size={14} /> Advanced</>}
                    </button>
                </div>
            </div>
            
            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div style={{ marginBottom: '12px' }}>
                    <div style={{ 
                        fontSize: '12px',
                        color: 'var(--secondary-500)',
                        marginBottom: '8px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        Active Filters
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {localFilters.jobType && (
                            <FilterChip
                                label={`Type: ${localFilters.jobType}`}
                                isActive={true}
                                onRemove={() => set({ jobType: '' })}
                            />
                        )}
                        {localFilters.location && (
                            <FilterChip
                                label={`Location: ${localFilters.location}`}
                                isActive={true}
                                onRemove={() => set({ location: '' })}
                            />
                        )}
                        {(localFilters.minSalary || localFilters.maxSalary) && (
                            <FilterChip
                                label={`Salary: $${localFilters.minSalary || '0'} - $${localFilters.maxSalary || 'No limit'}`}
                                isActive={true}
                                onRemove={() => set({ minSalary: '', maxSalary: '' })}
                            />
                        )}
                    </div>
                </div>
            )}
            
            {/* Basic Filters */}
            <div style={{ 
                display: 'grid',
                gridTemplateColumns: showAdvanced ? 'repeat(auto-fit, minmax(200px, 1fr))' : 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '12px',
                marginBottom: '12px'
            }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FiBriefcase size={16} /> Job Type
                    </label>
                    <select
                        className="form-input"
                        value={localFilters.jobType}
                        onChange={(e) => set({ jobType: e.target.value })}
                        style={{ cursor: 'pointer' }}
                    >
                        <option value="">All Job Types</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Internship">Internship</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Remote">Remote</option>
                    </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FiMapPin size={16} /> Location
                    </label>
                    <input
                        list="location-suggestions"
                        className="form-input"
                        value={localFilters.location}
                        onChange={(e) => set({ location: e.target.value })}
                        placeholder="Enter location or select from list"
                    />
                    <datalist id="location-suggestions">
                        {LOCATION_SUGGESTIONS.map(location => (
                            <option key={location} value={location} />
                        ))}
                    </datalist>
                </div>
            </div>
            
            {/* Salary Filter */}
            <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiDollarSign size={16} /> Salary Range
                </label>
                
                {!showAdvanced ? (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                        {SALARY_PRESETS.map((preset, index) => (
                            <FilterChip
                                key={index}
                                label={preset.label}
                                isActive={
                                    localFilters.minSalary === preset.min.toString() &&
                                    localFilters.maxSalary === preset.max.toString()
                                }
                                onClick={() => handleSalaryPreset(preset)}
                            />
                        ))}
                    </div>
                ) : (
                    <SalaryRangeSlider
                        minValue={parseInt(localFilters.minSalary) || 0}
                        maxValue={parseInt(localFilters.maxSalary) || 3000}
                        onChange={handleSalaryRangeChange}
                    />
                )}
                
                {showAdvanced && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                            <label className="form-label">Min Salary</label>
                            <input
                                className="form-input"
                                type="number"
                                value={localFilters.minSalary}
                                onChange={(e) => set({ minSalary: e.target.value })}
                                placeholder="0"
                                min="0"
                                max="10000"
                            />
                        </div>
                        <div>
                            <label className="form-label">Max Salary</label>
                            <input
                                className="form-input"
                                type="number"
                                value={localFilters.maxSalary}
                                onChange={(e) => set({ maxSalary: e.target.value })}
                                placeholder="No limit"
                                min="0"
                                max="10000"
                            />
                        </div>
                    </div>
                )}
            </div>
            
            {/* Apply Button */}
            {showApplyButton && (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    gap: '12px',
                    marginTop: '12px',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--glass-border)'
                }}>
                    <button 
                        className="btn-primary"
                        onClick={() => onApply?.()}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 16px'
                        }}
                    >
                        <FiSend /> Apply Filters
                    </button>
                </div>
            )}
            
            <style>{`
                input[type="range"] {
                    -webkit-appearance: none;
                    pointer-events: all;
                }
                
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: var(--primary-500);
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: var(--shadow-card);
                }
                
                input[type="range"]::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: var(--primary-500);
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: var(--shadow-card);
                }
            `}</style>
        </div>
    );
}
