import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../services/api';

const steps = ['Job Details', 'Resume', 'Cover Letter', 'Submit'];

const ApplicationFormPage = () => {
    const [job, setJob] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [coverLetter, setCoverLetter] = useState('');
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);
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

    const handleNext = () => {
        setError('');
        if (currentStep === 1 && !resume) {
            return setError('Please upload your resume to continue');
        }
        if (currentStep === 2 && coverLetter.length < 100) {
            return setError(`Cover letter needs ${100 - coverLetter.length} more characters`);
        }
        setCurrentStep(prev => prev + 1);
    };

    const handleSubmit = async () => {
        setError('');
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('coverLetter', coverLetter);
            formData.append('resume', resume);
            await api.post(`/student/apply/${jobId}`, formData);
            setSubmitted(true);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to submit application.');
            setCurrentStep(2);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="page-wrapper">
            <Navbar />
            <div className="loading-wrapper">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        </div>
    );

    // Success State
    if (submitted) return (
        <div className="page-wrapper">
            <Navbar />
            <div style={styles.successWrapper}>
                <div style={styles.successCard}>
                    <div style={styles.successIcon}>✓</div>
                    <h2 style={styles.successTitle}>Application Submitted!</h2>
                    <p style={styles.successSubtitle}>
                        Your application for <strong>{job?.title}</strong> at <strong>{job?.company}</strong> has been submitted successfully.
                        You'll receive updates via email.
                    </p>
                    <button onClick={() => navigate('/student/applications')}
                        className="btn btn-primary btn-lg">
                        View My Applications →
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="page-wrapper">
            <Navbar />

            {/* Page Banner */}
            <div className="page-banner">
                <h1 className="page-banner-title">Apply for Internship</h1>
                <p className="page-banner-subtitle">
                    {job?.title} at {job?.company}
                </p>
            </div>

            <div style={styles.formWrapper}>
                <div style={styles.formCard}>

                    {/* Step Indicator */}
                    <div className="step-indicator">
                        {steps.map((step, index) => (
                            <div key={index} className={`step-item ${index < currentStep ? 'completed' : ''}`}>
                                <div className={`step-circle ${
                                    index < currentStep ? 'step-circle-completed' :
                                    index === currentStep ? 'step-circle-current' :
                                    'step-circle-upcoming'
                                }`}>
                                    {index < currentStep ? '✓' : index + 1}
                                </div>
                                <span className={`step-label ${
                                    index < currentStep ? 'step-label-completed' :
                                    index === currentStep ? 'step-label-current' : ''
                                }`}>{step}</span>
                            </div>
                        ))}
                    </div>

                    <div style={styles.divider}></div>

                    {error && <div className="alert alert-error" style={{marginBottom: '16px'}}>⚠️ {error}</div>}

                    {/* Step 0 — Job Details */}
                    {currentStep === 0 && job && (
                        <div style={styles.stepContent}>
                            <h3 style={styles.stepTitle}>Confirm Job Details</h3>
                            <div style={styles.jobDetails}>
                                {[
                                    {label: 'Position', value: job.title},
                                    {label: 'Company', value: job.company},
                                    {label: 'Location', value: job.location},
                                    {label: 'Type', value: job.type},
                                    {label: 'Deadline', value: new Date(job.deadline).toLocaleDateString()}
                                ].map((d, i) => (
                                    <div key={i} style={styles.detailRow}>
                                        <span style={styles.detailLabel}>{d.label}</span>
                                        <span style={styles.detailValue}>{d.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 1 — Resume */}
                    {currentStep === 1 && (
                        <div style={styles.stepContent}>
                            <h3 style={styles.stepTitle}>Upload Your Resume</h3>
                            <p style={styles.stepDesc}>Upload your most recent CV or resume</p>
                            <div className="upload-area" style={{marginTop: '16px'}}>
                                <input type="file" accept=".pdf,.doc,.docx"
                                    onChange={(e) => setResume(e.target.files[0])}
                                    style={{display: 'none'}} id="resume" />
                                <label htmlFor="resume" className="upload-label">
                                    {resume ? (
                                        <span style={{color: 'var(--success-dark)'}}>✅ {resume.name}</span>
                                    ) : (
                                        <>
                                            <span style={{fontSize: '32px', display: 'block', marginBottom: '8px'}}>📎</span>
                                            <span>Click to upload your resume</span>
                                        </>
                                    )}
                                </label>
                            </div>
                            <p className="form-hint" style={{marginTop: '8px'}}>Accepted: PDF, DOC, DOCX — Max 5MB</p>
                        </div>
                    )}

                    {/* Step 2 — Cover Letter */}
                    {currentStep === 2 && (
                        <div style={styles.stepContent}>
                            <h3 style={styles.stepTitle}>Write Your Cover Letter</h3>
                            <p style={styles.stepDesc}>Explain why you're a great fit for this role (min. 100 characters)</p>
                            <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)}
                                placeholder="Dear Hiring Manager,&#10;&#10;I am writing to express my strong interest in this internship position..."
                                className="form-textarea" rows={10} style={{marginTop: '16px'}} />
                            <span style={{
                                fontSize: '12px', fontWeight: '600', marginTop: '6px', display: 'block',
                                color: coverLetter.length < 100 ? 'var(--danger)' : 'var(--success-dark)'
                            }}>
                                {coverLetter.length} characters
                                {coverLetter.length < 100 && ` — ${100 - coverLetter.length} more needed`}
                            </span>
                        </div>
                    )}

                    {/* Step 3 — Review & Submit */}
                    {currentStep === 3 && (
                        <div style={styles.stepContent}>
                            <h3 style={styles.stepTitle}>Review & Submit</h3>
                            <p style={styles.stepDesc}>Please review your application before submitting</p>
                            <div style={styles.reviewItems}>
                                <div style={styles.reviewItem}>
                                    <span style={styles.reviewLabel}>Position</span>
                                    <span style={styles.reviewValue}>{job?.title} at {job?.company}</span>
                                </div>
                                <div style={styles.reviewItem}>
                                    <span style={styles.reviewLabel}>Resume</span>
                                    <span style={{...styles.reviewValue, color: 'var(--success-dark)'}}>✅ {resume?.name}</span>
                                </div>
                                <div style={styles.reviewItem}>
                                    <span style={styles.reviewLabel}>Cover Letter</span>
                                    <span style={{...styles.reviewValue, color: 'var(--success-dark)'}}>✅ {coverLetter.length} characters</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div style={styles.navButtons}>
                        <button onClick={() => currentStep === 0 ? navigate(-1) : setCurrentStep(p => p - 1)}
                            className="btn btn-gray">
                            {currentStep === 0 ? '← Cancel' : '← Previous'}
                        </button>
                        {currentStep < steps.length - 1 ? (
                            <button onClick={handleNext} className="btn btn-primary">
                                Next →
                            </button>
                        ) : (
                            <button onClick={handleSubmit}
                                className={`btn btn-amber ${submitting ? 'btn-disabled' : ''}`}
                                disabled={submitting}>
                                {submitting ? 'Submitting...' : 'Submit Application →'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    formWrapper: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        padding: '40px 24px',
        backgroundColor: 'var(--bg)'
    },
    formCard: {
        background: '#ffffff',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '680px',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
    },
    divider: { height: '1px', background: 'var(--border)' },
    stepContent: { display: 'flex', flexDirection: 'column', gap: '8px' },
    stepTitle: { fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' },
    stepDesc: { fontSize: '14px', color: 'var(--text-secondary)' },
    jobDetails: { display: 'flex', flexDirection: 'column', gap: '0', marginTop: '8px' },
    detailRow: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 0', borderBottom: '1px solid var(--border)'
    },
    detailLabel: { fontSize: '13px', color: 'var(--text-light)', fontWeight: '600' },
    detailValue: { fontSize: '14px', color: 'var(--text-primary)', fontWeight: '500' },
    reviewItems: { display: 'flex', flexDirection: 'column', gap: '0', marginTop: '8px' },
    reviewItem: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 0', borderBottom: '1px solid var(--border)'
    },
    reviewLabel: { fontSize: '13px', color: 'var(--text-light)', fontWeight: '600' },
    reviewValue: { fontSize: '14px', color: 'var(--text-primary)', fontWeight: '500' },
    navButtons: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' },
    successWrapper: {
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '40px 24px', backgroundColor: 'var(--bg)'
    },
    successCard: {
        background: '#ffffff', borderRadius: '20px', padding: '56px 48px',
        textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        border: '1px solid var(--border)', width: '100%', maxWidth: '480px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px'
    },
    successIcon: {
        width: '72px', height: '72px', borderRadius: '50%', background: 'var(--success)',
        color: '#ffffff', fontSize: '32px', fontWeight: '700',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
    },
    successTitle: { fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)' },
    successSubtitle: { fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.7', maxWidth: '340px' }
};

export default ApplicationFormPage;