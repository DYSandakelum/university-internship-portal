import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { FiTarget, FiZap, FiStar, FiTrendingUp, FiInfo, FiSearch, FiBarChart, FiMonitor, FiChevronLeft, FiChevronRight, FiThumbsUp, FiAlertTriangle, FiRotateCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import JobCard from '../components/JobCard';
import { getRecommendedJobs, getSavedJobs, saveJob } from '../../../services/jobService';
import useEnsureDemoAuth from '../hooks/useEnsureDemoAuth';
import useJobMatchingRealtime from '../hooks/useJobMatchingRealtime';
import BackToDashboardButton from '../components/BackToDashboardButton';
import '../styles/JobMatchingLayout.css';
import '../styles/JobMatchingControls.css';
import './RecommendedJobs.css';

// Pagination Component
function Pagination({ currentPage, totalPages, onPageChange }) {
    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    if (totalPages <= 1) return null;

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginTop: '18px',
            paddingBottom: '20px'
        }}>
            <button
                className={`btn-outline ${currentPage === 1 ? 'disabled' : ''}`}
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    opacity: currentPage === 1 ? 0.5 : 1,
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
            >
                <FiChevronLeft /> Previous
            </button>

            {getVisiblePages().map((page, index) => (
                page === '...' ? (
                    <span key={`dots-${index}`} style={{ padding: '8px 4px', color: 'var(--secondary-500)' }}>
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        className={`btn-outline ${currentPage === page ? 'active' : ''}`}
                        onClick={() => onPageChange(page)}
                        style={{
                            padding: '8px 12px',
                            minWidth: '40px',
                            background: currentPage === page ? 'var(--primary-500)' : 'transparent',
                            color: currentPage === page ? 'white' : 'var(--secondary-700)',
                            border: `1px solid ${currentPage === page ? 'var(--primary-500)' : 'var(--secondary-300)'}`,
                            fontWeight: currentPage === page ? '600' : '400'
                        }}
                    >
                        {page}
                    </button>
                )
            ))}

            <button
                className={`btn-outline ${currentPage === totalPages ? 'disabled' : ''}`}
                onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    opacity: currentPage === totalPages ? 0.5 : 1,
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                }}
            >
                Next <FiChevronRight />
            </button>
        </div>
    );
}

// Recommendation Categories Component
function RecommendationCategories({ jobs, activeCategory, setActiveCategory }) {
    const categories = useMemo(() => {
        const cats = [
            { id: 'all', label: 'All Recommendations', count: jobs.length, icon: <FiTarget /> },
            { id: 'perfect', label: 'Perfect Match', count: jobs.filter(j => (j.matchPercentage || 0) >= 90).length, icon: <FiStar /> },
            { id: 'high', label: 'High Match', count: jobs.filter(j => (j.matchPercentage || 0) >= 70 && (j.matchPercentage || 0) < 90).length, icon: <FiTrendingUp /> },
            { id: 'good', label: 'Good Match', count: jobs.filter(j => (j.matchPercentage || 0) >= 50 && (j.matchPercentage || 0) < 70).length, icon: <FiThumbsUp /> },
            { id: 'potential', label: 'Potential', count: jobs.filter(j => (j.matchPercentage || 0) < 50).length, icon: <FiInfo /> }
        ];
        return cats.filter(cat => cat.count > 0);
    }, [jobs]);

    return (
        <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '14px',
            overflowX: 'auto',
            paddingBottom: '4px'
        }}>
            {categories.map(category => (
                <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`btn-outline ${activeCategory === category.id ? 'active' : ''}`}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        whiteSpace: 'nowrap',
                        background: activeCategory === category.id ? 'var(--primary-500)' : 'transparent',
                        color: activeCategory === category.id ? 'white' : 'var(--secondary-700)',
                        border: `1px solid ${activeCategory === category.id ? 'var(--primary-500)' : 'var(--secondary-300)'}`,
                        borderRadius: '50px'
                    }}
                >
                    <span>{category.icon}</span>
                    <span style={{ fontWeight: '600' }}>{category.label}</span>
                    <div style={{
                        padding: '2px 6px',
                        borderRadius: '12px',
                        background: activeCategory === category.id ? '#ffffff' : 'var(--secondary-200)',
                        color: activeCategory === category.id ? 'var(--primary-700)' : 'var(--secondary-800)',
                        fontSize: '11px',
                        fontWeight: '700'
                    }}>
                        {category.count}
                    </div>
                </button>
            ))}
        </div>
    );
}

