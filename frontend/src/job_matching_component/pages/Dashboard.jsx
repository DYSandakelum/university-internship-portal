import React, { useEffect, useState } from 'react'
import { PageWrapper } from '../components/PageWrapper'
import { jobService } from '../services/jobService'
import { Link } from 'react-router-dom'
import {
  Briefcase,
  Bookmark,
  Sparkles,
  Bell,
  ArrowRight,
  Activity,
  Search,
  Target,
  Clock,
  CheckCircle2,
} from 'lucide-react'

function useCountUp(end, duration = 1500) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime = null
    let animationFrame

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      const easeProgress = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeProgress * end))
      if (progress < 1) animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return count
}

export function Dashboard() {
  const [stats, setStats] = useState({
    applicationsSent: 0,
    savedJobs: 0,
    recommendedJobs: 0,
    newNotifications: 0,
  })
  const [loading, setLoading] = useState(true)

  const animApps = useCountUp(stats.applicationsSent)
  const animSaved = useCountUp(stats.savedJobs)
  const animRecs = useCountUp(stats.recommendedJobs)
  const animNotifs = useCountUp(stats.newNotifications)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        let savedCount = 12
        let recsCount = 34
        let notifsCount = 5

        try {
          const [saved, recs, notifs] = await Promise.all([
            jobService.getSavedJobs().catch(() => []),
            jobService.getRecommendedJobs().catch(() => []),
            jobService.getNotifications().catch(() => []),
          ])

          if (saved && saved.length > 0) savedCount = saved.length
          if (recs && recs.length > 0) recsCount = recs.length
          if (notifs && notifs.length > 0)
            notifsCount = notifs.filter((n) => !n.read && !n.isRead).length
        } catch (e) {
          console.warn('Using mock data for dashboard stats')
        }

        setStats({
          applicationsSent: 28,
          savedJobs: savedCount,
          recommendedJobs: recsCount,
          newNotifications: notifsCount,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const mockActivities = [
    {
      id: 1,
      title: 'Applied to Senior Frontend Engineer at TechCorp',
      time: '2 hours ago',
      icon: Briefcase,
      color: 'text-blue-500',
      bg: 'bg-blue-100',
    },
    {
      id: 2,
      title: '12 new job recommendations matched your profile',
      time: '5 hours ago',
      icon: Sparkles,
      color: 'text-purple-500',
      bg: 'bg-purple-100',
    },
    {
      id: 3,
      title: 'Saved Product Designer role at DesignHub',
      time: '1 day ago',
      icon: Bookmark,
      color: 'text-emerald-500',
      bg: 'bg-emerald-100',
    },
    {
      id: 4,
      title: 'Application viewed by hiring manager',
      time: '2 days ago',
      icon: Bell,
      color: 'text-amber-500',
      bg: 'bg-amber-100',
    },
  ]

  return (
    <PageWrapper>
      <div className="mb-8 animate-slide-up" style={{ animationDelay: '0ms' }}>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, Alex</h1>
        <p className="text-slate-600 text-lg">Here's what's happening with your job search today.</p>
      </div>

      <div
        className="glass-panel p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 animate-slide-up"
        style={{ animationDelay: '100ms' }}
      >
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">You have {animRecs} new recommendations!</h2>
            <p className="text-slate-600">We found new roles that closely match your skills and preferences.</p>
          </div>
        </div>
        <Link to="/job-matching/recommended" className="btn-primary whitespace-nowrap w-full md:w-auto">
          View Matches
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Applications Sent', value: animApps, icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-50', delay: '200ms' },
          { label: 'Saved Jobs', value: animSaved, icon: Bookmark, color: 'text-emerald-500', bg: 'bg-emerald-50', delay: '300ms' },
          { label: 'Recommended Jobs', value: animRecs, icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-50', delay: '400ms' },
          { label: 'New Notifications', value: animNotifs, icon: Bell, color: 'text-amber-500', bg: 'bg-amber-50', delay: '500ms' },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="modern-card p-6 flex items-center gap-4 animate-slide-up"
            style={{ animationDelay: stat.delay }}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900">
                {loading ? (
                  <span className="text-transparent bg-slate-200 rounded animate-pulse">00</span>
                ) : (
                  stat.value
                )}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-6 animate-slide-up" style={{ animationDelay: '600ms' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recent Activity
            </h2>
          </div>

          <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-4">
            {mockActivities.map((activity) => (
              <div key={activity.id} className="relative pl-8">
                <div
                  className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center ${activity.bg} ${activity.color}`}
                >
                  <activity.icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-medium">{activity.title}</h4>
                  <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 animate-slide-up" style={{ animationDelay: '700ms' }}>
          <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/job-matching/search"
              className="flex items-center p-4 rounded-xl border border-slate-200 bg-white hover:border-primary/30 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-primary/10 group-hover:text-primary transition-colors mr-4">
                <Search className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">Search Jobs</h3>
                <p className="text-xs text-slate-500">Find your next opportunity</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
            </Link>

            <Link
              to="/job-matching/opportunity"
              className="flex items-center p-4 rounded-xl border border-slate-200 bg-white hover:border-primary/30 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-primary/10 group-hover:text-primary transition-colors mr-4">
                <Target className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">Opportunity Centre</h3>
                <p className="text-xs text-slate-500">Manage your applications</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
            </Link>

            <Link
              to="/job-matching/saved"
              className="flex items-center p-4 rounded-xl border border-slate-200 bg-white hover:border-primary/30 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-primary/10 group-hover:text-primary transition-colors mr-4">
                <Bookmark className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">Saved Jobs</h3>
                <p className="text-xs text-slate-500">Review your bookmarked roles</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
            </Link>
          </div>

          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-primary/10">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Profile Complete</h4>
                <p className="text-xs text-slate-600 mt-1">Your profile is fully optimized for our matching algorithm.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
