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
        if (s === 'active') return { background: '#d1fae5', color: '#065f46' };
        if (s === 'closed') return { background: '#fee2e2', color: '#991b1b' };
        if (s === 'filled') return { background: '#dbeafe', color: '#1e40af' };
        return { background: '#f3f4f6', color: '#374151' };
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

    if (loading) {
        return (
            <div className="page-wrapper">
                <nav className="navbar">
                    <div className="navbar-brand">🎓 Internship Portal</div>
                </nav>
                <div style={{ textAlign: 'center', padding: '80px' }}>
                    <p style={{ color: '#7C3AED', fontSize: '18px' }}>Loading jobs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <nav className="navbar">
                <div className="navbar-brand">🎓 Internship Portal</div>
                <div className="navbar-links">
                    <Link to="/employer/dashboard" className="nav-link">Dashboard</Link>
                    <Link to="/employer/post-job" className="nav-link">Post Job</Link>
                    <Link to="/employer/profile" className="nav-link">Profile</Link>
                </div>
            </nav>
            <div className="main-content" style={{ maxWidth: '1000px' }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #7C3AED 0%, #6366f1 100%)',
                    borderRadius: '12px',
                    padding: '20px 24px',
                    marginBottom: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h2 style={{ color: 'white', margin: 0, fontSize: '22px' }}>📋 My Jobs</h2>
                    <Link to="/employer/post-job" style={{
                        background: 'white',
                        color: '#7C3AED',
                        padding: '8px 18px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '14px'
                    }}>
                        + Post New Job
                    </Link>
                </div>

                {error && <div className="alert alert-error">⚠️ {error}</div>}

                {jobs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px' }}>
                        <p style={{ fontSize: '48px' }}>🗂️</p>
                        <p style={{ color: '#6b7280', fontSize: '16px' }}>No jobs posted yet</p>
                        <Link to="/employer/post-job" style={{
                            background: 'linear-gradient(135deg, #7C3AED 0%, #6366f1 100%)',
                            color: 'white',
                            padding: '10px 24px',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontWeight: '600'
                        }}>
                            Post Your First Job
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {jobs.map((job) => (
                            <div key={job._id} style={{
                                background: 'white',
                                borderRadius: '12px',
                                padding: '20px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                border: '1px solid #e5e7eb'
                            }}>
                                {/* Job Title + Status */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <h3 style={{ margin: 0, color: '#1e1b4b', fontSize: '18px', fontWeight: '700' }}>
                                        {job.title}
                                    </h3>
                                    <span style={{
                                        ...getStatusStyle(job.status),
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '13px',
                                        fontWeight: '600'
                                    }}>
                                        {job.status || 'Active'}
                                    </span>
                                </div>

                                {/* Job Details */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', marginBottom: '16px' }}>
                                    <p style={{ margin: 0, color: '#4b5563', fontSize: '14px' }}>📍 {job.location || 'N/A'}</p>
                                    <p style={{ margin: 0, color: '#4b5563', fontSize: '14px' }}>💰 {job.salary || job.salaryRange || 'N/A'}</p>
                                    <p style={{ margin: 0, color: '#4b5563', fontSize: '14px' }}>📅 Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}</p>
                                    <p style={{ margin: 0, color: '#4b5563', fontSize: '14px' }}>🧩 Type: {job.jobType || 'N/A'}</p>
                                </div>

                                {/* Buttons */}
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <Link
                                        to={`/employer/edit-job/${job._id}`}
                                        style={{
                                            background: 'linear-gradient(135deg, #7C3AED 0%, #6366f1 100%)',
                                            color: 'white',
                                            padding: '8px 20px',
                                            borderRadius: '8px',
                                            textDecoration: 'none',
                                            fontSize: '14px',
                                            fontWeight: '600'
                                        }}
                                    >
                                        ✏️ Edit
                                    </Link>
                                    <button
                                        onClick={() => handleCloseJob(job._id)}
                                        disabled={closingJobId === job._id || (job.status || '').toLowerCase() === 'closed'}
                                        style={{
                                            background: (job.status || '').toLowerCase() === 'closed' ? '#9ca3af' : '#ef4444',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 20px',
                                            borderRadius: '8px',
                                            cursor: (job.status || '').toLowerCase() === 'closed' ? 'not-allowed' : 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '600'
                                        }}
                                    >
                                        {closingJobId === job._id ? 'Closing...' : '🔒 Close Job'}
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

export default MyJobs;