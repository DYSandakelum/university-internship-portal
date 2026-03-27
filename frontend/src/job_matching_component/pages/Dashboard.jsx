import React, { useCallback, useEffect, useState } from 'react';
import {
    FiBriefcase,
    FiBell,
    FiTrendingUp,
    FiSearch,
    FiBookmark,
    FiTarget,
    FiStar,
    FiEdit3,
    FiAlertTriangle,
    FiZap,
    FiRotateCw
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getRecommendedJobs, getSavedJobs } from '../../services/jobService';
import { getNotifications } from '../../services/notificationService';
import useEnsureDemoAuth from '../hooks/useEnsureDemoAuth';
import AiCareerChat from '../components/AiCareerChat';
import { useAuth } from '../../context/AuthContext';
import './dashboard.css';

function StatCard({ icon, label, value, colorClass, delay = 0, loading = false }) {
    return (
        <article className="dashboard-stat-card dashboard-slide-up" style={{ animationDelay: `${delay}ms` }}>
            <div className={`dashboard-stat-icon-box ${colorClass}`}>{icon}</div>
            <div className="dashboard-stat-content">
                <p className="dashboard-stat-label">{label}</p>
                {loading ? <div className="dashboard-stat-loading-placeholder" /> : <p className="dashboard-stat-value">{value}</p>}
            </div>
        </article>
    );
}

