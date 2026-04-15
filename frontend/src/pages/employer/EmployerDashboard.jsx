import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';

const EmployerDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalJobs: 0,
        totalApplications: 0,
        pendingReviews: 0
    });

    const employerData = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem('user') || '{}');
        } catch (error) {
            return {};
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }

        const fetchStats = async () => {
            try {
                const [jobsRes, applicationsRes] = await Promise.all([
                    fetch('http://localhost:5000/api/jobs/employer', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    fetch('http://localhost:5000/api/applications/employer', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);
                const jobsData = jobsRes.ok ? await jobsRes.json() : [];
                const applicationsData = applicationsRes.ok ? await applicationsRes.json() : [];
                const jobs = Array.isArray(jobsData) ? jobsData : (jobsData.jobs || []);
                const applications = Array.isArray(applicationsData) ? applicationsData : (applicationsData.applications || []);
                setStats({
                    totalJobs: jobs.length,
                    totalApplications: applications.length,
                    pendingReviews: applications.filter((app) => app.status === 'Pending').length
                });
            } catch (error) {
                setStats({ totalJobs: 0, totalApplications: 0, pendingReviews: 0 });
            }
        };
        fetchStats();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleDownloadReport = async () => {
        const doc = new jsPDF();
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const generatedAt = new Date().toLocaleString();
        const token = localStorage.getItem('token');
        let reportCompanyName = userData.companyName || userData.name || 'Employer';

        if (token) {
            try {
                const profileResponse = await fetch('http://localhost:5000/api/employers/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (profileResponse.ok) {
                    const profileData = await profileResponse.json();
                    reportCompanyName = profileData?.employer?.companyName || reportCompanyName;
                }
            } catch (error) {
                // Keep fallback company name if profile fetch fails.
            }
        }

        let y = 20;
        doc.setFontSize(18);
        doc.text('Employer Dashboard Summary Report', 14, y);
        y += 12;

        doc.setFontSize(11);
        doc.text(`Generated: ${generatedAt}`, 14, y);
        y += 8;
        doc.text(`Company Name: ${reportCompanyName}`, 14, y);
        y += 14;

        doc.setFontSize(13);
        doc.text('Stats', 14, y);
        y += 9;

        doc.setFontSize(11);
        doc.text(`- Total Jobs Posted: ${stats.totalJobs}`, 14, y);
        y += 7;
        doc.text(`- Total Applications Received: ${stats.totalApplications}`, 14, y);
        y += 7;
        doc.text(`- Pending Reviews: ${stats.pendingReviews}`, 14, y);
        y += 16;

        let history = [];
        if (token) {
            try {
                const response = await fetch('http://localhost:5000/api/applications/employer/interview-history', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                history = Array.isArray(data) ? data : (data.history || []);
            } catch (error) {
                history = [];
            }
        }

        doc.setFontSize(13);
        doc.text('Interview - Sent Email Details', 14, y);
        y += 9;

        doc.setFontSize(10);
        if (!history.length) {
            doc.text('No sent email details found.', 14, y);
            y += 8;
        } else {
            history.forEach((item, index) => {
                const details = item.interviewDetails || {};
                const sentDateRaw = item.updatedAt || item.createdAt;
                const sentDate = sentDateRaw ? new Date(sentDateRaw).toLocaleString() : 'N/A';

                const lines = [
                    `${index + 1}. Student Name: ${item.student?.name || 'N/A'}`,
                    `Student Email: ${item.student?.email || 'N/A'}`,
                    `Job Title: ${item.job?.title || 'N/A'}`,
                    `Interview Date: ${details.date || 'N/A'}`,
                    `Interview Time: ${details.time || 'N/A'}`,
                    `Venue: ${details.venue || 'N/A'}`,
                    `Message: ${details.message || 'N/A'}`,
                    `Sent On: ${sentDate}`
                ];

                lines.forEach((line) => {
                    if (y > 278) {
                        doc.addPage();
                        y = 20;
                    }
                    doc.text(line, 14, y);
                    y += 6;
                });

                if (y > 278) {
                    doc.addPage();
                    y = 20;
                }
                doc.line(14, y, 196, y);
                y += 8;
            });
        }

        doc.setFontSize(10);
        if (y > 280) {
            doc.addPage();
            y = 20;
        }
        doc.text('Report generated from InternHub Employer Portal', 14, y);

        doc.save(`employer-dashboard-summary-${new Date().toISOString().slice(0, 10)}.pdf`);
    };

    const companyName = employerData.companyName || employerData.name || 'Employer';

    const statCards = [
        { title: 'Total Jobs Posted', value: stats.totalJobs, icon: '💼' },
        { title: 'Total Applications', value: stats.totalApplications, icon: '📄' },
        { title: 'Pending Reviews', value: stats.pendingReviews, icon: '⏳' }
    ];

    const navCards = [
        { title: 'Post a Job', description: 'Create a new internship listing', path: '/employer/post-job', icon: '✍️' },
        { title: 'My Jobs', description: 'Manage your posted opportunities', path: '/employer/my-jobs', icon: '📋' },
        { title: 'View Applications', description: 'Review student applications', path: '/employer/applications', icon: '👥' },
        { title: 'My Profile', description: 'Edit your company details', path: '/employer/profile', icon: '🏢' }
    ];

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
                    <Link to="/employer/applications" className="nav-link">Applications</Link>
                    <Link to="/employer/profile" className="nav-link">Profile</Link>
                    <button onClick={handleLogout} className="nav-logout-btn">Sign Out</button>
                </div>
            </nav>

            {/* Page Header */}
            <div style={styles.pageHeader}>
                <div style={styles.pageHeaderInner}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <h1 style={styles.pageTitle}>Welcome back, {companyName}! 👋</h1>
                            <button
                                onClick={handleDownloadReport}
                                title="Download Summary Report"
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    border: '1px solid #E7E2D9',
                                    background: '#FEF3C7',
                                    color: '#D97706',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                ⬇️
                            </button>
                        </div>
                        <p style={styles.pageSubtitle}>Manage jobs, applications, and your company profile from one place.</p>
                    </div>
                    <Link to="/employer/post-job" className="btn btn-amber">
                        ✍️ Post a Job
                    </Link>
                </div>
            </div>

            <div className="main-content">

                {/* Stats */}
                <div className="grid-3">
                    {statCards.map((card) => (
                        <div key={card.title} style={styles.statCard}>
                            <div style={styles.statIcon}>{card.icon}</div>
                            <div style={styles.statValue}>{card.value}</div>
                            <div style={styles.statLabel}>{card.title}</div>
                        </div>
                    ))}
                </div>

                {/* Nav Cards */}
                <div>
                    <h2 style={styles.sectionTitle}>Quick Actions</h2>
                    <div className="grid-4" style={{ gap: '16px', marginTop: '16px' }}>
                        {navCards.map((item) => (
                            <div key={item.path} style={styles.actionCard}>
                                <div style={styles.actionIconBox}>{item.icon}</div>
                                <div>
                                    <p style={styles.actionTitle}>{item.title}</p>
                                    <p style={styles.actionDesc}>{item.description}</p>
                                </div>
                                <Link to={item.path} className="btn btn-amber btn-sm" style={{ marginTop: '8px', alignSelf: 'flex-start' }}>
                                    Go →
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    pageHeader: { background: '#ffffff', borderBottom: '1px solid #E7E2D9', padding: '32px 0' },
    pageHeaderInner: { maxWidth: '1280px', margin: '0 auto', padding: '0 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    pageTitle: { fontSize: '28px', fontWeight: '800', color: '#1C1917', letterSpacing: '-0.5px', margin: 0 },
    pageSubtitle: { fontSize: '14px', color: '#6B7280', marginTop: '4px' },
    statCard: { background: '#ffffff', border: '1px solid #E7E2D9', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' },
    statIcon: { fontSize: '24px', color: '#F59E0B' },
    statValue: { fontSize: '36px', fontWeight: '800', color: '#1C1917', letterSpacing: '-1px', lineHeight: '1' },
    statLabel: { fontSize: '13px', color: '#6B7280', fontWeight: '500' },
    sectionTitle: { fontSize: '18px', fontWeight: '700', color: '#1C1917' },
    actionCard: { background: '#ffffff', border: '1px solid #E7E2D9', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' },
    actionIconBox: { width: '40px', height: '40px', background: '#FEF3C7', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
    actionTitle: { fontSize: '14px', fontWeight: '700', color: '#1C1917', margin: 0 },
    actionDesc: { fontSize: '12px', color: '#6B7280', margin: 0 }
};

export default EmployerDashboard;