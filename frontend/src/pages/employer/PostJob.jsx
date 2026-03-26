import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PostJob = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        salaryRange: '',
        location: '',
        deadline: '',
        jobType: 'Full-time'
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to post job.');
            setMessage({ type: 'success', text: 'Job posted successfully!' });
            setFormData({
                title: '',
                description: '',
                requirements: '',
                salaryRange: '',
                location: '',
                deadline: '',
                jobType: 'Full-time'
            });
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Something went wrong.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper">
            <nav className="navbar">
                <div className="navbar-brand">🎓 Internship Portal</div>
                <div className="navbar-links">
                    <Link to="/employer/dashboard" className="nav-link">Dashboard</Link>
                    <Link to="/employer/my-jobs" className="nav-link">My Jobs</Link>
                    <Link to="/employer/profile" className="nav-link">Profile</Link>
                </div>
            </nav>
            <div className="main-content" style={{ maxWidth: '900px' }}>
                <button className="back-btn" onClick={() => navigate('/employer/dashboard')}>← Back to Dashboard</button>
                <div className="card">
                    <div className="card-header" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6366f1 100%)' }}>
                        <h2 className="card-title">✍️ Post a New Job</h2>
                    </div>
                    <div className="card-body">
                        {message.text && (
                            <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '16px' }}>
                                {message.type === 'success' ? '✅' : '⚠️'} {message.text}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="form-group">
                                <label className="form-label">Job Title</label>
                                <input type="text" name="title" value={formData.title} onChange={handleChange} className="form-input" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Job Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} className="form-textarea" rows="4" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Requirements</label>
                                <textarea name="requirements" value={formData.requirements} onChange={handleChange} className="form-textarea" rows="4" required />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label">Salary Range</label>
                                    <input type="text" name="salaryRange" value={formData.salaryRange} onChange={handleChange} className="form-input" placeholder="e.g. $500 - $1000" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Location</label>
                                    <input type="text" name="location" value={formData.location} onChange={handleChange} className="form-input" placeholder="e.g. Colombo" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Deadline</label>
                                    <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="form-input" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Job Type</label>
                                    <select name="jobType" value={formData.jobType} onChange={handleChange} className="form-input">
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Remote">Remote</option>
                                        <option value="Internship">Internship</option>
                                    </select>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className={`btn btn-lg ${loading ? 'btn-disabled' : 'btn-primary'}`}
                                style={!loading ? { background: 'linear-gradient(135deg, #7C3AED 0%, #6366f1 100%)' } : undefined}
                                disabled={loading}
                            >
                                {loading ? 'Posting...' : '✍️ Submit Job'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostJob;