import React from 'react'
import { Sparkles, Clock, Briefcase, Info, Check } from 'lucide-react'

export interface Notification {
  id: string
  type: 'new_job' | 'deadline_reminder' | 'application_update' | 'system'
  title: string
  message: string
  timestamp: string
  isRead: boolean
  link?: string
}

interface NotificationItemProps {
  notification: Notification
  onMarkRead?: (id: string) => void
  onClick?: (notification: Notification) => void
}

export function NotificationItem({
  notification,
  onMarkRead,
  onClick,
}: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'new_job':
        return <Sparkles className="w-5 h-5 text-green-500" />
      case 'deadline_reminder':
        return <Clock className="w-5 h-5 text-amber-500" />
      case 'application_update':
        return <Briefcase className="w-5 h-5 text-blue-500" />
      case 'system':
      default:
        return <Info className="w-5 h-5 text-slate-500" />
    }
  }

  const getBorderColor = () => {
    switch (notification.type) {
      case 'new_job':
        return 'border-l-green-500'
      case 'deadline_reminder':
        return 'border-l-amber-500'
      case 'application_update':
        return 'border-l-blue-500'
      case 'system':
      default:
        return 'border-l-slate-400'
    }
  }

  const getIconBg = () => {
    switch (notification.type) {
      case 'new_job':
        return 'bg-green-100'
      case 'deadline_reminder':
        return 'bg-amber-100'
      case 'application_update':
        return 'bg-blue-100'
      case 'system':
      default:
        return 'bg-slate-100'
    }
  }

  return (
    <div
      className={`modern-card p-4 flex gap-4 border-l-4 transition-all duration-200 animate-slide-up ${getBorderColor()} ${
        !notification.isRead
          ? 'bg-primary/5 border-r-0 border-t-0 border-b-0'
          : 'bg-white border-y-slate-100 border-r-slate-100'
      } ${onClick ? 'cursor-pointer hover:shadow-md' : ''}`}
      onClick={() => onClick && onClick(notification)}
    >
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getIconBg()}`}
      >
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4
            className={`text-sm font-semibold truncate ${
              !notification.isRead ? 'text-slate-900' : 'text-slate-700'
            }`}
          >
            {notification.title}
          </h4>
          <span className="text-xs text-slate-400 whitespace-nowrap flex-shrink-0">
            {notification.timestamp}
          </span>
        </div>
        <p
          className={`text-sm mt-1 line-clamp-2 ${
            !notification.isRead
              ? 'text-slate-700 font-medium'
              : 'text-slate-500'
          }`}
        >
          {notification.message}
        </p>
      </div>

      {!notification.isRead && (
        <div className="flex-shrink-0 flex flex-col items-end justify-between">
          <div className="w-2.5 h-2.5 bg-primary rounded-full mb-2"></div>
          {onMarkRead && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMarkRead(notification.id)
              }}
              className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
              title="Mark as read"
            >
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
