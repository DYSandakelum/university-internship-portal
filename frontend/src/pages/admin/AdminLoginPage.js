import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Navbar from '../../components/Navbar';

const AdminLoginPage = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { logout } = useAuth();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await api.post('/admin/login', formData);
            const data = res.data;

            localStorage.setItem('token', data.token);
            if (data.user.role !== 'admin') {
                logout();
                setError('This portal is only for admin users.');
                return;
            }

            window.location.href = '/admin/dashboard';
        } catch (err) {
            setError(err.response?.data?.message || 'Admin login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <Navbar />
            <div className="main-content-sm">
                <div className="auth-card">
                    <div className="auth-card-header" style={{ background: 'linear-gradient(135deg, #0f766e 0%, #0e7490 100%)' }}>
                        <h1 className="auth-card-title">Admin Portal Login</h1>
                        <p className="auth-card-subtitle">Sign in to manage companies and platform data</p>
                    </div>
                    <div className="auth-card-body">
                        {error && <div className="alert alert-error">{error}</div>}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="form-group">
                                <label className="form-label">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Enter admin username"
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter password"
                                    className="form-input"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className={`btn btn-full btn-lg ${loading ? 'btn-disabled' : 'btn-primary'}`}
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Login as Admin'}
                            </button>
                        </form>

                        <p className="auth-footer" style={{ marginTop: '18px' }}>
                            Student or employer? <Link to="/login" className="auth-link">Use regular login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
