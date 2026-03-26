import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const EmployerProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        companyAddress: '',
        companyDescription: ''
    });
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchProfile(token);
    }, [navigate]);

    const fetchProfile = async (tokenValue) => {
        const token = tokenValue || localStorage.getItem('token');
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/employer/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to load profile.');
            const employerProfile = data.employer || data.profile || data;
            setProfile(employerProfile);
            setFormData({
                companyName: employerProfile.companyName || '',
                email: employerProfile.email || '',
                companyAddress: employerProfile.companyAddress || '',
                companyDescription: employerProfile.companyDescription || ''
            });
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Unable to fetch profile.' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            const response = await fetch('http://localhost:5000/api/employer/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to update profile.');
            setProfile({ ...profile, ...formData });
            setMessage({ type: 'success', text: 'Profile updated successfully.' });
            setEditing(false);
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Unable to update profile.' });
        } finally {
            setSaving(false);
        }
    };

    const isVerified = Boolean(profile?.isVerified || profile?.verified);

    if (loading) {
        return (
            <div className="page-wrapper">
                <nav className="navbar">
                    <div className="navbar-brand">🎓 Internship Portal</div>
                </nav>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <nav className="navbar">
                <div className="navbar-brand">🎓 Internship Portal</div>
                <div className="navbar-links">
                    <Link to="/employer/dashboard" className="nav-link">Dashboard</Link>
                    <Link to="/employer/my-jobs" className="nav-link">My Jobs</Link>
                    <Link to="/employer/applications" className="nav-link">Applications</Link>
                </div>
            </nav>
            <div className="main-content" style={{ maxWidth: '860px' }}>
                <div className="card">
                    <div className="card-header" style={{ justifyContent: 'space-between', background: 'linear-gradient(135deg, #7C3AED 0%, #6366f1 100%)' }}>
                        <h2 className="card-title">🏢 Employer Profile</h2>
                        <span className={isVerified ? 'badge badge-success' : 'badge badge-warning'}>
                            {isVerified ? '✅ Verified' : '⏳ Pending Approval'}
                        </span>
                    </div>
                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {message.text && (
                            <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                                {message.type === 'success' ? '✅' : '⚠️'} {message.text}
                            </div>
                        )}
                        <div className="form-group">
                            <label className="form-label">Company Name</label>
                            <input className="form-input" name="companyName" value={formData.companyName} onChange={handleChange} disabled={!editing} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input className="form-input" name="email" value={formData.email} onChange={handleChange} disabled={!editing} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Address</label>
                            <input className="form-input" name="companyAddress" value={formData.companyAddress} onChange={handleChange} disabled={!editing} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea className="form-textarea" name="companyDescription" value={formData.companyDescription} onChange={handleChange} disabled={!editing} rows="4" />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {!editing ? (
                                <button className="btn btn-primary" onClick={() => setEditing(true)} style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6366f1 100%)' }}>
                                    Edit Profile
                                </button>
                            ) : (
                                <>
                                    <button className={`btn ${saving ? 'btn-disabled' : 'btn-primary'}`} onClick={handleSave} disabled={saving} style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6366f1 100%)' }}>
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployerProfile;