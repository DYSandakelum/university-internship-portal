import React, { useEffect, useMemo, useState } from 'react'
import { PageWrapper } from '../components/PageWrapper'
import { NotificationItem } from '../components/NotificationItem'
import { jobService } from '../services/jobService'
import { Link } from 'react-router-dom'
import { Settings, CheckCircle2, BellOff } from 'lucide-react'

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'new_job',
    title: 'New Match: Senior React Developer',
    message:
      'TechCorp just posted a job that matches 95% of your skills. Apply early to stand out.',
    timestamp: '2 hours ago',
    isRead: false,
  },
  {
    id: '2',
    type: 'deadline_reminder',
    title: 'Application Deadline Approaching',
    message:
      'The UX Designer position at DesignHub closes in 2 days. Complete your application soon.',
    timestamp: '5 hours ago',
    isRead: false,
  },
  {
    id: '3',
    type: 'application_update',
    title: 'Application Viewed',
    message:
      'Your application for Frontend Engineer at StartupXYZ was viewed by the hiring team.',
    timestamp: '1 day ago',
    isRead: true,
  },
  {
    id: '4',
    type: 'system',
    title: 'Profile Updated',
    message:
      'Your resume parsing was completed successfully. Your skills profile has been updated.',
    timestamp: '2 days ago',
    isRead: true,
  },
  {
    id: '5',
    type: 'new_job',
    title: 'New Match: Full Stack Developer',
    message: 'InnovateCo posted a new role matching your profile. Check it out.',
    timestamp: '3 days ago',
    isRead: true,
  },
]

export function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true)
        const data = await jobService.getNotifications()
        if (data && Array.isArray(data) && data.length > 0) setNotifications(data)
        else setNotifications(MOCK_NOTIFICATIONS)
      } catch (error) {
        console.warn('Failed to fetch notifications, using mock data:', error)
        setNotifications(MOCK_NOTIFICATIONS)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  const handleMarkRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    try {
      await jobService.markAllNotificationsRead()
    } catch (error) {
      console.warn('Failed to mark all as read on server:', error)
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const filteredNotifications = useMemo(() => {
    switch (activeTab) {
      case 'unread':
        return notifications.filter((n) => !n.isRead)
      case 'new_job':
        return notifications.filter((n) => n.type === 'new_job')
      case 'deadline_reminder':
        return notifications.filter((n) => n.type === 'deadline_reminder')
      case 'all':
      default:
        return notifications
    }
  }, [notifications, activeTab])

  const tabs = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: unreadCount },
    { id: 'new_job', label: 'New Jobs', count: notifications.filter((n) => n.type === 'new_job').length },
    { id: 'deadline_reminder', label: 'Deadlines', count: notifications.filter((n) => n.type === 'deadline_reminder').length },
  ]

  return (
    <PageWrapper>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-primary text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-slate-500 mt-1">Stay updated on your job search journey</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="btn-secondary text-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark all as read
          </button>
          <Link to="/job-matching/notifications/settings" className="btn-secondary text-sm">
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </div>
      </div>

      <div className="glass-panel overflow-hidden flex flex-col min-h-[500px]">
        <div className="flex overflow-x-auto border-b border-slate-200 hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-6 flex-1 bg-slate-50/50">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
              <p>Loading notifications...</p>
            </div>
          ) : filteredNotifications.length > 0 ? (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkRead={handleMarkRead}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center animate-fade-in">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                <BellOff className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                {activeTab === 'unread'
                  ? "You're all caught up!"
                  : activeTab === 'new_job'
                    ? 'No new job matches yet'
                    : activeTab === 'deadline_reminder'
                      ? 'No upcoming deadlines'
                      : 'No notifications'}
              </h3>
              <p className="text-slate-500 max-w-sm">When something happens, it will show up here.</p>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
