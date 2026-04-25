import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [demoLoading, setDemoLoading] = useState(false);

    const { login, demoLogin } = useAuth();
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
            if (data.user.role === 'employer') {
                localStorage.setItem('employerToken', data.token);
                localStorage.setItem('employerData', JSON.stringify(data.user));
            }
            if (data.user.role === 'student') navigate('/student/dashboard');
            else if (data.user.role === 'employer') navigate('/employer/dashboard');
            else if (data.user.role === 'admin') navigate('/admin/dashboard');
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = async () => {
        setError('');
        setDemoLoading(true);
        try {
            const data = await demoLogin();
            if (data.user.role === 'student') navigate('/student/dashboard');
            else if (data.user.role === 'employer') navigate('/employer/dashboard');
            else if (data.user.role === 'admin') navigate('/admin/dashboard');
        } catch (error) {
            setError(error.response?.data?.message || 'Demo login failed. Please try again.');
        } finally {
            setDemoLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-wrapper">
                <div className="auth-card">
                    <div className="auth-card-inner">
                        {/* Logo */}
                        <div className="auth-logo">
                            <div className="auth-logo-icon">🎓</div>
                            <span className="auth-logo-text">InternHub</span>
                        </div>

                        <div>
                            <h1 className="auth-card-title">Welcome back</h1>
                            <p className="auth-card-subtitle">Sign in to your account to continue</p>
                        </div>

                        {error && <div className="alert alert-error">⚠️ {error}</div>}

                        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '14px'}}>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input type="email" name="email" value={formData.email}
                                    onChange={handleChange} placeholder="you@university.edu"
                                    className="form-input" required />
                            </div>
                            <div className="form-group">
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <label className="form-label">Password</label>
                                </div>
                                <input type="password" name="password" value={formData.password}
                                    onChange={handleChange} placeholder="••••••••"
                                    className="form-input" required />
                            </div>
                            <button type="submit"
                                className={`btn btn-full btn-lg ${loading ? 'btn-disabled' : 'btn-amber'}`}
                                style={{marginTop: '4px'}}
                                disabled={loading}>
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>

                            <button
                                type="button"
                                className="btn btn-full btn-lg btn-secondary"
                                onClick={handleDemoLogin}
                                disabled={demoLoading || loading}
                            >
                                {demoLoading ? 'Starting demo...' : 'Demo Login'}
                            </button>
                        </form>

                        <p className="auth-footer">
                            Don't have an account?{' '}
                            <Link to="/register" className="auth-link">Create one</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;