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
    FiRotateCw,
    FiCalendar,
    FiClock,
    FiCheckCircle,
    FiArrowRight,
    FiAward
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getRecommendedJobs, getSavedJobs } from '../../services/jobService';
import { getNotifications } from '../../services/notificationService';
import useEnsureDemoAuth from '../hooks/useEnsureDemoAuth';
import AiCareerChat from '../components/AiCareerChat';
import { useAuth } from '../../context/AuthContext';
import './dashboard.css';

function MetricCard({ icon, label, value, helper, colorClass, delay = 0 }) {
    return (
        <article className="dashboard-metric-card dashboard-slide-up" style={{ animationDelay: `${delay}ms` }}>
            <div className={`dashboard-metric-icon ${colorClass}`}>{icon}</div>
            <div className="dashboard-metric-content">
                <p className="dashboard-metric-label">{label}</p>
                <p className="dashboard-metric-value">{value}</p>
                <p className="dashboard-metric-helper">{helper}</p>
            </div>
        </article>
    );
}

function WeeklyActivityChart({ weeklyData, maxValue }) {
    const chartHeight = 220;
    const chartWidth = 860;
    const leftPad = 34;
    const rightPad = 16;
    const topPad = 22;
    const bottomPad = 44;
    const usableWidth = chartWidth - leftPad - rightPad;
    const usableHeight = chartHeight - topPad - bottomPad;
    const stepX = weeklyData.length > 1 ? usableWidth / (weeklyData.length - 1) : 0;

    const points = weeklyData.map((item, index) => {
        const ratio = maxValue > 0 ? item.value / maxValue : 0;
        const x = leftPad + index * stepX;
        const y = topPad + (1 - ratio) * usableHeight;
        return { ...item, x, y };
    });

    const linePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

    return (
        <section className="dashboard-panel dashboard-chart-panel-full dashboard-slide-up" style={{ animationDelay: '140ms' }}>
            <div className="dashboard-panel-head">
                <h3 className="dashboard-panel-title"><FiTrendingUp /> Weekly Activity</h3>
                <span className="dashboard-panel-meta">Last 7 days</span>
            </div>
            <div className="dashboard-line-chart-wrap">
                <svg className="dashboard-line-chart-svg" viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label="Weekly activity line chart">
                    <line className="dashboard-line-axis" x1={leftPad} y1={topPad + usableHeight} x2={chartWidth - rightPad} y2={topPad + usableHeight} />
                    <polyline className="dashboard-line-path" points={linePoints} />
                    {points.map((point) => (
                        <g key={point.day}>
                            <circle className="dashboard-line-point" cx={point.x} cy={point.y} r="4" />
                            <text className="dashboard-line-value" x={point.x} y={point.y - 10} textAnchor="middle">{point.value}</text>
                            <text className="dashboard-line-day" x={point.x} y={topPad + usableHeight + 24} textAnchor="middle">{point.day}</text>
                        </g>
                    ))}
                </svg>
            </div>
        </section>
    );
}

function ReadinessGauge({ completion, applicationsSent, recommendations }) {
    const circleSize = 136;
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const progressOffset = circumference - (completion / 100) * circumference;

    return (
        <section className="dashboard-panel dashboard-gauge-panel dashboard-slide-up" style={{ animationDelay: '180ms' }}>
            <div className="dashboard-panel-head">
                <h3 className="dashboard-panel-title"><FiAward /> Candidate Readiness</h3>
                <span className="dashboard-panel-meta">Updated now</span>
            </div>
            <div className="dashboard-gauge-wrap">
                <svg width={circleSize} height={circleSize} className="dashboard-gauge-svg" aria-hidden="true">
                    <circle className="dashboard-gauge-bg" cx={circleSize / 2} cy={circleSize / 2} r={radius} />
                    <circle className="dashboard-gauge-fill" cx={circleSize / 2} cy={circleSize / 2} r={radius} strokeDasharray={circumference} strokeDashoffset={progressOffset} />
                </svg>
                <div className="dashboard-gauge-label"><strong>{completion}%</strong><span>Profile Complete</span></div>
            </div>
            <div className="dashboard-gauge-stats">
                <div><span>Applications</span><strong>{applicationsSent}</strong></div>
                <div><span>Recommendations</span><strong>{recommendations}</strong></div>
            </div>
        </section>
    );
}

