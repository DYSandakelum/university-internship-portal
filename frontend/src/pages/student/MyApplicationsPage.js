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

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await api.get('/student/applications');
            setApplications(res.data.applications);
        } catch (error) {
            setError('Failed to load applications. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async (applicationId) => {
        if (!window.confirm('Are you sure you want to withdraw this application?')) return;

        setWithdrawing(applicationId);
        try {
            await api.delete(`/student/applications/${applicationId}`);
            setApplications(applications.filter(app => app._id !== applicationId));
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to withdraw application.');
        } finally {
            setWithdrawing(null);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending':
                return { backgroundColor: '#fff7ed', color: '#f97316', border: '1px solid #fed7aa' };
            case 'Reviewed':
                return { backgroundColor: '#eff6ff', color: '#3b82f6', border: '1px solid #bfdbfe' };
            case 'Interview':
                return { backgroundColor: '#f0fdf4', color: '#22c55e', border: '1px solid #bbf7d0' };
            case 'Offered':
                return { backgroundColor: '#faf5ff', color: '#8b5cf6', border: '1px solid #ddd6fe' };
            case 'Rejected':
                return { backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' };
            default:
                return { backgroundColor: '#f9fafb', color: '#6b7280', border: '1px solid #e5e7eb' };
        }
    };

    if (loading) return (
        <div style={styles.container}>
            <Navbar />
            <div style={styles.centerContent}>
                <div style={styles.spinner}></div>
                <p>Loading your applications...</p>
            </div>
        </div>
    );

    return (
        <div style={styles.container}>
            <Navbar />
            <div style={styles.main}>
                {/* Header */}
                <div style={styles.headerCard}>
                    <div>
                        <h1 style={styles.headerTitle}>📋 My Applications</h1>
                        <p style={styles.headerSubtitle}>
                            Track all your internship applications
                        </p>
                    </div>
                    <div style={styles.totalBadge}>
                        {applications.length} Total
                    </div>
                </div>

                {error && <div style={styles.error}>{error}</div>}

                {/* Stats Row */}
                <div style={styles.statsGrid}>
                    {['Pending', 'Reviewed', 'Interview', 'Offered', 'Rejected'].map((status) => (
                        <div key={status} style={styles.statCard}>
                            <div style={{
                                ...styles.statCardHeader,
                                ...getStatusStyle(status)
                            }}>
                                <span style={styles.statLabel}>{status}</span>
                            </div>
                            <div style={styles.statCardBody}>
                                <span style={styles.statValue}>
                                    {applications.filter(app => app.status === status).length}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Applications List */}
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h2 style={styles.cardTitle}>📋 All Applications</h2>
                    </div>
                    <div style={styles.cardBody}>
                        {applications.length === 0 ? (
                            <div style={styles.emptyState}>
                                <p style={styles.emptyText}>
                                    You haven't applied to any internships yet.
                                </p>
                                <button
                                    onClick={() => navigate('/student/dashboard')}
                                    style={styles.browseButton}
                                >
                                    Go to Dashboard
                                </button>
                            </div>
                        ) : (
                            <div style={styles.applicationsList}>
                                {applications.map((app) => (
                                    <div key={app._id} style={styles.applicationCard}>
                                        <div style={styles.applicationLeft}>
                                            <h3 style={styles.jobTitle}>
                                                {app.job?.title}
                                            </h3>
                                            <div style={styles.jobMeta}>
                                                <span style={styles.metaItem}>
                                                    🏢 {app.job?.company}
                                                </span>
                                                <span style={styles.metaItem}>
                                                    📍 {app.job?.location}
                                                </span>
                                                <span style={styles.metaItem}>
                                                    📅 Applied: {new Date(app.appliedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={styles.applicationRight}>
                                            <span style={{
                                                ...styles.statusBadge,
                                                ...getStatusStyle(app.status)
                                            }}>
                                                {app.status}
                                            </span>
                                            <div style={styles.actionButtons}>
                                                <button
                                                    onClick={() => navigate(`/student/jobs/${app.job?._id}`)}
                                                    style={styles.viewButton}
                                                >
                                                    View Job
                                                </button>
                                                {app.status === 'Pending' && (
                                                    <button
                                                        onClick={() => handleWithdraw(app._id)}
                                                        style={styles.withdrawButton}
                                                        disabled={withdrawing === app._id}
                                                    >
                                                        {withdrawing === app._id ? 'Withdrawing...' : 'Withdraw'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column'
    },
    main: {
        padding: '32px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
    },
    centerContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '40px'
    },
    spinner: {
        width: '48px',
        height: '48px',
        border: '4px solid #e5e7eb',
        borderTop: '4px solid #6366f1',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    },
    // Header Card
    headerCard: {
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        borderRadius: '12px',
        padding: '24px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
    },
    headerTitle: {
        color: '#ffffff',
        fontSize: '24px',
        fontWeight: '700',
        marginBottom: '8px'
    },
    headerSubtitle: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: '14px'
    },
    totalBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        color: '#ffffff',
        padding: '8px 20px',
        borderRadius: '20px',
        fontSize: '16px',
        fontWeight: '700'
    },
    error: {
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '14px'
    },
    // Stats Grid
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '16px'
    },
    statCard: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        overflow: 'hidden'
    },
    statCardHeader: {
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    statLabel: {
        fontSize: '13px',
        fontWeight: '600'
    },
    statCardBody: {
        padding: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    statValue: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#333'
    },
    // Card
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        overflow: 'hidden'
    },
    cardHeader: {
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        padding: '16px 24px'
    },
    cardTitle: {
        color: '#ffffff',
        fontSize: '18px',
        fontWeight: '700',
        margin: 0
    },
    cardBody: {
        padding: '24px'
    },
    // Applications List
    applicationsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    applicationCard: {
        border: '1px solid #e5e7eb',
        borderRadius: '10px',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fafafa'
    },
    applicationLeft: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    jobTitle: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#1a1a2e',
        margin: 0
    },
    jobMeta: {
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap'
    },
    metaItem: {
        fontSize: '13px',
        color: '#666'
    },
    applicationRight: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '12px'
    },
    statusBadge: {
        padding: '6px 14px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: '600'
    },
    actionButtons: {
        display: 'flex',
        gap: '8px'
    },
    viewButton: {
        backgroundColor: '#eff6ff',
        color: '#3b82f6',
        border: '1px solid #bfdbfe',
        padding: '6px 14px',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    withdrawButton: {
        backgroundColor: '#fef2f2',
        color: '#ef4444',
        border: '1px solid #fecaca',
        padding: '6px 14px',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    // Empty State
    emptyState: {
        textAlign: 'center',
        padding: '40px'
    },
    emptyText: {
        fontSize: '16px',
        color: '#555',
        marginBottom: '16px'
    },
    browseButton: {
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        color: '#ffffff',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer'
    }
};

export default MyApplicationsPage;