import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FiSearch, FiBriefcase, FiBarChart, FiStar, FiGrid, FiList, FiRotateCw, FiAlertTriangle } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import JobCard from '../components/JobCard';
import { getSavedJobs, saveJob, searchJobs } from '../../../services/jobService';
import '../styles/JobMatchingLayout.css';
import '../styles/JobMatchingControls.css';

// Results Header Component
function ResultsHeader({ total, query, sortBy, setSortBy, viewMode, setViewMode, embedded = false }) {
    return (
        <div className={embedded ? '' : 'glass-panel'} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: embedded ? '10px' : '16px',
            padding: embedded ? '0' : '16px 24px'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }}>
                <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'var(--secondary-800)'
                }}>
                    <FiBarChart style={{ marginRight: '6px' }} /> {total} {total === 1 ? 'result' : 'results'}
                    {query && (
                        <span style={{ color: 'var(--secondary-600)' }}>
                            {' '}for "<span style={{ color: 'var(--primary-500)', fontWeight: '700' }}>{query}</span>"
                        </span>
                    )}
                </div>
            </div>
            
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
            }}>
                {/* Sort Dropdown */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                }}>
                    <label style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'var(--secondary-600)'
                    }}>
                        Sort by:
                    </label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid var(--secondary-300)',
                            background: 'var(--background)',
                            fontSize: '13px',
                            fontWeight: '500',
                            color: 'var(--secondary-700)'
                        }}
                    >
                        <option value="relevance">Relevance</option>
                        <option value="newest">Newest First</option>
                        <option value="salary-high">Salary (High to Low)</option>
                        <option value="salary-low">Salary (Low to High)</option>
                        <option value="deadline">Application Deadline</option>
                    </select>
                </div>

                <div style={{
                    display: 'flex',
                    background: 'var(--secondary-200)',
                    borderRadius: '8px',
                    padding: '3px'
                }}>
                    <button
                        onClick={() => setViewMode('grid')}
                        style={{
                            padding: '7px 10px',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '500',
                            background: viewMode === 'grid' ? 'var(--primary-500)' : 'transparent',
                            color: viewMode === 'grid' ? 'white' : 'var(--secondary-600)',
                            cursor: 'pointer'
                        }}
                    >
                        <FiGrid style={{ marginRight: '4px' }} /> Grid
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        style={{
                            padding: '7px 10px',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '500',
                            background: viewMode === 'list' ? 'var(--primary-500)' : 'transparent',
                            color: viewMode === 'list' ? 'white' : 'var(--secondary-600)',
                            cursor: 'pointer'
                        }}
                    >
                        <FiList style={{ marginRight: '4px' }} /> List
                    </button>
                </div>
            </div>
        </div>
    );
}

// Empty State Component
function EmptyState({ query, hasFilters, onClearFilters, onViewRecommendations }) {
    return (
        <div className="glass-panel animate-fade-in" style={{
            textAlign: 'center',
            padding: '64px 32px'
        }}>
            <div style={{ fontSize: '64px', marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                {query ? <FiSearch /> : <FiBriefcase />}
            </div>
            <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: 'var(--secondary-800)',
                marginBottom: '16px'
            }}>
                {query ? 'No jobs found' : 'Start your job search'}
            </h3>
            <p style={{
                fontSize: '16px',
                color: 'var(--secondary-600)',
                maxWidth: '500px',
                margin: '0 auto 32px',
                lineHeight: '1.6'
            }}>
                {query 
                    ? hasFilters 
                        ? `Try adjusting your search filters or search for different keywords.`
                        : `We couldn't find any jobs matching "${query}". Try different keywords or browse all available positions.`
                    : 'Enter keywords, skills, or company names to discover amazing internship and job opportunities.'
                }
            </p>
            {query && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '12px',
                    flexWrap: 'wrap'
                }}>
                    <button className="btn-secondary" onClick={onClearFilters}>
                        <FiRotateCw style={{ marginRight: '6px' }} /> Clear filters
                    </button>
                    <button 
                        className="btn-primary"
                        onClick={onViewRecommendations}
                    >
                        <FiStar style={{ marginRight: '8px' }} /> View Recommendations
                    </button>
                </div>
            )}
        </div>
    );
}

// Loading State Component
function LoadingState() {
    return (
        <div className="glass-panel animate-fade-in" style={{
            textAlign: 'center',
            padding: '48px 32px'
        }}>
            <div style={{
                fontSize: '48px',
                marginBottom: '24px',
                animation: 'spin 1s linear infinite'
            }}>
                <FiRotateCw />
            </div>
            <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--secondary-700)',
                marginBottom: '8px'
            }}>
                Searching for perfect matches...
            </h3>
            <p style={{
                fontSize: '14px',
                color: 'var(--secondary-500)'
            }}>
                Our AI is analyzing thousands of opportunities
            </p>
        </div>
    );
}

