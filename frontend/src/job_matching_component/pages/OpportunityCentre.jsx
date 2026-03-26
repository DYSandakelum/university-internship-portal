import React, { useEffect, useMemo, useState } from 'react'
import { PageWrapper } from '../components/PageWrapper'
import { ActionQueue } from '../components/ActionQueue'
import { DeadlineTimeline } from '../components/DeadlineTimeline'
import { ScoreGauge } from '../components/ScoreGauge'
import { SkillGapPanel } from '../components/SkillGapPanel'
import { MomentumChart } from '../components/MomentumChart'
import { jobService } from '../services/jobService'
import { Target, RefreshCw, AlertCircle } from 'lucide-react'

export function OpportunityCentre() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const dashboard = await jobService.getOpportunityDashboard()
      if (dashboard && typeof dashboard === 'object') {
        setData(dashboard)
      } else {
        throw new Error('No dashboard data')
      }
    } catch (err) {
      console.warn('Opportunity dashboard fetch failed, using mock data', err)
      setData({
        opportunityScore: 78,
        momentum: [
          { label: 'Mon', value: 4 },
          { label: 'Tue', value: 7 },
          { label: 'Wed', value: 5 },
          { label: 'Thu', value: 9 },
          { label: 'Fri', value: 6 },
          { label: 'Sat', value: 2 },
          { label: 'Sun', value: 3 },
        ],
        skillGaps: [
          { skill: 'System Design', gap: 3 },
          { skill: 'Testing', gap: 2 },
          { skill: 'GraphQL', gap: 1 },
        ],
        upcomingDeadlines: [
          {
            id: 'd1',
            title: 'UX Designer at DesignHub',
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            urgency: 'high',
          },
          {
            id: 'd2',
            title: 'Senior React Developer at TechCorp',
            dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
            urgency: 'medium',
          },
          {
            id: 'd3',
            title: 'Full Stack Developer at StartupX',
            dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
            urgency: 'low',
          },
        ],
        actionQueue: [
          {
            id: 'a1',
            title: 'Tailor resume for TechCorp role',
            description: 'Emphasize React performance and design system experience.',
            priority: 'high',
            category: 'resume',
            due: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'a2',
            title: 'Draft cover letter for DesignHub',
            description: 'Highlight UX collaboration and prototyping expertise.',
            priority: 'medium',
            category: 'cover_letter',
            due: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'a3',
            title: 'Follow up on StartupXYZ application',
            description: 'Send a short email to recruiter (application viewed).',
            priority: 'low',
            category: 'follow_up',
            due: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const score = data?.opportunityScore || 0

  const scoreDetails = useMemo(() => {
    if (score >= 85) return { title: 'Excellent', desc: 'You are in a strong position. Keep momentum up.' }
    if (score >= 70) return { title: 'Strong', desc: 'Good progress. A few improvements can boost results.' }
    if (score >= 50) return { title: 'Building', desc: 'You are making progress. Focus on key actions.' }
    return { title: 'Needs Attention', desc: 'Prioritize deadlines and fill key skill gaps.' }
  }, [score])

  return (
    <PageWrapper>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Opportunity Centre</h1>
              <p className="text-slate-500">Track momentum, deadlines, and your next best actions.</p>
            </div>
          </div>
        </div>
        <button type="button" onClick={fetchData} className="btn-secondary" disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="glass-panel p-4 border border-error/20 bg-error/5 mb-6">
          <div className="flex items-center gap-2 text-error font-medium">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="modern-card h-[220px] animate-pulse bg-white/50" />
          <div className="modern-card h-[220px] animate-pulse bg-white/50" />
          <div className="modern-card h-[220px] animate-pulse bg-white/50" />
          <div className="modern-card h-[260px] animate-pulse bg-white/50 lg:col-span-2" />
          <div className="modern-card h-[260px] animate-pulse bg-white/50" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Opportunity Score</h2>
              <span className="text-sm font-semibold text-slate-500">{scoreDetails.title}</span>
            </div>
            <ScoreGauge value={score} />
            <p className="text-sm text-slate-600 mt-4">{scoreDetails.desc}</p>
          </div>

          <div className="glass-panel p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Momentum</h2>
            <MomentumChart data={data?.momentum || []} />
          </div>

          <div className="glass-panel p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Skill Gaps</h2>
            <SkillGapPanel gaps={data?.skillGaps || []} />
          </div>

          <div className="glass-panel p-6 lg:col-span-2">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Action Queue</h2>
            <ActionQueue actions={data?.actionQueue || []} />
          </div>

          <div className="glass-panel p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Upcoming Deadlines</h2>
            <DeadlineTimeline deadlines={data?.upcomingDeadlines || []} />
          </div>
        </div>
      )}
    </PageWrapper>
  )
}
