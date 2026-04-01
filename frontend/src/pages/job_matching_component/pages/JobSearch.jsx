import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FiSearch, FiBriefcase, FiStar, FiGrid, FiList, FiRotateCw, FiAlertTriangle, FiSettings } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

import AdvancedFiltersModal from '../components/AdvancedFiltersModal';
import FilterPanel from '../components/FilterPanel';
import JobCard from '../components/JobCard';
import { getSavedJobs, saveJob, searchJobs } from '../../../services/jobService';
import '../styles/JobMatchingLayout.css';
import '../styles/JobMatchingControls.css';

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

    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState({
        jobType: '',
        location: '',
        minSalary: '',
        maxSalary: ''
    });
    const [sortBy, setSortBy] = useState('relevance');
    const [viewMode, setViewMode] = useState('grid');

    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    const [jobs, setJobs] = useState([]);
    const [savedJobIds, setSavedJobIds] = useState(() => new Set());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const parseUrlState = useCallback((search) => {
        const sp = new URLSearchParams(search);
        return {
            q: sp.get('q') || '',
            filters: {
                jobType: sp.get('jobType') || '',
                location: sp.get('location') || '',
                minSalary: sp.get('minSalary') || '',
                maxSalary: sp.get('maxSalary') || ''
            },
            sortBy: sp.get('sortBy') || 'relevance',
            viewMode: sp.get('view') || 'grid'
        };
    }, []);

    const buildSearchQueryString = useCallback(({ q, filters: nextFilters, sortBy: nextSortBy, viewMode: nextViewMode }) => {
        const sp = new URLSearchParams();
        if (q) sp.set('q', q);
        if (nextFilters?.jobType) sp.set('jobType', nextFilters.jobType);
        if (nextFilters?.location) sp.set('location', nextFilters.location);
        if (nextFilters?.minSalary) sp.set('minSalary', String(nextFilters.minSalary));
        if (nextFilters?.maxSalary) sp.set('maxSalary', String(nextFilters.maxSalary));
        if (nextSortBy && nextSortBy !== 'relevance') sp.set('sortBy', nextSortBy);
        if (nextViewMode && nextViewMode !== 'grid') sp.set('view', nextViewMode);
        const qs = sp.toString();
        return qs ? `?${qs}` : '';
    }, []);

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

    const runSearch = useCallback(async (nextParams) => {
        setLoading(true);
        setError('');
        try {
            const data = await searchJobs(nextParams);
            setJobs(Array.isArray(data) ? data : []);
        } catch (e) {
            setError(e?.response?.data?.message || 'Unable to load jobs');
        } finally {
            setLoading(false);
        }
    }, []);

    // Load from URL only (submit/apply updates URL; URL change triggers fetch)
    useEffect(() => {
        const next = parseUrlState(location.search);
        setQuery(next.q);
        setFilters(next.filters);
        setSortBy(next.sortBy);
        setViewMode(next.viewMode);
        runSearch({
            q: next.q,
            jobType: next.filters.jobType || undefined,
            location: next.filters.location || undefined,
            minSalary: next.filters.minSalary || undefined,
            maxSalary: next.filters.maxSalary || undefined,
            sortBy: next.sortBy
        });
    }, [location.search, parseUrlState, runSearch]);

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

    const navigateWithState = (next) => {
        navigate({ pathname: location.pathname, search: buildSearchQueryString(next) });
    };

    const handleSubmitSearch = () => {
        navigateWithState({ q: query.trim(), filters, sortBy, viewMode });
    };

    const handleClearAll = () => {
        setQuery('');
        setFilters({ jobType: '', location: '', minSalary: '', maxSalary: '' });
        setSortBy('relevance');
        setViewMode('grid');
        navigate({ pathname: location.pathname, search: '' });
    };

    return (
        <div>
            {/* Compact search toolbar */}
            <div className="glass-panel" style={{ padding: 14, marginBottom: 12 }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto auto',
                    gap: 10,
                    alignItems: 'center'
                }}>
                    <div style={{ position: 'relative' }}>
                        <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary-500)' }} />
                        <input
                            className="form-input"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSubmitSearch();
                                }
                            }}
                            placeholder="Title, company, skills, keywords"
                            style={{ paddingLeft: 38, paddingRight: 108 }}
                        />
                        <button
                            className="btn-primary"
                            type="button"
                            onClick={handleSubmitSearch}
                            disabled={loading}
                            style={{ position: 'absolute', right: 6, top: 6, bottom: 6, padding: '0 14px' }}
                        >
                            Search
                        </button>
                    </div>

                    <button
                        className="btn-secondary"
                        type="button"
                        onClick={() => setIsFiltersOpen(true)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}
                    >
                        <FiSettings /> Filters{hasActiveFilters ? ' • Active' : ''}
                    </button>

                    <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
                        <select
                            value={sortBy}
                            onChange={(e) => {
                                const nextSort = e.target.value;
                                setSortBy(nextSort);
                                navigateWithState({ q: query.trim(), filters, sortBy: nextSort, viewMode });
                            }}
                            className="form-input"
                            style={{ width: 190, cursor: 'pointer' }}
                        >
                            <option value="relevance">Relevance</option>
                            <option value="newest">Newest</option>
                            <option value="salary-high">Salary (High)</option>
                            <option value="salary-low">Salary (Low)</option>
                            <option value="deadline">Deadline</option>
                        </select>

                        <div style={{ display: 'inline-flex', border: '1px solid var(--glass-border)', borderRadius: 12, overflow: 'hidden' }}>
                            <button
                                type="button"
                                className={viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}
                                onClick={() => {
                                    setViewMode('grid');
                                    navigateWithState({ q: query.trim(), filters, sortBy, viewMode: 'grid' });
                                }}
                                style={{ borderRadius: 0, padding: '10px 12px' }}
                                aria-label="Grid view"
                            >
                                <FiGrid />
                            </button>
                            <button
                                type="button"
                                className={viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}
                                onClick={() => {
                                    setViewMode('list');
                                    navigateWithState({ q: query.trim(), filters, sortBy, viewMode: 'list' });
                                }}
                                style={{ borderRadius: 0, padding: '10px 12px' }}
                                aria-label="List view"
                            >
                                <FiList />
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 10,
                    flexWrap: 'wrap',
                    marginTop: 10,
                    paddingTop: 10,
                    borderTop: '1px solid var(--glass-border)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--secondary-800)' }}>
                            {sortedJobs.length} {sortedJobs.length === 1 ? 'result' : 'results'}
                            {query.trim() ? <span style={{ color: 'var(--secondary-600)' }}> for “{query.trim()}”</span> : null}
                        </div>

                        {hasActiveFilters ? (
                            <button className="btn-secondary" type="button" onClick={handleClearAll} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                <FiRotateCw /> Reset
                            </button>
                        ) : null}
                    </div>

                    <button
                        className="btn-secondary"
                        type="button"
                        onClick={() => navigate('/job-matching/dashboard')}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>

            <AdvancedFiltersModal
                open={isFiltersOpen}
                title="Filters"
                subtitle="Use Advanced for sliders and precise ranges."
                onClose={() => setIsFiltersOpen(false)}
                onSubmit={() => {
                    setIsFiltersOpen(false);
                    navigateWithState({ q: query.trim(), filters, sortBy, viewMode });
                }}
                submitLabel="Apply"
            >
                <FilterPanel
                    filters={filters}
                    onChange={setFilters}
                    embedded={true}
                    showApplyButton={false}
                />
            </AdvancedFiltersModal>

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
                            onClick={handleSubmitSearch}
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
                                onClearFilters={handleClearAll}
                                onViewRecommendations={() => navigate('/job-matching/recommended')}
                            />
                        )}
                    </>
                )}
        </div>
    );
}
