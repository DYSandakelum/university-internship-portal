import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { FiBell, FiCheck, FiSettings, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import NotificationItem from '../components/NotificationItem';
import { getNotifications } from '../../../services/notificationService';
import useEnsureDemoAuth from '../hooks/useEnsureDemoAuth';
import BackToDashboardButton from '../components/BackToDashboardButton';
import useJobMatchingRealtime from '../hooks/useJobMatchingRealtime';

// Professional Notification Header
function NotificationHeader({ unreadCount, onMarkAllRead, onSettings }) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 18px',
            background: 'white',
            border: '1px solid var(--secondary-200)',
            borderRadius: '8px',
            marginBottom: '16px'
        }}>
            <div>
                <h2 style={{ 
                    margin: '0 0 4px 0', 
                    fontSize: '17px', 
                    fontWeight: '600',
                    color: 'var(--secondary-800)' 
                }}>
                    Notifications
                </h2>
                <p style={{ 
                    margin: 0, 
                    fontSize: '14px', 
                    color: 'var(--secondary-600)' 
                }}>
                    {unreadCount > 0 ? `${unreadCount} unread messages` : 'All caught up'}
                </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
                {unreadCount > 0 && (
                    <button
                        className="btn-secondary"
                        onClick={onMarkAllRead}
                        style={{ 
                            padding: '7px 12px', 
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        <FiCheck size={14} /> Mark all read
                    </button>
                )}
                <button
                    className="btn-secondary"
                    onClick={onSettings}
                    style={{ 
                        padding: '7px 12px', 
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}
                >
                    <FiSettings size={14} /> Settings
                </button>
            </div>
        </div>
    );
}

// Simple Filter Tabs
function NotificationTabs({ activeTab, setActiveTab, counts }) {
    const tabs = [
        { id: 'all', label: 'All', count: counts.total },
        { id: 'unread', label: 'Unread', count: counts.unread },
        { id: 'new_job', label: 'Job Alerts', count: counts.newJob },
        { id: 'deadline_reminder', label: 'Deadlines', count: counts.deadline }
    ].filter(tab => tab.count > 0);

    return (
        <div style={{
            display: 'flex',
            border: '1px solid var(--secondary-200)',
            borderRadius: '8px',
            padding: '4px',
            marginBottom: '16px',
            background: 'white',
            gap: '4px',
            flexWrap: 'wrap'
        }}>
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                        padding: '8px 12px',
                        border: 'none',
                        background: activeTab === tab.id ? 'var(--primary-50)' : 'transparent',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: activeTab === tab.id ? 'var(--primary-600)' : 'var(--secondary-600)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                >
                    {tab.label}
                    {tab.count > 0 && (
                        <span style={{
                            background: activeTab === tab.id ? 'var(--primary-600)' : 'var(--secondary-400)',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: '600',
                            padding: '2px 6px',
                            borderRadius: '10px',
                            minWidth: '16px',
                            textAlign: 'center'
                        }}>
                            {tab.count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}

export default function Notifications() {
    const navigate = useNavigate();
    const { ready, isAuthenticated, error: authError } = useEnsureDemoAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    const loadNotifications = useCallback(async ({ silent = false } = {}) => {
        if (!silent) setLoading(true);
        setError('');
        try {
            const data = await getNotifications();
            setNotifications(Array.isArray(data) ? data : []);
        } catch (e) {
            setError(e?.response?.data?.message || 'Unable to load notifications');
        } finally {
            if (!silent) setLoading(false);
        }
    }, []);

    const counts = useMemo(() => {
        return {
            total: notifications.length,
            unread: notifications.filter(n => !n.isRead).length,
            newJob: notifications.filter(n => n.type === 'new_job').length,
            deadline: notifications.filter(n => n.type === 'deadline_reminder').length
        };
    }, [notifications]);

    const filteredNotifications = useMemo(() => {
        switch(activeTab) {
            case 'unread':
                return notifications.filter(n => !n.isRead);
            case 'new_job':
                return notifications.filter(n => n.type === 'new_job');
            case 'deadline_reminder':
                return notifications.filter(n => n.type === 'deadline_reminder');
            default:
                return notifications;
        }
    }, [notifications, activeTab]);

    useEffect(() => {
        if (!ready || !isAuthenticated) return;
        loadNotifications();
    }, [ready, isAuthenticated, loadNotifications]);

    useJobMatchingRealtime((packet) => {
        if (!ready || !isAuthenticated) return;
        const entity = packet?.entity;
        if (entity === 'notifications' || entity === 'notification_settings' || entity === 'saved_jobs') {
            loadNotifications({ silent: true });
        }
    });

    const handleMarkAllRead = async () => {
        // Mock implementation
        const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
        setNotifications(updatedNotifications);
    };

    const handleSettings = () => {
        navigate('/job-matching/notifications/settings');
    };

    if (authError) {
        return (
            <div className="page">
                <div className="container">
                    <div style={{
                        padding: '20px',
                        textAlign: 'center',
                        background: 'var(--error-50)',
                        border: '1px solid var(--error-200)',
                        borderRadius: '8px',
                        color: 'var(--error-600)'
                    }}>
                        {authError}
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="page">
                <div className="container">
                    <BackToDashboardButton />
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '48px 20px',
                        background: 'white',
                        borderRadius: '8px',
                        border: '1px solid var(--secondary-200)'
                    }}>
                        <div style={{ marginBottom: '16px' }}>
                            <FiBell size={32} color="var(--secondary-400)" />
                        </div>
                        <p style={{ margin: 0, color: 'var(--secondary-600)', fontSize: '14px' }}>Loading notifications...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                <BackToDashboardButton />
                <NotificationHeader 
                    unreadCount={counts.unread}
                    onMarkAllRead={handleMarkAllRead}
                    onSettings={handleSettings}
                />

                {notifications.length > 0 && (
                    <NotificationTabs 
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        counts={counts}
                    />
                )}

                {error && (
                    <div style={{
                        padding: '12px 14px',
                        background: 'var(--error-50)',
                        border: '1px solid var(--error-200)',
                        borderRadius: '8px',
                        color: 'var(--error-600)',
                        marginBottom: '16px'
                    }}>
                        {error}
                    </div>
                )}

                <div style={{
                    display: 'grid',
                    gap: '8px'
                }}>
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((notification, index) => (
                            <div key={notification._id || index}>
                                <NotificationItem notification={notification} />
                            </div>
                        ))
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            padding: '56px 20px',
                            color: 'var(--secondary-500)'
                        }}>
                            <FiBell size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                            <h3 style={{ 
                                margin: '0 0 8px 0',
                                fontSize: '17px',
                                fontWeight: '500'
                            }}>
                                No notifications
                            </h3>
                            <p style={{ 
                                margin: 0,
                                fontSize: '14px'
                            }}>
                                {activeTab === 'unread' 
                                    ? "You're all caught up!" 
                                    : "We'll notify you when there are updates."
                                }
                            </p>
                            <div style={{ marginTop: '16px' }}>
                                <button
                                    className="btn-secondary"
                                    onClick={() => navigate('/job-matching/search')}
                                    style={{ fontSize: '13px', padding: '8px 12px' }}
                                >
                                    <FiSearch style={{ marginRight: '6px' }} /> Browse Jobs
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
