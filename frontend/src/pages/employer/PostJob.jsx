import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const PostJob = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);
    const [formData, setFormData] = useState({
        title: '', description: '', requirements: '',
        salary: '', location: '', deadline: '', jobType: 'Full-time'
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [errors, setErrors] = useState({});

    const sriLankaPlaces = [
        'colombo', 'kandy', 'galle', 'jaffna', 'negombo', 'trincomalee',
        'anuradhapura', 'polonnaruwa', 'kurunegala', 'ratnapura', 'badulla',
        'batticaloa', 'matara', 'kalutara', 'gampaha', 'vavuniya',
        'hambantota', 'puttalam', 'mannar', 'mullaitivu', 'kilinochchi',
        'kalmunai', 'ampara', 'monaragala', 'kegalle', 'matale',
        'nuwara eliya', 'bandarawela', 'haputale', 'ella', 'hatton',
        'mount lavinia', 'dehiwala', 'panadura', 'wadduwa', 'beruwala',
        'bentota', 'kosgoda', 'ambalangoda', 'hikkaduwa', 'unawatuna',
        'koggala', 'ahangama', 'weligama', 'mirissa', 'dikwella',
        'tangalle', 'pasikudah', 'kalkudah', 'arugam bay', 'pottuvil',
        'sigiriya', 'dambulla', 'mihintale', 'kataragama', 'kitulgala',
        'moratuwa', 'ja ela', 'wattala', 'maharagama', 'nugegoda',
        'ratmalana', 'homagama', 'avissawella', 'malabe', 'kadawatha',
        'peliyagoda', 'kandana', 'seeduwa', 'nittambuwa', 'ganemulla',
        'kelaniya', 'battaramulla', 'rajagiriya', 'nawala', 'kaduwela',
        'peradeniya', 'gampola', 'nawalapitiya', 'wellawatte', 'bambalapitiya',
        'kollupitiya', 'borella', 'maradana', 'pettah', 'fort',
        'remote', 'work from home'
    ];

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        if (isEditing) fetchJobDetails(id, token);
    }, [navigate, id, isEditing]);

    const fetchJobDetails = async (jobId, token) => {
        try {
            const res = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                const job = data.job || data;
                setFormData({
                    title: job.title || '', description: job.description || '',
                    requirements: job.requirements || '', salary: job.salary || job.salaryRange || '',
                    location: job.location || '',
                    deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
                    jobType: job.jobType || 'Full-time'
                });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to load job details.' });
        }
    };

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    };

    const validateSalary = (value) => {
        const trimmed = value.trim();
        const startsWithCurrency = /^(LKR|Rs|\$|USD)/i.test(trimmed);
        const hasNumber = /\d/.test(trimmed);
        return startsWithCurrency && hasNumber;
    };

    const validateLocation = (value) => {
        const normalized = value.toLowerCase().trim();
        if (normalized.length < 2) return false;
        return sriLankaPlaces.some(place => {
            const p = place.toLowerCase();
            return normalized === p || normalized.includes(p) || p.includes(normalized);
        });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Job title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.requirements.trim()) newErrors.requirements = 'Requirements are required';
        if (!formData.salary.trim()) { newErrors.salary = 'Salary is required'; }
        else if (!validateSalary(formData.salary)) { newErrors.salary = 'Must start with LKR or $ (e.g. LKR 50,000)'; }
        if (!formData.location.trim()) { newErrors.location = 'Location is required'; }
        else if (!validateLocation(formData.location)) { newErrors.location = 'Enter a real place in Sri Lanka'; }
        if (!formData.deadline) newErrors.deadline = 'Deadline is required';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        setLoading(true);
        try {
            const url = isEditing ? `http://localhost:5000/api/jobs/${id}` : 'http://localhost:5000/api/jobs';
            const method = isEditing ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ ...formData, salaryRange: formData.salary })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to post job.');
            setMessage({ type: 'success', text: isEditing ? 'Job updated successfully!' : 'Job posted successfully!' });
            setTimeout(() => navigate('/employer/my-jobs'), 1500);
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Something went wrong.' });
        } finally {
            setLoading(false);
        }
    };

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
                    <Link to="/employer/profile" className="nav-link">Profile</Link>
                </div>
            </nav>

            {/* Page Header */}
            <div style={styles.pageHeader}>
                <div style={styles.pageHeaderInner}>
                    <button className="back-btn" onClick={() => navigate('/employer/my-jobs')}>← Back to My Jobs</button>
                    <h1 style={styles.pageTitle}>{isEditing ? '✏️ Edit Job' : '✍️ Post a New Job'}</h1>
                    <p style={styles.pageSubtitle}>{isEditing ? 'Update your internship listing' : 'Create a new internship opportunity'}</p>
                </div>
            </div>

            <div className="main-content" style={{ maxWidth: '800px' }}>

                {message.text && (
                    <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                        {message.type === 'success' ? '✅' : '⚠️'} {message.text}
                    </div>
                )}

                <div style={styles.formCard}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        <div className="form-group">
                            <label className="form-label">Job Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange}
                                className="form-input" placeholder="e.g. Software Engineer Intern" />
                            {errors.title && <p style={styles.fieldError}>⚠️ {errors.title}</p>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Job Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange}
                                className="form-textarea" rows="4" placeholder="Describe the job role..." />
                            {errors.description && <p style={styles.fieldError}>⚠️ {errors.description}</p>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Requirements</label>
                            <textarea name="requirements" value={formData.requirements} onChange={handleChange}
                                className="form-textarea" rows="4" placeholder="List required skills and qualifications..." />
                            {errors.requirements && <p style={styles.fieldError}>⚠️ {errors.requirements}</p>}
                        </div>

                        <div className="grid-2" style={{ gap: '16px' }}>
                            <div className="form-group">
                                <label className="form-label">Salary</label>
                                <input type="text" name="salary" value={formData.salary} onChange={handleChange}
                                    className="form-input" placeholder="e.g. LKR 50,000" />
                                {errors.salary && <p style={styles.fieldError}>⚠️ {errors.salary}</p>}
                                <p className="form-hint">Must start with LKR or $</p>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Location</label>
                                <input type="text" name="location" value={formData.location} onChange={handleChange}
                                    className="form-input" placeholder="e.g. Colombo" />
                                {errors.location && <p style={styles.fieldError}>⚠️ {errors.location}</p>}
                                <p className="form-hint">Must be a real place in Sri Lanka</p>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Deadline</label>
                                <input type="date" name="deadline" value={formData.deadline}
                                    onChange={handleChange} className="form-input" />
                                {errors.deadline && <p style={styles.fieldError}>⚠️ {errors.deadline}</p>}
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

                        <button type="submit" disabled={loading}
                            className={`btn btn-full btn-lg ${loading ? 'btn-disabled' : 'btn-amber'}`}>
                            {loading ? 'Saving...' : isEditing ? '✏️ Update Job' : '✍️ Post Job'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const styles = {
    pageHeader: { background: '#ffffff', borderBottom: '1px solid #E7E2D9', padding: '24px 0 32px' },
    pageHeaderInner: { maxWidth: '1280px', margin: '0 auto', padding: '0 48px', display: 'flex', flexDirection: 'column', gap: '8px' },
    pageTitle: { fontSize: '24px', fontWeight: '800', color: '#1C1917', letterSpacing: '-0.3px', margin: 0 },
    pageSubtitle: { fontSize: '14px', color: '#6B7280' },
    formCard: { background: '#ffffff', border: '1px solid #E7E2D9', borderRadius: '16px', padding: '32px' },
    fieldError: { color: '#ef4444', fontSize: '13px', margin: '4px 0 0' }
};

export default PostJob;