// Empty Recommendations State
function EmptyRecommendationsState({ onBrowseAllJobs, onViewDashboard }) {
    return (
        <div className="glass-panel animate-fade-in" style={{
            textAlign: 'center',
            padding: '64px 32px'
        }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}><FiMonitor /></div>
            <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: 'var(--secondary-800)',
                marginBottom: '16px'
            }}>
                Building Your Recommendations
            </h3>
            <p style={{
                fontSize: '16px',
                color: 'var(--secondary-600)',
                maxWidth: '500px',
                margin: '0 auto 32px',
                lineHeight: '1.6'
            }}>
                Our AI is learning your preferences! Complete your profile and interact with jobs to get personalized recommendations.
            </p>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
                flexWrap: 'wrap'
            }}>
                <button 
                    className="btn-primary"
                    onClick={onBrowseAllJobs}
                >
                    <FiSearch style={{ marginRight: '8px' }} /> Browse All Jobs
                </button>
                <button 
                    className="btn-secondary"
                    onClick={onViewDashboard}
                >
                    <FiBarChart style={{ marginRight: '8px' }} /> View Dashboard
                </button>
            </div>
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
                <div style={{ fontSize: '18px', marginRight: '8px' }}><FiMonitor /></div>
            </div>
            <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--secondary-700)',
                marginBottom: '8px'
            }}>
                AI is analyzing your profile...
            </h3>
            <p style={{
                fontSize: '14px',
                color: 'var(--secondary-500)'
            }}>
                Finding the best job matches based on your skills and preferences
            </p>
        </div>
    );
}

