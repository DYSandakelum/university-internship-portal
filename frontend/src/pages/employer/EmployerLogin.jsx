import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EmployerLogin = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/login');
    }, [navigate]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#F5F0E8',
            fontFamily: 'Inter, sans-serif'
        }}>
            <div style={{
                background: '#ffffff',
                border: '1px solid #E7E2D9',
                borderRadius: '16px',
                padding: '48px',
                textAlign: 'center',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
            }}>
                <div style={{
                    width: '48px', height: '48px', background: '#F59E0B',
                    borderRadius: '12px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '24px', margin: '0 auto 16px'
                }}>🎓</div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1C1917', margin: '0 0 8px' }}>
                    Redirecting to login...
                </h2>
                <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>
                    Please use the main login page for all users.
                </p>
            </div>
        </div>
    );
};

export default EmployerLogin;