export default function JobSearch() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryFromUrl = useMemo(() => {
        return new URLSearchParams(location.search).get('q') || '';
    }, [location.search]);

    const [query, setQuery] = useState(queryFromUrl);
    const [filters, setFilters] = useState({
        jobType: '',
        location: '',
        minSalary: '',
        maxSalary: ''
    });
    const [sortBy, setSortBy] = useState('relevance');
    const [viewMode, setViewMode] = useState('grid');

    const [jobs, setJobs] = useState([]);
    const [savedJobIds, setSavedJobIds] = useState(() => new Set());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const params = useMemo(
        () => ({
            q: query,
            jobType: filters.jobType || undefined,
            location: filters.location || undefined,
            minSalary: filters.minSalary || undefined,
            maxSalary: filters.maxSalary || undefined,
            sortBy
        }),
        [query, filters, sortBy]
    );

    const hasActiveFilters = useMemo(() => {
        return filters.jobType || filters.location || filters.minSalary || filters.maxSalary;
    }, [filters]);

    const sortedJobs = useMemo(() => {
        if (!Array.isArray(jobs)) return [];
        
        const sorted = [...jobs];
        switch (sortBy) {
            case 'newest':
                return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'salary-high':
                return sorted.sort((a, b) => (b.salary || 0) - (a.salary || 0));
            case 'salary-low':
                return sorted.sort((a, b) => (a.salary || 0) - (b.salary || 0));
            case 'deadline':
                return sorted.sort((a, b) => new Date(a.applicationDeadline || '9999-12-31') - new Date(b.applicationDeadline || '9999-12-31'));
            default:
                return sorted;
        }
    }, [jobs, sortBy]);

    const loadJobs = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await searchJobs(params);
            setJobs(Array.isArray(data) ? data : []);
        } catch (e) {
            setError(e?.response?.data?.message || 'Unable to load jobs');
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        setQuery(queryFromUrl);
    }, [queryFromUrl]);

    useEffect(() => {
        loadJobs();
    }, [loadJobs]);

    useEffect(() => {
        const loadSaved = async () => {
            try {
                const saved = await getSavedJobs();
                const ids = new Set((saved || []).map((s) => String(s.jobId?._id || s.jobId)));
                setSavedJobIds(ids);
            } catch {
                // ignore (likely not logged in)
            }
        };
        loadSaved();
    }, []);

    const handleSave = async (job) => {
        try {
            await saveJob(job._id);
            setSavedJobIds((prev) => new Set([...prev, String(job._id)]));
        } catch {
            // auth interceptor may redirect
        }
    };

    const handleApply = () => {
        // Apply flow is owned by a different module; keep button present per spec.
    };

    const handleClearFilters = () => {
        setQuery('');
        setFilters({
            jobType: '',
            location: '',
            minSalary: '',
            maxSalary: ''
        });
    };

    return (
        <div className="page">
            <div className="container">
                <button
                    onClick={() => navigate('/job-matching/dashboard')}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        marginBottom: '16px',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--primary-500)',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    Back to Dashboard
                </button>
                {/* Search Interface */}
                <div className="search-interface-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '12px',
                    alignItems: 'start',
                    marginBottom: '16px'
                }}>
                    <div className="glass-panel" style={{ padding: '14px' }}>
                        <div className="search-top-row" style={{
                            display: 'grid',
                            gridTemplateColumns: 'minmax(320px, 1.4fr) minmax(320px, 1fr)',
                            gap: '12px',
                            alignItems: 'center'
                        }}>
                            <SearchBar 
                                value={query} 
                                onChange={setQuery} 
                                onSearch={loadJobs}
                                placeholder="Search by title, skills, company, or keywords..."
                                embedded={true}
                            />

                            <ResultsHeader
                                total={sortedJobs.length}
                                query={query}
                                sortBy={sortBy}
                                setSortBy={setSortBy}
                                viewMode={viewMode}
                                setViewMode={setViewMode}
                                embedded={true}
                            />
                        </div>

                        <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--glass-border)' }}>
                            <FilterPanel 
                                filters={filters} 
                                onChange={setFilters} 
                                onApply={loadJobs}
                                embedded={true}
                            />
                        </div>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="glass-panel" style={{ 
                        background: 'var(--error-500)20',
                        border: '1px solid var(--error-500)30',
                        color: 'var(--error-500)',
                        textAlign: 'center',
                        padding: '20px',
                        marginBottom: '14px'
                    }}>
                        <div style={{ fontSize: '24px', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}><FiAlertTriangle /></div>
                        <div style={{ fontWeight: '600' }}>{error}</div>
                        <button 
                            className="btn-secondary" 
                            onClick={loadJobs}
                            style={{ marginTop: '16px' }}
                        >
                            <FiRotateCw style={{ marginRight: '6px' }} /> Try Again
                        </button>
                    </div>
                )}

                {/* Loading State */}
                {loading && <LoadingState />}

                {/* Results */}
                {!loading && !error && (
                    <>
                        {sortedJobs.length > 0 ? (
                            <>
                                <div style={{ marginTop: '4px' }}>
                                    <div 
                                        className={viewMode === 'grid' ? 'modern-grid' : 'list-view'}
                                        style={viewMode === 'list' ? {
                                            display: 'grid',
                                            gridTemplateColumns: '1fr',
                                            gap: '12px'
                                        } : {
                                            marginTop: '0'
                                        }}
                                    >
                                        {sortedJobs.map((job, index) => (
                                            <div
                                                key={job._id}
                                                className="animate-fade-in"
                                                style={{
                                                    animationDelay: `${index * 50}ms`
                                                }}
                                            >
                                                <JobCard
                                                    job={job}
                                                    onApply={handleApply}
                                                    onSave={handleSave}
                                                    isSaved={savedJobIds.has(String(job._id))}
                                                    viewMode={viewMode}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <EmptyState
                                query={query}
                                hasFilters={hasActiveFilters}
                                onClearFilters={handleClearFilters}
                                onViewRecommendations={() => navigate('/job-matching/recommended')}
                            />
                        )}
                    </>
                )}
            </div>

            <style>{`
                @media (max-width: 900px) {
                    .search-interface-grid {
                        grid-template-columns: 1fr !important;
                    }

                    .search-top-row {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
}
