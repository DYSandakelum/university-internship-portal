import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../services/api';

const JobDetailsPage = () => {
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await api.get(`/jobs/${id}`);
                setJob(res.data.job);
            } catch (error) {
                setError('Internship not found or no longer available.');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    if (loading) return (
        <div className="page-wrapper">
            <Navbar />
            <div className="loading-wrapper">
                <div className="spinner"></div>
                <p>Loading internship details...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="page-wrapper">
            <Navbar />
            <div className="loading-wrapper">
                <div style={{textAlign: 'center'}}>
                    <p style={{fontSize: '48px', marginBottom: '16px'}}>😕</p>
                    <h2 style={{color: '#ef4444', marginBottom: '16px'}}>{error}</h2>
                    <Link to="/student/dashboard" className="btn btn-amber">← Back to Dashboard</Link>
                </div>
            </div>
        </div>
    );

    return (
        <div className="page-wrapper">
            <Navbar />

            {/* Page Header */}
            <div style={styles.pageHeader}>
                <div style={styles.pageHeaderInner}>
                    <button onClick={() => navigate(-1)} className="back-btn" style={{marginBottom: '16px'}}>
                        ← Back
                    </button>
                    <div style={styles.jobHeaderContent}>
                        <div style={styles.companyAvatar}>
                            {job?.company?.[0] || '?'}
                        </div>
                        <div style={styles.jobHeaderInfo}>
                            <div style={styles.jobHeaderTop}>
                                <h1 style={styles.pageTitle}>{job?.title}</h1>
                                <span style={styles.typeBadge}>{job?.type}</span>
                            </div>
                            <p style={styles.pageSubtitle}>
                                {job?.company} · {job?.location}
                                {job?.salary && ` · ${job?.salary}`}
                            </p>
                            <p style={styles.deadline}>
                                ⏰ Application Deadline: {new Date(job?.deadline).toLocaleDateString()}
                            </p>
                        </div>
                        <button onClick={() => navigate(`/student/apply/${job?._id}`)}
                            className="btn btn-amber btn-lg">
                            Apply Now →
                        </button>
                    </div>
                </div>
            </div>

            <div className="main-content">
                <div className="grid-sidebar">
                    {/* Left */}
                    <div style={styles.col}>
                        <div style={styles.section}>
                            <h2 style={styles.sectionTitle}>Job Description</h2>
                            <div style={styles.sectionBody}>
                                <p style={styles.description}>{job?.description}</p>
                            </div>
                        </div>
                        <div style={styles.section}>
                            <h2 style={styles.sectionTitle}>Requirements</h2>
                            <div style={styles.sectionBody}>
                                <ul style={styles.list}>
                                    {Array.isArray(job?.requirements)
                                        ? job.requirements.map((req, i) => (
                                            <li key={i} style={styles.listItem}>{req}</li>
                                        ))
                                        : job?.requirements?.split('\n').map((req, i) =>
                                            req.trim() && <li key={i} style={styles.listItem}>{req.trim()}</li>
                                        )
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Right */}
                    <div style={styles.col}>
                        <div style={styles.section}>
                            <h2 style={styles.sectionTitle}>Job Details</h2>
                            <div style={styles.detailsList}>
                                {[
                                    {label: 'Type', value: job?.type},
                                    {label: 'Location', value: job?.location},
                                    {label: 'Faculty', value: job?.faculty || 'All Faculties'},
                                    ...(job?.salary ? [{label: 'Salary', value: job?.salary}] : []),
                                    {label: 'Deadline', value: new Date(job?.deadline).toLocaleDateString()}
                                ].map((d, i) => (
                                    <div key={i} style={styles.detailItem}>
                                        <span style={styles.detailLabel}>{d.label}</span>
                                        <span style={styles.detailValue}>{d.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={styles.section}>
                            <h2 style={styles.sectionTitle}>About the Company</h2>
                            <div style={styles.sectionBody}>
                                <p style={styles.description}>
                                    {job?.companyDescription || 'No company description available.'}
                                </p>
                                {job?.companyWebsite && (
                                    <a href={job?.companyWebsite} target="_blank" rel="noreferrer"
                                        className="btn btn-outline btn-sm" style={{marginTop: '12px'}}>
                                        🌐 Visit Website
                                    </a>
                                )}
                            </div>
                        </div>

                        <button onClick={() => navigate(`/student/apply/${job?._id}`)}
                            className="btn btn-amber btn-full btn-lg">
                            Apply for this Internship →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    pageHeader: { background: '#ffffff', borderBottom: '1px solid #E7E2D9', padding: '24px 0 32px' },
    pageHeaderInner: { maxWidth: '1280px', margin: '0 auto', padding: '0 48px' },
    jobHeaderContent: { display: 'flex', alignItems: 'flex-start', gap: '20px' },
    companyAvatar: { width: '64px', height: '64px', background: '#FEF3C7', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '800', color: '#D97706', flexShrink: 0 },
    jobHeaderInfo: { flex: 1 },
    jobHeaderTop: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' },
    pageTitle: { fontSize: '24px', fontWeight: '800', color: '#1C1917', letterSpacing: '-0.3px' },
    typeBadge: { background: '#FEF3C7', color: '#D97706', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '600' },
    pageSubtitle: { fontSize: '14px', color: '#6B7280', marginBottom: '4px' },
    deadline: { fontSize: '13px', color: '#9CA3AF' },
    col: { display: 'flex', flexDirection: 'column', gap: '24px' },
    section: { background: '#ffffff', border: '1px solid #E7E2D9', borderRadius: '16px', overflow: 'hidden' },
    sectionTitle: { fontSize: '15px', fontWeight: '700', color: '#1C1917', padding: '16px 24px', borderBottom: '1px solid #E7E2D9', margin: 0 },
    sectionBody: { padding: '20px 24px' },
    description: { fontSize: '14px', color: '#6B7280', lineHeight: '1.8' },
    list: { paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' },
    listItem: { fontSize: '14px', color: '#6B7280', lineHeight: '1.6' },
    detailsList: { padding: '0 24px' },
    detailItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #E7E2D9' },
    detailLabel: { fontSize: '13px', color: '#9CA3AF', fontWeight: '600' },
    detailValue: { fontSize: '14px', color: '#1C1917', fontWeight: '500' }
};

export default JobDetailsPage;