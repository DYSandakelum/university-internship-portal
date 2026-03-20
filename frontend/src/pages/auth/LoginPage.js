import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');


        setLoading(true);

        try {
            const data = await login(formData);
            // Redirect based on role
            if (data.user.role === 'student') {
                navigate('/student/dashboard');
            } else if (data.user.role === 'employer') {
                navigate('/employer/dashboard');
            } else if (data.user.role === 'admin') {
                navigate('/admin/dashboard');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            {/* Navbar */}
            <nav style={styles.navbar}>
                <div style={styles.navBrand}>🎓 Internship Portal</div>
                <div style={styles.navLinks}>
                    <Link to="/" style={styles.navLink}>Home</Link>
                    <Link to="/login" style={styles.navLinkActive}>Login</Link>
                    <Link to="/register" style={styles.navLink}>Register</Link>
                </div>
            </nav>

            {/* Main Content */}
            <div style={styles.main}>
                <div style={styles.card}>
                    {/* Card Header */}
                    <div style={styles.cardHeader}>
                        <h1 style={styles.cardTitle}>🔑 Login</h1>
                    </div>

                    {/* Card Body */}
                    <div style={styles.cardBody}>
                        <p style={styles.subtitle}>Welcome back to University Internship Portal</p>

                        {error && <div style={styles.error}>{error}</div>}

                        <form onSubmit={handleSubmit} style={styles.form}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    style={styles.input}
                                    required
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    style={styles.input}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                style={loading ? styles.buttonDisabled : styles.button}
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : '🔑 Login'}
                            </button>
                        </form>

                        <p style={styles.bottomText}>
                            Don't have an account?{' '}
                            <Link to="/register" style={styles.link}>Register here</Link>
                        </p>
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
    navLinkActive: {
        color: '#ffffff',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '700',
        borderBottom: '2px solid #ffffff',
        paddingBottom: '2px'
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
    cardTitle: {
        color: '#ffffff',
        fontSize: '20px',
        fontWeight: '700',
        margin: 0
    },
    cardBody: {
        padding: '24px'
    },
    subtitle: {
        fontSize: '14px',
        color: '#666',
        marginBottom: '20px',
        textAlign: 'center'
    },
    error: {
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '16px',
        fontSize: '14px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },
    label: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#444'
    },
    input: {
        padding: '10px 12px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '14px',
        outline: 'none',
        backgroundColor: '#fafafa'
    },
    button: {
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        color: '#ffffff',
        padding: '12px',
        borderRadius: '8px',
        border: 'none',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '8px'
    },
    buttonDisabled: {
        backgroundColor: '#a5b4fc',
        color: '#ffffff',
        padding: '12px',
        borderRadius: '8px',
        border: 'none',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'not-allowed',
        marginTop: '8px'
    },
    bottomText: {
        textAlign: 'center',
        marginTop: '20px',
        fontSize: '14px',
        color: '#666'
    },
    link: {
        color: '#6366f1',
        textDecoration: 'none',
        fontWeight: '600'
    }
};

export default LoginPage;