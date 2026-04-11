import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const MyJobs = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [closingJobId, setClosingJobId] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        fetchJobs(token);
    }, [navigate]);

    const fetchJobs = async (tokenValue) => {
        const token = tokenValue || localStorage.getItem('token');
        setLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:5000/api/jobs/employer', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch jobs.');
            setJobs(Array.isArray(data) ? data : (data.jobs || []));
        } catch (fetchError) {
            setError(fetchError.message || 'Failed to load jobs.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        const s = (status || '').toLowerCase();
        if (s === 'active') return { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' };
        if (s === 'closed') return { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' };
        if (s === 'filled') return { background: '#eff6ff', color: '#3b82f6', border: '1px solid #bfdbfe' };
        return { background: '#F5F0E8', color: '#6B7280', border: '1px solid #E7E2D9' };
    };

    const handleCloseJob = async (jobId) => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        setClosingJobId(jobId);
        try {
            const response = await fetch(`http://localhost:5000/api/jobs/${jobId}/close`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to close job.');
            setJobs((prev) => prev.map((job) => job._id === jobId ? { ...job, status: 'Closed' } : job));
        } catch (closeError) {
            setError(closeError.message || 'Unable to close this job.');
        } finally {
            setClosingJobId('');
        }
    };

    if (loading) return (
        <div className="page-wrapper">
            <nav className="navbar">
                <Link to="/" className="navbar-brand">
                    <div className="navbar-brand-icon">🎓</div>
                    InternHub
                </Link>
            </nav>
            <div className="loading-wrapper">
                <div className="spinner"></div>
                <p>Loading jobs...</p>
            </div>
        </div>
    );

    return (
        <div className="page-wrapper">
            <nav className="navbar">
                <Link to="/" className="navbar-brand">
                    <div className="navbar-brand-icon">🎓</div>
                    InternHub
                </Link>
                <div className="navbar-links">
                    <Link to="/employer/dashboard" className="nav-link">Dashboard</Link>
                    <Link to="/employer/post-job" className="nav-link">Post Job</Link>
                    <Link to="/employer/applications" className="nav-link">Applications</Link>
                    <Link to="/employer/profile" className="nav-link">Profile</Link>
                </div>
            </nav>

            {/* Page Header */}
            <div style={styles.pageHeader}>
                <div style={styles.pageHeaderInner}>
                    <div>
                        <h1 style={styles.pageTitle}>My Jobs</h1>
                        <p style={styles.pageSubtitle}>Manage your posted internship opportunities</p>
                    </div>
                    <Link to="/employer/post-job" className="btn btn-amber">
                        + Post New Job
                    </Link>
                </div>
            </div>

            <div className="main-content">
                {error && <div className="alert alert-error">⚠️ {error}</div>}

                {jobs.length === 0 ? (
                    <div style={styles.emptyState}>
                        <p style={{ fontSize: '48px', marginBottom: '16px' }}>🗂️</p>
                        <p style={styles.emptyTitle}>No jobs posted yet</p>
                        <p style={styles.emptySubtitle}>Create your first internship listing to start receiving applications</p>
                        <Link to="/employer/post-job" className="btn btn-amber" style={{ marginTop: '8px' }}>
                            Post Your First Job
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {jobs.map((job) => (
                            <div key={job._id} className="job-row">
                                <div style={styles.jobAvatar}>
                                    {job.title?.[0] || '💼'}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                                        <h3 style={styles.jobTitle}>{job.title}</h3>
                                        <span style={{
                                            ...getStatusStyle(job.status),
                                            padding: '3px 12px',
                                            borderRadius: '9999px',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }}>
                                            {job.status || 'Active'}
                                        </span>
                                    </div>
                                    <div style={styles.jobMeta}>
                                        <span>📍 {job.location || 'N/A'}</span>
                                        <span>💰 {job.salary || job.salaryRange || 'N/A'}</span>
                                        <span>📅 Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}</span>
                                        <span>🧩 {job.jobType || 'N/A'}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                    <Link to={`/employer/edit-job/${job._id}`} className="btn btn-ghost btn-sm">
                                        ✏️ Edit
                                    </Link>
                                    <button
                                        onClick={() => handleCloseJob(job._id)}
                                        disabled={closingJobId === job._id || (job.status || '').toLowerCase() === 'closed'}
                                        className="btn btn-danger btn-sm"
                                        style={{ cursor: (job.status || '').toLowerCase() === 'closed' ? 'not-allowed' : 'pointer' }}
                                    >
                                        {closingJobId === job._id ? 'Closing...' : '🔒 Close'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    pageHeader: { background: '#ffffff', borderBottom: '1px solid #E7E2D9', padding: '32px 0' },
    pageHeaderInner: { maxWidth: '1280px', margin: '0 auto', padding: '0 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    pageTitle: { fontSize: '28px', fontWeight: '800', color: '#1C1917', letterSpacing: '-0.5px', margin: 0 },
    pageSubtitle: { fontSize: '14px', color: '#6B7280', marginTop: '4px' },
    jobAvatar: { width: '48px', height: '48px', background: '#FEF3C7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '800', color: '#D97706', flexShrink: 0 },
    jobTitle: { fontSize: '15px', fontWeight: '700', color: '#1C1917', margin: 0 },
    jobMeta: { display: 'flex', gap: '16px', fontSize: '13px', color: '#6B7280', flexWrap: 'wrap' },
    emptyState: { background: '#ffffff', border: '1px solid #E7E2D9', borderRadius: '16px', padding: '64px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    emptyTitle: { fontSize: '18px', fontWeight: '700', color: '#1C1917', margin: 0 },
    emptySubtitle: { fontSize: '14px', color: '#6B7280', marginTop: '8px', maxWidth: '320px' }
};

export default MyJobs;