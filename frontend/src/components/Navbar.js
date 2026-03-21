import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={styles.navbar}>
            <div style={styles.navBrand}>🎓 Internship Portal</div>
            <div style={styles.navLinks}>
                {user ? (
                    <>
                        {user.role === 'student' && (
                            <>
                                <Link to="/student/dashboard" style={styles.navLink}>Dashboard</Link>
                                <Link to="/student/applications" style={styles.navLink}>My Applications</Link>
                                <Link to="/student/profile" style={styles.navLink}>Profile</Link>
                                <Link to="/student/cv-generator" style={styles.navLink}>CV Generator</Link>
                            </>
                        )}
                        {user.role === 'employer' && (
                            <>
                                <Link to="/employer/dashboard" style={styles.navLink}>Dashboard</Link>
                            </>
                        )}
                        {user.role === 'admin' && (
                            <>
                                <Link to="/admin/dashboard" style={styles.navLink}>Dashboard</Link>
                            </>
                        )}
                        <span style={styles.userName}>👤 {user.name}</span>
                        <button onClick={handleLogout} style={styles.logoutButton}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/" style={styles.navLink}>Home</Link>
                        <Link to="/login" style={styles.navLink}>Login</Link>
                        <Link to="/register" style={styles.navLink}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

const styles = {
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
    userName: {
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: '600'
    },
    logoutButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        color: '#ffffff',
        border: '1px solid rgba(255,255,255,0.4)',
        padding: '6px 16px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer'
    }
};

export default Navbar;