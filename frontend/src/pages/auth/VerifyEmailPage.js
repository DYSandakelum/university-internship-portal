import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
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
        <div style={styles.container}>
            <div style={styles.logoArea}>
                <div style={styles.logoIcon}>🎓</div>
                <span style={styles.logoText}>InternHub</span>
            </div>

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
                        <Link to="/login" className="btn btn-amber btn-lg">
                            Sign in to your account →
                        </Link>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <div style={styles.errorIcon}>✕</div>
                        <h2 style={{...styles.title, color: '#ef4444'}}>Verification Failed</h2>
                        <p style={styles.subtitle}>{message}</p>
                        <div style={styles.errorButtons}>
                            <Link to="/register" className="btn btn-outline">Register Again</Link>
                            <Link to="/login" className="btn btn-amber">Sign In →</Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh', background: '#F5F0E8',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '40px 20px'
    },
    logoArea: {
        display: 'flex', alignItems: 'center', gap: '10px',
        marginBottom: '32px'
    },
    logoIcon: {
        width: '40px', height: '40px', background: '#F59E0B',
        borderRadius: '10px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '20px'
    },
    logoText: { fontSize: '20px', fontWeight: '700', color: '#1C1917' },
    card: {
        background: '#ffffff', borderRadius: '20px', padding: '48px 40px',
        textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
        border: '1px solid #E7E2D9', width: '100%', maxWidth: '420px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px'
    },
    successIcon: {
        width: '64px', height: '64px', borderRadius: '50%',
        background: '#22c55e', color: '#ffffff', fontSize: '28px',
        fontWeight: '700', display: 'flex', alignItems: 'center',
        justifyContent: 'center', marginBottom: '8px'
    },
    errorIcon: {
        width: '64px', height: '64px', borderRadius: '50%',
        background: '#ef4444', color: '#ffffff', fontSize: '28px',
        fontWeight: '700', display: 'flex', alignItems: 'center',
        justifyContent: 'center', marginBottom: '8px'
    },
    title: { fontSize: '22px', fontWeight: '800', color: '#1C1917' },
    subtitle: { fontSize: '14px', color: '#6B7280', maxWidth: '300px', lineHeight: '1.6' },
    errorButtons: { display: 'flex', gap: '12px', marginTop: '8px' }
};

export default VerifyEmailPage;