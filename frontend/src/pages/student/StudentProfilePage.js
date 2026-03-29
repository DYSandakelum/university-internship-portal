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

            {/* Page Banner */}
            <div className="page-banner" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left', padding: '40px 64px'}}>
                <div>
                    <h1 className="page-banner-title">👤 My Profile</h1>
                    <p className="page-banner-subtitle">Keep your profile updated for better internship matches</p>
                </div>
                {profile && (
                    <span style={styles.completeBadge}>✅ Profile Complete</span>
                )}
            </div>

            <div className="main-content">
                {error && <div className="alert alert-error">⚠️ {error}</div>}
                {success && <div className="alert alert-success">✅ {success}</div>}

                <form onSubmit={handleSubmit} className="grid-2" style={{alignItems: 'start'}}>

                    {/* Left Column */}
                    <div style={styles.col}>
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">👤 Personal Information</h2>
                            </div>
                            <div className="card-body" style={styles.cardForm}>
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

                        <div className="card">
                            <div className="card-header card-header-info">
                                <h2 className="card-title">🎓 Academic Information</h2>
                            </div>
                            <div className="card-body" style={styles.cardForm}>
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
                        <div className="card">
                            <div className="card-header card-header-success">
                                <h2 className="card-title">⚡ Skills & Availability</h2>
                            </div>
                            <div className="card-body" style={styles.cardForm}>
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

                        <div className="card">
                            <div className="card-header card-header-warning">
                                <h2 className="card-title">🔗 Links</h2>
                            </div>
                            <div className="card-body" style={styles.cardForm}>
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

                        <div className="card">
                            <div className="card-header card-header-purple">
                                <h2 className="card-title">📄 CV Upload</h2>
                            </div>
                            <div className="card-body" style={styles.cardForm}>
                                {profile?.cv && (
                                    <div style={styles.currentCV}>📄 Current CV: {profile.cv}</div>
                                )}
                                <div className="upload-area">
                                    <input type="file" accept=".pdf,.doc,.docx"
                                        onChange={(e) => setCv(e.target.files[0])}
                                        style={{display: 'none'}} id="cv" />
                                    <label htmlFor="cv" className="upload-label">
                                        {cv ? (
                                            <span style={{color: 'var(--success-dark)'}}>✅ {cv.name}</span>
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
                            {submitting ? 'Saving...' : '💾 Save Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    completeBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff',
        padding: '8px 20px', borderRadius: 'var(--radius-full)', fontSize: '14px', fontWeight: '600'
    },
    col: { display: 'flex', flexDirection: 'column', gap: '24px' },
    cardForm: { display: 'flex', flexDirection: 'column', gap: '16px' },
    skillsRow: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
    currentCV: {
        backgroundColor: '#f0fdf4', color: 'var(--success-dark)',
        padding: '10px 14px', borderRadius: 'var(--radius-sm)',
        fontSize: '13px', fontWeight: '600', border: '1px solid #bbf7d0'
    }
};

export default StudentProfilePage;