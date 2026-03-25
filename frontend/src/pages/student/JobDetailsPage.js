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
        <div style={styles.container}>
            <Navbar />
            <div style={styles.centerContent}>
                <div style={styles.spinner}></div>
                <p>Loading internship details...</p>
            </div>
        </div>
    );

    if (error) return (
        <div style={styles.container}>
            <Navbar />
            <div style={styles.centerContent}>
                <div style={styles.errorCard}>
                    <h2 style={styles.errorTitle}>❌ {error}</h2>
                    <Link to="/student/dashboard" style={styles.backButton}>
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );

    return (
        <div style={styles.container}>
            <Navbar />
            <div style={styles.main}>

                {/* Back Button */}
                <button onClick={() => navigate(-1)} style={styles.backLink}>
                    ← Back
                </button>

                {/* Job Header Card */}
                <div style={styles.headerCard}>
                    <div style={styles.headerCardTop}>
                        <h1 style={styles.jobTitle}>{job?.title}</h1>
                        <span style={styles.jobType}>{job?.type}</span>
                    </div>
                    <div style={styles.companyInfo}>
                        <span style={styles.companyName}>🏢 {job?.company}</span>
                        <span style={styles.location}>📍 {job?.location}</span>
                        {job?.salary && (
                            <span style={styles.salary}>💰 {job?.salary}</span>
                        )}
                    </div>
                    <div style={styles.headerCardBottom}>
                        <span style={styles.deadline}>
                            ⏰ Application Deadline: {new Date(job?.deadline).toLocaleDateString()}
                        </span>
                        <button
                            onClick={() => navigate(`/student/apply/${job?._id}`)}
                            style={styles.applyButton}
                        >
                            Apply Now →
                        </button>
                    </div>
                </div>

                <div style={styles.contentGrid}>

                    {/* Left Column */}
                    <div style={styles.leftColumn}>

                        {/* Description */}
                        <div style={styles.card}>
                            <div style={styles.cardHeader}>
                                <h2 style={styles.cardTitle}>📋 Job Description</h2>
                            </div>
                            <div style={styles.cardBody}>
                                <p style={styles.description}>{job?.description}</p>
                            </div>
                        </div>

                        {/* Requirements */}
                        <div style={styles.card}>
                            <div style={{...styles.cardHeader, backgroundColor: '#22c55e'}}>
                                <h2 style={styles.cardTitle}>✅ Requirements</h2>
                            </div>
                            <div style={styles.cardBody}>
                                <ul style={styles.list}>
                                    {job?.requirements?.map((req, index) => (
                                        <li key={index} style={styles.listItem}>
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                    </div>

                    {/* Right Column */}
                    <div style={styles.rightColumn}>

                        {/* Company Info */}
                        <div style={styles.card}>
                            <div style={{...styles.cardHeader, backgroundColor: '#3b82f6'}}>
                                <h2 style={styles.cardTitle}>🏢 About the Company</h2>
                            </div>
                            <div style={styles.cardBody}>
                                <p style={styles.companyDescription}>
                                    {job?.companyDescription || 'No company description available.'}
                                </p>
                                {job?.companyWebsite && (
                                    
                                    <a    href={job?.companyWebsite}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={styles.websiteLink}
                                    >
                                        🌐 Visit Website
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Job Details */}
                        <div style={styles.card}>
                            <div style={{...styles.cardHeader, backgroundColor: '#f97316'}}>
                                <h2 style={styles.cardTitle}>📌 Job Details</h2>
                            </div>
                            <div style={styles.cardBody}>
                                <div style={styles.detailsList}>
                                    <div style={styles.detailItem}>
                                        <span style={styles.detailLabel}>Type</span>
                                        <span style={styles.detailValue}>{job?.type}</span>
                                    </div>
                                    <div style={styles.detailItem}>
                                        <span style={styles.detailLabel}>Location</span>
                                        <span style={styles.detailValue}>{job?.location}</span>
                                    </div>
                                    <div style={styles.detailItem}>
                                        <span style={styles.detailLabel}>Faculty</span>
                                        <span style={styles.detailValue}>{job?.faculty || 'All Faculties'}</span>
                                    </div>
                                    {job?.salary && (
                                        <div style={styles.detailItem}>
                                            <span style={styles.detailLabel}>Salary</span>
                                            <span style={styles.detailValue}>{job?.salary}</span>
                                        </div>
                                    )}
                                    <div style={styles.detailItem}>
                                        <span style={styles.detailLabel}>Deadline</span>
                                        <span style={styles.detailValue}>
                                            {new Date(job?.deadline).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Apply Button */}
                        <button
                            onClick={() => navigate(`/student/apply/${job?._id}`)}
                            style={styles.applyButtonLarge}
                        >
                            Apply for this Internship →
                        </button>

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
    headerCard: {
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        borderRadius: '12px',
        padding: '24px 32px',
        boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    headerCardTop: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    jobTitle: {
        color: '#ffffff',
        fontSize: '24px',
        fontWeight: '700',
        margin: 0
    },
    jobType: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        color: '#ffffff',
        padding: '6px 14px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: '600'
    },
    companyInfo: {
        display: 'flex',
        gap: '24px',
        flexWrap: 'wrap'
    },
    companyName: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: '15px',
        fontWeight: '600'
    },
    location: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: '15px'
    },
    salary: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: '15px'
    },
    headerCardBottom: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    deadline: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: '14px'
    },
    applyButton: {
        backgroundColor: '#ffffff',
        color: '#6366f1',
        border: 'none',
        padding: '10px 24px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer'
    },
    contentGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
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
        padding: '24px'
    },
    description: {
        fontSize: '15px',
        color: '#444',
        lineHeight: '1.7'
    },
    list: {
        paddingLeft: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    listItem: {
        fontSize: '14px',
        color: '#444',
        lineHeight: '1.6'
    },
    companyDescription: {
        fontSize: '14px',
        color: '#444',
        lineHeight: '1.7',
        marginBottom: '16px'
    },
    websiteLink: {
        color: '#3b82f6',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '600'
    },
    detailsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    detailItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '12px',
        borderBottom: '1px solid #f0f0f0'
    },
    detailLabel: {
        fontSize: '13px',
        color: '#888',
        fontWeight: '600'
    },
    detailValue: {
        fontSize: '14px',
        color: '#333',
        fontWeight: '500'
    },
    applyButtonLarge: {
        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        color: '#ffffff',
        border: 'none',
        padding: '16px',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        width: '100%',
        boxShadow: '0 4px 12px rgba(34,197,94,0.3)'
    },
    errorCard: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '32px',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
    },
    errorTitle: {
        color: '#dc2626',
        marginBottom: '16px'
    },
    backButton: {
        color: '#6366f1',
        textDecoration: 'none',
        fontWeight: '600'
    }
};

export default JobDetailsPage;