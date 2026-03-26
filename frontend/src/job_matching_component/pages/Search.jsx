import React, { useCallback, useEffect, useState } from 'react'
import { PageWrapper } from '../components/PageWrapper'
import { SearchBar } from '../components/SearchBar'
import { FilterPanel } from '../components/FilterPanel'
import { JobCard } from '../components/JobCard'
import { jobService } from '../services/jobService'
import { Grid, List, AlertCircle, Frown } from 'lucide-react'

const MOCK_JOBS = [
  {
    id: 'job-1',
    title: 'Senior Frontend Engineer',
    company: 'TechCorp Inc.',
    location: 'Remote',
    jobType: 'Full-time',
    salary: '$120k - $160k',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
    matchScore: 92,
    description:
      'Looking for an experienced frontend engineer to lead our core product team.',
  },
  {
    id: 'job-2',
    title: 'UX/UI Designer',
    company: 'DesignHub',
    location: 'New York, NY',
    jobType: 'Contract',
    salary: '$80k - $110k',
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    skills: ['Figma', 'Prototyping', 'User Research', 'CSS'],
    matchScore: 78,
  },
  {
    id: 'job-3',
    title: 'Full Stack Developer',
    company: 'StartupX',
    location: 'San Francisco, CA',
    jobType: 'Full-time',
    salary: '$130k - $180k',
    skills: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
    matchScore: 85,
  },
  {
    id: 'job-4',
    title: 'React Native Developer',
    company: 'MobileFirst',
    location: 'Remote',
    jobType: 'Freelance',
    salary: '$70/hr',
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    skills: ['React Native', 'iOS', 'Android', 'Redux'],
    matchScore: 65,
  },
  {
    id: 'job-5',
    title: 'Product Manager',
    company: 'Innovate LLC',
    location: 'London, UK',
    jobType: 'Full-time',
    salary: '£70k - £90k',
    skills: ['Agile', 'Jira', 'Product Strategy', 'Data Analysis'],
    matchScore: 45,
  },
]

export function Search() {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({})
  const [sort, setSort] = useState('relevance')
  const [viewMode, setViewMode] = useState('grid')
  const [results, setResults] = useState([])
  const [savedJobIds, setSavedJobIds] = useState(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchJobs = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await jobService.searchJobs({ q: query, ...filters, sort })
      if (Array.isArray(data) && data.length > 0) {
        setResults(data)
      } else {
        throw new Error('No data returned from API')
      }
    } catch (err) {
      console.warn('Search API failed, using mock data fallback', err)
      let filtered = [...MOCK_JOBS]

      if (query) {
        const q = query.toLowerCase()
        filtered = filtered.filter(
          (j) =>
            j.title.toLowerCase().includes(q) ||
            j.company.toLowerCase().includes(q) ||
            j.skills.some((s) => s.toLowerCase().includes(q)),
        )
      }

      if (filters.jobType) filtered = filtered.filter((j) => j.jobType === filters.jobType)
      if (filters.location) filtered = filtered.filter((j) => j.location.includes(filters.location))

      setTimeout(() => {
        setResults(filtered)
        setIsLoading(false)
      }, 600)
      return
    }

    setIsLoading(false)
  }, [query, filters, sort])

  const fetchSavedJobs = useCallback(async () => {
    try {
      const saved = await jobService.getSavedJobs()
      if (Array.isArray(saved)) {
        setSavedJobIds(new Set(saved.map((j) => j.id || j.jobId)))
      }
    } catch (err) {
      console.warn('Failed to fetch saved jobs', err)
      setSavedJobIds(new Set(['job-1', 'job-3']))
    }
  }, [])

  useEffect(() => {
    fetchSavedJobs()
  }, [fetchSavedJobs])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  const handleSaveJob = async (jobId) => {
    try {
      const isCurrentlySaved = savedJobIds.has(jobId)
      const newSavedIds = new Set(savedJobIds)
      if (isCurrentlySaved) newSavedIds.delete(jobId)
      else newSavedIds.add(jobId)
      setSavedJobIds(newSavedIds)

      if (isCurrentlySaved) await jobService.removeSavedJob(jobId)
      else await jobService.saveJob(jobId)
    } catch (err) {
      console.error('Failed to toggle save status', err)
      fetchSavedJobs()
    }
  }

  const handleApply = (jobId) => {
    alert(`Application flow initiated for job: ${jobId}`)
  }

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 text-center">Find Your Next Role</h1>
        <p className="text-slate-500 text-center mb-8">Search thousands of jobs matched to your skills</p>
        <SearchBar onSearch={setQuery} isLoading={isLoading} initialQuery={query} />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/4 flex-shrink-0">
          <FilterPanel filters={filters} onFilterChange={setFilters} onClearFilters={() => setFilters({})} />
        </div>

        <div className="w-full lg:w-3/4 flex-1">
          <div className="glass-panel px-5 py-3 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-slate-600 font-medium">
              {isLoading ? (
                'Searching...'
              ) : (
                <>
                  Showing <span className="text-slate-900 font-bold">{results.length}</span> results
                  {query && (
                    <span>
                      {' '}
                      for "<span className="text-slate-900">{query}</span>"
                    </span>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-500">Sort by:</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="form-input py-1.5 text-sm bg-white/50 border-none shadow-sm cursor-pointer"
                >
                  <option value="relevance">Relevance</option>
                  <option value="newest">Newest</option>
                  <option value="salary-high">Salary (High to Low)</option>
                  <option value="deadline">Closing Soon</option>
                </select>
              </div>

              <div className="hidden sm:flex items-center bg-slate-200/50 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {error ? (
            <div className="glass-panel p-8 text-center flex flex-col items-center">
              <AlertCircle className="w-12 h-12 text-error mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Something went wrong</h3>
              <p className="text-slate-600 mb-4">{error}</p>
              <button type="button" onClick={fetchJobs} className="btn-primary">
                Try Again
              </button>
            </div>
          ) : isLoading ? (
            <div className={viewMode === 'grid' ? 'modern-grid' : 'flex flex-col gap-4'}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="modern-card p-5 h-[280px] animate-pulse flex flex-col">
                  <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2 mb-6"></div>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                  </div>
                  <div className="flex gap-2 mb-auto">
                    <div className="h-6 bg-slate-200 rounded w-16"></div>
                    <div className="h-6 bg-slate-200 rounded w-20"></div>
                  </div>
                  <div className="h-10 bg-slate-200 rounded w-full mt-4"></div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="glass-panel p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Frown className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No jobs found</h3>
              <p className="text-slate-600 mb-6 max-w-md">
                We couldn't find any jobs matching your current search and filter criteria. Try adjusting your filters or search terms.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setFilters({})
                }}
                className="btn-secondary"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'modern-grid' : 'flex flex-col gap-4'}>
              {results.map((job) => (
                <div key={job.id} className={viewMode === 'list' ? 'w-full' : ''}>
                  <JobCard job={job} isSaved={savedJobIds.has(job.id)} onSave={handleSaveJob} onApply={handleApply} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
