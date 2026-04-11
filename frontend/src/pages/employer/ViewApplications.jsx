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
        if (!token) { navigate('/login'); return; }
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

    const getStatusBadge = (status) => {
        const map = {
            'Pending': 'badge badge-warning',
            'Reviewing': 'badge badge-info',
            'Interview': 'badge badge-purple',
            'Offered': 'badge badge-success',
            'Rejected': 'badge badge-danger'
        };
        return map[status] || 'badge badge-primary';
    };

    const handleStatusChange = async (applicationId, status) => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        setUpdatingId(applicationId);
        setError('');
        try {
            const response = await fetch(`http://localhost:5000/api/applications/${applicationId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to update status.');
            setApplications((prev) => prev.map((app) => app._id === applicationId ? { ...app, status } : app));
        } catch (updateError) {
            setError(updateError.message || 'Unable to update status.');
        } finally {
            setUpdatingId('');
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
                <p>Loading applications...</p>
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
                    <Link to="/employer/my-jobs" className="nav-link">My Jobs</Link>
                    <Link to="/employer/profile" className="nav-link">Profile</Link>
                </div>
            </nav>

            {/* Page Header */}
            <div style={styles.pageHeader}>
                <div style={styles.pageHeaderInner}>
                    <div>
                        <h1 style={styles.pageTitle}>Applications</h1>
                        <p style={styles.pageSubtitle}>Review and manage student applications</p>
                    </div>
                    <div style={styles.totalPill}>{applications.length} total</div>
                </div>
            </div>

            <div className="main-content">
                {error && <div className="alert alert-error">⚠️ {error}</div>}

                {applications.length === 0 ? (
                    <div style={styles.emptyState}>
                        <p style={{ fontSize: '48px', marginBottom: '16px' }}>📭</p>
                        <p style={styles.emptyTitle}>No applications yet</p>
                        <p style={styles.emptySubtitle}>Applications will appear here when students apply to your jobs</p>
                    </div>
                ) : (
                    <div style={styles.listCard}>
                        {applications.map((application, index) => (
                            <div key={application._id} style={{
                                ...styles.appRow,
                                borderTop: index === 0 ? 'none' : '1px solid #E7E2D9'
                            }}>
                                <div style={styles.studentAvatar}>
                                    {application.student?.name?.[0] || '👤'}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={styles.studentName}>
                                        {application.student?.name || application.studentName || 'Student'}
                                    </h3>
                                    <div style={styles.appMeta}>
                                        <span>✉️ {application.student?.email || application.email || 'N/A'}</span>
                                        <span>💼 {application.job?.title || application.jobTitle || 'N/A'}</span>
                                        <span>📅 {application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                </div>
                                <div style={styles.appRight}>
                                    <span className={getStatusBadge(application.status || 'Pending')}>
                                        {application.status || 'Pending'}
                                    </span>
                                    <select
                                        className="form-input"
                                        value={application.status || 'Pending'}
                                        onChange={(e) => handleStatusChange(application._id, e.target.value)}
                                        disabled={updatingId === application._id}
                                        style={{ width: '160px', height: '36px', fontSize: '13px' }}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Reviewing">Reviewing</option>
                                        <option value="Interview">Interview</option>
                                        <option value="Offered">Offered</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
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
    totalPill: { background: '#FEF3C7', color: '#D97706', padding: '6px 16px', borderRadius: '9999px', fontSize: '13px', fontWeight: '600' },
    listCard: { background: '#ffffff', border: '1px solid #E7E2D9', borderRadius: '16px', overflow: 'hidden' },
    appRow: { padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px', transition: 'background 0.2s' },
    studentAvatar: { width: '40px', height: '40px', background: '#FEF3C7', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '800', color: '#D97706', flexShrink: 0 },
    studentName: { fontSize: '15px', fontWeight: '700', color: '#1C1917', margin: 0, marginBottom: '4px' },
    appMeta: { display: 'flex', gap: '16px', fontSize: '13px', color: '#6B7280', flexWrap: 'wrap' },
    appRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 },
    emptyState: { background: '#ffffff', border: '1px solid #E7E2D9', borderRadius: '16px', padding: '64px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    emptyTitle: { fontSize: '18px', fontWeight: '700', color: '#1C1917', margin: 0 },
    emptySubtitle: { fontSize: '14px', color: '#6B7280', marginTop: '8px', maxWidth: '320px' }
};

export default ViewApplications;