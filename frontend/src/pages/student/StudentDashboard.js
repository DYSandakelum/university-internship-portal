import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await api.get('/student/applications');
                setApplications(res.data.applications);
            } catch (error) {
                console.error('Failed to fetch applications');
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const stats = [
        { label: 'Total Applications', value: applications.length, color: 'var(--primary)', icon: '📋' },
        { label: 'Pending', value: applications.filter(a => a.status === 'Pending').length, color: 'var(--warning)', icon: '⏳' },
        { label: 'Interviews', value: applications.filter(a => a.status === 'Interview').length, color: 'var(--success)', icon: '🎯' },
        { label: 'Offers', value: applications.filter(a => a.status === 'Offered').length, color: 'var(--amber)', icon: '🎉' }
    ];

    const recentApplications = applications.slice(0, 5);

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

    return (
        <div className="page-wrapper">
            <Navbar />

            {/* Page Banner */}
            <div className="page-banner">
                <h1 className="page-banner-title">Welcome back, {user?.name}! 👋</h1>
                <p className="page-banner-subtitle">Here's an overview of your internship journey</p>
            </div>

            <div className="main-content">

                {/* Stats Grid */}
                <div className="grid-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-card">
                            <div className="stat-card-header" style={{backgroundColor: stat.color}}>
                                <span style={{fontSize: '16px'}}>{stat.icon}</span>
                                <span className="stat-label">{stat.label}</span>
                            </div>
                            <div className="stat-card-body">
                                <span className="stat-value">{stat.value}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">🚀 Quick Actions</h2>
                    </div>
                    <div className="card-body">
                        <div className="grid-4" style={{gap: '12px'}}>
                            {quickActions.map((action, index) => (
                                <Link key={index} to={action.path} style={{
                                    ...styles.actionCard,
                                    background: action.color
                                }}>
                                    <span style={styles.actionIcon}>{action.icon}</span>
                                    <span style={styles.actionLabel}>{action.label}</span>
                                    <span style={styles.actionArrow}>→</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Applications */}
                <div className="card">
                    <div className="card-header" style={{background: 'var(--warning)'}}>
                        <h2 className="card-title">📋 Recent Applications</h2>
                    </div>
                    <div style={{padding: 0}}>
                        {loading ? (
                            <div className="loading-wrapper">
                                <div className="spinner"></div>
                                <p>Loading applications...</p>
                            </div>
                        ) : recentApplications.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">📭</div>
                                <p className="empty-title">No applications yet</p>
                                <p className="empty-subtitle">
                                    Browse available internships and start applying!
                                </p>
                            </div>
                        ) : (
                            <>
                                {recentApplications.map((app) => (
                                    <div key={app._id} className="application-card">
                                        <div style={styles.appInfo}>
                                            <p style={styles.appTitle}>{app.job?.title}</p>
                                            <p style={styles.appMeta}>
                                                🏢 {app.job?.company} · 📍 {app.job?.location}
                                            </p>
                                        </div>
                                        <div style={styles.appRight}>
                                            <span className={getStatusClass(app.status)}>
                                                {app.status}
                                            </span>
                                            <span style={styles.appDate}>
                                                {new Date(app.appliedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {applications.length > 5 && (
                                    <div style={styles.viewAll}>
                                        <Link to="/student/applications" className="btn btn-ghost btn-sm">
                                            View All Applications →
                                        </Link>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const quickActions = [
    { icon: '📋', label: 'My Applications', path: '/student/applications', color: 'var(--primary)' },
    { icon: '👤', label: 'My Profile', path: '/student/profile', color: 'var(--success)' },
    { icon: '📄', label: 'CV Generator', path: '/student/cv-generator', color: 'var(--info)' },
    { icon: '🔍', label: 'Browse Jobs', path: '/student/browse-jobs', color: 'var(--amber)' }
];

const styles = {
    actionCard: {
        borderRadius: 'var(--radius-md)',
        padding: '18px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        textDecoration: 'none',
        transition: 'var(--transition-slow)'
    },
    actionIcon: { fontSize: '20px' },
    actionLabel: { color: '#ffffff', fontSize: '14px', fontWeight: '600', flex: 1 },
    actionArrow: { color: 'rgba(255,255,255,0.7)', fontSize: '16px' },
    appInfo: { display: 'flex', flexDirection: 'column', gap: '4px' },
    appTitle: { fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', margin: 0 },
    appMeta: { fontSize: '13px', color: 'var(--text-secondary)', margin: 0 },
    appRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' },
    appDate: { fontSize: '12px', color: 'var(--text-light)' },
    viewAll: { padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'center' }
};

export default StudentDashboard;