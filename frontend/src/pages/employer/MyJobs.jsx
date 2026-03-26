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
        if (!token) {
            navigate('/login');
            return;
        }
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

    const getStatusBadgeClass = (status) => {
        const normalized = (status || '').toLowerCase();
        if (normalized === 'active') return 'badge badge-success';
        if (normalized === 'closed') return 'badge badge-danger';
        if (normalized === 'filled') return 'badge badge-info';
        return 'badge badge-primary';
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
            setJobs((prevJobs) =>
                prevJobs.map((job) =>
                    job._id === jobId ? { ...job, status: 'Closed' } : job
                )
            );
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
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p>Loading jobs...</p>
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
                <div className="card">
                    <div className="card-header" style={{ justifyContent: 'space-between', background: 'linear-gradient(135deg, #7C3AED 0%, #6366f1 100%)' }}>
                        <h2 className="card-title">📋 My Jobs</h2>
                        <Link to="/employer/post-job" className="btn btn-white btn-sm">Post New Job</Link>
                    </div>
                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {error && <div className="alert alert-error">⚠️ {error}</div>}
                        {jobs.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <p style={{ fontSize: '40px' }}>🗂️</p>
                                <p style={{ color: '#6b7280' }}>No jobs posted yet</p>
                                <Link to="/employer/post-job" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6366f1 100%)' }}>
                                    Post Your First Job
                                </Link>
                            </div>
                        ) : (
                            jobs.map((job) => (
                                <div key={job._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                                        <h3 style={{ margin: 0, color: '#1e1b4b', fontSize: '17px' }}>{job.title}</h3>
                                        <p style={{ margin: 0, color: '#4b5563', fontSize: '14px' }}>📍 {job.location || 'N/A'}</p>
                                        <p style={{ margin: 0, color: '#4b5563', fontSize: '14px' }}>📅 Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}</p>
                                        <p style={{ margin: 0, color: '#4b5563', fontSize: '14px' }}>🧩 Type: {job.jobType || 'N/A'}</p>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
                                        <span className={getStatusBadgeClass(job.status)}>{job.status || 'Active'}</span>
                                        <button
                                            className="btn btn-sm"
                                            style={{ background: '#ef4444', color: 'white', opacity: (job.status || '').toLowerCase() === 'closed' ? 0.5 : 1 }}
                                            onClick={() => handleCloseJob(job._id)}
                                            disabled={closingJobId === job._id || (job.status || '').toLowerCase() === 'closed'}
                                        >
                                            {closingJobId === job._id ? 'Closing...' : 'Close Job'}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyJobs;