import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

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
            
            // If employer, also store employer-specific tokens
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
            <Navbar />
            <div className="main-content-sm">
                <div className="auth-card">
                    <div className="auth-card-header">
                        <h1 className="auth-card-title">Welcome Back</h1>
                        <p className="auth-card-subtitle">Login to your account to continue</p>
                    </div>
                    <div className="auth-card-body">
                        {error && <div className="alert alert-error">⚠️ {error}</div>}

                        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input type="email" name="email" value={formData.email}
                                    onChange={handleChange} placeholder="Enter your email"
                                    className="form-input" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input type="password" name="password" value={formData.password}
                                    onChange={handleChange} placeholder="Enter your password"
                                    className="form-input" required />
                            </div>
                            <button type="submit"
                                className={`btn btn-full btn-lg ${loading ? 'btn-disabled' : 'btn-primary'}`}
                                disabled={loading}>
                                {loading ? 'Logging in...' : 'Login →'}
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
                            <Link to="/register" className="auth-link">Register here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;