export default function RecommendedJobs() {
    const navigate = useNavigate();
    const { ready, isAuthenticated, error: authError } = useEnsureDemoAuth();
    const [jobs, setJobs] = useState([]);
    const [savedJobIds, setSavedJobIds] = useState(() => new Set());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const JOBS_PER_PAGE = 6;

    const filteredJobs = useMemo(() => {
        switch(activeCategory) {
            case 'perfect':
                return jobs.filter(j => (j.matchPercentage || 0) >= 90);
            case 'high':
                return jobs.filter(j => (j.matchPercentage || 0) >= 70 && (j.matchPercentage || 0) < 90);
            case 'good':
                return jobs.filter(j => (j.matchPercentage || 0) >= 50 && (j.matchPercentage || 0) < 70);
            case 'potential':
                return jobs.filter(j => (j.matchPercentage || 0) < 50);
            default:
                return jobs;
        }
    }, [jobs, activeCategory]);

    const paginatedJobs = useMemo(() => {
        const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
        return filteredJobs.slice(startIndex, startIndex + JOBS_PER_PAGE);
    }, [filteredJobs, currentPage]);

    const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);

    const loadRecommendations = useCallback(async ({ silent = false } = {}) => {
        if (!silent) setLoading(true);
        setError('');
        try {
            const [recommended, saved] = await Promise.all([
                getRecommendedJobs(),
                getSavedJobs().catch(() => [])
            ]);

            let nextJobs = Array.isArray(recommended) ? recommended : [];

            if (nextJobs.length === 0) {
                try {
                    const { searchJobs } = await import('../../../services/jobService');
                    nextJobs = await searchJobs({});
                } catch {
                    // ignore fallback errors
                }
            }

            setJobs(Array.isArray(nextJobs) ? nextJobs : []);
            const ids = new Set((saved || []).map((s) => String(s.jobId?._id || s.jobId)));
            setSavedJobIds(ids);
        } catch (e) {
            setError(e?.response?.data?.message || 'Unable to load recommendations');
        } finally {
            if (!silent) setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!ready || !isAuthenticated) return;
        loadRecommendations();
    }, [ready, isAuthenticated, loadRecommendations]);

    useJobMatchingRealtime((packet) => {
        if (!ready || !isAuthenticated) return;
        const entity = packet?.entity;
        if (['saved_jobs', 'opportunity', 'notifications'].includes(entity)) {
            loadRecommendations({ silent: true });
        }
    });

    // Reset to page 1 when category changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory]);

    const handleSave = async (job) => {
        try {
            await saveJob(job._id);
            setSavedJobIds((prev) => new Set([...prev, String(job._id)]));
        } catch {
            // auth interceptor may redirect
        }
    };

    const handleApply = () => {
        // Apply flow handled elsewhere.
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleRetry = async () => {
        await loadRecommendations();
    };

    return (
        <div className="page reco-page">
            <div className="container">
                <BackToDashboardButton />
                <div className="page-header" style={{ marginBottom: '8px' }}>
                    <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <FiStar /> Recommendations
                    </h1>
                </div>

                {authError && (
                    <div className="glass-panel" style={{ 
                        background: 'var(--error-500)20',
                        border: '1px solid var(--error-500)30',
                        color: 'var(--error-500)',
                        textAlign: 'center',
                        padding: '20px',
                        marginBottom: '24px'
                    }}>
                        <div style={{ fontSize: '24px', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}><FiAlertTriangle /></div>
                        <div style={{ fontWeight: '600' }}>{authError}</div>
                    </div>
                )}

                {error && (
                    <div className="glass-panel" style={{ 
                        background: 'var(--error-500)20',
                        border: '1px solid var(--error-500)30',
                        color: 'var(--error-500)',
                        textAlign: 'center',
                        padding: '20px',
                        marginBottom: '24px'
                    }}>
                        <div style={{ fontSize: '24px', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}><FiAlertTriangle /></div>
                        <div style={{ fontWeight: '600' }}>{error}</div>
                        <button 
                            className="btn-secondary" 
                            onClick={handleRetry}
                            style={{ marginTop: '16px' }}
                        >
                            <FiRotateCw style={{ marginRight: '6px' }} /> Retry
                        </button>
                    </div>
                )}

                {!ready && (
                    <div className="glass-panel" style={{ 
                        textAlign: 'center',
                        padding: '20px',
                        marginBottom: '24px'
                    }}>
                        <div style={{ fontSize: '24px', marginBottom: '12px' }}><FiZap /></div>
                        <div>Starting demo session…</div>
                    </div>
                )}

                {loading && <LoadingState />}

                {ready && !loading && !error && (
                    <>
                        {jobs.length > 0 ? (
                            <>
                                <RecommendationCategories
                                    jobs={jobs}
                                    activeCategory={activeCategory}
                                    setActiveCategory={setActiveCategory}
                                />

                                {paginatedJobs.length > 0 ? (
                                    <>
                                        <div className="reco-grid">
                                            {paginatedJobs.map((job, index) => (
                                                <div
                                                    key={job._id}
                                                    className="animate-fade-in"
                                                    style={{
                                                        animationDelay: `${index * 50}ms`
                                                    }}
                                                >
                                                    <JobCard
                                                        job={job}
                                                        matchPercentage={typeof job.matchPercentage === 'number' ? job.matchPercentage : undefined}
                                                        onApply={handleApply}
                                                        onSave={handleSave}
                                                        isSaved={savedJobIds.has(String(job._id))}
                                                        showMatchDetails={true}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={handlePageChange}
                                        />
                                    </>
                                ) : (
                                    <div className="glass-panel" style={{ 
                                        textAlign: 'center',
                                        padding: '40px 20px' 
                                    }}>
                                        <p>No jobs found in this category.</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <EmptyRecommendationsState
                                onBrowseAllJobs={() => navigate('/job-matching/search')}
                                onViewDashboard={() => navigate('/job-matching/dashboard')}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
