import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageWrapper } from '../components/PageWrapper'
import { ActionQueue, ActionItem } from '../components/ActionQueue'
import { DeadlineTimeline, DeadlineItem } from '../components/DeadlineTimeline'
import { MomentumChart, MomentumData } from '../components/MomentumChart'
import { SkillGapPanel, SkillGap } from '../components/SkillGapPanel'
import { ScoreGauge } from '../components/ScoreGauge'
import { jobService } from '../services/jobService'
import {
  Briefcase,
  Bookmark,
  Bell,
  Sparkles,
  TrendingUp,
  Calendar,
  GraduationCap,
  ArrowRight,
} from 'lucide-react'

const MOCK_DASHBOARD = {
  matchScore: 86,
  stats: {
    recommended: 12,
    saved: 4,
    applications: 3,
    notificationsUnread: 2,
  },
  actionQueue: [
    {
      id: 'act-1',
      title: 'Apply to Senior React Developer',
      description: '95% match at TechCorp Inc.',
      type: 'apply',
      impact: 12,
      details: 'Submitting this application keeps momentum high and can unlock interviews faster.',
    },
    {
      id: 'act-2',
      title: 'Update skills: GraphQL',
      description: 'Could improve your match rate by 12%',
      type: 'skill',
      impact: 8,
      details: 'Add GraphQL to your profile and include 1 small project to validate experience.',
    },
    {
      id: 'act-3',
      title: 'Connect with 2 recruiters',
      description: 'Based on your saved jobs',
      type: 'network',
      impact: 5,
      details: 'Send concise messages referencing the role and why you are a strong fit.',
    },
  ] as ActionItem[],
  deadlines: [
    {
      id: 'dl-1',
      title: 'UI Engineer — DesignHub',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'application',
      status: 'urgent',
    },
    {
      id: 'dl-2',
      title: 'Career Fair RSVP',
      date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'event',
      status: 'upcoming',
    },
    {
      id: 'dl-3',
      title: 'Update Resume',
      date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'profile',
      status: 'planned',
    },
  ] as DeadlineItem[],
  momentum: [
    { week: 'Mon', applications: 1, interviews: 0, offers: 0 },
    { week: 'Tue', applications: 1, interviews: 1, offers: 0 },
    { week: 'Wed', applications: 0, interviews: 1, offers: 0 },
    { week: 'Thu', applications: 2, interviews: 0, offers: 0 },
    { week: 'Fri', applications: 1, interviews: 0, offers: 1 },
    { week: 'Sat', applications: 0, interviews: 1, offers: 0 },
    { week: 'Sun', applications: 1, interviews: 0, offers: 0 },
  ] as MomentumData[],
  skillGaps: [
    {
      id: 'sg-1',
      skill: 'GraphQL',
      importance: 'high',
      currentLevel: 35,
      requiredLevel: 70,
      resources: [
        {
          title: 'Apollo GraphQL Tutorial',
          type: 'course',
          url: 'https://www.apollographql.com/tutorials/',
          duration: '2h',
        },
        {
          title: 'Build a small GraphQL project',
          type: 'project',
          url: 'https://graphql.org/learn/',
          duration: '4h',
        },
      ],
    },
    {
      id: 'sg-2',
      skill: 'System Design',
      importance: 'medium',
      currentLevel: 55,
      requiredLevel: 75,
      resources: [
        {
          title: 'System Design Primer',
          type: 'article',
          url: 'https://github.com/donnemartin/system-design-primer',
          duration: '3h',
        },
        {
          title: 'Practice: design a feed',
          type: 'project',
          url: 'https://www.educative.io/',
          duration: '2h',
        },
      ],
    },
  ] as SkillGap[],
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [matchScore, setMatchScore] = useState<number>(MOCK_DASHBOARD.matchScore)
  const [actionQueue, setActionQueue] = useState<ActionItem[]>(MOCK_DASHBOARD.actionQueue)
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>(MOCK_DASHBOARD.deadlines)
  const [momentum, setMomentum] = useState<MomentumData[]>(MOCK_DASHBOARD.momentum)
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>(MOCK_DASHBOARD.skillGaps)
  const [stats, setStats] = useState(MOCK_DASHBOARD.stats)

  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true)
      try {
        const data = await jobService.getDashboard()
        if (data && typeof data === 'object') {
          setMatchScore((data as any).matchScore ?? MOCK_DASHBOARD.matchScore)
          setActionQueue((data as any).actionQueue ?? MOCK_DASHBOARD.actionQueue)
          setDeadlines((data as any).deadlines ?? MOCK_DASHBOARD.deadlines)
          setMomentum((data as any).momentum ?? MOCK_DASHBOARD.momentum)
          setSkillGaps((data as any).skillGaps ?? MOCK_DASHBOARD.skillGaps)
          setStats((data as any).stats ?? MOCK_DASHBOARD.stats)
        }
      } catch (err) {
        console.warn('Failed to fetch dashboard, using mock data', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  const quickLinks = useMemo(
    () => [
      {
        to: '/job-matching/recommended',
        label: 'Recommended',
        icon: <Sparkles className="w-5 h-5" />,
        value: stats.recommended,
      },
      {
        to: '/job-matching/saved',
        label: 'Saved',
        icon: <Bookmark className="w-5 h-5" />,
        value: stats.saved,
      },
      {
        to: '/job-matching/notifications',
        label: 'Notifications',
        icon: <Bell className="w-5 h-5" />,
        value: stats.notificationsUnread,
      },
      {
        to: '/job-matching/search',
        label: 'Search',
        icon: <Briefcase className="w-5 h-5" />,
        value: null,
      },
    ],
    [stats],
  )

  return (
    <PageWrapper>
      <div className="glass-panel p-6 md:p-7 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 truncate">Dashboard</h1>
                <p className="text-slate-600 mt-0.5 text-sm md:text-base">
                  Next actions, deadlines, and progress—at a glance.
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {quickLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="group rounded-xl border border-white/60 bg-white/40 px-4 py-3 hover:bg-white/60 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-primary">
                      {l.icon}
                    </div>
                    {typeof l.value === 'number' ? (
                      <div className="text-right">
                        <p className="text-[11px] uppercase tracking-wide text-slate-500">Total</p>
                        <p className="text-lg font-bold text-slate-900 leading-tight">{l.value}</p>
                      </div>
                    ) : (
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                    )}
                  </div>
                  <p className="mt-2 font-semibold text-slate-900">{l.label}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex-shrink-0 w-full lg:w-[360px] rounded-2xl border border-white/60 bg-white/40 p-5">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20">
                <ScoreGauge score={matchScore} />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wide text-slate-500">Overall Match</p>
                <p className="text-2xl font-bold text-slate-900 leading-tight">{matchScore}%</p>
                <p className="text-sm text-slate-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-success" />
                  Trending up this week
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-white/50 border border-white/70 p-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">Applications</p>
                <p className="text-lg font-bold text-slate-900 leading-tight">{stats.applications}</p>
              </div>
              <div className="rounded-xl bg-white/50 border border-white/70 p-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">Saved</p>
                <p className="text-lg font-bold text-slate-900 leading-tight">{stats.saved}</p>
              </div>
              <div className="rounded-xl bg-white/50 border border-white/70 p-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">Unread</p>
                <p className="text-lg font-bold text-slate-900 leading-tight">{stats.notificationsUnread}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Action Queue</h2>
                <p className="text-sm text-slate-600 mt-0.5">Highest-impact moves to increase outcomes.</p>
              </div>
              <Link
                to="/job-matching/search"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                Find jobs
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <ActionQueue actions={actionQueue} />
          </div>

          <div className="glass-panel p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Momentum</h2>
                <p className="text-sm text-slate-600 mt-0.5">Activity trend across the last 7 days.</p>
              </div>
              <span className="text-xs uppercase tracking-wide text-slate-500">Last 7 days</span>
            </div>
            <MomentumChart data={momentum} trend="up" trendMessage="Making steady progress" />
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Deadlines</h2>
                <p className="text-sm text-slate-600 mt-0.5">Stay ahead of upcoming cutoffs.</p>
              </div>
              <Calendar className="w-5 h-5 text-slate-400" />
            </div>
            {deadlines.length > 0 ? (
              <DeadlineTimeline
                deadline={deadlines[0].date}
                status={
                  deadlines[0].status === 'urgent'
                    ? 'critical'
                    : deadlines[0].status === 'upcoming'
                      ? 'warning'
                      : 'safe'
                }
                applicationStatus="in_progress"
                timeUsedPercent={
                  deadlines[0].status === 'urgent' ? 92 : deadlines[0].status === 'upcoming' ? 72 : 45
                }
              />
            ) : (
              <div className="modern-card p-6 text-center text-slate-500">No upcoming deadlines.</div>
            )}
          </div>

          <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Skill Gaps</h2>
                <p className="text-sm text-slate-600 mt-0.5">Target the biggest match-score lifts.</p>
              </div>
              <GraduationCap className="w-5 h-5 text-slate-400" />
            </div>
            <SkillGapPanel gaps={skillGaps} overallProgress={64} />
          </div>

          <div className="glass-panel p-6">
            <h2 className="text-lg font-bold text-slate-900">Score Breakdown</h2>
            <p className="text-sm text-slate-600 mt-0.5 mb-4">How your profile aligns overall.</p>
            <ScoreGauge score={matchScore} />
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
