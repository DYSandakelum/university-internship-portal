import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
        if (!token) {
            navigate('/login');
            return;
        }

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

                const jobs = Array.isArray(jobsData)
                    ? jobsData
                    : (jobsData.jobs || []);
                const applications = Array.isArray(applicationsData)
                    ? applicationsData
                    : (applicationsData.applications || []);

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

    const companyName = employerData.companyName || employerData.name || 'Employer';

    const statCards = [
        {
            title: 'Total Jobs Posted',
            value: stats.totalJobs,
            icon: '💼',
            headerBg: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)'
        },
        {
            title: 'Total Applications Received',
            value: stats.totalApplications,
            icon: '📄',
            headerBg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
        },
        {
            title: 'Pending Reviews',
            value: stats.pendingReviews,
            icon: '⏳',
            headerBg: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)'
        }
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
                <div className="navbar-brand">🎓 Internship Portal</div>
                <div className="navbar-links" style={{ gap: '10px' }}>
                    <Link to="/employer/dashboard" className="nav-link nav-link-active">Dashboard</Link>
                    <Link to="/employer/profile" className="nav-link">Profile</Link>
                    <button onClick={handleLogout} className="btn btn-sm" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6366f1 100%)', color: 'white' }}>
                        Logout
                    </button>
                </div>
            </nav>

            <div className="main-content" style={{ maxWidth: '1240px' }}>
                <div className="hero-card" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6366f1 100%)', padding: '32px', borderRadius: '12px', marginBottom: '24px' }}>
                    <h1 style={{ color: 'white', margin: 0, fontSize: '28px' }}>
                        Welcome back, {companyName}! 👋
                    </h1>
                    <p style={{ color: '#e0d7ff', margin: '8px 0 0' }}>
                        Manage jobs, applications, and your company profile from one place.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                    {statCards.map((card) => (
                        <div key={card.title} className="card" style={{ overflow: 'hidden' }}>
                            <div style={{ background: card.headerBg, padding: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '20px' }}>{card.icon}</span>
                                <span style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>{card.title}</span>
                            </div>
                            <div style={{ padding: '20px', textAlign: 'center' }}>
                                <div style={{ fontSize: '36px', fontWeight: '700', color: '#1e1b4b' }}>{card.value}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                    {navCards.map((item) => (
                        <div key={item.path} className="card">
                            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <h3 style={{ margin: 0, fontSize: '17px', color: '#1e1b4b' }}>
                                    <span style={{ marginRight: '8px' }}>{item.icon}</span>
                                    {item.title}
                                </h3>
                                <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>{item.description}</p>
                                <Link
                                    to={item.path}
                                    className="btn btn-primary"
                                    style={{ width: 'fit-content', background: 'linear-gradient(135deg, #7C3AED 0%, #6366f1 100%)' }}
                                >
                                    Go
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EmployerDashboard;
