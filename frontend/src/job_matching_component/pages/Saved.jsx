import React, { useEffect, useMemo, useState } from 'react'
import { PageWrapper } from '../components/PageWrapper'
import { JobCard } from '../components/JobCard'
import { jobService } from '../services/jobService'
import { Bookmark, Search, Trash2, AlertCircle } from 'lucide-react'

const MOCK_SAVED = [
  {
    id: 'saved-1',
    title: 'Senior Frontend Engineer',
    company: 'TechCorp Inc.',
    location: 'Remote',
    jobType: 'Full-time',
    salary: '$120k - $160k',
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
    matchScore: 92,
    savedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'saved-2',
    title: 'Full Stack Developer',
    company: 'StartupX',
    location: 'San Francisco, CA',
    jobType: 'Full-time',
    salary: '$130k - $180k',
    skills: ['React', 'Node.js', 'PostgreSQL'],
    matchScore: 85,
    savedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

function formatSavedDate(iso) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  } catch {
    return ''
  }
}

export function Saved() {
  const [jobs, setJobs] = useState([])
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('recent')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSaved = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await jobService.getSavedJobs()
        if (Array.isArray(data) && data.length > 0) setJobs(data)
        else setJobs(MOCK_SAVED)
      } catch (err) {
        console.warn('Failed to fetch saved jobs, using mock data', err)
        setJobs(MOCK_SAVED)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSaved()
  }, [])

  const filteredJobs = useMemo(() => {
    let list = [...jobs]

    if (query) {
      const q = query.toLowerCase()
      list = list.filter(
        (j) => j.title?.toLowerCase().includes(q) || j.company?.toLowerCase().includes(q),
      )
    }

    if (sort === 'recent') {
      list.sort((a, b) => new Date(b.savedAt || 0).getTime() - new Date(a.savedAt || 0).getTime())
    } else if (sort === 'match') {
      list.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    } else if (sort === 'company') {
      list.sort((a, b) => String(a.company || '').localeCompare(String(b.company || '')))
    }

    return list
  }, [jobs, query, sort])

  const handleRemoveSaved = async (jobId) => {
    const prev = jobs
    setJobs((j) => j.filter((x) => x.id !== jobId))

    try {
      await jobService.removeSavedJob(jobId)
    } catch (err) {
      console.warn('Failed to remove saved job on server, reverting', err)
      setJobs(prev)
    }
  }

  const handleApply = (jobId) => alert(`Applying to saved job: ${jobId}`)

  return (
    <PageWrapper>
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Bookmark className="w-6 h-6 text-primary" />
              Saved Jobs
            </h1>
            <p className="text-slate-500 mt-1">Keep track of roles you're interested in</p>
          </div>
          <div className="text-sm text-slate-500">
            <span className="font-semibold text-slate-900">{jobs.length}</span> saved
          </div>
        </div>

        <div className="glass-panel p-4 flex flex-col md:flex-row md:items-center gap-3 justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search saved jobs..."
              className="form-input pl-9 bg-white/60"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-500">Sort:</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="form-input py-2 bg-white/60 border-none shadow-sm"
            >
              <option value="recent">Most Recent</option>
              <option value="match">Match Score</option>
              <option value="company">Company</option>
            </select>
          </div>
        </div>
      </div>

      {error ? (
        <div className="glass-panel p-8 text-center flex flex-col items-center">
          <AlertCircle className="w-12 h-12 text-error mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">Something went wrong</h3>
          <p className="text-slate-600 mb-4">{error}</p>
        </div>
      ) : isLoading ? (
        <div className="modern-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="modern-card p-5 h-[260px] animate-pulse bg-white/50" />
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No saved jobs</h3>
          <p className="text-slate-600 max-w-md mx-auto">
            Save jobs you're interested in so you can easily find them later.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="glass-panel p-4">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="text-xs text-slate-500">
                  Saved {job.savedAt ? formatSavedDate(job.savedAt) : 'recently'}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSaved(job.id)}
                  className="btn-secondary text-sm"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
              <JobCard job={job} isSaved={true} onSave={() => handleRemoveSaved(job.id)} onApply={handleApply} />
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  )
}
