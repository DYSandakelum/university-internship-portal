import React, { useState } from 'react';
import { FiCheckCircle, FiChevronRight, FiZap, FiBook, FiUser, FiClock, FiPhone, FiArrowRight, FiInfo } from 'react-icons/fi';
import './ActionQueue.css';

function ActionQueue({ actions = [], opportunity = {} }) {
    const [expandedIndex, setExpandedIndex] = useState(null);

    const getActionIcon = (actionType) => {
        switch (actionType) {
            case 'skill':
                return <FiBook />;
            case 'profile':
                return <FiUser />;
            case 'timing':
                return <FiClock />;
            case 'followup':
                return <FiPhone />;
            default:
                return <FiArrowRight />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'priority-high';
            case 'medium':
                return 'priority-medium';
            default:
                return 'priority-low';
        }
    };

    if (!actions || actions.length === 0) {
        return (
            <div className="action-queue-container">
                <h3 className="action-title">
                    <FiZap /> Next Best Actions
                </h3>
                <div className="no-actions">
                    <p><FiCheckCircle style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />Perfect! No urgent actions needed.</p>
                    <p>Keep monitoring this opportunity.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="action-queue-container">
            <h3 className="action-title">
                <FiZap /> Next Best Actions ({actions.length})
            </h3>

            <div className="action-list">
                {actions.map((action, index) => (
                    <div
                        key={index}
                        className={`action-item ${getPriorityColor(action.priority)} ${
                            expandedIndex === index ? 'expanded' : ''
                        }`}
                        onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    >
                        {/* Main Action Bar */}
                        <div className="action-bar">
                            <div className="action-left">
                                <span className="action-icon">
                                    {getActionIcon(action.actionType)}
                                </span>
                                <div className="action-text">
                                    <p className="action-name">{action.action}</p>
                                    <p className={`action-priority priority-${action.priority}`}>
                                        {action.priority.toUpperCase()} PRIORITY
                                    </p>
                                </div>
                            </div>

                            <div className="action-impact">
                                <span className="impact-badge">
                                    +{action.expectedImpact}% score
                                </span>
                                <FiChevronRight
                                    className={`expand-icon ${expandedIndex === index ? 'rotated' : ''}`}
                                />
                            </div>
                        </div>

                        {/* Expanded Details */}
                        {expandedIndex === index && (
                            <div className="action-details">
                                <p className="action-description">{action.description}</p>
                                <div className="action-cta">
                                    <button className="action-button">
                                        Start Action <FiChevronRight />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Action Impact Summary */}
            {actions.length > 0 && (
                <div className="action-summary">
                    <div className="summary-item">
                        <span className="summary-label">Total Potential Boost</span>
                        <span className="summary-value">
                            +{actions.reduce((sum, a) => sum + a.expectedImpact, 0)}%
                        </span>
                    </div>
                </div>
            )}

            {/* What-If Simulator */}
            <div className="whatif-simulator">
                <h4 className="whatif-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiInfo /> What If You Do All These Actions?</h4>
                <div className="whatif-cards">
                    <div className="whatif-card">
                        <p className="whatif-label">Current Score</p>
                        <p className="whatif-current">{opportunity.overallSuccessScore}%</p>
                    </div>
                    <div className="whatif-icon"><FiArrowRight /></div>
                    <div className="whatif-card success">
                        <p className="whatif-label">Potential Score</p>
                        <p className="whatif-potential">
                            {Math.min(
                                100,
                                opportunity.overallSuccessScore +
                                    actions.reduce((sum, a) => sum + a.expectedImpact, 0)
                            )}%
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ActionQueue;
