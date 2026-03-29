import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EmployerLogin = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to main login page
        navigate('/login');
    }, [navigate]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#f5f5f5'
        }}>
            <div style={{ textAlign: 'center' }}>
                <h2>Redirecting to login...</h2>
                <p style={{ color: '#666' }}>Please use the main login page for all users.</p>
            </div>
        </div>
    );
};

export default EmployerLogin;
