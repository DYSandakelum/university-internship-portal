import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const EmployerProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({
        companyName: '', email: '', companyAddress: '', companyDescription: ''
    });
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [fieldErrors, setFieldErrors] = useState({});

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
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validateProfile = () => {
        const newErrors = {};
        if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
        if (!formData.companyAddress.trim()) newErrors.companyAddress = 'Company address is required';
        if (!formData.companyDescription.trim()) newErrors.companyDescription = 'Company description is required';
        return newErrors;
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        const newErrors = validateProfile();
        if (Object.keys(newErrors).length > 0) {
            setFieldErrors(newErrors);
            setMessage({ type: 'error', text: 'Please fill all required fields!' });
            return;
        }
        setFieldErrors({});
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            const response = await fetch('http://localhost:5000/api/employer/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
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

    const handleCancelEdit = () => {
        setEditing(false);
        setFieldErrors({});
        setMessage({ type: '', text: '' });
        if (profile) {
            setFormData({
                companyName: profile.companyName || '',
                email: profile.email || '',
                companyAddress: profile.companyAddress || '',
                companyDescription: profile.companyDescription || ''
            });
        }
    };

    const isVerified = Boolean(profile?.isVerified);

    if (loading) return (
        <div className="page-wrapper">
            <nav className="navbar">
                <Link to="/" className="navbar-brand">
                    <div className="navbar-brand-icon">🎓</div>
                    InternHub
                </Link>
            </nav>
            <div className="loading-wrapper">
                <div className="spinner"></div>
                <p>Loading profile...</p>
            </div>
        </div>
    );

    return (
        <div className="page-wrapper">
            <nav className="navbar">
                <Link to="/" className="navbar-brand">
                    <div className="navbar-brand-icon">🎓</div>
                    InternHub
                </Link>
                <div className="navbar-links">
                    <Link to="/employer/dashboard" className="nav-link">Dashboard</Link>
                    <Link to="/employer/my-jobs" className="nav-link">My Jobs</Link>
                    <Link to="/employer/applications" className="nav-link">Applications</Link>
                </div>
            </nav>

            {/* Page Header */}
            <div style={styles.pageHeader}>
                <div style={styles.pageHeaderInner}>
                    <div style={styles.companyAvatar}>
                        {formData.companyName?.[0] || '🏢'}
                    </div>
                    <div style={{ flex: 1 }}>
                        <h1 style={styles.pageTitle}>{formData.companyName || 'Your Company'}</h1>
                        <p style={styles.pageSubtitle}>{formData.email}</p>
                        <p style={styles.pageSubtitle}>📍 {formData.companyAddress || 'No address added'}</p>
                    </div>
                    <div style={{
                        background: isVerified ? '#f0fdf4' : '#FEF3C7',
                        color: isVerified ? '#16a34a' : '#D97706',
                        border: `1px solid ${isVerified ? '#bbf7d0' : '#FCD34D'}`,
                        padding: '6px 16px',
                        borderRadius: '9999px',
                        fontSize: '13px',
                        fontWeight: '600'
                    }}>
                        {isVerified ? '✅ Verified' : '⏳ Pending Approval'}
                    </div>
                </div>
            </div>

            <div className="main-content" style={{ maxWidth: '800px' }}>

                {message.text && (
                    <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                        {message.type === 'success' ? '✅' : '⚠️'} {message.text}
                    </div>
                )}

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Company Details</h2>
                    <div style={styles.sectionBody}>

                        <div className="form-group">
                            <label className="form-label">🏢 Company Name <span style={{ color: '#ef4444' }}>*</span></label>
                            {editing ? (
                                <>
                                    <input className="form-input" name="companyName" value={formData.companyName}
                                        onChange={handleChange} placeholder="Enter company name"
                                        style={{ borderColor: fieldErrors.companyName ? '#ef4444' : '' }} />
                                    {fieldErrors.companyName && <p style={styles.fieldError}>⚠️ {fieldErrors.companyName}</p>}
                                </>
                            ) : (
                                <p style={styles.readValue}>{formData.companyName || 'Not provided'}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">✉️ Email Address</label>
                            <p style={styles.readValue}>{formData.email || 'Not provided'}</p>
                        </div>

                        <div className="form-group">
                            <label className="form-label">📍 Company Address <span style={{ color: '#ef4444' }}>*</span></label>
                            {editing ? (
                                <>
                                    <input className="form-input" name="companyAddress" value={formData.companyAddress}
                                        onChange={handleChange} placeholder="Enter company address"
                                        style={{ borderColor: fieldErrors.companyAddress ? '#ef4444' : '' }} />
                                    {fieldErrors.companyAddress && <p style={styles.fieldError}>⚠️ {fieldErrors.companyAddress}</p>}
                                </>
                            ) : (
                                <p style={styles.readValue}>{formData.companyAddress || 'Not provided'}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">📝 Company Description <span style={{ color: '#ef4444' }}>*</span></label>
                            {editing ? (
                                <>
                                    <textarea className="form-textarea" name="companyDescription" value={formData.companyDescription}
                                        onChange={handleChange} rows="4" placeholder="Describe your company..."
                                        style={{ borderColor: fieldErrors.companyDescription ? '#ef4444' : '' }} />
                                    {fieldErrors.companyDescription && <p style={styles.fieldError}>⚠️ {fieldErrors.companyDescription}</p>}
                                </>
                            ) : (
                                <p style={{ ...styles.readValue, lineHeight: '1.6' }}>{formData.companyDescription || 'No description added'}</p>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            {!editing ? (
                                <button onClick={() => setEditing(true)} className="btn btn-amber">
                                    ✏️ Edit Profile
                                </button>
                            ) : (
                                <>
                                    <button onClick={handleSave} disabled={saving}
                                        className={`btn ${saving ? 'btn-disabled' : 'btn-amber'}`}>
                                        {saving ? 'Saving...' : '💾 Save Changes'}
                                    </button>
                                    <button onClick={handleCancelEdit} className="btn btn-gray">
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    pageHeader: { background: '#ffffff', borderBottom: '1px solid #E7E2D9', padding: '32px 0' },
    pageHeaderInner: { maxWidth: '1280px', margin: '0 auto', padding: '0 48px', display: 'flex', alignItems: 'center', gap: '20px' },
    companyAvatar: { width: '64px', height: '64px', background: '#FEF3C7', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '800', color: '#D97706', flexShrink: 0 },
    pageTitle: { fontSize: '24px', fontWeight: '800', color: '#1C1917', letterSpacing: '-0.3px', margin: 0 },
    pageSubtitle: { fontSize: '14px', color: '#6B7280', marginTop: '2px' },
    section: { background: '#ffffff', border: '1px solid #E7E2D9', borderRadius: '16px', overflow: 'hidden' },
    sectionTitle: { fontSize: '15px', fontWeight: '700', color: '#1C1917', padding: '16px 24px', borderBottom: '1px solid #E7E2D9', margin: 0 },
    sectionBody: { padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' },
    readValue: { margin: 0, fontSize: '14px', color: '#1C1917', padding: '10px 14px', background: '#F5F0E8', borderRadius: '8px', border: '1px solid #E7E2D9' },
    fieldError: { color: '#ef4444', fontSize: '13px', margin: '4px 0 0' }
};

export default EmployerProfile;