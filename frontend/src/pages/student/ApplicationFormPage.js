import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../services/api';

const ApplicationFormPage = () => {
    const [job, setJob] = useState(null);
    const [coverLetter, setCoverLetter] = useState('');
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { jobId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await api.get(`/jobs/${jobId}`);
                setJob(res.data.job);
            } catch (error) {
                setError('Internship not found or no longer available.');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [jobId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!resume) {
            return setError('Please upload your resume');
        }

        if (coverLetter.length < 100) {
            return setError('Cover letter must be at least 100 characters');
        }

        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('coverLetter', coverLetter);
            formData.append('resume', resume);

            await api.post(`/student/apply/${jobId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setSuccess('Application submitted successfully!');
            setTimeout(() => navigate('/student/applications'), 2000);

        } catch (error) {
            setError(error.response?.data?.message || 'Failed to submit application. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div style={styles.container}>
            <Navbar />
            <div style={styles.centerContent}>
                <div style={styles.spinner}></div>
                <p>Loading...</p>
            </div>
        </div>
    );

    return (
        <div style={styles.container}>
            <Navbar />
            <div style={styles.main}>
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    style={styles.backLink}
                >
                    ← Back
                </button>

                {/* Job Summary Card */}
                {job && (
                    <div style={styles.jobSummaryCard}>
                        <div style={styles.jobSummaryHeader}>
                            <h2 style={styles.jobSummaryTitle}>📋 Applying for: {job.title}</h2>
                        </div>
                        <div style={styles.jobSummaryBody}>
                            <span style={styles.jobSummaryItem}>🏢 {job.company}</span>
                            <span style={styles.jobSummaryItem}>📍 {job.location}</span>
                            <span style={styles.jobSummaryItem}>⏰ Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                        </div>
                    </div>
                )}

                {/* Application Form */}
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h2 style={styles.cardTitle}>✏️ Application Form</h2>
                    </div>
                    <div style={styles.cardBody}>
                        {error && <div style={styles.error}>{error}</div>}
                        {success && <div style={styles.success}>{success}</div>}

                        <form onSubmit={handleSubmit} style={styles.form}>
                            {/* Resume Upload */}
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>
                                    Upload Resume <span style={styles.required}>*</span>
                                </label>
                                <p style={styles.hint}>Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
                                <div style={styles.uploadArea}>
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => setResume(e.target.files[0])}
                                        style={styles.fileInput}
                                        id="resume"
                                    />
                                    <label htmlFor="resume" style={styles.uploadLabel}>
                                        {resume ? (
                                            <span style={styles.fileName}>
                                                ✅ {resume.name}
                                            </span>
                                        ) : (
                                            <span>
                                                📎 Click to upload your resume
                                            </span>
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* Cover Letter */}
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>
                                    Cover Letter <span style={styles.required}>*</span>
                                </label>
                                <p style={styles.hint}>
                                    Minimum 100 characters. Explain why you're a good fit for this role.
                                </p>
                                <textarea
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    placeholder="Dear Hiring Manager,&#10;&#10;I am writing to express my interest in this internship position..."
                                    style={styles.textarea}
                                    rows={10}
                                    required
                                />
                                <span style={{
                                    ...styles.charCount,
                                    color: coverLetter.length < 100 ? '#dc2626' : '#16a34a'
                                }}>
                                    {coverLetter.length} characters
                                    {coverLetter.length < 100 && ` (${100 - coverLetter.length} more needed)`}
                                </span>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                style={submitting ? styles.buttonDisabled : styles.button}
                                disabled={submitting}
                            >
                                {submitting ? 'Submitting...' : '🚀 Submit Application'}
                            </button>
                        </form>
                    </div>
                </div>
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
        maxWidth: '800px',
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
    backLink: {
        backgroundColor: 'transparent',
        border: 'none',
        color: '#6366f1',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        padding: '0',
        textAlign: 'left'
    },
    // Job Summary Card
    jobSummaryCard: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        overflow: 'hidden'
    },
    jobSummaryHeader: {
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        padding: '16px 24px'
    },
    jobSummaryTitle: {
        color: '#ffffff',
        fontSize: '18px',
        fontWeight: '700',
        margin: 0
    },
    jobSummaryBody: {
        padding: '16px 24px',
        display: 'flex',
        gap: '24px',
        flexWrap: 'wrap'
    },
    jobSummaryItem: {
        fontSize: '14px',
        color: '#555',
        fontWeight: '500'
    },
    // Form Card
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
        fontSize: '18px',
        fontWeight: '700',
        margin: 0
    },
    cardBody: {
        padding: '24px'
    },
    error: {
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '16px',
        fontSize: '14px'
    },
    success: {
        backgroundColor: '#dcfce7',
        color: '#16a34a',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '16px',
        fontSize: '14px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    label: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#333'
    },
    required: {
        color: '#dc2626'
    },
    hint: {
        fontSize: '12px',
        color: '#888',
        margin: 0
    },
    uploadArea: {
        border: '2px dashed #d1d5db',
        borderRadius: '8px',
        padding: '24px',
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
    textarea: {
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '14px',
        outline: 'none',
        resize: 'vertical',
        fontFamily: 'inherit',
        backgroundColor: '#fafafa',
        lineHeight: '1.6'
    },
    charCount: {
        fontSize: '12px',
        fontWeight: '600'
    },
    button: {
        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        color: '#ffffff',
        padding: '14px',
        borderRadius: '8px',
        border: 'none',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    buttonDisabled: {
        backgroundColor: '#86efac',
        color: '#ffffff',
        padding: '14px',
        borderRadius: '8px',
        border: 'none',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'not-allowed'
    }
};

export default ApplicationFormPage;