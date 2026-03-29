import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../services/api';

const MyApplicationsPage = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [withdrawing, setWithdrawing] = useState(null);
    const navigate = useNavigate();

    useEffect(() => { fetchApplications(); }, []);

    const fetchApplications = async () => {
        try {
            const res = await api.get('/student/applications');
            setApplications(res.data.applications);
        } catch (error) {
            setError('Failed to load applications.');
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async (id) => {
        if (!window.confirm('Withdraw this application?')) return;
        setWithdrawing(id);
        try {
            await api.delete(`/student/applications/${id}`);
            setApplications(applications.filter(app => app._id !== id));
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to withdraw.');
        } finally {
            setWithdrawing(null);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Pending': return 'badge badge-warning';
            case 'Reviewed': return 'badge badge-info';
            case 'Interview': return 'badge badge-success';
            case 'Offered': return 'badge badge-purple';
            case 'Rejected': return 'badge badge-danger';
            default: return 'badge';
        }
    };

    const statuses = ['Pending', 'Reviewed', 'Interview', 'Offered', 'Rejected'];
    const statColors = {
        Pending: 'var(--warning)', Reviewed: 'var(--info)',
        Interview: 'var(--success)', Offered: 'var(--secondary)', Rejected: 'var(--danger)'
    };

    return (
        <div className="page-wrapper">
            <Navbar />

            {/* Page Banner */}
            <div className="page-banner">
                <h1 className="page-banner-title">📋 My Applications</h1>
                <p className="page-banner-subtitle">Track and manage all your internship applications</p>
            </div>

            <div className="main-content">
                {error && <div className="alert alert-error">⚠️ {error}</div>}

                {/* Stats Row */}
                <div style={styles.statsGrid}>
                    {statuses.map((status) => (
                        <div key={status} className="stat-card">
                            <div className="stat-card-header" style={{backgroundColor: statColors[status]}}>
                                <span className="stat-label">{status}</span>
                            </div>
                            <div className="stat-card-body">
                                <span className="stat-value">
                                    {applications.filter(a => a.status === status).length}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Applications List */}
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">All Applications</h2>
                        <span style={styles.totalBadge}>{applications.length} total</span>
                    </div>
                    <div style={{padding: 0}}>
                        {loading ? (
                            <div className="loading-wrapper">
                                <div className="spinner"></div>
                                <p>Loading your applications...</p>
                            </div>
                        ) : applications.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">📭</div>
                                <p className="empty-title">No applications yet</p>
                                <p className="empty-subtitle">Browse internships and start applying!</p>
                                <button onClick={() => navigate('/student/dashboard')}
                                    className="btn btn-primary" style={{marginTop: '8px'}}>
                                    Go to Dashboard
                                </button>
                            </div>
                        ) : (
                            applications.map((app) => (
                                <div key={app._id} className="application-card">
                                    <div style={styles.appLeft}>
                                        <h3 style={styles.appTitle}>{app.job?.title}</h3>
                                        <div style={styles.appMeta}>
                                            <span>🏢 {app.job?.company}</span>
                                            <span>📍 {app.job?.location}</span>
                                            <span>📅 {new Date(app.appliedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div style={styles.appRight}>
                                        <span className={getStatusClass(app.status)}>{app.status}</span>
                                        <div style={styles.appActions}>
                                            <button onClick={() => navigate(`/student/jobs/${app.job?._id}`)}
                                                className="btn btn-ghost btn-sm">View Job</button>
                                            {app.status === 'Pending' && (
                                                <button onClick={() => handleWithdraw(app._id)}
                                                    className="btn btn-danger btn-sm"
                                                    disabled={withdrawing === app._id}>
                                                    {withdrawing === app._id ? 'Withdrawing...' : 'Withdraw'}
                                                </button>
                                            )}
                                        </div>
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

const styles = {
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' },
    totalBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff',
        padding: '3px 12px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: '600'
    },
    appLeft: { display: 'flex', flexDirection: 'column', gap: '6px' },
    appTitle: { fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 },
    appMeta: { display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)' },
    appRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' },
    appActions: { display: 'flex', gap: '8px' }
};

export default MyApplicationsPage;