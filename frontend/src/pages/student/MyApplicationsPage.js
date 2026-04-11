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

    const getStatusBadge = (status) => {
        const map = {
            'Pending': 'badge badge-warning',
            'Reviewed': 'badge badge-info',
            'Interview': 'badge badge-success',
            'Offered': 'badge badge-purple',
            'Rejected': 'badge badge-danger'
        };
        return map[status] || 'badge';
    };

    const statuses = ['Pending', 'Reviewed', 'Interview', 'Offered', 'Rejected'];

    return (
        <div className="page-wrapper">
            <Navbar />

            {/* Page Header */}
            <div style={styles.pageHeader}>
                <div style={styles.pageHeaderInner}>
                    <div>
                        <h1 style={styles.pageTitle}>My Applications</h1>
                        <p style={styles.pageSubtitle}>Track and manage all your internship applications</p>
                    </div>
                    <div style={styles.totalPill}>{applications.length} total</div>
                </div>
            </div>

            <div className="main-content">
                {error && <div className="alert alert-error">⚠️ {error}</div>}

                {/* Stats */}
                <div style={styles.statsGrid}>
                    {statuses.map((status) => (
                        <div key={status} style={styles.statCard}>
                            <div style={styles.statValue}>
                                {applications.filter(a => a.status === status).length}
                            </div>
                            <div style={styles.statLabel}>{status}</div>
                        </div>
                    ))}
                </div>

                {/* Applications List */}
                <div>
                    <h2 style={styles.sectionTitle}>All Applications</h2>
                    <div style={styles.listCard}>
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
                                    className="btn btn-amber" style={{marginTop: '8px'}}>
                                    Go to Dashboard
                                </button>
                            </div>
                        ) : (
                            applications.map((app) => (
                                <div key={app._id} className="application-card">
                                    <div style={styles.companyAvatar}>
                                        {app.job?.company?.[0] || '?'}
                                    </div>
                                    <div style={styles.appLeft}>
                                        <h3 style={styles.appTitle}>{app.job?.title}</h3>
                                        <div style={styles.appMeta}>
                                            <span>{app.job?.company}</span>
                                            <span>·</span>
                                            <span>{app.job?.location}</span>
                                            <span>·</span>
                                            <span>{new Date(app.appliedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div style={styles.appRight}>
                                        <span className={getStatusBadge(app.status)}>{app.status}</span>
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
    pageHeader: { background: '#ffffff', borderBottom: '1px solid #E7E2D9', padding: '32px 0' },
    pageHeaderInner: { maxWidth: '1280px', margin: '0 auto', padding: '0 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    pageTitle: { fontSize: '28px', fontWeight: '800', color: '#1C1917', letterSpacing: '-0.5px' },
    pageSubtitle: { fontSize: '14px', color: '#6B7280', marginTop: '4px' },
    totalPill: { background: '#FEF3C7', color: '#D97706', padding: '6px 16px', borderRadius: '9999px', fontSize: '13px', fontWeight: '600' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' },
    statCard: { background: '#ffffff', border: '1px solid #E7E2D9', borderRadius: '16px', padding: '20px', textAlign: 'center' },
    statValue: { fontSize: '32px', fontWeight: '800', color: '#1C1917', letterSpacing: '-1px' },
    statLabel: { fontSize: '12px', color: '#6B7280', fontWeight: '500', marginTop: '4px' },
    sectionTitle: { fontSize: '18px', fontWeight: '700', color: '#1C1917', marginBottom: '16px' },
    listCard: { background: '#ffffff', border: '1px solid #E7E2D9', borderRadius: '16px', overflow: 'hidden' },
    companyAvatar: { width: '40px', height: '40px', background: '#FEF3C7', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '800', color: '#D97706', flexShrink: 0 },
    appLeft: { flex: 1 },
    appTitle: { fontSize: '14px', fontWeight: '700', color: '#1C1917', margin: 0 },
    appMeta: { display: 'flex', gap: '8px', fontSize: '12px', color: '#6B7280', marginTop: '2px' },
    appRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' },
    appActions: { display: 'flex', gap: '8px' }
};

export default MyApplicationsPage;