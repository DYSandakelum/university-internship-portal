import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { FaClipboardList, FaUser, FaFileAlt, FaSearch, FaMicrophone } from 'react-icons/fa';

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
        { label: 'Total Applications', value: applications.length, icon: <FaClipboardList /> },
        { label: 'Pending Review', value: applications.filter(a => a.status === 'Pending').length, icon: '⏳' },
        { label: 'Interviews', value: applications.filter(a => a.status === 'Interview').length, icon: '🎯' },
        { label: 'Offers', value: applications.filter(a => a.status === 'Offered').length, icon: '🎉' }
    ];

    const recentApplications = applications.slice(0, 5);

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

    return (
        <div className="page-wrapper">
            <Navbar />

            {/* Page Header */}
            <div style={styles.pageHeader}>
                <div style={styles.pageHeaderInner}>
                    <div>
                        <h1 style={styles.pageTitle}>Welcome back, {user?.name}! 👋</h1>
                        <p style={styles.pageSubtitle}>Here's an overview of your internship journey</p>
                    </div>
                    <Link to="/student/profile" className="btn btn-outline-dark btn-sm">
                        <FaUser style={{fontSize: '12px'}} /> Edit Profile
                    </Link>
                </div>
            </div>

            <div className="main-content">

                {/* Stats */}
                <div className="grid-4">
                    {stats.map((stat, i) => (
                        <div key={i} style={styles.statCard}>
                            <div style={styles.statIcon}>{stat.icon}</div>
                            <div style={styles.statValue}>{stat.value}</div>
                            <div style={styles.statLabel}>{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 style={styles.sectionTitle}>Quick Actions</h2>
                    <div className="grid-3" style={{gap: '16px', marginTop: '16px'}}>
                        {quickActions.map((action, i) => (
                            <Link key={i} to={action.path} style={styles.actionCard}>
                                <div style={styles.actionIconBox}>{action.icon}</div>
                                <div>
                                    <p style={styles.actionTitle}>{action.title}</p>
                                    <p style={styles.actionDesc}>{action.desc}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Applications */}
                <div>
                    <div style={styles.sectionRow}>
                        <h2 style={styles.sectionTitle}>Recent Applications</h2>
                        <Link to="/student/applications" style={styles.viewAll}>View all →</Link>
                    </div>
                    <div style={styles.applicationsCard}>
                        {loading ? (
                            <div className="loading-wrapper">
                                <div className="spinner"></div>
                                <p>Loading applications...</p>
                            </div>
                        ) : recentApplications.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">📭</div>
                                <p className="empty-title">No applications yet</p>
                                <p className="empty-subtitle">Browse available internships and start applying!</p>
                                <Link to="/job-matching/search" className="btn btn-amber" style={{marginTop: '8px'}}>
                                    Browse Internships
                                </Link>
                            </div>
                        ) : (
                            recentApplications.map((app) => (
                                <div key={app._id} className="application-card">
                                    <div style={styles.appCompanyAvatar}>
                                        {app.job?.company?.[0] || '?'}
                                    </div>
                                    <div style={styles.appInfo}>
                                        <p style={styles.appTitle}>{app.job?.title}</p>
                                        <p style={styles.appMeta}>{app.job?.company} · {app.job?.location}</p>
                                    </div>
                                    <div style={styles.appRight}>
                                        <span className={getStatusBadge(app.status)}>{app.status}</span>
                                        <span style={styles.appDate}>{new Date(app.appliedAt).toLocaleDateString()}</span>
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

const quickActions = [
    { icon: <FaSearch style={{color: '#F59E0B'}} />, title: 'Browse Internships', desc: 'Find opportunities matching your skills', path: '/job-matching/search' },
    { icon: <FaClipboardList style={{color: '#F59E0B'}} />, title: 'My Applications', desc: 'Track all your applications', path: '/student/applications' },
    { icon: <FaFileAlt style={{color: '#F59E0B'}} />, title: 'CV Generator', desc: 'Create a professional CV', path: '/student/cv-generator' },
    { icon: <FaUser style={{color: '#F59E0B'}} />, title: 'My Profile', desc: 'Update your profile and skills', path: '/student/profile' },
    { icon: '🎯', title: 'Job Matching', desc: 'Get personalized recommendations', path: '/job-matching/dashboard' },
    { icon: <FaMicrophone style={{color: '#F59E0B'}} />, title: 'Practice Interview', desc: 'Prepare for your interviews', path: '/job-matching/practice-interview' }
];

const styles = {
    pageHeader: { background: '#ffffff', borderBottom: '1px solid #E7E2D9', padding: '32px 0' },
    pageHeaderInner: { maxWidth: '1280px', margin: '0 auto', padding: '0 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    pageTitle: { fontSize: '28px', fontWeight: '800', color: '#1C1917', letterSpacing: '-0.5px' },
    pageSubtitle: { fontSize: '14px', color: '#6B7280', marginTop: '4px' },
    statCard: { background: '#ffffff', border: '1px solid #E7E2D9', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' },
    statIcon: { fontSize: '20px', color: '#F59E0B' },
    statValue: { fontSize: '36px', fontWeight: '800', color: '#1C1917', letterSpacing: '-1px', lineHeight: '1' },
    statLabel: { fontSize: '13px', color: '#6B7280', fontWeight: '500' },
    sectionTitle: { fontSize: '18px', fontWeight: '700', color: '#1C1917' },
    sectionRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
    viewAll: { fontSize: '14px', color: '#F59E0B', fontWeight: '600', textDecoration: 'none' },
    actionCard: { background: '#ffffff', border: '1px solid #E7E2D9', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'flex-start', gap: '16px', textDecoration: 'none', transition: 'all 0.2s ease' },
    actionIconBox: { width: '40px', height: '40px', background: '#FEF3C7', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 },
    actionTitle: { fontSize: '14px', fontWeight: '700', color: '#1C1917', margin: 0 },
    actionDesc: { fontSize: '12px', color: '#6B7280', margin: 0, marginTop: '2px' },
    applicationsCard: { background: '#ffffff', border: '1px solid #E7E2D9', borderRadius: '16px', overflow: 'hidden' },
    appCompanyAvatar: { width: '40px', height: '40px', background: '#FEF3C7', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '800', color: '#D97706', flexShrink: 0 },
    appInfo: { flex: 1 },
    appTitle: { fontSize: '14px', fontWeight: '700', color: '#1C1917', margin: 0 },
    appMeta: { fontSize: '12px', color: '#6B7280', margin: 0, marginTop: '2px' },
    appRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' },
    appDate: { fontSize: '12px', color: '#9CA3AF' }
};

export default StudentDashboard;