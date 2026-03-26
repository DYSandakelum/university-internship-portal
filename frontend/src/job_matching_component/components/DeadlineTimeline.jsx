import React, { useMemo } from 'react'
import { Clock, AlertTriangle, CheckCircle2, Calendar } from 'lucide-react'

export function DeadlineTimeline({
  deadline,
  status,
  applicationStatus = 'not_started',
  timeUsedPercent,
}) {
  const date = useMemo(() => new Date(deadline), [deadline])

  const formattedDate = useMemo(() => {
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }, [date])

  const diffDays = useMemo(() => {
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }, [date])

  const getStatusColor = () => {
    switch (status) {
      case 'safe':
        return 'text-success bg-success/10 border-success/20'
      case 'warning':
        return 'text-warning bg-warning/10 border-warning/20'
      case 'critical':
        return 'text-error bg-error/10 border-error/20'
      case 'passed':
        return 'text-slate-500 bg-slate-100 border-slate-200'
      default:
        return 'text-primary bg-primary/10 border-primary/20'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'safe':
        return <CheckCircle2 className="w-5 h-5 text-success" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning" />
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-error animate-pulse" />
      case 'passed':
        return <Clock className="w-5 h-5 text-slate-500" />
      default:
        return <Clock className="w-5 h-5 text-primary" />
    }
  }

  const getProgressBarColor = () => {
    if (timeUsedPercent > 90) return 'bg-error'
    if (timeUsedPercent > 75) return 'bg-warning'
    return 'bg-primary'
  }

  const getAppStatusBadge = () => {
    switch (applicationStatus) {
      case 'submitted':
        return (
          <span className="px-2 py-1 bg-success/10 text-success text-xs font-bold rounded border border-success/20">
            Submitted
          </span>
        )
      case 'in_progress':
        return (
          <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded border border-primary/20">
            In Progress
          </span>
        )
      case 'not_started':
      default:
        return (
          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded border border-slate-200">
            Not Started
          </span>
        )
    }
  }

  return (
    <div className="modern-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Deadline Tracker
        </h3>
        {getAppStatusBadge()}
      </div>

      <div className={`flex items-center gap-4 p-4 rounded-lg border mb-5 ${getStatusColor()}`}>
        <div className="flex-shrink-0">{getStatusIcon()}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">
            {diffDays > 0
              ? `${diffDays} days remaining`
              : diffDays === 0
                ? 'Due today!'
                : 'Deadline passed'}
          </p>
          <p className="text-xs opacity-80 truncate">{formattedDate}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-medium text-slate-500">
          <span>Time Used</span>
          <span>{timeUsedPercent}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${getProgressBarColor()}`}
            style={{ width: `${Math.min(100, Math.max(0, timeUsedPercent))}%` }}
          />
        </div>
      </div>

      {status === 'critical' && applicationStatus !== 'submitted' && (
        <div className="mt-4 p-3 bg-error/5 border border-error/10 rounded text-sm text-error font-medium flex items-start gap-2 animate-fade-in">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>Action required immediately to meet this deadline.</p>
        </div>
      )}

      {status === 'warning' && applicationStatus === 'not_started' && (
        <div className="mt-4 p-3 bg-warning/5 border border-warning/10 rounded text-sm text-warning-700 font-medium flex items-start gap-2 animate-fade-in">
          <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>Consider starting your application soon.</p>
        </div>
      )}
    </div>
  )
}
