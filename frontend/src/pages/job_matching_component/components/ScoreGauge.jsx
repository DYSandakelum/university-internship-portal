import React from 'react';
import { FiMail, FiAward } from 'react-icons/fi';
import './ScoreGauge.css';

function ScoreGauge({ opportunity }) {
    if (!opportunity) return null;

    const score = opportunity.overallSuccessScore || 0;
    const strokeOffset = 440 - (score / 100) * 440; // Circumference is 440px

    // Determine color based on score
    const getScoreColor = (s) => {
        if (s >= 75) return '#10b981'; // success green
        if (s >= 50) return '#f59e0b'; // warning orange
        return '#ef4444'; // error red
    };

    const getScoreLabel = (s) => {
        if (s >= 75) return 'Excellent Opportunity';
        if (s >= 50) return 'Good Opportunity';
        if (s >= 25) return 'Fair Opportunity';
        return 'Low Probability';
    };

    const color = getScoreColor(score);
    const label = getScoreLabel(score);

    return (
        <div className="score-gauge-container">
            <div className="gauge-inner">
                <svg viewBox="0 0 200 200" className="gauge-svg">
                    {/* Background circle */}
                    <circle
                        cx="100"
                        cy="100"
                        r="70"
                        fill="none"
                        stroke="var(--primary-100)"
                        strokeWidth="12"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="100"
                        cy="100"
                        r="70"
                        fill="none"
                        stroke={color}
                        strokeWidth="12"
                        strokeDasharray="440"
                        strokeDashoffset={strokeOffset}
                        strokeLinecap="round"
                        className="gauge-progress"
                    />
                </svg>

                {/* Centered content */}
                <div className="gauge-content">
                    <div className="score-number" style={{ color }}>
                        {score}
                    </div>
                    <div className="score-percent">%</div>
                </div>
            </div>

            {/* Score Details */}
            <div className="score-details">
                <h3 className="score-title">{opportunity.jobId?.title}</h3>
                <p className="score-label">{label}</p>

                <div className="success-prediction">
                    <div className="prediction-item">
                        <span className="prediction-icon"><FiMail /></span>
                        <div>
                            <p className="prediction-label">Interview Chance</p>
                            <p className="prediction-value">
                                {opportunity.successPrediction?.interviewChance || 0}%
                            </p>
                        </div>
                    </div>
                    <div className="prediction-item">
                        <span className="prediction-icon"><FiAward /></span>
                        <div>
                            <p className="prediction-label">Offer Chance</p>
                            <p className="prediction-value">
                                {opportunity.successPrediction?.offerChance || 0}%
                            </p>
                        </div>
                    </div>
                </div>

                {/* Score Components */}
                <div className="score-components">
                    <div className="component-bar">
                        <div className="component-label">
                            <span>Skill Match</span>
                            <span className="component-percent">{opportunity.skillMatchScore}%</span>
                        </div>
                        <div className="component-progress">
                            <div 
                                className="component-fill"
                                style={{ 
                                    width: `${opportunity.skillMatchScore}%`,
                                    background: 'var(--primary-500)'
                                }}
                            ></div>
                        </div>
                    </div>

                    <div className="component-bar">
                        <div className="component-label">
                            <span>Profile Complete</span>
                            <span className="component-percent">{opportunity.profileCompletenessScore}%</span>
                        </div>
                        <div className="component-progress">
                            <div 
                                className="component-fill"
                                style={{ 
                                    width: `${opportunity.profileCompletenessScore}%`,
                                    background: 'var(--accent-500)'
                                }}
                            ></div>
                        </div>
                    </div>

                    <div className="component-bar">
                        <div className="component-label">
                            <span>Deadline Proximity</span>
                            <span className="component-percent">{opportunity.deadlineProximityScore}%</span>
                        </div>
                        <div className="component-progress">
                            <div 
                                className="component-fill"
                                style={{ 
                                    width: `${opportunity.deadlineProximityScore}%`,
                                    background: 'var(--success-500)'
                                }}
                            ></div>
                        </div>
                    </div>

                    <div className="component-bar">
                        <div className="component-label">
                            <span>Application Behavior</span>
                            <span className="component-percent">{opportunity.applicationBehaviorScore}%</span>
                        </div>
                        <div className="component-progress">
                            <div 
                                className="component-fill"
                                style={{ 
                                    width: `${opportunity.applicationBehaviorScore}%`,
                                    background: 'var(--warning-500)'
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ScoreGauge;
