import React, { useEffect, useState } from 'react';
import { FiSettings, FiCheck, FiMail, FiBell, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import useEnsureDemoAuth from '../hooks/useEnsureDemoAuth';
import BackToDashboardButton from '../components/BackToDashboardButton';

// Clean Toggle Switch Component
const ToggleSwitch = ({ on, onToggle, label, description, disabled = false }) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '16px',
            padding: '14px 0',
            borderBottom: '1px solid var(--secondary-100)'
        }}>
            <div style={{ flex: 1 }}>
                <div style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'var(--secondary-800)',
                    marginBottom: '4px'
                }}>
                    {label}
                </div>
                {description && (
                    <div style={{
                        fontSize: '12px',
                        color: 'var(--secondary-600)',
                        lineHeight: '1.4'
                    }}>
                        {description}
                    </div>
                )}
            </div>
            
            <div
                onClick={disabled ? undefined : onToggle}
                style={{
                    width: '44px',
                    height: '24px',
                    borderRadius: '12px',
                    background: on ? 'var(--primary-500)' : 'var(--secondary-300)',
                    position: 'relative',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: disabled ? 0.5 : 1
                }}
            >
                <div
                    style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '10px',
                        background: 'white',
                        position: 'absolute',
                        top: '2px',
                        left: on ? '22px' : '2px',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}
                />
            </div>
        </div>
    );
};

// Settings Section Component
function SettingsSection({ title, children }) {
    return (
        <div style={{
            background: 'white',
            border: '1px solid var(--secondary-200)',
            borderRadius: '8px',
            marginBottom: '14px'
        }}>
            <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--secondary-100)'
            }}>
                <h3 style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: 'var(--secondary-800)',
                    margin: 0
                }}>
                    {title}
                </h3>
            </div>
            <div style={{ padding: '0 16px' }}>
                {children}
            </div>
        </div>
    );
}

// Status Message Component
function StatusMessage({ saving, message, error }) {
    if (saving) {
        return (
            <div style={{
                background: 'var(--primary-50)',
                border: '1px solid var(--primary-200)',
                borderRadius: '6px',
                padding: '12px 16px',
                color: 'var(--primary-700)',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px'
            }}>
                <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid var(--primary-500)',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
                Saving preferences...
            </div>
        );
    }

    if (message) {
        return (
            <div style={{
                background: 'var(--success-50)',
                border: '1px solid var(--success-200)',
                borderRadius: '6px',
                padding: '12px 16px',
                color: 'var(--success-700)',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px'
            }}>
                <FiCheck size={16} />
                {message}
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                background: 'var(--error-50)',
                border: '1px solid var(--error-200)',
                borderRadius: '6px',
                padding: '12px 16px',
                color: 'var(--error-700)',
                marginBottom: '16px',
                fontSize: '14px'
            }}>
                {error}
            </div>
        );
    }

    return null;
}

