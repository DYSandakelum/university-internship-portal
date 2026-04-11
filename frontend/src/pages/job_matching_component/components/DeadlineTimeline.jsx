import React, { useMemo } from 'react';
import { FiClock, FiAlertTriangle, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './DeadlineTimeline.css';

function DeadlineTimeline({ opportunity }) {
    const navigate = useNavigate();

    const jobId = useMemo(() => {
        const raw = opportunity?.jobId?._id ?? opportunity?.jobId ?? opportunity?.job?._id ?? opportunity?.job;
        return raw ? String(raw) : '';
    }, [opportunity]);

    if (!opportunity) return null;

    const deadline = new Date(opportunity.deadlineDate);
    const now = new Date();
    const daysRemaining = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

    // Calculate percentage of time used
    const createdDate = new Date(opportunity.createdAt);
    const totalDays = Math.ceil((deadline - createdDate) / (1000 * 60 * 60 * 24));
    const percentUsed = Math.max(0, Math.min(100, ((totalDays - daysRemaining) / totalDays) * 100));

    const getStatusIcon = (status) => {
        switch (status) {
            case 'critical':
                return <FiAlertTriangle className="status-icon critical" />;
            case 'warning':
                return <FiClock className="status-icon warning" />;
            default:
                return <FiCheckCircle className="status-icon safe" />;
        }
    };

    const getDateString = (date) => {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const getTimelineMessage = () => {
        if (daysRemaining < 0) return 'Deadline Passed';
        if (daysRemaining === 0) return 'Apply TODAY!';
        if (daysRemaining <= 3) return 'Critical Window';
        if (daysRemaining <= 7) return 'Warning Zone';
        if (daysRemaining <= 14) return 'Good Timing';
        return 'Plenty of Time';
    };

    return (
        <div className="deadline-timeline-container">
            <div className="timeline-header">
                <h3 className="timeline-title">
                    <FiClock /> Application Deadline
                </h3>
                {getStatusIcon(opportunity.deadlineStatus)}
            </div>

            {/* Main Deadline Info */}
            <div className="deadline-info">
                <div className="deadline-date">
                    <p className="deadline-label">Deadline Date</p>
                    <p className="deadline-value">{getDateString(deadline)}</p>
                </div>

                <div className="deadline-countdown">
                    <p className="deadline-label">Time Remaining</p>
                    <p className={`countdown-value ${
                        daysRemaining <= 0 ? 'expired' :
                        daysRemaining <= 3 ? 'critical' :
                        daysRemaining <= 7 ? 'warning' : 'safe'
                    }`}>
                        {daysRemaining > 0 ? `${daysRemaining} days` : 'Expired'}
                    </p>
                </div>

                <div className="deadline-message">
                    <p className="message-text">{getTimelineMessage()}</p>
                </div>
            </div>

            {/* Timeline Progress */}
            <div className="timeline-progress">
                <div className="progress-label">
                    <span>Time Used</span>
                    <span className="progress-percent">{Math.round(percentUsed)}%</span>
                </div>
                <div className="progress-bar">
                    <div
                        className={`progress-fill ${
                            percentUsed >= 80 ? 'critical-usage' : 'normal-usage'
                        }`}
                        style={{ width: `${percentUsed}%` }}
                    ></div>
                </div>
            </div>

            {/* Recommendation Box */}
            <div className={`recommendation ${opportunity.deadlineStatus}`}>
                {opportunity.deadlineStatus === 'critical' && (
                    <>
                        <p className="rec-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiAlertTriangle /> Critical Alert</p>
                        <p className="rec-text">
                            Deadline is {daysRemaining <= 0 ? 'PAST' : `in ${daysRemaining} days`}. 
                            Apply immediately if you haven't already!
                        </p>
                        <button
                            type="button"
                            className="rec-button critical"
                            disabled={!jobId}
                            onClick={() => {
                                if (!jobId) return;
                                navigate(`/student/apply/${jobId}`);
                            }}
                            title={jobId ? 'Open application form' : 'Job is missing (cannot open application form)'}
                        >
                            Apply Now
                        </button>
                    </>
                )}
                {opportunity.deadlineStatus === 'warning' && (
                    <>
                        <p className="rec-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiClock /> Act Soon</p>
                        <p className="rec-text">
                            You have {daysRemaining} days. Complete your profile and apply this week.
                        </p>
                        <button className="rec-button warning">Prepare Application</button>
                    </>
                )}
                {opportunity.deadlineStatus === 'safe' && (
                    <>
                        <p className="rec-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiCheckCircle /> Good Timing</p>
                        <p className="rec-text">
                            {daysRemaining} days remaining. Take time to tailor your application.
                        </p>
                        <button className="rec-button safe">Plan Application</button>
                    </>
                )}
            </div>

            {/* Application Status */}
            {opportunity.applicationStatus !== 'not_applied' && (
                <div className="application-status">
                    <h4 className="status-title">Application Status</h4>
                    <div className={`status-badge status-${opportunity.applicationStatus}`}>
                        {opportunity.applicationStatus.replace('_', ' ').toUpperCase()}
                    </div>
                    {opportunity.applicationDate && (
                        <p className="applied-date">
                            Applied on {getDateString(new Date(opportunity.applicationDate))}
                        </p>
                    )}
                </div>
            )}

            {/* Calendar Integration Hint */}
            <div className="calendar-hint">
                <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiInfo /> Tip: Add this deadline to your calendar so you don't miss it!</p>
            </div>
        </div>
    );
}

export default DeadlineTimeline;
