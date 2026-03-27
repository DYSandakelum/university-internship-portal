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
        if (!token) { navigate('/login'); return; }
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
            const emp = data.employer || data;
            setProfile(emp);
            setFormData({
                companyName: emp.companyName || '',
                email: emp.email || '',
                companyAddress: emp.companyAddress || '',
                companyDescription: emp.companyDescription || ''
            });
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
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
            if (!response.ok) throw new Error(data.message || 'Failed to update.');
            setProfile({ ...profile, ...formData });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setEditing(false);
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setSaving(false);
        }
    };

    const isVerified = Boolean(profile?.isVerified);

    if (loading) {
        return (
            <div className="page-wrapper">
                <nav className="navbar">
                    <div className="navbar-brand">🎓 Internship Portal</div>
                </nav>
                <div style={{ textAlign: 'center', padding: '80px' }}>
                    <p style={{ fontSize: '18px', color: '#7C3AED' }}>Loading profile...</p>
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

            <div className="main-content" style={{ maxWidth: '800px' }}>

                {/* Profile Header Card */}
                <div style={{
                    background: 'linear-gradient(135deg, #7C3AED 0%, #6366f1 100%)',
                    borderRadius: '16px',
                    padding: '32px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px'
                }}>
                    {/* Avatar */}
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '36px',
                        flexShrink: 0
                    }}>
                        🏢
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1 }}>
                        <h1 style={{ color: 'white', margin: 0, fontSize: '24px', fontWeight: '700' }}>
                            {formData.companyName || profile?.name || 'Your Company'}
                        </h1>
                        <p style={{ color: '#e0d7ff', margin: '4px 0 0', fontSize: '14px' }}>
                            {formData.email}
                        </p>
                        <p style={{ color: '#e0d7ff', margin: '4px 0 0', fontSize: '14px' }}>
                            📍 {formData.companyAddress || 'No address added'}
                        </p>
                    </div>
                    {/* Badge */}
                    <div style={{
                        background: isVerified ? '#10b981' : '#f59e0b',
                        color: 'white',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '600',
                        flexShrink: 0
                    }}>
                        {isVerified ? '✅ Verified' : '⏳ Pending Approval'}
                    </div>
                </div>

                {/* Messages */}
                {message.text && (
                    <div style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        background: message.type === 'success' ? '#d1fae5' : '#fee2e2',
                        color: message.type === 'success' ? '#065f46' : '#991b1b',
                        fontSize: '14px'
                    }}>
                        {message.type === 'success' ? '✅' : '⚠️'} {message.text}
                    </div>
                )}

                {/* Details Card */}
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ color: '#1e1b4b', fontSize: '18px', marginBottom: '20px', marginTop: 0 }}>
                        Company Details
                    </h2>

                    {/* Company Name */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#7C3AED', display: 'block', marginBottom: '6px' }}>
                            🏢 COMPANY NAME
                        </label>
                        {editing ? (
                            <input className="form-input" name="companyName" value={formData.companyName} onChange={handleChange} />
                        ) : (
                            <p style={{ margin: 0, fontSize: '16px', color: '#1e1b4b', padding: '10px', background: '#f9fafb', borderRadius: '8px' }}>
                                {formData.companyName || 'Not provided'}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#7C3AED', display: 'block', marginBottom: '6px' }}>
                            ✉️ EMAIL ADDRESS
                        </label>
                        <p style={{ margin: 0, fontSize: '16px', color: '#1e1b4b', padding: '10px', background: '#f9fafb', borderRadius: '8px' }}>
                            {formData.email || 'Not provided'}
                        </p>
                    </div>

                    {/* Address */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#7C3AED', display: 'block', marginBottom: '6px' }}>
                            📍 COMPANY ADDRESS
                        </label>
                        {editing ? (
                            <input className="form-input" name="companyAddress" value={formData.companyAddress} onChange={handleChange} />
                        ) : (
                            <p style={{ margin: 0, fontSize: '16px', color: '#1e1b4b', padding: '10px', background: '#f9fafb', borderRadius: '8px' }}>
                                {formData.companyAddress || 'Not provided'}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#7C3AED', display: 'block', marginBottom: '6px' }}>
                            📝 COMPANY DESCRIPTION
                        </label>
                        {editing ? (
                            <textarea className="form-textarea" name="companyDescription" value={formData.companyDescription} onChange={handleChange} rows="4" />
                        ) : (
                            <p style={{ margin: 0, fontSize: '16px', color: '#1e1b4b', padding: '10px', background: '#f9fafb', borderRadius: '8px', lineHeight: '1.6' }}>
                                {formData.companyDescription || 'No description added'}
                            </p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {!editing ? (
                            <button
                                onClick={() => setEditing(true)}
                                style={{
                                    background: 'linear-gradient(135deg, #7C3AED 0%, #6366f1 100%)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 24px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '15px',
                                    fontWeight: '600'
                                }}
                            >
                                ✏️ Edit Profile
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    style={{
                                        background: saving ? '#9ca3af' : 'linear-gradient(135deg, #7C3AED 0%, #6366f1 100%)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '10px 24px',
                                        borderRadius: '8px',
                                        cursor: saving ? 'not-allowed' : 'pointer',
                                        fontSize: '15px',
                                        fontWeight: '600'
                                    }}
                                >
                                    {saving ? 'Saving...' : '💾 Save Changes'}
                                </button>
                                <button
                                    onClick={() => setEditing(false)}
                                    style={{
                                        background: '#f3f4f6',
                                        color: '#374151',
                                        border: 'none',
                                        padding: '10px 24px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '15px',
                                        fontWeight: '600'
                                    }}
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployerProfile;
