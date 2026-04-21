import React, { useEffect, useState, useMemo } from 'react';
import { FiBookmark, FiSearch, FiTrash2, FiZap, FiStar, FiAlertTriangle, FiRotateCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import JobCard from '../components/JobCard';
import { getSavedJobs, removeSavedJob } from '../../../services/jobService';
import useEnsureDemoAuth from '../hooks/useEnsureDemoAuth';
import BackToDashboardButton from '../components/BackToDashboardButton';
import '../styles/JobMatchingLayout.css';
import '../styles/JobMatchingControls.css';
import './SavedJobs.css';

// Search and Filter Component
function SavedJobsToolbar({ onSearch, onSort, sortBy, onBulkAction, selectedCount }) {
    const [searchQuery, setSearchQuery] = useState('');
    
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <div className="glass-panel" style={{
            padding: '20px 24px',
            marginBottom: '24px'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
            }}>
                {/* Search Bar */}
                <div style={{
                    flex: '1',
                    minWidth: '300px',
                    maxWidth: '500px'
                }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search saved jobs by title, company, or skills..."
                            style={{
                                width: '100%',
                                padding: '12px 16px 12px 48px',
                                borderRadius: '50px',
                                border: '1px solid var(--secondary-300)',
                                background: 'var(--background)',
                                fontSize: '14px'
                            }}
                        />
                        <div style={{
                            position: 'absolute',
                            left: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            fontSize: '18px',
                            color: 'var(--secondary-400)'
                        }}>
                            <FiSearch />
                        </div>
                    </div>
                </div>

                {/* Sort and Actions */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <select
                        value={sortBy}
                        onChange={(e) => onSort(e.target.value)}
                        style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid var(--secondary-300)',
                            background: 'var(--background)',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="company">Company A-Z</option>
                        <option value="title">Job Title A-Z</option>
                    </select>

                    {selectedCount > 0 && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span style={{
                                fontSize: '14px',
                                color: 'var(--secondary-600)',
                                fontWeight: '600'
                            }}>
                                {selectedCount} selected
                            </span>
                            <button
                                onClick={() => onBulkAction('remove')}
                                className="btn-outline"
                                style={{
                                    padding: '8px 16px',
                                    fontSize: '14px',
                                    color: 'var(--error-500)',
                                    border: '1px solid var(--error-500)',
                                    borderRadius: '6px'
                                }}
                            >
                                <FiTrash2 style={{ marginRight: '6px' }} /> Remove
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Empty Saved Jobs State
function EmptySavedJobsState({ onBrowseJobs, onViewRecommendations }) {
    return (
        <div className="glass-panel animate-fade-in" style={{
            textAlign: 'center',
            padding: '64px 32px'
        }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}><FiBookmark /></div>
            <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: 'var(--secondary-800)',
                marginBottom: '16px'
            }}>
                No saved jobs yet
            </h3>
            <p style={{
                fontSize: '16px',
                color: 'var(--secondary-600)',
                maxWidth: '500px',
                margin: '0 auto 32px',
                lineHeight: '1.6'
            }}>
                Start building your collection! Save interesting jobs while browsing to create your personal shortlist of opportunities.
            </p>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
                flexWrap: 'wrap'
            }}>
                <button 
                    className="btn-primary"
                    onClick={onBrowseJobs}
                >
                    <FiSearch style={{ marginRight: '8px' }} /> Browse Jobs
                </button>
                <button 
                    className="btn-secondary"
                    onClick={onViewRecommendations}
                >
                    <FiStar style={{ marginRight: '8px' }} /> View Recommendations
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
                <div style={{ fontSize: '18px', marginRight: '8px' }}><FiBookmark /></div>
            </div>
            <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--secondary-700)',
                marginBottom: '8px'
            }}>
                Loading your saved jobs...
            </h3>
            <p style={{
                fontSize: '14px',
                color: 'var(--secondary-500)'
            }}>
                Retrieving your bookmarked opportunities
            </p>
        </div>
    );
}

