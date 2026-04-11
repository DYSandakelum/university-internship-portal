import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const StudentProfilePage = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [cv, setCv] = useState(null);
    const [formData, setFormData] = useState({
        phone: '', faculty: '', department: '', year: '',
        gpa: '', skills: '', bio: '', linkedIn: '', github: '', availability: ''
    });

    useEffect(() => { fetchProfile(); }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/student/profile');
            if (res.data.profile) {
                setProfile(res.data.profile);
                const p = res.data.profile;
                setFormData({
                    phone: p.phone || '', faculty: p.faculty || '',
                    department: p.department || '', year: p.year || '',
                    gpa: p.gpa || '', skills: p.skills ? p.skills.join(', ') : '',
                    bio: p.bio || '', linkedIn: p.linkedIn || '',
                    github: p.github || '', availability: p.availability || ''
                });
            }
        } catch (error) {
            setError('Failed to load profile.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess(''); setSubmitting(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            if (cv) data.append('cv', cv);
            const res = await api.post('/student/profile', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setProfile(res.data.profile);
            setSuccess('Profile updated successfully!');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update profile.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="page-wrapper">
            <Navbar />
            <div className="loading-wrapper">
                <div className="spinner"></div>
                <p>Loading profile...</p>
            </div>
        </div>
    );

    return (
        <div className="page-wrapper">
            <Navbar />

            {/* Page Header */}
            <div style={styles.pageHeader}>
                <div style={styles.pageHeaderInner}>
                    <div>
                        <h1 style={styles.pageTitle}>My Profile</h1>
                        <p style={styles.pageSubtitle}>Keep your profile updated for better internship matches</p>
                    </div>
                    {profile && <div style={styles.completeBadge}>✅ Profile Complete</div>}
                </div>
            </div>

            <div className="main-content">
                {error && <div className="alert alert-error">⚠️ {error}</div>}
                {success && <div className="alert alert-success">✅ {success}</div>}

                <form onSubmit={handleSubmit} className="grid-2" style={{alignItems: 'start', gap: '24px'}}>

                    {/* Left Column */}
                    <div style={styles.col}>

                        {/* Personal Info */}
                        <div style={styles.section}>
                            <h2 style={styles.sectionTitle}>Personal Information</h2>
                            <div style={styles.sectionBody}>
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input type="text" value={user?.name} className="form-input" disabled />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input type="text" value={user?.email} className="form-input" disabled />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <input type="text" name="phone" value={formData.phone}
                                        onChange={handleChange} placeholder="Enter your phone number"
                                        className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Bio</label>
                                    <textarea name="bio" value={formData.bio}
                                        onChange={handleChange}
                                        placeholder="Write a short bio about yourself..."
                                        className="form-textarea" rows={4} />
                                </div>
                            </div>
                        </div>

                        {/* Academic Info */}
                        <div style={styles.section}>
                            <h2 style={styles.sectionTitle}>Academic Information</h2>
                            <div style={styles.sectionBody}>
                                <div className="form-group">
                                    <label className="form-label">Faculty</label>
                                    <input type="text" name="faculty" value={formData.faculty}
                                        onChange={handleChange} placeholder="e.g. Faculty of Computing"
                                        className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Department</label>
                                    <input type="text" name="department" value={formData.department}
                                        onChange={handleChange} placeholder="e.g. Software Engineering"
                                        className="form-input" />
                                </div>
                                <div className="grid-2" style={{gap: '16px'}}>
                                    <div className="form-group">
                                        <label className="form-label">Year</label>
                                        <select name="year" value={formData.year}
                                            onChange={handleChange} className="form-input">
                                            <option value="">Select Year</option>
                                            <option value="1st Year">1st Year</option>
                                            <option value="2nd Year">2nd Year</option>
                                            <option value="3rd Year">3rd Year</option>
                                            <option value="4th Year">4th Year</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">GPA</label>
                                        <input type="number" name="gpa" value={formData.gpa}
                                            onChange={handleChange} placeholder="e.g. 3.5"
                                            className="form-input" min="0" max="4" step="0.01" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div style={styles.col}>

                        {/* Skills */}
                        <div style={styles.section}>
                            <h2 style={styles.sectionTitle}>Skills & Availability</h2>
                            <div style={styles.sectionBody}>
                                <div className="form-group">
                                    <label className="form-label">Skills</label>
                                    <p className="form-hint">Separate with commas</p>
                                    <textarea name="skills" value={formData.skills}
                                        onChange={handleChange}
                                        placeholder="e.g. React, Node.js, Python, MongoDB"
                                        className="form-textarea" rows={3} />
                                </div>
                                {formData.skills && (
                                    <div style={styles.skillsRow}>
                                        {formData.skills.split(',').map((s, i) =>
                                            s.trim() && <span key={i} className="skill-badge">{s.trim()}</span>
                                        )}
                                    </div>
                                )}
                                <div className="form-group">
                                    <label className="form-label">Availability</label>
                                    <select name="availability" value={formData.availability}
                                        onChange={handleChange} className="form-input">
                                        <option value="">Select Availability</option>
                                        <option value="Immediately">Immediately</option>
                                        <option value="1 Month">1 Month</option>
                                        <option value="2 Months">2 Months</option>
                                        <option value="3 Months">3 Months</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Links */}
                        <div style={styles.section}>
                            <h2 style={styles.sectionTitle}>Links</h2>
                            <div style={styles.sectionBody}>
                                <div className="form-group">
                                    <label className="form-label">LinkedIn Profile</label>
                                    <input type="url" name="linkedIn" value={formData.linkedIn}
                                        onChange={handleChange}
                                        placeholder="https://linkedin.com/in/yourprofile"
                                        className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">GitHub Profile</label>
                                    <input type="url" name="github" value={formData.github}
                                        onChange={handleChange}
                                        placeholder="https://github.com/yourusername"
                                        className="form-input" />
                                </div>
                            </div>
                        </div>

                        {/* CV Upload */}
                        <div style={styles.section}>
                            <h2 style={styles.sectionTitle}>CV Upload</h2>
                            <div style={styles.sectionBody}>
                                {profile?.cv && (
                                    <div style={styles.currentCV}>📄 Current CV: {profile.cv}</div>
                                )}
                                <div className="upload-area">
                                    <input type="file" accept=".pdf,.doc,.docx"
                                        onChange={(e) => setCv(e.target.files[0])}
                                        style={{display: 'none'}} id="cv" />
                                    <label htmlFor="cv" className="upload-label">
                                        {cv ? (
                                            <span style={{color: '#16a34a'}}>✅ {cv.name}</span>
                                        ) : (
                                            <span>📎 Click to upload your CV</span>
                                        )}
                                    </label>
                                </div>
                                <p className="form-hint">PDF, DOC, DOCX — Max 5MB</p>
                            </div>
                        </div>

                        <button type="submit"
                            className={`btn btn-full btn-lg ${submitting ? 'btn-disabled' : 'btn-amber'}`}
                            disabled={submitting}>
                            {submitting ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    pageHeader: { background: '#ffffff', borderBottom: '1px solid #E7E2D9', padding: '32px 0' },
    pageHeaderInner: { maxWidth: '1280px', margin: '0 auto', padding: '0 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    pageTitle: { fontSize: '28px', fontWeight: '800', color: '#1C1917', letterSpacing: '-0.5px' },
    pageSubtitle: { fontSize: '14px', color: '#6B7280', marginTop: '4px' },
    completeBadge: { background: '#FEF3C7', color: '#D97706', padding: '8px 20px', borderRadius: '9999px', fontSize: '13px', fontWeight: '600' },
    col: { display: 'flex', flexDirection: 'column', gap: '24px' },
    section: { background: '#ffffff', border: '1px solid #E7E2D9', borderRadius: '16px', overflow: 'hidden' },
    sectionTitle: { fontSize: '15px', fontWeight: '700', color: '#1C1917', padding: '16px 24px', borderBottom: '1px solid #E7E2D9', margin: 0 },
    sectionBody: { padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' },
    skillsRow: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
    currentCV: { background: '#f0fdf4', color: '#16a34a', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', border: '1px solid #bbf7d0' }
};

export default StudentProfilePage;