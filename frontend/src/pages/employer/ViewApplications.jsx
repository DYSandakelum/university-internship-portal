import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ViewApplications = () => {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchApplications(token);
    }, [navigate]);

    const fetchApplications = async (tokenValue) => {
        const token = tokenValue || localStorage.getItem('token');
        setLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:5000/api/applications/employer', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch applications.');
            setApplications(Array.isArray(data) ? data : (data.applications || []));
        } catch (fetchError) {
            setError(fetchError.message || 'Unable to load applications.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Pending': return 'badge badge-warning';
            case 'Reviewing': return 'badge badge-info';
            case 'Interview': return 'badge badge-purple';
            case 'Offered': return 'badge badge-success';
            case 'Rejected': return 'badge badge-danger';
            default: return 'badge badge-primary';
        }
    };

    const handleStatusChange = async (applicationId, status) => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        setUpdatingId(applicationId);
        setError('');
        try {
            const response = await fetch(`http://localhost:5000/api/applications/${applicationId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to update status.');
            setApplications((prev) =>
                prev.map((app) => app._id === applicationId ? { ...app, status } : app)
            );
        } catch (updateError) {
            setError(updateError.message || 'Unable to update status.');
        } finally {
            setUpdatingId('');
        }
    };

    if (loading) {
        return (
            <div className="page-wrapper">
                <nav className="navbar">
                    <div className="navbar-brand">🎓 Internship Portal</div>
                </nav>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p>Loading applications...</p>
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
                    <Link to="/employer/my-jobs" className="nav-link">My Jobs</Link>
                    <Link to="/employer/profile" className="nav-link">Profile</Link>
                </div>
            </nav>
            <div className="main-content" style={{ maxWidth: '1000px' }}>
                <div className="card">
                    <div className="card-header" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6366f1 100%)' }}>
                        <h2 className="card-title">👥 View Applications</h2>
                    </div>
                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {error && <div className="alert alert-error">⚠️ {error}</div>}
                        {applications.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <p style={{ fontSize: '40px' }}>📭</p>
                                <p style={{ color: '#6b7280' }}>No applications yet</p>
                            </div>
                        ) : (
                            applications.map((application) => (
                                <div key={application._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                                        <h3 style={{ margin: 0, color: '#1e1b4b', fontSize: '17px' }}>
                                            {application.student?.name || application.studentName || 'Student'}
                                        </h3>
                                        <p style={{ margin: 0, color: '#4b5563', fontSize: '14px' }}>
                                            ✉️ {application.student?.email || application.email || 'N/A'}
                                        </p>
                                        <p style={{ margin: 0, color: '#4b5563', fontSize: '14px' }}>
                                            💼 {application.job?.title || application.jobTitle || 'N/A'}
                                        </p>
                                        <p style={{ margin: 0, color: '#4b5563', fontSize: '14px' }}>
                                            📅 Applied: {application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                    <div style={{ minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <span className={getStatusClass(application.status || 'Pending')}>
                                            {application.status || 'Pending'}
                                        </span>
                                        <select
                                            className="form-input"
                                            value={application.status || 'Pending'}
                                            onChange={(e) => handleStatusChange(application._id, e.target.value)}
                                            disabled={updatingId === application._id}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Reviewing">Reviewing</option>
                                            <option value="Interview">Interview</option>
                                            <option value="Offered">Offered</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
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

export default ViewApplications;