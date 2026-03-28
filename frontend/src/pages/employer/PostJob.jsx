import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const PostJob = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        salary: '',
        location: '',
        deadline: '',
        jobType: 'Full-time'
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
        'point pedro', 'valvettithurai', 'chavakachcheri', 'kankesanthurai',
        'kayts', 'nainativu', 'thalaimannar', 'pesalai', 'silavathurai',
        'sigiriya', 'dambulla', 'mihintale', 'ritigala', 'yapahuwa',
        'kataragama', 'kitulgala', 'sri pada', 'kalpitiya',
        'manipay', 'tellippalai', 'kopay', 'vaddukoddai',
        'paranthan', 'pallai', 'elephant pass', 'murunkan',
        'akkaraipattu', 'sammanthurai', 'kattankudy', 'eravur',
        'chenkalady', 'valaichenai', 'nilaveli', 'uppuveli', 'kuchchaveli',
        'muttur', 'kinniya', 'seruwila',
        'chilaw', 'kuliyapitiya', 'narammala', 'mawathagama',
        'wariyapola', 'pannala', 'dankotuwa', 'marawila',
        'nawagattegama', 'hettipola', 'bingiriya', 'katupotha', 'anamaduwa',
        'maho', 'giribawa', 'igalpotha',
        'medirigiriya', 'habarana', 'kekirawa', 'thambuttegama',
        'horowpathana', 'galenbindunuwewa', 'padaviya', 'medawachchiya',
        'nochchiyagama', 'hingurakgoda', 'minneriya', 'giritale',
        'akurana', 'katugastota', 'kundasale', 'wattegama',
        'galewela', 'rattota', 'naula', 'wilgamuwa',
        'wellawaya', 'passara', 'bibile', 'soranatota',
        'hali ela', 'lunugala', 'thanamalvila', 'buttala', 'okkampitiya',
        'balangoda', 'embilipitiya', 'warakapola', 'dehiowita',
        'deraniyagala', 'kalawana', 'ayagama', 'kuruwita',
        'mawanella', 'ruwanwella', 'yatiyantota',
        'moratuwa', 'ja ela', 'wattala', 'maharagama', 'nugegoda',
        'ratmalana', 'homagama', 'avissawella', 'padukka', 'hanwella',
        'biyagama', 'kirindiwela', 'minuwangoda', 'divulapitiya', 'mirigama',
        'attanagalla', 'dompe', 'horana', 'mathugama', 'agalawatta',
        'bandaragama', 'bulathsinhala', 'piliyandala', 'boralesgamuwa',
        'kaduwela', 'kolonnawa', 'kottawa', 'battaramulla', 'rajagiriya',
        'nawala', 'malabe', 'kadawatha', 'peliyagoda', 'kandana',
        'seeduwa', 'katana', 'nittambuwa', 'ganemulla',
        'deniyaya', 'akurassa', 'beliatta', 'baddegama', 'elpitiya',
        'hakmana', 'kamburupitiya', 'kirinda', 'ambalantota', 'tissamaharama',
        'peradeniya', 'kadugannawa', 'gampola', 'nawalapitiya',
        'talawakele', 'dickoya', 'maskeliya', 'walapane',
        'ginigathena', 'bogawantalawa', 'agrapatana', 'kandapola',
        'ambewela', 'pattipola', 'tholangamuwa', 'malwathuhiripitiya',
        'welikanda', 'girandurukotte', 'kawudulla',
        'wellawatte', 'bambalapitiya', 'kollupitiya', 'borella',
        'maradana', 'pettah', 'fort', 'grandpass', 'kotahena',
        'wennappuwa', 'kochchikade', 'nattandiya', 'mundel',
        'kalutara north', 'mount lavinia', 'dehiwala',
        'yala national park', 'wilpattu national park', 'udawalawe national park',
        'minneriya national park', 'bundala national park',
        'knuckles mountain range', 'meemure', 'riverston',
        'bambarakanda falls', 'diyaluma falls', 'ravana ella falls',
        'dunhinda falls', 'bopath ella falls',
        'kelaniya', 'bellanwila', 'munneswaram', 'nallur',
        'koneswaram', 'nagadeepa', 'kathirkamam',
        'remote', 'work from home'
    ];

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        if (isEditing) {
            fetchJobDetails(id, token);
        }
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
                    title: job.title || '',
                    description: job.description || '',
                    requirements: job.requirements || '',
                    salary: job.salary || job.salaryRange || '',
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
            return normalized === p ||
                normalized.includes(p) ||
                p.includes(normalized);
        });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Job title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.requirements.trim()) newErrors.requirements = 'Requirements are required';

        if (!formData.salary.trim()) {
            newErrors.salary = 'Salary is required';
        } else if (!validateSalary(formData.salary)) {
            newErrors.salary = 'Must start with LKR or $ (e.g. LKR 50,000 or $ 500)';
        }

        if (!formData.location.trim()) {
            newErrors.location = 'Location is required';
        } else if (!validateLocation(formData.location)) {
            newErrors.location = 'Enter a real place in Sri Lanka (e.g. Colombo, Kegalle)';
        }

        if (!formData.deadline) newErrors.deadline = 'Deadline is required';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }

        setLoading(true);
        try {
            const url = isEditing
                ? `http://localhost:5000/api/jobs/${id}`
                : 'http://localhost:5000/api/jobs';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
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
                <div className="navbar-brand">🎓 Internship Portal</div>
                <div className="navbar-links">
                    <Link to="/employer/dashboard" className="nav-link">Dashboard</Link>
                    <Link to="/employer/my-jobs" className="nav-link">My Jobs</Link>
                    <Link to="/employer/profile" className="nav-link">Profile</Link>
                </div>
            </nav>
            <div className="main-content" style={{ maxWidth: '900px' }}>
                <button className="back-btn" onClick={() => navigate('/employer/my-jobs')}>← Back to My Jobs</button>
                <div className="card">
                    <div className="card-header" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6366f1 100%)' }}>
                        <h2 className="card-title">{isEditing ? '✏️ Edit Job' : '✍️ Post a New Job'}</h2>
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
                                <input type="text" name="title" value={formData.title} onChange={handleChange} className="form-input" placeholder="e.g. Software Engineer Intern" />
                                {errors.title && <p style={{ color: 'red', fontSize: '13px', margin: '4px 0 0' }}>⚠️ {errors.title}</p>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Job Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} className="form-textarea" rows="4" placeholder="Describe the job role..." />
                                {errors.description && <p style={{ color: 'red', fontSize: '13px', margin: '4px 0 0' }}>⚠️ {errors.description}</p>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Requirements</label>
                                <textarea name="requirements" value={formData.requirements} onChange={handleChange} className="form-textarea" rows="4" placeholder="List required skills and qualifications..." />
                                {errors.requirements && <p style={{ color: 'red', fontSize: '13px', margin: '4px 0 0' }}>⚠️ {errors.requirements}</p>}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label">Salary</label>
                                    <input type="text" name="salary" value={formData.salary} onChange={handleChange} className="form-input" placeholder="e.g. LKR 50,000 or $ 500" />
                                    {errors.salary && <p style={{ color: 'red', fontSize: '13px', margin: '4px 0 0' }}>⚠️ {errors.salary}</p>}
                                    <p style={{ color: '#6b7280', fontSize: '12px', margin: '4px 0 0' }}>Must start with LKR or $</p>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Location</label>
                                    <input type="text" name="location" value={formData.location} onChange={handleChange} className="form-input" placeholder="e.g. Colombo, Kegalle" />
                                    {errors.location && <p style={{ color: 'red', fontSize: '13px', margin: '4px 0 0' }}>⚠️ {errors.location}</p>}
                                    <p style={{ color: '#6b7280', fontSize: '12px', margin: '4px 0 0' }}>Must be a real place in Sri Lanka</p>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Deadline</label>
                                    <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="form-input" />
                                    {errors.deadline && <p style={{ color: 'red', fontSize: '13px', margin: '4px 0 0' }}>⚠️ {errors.deadline}</p>}
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
                                disabled={loading}
                                style={{
                                    background: loading ? '#9ca3af' : 'linear-gradient(135deg, #7C3AED 0%, #6366f1 100%)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '14px',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: loading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {loading ? 'Saving...' : isEditing ? '✏️ Update Job' : '✍️ Submit Job'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostJob;