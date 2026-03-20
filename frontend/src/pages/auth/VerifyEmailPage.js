import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api';

const VerifyEmailPage = () => {
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');
    const { token } = useParams();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const res = await api.get(`/auth/verify-email/${token}`);
                setMessage(res.data.message);
                setStatus('success');
            } catch (error) {
                setMessage(error.response?.data?.message || 'Verification failed. Please try again.');
                setStatus('error');
            }
        };
        verifyEmail();
    }, [token]);

    return (
        <div style={styles.container}>
            {/* Navbar */}
            <nav style={styles.navbar}>
                <div style={styles.navBrand}>🎓 Internship Portal</div>
                <div style={styles.navLinks}>
                    <Link to="/" style={styles.navLink}>Home</Link>
                    <Link to="/login" style={styles.navLink}>Login</Link>
                    <Link to="/register" style={styles.navLink}>Register</Link>
                </div>
            </nav>

            {/* Main Content */}
            <div style={styles.main}>
                <div style={styles.card}>
                    {/* Card Header */}
                    <div style={
                        status === 'success' ? styles.cardHeaderSuccess :
                        status === 'error' ? styles.cardHeaderError :
                        styles.cardHeader
                    }>
                        <h1 style={styles.cardTitle}>
                            {status === 'verifying' && '⏳ Verifying Email...'}
                            {status === 'success' && '✅ Email Verified!'}
                            {status === 'error' && '❌ Verification Failed'}
                        </h1>
                    </div>

                    {/* Card Body */}
                    <div style={styles.cardBody}>
                        {status === 'verifying' && (
                            <div style={styles.centerContent}>
                                <div style={styles.spinner}></div>
                                <p style={styles.message}>
                                    Please wait while we verify your email address...
                                </p>
                            </div>
                        )}

                        {status === 'success' && (
                            <div style={styles.centerContent}>
                                <div style={styles.successIcon}>✅</div>
                                <p style={styles.message}>{message}</p>
                                <Link to="/login" style={styles.button}>
                                    🔑 Go to Login
                                </Link>
                            </div>
                        )}

                        {status === 'error' && (
                            <div style={styles.centerContent}>
                                <div style={styles.errorIcon}>❌</div>
                                <p style={styles.message}>{message}</p>
                                <div style={styles.buttonGroup}>
                                    <Link to="/register" style={styles.buttonSecondary}>
                                        Register Again
                                    </Link>
                                    <Link to="/login" style={styles.button}>
                                        🔑 Go to Login
                                    </Link>
                                </div>
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
    navbar: {
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '60px',
        boxShadow: '0 2px 8px rgba(99,102,241,0.15)'
    },
    navBrand: {
        color: '#ffffff',
        fontSize: '20px',
        fontWeight: '700',
        letterSpacing: '0.5px'
    },
    navLinks: {
        display: 'flex',
        gap: '24px',
        alignItems: 'center'
    },
    navLink: {
        color: 'rgba(255,255,255,0.85)',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '500'
    },
    main: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px'
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '440px',
        overflow: 'hidden'
    },
    cardHeader: {
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        padding: '16px 24px'
    },
    cardHeaderSuccess: {
        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        padding: '16px 24px'
    },
    cardHeaderError: {
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        padding: '16px 24px'
    },
    cardTitle: {
        color: '#ffffff',
        fontSize: '20px',
        fontWeight: '700',
        margin: 0
    },
    cardBody: {
        padding: '32px 24px'
    },
    centerContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
    },
    spinner: {
        width: '48px',
        height: '48px',
        border: '4px solid #e5e7eb',
        borderTop: '4px solid #6366f1',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    },
    successIcon: {
        fontSize: '64px'
    },
    errorIcon: {
        fontSize: '64px'
    },
    message: {
        fontSize: '15px',
        color: '#555',
        textAlign: 'center',
        lineHeight: '1.6'
    },
    button: {
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        color: '#ffffff',
        padding: '12px 24px',
        borderRadius: '8px',
        border: 'none',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'none',
        marginTop: '8px'
    },
    buttonSecondary: {
        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        color: '#ffffff',
        padding: '12px 24px',
        borderRadius: '8px',
        border: 'none',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'none',
        marginTop: '8px'
    },
    buttonGroup: {
        display: 'flex',
        gap: '12px',
        marginTop: '8px'
    }
};

export default VerifyEmailPage;