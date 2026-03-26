import React, { useEffect, useMemo, useState } from 'react'
import { PageWrapper } from '../components/PageWrapper'
import { JobCard, Job } from '../components/JobCard'
import { jobService } from '../services/jobService'
import {
  Compass,
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  Sparkles,
  ExternalLink,
} from 'lucide-react'

type Opportunity = {
  id: string
  type: 'job' | 'internship' | 'event' | 'course' | 'mentorship'
  title: string
  organization: string
  location?: string
  deadline?: string
  description?: string
  tags?: string[]
  matchScore?: number
  link?: string
  job?: Job
}

const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    type: 'job',
    title: 'Frontend Engineer',
    organization: 'TechCorp Inc.',
    location: 'Remote',
    deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    matchScore: 88,
    tags: ['React', 'TypeScript'],
    job: {
      id: 'opp-job-1',
      title: 'Frontend Engineer',
      company: 'TechCorp Inc.',
      location: 'Remote',
      jobType: 'Full-time',
      salary: '$120k - $160k',
      skills: ['React', 'TypeScript', 'Tailwind CSS'],
      matchScore: 88,
    },
  },
  {
    id: 'opp-2',
    type: 'internship',
    title: 'Product Design Intern',
    organization: 'DesignHub',
    location: 'New York, NY',
    deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['Figma', 'UX'],
    matchScore: 72,
    link: 'https://example.com',
  },
  {
    id: 'opp-3',
    type: 'event',
    title: 'Career Fair: Tech & Startups',
    organization: 'City University',
    location: 'Campus Hall A',
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['Networking', 'Recruiters'],
    matchScore: 60,
    link: 'https://example.com',
  },
  {
    id: 'opp-4',
    type: 'course',
    title: 'GraphQL for Frontend Engineers',
    organization: 'Online Academy',
    tags: ['GraphQL', 'API'],
    matchScore: 80,
    link: 'https://example.com',
  },
  {
    id: 'opp-5',
    type: 'mentorship',
    title: 'Frontend Mentorship Program',
    organization: 'Community Mentors',
    tags: ['Mentorship', 'Career'],
    matchScore: 55,
    link: 'https://example.com',
  },
]

type Filter = 'all' | Opportunity['type']

export function OpportunityCentre() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<Filter>('all')

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const data = await jobService.getOpportunities()
        if (Array.isArray(data) && data.length > 0) {
          setOpportunities(data as any)
        } else {
          setOpportunities(MOCK_OPPORTUNITIES)
        }
      } catch (err) {
        console.warn('Failed to fetch opportunities, using mock data', err)
        setOpportunities(MOCK_OPPORTUNITIES)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return opportunities
    return opportunities.filter((o) => o.type === activeFilter)
  }, [opportunities, activeFilter])

  const filters: { id: Filter; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All', icon: <Compass className="w-4 h-4" /> },
    { id: 'job', label: 'Jobs', icon: <Users className="w-4 h-4" /> },
    { id: 'internship', label: 'Internships', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'event', label: 'Events', icon: <Calendar className="w-4 h-4" /> },
    { id: 'course', label: 'Courses', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'mentorship', label: 'Mentorship', icon: <Sparkles className="w-4 h-4" /> },
  ]

  return (
    <PageWrapper>
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 text-primary mb-4 shadow-inner">
          <Compass className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Opportunity Centre</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Explore jobs, internships, events, courses, and mentorship opportunities.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all inline-flex items-center gap-2 ${
              activeFilter === f.id
                ? 'bg-primary text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {f.icon}
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="modern-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="modern-card p-5 h-[240px] animate-pulse bg-white/50" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel p-12 text-center max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-slate-900 mb-2">No opportunities found</h3>
          <p className="text-slate-600">Try another category.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((opp) => (
            <div key={opp.id} className="glass-panel p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">
                    {opp.type}
                  </p>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">{opp.title}</h3>
                  <p className="text-slate-600 mt-1">{opp.organization}</p>
                </div>
                {typeof opp.matchScore === 'number' && (
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Match</p>
                    <p className="text-2xl font-bold text-primary">{opp.matchScore}%</p>
                  </div>
                )}
              </div>

              {(opp.location || opp.deadline) && (
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
                  {opp.location && <span>{opp.location}</span>}
                  {opp.deadline && (
                    <span>
                      Deadline: {new Date(opp.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
              )}

              {opp.description && <p className="text-slate-600 mt-4">{opp.description}</p>}

              {opp.tags && opp.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {opp.tags.map((t) => (
                    <span key={t} className="badge">
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {opp.job ? (
                <div className="mt-6">
                  <JobCard
                    job={opp.job}
                    isSaved={false}
                    onSave={() => {}}
                    onApply={() => alert(`Applying to ${opp.job!.title}`)}
                    showMatchDetails={true}
                  />
                </div>
              ) : opp.link ? (
                <div className="mt-6">
                  <a
                    href={opp.link}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary inline-flex items-center gap-2"
                  >
                    Learn more
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  )
}
