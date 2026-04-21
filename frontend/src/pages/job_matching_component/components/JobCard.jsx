import React, { useState } from 'react';
import { FiDollarSign, FiClock, FiMapPin, FiBriefcase, FiEdit3, FiBookmark, FiCheck, FiStar, FiSend, FiTrash2 } from 'react-icons/fi';
import './JobCard.css';

const getScoreColor = (score) => {
  if (score >= 90) return 'var(--success-500)';
  if (score >= 70) return 'var(--success-500)';
  if (score >= 50) return 'var(--warning-500)';
  return 'var(--secondary-400)';
};

const getScoreClass = (score) => {
  if (score >= 90) return 'high';
  if (score >= 70) return 'good';
  if (score >= 50) return 'medium';
  return 'low';
};

function MatchIndicator({ percentage }) {
  if (typeof percentage !== 'number') return null;

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(percentage, 100));
  const offset = circumference * (1 - progress / 100);
  const color = getScoreColor(progress);

  return (
    <div className="match-score">
      <svg className="match-ring" viewBox="0 0 48 48">
        <circle className="match-bg" cx="24" cy="24" r="20" />
        <circle
          className="match-progress"
          cx="24"
          cy="24"
          r="20"
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="match-value">{`${Math.round(progress)}%`}</div>
    </div>
  );
}

function JobDetailsItem({ icon, text }) {
  return (
    <div className="job-details-item">
      {icon}
      <span>{text}</span>
    </div>
  );
}

function SkillTags({ skills }) {
  if (!Array.isArray(skills) || skills.length === 0) return null;

  const displayed = skills.slice(0, 4);
  const extra = skills.length - displayed.length;

  return (
    <div className="skills">
      {displayed.map((skill, idx) => (
        <span key={idx} className="skill-tag">{skill}</span>
      ))}
      {extra > 0 && <span className="skill-tag more">+{extra}</span>}
    </div>
  );
}

export default function JobCard({
  job = {},
  matchPercentage = null,
  onApply,
  onSave,
  onRemove,
  isSaved,
  showRemove,
  hideActions = false,
  showActionLabels = false
}) {
  const [isApplying, setIsApplying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleApply = async () => {
    setIsApplying(true);
    try {
      if (onApply) await onApply(job);
    } finally {
      setTimeout(() => setIsApplying(false), 250);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (onSave) await onSave(job);
    } finally {
      setTimeout(() => setIsSaving(false), 250);
    }
  };

  return (
    <article className="job-card">
      <header className="job-card-header">
        <div>
          <h3 className="job-title">{job.title || 'Job title'}</h3>
          <p className="company-name">{job.company || 'Company name'}</p>
        </div>
        {matchPercentage != null && <MatchIndicator percentage={matchPercentage} />}
      </header>

      <section className="job-details">
        <JobDetailsItem icon={<FiMapPin />} text={job.location || 'Remote'} />
        <JobDetailsItem icon={<FiBriefcase />} text={job.jobType || 'Full-time'} />
        <JobDetailsItem icon={<FiDollarSign />} text={job.salary ? `$${job.salary}` : 'Not disclosed'} />
        <JobDetailsItem icon={<FiClock />} text={job.deadline || 'No deadline'} />
      </section>

      <SkillTags skills={job.requiredSkills || []} />

      {hideActions ? null : (
        <footer className="job-actions">
          <button className="apply-button" onClick={handleApply} disabled={isApplying}>
            {isApplying ? <span className="spinner" /> : <FiSend className="icon" />}
            {isApplying ? 'Applying...' : 'Apply'}
          </button>

          {showRemove ? (
            <button className="save-button" onClick={() => onRemove?.(job)}>
              <FiTrash2 className="icon" />
            </button>
          ) : (
            <button
              className={`save-button ${showActionLabels ? 'has-label' : ''} ${isSaved ? 'saved' : ''}`}
              onClick={handleSave}
              disabled={isSaving || isSaved}
              aria-label={isSaved ? 'Saved' : 'Save'}
            >
              {isSaving ? (
                <span className="spinner" />
              ) : isSaved ? (
                <FiCheck className="icon" />
              ) : (
                <FiBookmark className="icon" />
              )}
              {showActionLabels ? <span className="save-button-label">{isSaved ? 'Saved' : 'Save'}</span> : null}
            </button>
          )}
        </footer>
      )}
    </article>
  );
}