export default function NotificationSettings() {
    const navigate = useNavigate();
    const { ready, isAuthenticated, error: authError } = useEnsureDemoAuth();
    const [settings, setSettings] = useState({
        emailNotifications: true,
        newJobAlerts: true,
        deadlineReminders: true,
        applicationUpdates: true
    });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError('');
            try {
                const me = await api.get('/auth/me');
                const s = me?.data?.user?.notificationSettings;
                if (s) {
                    setSettings({
                        emailNotifications: Boolean(s.emailNotifications),
                        newJobAlerts: Boolean(s.newJobAlerts),
                        deadlineReminders: Boolean(s.deadlineReminders),
                        applicationUpdates: Boolean(s.applicationUpdates)
                    });
                }
            } catch (e) {
                setError('Unable to load settings');
            } finally {
                setLoading(false);
            }
        };

        if (ready && isAuthenticated) load();
    }, [ready, isAuthenticated]);

    const toggle = (key) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
        setHasUnsavedChanges(true);
        setMessage('');
        setError('');
    };

    const save = async () => {
        setSaving(true);
        setError('');
        setMessage('');
        try {
            await api.put('/auth/settings', { notificationSettings: settings });
            setMessage('Settings saved successfully');
            setHasUnsavedChanges(false);
            setTimeout(() => setMessage(''), 3000);
        } catch (e) {
            setError('Unable to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (authError) {
        return (
            <div className="page">
                <div className="container">
                    <BackToDashboardButton />
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
                        padding: '40px 20px',
                        background: 'white',
                        borderRadius: '8px',
                        border: '1px solid var(--secondary-200)'
                    }}>
                        <FiSettings size={32} color="var(--secondary-400)" style={{ marginBottom: '16px' }} />
                        <p style={{ margin: 0, color: 'var(--secondary-600)' }}>Loading settings...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                <BackToDashboardButton />
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                    padding: '12px 14px',
                    border: '1px solid var(--secondary-200)',
                    borderRadius: '8px',
                    background: 'white',
                    flexWrap: 'wrap',
                    gap: '10px'
                }}>
                    <div>
                        <h1 style={{ 
                            margin: '0 0 4px 0', 
                            fontSize: '18px', 
                            fontWeight: '600',
                            color: 'var(--secondary-800)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <FiSettings size={20} />
                            Notification Settings
                        </h1>
                        <p style={{ 
                            margin: 0, 
                            fontSize: '13px', 
                            color: 'var(--secondary-600)' 
                        }}>
                            Manage how you receive job alerts and updates
                        </p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {hasUnsavedChanges && (
                            <span style={{
                                fontSize: '12px',
                                color: 'var(--warning-600)',
                                fontWeight: '500'
                            }}>
                                Unsaved changes
                            </span>
                        )}
                        <button 
                            className="btn-secondary"
                            onClick={() => navigate('/job-matching/notifications')}
                            style={{ 
                                padding: '6px 12px', 
                                fontSize: '13px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                        >
                            <FiArrowLeft size={14} /> Back to Notifications
                        </button>
                        <button 
                            className="btn-primary"
                            onClick={save} 
                            disabled={saving || !hasUnsavedChanges}
                            style={{
                                padding: '6px 12px',
                                fontSize: '13px',
                                opacity: (!hasUnsavedChanges && !saving) ? 0.6 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                        >
                            {saving ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </div>

                {/* Status Messages */}
                <StatusMessage saving={saving} message={message} error={error} />

                {/* Email Settings */}
                <SettingsSection title="Email Notifications">
                    <ToggleSwitch
                        on={settings.emailNotifications}
                        onToggle={() => toggle('emailNotifications')}
                        label="Email Notifications"
                        description="Receive job-related updates via email"
                    />
                </SettingsSection>

                {/* Job Alerts */}
                <SettingsSection title="Job Alerts">
                    <ToggleSwitch
                        on={settings.newJobAlerts}
                        onToggle={() => toggle('newJobAlerts')}
                        label="Job Match Alerts"
                        description="Get notified when new jobs match your profile"
                        disabled={!settings.emailNotifications}
                    />
                    <ToggleSwitch
                        on={settings.deadlineReminders}
                        onToggle={() => toggle('deadlineReminders')}
                        label="Application Deadlines"
                        description="Reminders for upcoming application deadlines"
                        disabled={!settings.emailNotifications}
                    />
                    <ToggleSwitch
                        on={settings.applicationUpdates}
                        onToggle={() => toggle('applicationUpdates')}
                        label="Application Updates"
                        description="Status updates for your submitted applications"
                        disabled={!settings.emailNotifications}
                    />
                </SettingsSection>

                {/* Info */}
                <div style={{
                    background: 'var(--secondary-50)',
                    border: '1px solid var(--secondary-200)',
                    borderRadius: '6px',
                    padding: '14px',
                    fontSize: '12px',
                    color: 'var(--secondary-600)',
                    lineHeight: '1.5'
                }}>
                    <strong style={{ color: 'var(--secondary-700)' }}>Note:</strong> Email notifications must be enabled to receive other types of alerts. 
                    Critical system updates will always be delivered regardless of these settings.
                </div>
            </div>
        </div>
    );
}
