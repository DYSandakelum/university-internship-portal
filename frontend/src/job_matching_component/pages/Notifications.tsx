import React, { useEffect, useMemo, useState } from 'react'
import { PageWrapper } from '../components/PageWrapper'
import { NotificationItem, Notification } from '../components/NotificationItem'
import { jobService } from '../services/jobService'
import { Link } from 'react-router-dom'
import {
  Bell,
  CheckCheck,
  Filter,
  Settings,
  Trash2,
  AlertCircle,
} from 'lucide-react'

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    type: 'new_job',
    title: 'New job match: Senior React Developer',
    message: 'A new job matches your profile with a 95% compatibility score.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false,
  },
  {
    id: 'notif-2',
    type: 'deadline_reminder',
    title: 'Application deadline approaching',
    message: 'The UI Engineer role at DesignHub closes in 2 days.',
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    isRead: false,
  },
  {
    id: 'notif-3',
    type: 'application_update',
    title: 'Skill gap insight',
    message: 'Adding GraphQL to your profile could improve match rates by 12%.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  },
  {
    id: 'notif-4',
    type: 'system',
    title: 'Weekly digest is ready',
    message: 'Check out your weekly job matching summary.',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  },
]

type FilterType = 'all' | 'unread' | Notification['type']

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await jobService.getNotifications()
        if (Array.isArray(data) && data.length > 0) {
          setNotifications(data)
        } else {
          setNotifications(MOCK_NOTIFICATIONS)
        }
      } catch (err) {
        console.warn('Failed to fetch notifications, using mock data', err)
        setNotifications(MOCK_NOTIFICATIONS)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (activeFilter === 'all') return true
      if (activeFilter === 'unread') return !n.isRead
      return n.type === activeFilter
    })
  }, [notifications, activeFilter])

  const markAsRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
    try {
      await jobService.markNotificationRead(id)
    } catch (err) {
      console.warn('Failed to mark notification read', err)
    }
  }

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id)
    if (unreadIds.length === 0) return

    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    try {
      await Promise.all(unreadIds.map((id) => jobService.markNotificationRead(id)))
    } catch (err) {
      console.warn('Failed to mark all as read', err)
    }
  }

  const deleteNotification = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    try {
      await jobService.deleteNotification(id)
    } catch (err) {
      console.warn('Failed to delete notification', err)
    }
  }

  const clearAll = async () => {
    if (notifications.length === 0) return
    setNotifications([])
    try {
      await jobService.clearNotifications()
    } catch (err) {
      console.warn('Failed to clear notifications', err)
    }
  }

  const filters: { id: FilterType; label: string; count?: number }[] = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: unreadCount },
    { id: 'new_job', label: 'New jobs' },
    { id: 'deadline_reminder', label: 'Deadlines' },
    { id: 'application_update', label: 'Updates' },
    { id: 'system', label: 'System' },
  ]

  return (
    <PageWrapper>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Bell className="w-8 h-8 text-primary" />
            Notifications
          </h1>
          <p className="text-slate-500 mt-1">Stay updated on your job matches, deadlines, and insights.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/job-matching/notifications/settings"
            className="btn-secondary flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="btn-secondary flex items-center gap-2 disabled:opacity-50"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
          <button
            onClick={clearAll}
            disabled={notifications.length === 0}
            className="btn-secondary text-error border-error/20 hover:bg-error/5 flex items-center gap-2 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            Clear all
          </button>
        </div>
      </div>

      <div className="glass-panel p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-600 font-medium">
          <Filter className="w-4 h-4" />
          Filter
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeFilter === f.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white/60 text-slate-600 hover:bg-white'
              }`}
            >
              {f.label}
              {typeof f.count === 'number' && (
                <span className="ml-2 text-xs bg-white/30 px-2 py-0.5 rounded-full">
                  {f.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <div className="glass-panel p-8 text-center flex flex-col items-center max-w-lg mx-auto">
          <AlertCircle className="w-12 h-12 text-error mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">Failed to load notifications</h3>
          <p className="text-slate-600 mb-4">{error}</p>
        </div>
      ) : isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-panel p-5 h-[92px] animate-pulse bg-white/50" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel p-16 text-center flex flex-col items-center max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <Bell className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">You're all caught up</h3>
          <p className="text-slate-600 mb-8 text-lg">
            No notifications match your current filter. Check back later.
          </p>
          <Link to="/job-matching/dashboard" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onMarkRead={markAsRead}
              onClick={(notif) => {
                // Simple interaction: click marks as read
                if (!notif.isRead) {
                  markAsRead(notif.id)
                }
              }}
            />
          ))}
        </div>
      )}
    </PageWrapper>
  )
}
