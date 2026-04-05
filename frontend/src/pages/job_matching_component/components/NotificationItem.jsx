import React from 'react';

const iconLetterForType = (type) => {
    if (type === 'new_job') return 'N';
    if (type === 'deadline_reminder') return 'D';
    if (type === 'application_update') return 'A';
    return 'I';
};

const labelForType = (type) => {
    if (type === 'new_job') return 'Job Alert';
    if (type === 'deadline_reminder') return 'Deadline';
    if (type === 'application_update') return 'Application';
    return 'Info';
};

const accentForType = (type, isRead) => {
    if (type === 'deadline_reminder') {
        return {
            borderLeft: isRead ? '1px solid var(--secondary-200)' : '4px solid var(--error-500)',
            iconBg: isRead ? 'var(--secondary-100)' : 'var(--secondary-50)',
            iconColor: isRead ? 'var(--secondary-600)' : 'var(--error-700)',
            labelColor: isRead ? 'var(--secondary-600)' : 'var(--error-700)',
            messageColor: isRead ? 'var(--secondary-700)' : 'var(--secondary-800)'
        };
    }

    if (type === 'new_job') {
        return {
            borderLeft: isRead ? '1px solid var(--secondary-200)' : '4px solid var(--success-500)',
            iconBg: isRead ? 'var(--secondary-100)' : 'var(--secondary-50)',
            iconColor: isRead ? 'var(--secondary-600)' : 'var(--success-700)',
            labelColor: isRead ? 'var(--secondary-600)' : 'var(--success-700)',
            messageColor: isRead ? 'var(--secondary-700)' : 'var(--secondary-800)'
        };
    }

    return {
        borderLeft: isRead ? '1px solid var(--secondary-200)' : '4px solid var(--primary-500)',
        iconBg: isRead ? 'var(--secondary-100)' : 'var(--secondary-50)',
        iconColor: isRead ? 'var(--secondary-600)' : 'var(--primary-700)',
        labelColor: 'var(--secondary-600)',
        messageColor: isRead ? 'var(--secondary-700)' : 'var(--secondary-800)'
    };
};

export default function NotificationItem({ notification }) {
    const createdAt = notification?.createdAt ? new Date(notification.createdAt) : null;
    const timestamp = createdAt ? createdAt.toLocaleString() : '';
    const isRead = Boolean(notification?.isRead);
    const accent = accentForType(notification?.type, isRead);

    return (
        <div
            style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start',
                padding: '10px 12px',
                background: 'white',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                borderLeft: accent.borderLeft
            }}
        >
            <div
                aria-hidden
                style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: accent.iconBg,
                    color: accent.iconColor,
                    fontWeight: '700',
                    fontSize: '12px',
                    flexShrink: 0,
                    marginTop: '1px'
                }}
            >
                {iconLetterForType(notification?.type)}
            </div>
            <div style={{ flex: 1 }}>
                <div style={{
                    fontSize: '14px',
                    fontWeight: isRead ? '500' : '600',
                    color: accent.messageColor,
                    lineHeight: '1.35'
                }}>
                    {notification?.message}
                </div>
                <div style={{
                    marginTop: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    flexWrap: 'wrap'
                }}>
                    <span style={{
                        fontSize: '11px',
                        color: accent.labelColor,
                        textTransform: 'uppercase',
                        letterSpacing: '0.2px',
                        fontWeight: '600'
                    }}>
                        {labelForType(notification?.type)}
                    </span>
                    <span style={{
                        fontSize: '12px',
                        color: 'var(--secondary-500)'
                    }}>
                        {timestamp}
                    </span>
                </div>
            </div>
        </div>
    );
}