function ApplicationPipeline({ saved, applied, interviews, offers }) {
    const stages = [
        { key: 'saved', label: 'Saved', value: saved, colorClass: 'dashboard-pipe-blue' },
        { key: 'applied', label: 'Applied', value: applied, colorClass: 'dashboard-pipe-teal' },
        { key: 'interviews', label: 'Interviews', value: interviews, colorClass: 'dashboard-pipe-violet' },
        { key: 'offers', label: 'Offers', value: offers, colorClass: 'dashboard-pipe-amber' }
    ];
    const maxValue = Math.max(...stages.map((s) => s.value), 1);

    return (
        <section className="dashboard-panel dashboard-pipeline-panel dashboard-slide-up" style={{ animationDelay: '220ms' }}>
            <div className="dashboard-panel-head">
                <h3 className="dashboard-panel-title"><FiBriefcase /> Application Pipeline</h3>
                <span className="dashboard-panel-meta">Conversion overview</span>
            </div>
            <div className="dashboard-pipeline-list">
                {stages.map((stage) => {
                    const widthPercent = Math.max(6, Math.round((stage.value / maxValue) * 100));
                    return (
                        <div key={stage.key} className="dashboard-pipeline-row">
                            <div className="dashboard-pipeline-labels"><span>{stage.label}</span><strong>{stage.value}</strong></div>
                            <div className="dashboard-pipeline-track">                                <div className={`dashboard-pipeline-fill ${stage.colorClass}`} style={{ width: `${widthPercent}%` }} />                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

function PriorityBoard({ tasks }) {
    return (
        <section className="dashboard-panel dashboard-priority-panel dashboard-slide-up" style={{ animationDelay: '260ms' }}>
            <div className="dashboard-panel-head">
                <h3 className="dashboard-panel-title"><FiCalendar /> Priority Checklist</h3>
                <span className="dashboard-panel-meta">Today</span>
            </div>
            <div className="dashboard-task-list">
                {tasks.map((task) => (
                    <article key={task.id} className="dashboard-task-item">
                        <div className={`dashboard-task-dot ${task.status}`} />
                        <div className="dashboard-task-body">
                            <p className="dashboard-task-title">{task.title}</p>
                            <p className="dashboard-task-meta"><FiClock /> {task.when}</p>
                        </div>
                        {task.done && <FiCheckCircle className="dashboard-task-done" />}
                    </article>
                ))}
            </div>
        </section>
    );
}

function QuickActions({ onActionClick }) {
    const actions = [
        { id: 'search', title: 'Search Jobs', subtitle: 'Find new openings', icon: <FiSearch />, path: '/job-matching/search' },
        { id: 'recommended', title: 'Recommendations', subtitle: 'View AI picks', icon: <FiStar />, path: '/job-matching/recommended' },
        { id: 'saved', title: 'Saved Jobs', subtitle: 'Continue your shortlist', icon: <FiBookmark />, path: '/job-matching/saved' },
        { id: 'practice-interview', title: 'Practice Interview', subtitle: 'Timed MCQ papers', icon: <FiEdit3 />, path: '/job-matching/practice-interview' },
        { id: 'notifications', title: 'Notifications', subtitle: 'Review latest alerts', icon: <FiBell />, path: '/job-matching/notifications' }
    ];

    return (
        <section className="dashboard-panel dashboard-actions-panel dashboard-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="dashboard-panel-head">
                <h3 className="dashboard-panel-title"><FiTarget /> Quick Actions</h3>
                <span className="dashboard-panel-meta">Shortcuts</span>
            </div>
            <div className="dashboard-actions-list">
                {actions.map((action) => (
                    <button key={action.id} className="dashboard-action-item" onClick={() => onActionClick(action.path)}>
                        <span className="dashboard-action-icon">{action.icon}</span>
                        <span className="dashboard-action-copy">
                            <span className="dashboard-action-title">{action.title}</span>
                            <span className="dashboard-action-subtitle">{action.subtitle}</span>
                        </span>
                        <FiArrowRight className="dashboard-action-arrow" />
                    </button>
                ))}
            </div>
        </section>
    );
}

function RecentActivityFeed({ activities, onActivityClick, formatRelativeTime }) {
    const [displayTimes, setDisplayTimes] = useState({});

    useEffect(() => {
        const refreshTimes = () => {
            const nextTimes = {};
            activities.forEach((activity, index) => {
                nextTimes[index] = formatRelativeTime(activity.timestamp);
            });
            setDisplayTimes(nextTimes);
        };
        refreshTimes();
        const timer = setInterval(refreshTimes, 30000);
        return () => clearInterval(timer);
    }, [activities, formatRelativeTime]);

    return (
        <section className="dashboard-panel dashboard-activity-panel dashboard-slide-up" style={{ animationDelay: '340ms' }}>
            <div className="dashboard-panel-head">
                <h3 className="dashboard-panel-title"><FiTrendingUp /> Recent Activity</h3>
                <span className="dashboard-panel-meta">Live feed</span>
            </div>
            <div className="dashboard-activity-list">
                {activities.map((activity, index) => (
                    <article
                        key={`${activity.title}-${index}`}
                        className="dashboard-activity-item"
                        onClick={() => onActivityClick(activity.path)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                onActivityClick(activity.path);
                            }
                        }}
                    >
                        <div className="dashboard-activity-icon" style={{ background: activity.color || '#0F4C81' }}>{activity.icon}</div>
                        <div className="dashboard-activity-body">
                            <h4>{activity.title}</h4>
                            <p>{activity.description}</p>
                        </div>
                        <span className="dashboard-activity-time">{displayTimes[index] || activity.time}</span>
                    </article>
                ))}
                {activities.length === 0 && <article className="dashboard-activity-empty"><FiClock /> Activity will appear as you save jobs and receive updates.</article>}
            </div>
        </section>
    );
}

function HeroSection({ stats, navigate }) {
    return (
        <section className="dashboard-hero-panel dashboard-slide-up" style={{ animationDelay: '80ms' }}>
            <div className="dashboard-hero-copy">
                <div className="dashboard-hero-badge">CareerSync Control Center</div>
                <h2>Track momentum and focus your next application move.</h2>
                <p>You currently have <strong>{stats.recommendedJobsCount}</strong> tailored opportunities and <strong>{stats.notificationsCount}</strong> unread updates.</p>
            </div>
            <div className="dashboard-hero-actions">
                <div className="dashboard-hero-actions-row">
                    <button className="dashboard-hero-secondary-btn" onClick={() => navigate('/job-matching/recommended')}><FiZap /> View Recommendations</button>
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
    const [stats, setStats] = useState({ totalApplicationsSent: 0, savedJobsCount: 0, recommendedJobsCount: 0, notificationsCount: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [recentActivities, setRecentActivities] = useState([]);

    const profileCompletion = Math.min(100, Math.max(45, (Array.isArray(user?.skills) ? user.skills.length * 9 : 0) + 42));

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
        if (!silent) setLoading(true);
        setError('');

        try {
            const [saved, recommended, notifications] = await Promise.all([getSavedJobs(), getRecommendedJobs(), getNotifications().catch(() => [])]);
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
                        color: '#166534',
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
                        color: '#b45309',
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
                    color: '#5b21b6',
                    path: '/job-matching/recommended'
                });
            }

            setRecentActivities(activityItems.sort((a, b) => b.sortAt - a.sortAt).slice(0, 6).map(({ sortAt, ...rest }) => rest));
        } catch (e) {
            setError(e?.response?.data?.message || 'Unable to load dashboard');
        } finally {
            if (!silent) setLoading(false);
        }
    }, [ready]);

    useEffect(() => {
        if (!ready) return;
        loadDashboardData();
        const intervalId = setInterval(() => loadDashboardData({ silent: true }), 20000);
        const refreshOnFocus = () => {
            if (document.visibilityState === 'visible') loadDashboardData({ silent: true });
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
        if (path) navigate(path);
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

    const interviewsCount = Math.max(0, Math.floor(stats.totalApplicationsSent * 0.35));
    const offersCount = Math.max(0, Math.floor(interviewsCount * 0.25));
    const matchRate = Math.min(96, Math.max(52, 58 + (stats.recommendedJobsCount > 0 ? 14 : 0) + Math.floor(profileCompletion / 8)));

    const now = new Date();
    const last7Dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now);
        d.setDate(now.getDate() - (6 - i));
        return d;
    });

    const weeklyData = last7Dates.map((d) => {
        const shortDay = d.toLocaleDateString('en-US', { weekday: 'short' });
        const dayKey = d.toDateString();
        const count = recentActivities.filter((activity) => new Date(activity.timestamp).toDateString() === dayKey).length;
        return { day: shortDay, value: count };
    });

    const hasAnyWeeklyActivity = weeklyData.some((item) => item.value > 0);
    const normalizedWeeklyData = hasAnyWeeklyActivity ? weeklyData : weeklyData.map((item, index) => ({ ...item, value: [1, 2, 1, 3, 2, 4, 3][index] }));
    const weeklyMax = Math.max(...normalizedWeeklyData.map((item) => item.value), 1);

    const priorityTasks = [
        {
            id: 'task-1',
            title: stats.notificationsCount > 0 ? 'Review unread notifications' : 'Check latest recommendations',
            when: 'Next 30 minutes',
            status: stats.notificationsCount > 0 ? 'warn' : 'normal',
            done: false
        },
        {
            id: 'task-2',
            title: stats.savedJobsCount > 0 ? 'Apply to one saved job' : 'Save at least 2 relevant jobs',
            when: 'Today',
            status: 'normal',
            done: false
        },
        {
            id: 'task-3',
            title: profileCompletion >= 80 ? 'Profile quality is strong' : 'Update profile skills and preferences',
            when: 'Before end of day',
            status: profileCompletion >= 80 ? 'done' : 'normal',
            done: profileCompletion >= 80
        }
    ];

    return (
        <div className="page dashboard-page">
            <div className="container dashboard-container">
                {authError && <div className="dashboard-alert dashboard-alert-error"><FiAlertTriangle /> {authError}</div>}
                {error && <div className="dashboard-alert dashboard-alert-error"><FiAlertTriangle /> {error}</div>}
                {!ready && <div className="dashboard-alert dashboard-alert-info"><FiZap /><span>Starting demo session...</span></div>}
                {loading && <div className="dashboard-alert dashboard-alert-info"><FiRotateCw className="dashboard-spin" /><span>Loading dashboard...</span></div>}

                {ready && !loading && (
                    <>
                        <header className="dashboard-header dashboard-slide-up">
                            <div className="dashboard-header-title-wrap">
                                <h1 className="dashboard-title">Career Command Dashboard</h1>
                                <p className="dashboard-subtitle">A complete view of your applications, opportunities, and next actions.</p>
                            </div>
                            <div className="dashboard-header-search-wrap">
                                <div className="dashboard-search-box dashboard-search-box-header">
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
                                {isSearchFocused && (
                                    <button
                                        className="dashboard-header-advanced-btn"
                                        onMouseDown={(event) => {
                                            event.preventDefault();
                                            navigate('/job-matching/search');
                                        }}
                                    >
                                        Advanced
                                    </button>
                                )}
                            </div>
                            <button className="dashboard-header-btn" onClick={() => navigate('/job-matching/search')}><FiTarget /> Start New Search</button>
                        </header>

                        <HeroSection stats={stats} navigate={navigate} />

                        <section className="dashboard-metrics-grid">
                            <MetricCard icon={<FiEdit3 />} label="Applications Sent" value={stats.totalApplicationsSent} helper="Across your active search" colorClass="dashboard-metric-blue" delay={0} />
                            <MetricCard icon={<FiBookmark />} label="Saved Roles" value={stats.savedJobsCount} helper="Ready for follow-up" colorClass="dashboard-metric-green" delay={50} />
                            <MetricCard icon={<FiStar />} label="Recommended" value={stats.recommendedJobsCount} helper={`Match score ${matchRate}%`} colorClass="dashboard-metric-violet" delay={100} />
                            <MetricCard icon={<FiBell />} label="Unread Alerts" value={stats.notificationsCount} helper="Latest system updates" colorClass="dashboard-metric-amber" delay={150} />
                        </section>

                        <section className="dashboard-insights-grid">
                            <WeeklyActivityChart weeklyData={normalizedWeeklyData} maxValue={weeklyMax} />
                            <div className="dashboard-chat-wrap dashboard-slide-up" style={{ animationDelay: '120ms' }}>
                                <AiCareerChat studentSkills={Array.isArray(user?.skills) ? user.skills : []} stats={stats} recentActivities={recentActivities} />
                            </div>
                        </section>

                        <section className="dashboard-analytics-grid">
                            <ReadinessGauge completion={profileCompletion} applicationsSent={stats.totalApplicationsSent} recommendations={stats.recommendedJobsCount} />
                            <ApplicationPipeline saved={stats.savedJobsCount} applied={stats.totalApplicationsSent} interviews={interviewsCount} offers={offersCount} />
                            <PriorityBoard tasks={priorityTasks} />
                        </section>

                        <section className="dashboard-operations-grid">
                            <QuickActions onActionClick={handleActionClick} />
                            <RecentActivityFeed activities={recentActivities} onActivityClick={handleActionClick} formatRelativeTime={formatRelativeTime} />
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}