function ActivityTimeline({ activities, onActivityClick, formatRelativeTime }) {
    const [displayTimes, setDisplayTimes] = useState({});

    useEffect(() => {
        const refreshTimes = () => {
            const newTimes = {};
            activities.forEach((activity, index) => {
                newTimes[index] = formatRelativeTime(activity.timestamp);
            });
            setDisplayTimes(newTimes);
        };

        refreshTimes();
        const timer = setInterval(refreshTimes, 30000);

        return () => clearInterval(timer);
    }, [activities, formatRelativeTime]);

    return (
        <section className="dashboard-timeline-panel dashboard-slide-up" style={{ animationDelay: '180ms' }}>
            <h3 className="dashboard-panel-title">
                <FiTrendingUp /> Recent Activity
            </h3>

            <div className="dashboard-timeline-track">
                {activities.map((activity, index) => (
                    <article
                        key={index}
                        className="dashboard-timeline-item dashboard-slide-up"
                        onClick={() => onActivityClick?.(activity.path)}
                        style={{
                            animationDelay: `${240 + index * 60}ms`,
                            cursor: activity.path ? 'pointer' : 'default'
                        }}
                    >
                        <div className="dashboard-timeline-dot" style={{ background: activity.color || '#3B82F6' }}>
                            {activity.icon}
                        </div>
                        <div className="dashboard-timeline-content">
                            <h4 className="dashboard-timeline-title">{activity.title}</h4>
                            <p className="dashboard-timeline-description">{activity.description}</p>
                            <p className="dashboard-timeline-time">{displayTimes[index] || activity.time}</p>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

function QuickActions({ onActionClick, profileCompletion }) {
    const actions = [
        {
            id: 'search',
            title: 'Search Jobs',
            subtitle: 'Find roles by skills and title',
            icon: <FiSearch />,
            path: '/job-matching/search'
        },
        {
            id: 'recommended',
            title: 'AI Recommendations',
            subtitle: 'See your best-fit opportunities',
            icon: <FiStar />,
            path: '/job-matching/recommended'
        },
        {
            id: 'saved',
            title: 'Saved Jobs',
            subtitle: 'Review bookmarked positions',
            icon: <FiBookmark />,
            path: '/job-matching/saved'
        },
        {
            id: 'notifications',
            title: 'Notifications',
            subtitle: 'Check alerts and reminders',
            icon: <FiBell />,
            path: '/job-matching/notifications'
        }
    ];

    return (
        <section className="dashboard-actions-panel dashboard-slide-up" style={{ animationDelay: '140ms' }}>
            <h3 className="dashboard-panel-title">
                <FiTarget /> Quick Actions
            </h3>

            <div className="dashboard-actions-list">
                {actions.map((action, index) => (
                    <button
                        key={action.id}
                        className="dashboard-action-item dashboard-slide-up"
                        onClick={() => onActionClick(action.path)}
                        style={{ animationDelay: `${220 + index * 50}ms` }}
                    >
                        <span className="dashboard-action-icon-box">{action.icon}</span>
                        <span className="dashboard-action-text-group">
                            <span className="dashboard-action-title">{action.title}</span>
                            <span className="dashboard-action-subtitle">{action.subtitle}</span>
                        </span>
                        <span className="dashboard-action-arrow">&#8594;</span>
                    </button>
                ))}
            </div>

            <div className="dashboard-profile-info-card">
                <FiBriefcase className="dashboard-profile-info-icon" />
                <div>
                    <h4>Profile completion: {profileCompletion}%</h4>
                    <p>Complete your skills and preferences to improve recommendation quality.</p>
                </div>
            </div>
        </section>
    );
}

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { ready, error: authError } = useEnsureDemoAuth();
    const [dashboardSearch, setDashboardSearch] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [stats, setStats] = useState({
        totalApplicationsSent: 0,
        savedJobsCount: 0,
        recommendedJobsCount: 0,
        notificationsCount: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [recentActivities, setRecentActivities] = useState([]);

    const profileCompletion = Math.min(100, Math.max(40, (Array.isArray(user?.skills) ? user.skills.length * 10 : 0) + 40));

    const formatRelativeTime = (dateInput) => {
        if (!dateInput) return 'Just now';

        const date = new Date(dateInput);
        const now = new Date();
        const diffMs = now - date;
        const minutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));

        if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        const days = Math.floor(hours / 24);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    };

    const loadDashboardData = useCallback(async ({ silent = false } = {}) => {
        if (!ready) return;

        if (!silent) {
            setLoading(true);
        }

        setError('');

        try {
            const [saved, recommended, notifications] = await Promise.all([
                getSavedJobs(),
                getRecommendedJobs(),
                getNotifications().catch(() => [])
            ]);

            setStats({
                totalApplicationsSent: Math.floor(Math.random() * 12) + 1,
                savedJobsCount: Array.isArray(saved) ? saved.length : 0,
                recommendedJobsCount: Array.isArray(recommended) ? recommended.length : 0,
                notificationsCount: Array.isArray(notifications) ? notifications.filter((n) => !n.isRead).length : 0
            });

            const activityItems = [];

            if (Array.isArray(saved)) {
                saved.forEach((savedJob) => {
                    const title = savedJob?.jobId?.title || 'Saved job';
                    const company = savedJob?.jobId?.company || 'Company';
                    const timestamp = savedJob?.dateSaved || savedJob?.createdAt || new Date();
                    activityItems.push({
                        icon: <FiBookmark />,
                        title: 'Job Saved',
                        description: `${title} at ${company}`,
                        time: formatRelativeTime(timestamp),
                        timestamp,
                        sortAt: new Date(timestamp).getTime(),
                        color: '#10B981',
                        path: '/job-matching/saved'
                    });
                });
            }

            if (Array.isArray(notifications)) {
                notifications.forEach((notification) => {
                    const createdAt = notification?.createdAt || new Date();
                    activityItems.push({
                        icon: <FiBell />,
                        title: 'Notification Received',
                        description: notification?.message || 'New update received',
                        time: formatRelativeTime(createdAt),
                        timestamp: createdAt,
                        sortAt: new Date(createdAt).getTime(),
                        color: '#F59E0B',
                        path: '/job-matching/notifications'
                    });
                });
            }

            if (Array.isArray(recommended) && recommended.length > 0) {
                const latestRecommendedAt = recommended
                    .map((job) => new Date(job?.updatedAt || job?.createdAt || Date.now()).getTime())
                    .sort((a, b) => b - a)[0];

                activityItems.push({
                    icon: <FiStar />,
                    title: 'Recommendations Updated',
                    description: `${recommended.length} personalized job matches available`,
                    time: formatRelativeTime(latestRecommendedAt),
                    timestamp: latestRecommendedAt,
                    sortAt: latestRecommendedAt,
                    color: '#8B5CF6',
                    path: '/job-matching/recommended'
                });
            }

            const dynamicActivities = activityItems
                .sort((a, b) => b.sortAt - a.sortAt)
                .slice(0, 4)
                .map(({ sortAt, ...rest }) => rest);

            setRecentActivities(dynamicActivities);
        } catch (e) {
            setError(e?.response?.data?.message || 'Unable to load dashboard');
        } finally {
            if (!silent) {
                setLoading(false);
            }
        }
    }, [ready]);

    useEffect(() => {
        if (!ready) return;

        loadDashboardData();

        const intervalId = setInterval(() => {
            loadDashboardData({ silent: true });
        }, 20000);

        const refreshOnFocus = () => {
            if (document.visibilityState === 'visible') {
                loadDashboardData({ silent: true });
            }
        };

        window.addEventListener('focus', refreshOnFocus);
        document.addEventListener('visibilitychange', refreshOnFocus);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('focus', refreshOnFocus);
            document.removeEventListener('visibilitychange', refreshOnFocus);
        };
    }, [ready, loadDashboardData]);

    const handleActionClick = (path) => {
        navigate(path);
    };

    const handleDashboardSearch = () => {
        const q = dashboardSearch.trim();
        if (!q) {
            navigate('/job-matching/search');
            return;
        }

        navigate(`/job-matching/search?q=${encodeURIComponent(q)}`);
    };

    const handleDashboardSearchKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleDashboardSearch();
        }
    };

    return (
        <div className="page dashboard-page">
            <div className="container dashboard-container">
                {authError && (
                    <div className="dashboard-alert dashboard-alert-error">
                        <FiAlertTriangle /> {authError}
                    </div>
                )}

                {error && (
                    <div className="dashboard-alert dashboard-alert-error">
                        <FiAlertTriangle /> {error}
                    </div>
                )}

                {!ready && (
                    <div className="dashboard-alert dashboard-alert-info">
                        <FiZap />
                        <span>Starting demo session...</span>
                    </div>
                )}

                {loading && (
                    <div className="dashboard-alert dashboard-alert-info">
                        <FiRotateCw className="dashboard-spin" />
                        <span>Loading dashboard...</span>
                    </div>
                )}

                {ready && !loading && (
                    <>
                        <header className="dashboard-header dashboard-slide-up">
                            <h1 className="dashboard-title">Career Dashboard</h1>
                            <p className="dashboard-subtitle">Track progress, discover opportunities, and take the next best action.</p>
                        </header>

                        <section className="dashboard-hero-panel dashboard-slide-up" style={{ animationDelay: '80ms' }}>
                            <div className="dashboard-hero-content">
                                <div className="dashboard-hero-icon-circle">
                                    <FiTarget />
                                </div>
                                <div>
                                    <h2 className="dashboard-hero-title">Ready to find your dream job?</h2>
                                    <p className="dashboard-hero-description">
                                        Our AI-powered job matching system has analyzed your profile and found
                                        {stats.recommendedJobsCount > 0 ? ` ${stats.recommendedJobsCount} personalized` : ' amazing'} job
                                        recommendations for you.
                                    </p>
                                </div>
                            </div>

                            <div className="dashboard-hero-actions">
                                <div className="dashboard-search-box">
                                    <FiSearch className="dashboard-search-icon" />
                                    <input
                                        type="text"
                                        value={dashboardSearch}
                                        onChange={(event) => setDashboardSearch(event.target.value)}
                                        onKeyDown={handleDashboardSearchKeyDown}
                                        onFocus={() => setIsSearchFocused(true)}
                                        onBlur={() => setIsSearchFocused(false)}
                                        placeholder="Search internships by title, skill, or company"
                                        className="dashboard-search-input"
                                    />
                                </div>

                                <div className="dashboard-hero-actions-row">
                                    <button className="dashboard-hero-cta-btn" onClick={() => handleActionClick('/job-matching/recommended')}>
                                        <FiZap /> View Recommendations
                                    </button>

                                    <button
                                        className="dashboard-hero-notification-btn"
                                        onClick={() => navigate('/job-matching/notifications')}
                                        title="Notifications"
                                        aria-label="Open notifications"
                                    >
                                        <FiBell />
                                        {stats.notificationsCount > 0 && <span className="dashboard-hero-notification-dot" />}
                                    </button>

                                    {isSearchFocused && (
                                        <button
                                            className="dashboard-hero-advanced-btn"
                                            onMouseDown={(event) => {
                                                event.preventDefault();
                                                navigate('/job-matching/search');
                                            }}
                                        >
                                            Advanced
                                        </button>
                                    )}
                                </div>
                            </div>
                        </section>

                        <section className="dashboard-stats-grid">
                            <StatCard
                                icon={<FiEdit3 />}
                                label="Applications Sent"
                                value={stats.totalApplicationsSent}
                                colorClass="dashboard-stat-icon-blue"
                                delay={0}
                                loading={false}
                            />
                            <StatCard
                                icon={<FiBookmark />}
                                label="Saved Jobs"
                                value={stats.savedJobsCount}
                                colorClass="dashboard-stat-icon-green"
                                delay={60}
                                loading={false}
                            />
                            <StatCard
                                icon={<FiStar />}
                                label="Recommended Jobs"
                                value={stats.recommendedJobsCount}
                                colorClass="dashboard-stat-icon-purple"
                                delay={120}
                                loading={false}
                            />
                            <StatCard
                                icon={<FiBell />}
                                label="New Notifications"
                                value={stats.notificationsCount}
                                colorClass="dashboard-stat-icon-amber"
                                delay={180}
                                loading={false}
                            />
                        </section>

                        <section className="dashboard-main-grid">
                            <QuickActions onActionClick={handleActionClick} profileCompletion={profileCompletion} />
                            <ActivityTimeline activities={recentActivities} onActivityClick={handleActionClick} formatRelativeTime={formatRelativeTime} />
                        </section>

                        <div className="dashboard-chat-wrap dashboard-slide-up" style={{ animationDelay: '320ms' }}>
                            <AiCareerChat
                                studentSkills={Array.isArray(user?.skills) ? user.skills : []}
                                stats={stats}
                                recentActivities={recentActivities}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
