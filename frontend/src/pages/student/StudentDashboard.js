import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
    const { user } = useAuth();

    // Placeholder stats - will be replaced with real data later
    const stats = [
        { label: 'Total Applications', value: 0, color: '#6366f1', icon: '📋' },
        { label: 'Pending', value: 0, color: '#f97316', icon: '⏳' },
        { label: 'Interviews', value: 0, color: '#22c55e', icon: '🎯' },
        { label: 'Offers', value: 0, color: '#3b82f6', icon: '🎉' }
    ];

    // Placeholder recent applications - will be replaced with real data later
    const recentApplications = [];

    return (
        <div style={styles.container}>
            <Navbar />

            <div style={styles.main}>
                {/* Welcome Section */}
                <div style={styles.welcomeCard}>
                    <div>
                        <h1 style={styles.welcomeTitle}>
                            Welcome back, {user?.name}! 👋
                        </h1>
                        <p style={styles.welcomeSubtitle}>
                            Here's an overview of your internship applications
                        </p>
                    </div>
                    <div style={styles.welcomeActions}>
                        <Link to="/student/profile" style={styles.profileButton}>
                            👤 My Profile
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div style={styles.statsGrid}>
                    {stats.map((stat, index) => (
                        <div key={index} style={styles.statCard}>
                            <div style={{...styles.statCardHeader, backgroundColor: stat.color}}>
                                <span style={styles.statIcon}>{stat.icon}</span>
                                <span style={styles.statLabel}>{stat.label}</span>
                            </div>
                            <div style={styles.statCardBody}>
                                <span style={styles.statValue}>{stat.value}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h2 style={styles.cardTitle}>🚀 Quick Actions</h2>
                    </div>
                    <div style={styles.cardBody}>
                        <div style={styles.actionsGrid}>
                            <Link to="/student/applications" style={styles.actionButton}>
                                <span style={styles.actionIcon}>📋</span>
                                <span style={styles.actionLabel}>My Applications</span>
                            </Link>
                            <Link to="/student/profile" style={{...styles.actionButton, background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'}}>
                                <span style={styles.actionIcon}>👤</span>
                                <span style={styles.actionLabel}>My Profile</span>
                            </Link>
                            <Link to="/student/cv-generator" style={{...styles.actionButton, background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'}}>
                                <span style={styles.actionIcon}>📄</span>
                                <span style={styles.actionLabel}>CV Generator</span>
                            </Link>
                            <Link
                                to="/job-matching/practice-interview"
                                style={{
                                    ...styles.actionButton,
                                    background: 'linear-gradient(135deg, #0f766e 0%, #0c5e58 100%)'
                                }}
                            >
                                <span style={styles.actionIcon}>📝</span>
                                <span style={styles.actionLabel}>Practice Interview</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Recent Applications */}
                <div style={styles.card}>
                    <div style={{...styles.cardHeader, backgroundColor: '#f97316'}}>
                        <h2 style={styles.cardTitle}>📋 Recent Applications</h2>
                    </div>
                    <div style={styles.cardBody}>
                        {recentApplications.length === 0 ? (
                            <div style={styles.emptyState}>
                                <p style={styles.emptyText}>You haven't applied to any internships yet.</p>
                                <p style={styles.emptySubText}>
                                    Browse available internships and start applying!
                                </p>
                            </div>
                        ) : (
                            recentApplications.map((app, index) => (
                                <div key={index} style={styles.applicationItem}>
                                    <span>{app.title}</span>
                                    <span>{app.status}</span>
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
    // Welcome Card
    welcomeCard: {
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        borderRadius: '12px',
        padding: '24px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
    },
    welcomeTitle: {
        color: '#ffffff',
        fontSize: '24px',
        fontWeight: '700',
        marginBottom: '8px'
    },
    welcomeSubtitle: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: '14px'
    },
    welcomeActions: {
        display: 'flex',
        gap: '12px'
    },
    profileButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        color: '#ffffff',
        border: '1px solid rgba(255,255,255,0.4)',
        padding: '10px 20px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'none'
    },
    // Stats Grid
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px'
    },
    statCard: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        overflow: 'hidden'
    },
    statCardHeader: {
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    statIcon: {
        fontSize: '20px'
    },
    statLabel: {
        color: '#ffffff',
        fontSize: '13px',
        fontWeight: '600'
    },
    statCardBody: {
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    statValue: {
        fontSize: '36px',
        fontWeight: '700',
        color: '#333'
    },
    // Cards
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
    // Quick Actions
    actionsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px'
    },
    actionButton: {
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        borderRadius: '12px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        textDecoration: 'none',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s'
    },
    actionIcon: {
        fontSize: '32px'
    },
    actionLabel: {
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: '600'
    },
    // Empty State
    emptyState: {
        textAlign: 'center',
        padding: '32px'
    },
    emptyText: {
        fontSize: '16px',
        color: '#555',
        marginBottom: '8px'
    },
    emptySubText: {
        fontSize: '14px',
        color: '#888'
    },
    // Application Item
    applicationItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px',
        borderBottom: '1px solid #eee'
    }
};

export default StudentDashboard;