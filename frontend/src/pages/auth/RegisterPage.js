import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', confirmPassword: '', role: 'student'
    });
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [devVerificationUrl, setDevVerificationUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setDevVerificationUrl('');

        const universityEmailRegex = /^it\d{8}@my\.sliit\.lk$/;
        if (formData.role === 'student' && !universityEmailRegex.test(formData.email)) {
            return setError('Please use your university email (format: it12345678@my.sliit.lk)');
        }
        if (formData.role === 'employer' && universityEmailRegex.test(formData.email)) {
            return setError('Employers cannot register with a university email.');
        }
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }
        if (formData.password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        setLoading(true);
        try {
            const response = await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });

            // Show appropriate message based on email delivery and available fallback
            if (response.emailSent) {
                setSuccessMsg('✅ Registration successful! Check your email to verify your account.');
                setTimeout(() => navigate('/login'), 3000);
            } else if (response.devVerificationUrl) {
                // Email not sent, but show dev verification URL
                setSuccessMsg('Registration successful! Verification link is ready below.');
                setDevVerificationUrl(response.devVerificationUrl);
            } else {
                setSuccessMsg('Registration successful! Please contact support to verify your email.');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <Navbar />
            <div className="main-content-sm">
                <div className="auth-card">
                    <div className="auth-card-header">
                        <h1 className="auth-card-title">Create Account</h1>
                        <p className="auth-card-subtitle">Join the University Internship Portal</p>
                    </div>
                    <div className="auth-card-body">
                        {error && <div className="alert alert-error">⚠️ {error}</div>}
                        {successMsg && (
                            <div className="alert alert-success">
                                ✅ {successMsg}
                                {devVerificationUrl && (
                                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                                        <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
                                            Click the link below to verify your email (expires in 24h):
                                        </p>
                                        <a 
                                            href={devVerificationUrl} 
                                            style={{ 
                                                color: '#fff',
                                                textDecoration: 'underline',
                                                wordBreak: 'break-all',
                                                fontSize: '13px'
                                            }}
                                        >
                                            {devVerificationUrl}
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input type="text" name="name" value={formData.name}
                                    onChange={handleChange} placeholder="Enter your full name"
                                    className="form-input" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">I am a</label>
                                <select name="role" value={formData.role}
                                    onChange={handleChange} className="form-input">
                                    <option value="student">Student</option>
                                    <option value="employer">Employer</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input type="email" name="email" value={formData.email}
                                    onChange={handleChange}
                                    placeholder={formData.role === 'student' ? 'it12345678@my.sliit.lk' : 'Enter your company email'}
                                    className="form-input" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input type="password" name="password" value={formData.password}
                                    onChange={handleChange} placeholder="Minimum 6 characters"
                                    className="form-input" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Confirm Password</label>
                                <input type="password" name="confirmPassword" value={formData.confirmPassword}
                                    onChange={handleChange} placeholder="Re-enter your password"
                                    className="form-input" required />
                            </div>
                            <button type="submit"
                                className={`btn btn-full btn-lg ${loading ? 'btn-disabled' : 'btn-primary'}`}
                                disabled={loading}>
                                {loading ? 'Creating Account...' : 'Create Account →'}
                            </button>
                        </form>

                        <p className="auth-footer">
                            Already have an account?{' '}
                            <Link to="/login" className="auth-link">Login here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;