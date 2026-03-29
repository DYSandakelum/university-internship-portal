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
                <div style={styles.errorCard}>
                    <p style={{fontSize: '48px'}}>😕</p>
                    <h2 style={{color: 'var(--danger)', marginBottom: '16px'}}>{error}</h2>
                    <Link to="/student/dashboard" className="btn btn-primary">← Back to Dashboard</Link>
                </div>
            </div>
        </div>
    );

    return (
        <div className="page-wrapper">
            <Navbar />

            {/* Page Banner */}
            <div className="page-banner" style={{textAlign: 'left', padding: '40px 64px'}}>
                <div style={styles.bannerContent}>
                    <div>
                        <h1 className="page-banner-title">{job?.title}</h1>
                        <p className="page-banner-subtitle">
                            🏢 {job?.company} · 📍 {job?.location}
                            {job?.salary && ` · 💰 ${job?.salary}`}
                        </p>
                    </div>
                    <div style={styles.bannerRight}>
                        <span style={styles.typeBadge}>{job?.type}</span>
                        <button onClick={() => navigate(`/student/apply/${job?._id}`)}
                            className="btn btn-amber btn-lg">
                            Apply Now →
                        </button>
                    </div>
                </div>
                <div style={styles.bannerMeta}>
                    <span style={styles.deadline}>
                        ⏰ Deadline: {new Date(job?.deadline).toLocaleDateString()}
                    </span>
                </div>
            </div>

            <div className="main-content">
                <button onClick={() => navigate(-1)} className="back-btn">← Back</button>

                <div className="grid-sidebar">
                    {/* Left */}
                    <div style={styles.col}>
                        <div className="card">
                            <div className="card-header">
                                <h2 className="card-title">📋 Job Description</h2>
                            </div>
                            <div className="card-body">
                                <p style={styles.description}>{job?.description}</p>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header card-header-success">
                                <h2 className="card-title">✅ Requirements</h2>
                            </div>
                            <div className="card-body">
                                <ul style={styles.list}>
                                    {job?.requirements?.map((req, i) => (
                                        <li key={i} style={styles.listItem}>{req}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Right */}
                    <div style={styles.col}>
                        <div className="card">
                            <div className="card-header card-header-warning">
                                <h2 className="card-title">📌 Job Details</h2>
                            </div>
                            <div className="card-body">
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
                        <div className="card">
                            <div className="card-header card-header-info">
                                <h2 className="card-title">🏢 About the Company</h2>
                            </div>
                            <div className="card-body">
                                <p style={styles.companyDesc}>
                                    {job?.companyDescription || 'No company description available.'}
                                </p>
                                {job?.companyWebsite && (
                                    <a href={job?.companyWebsite} target="_blank" rel="noreferrer"
                                        className="btn btn-ghost btn-sm" style={{marginTop: '12px'}}>
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
    bannerContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' },
    bannerRight: { display: 'flex', alignItems: 'center', gap: '12px' },
    typeBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff',
        padding: '6px 16px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: '600'
    },
    bannerMeta: { marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.2)' },
    deadline: { color: 'rgba(255,255,255,0.8)', fontSize: '14px' },
    col: { display: 'flex', flexDirection: 'column', gap: '24px' },
    description: { fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.8' },
    list: { paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' },
    listItem: { fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' },
    detailItem: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 0', borderBottom: '1px solid var(--border)'
    },
    detailLabel: { fontSize: '13px', color: 'var(--text-light)', fontWeight: '600' },
    detailValue: { fontSize: '14px', color: 'var(--text-primary)', fontWeight: '500' },
    companyDesc: { fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.7' },
    errorCard: { textAlign: 'center', padding: '32px' }
};

export default JobDetailsPage;