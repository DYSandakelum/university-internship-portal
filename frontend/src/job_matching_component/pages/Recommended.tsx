import React, { useEffect, useMemo, useState } from 'react'
import { PageWrapper } from '../components/PageWrapper'
import { JobCard, Job } from '../components/JobCard'
import { jobService } from '../services/jobService'
import { Sparkles, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'

const MOCK_RECOMMENDATIONS: Job[] = [
  {
    id: 'rec-1',
    title: 'Senior React Developer',
    company: 'TechCorp Inc.',
    location: 'Remote',
    jobType: 'Full-time',
    salary: '$140k - $180k',
    skills: ['React', 'TypeScript', 'Next.js', 'GraphQL'],
    matchScore: 95,
  },
  {
    id: 'rec-2',
    title: 'Frontend Tech Lead',
    company: 'Innovate LLC',
    location: 'New York, NY',
    jobType: 'Full-time',
    salary: '$160k - $200k',
    skills: ['React', 'System Design', 'Team Leadership'],
    matchScore: 92,
  },
  {
    id: 'rec-3',
    title: 'UI Engineer',
    company: 'DesignHub',
    location: 'San Francisco, CA',
    jobType: 'Contract',
    salary: '$90/hr',
    skills: ['React', 'CSS', 'Figma', 'Animation'],
    matchScore: 85,
  },
  {
    id: 'rec-4',
    title: 'Full Stack Developer (React/Node)',
    company: 'StartupX',
    location: 'Remote',
    jobType: 'Full-time',
    salary: '$130k - $160k',
    skills: ['React', 'Node.js', 'PostgreSQL'],
    matchScore: 78,
  },
  {
    id: 'rec-5',
    title: 'Web Developer',
    company: 'Agency Plus',
    location: 'London, UK',
    jobType: 'Full-time',
    salary: '£60k - £80k',
    skills: ['HTML', 'CSS', 'JavaScript', 'React'],
    matchScore: 65,
  },
  {
    id: 'rec-6',
    title: 'Junior Frontend Developer',
    company: 'TechStart',
    location: 'Remote',
    jobType: 'Full-time',
    salary: '$80k - $100k',
    skills: ['React', 'JavaScript', 'HTML'],
    matchScore: 55,
  },
  {
    id: 'rec-7',
    title: 'Product Designer',
    company: 'Creative Co',
    location: 'Remote',
    jobType: 'Full-time',
    skills: ['Figma', 'UX', 'UI'],
    matchScore: 45,
  },
]

type Category = 'all' | 'perfect' | 'high' | 'good' | 'potential'

export function Recommended() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 6

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [recsData, savedData] = await Promise.allSettled([
          jobService.getRecommendedJobs(),
          jobService.getSavedJobs(),
        ])

        if (
          recsData.status === 'fulfilled' &&
          Array.isArray(recsData.value) &&
          recsData.value.length > 0
        ) {
          setJobs(recsData.value)
        } else {
          setJobs(MOCK_RECOMMENDATIONS)
        }

        if (savedData.status === 'fulfilled' && Array.isArray(savedData.value)) {
          setSavedJobIds(new Set(savedData.value.map((j: any) => j.id || j.jobId)))
        } else {
          setSavedJobIds(new Set(['rec-1']))
        }
      } catch (err) {
        console.error('Error fetching recommendations', err)
        setError('Failed to load recommendations. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSaveJob = async (jobId: string) => {
    try {
      const isCurrentlySaved = savedJobIds.has(jobId)
      const newSavedIds = new Set(savedJobIds)
      if (isCurrentlySaved) newSavedIds.delete(jobId)
      else newSavedIds.add(jobId)

      setSavedJobIds(newSavedIds)

      if (isCurrentlySaved) {
        await jobService.removeSavedJob(jobId)
      } else {
        await jobService.saveJob(jobId)
      }
    } catch (err) {
      console.error('Failed to toggle save status', err)
    }
  }

  const counts = useMemo(() => {
    return {
      all: jobs.length,
      perfect: jobs.filter((j) => (j.matchScore || 0) >= 90).length,
      high: jobs.filter((j) => (j.matchScore || 0) >= 70 && (j.matchScore || 0) < 90).length,
      good: jobs.filter((j) => (j.matchScore || 0) >= 50 && (j.matchScore || 0) < 70).length,
      potential: jobs.filter((j) => (j.matchScore || 0) < 50).length,
    }
  }, [jobs])

  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      const score = j.matchScore || 0
      switch (activeCategory) {
        case 'perfect':
          return score >= 90
        case 'high':
          return score >= 70 && score < 90
        case 'good':
          return score >= 50 && score < 70
        case 'potential':
          return score < 50
        default:
          return true
      }
    })
  }, [jobs, activeCategory])

  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE)
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [activeCategory])

  const categories: {
    id: Category
    label: string
    count: number
    colorClass: string
  }[] = [
    { id: 'all', label: 'All Matches', count: counts.all, colorClass: 'bg-slate-100 text-slate-700' },
    { id: 'perfect', label: 'Perfect Match (90%+)', count: counts.perfect, colorClass: 'bg-success/10 text-success' },
    { id: 'high', label: 'High Match (70-89%)', count: counts.high, colorClass: 'bg-primary/10 text-primary' },
    { id: 'good', label: 'Good Match (50-69%)', count: counts.good, colorClass: 'bg-warning/10 text-warning' },
    { id: 'potential', label: 'Potential (<50%)', count: counts.potential, colorClass: 'bg-slate-100 text-slate-500' },
  ]

  return (
    <PageWrapper>
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4 shadow-inner">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Recommended for You</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          We've analyzed your profile and skills to find these {jobs.length} personalized opportunities.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat.id
                ? 'ring-2 ring-primary ring-offset-2 shadow-md ' + cat.colorClass
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat.label}
            <span className="ml-2 px-2 py-0.5 rounded-full bg-white/50 text-xs">{cat.count}</span>
          </button>
        ))}
      </div>

      {error ? (
        <div className="glass-panel p-8 text-center flex flex-col items-center max-w-lg mx-auto">
          <AlertCircle className="w-12 h-12 text-error mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">Unable to load recommendations</h3>
          <p className="text-slate-600 mb-4">{error}</p>
        </div>
      ) : isLoading ? (
        <div className="modern-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="modern-card p-5 h-[280px] animate-pulse bg-white/50" />
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="glass-panel p-12 text-center flex flex-col items-center max-w-2xl mx-auto">
          <Sparkles className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No matches in this category</h3>
          <p className="text-slate-600 mb-6">
            We couldn't find any recommendations that fit into the "{categories.find((c) => c.id === activeCategory)?.label}" category.
          </p>
          <button onClick={() => setActiveCategory('all')} className="btn-secondary">
            View All Recommendations
          </button>
        </div>
      ) : (
        <>
          <div className="modern-grid mb-8">
            {paginatedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSaved={savedJobIds.has(job.id)}
                onSave={handleSaveJob}
                onApply={() => alert(`Applying to ${job.title}`)}
                showMatchDetails={true}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="btn-icon bg-white border border-slate-200 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === i + 1
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="btn-icon bg-white border border-slate-200 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </PageWrapper>
  )
}
