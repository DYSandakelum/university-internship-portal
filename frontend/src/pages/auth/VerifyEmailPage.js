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
                setMessage(error.response?.data?.message || 'Verification failed. Please try again.');
                setStatus('error');
            }
        };
        verifyEmail();
    }, [token]);

    return (
        <div className="auth-container">
            <Navbar />
            <div className="main-content-sm">
                <div className="auth-card">
                    <div className={`auth-card-header ${
                        status === 'success' ? 'card-header-success' :
                        status === 'error' ? '' : ''
                    }`} style={status === 'error' ? {background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'} : {}}>
                        <h1 className="auth-card-title">
                            {status === 'verifying' && '⏳ Verifying Email...'}
                            {status === 'success' && '✅ Email Verified!'}
                            {status === 'error' && '❌ Verification Failed'}
                        </h1>
                        <p className="auth-card-subtitle">
                            {status === 'verifying' && 'Please wait a moment'}
                            {status === 'success' && 'Your account is now active'}
                            {status === 'error' && 'Something went wrong'}
                        </p>
                    </div>
                    <div className="auth-card-body" style={{alignItems: 'center', textAlign: 'center', gap: '20px'}}>
                        {status === 'verifying' && (
                            <>
                                <div className="spinner"></div>
                                <p style={{color: 'var(--text-secondary)', fontSize: '14px'}}>
                                    Verifying your email address...
                                </p>
                            </>
                        )}

                        {status === 'success' && (
                            <>
                                <div style={{fontSize: '56px'}}>🎉</div>
                                <p style={{color: 'var(--text-secondary)', fontSize: '14px'}}>{message}</p>
                                <Link to="/login" className="btn btn-primary btn-full btn-lg">
                                    🔑 Go to Login
                                </Link>
                            </>
                        )}

                        {status === 'error' && (
                            <>
                                <div style={{fontSize: '56px'}}>😕</div>
                                <p style={{color: 'var(--text-secondary)', fontSize: '14px'}}>{message}</p>
                                <div style={{display: 'flex', gap: '12px', width: '100%'}}>
                                    <Link to="/register" className="btn btn-ghost btn-full">
                                        Register Again
                                    </Link>
                                    <Link to="/login" className="btn btn-primary btn-full">
                                        🔑 Login
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailPage;