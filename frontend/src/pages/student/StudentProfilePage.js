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
        phone: '',
        faculty: '',
        department: '',
        year: '',
        gpa: '',
        skills: '',
        bio: '',
        linkedIn: '',
        github: '',
        availability: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/student/profile');
            if (res.data.profile) {
                setProfile(res.data.profile);
                const p = res.data.profile;
                setFormData({
                    phone: p.phone || '',
                    faculty: p.faculty || '',
                    department: p.department || '',
                    year: p.year || '',
                    gpa: p.gpa || '',
                    skills: p.skills ? p.skills.join(', ') : '',
                    bio: p.bio || '',
                    linkedIn: p.linkedIn || '',
                    github: p.github || '',
                    availability: p.availability || ''
                });
            }
        } catch (error) {
            setError('Failed to load profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });
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
        <div style={styles.container}>
            <Navbar />
            <div style={styles.centerContent}>
                <div style={styles.spinner}></div>
                <p>Loading profile...</p>
            </div>
        </div>
    );

    return (
        <div style={styles.container}>
            <Navbar />
            <div style={styles.main}>
                {/* Header */}
                <div style={styles.headerCard}>
                    <div>
                        <h1 style={styles.headerTitle}>👤 My Profile</h1>
                        <p style={styles.headerSubtitle}>
                            Keep your profile updated to get better internship matches
                        </p>
                    </div>
                    {profile && (
                        <div style={styles.profileCompleteBadge}>
                            ✅ Profile Complete
                        </div>
                    )}
                </div>

                {error && <div style={styles.error}>{error}</div>}
                {success && <div style={styles.success}>{success}</div>}

                <form onSubmit={handleSubmit} style={styles.formGrid}>
                    {/* Left Column */}
                    <div style={styles.leftColumn}>
                        {/* Personal Info */}
                        <div style={styles.card}>
                            <div style={styles.cardHeader}>
                                <h2 style={styles.cardTitle}>👤 Personal Information</h2>
                            </div>
                            <div style={styles.cardBody}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Full Name</label>
                                    <input
                                        type="text"
                                        value={user?.name}
                                        style={styles.inputDisabled}
                                        disabled
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Email</label>
                                    <input
                                        type="text"
                                        value={user?.email}
                                        style={styles.inputDisabled}
                                        disabled
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Phone Number</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter your phone number"
                                        style={styles.input}
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Bio</label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        placeholder="Write a short bio about yourself..."
                                        style={styles.textarea}
                                        rows={4}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Academic Info */}
                        <div style={styles.card}>
                            <div style={{...styles.cardHeader, backgroundColor: '#3b82f6'}}>
                                <h2 style={styles.cardTitle}>🎓 Academic Information</h2>
                            </div>
                            <div style={styles.cardBody}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Faculty</label>
                                    <input
                                        type="text"
                                        name="faculty"
                                        value={formData.faculty}
                                        onChange={handleChange}
                                        placeholder="e.g. Faculty of Computing"
                                        style={styles.input}
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Department</label>
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        placeholder="e.g. Software Engineering"
                                        style={styles.input}
                                    />
                                </div>
                                <div style={styles.row}>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Year</label>
                                        <select
                                            name="year"
                                            value={formData.year}
                                            onChange={handleChange}
                                            style={styles.input}
                                        >
                                            <option value="">Select Year</option>
                                            <option value="1st Year">1st Year</option>
                                            <option value="2nd Year">2nd Year</option>
                                            <option value="3rd Year">3rd Year</option>
                                            <option value="4th Year">4th Year</option>
                                        </select>
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>GPA</label>
                                        <input
                                            type="number"
                                            name="gpa"
                                            value={formData.gpa}
                                            onChange={handleChange}
                                            placeholder="e.g. 3.5"
                                            style={styles.input}
                                            min="0"
                                            max="4"
                                            step="0.01"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div style={styles.rightColumn}>
                        {/* Skills */}
                        <div style={styles.card}>
                            <div style={{...styles.cardHeader, backgroundColor: '#22c55e'}}>
                                <h2 style={styles.cardTitle}>⚡ Skills</h2>
                            </div>
                            <div style={styles.cardBody}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Skills</label>
                                    <p style={styles.hint}>
                                        Enter skills separated by commas
                                    </p>
                                    <textarea
                                        name="skills"
                                        value={formData.skills}
                                        onChange={handleChange}
                                        placeholder="e.g. React, Node.js, Python, MongoDB"
                                        style={styles.textarea}
                                        rows={3}
                                    />
                                </div>
                                {formData.skills && (
                                    <div style={styles.skillsPreview}>
                                        {formData.skills.split(',').map((skill, index) => (
                                            skill.trim() && (
                                                <span key={index} style={styles.skillBadge}>
                                                    {skill.trim()}
                                                </span>
                                            )
                                        ))}
                                    </div>
                                )}
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Availability</label>
                                    <select
                                        name="availability"
                                        value={formData.availability}
                                        onChange={handleChange}
                                        style={styles.input}
                                    >
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
                        <div style={styles.card}>
                            <div style={{...styles.cardHeader, backgroundColor: '#f97316'}}>
                                <h2 style={styles.cardTitle}>🔗 Links</h2>
                            </div>
                            <div style={styles.cardBody}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>LinkedIn Profile</label>
                                    <input
                                        type="url"
                                        name="linkedIn"
                                        value={formData.linkedIn}
                                        onChange={handleChange}
                                        placeholder="https://linkedin.com/in/yourprofile"
                                        style={styles.input}
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>GitHub Profile</label>
                                    <input
                                        type="url"
                                        name="github"
                                        value={formData.github}
                                        onChange={handleChange}
                                        placeholder="https://github.com/yourusername"
                                        style={styles.input}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* CV Upload */}
                        <div style={styles.card}>
                            <div style={{...styles.cardHeader, backgroundColor: '#8b5cf6'}}>
                                <h2 style={styles.cardTitle}>📄 CV Upload</h2>
                            </div>
                            <div style={styles.cardBody}>
                                {profile?.cv && (
                                    <div style={styles.currentCV}>
                                        <span>📄 Current CV: {profile.cv}</span>
                                    </div>
                                )}
                                <div style={styles.uploadArea}>
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => setCv(e.target.files[0])}
                                        style={styles.fileInput}
                                        id="cv"
                                    />
                                    <label htmlFor="cv" style={styles.uploadLabel}>
                                        {cv ? (
                                            <span style={styles.fileName}>
                                                ✅ {cv.name}
                                            </span>
                                        ) : (
                                            <span>📎 Click to upload your CV</span>
                                        )}
                                    </label>
                                </div>
                                <p style={styles.hint}>
                                    Accepted formats: PDF, DOC, DOCX (Max 5MB)
                                </p>
                            </div>
                        </div>

                        {/* Save Button */}
                        <button
                            type="submit"
                            style={submitting ? styles.buttonDisabled : styles.button}
                            disabled={submitting}
                        >
                            {submitting ? 'Saving...' : '💾 Save Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column'
    },
    main: {
        padding: '32px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
    },
    centerContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '40px'
    },
    spinner: {
        width: '48px',
        height: '48px',
        border: '4px solid #e5e7eb',
        borderTop: '4px solid #6366f1',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    },
    // Header
    headerCard: {
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        borderRadius: '12px',
        padding: '24px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
    },
    headerTitle: {
        color: '#ffffff',
        fontSize: '24px',
        fontWeight: '700',
        marginBottom: '8px'
    },
    headerSubtitle: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: '14px'
    },
    profileCompleteBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        color: '#ffffff',
        padding: '8px 20px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '600'
    },
    error: {
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '14px'
    },
    success: {
        backgroundColor: '#dcfce7',
        color: '#16a34a',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '14px'
    },
    // Form Grid
    formGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        alignItems: 'start'
    },
    leftColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
    },
    rightColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
    },
    // Cards
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        overflow: 'hidden'
    },
    cardHeader: {
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        padding: '16px 24px'
    },
    cardTitle: {
        color: '#ffffff',
        fontSize: '16px',
        fontWeight: '700',
        margin: 0
    },
    cardBody: {
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    // Inputs
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },
    label: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#444'
    },
    input: {
        padding: '10px 12px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '14px',
        outline: 'none',
        backgroundColor: '#fafafa'
    },
    inputDisabled: {
        padding: '10px 12px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '14px',
        outline: 'none',
        backgroundColor: '#f0f0f0',
        color: '#888'
    },
    textarea: {
        padding: '10px 12px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '14px',
        outline: 'none',
        resize: 'vertical',
        fontFamily: 'inherit',
        backgroundColor: '#fafafa'
    },
    row: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px'
    },
    hint: {
        fontSize: '12px',
        color: '#888',
        margin: 0
    },
    // Skills
    skillsPreview: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px'
    },
    skillBadge: {
        backgroundColor: '#eff6ff',
        color: '#3b82f6',
        border: '1px solid #bfdbfe',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600'
    },
    // CV Upload
    currentCV: {
        backgroundColor: '#f0fdf4',
        color: '#16a34a',
        padding: '10px 12px',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '600'
    },
    uploadArea: {
        border: '2px dashed #d1d5db',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: '#fafafa'
    },
    fileInput: {
        display: 'none'
    },
    uploadLabel: {
        cursor: 'pointer',
        fontSize: '14px',
        color: '#6366f1',
        fontWeight: '600'
    },
    fileName: {
        color: '#16a34a',
        fontWeight: '600',
        fontSize: '14px'
    },
    // Button
    button: {
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        color: '#ffffff',
        padding: '14px',
        borderRadius: '8px',
        border: 'none',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        width: '100%'
    },
    buttonDisabled: {
        backgroundColor: '#a5b4fc',
        color: '#ffffff',
        padding: '14px',
        borderRadius: '8px',
        border: 'none',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'not-allowed',
        width: '100%'
    }
};

export default StudentProfilePage;