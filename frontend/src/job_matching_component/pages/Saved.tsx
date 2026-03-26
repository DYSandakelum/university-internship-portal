import React, { useEffect, useMemo, useState } from 'react'
import { PageWrapper } from '../components/PageWrapper'
import { JobCard, Job } from '../components/JobCard'
import { jobService } from '../services/jobService'
import { Link } from 'react-router-dom'
import {
  Bookmark,
  Search,
  Trash2,
  Building2,
  Calendar,
} from 'lucide-react'

const MOCK_SAVED_JOBS: Job[] = [
  {
    id: 'saved-1',
    title: 'Senior React Developer',
    company: 'TechCorp Inc.',
    location: 'Remote',
    jobType: 'Full-time',
    salary: '$140k - $180k',
    skills: ['React', 'TypeScript', 'Next.js'],
    matchScore: 95,
  },
  {
    id: 'saved-2',
    title: 'Frontend Tech Lead',
    company: 'Innovate LLC',
    location: 'New York, NY',
    jobType: 'Full-time',
    salary: '$160k - $200k',
    skills: ['React', 'System Design'],
    matchScore: 92,
  },
  {
    id: 'saved-3',
    title: 'UI Engineer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    jobType: 'Contract',
    skills: ['React', 'CSS', 'Figma'],
    matchScore: 85,
  },
]

export function Saved() {
  const [savedJobs, setSavedJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isSelectionMode, setIsSelectionMode] = useState(false)

  const fetchSavedJobs = async () => {
    setIsLoading(true)
    try {
      const data = await jobService.getSavedJobs()
      if (Array.isArray(data) && data.length > 0) {
        setSavedJobs(data)
      } else {
        setSavedJobs(MOCK_SAVED_JOBS)
      }
    } catch (err) {
      console.warn('Failed to fetch saved jobs, using mock data', err)
      setSavedJobs(MOCK_SAVED_JOBS)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSavedJobs()
  }, [])

  const handleRemove = async (jobId: string) => {
    setSavedJobs((prev) => prev.filter((j) => j.id !== jobId))
    try {
      await jobService.removeSavedJob(jobId)
    } catch (err) {
      console.error('Failed to remove job', err)
      fetchSavedJobs()
    }
  }

  const handleBulkRemove = async () => {
    if (selectedIds.size === 0) return
    const idsToRemove = Array.from(selectedIds)

    setSavedJobs((prev) => prev.filter((j) => !selectedIds.has(j.id)))
    setSelectedIds(new Set())
    setIsSelectionMode(false)

    try {
      await Promise.all(idsToRemove.map((id) => jobService.removeSavedJob(id)))
    } catch (err) {
      console.error('Failed bulk remove', err)
      fetchSavedJobs()
    }
  }

  const toggleSelection = (jobId: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(jobId)) newSelected.delete(jobId)
    else newSelected.add(jobId)
    setSelectedIds(newSelected)
  }

  const uniqueCompanies = new Set(savedJobs.map((j) => j.company)).size
  const savedThisWeek = Math.min(savedJobs.length, 3)

  const filteredAndSortedJobs = useMemo(() => {
    let result = [...savedJobs]
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (j) => j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q),
      )
    }

    result.sort((a, b) => {
      if (sortBy === 'company') return a.company.localeCompare(b.company)
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      return sortBy === 'newest' ? -1 : 1
    })

    return result
  }, [savedJobs, searchQuery, sortBy])

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <Bookmark className="w-8 h-8 text-primary" />
          Saved Jobs
        </h1>
        <p className="text-slate-500">Keep track of opportunities you're interested in.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Saved</p>
            <p className="text-2xl font-bold text-slate-900">{savedJobs.length}</p>
          </div>
        </div>
        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Unique Companies</p>
            <p className="text-2xl font-bold text-slate-900">{uniqueCompanies}</p>
          </div>
        </div>
        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Saved This Week</p>
            <p className="text-2xl font-bold text-slate-900">{savedThisWeek}</p>
          </div>
        </div>
      </div>

      <div className="glass-panel p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search saved jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-9 bg-white/50"
          />
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-input bg-white/50 py-2 text-sm w-full sm:w-auto"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="company">Company (A-Z)</option>
            <option value="title">Job Title (A-Z)</option>
          </select>

          {isSelectionMode ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkRemove}
                disabled={selectedIds.size === 0}
                className="btn-secondary text-error border-error/20 hover:bg-error/5 disabled:opacity-50 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Remove ({selectedIds.size})
              </button>
              <button
                onClick={() => {
                  setIsSelectionMode(false)
                  setSelectedIds(new Set())
                }}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsSelectionMode(true)}
              disabled={savedJobs.length === 0}
              className="btn-secondary text-sm disabled:opacity-50"
            >
              Select Multiple
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="modern-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="modern-card p-5 h-[280px] animate-pulse bg-white/50" />
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="glass-panel p-16 text-center flex flex-col items-center max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <Bookmark className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">No saved jobs yet</h3>
          <p className="text-slate-600 mb-8 text-lg">
            When you see a job you like, click the bookmark icon to save it here for later.
          </p>
          <div className="flex gap-4">
            <Link to="/job-matching/search" className="btn-primary">
              Search Jobs
            </Link>
            <Link to="/job-matching/recommended" className="btn-secondary">
              View Recommendations
            </Link>
          </div>
        </div>
      ) : filteredAndSortedJobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500">No saved jobs match your search.</p>
        </div>
      ) : (
        <div className="modern-grid">
          {filteredAndSortedJobs.map((job) => (
            <div key={job.id} className="relative group">
              {isSelectionMode && (
                <div className="absolute top-4 left-4 z-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(job.id)}
                    onChange={() => toggleSelection(job.id)}
                    className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                </div>
              )}
              <div className={isSelectionMode ? 'pl-8 transition-all' : 'transition-all'}>
                <JobCard
                  job={job}
                  isSaved={true}
                  saveMode="remove"
                  onSave={handleRemove}
                  onApply={() => alert(`Applying to ${job.title}`)}
                  showMatchDetails={true}
                />
              </div>
              {isSelectionMode && (
                <div
                  className="absolute inset-0 z-0 cursor-pointer rounded-xl border-2 border-transparent hover:border-primary/30 transition-colors"
                  onClick={() => toggleSelection(job.id)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  )
}
