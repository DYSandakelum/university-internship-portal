import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../services/api';

const VerifyEmailPage = () => {
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('');
    const { token } = useParams();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const res = await api.get(`/auth/verify-email/${token}`);
                setMessage(res.data.message);
                setStatus('success');
            } catch (error) {
                setMessage(error.response?.data?.message || 'Verification failed.');
                setStatus('error');
            }
        };
        verifyEmail();
    }, [token]);

    return (
        <div className="auth-container">
            <Navbar />
            <div style={styles.wrapper}>
                <div style={styles.card}>
                    {status === 'verifying' && (
                        <>
                            <div className="spinner" style={{margin: '0 auto'}}></div>
                            <h2 style={styles.title}>Verifying your email...</h2>
                            <p style={styles.subtitle}>Please wait a moment</p>
                        </>
                    )}
                    {status === 'success' && (
                        <>
                            <div style={styles.successIcon}>✓</div>
                            <h2 style={styles.title}>Email Verified!</h2>
                            <p style={styles.subtitle}>{message}</p>
                            <Link to="/login" className="btn btn-primary btn-lg" style={{marginTop: '8px'}}>
                                Login to your account →
                            </Link>
                        </>
                    )}
                    {status === 'error' && (
                        <>
                            <div style={styles.errorIcon}>✕</div>
                            <h2 style={{...styles.title, color: 'var(--danger)'}}>Verification Failed</h2>
                            <p style={styles.subtitle}>{message}</p>
                            <div style={styles.errorButtons}>
                                <Link to="/register" className="btn btn-gray">
                                    Register Again
                                </Link>
                                <Link to="/login" className="btn btn-primary">
                                    Login →
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    wrapper: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px'
    },
    card: {
        background: '#ffffff',
        borderRadius: '20px',
        padding: '56px 48px',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        border: '1px solid var(--border)',
        width: '100%',
        maxWidth: '440px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        animation: 'fadeIn 0.4s ease'
    },
    successIcon: {
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'var(--success)',
        color: '#ffffff',
        fontSize: '28px',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '8px'
    },
    errorIcon: {
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'var(--danger)',
        color: '#ffffff',
        fontSize: '28px',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '8px'
    },
    title: {
        fontSize: '22px',
        fontWeight: '800',
        color: 'var(--text-primary)',
        letterSpacing: '-0.3px'
    },
    subtitle: {
        fontSize: '14px',
        color: 'var(--text-secondary)',
        maxWidth: '300px',
        lineHeight: '1.6'
    },
    errorButtons: {
        display: 'flex',
        gap: '12px',
        marginTop: '8px'
    }
};

export default VerifyEmailPage;