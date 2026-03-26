import React, { useState } from 'react'
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
} from 'lucide-react'

export function JobCard({
  job,
  isSaved = false,
  onSave,
  onApply,
  saveMode = 'save',
}) {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!onSave) return

    setIsSaving(true)
    try {
      await onSave(job.id)
    } finally {
      setTimeout(() => setIsSaving(false), 300)
    }
  }

  const handleApply = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onApply) onApply(job.id)
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-success'
    if (score >= 70) return 'text-primary'
    if (score >= 50) return 'text-warning'
    return 'text-slate-400'
  }

  const getScoreStroke = (score) => {
    if (score >= 90) return '#10b981'
    if (score >= 70) return '#3b82f6'
    if (score >= 50) return '#f59e0b'
    return '#94a3b8'
  }

  return (
    <div className="modern-card p-5 flex flex-col h-full relative group animate-slide-up">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
            {job.title}
          </h3>
          <p className="text-slate-600 font-medium">{job.company}</p>
        </div>

        {job.matchScore !== undefined && (
          <div
            className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center ml-4"
            title={`Match Score: ${job.matchScore}%`}
          >
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                strokeWidth="3"
                strokeDasharray={`${job.matchScore}, 100`}
                stroke={getScoreStroke(job.matchScore)}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-1000 ease-out"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div
              className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${getScoreColor(job.matchScore)}`}
            >
              {job.matchScore}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4 text-sm text-slate-600">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-slate-400" />
          <span className="truncate">{job.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Briefcase className="w-4 h-4 text-slate-400" />
          <span className="truncate">{job.jobType}</span>
        </div>
        {job.salary && (
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-slate-400" />
            <span className="truncate">{job.salary}</span>
          </div>
        )}
        {job.deadline && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="truncate">
              {new Date(job.deadline).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6 flex-1 content-start">
        {job.skills.slice(0, 4).map((skill, idx) => (
          <span
            key={idx}
            className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium"
          >
            {skill}
          </span>
        ))}
        {job.skills.length > 4 && (
          <span className="px-2.5 py-1 bg-slate-50 text-slate-500 rounded-md text-xs font-medium">
            +{job.skills.length - 4}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-100">
        <button onClick={handleApply} className="btn-primary flex-1 py-2 text-sm" type="button">
          Apply Now
          <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
        </button>

        {onSave && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            type="button"
            className={`btn-icon border border-slate-200 ${isSaved ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 hover:text-primary-dark' : 'bg-white text-slate-400 hover:text-primary hover:border-primary/30'}`}
            title={
              saveMode === 'remove'
                ? 'Remove saved job'
                : isSaved
                  ? 'Saved'
                  : 'Save job'
            }
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : isSaved && saveMode !== 'remove' ? (
              <BookmarkCheck className="w-4 h-4" />
            ) : (
              <Bookmark className={`w-4 h-4 ${isSaved && saveMode === 'remove' ? 'fill-current' : ''}`} />
            )}
          </button>
        )}
      </div>
    </div>
  )
}