export default function SavedJobs() {
    const navigate = useNavigate();
    const { ready, error: authError } = useEnsureDemoAuth();
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedJobs, setSelectedJobs] = useState(new Set());

    const filteredAndSortedJobs = useMemo(() => {
        let filtered = savedJobs;

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(saved => {
                const job = saved.jobId;
                if (!job) return false;
                
                return (
                    job.title?.toLowerCase().includes(query) ||
                    job.company?.toLowerCase().includes(query) ||
                    job.description?.toLowerCase().includes(query) ||
                    (job.requiredSkills && job.requiredSkills.some(skill => 
                        skill.toLowerCase().includes(query)
                    ))
                );
            });
        }

        // Apply sorting
        switch (sortBy) {
            case 'oldest':
                return filtered.sort((a, b) => new Date(a.dateSaved || a.createdAt) - new Date(b.dateSaved || b.createdAt));
            case 'company':
                return filtered.sort((a, b) => (a.jobId?.company || '').localeCompare(b.jobId?.company || ''));
            case 'title':
                return filtered.sort((a, b) => (a.jobId?.title || '').localeCompare(b.jobId?.title || ''));
            case 'newest':
            default:
                return filtered.sort((a, b) => new Date(b.dateSaved || b.createdAt) - new Date(a.dateSaved || a.createdAt));
        }
    }, [savedJobs, searchQuery, sortBy]);

    const load = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getSavedJobs();
            setSavedJobs(Array.isArray(data) ? data : []);
        } catch (e) {
            setError(e?.response?.data?.message || 'Unable to load saved jobs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!ready) return;
        load();
    }, [ready]);

    const handleRemove = async (savedJob) => {
        try {
            await removeSavedJob(savedJob._id);
            await load();
            setSelectedJobs(prev => {
                const newSet = new Set(prev);
                newSet.delete(savedJob._id);
                return newSet;
            });
        } catch {
            // auth interceptor may redirect
        }
    };

    const handleBulkAction = async (action) => {
        if (action === 'remove' && selectedJobs.size > 0) {
            const promises = Array.from(selectedJobs).map(jobId => {
                const savedJob = savedJobs.find(saved => saved._id === jobId);
                return savedJob ? removeSavedJob(savedJob._id) : null;
            });
            
            try {
                await Promise.all(promises.filter(Boolean));
                await load();
                setSelectedJobs(new Set());
            } catch {
                // Error handling
            }
        }
    };

    const handleApply = (job) => {
        if (job && job._id) {
            navigate(`/student/jobs/${job._id}`);
        }
    };

    return (
        <div className="page saved-page">
            <div className="container">
                <BackToDashboardButton />

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
                            onClick={load}
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
                        {savedJobs.length > 0 ? (
                            <>
                                <SavedJobsToolbar
                                    onSearch={setSearchQuery}
                                    onSort={setSortBy}
                                    sortBy={sortBy}
                                    onBulkAction={handleBulkAction}
                                    selectedCount={selectedJobs.size}
                                />

                                <div className="saved-grid">
                                    {filteredAndSortedJobs.map((saved, index) => (
                                        <div
                                            key={saved._id}
                                            className="animate-fade-in"
                                            style={{
                                                animationDelay: `${index * 50}ms`
                                            }}
                                        >
                                            <JobCard
                                                job={saved.jobId}
                                                onApply={handleApply}
                                                showRemove
                                                onRemove={() => handleRemove(saved)}
                                                dateSaved={saved.dateSaved || saved.createdAt}
                                                isSelected={selectedJobs.has(saved._id)}
                                                onSelect={(selected) => {
                                                    setSelectedJobs(prev => {
                                                        const newSet = new Set(prev);
                                                        if (selected) {
                                                            newSet.add(saved._id);
                                                        } else {
                                                            newSet.delete(saved._id);
                                                        }
                                                        return newSet;
                                                    });
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {filteredAndSortedJobs.length === 0 && searchQuery && (
                                    <div className="glass-panel" style={{ 
                                        textAlign: 'center',
                                        padding: '48px 32px'
                                    }}>
                                        <div style={{ fontSize: '48px', marginBottom: '16px' }}><FiSearch /></div>
                                        <h3 style={{
                                            fontSize: '20px',
                                            fontWeight: '700',
                                            color: 'var(--secondary-800)',
                                            marginBottom: '12px'
                                        }}>
                                            No matching saved jobs
                                        </h3>
                                        <p style={{
                                            fontSize: '14px',
                                            color: 'var(--secondary-600)',
                                            marginBottom: '20px'
                                        }}>
                                            Try adjusting your search terms or browse more jobs to save.
                                        </p>
                                        <button 
                                            className="btn-secondary"
                                            onClick={() => setSearchQuery('')}
                                        >
                                            <FiRotateCw style={{ marginRight: '6px' }} /> Clear Search
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <EmptySavedJobsState
                                onBrowseJobs={() => navigate('/job-matching/search')}
                                onViewRecommendations={() => navigate('/job-matching/recommended')}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
