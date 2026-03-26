import React, { useState } from 'react';
import { FiDollarSign, FiClock, FiMapPin, FiBriefcase, FiEdit3, FiBookmark, FiCheck, FiStar, FiSend, FiTrash2 } from 'react-icons/fi';

// Match Percentage Circle Component
function MatchIndicator({ percentage }) {
    if (typeof percentage !== 'number') return null;
    
    return (
        <div className="match-indicator" style={{ '--match-percent': `${percentage}%` }}>
            <div className="match-circle"></div>
            <div className="match-text">{percentage}%</div>
        </div>
    );
}

// Skill Tags Component
function SkillTags({ skills }) {
    if (!Array.isArray(skills) || skills.length === 0) return null;
    
    return (
        <div className="card-skills">
            {skills.slice(0, 4).map((skill, index) => (
                <span key={index} className="skill-tag">
                    {skill}
                </span>
            ))}
            {skills.length > 4 && (
                <span className="skill-tag" style={{ background: 'var(--secondary-400)' }}>
                    +{skills.length - 4}
                </span>
            )}
        </div>
    );
}

// Salary Display Component
function SalaryDisplay({ salary }) {
    if (!salary) {
        return (
            <div className="card-meta-item">
                <div className="card-meta-icon"><FiDollarSign /></div>
                <span>Not disclosed</span>
            </div>
        );
    }
    
    const formatSalary = (amount) => {
        if (amount >= 1000) {
            return `$${(amount / 1000).toFixed(1)}k`;
        }
        return `$${amount}`;
    };
    
    return (
        <div className="card-meta-item">
            <div className="card-meta-icon"><FiDollarSign /></div>
            <span>{formatSalary(salary)}</span>
        </div>
    );
}

// Deadline Display Component
function DeadlineDisplay({ deadline }) {
    if (!deadline) return null;
    
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let deadlineText = '';
    let urgencyColor = 'var(--secondary-500)';
    
    if (diffDays < 0) {
        deadlineText = 'Expired';
        urgencyColor = 'var(--error-500)';
    } else if (diffDays === 0) {
        deadlineText = 'Today';
        urgencyColor = 'var(--warning-500)';
    } else if (diffDays === 1) {
        deadlineText = 'Tomorrow';
        urgencyColor = 'var(--warning-500)';
    } else if (diffDays <= 7) {
        deadlineText = `${diffDays} days`;
        urgencyColor = 'var(--warning-500)';
    } else {
        deadlineText = `${diffDays} days`;
    }
    
    return (
        <div className="card-meta-item">
            <div className="card-meta-icon" style={{ background: urgencyColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiClock /></div>
            <span style={{ color: urgencyColor, fontWeight: '600' }}>{deadlineText}</span>
        </div>
    );
}

export default function JobCard({
    job,
    matchPercentage,
    onApply,
    onSave,
    onRemove,
    isSaved,
    showRemove
}) {
    const [isApplying, setIsApplying] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    const handleApply = async () => {
        setIsApplying(true);
        try {
            await onApply?.(job);
        } finally {
            setTimeout(() => setIsApplying(false), 1000);
        }
    };
    
    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave?.(job);
        } finally {
            setTimeout(() => setIsSaving(false), 500);
        }
    };
    
    return (
        <div 
            className="modern-card"
            style={{
                transition: 'all 0.2s ease'
            }}
        >
            <div className="card-header">
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 className="card-title">{job?.title || 'Job Title'}</h3>
                    <p className="card-company">{job?.company || 'Company'}</p>
                </div>
                
                {matchPercentage && (
                    <MatchIndicator percentage={matchPercentage} />
                )}
            </div>
            
            <div className="card-meta">
                <div className="card-meta-item">
                    <div className="card-meta-icon"><FiMapPin /></div>
                    <span>{job?.location || 'Location not specified'}</span>
                </div>
                
                <div className="card-meta-item">
                    <div className="card-meta-icon"><FiBriefcase /></div>
                    <span>{job?.jobType || 'Type not specified'}</span>
                </div>
                
                <SalaryDisplay salary={job?.salary} />
                
                <DeadlineDisplay deadline={job?.deadline} />
            </div>
            
            <SkillTags skills={job?.requiredSkills} />
            
            <div className="card-actions">
                <button
                    className="btn-primary"
                    onClick={handleApply}
                    disabled={isApplying}
                    style={{
                        opacity: isApplying ? 0.7 : 1,
                        transform: isApplying ? 'scale(0.95)' : 'scale(1)'
                    }}
                >
                    {isApplying ? (
                        <><FiSend style={{ marginRight: '4px' }} /> Applying...</>
                    ) : (
                        <><FiEdit3 style={{ marginRight: '4px' }} /> Apply</>
                    )}
                </button>
                
                {showRemove ? (
                    <button
                        className="btn-icon"
                        onClick={() => onRemove?.(job)}
                        title="Remove from saved jobs"
                        style={{
                            background: 'var(--error-500)',
                            color: 'white',
                            border: 'none'
                        }}
                    >
                        <FiTrash2 />
                    </button>
                ) : (
                    <button
                        className={isSaved ? 'btn-secondary' : 'btn-secondary'}
                        onClick={handleSave}
                        disabled={isSaved || isSaving}
                        style={{
                            background: isSaved ? 'var(--success-500)' : undefined,
                            color: isSaved ? 'white' : undefined,
                            border: isSaved ? 'none' : undefined,
                            opacity: isSaving ? 0.7 : 1,
                            transform: isSaving ? 'scale(0.95)' : 'scale(1)'
                        }}
                    >
                        {isSaving ? (
                            <FiStar style={{ marginRight: '4px', animation: 'spin 1s linear infinite' }} />
                        ) : isSaved ? (
                            <><FiCheck style={{ marginRight: '4px' }} /> Saved</>
                        ) : (
                            <><FiBookmark style={{ marginRight: '4px' }} /> Save</>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
