import React, { useEffect, useState } from 'react'
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react'

export interface FilterState {
  jobType?: string
  location?: string
  minSalary?: number
  maxSalary?: number
}

interface FilterPanelProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  onClearFilters: () => void
}

const JOB_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Freelance',
  'Internship',
]

const LOCATIONS = [
  'Remote',
  'New York, NY',
  'San Francisco, CA',
  'London, UK',
  'Berlin, DE',
  'Toronto, CA',
]

const SALARY_PRESETS = [
  {
    label: '$50k+',
    value: 50000,
  },
  {
    label: '$100k+',
    value: 100000,
  },
  {
    label: '$150k+',
    value: 150000,
  },
]

export function FilterPanel({
  filters,
  onFilterChange,
  onClearFilters,
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters)
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)

  // Sync local state when props change
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleChange = (key: keyof FilterState, value: any) => {
    const newFilters = {
      ...localFilters,
      [key]: value,
    }
    setLocalFilters(newFilters)
    onFilterChange(newFilters) // Auto-apply on desktop
  }

  const handleClear = () => {
    setLocalFilters({})
    onClearFilters()
  }

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== '',
  ).length

  return (
    <div className="glass-panel p-5 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-primary" />
          Filters
        </h2>
        {activeFilterCount > 0 && (
          <button
            onClick={handleClear}
            className="text-sm text-slate-500 hover:text-primary transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(filters).map(([key, value]) => {
            if (value === undefined || value === '') return null
            let displayValue = String(value)
            if (key === 'minSalary')
              displayValue = `Min: $${(value as number) / 1000}k`
            if (key === 'maxSalary')
              displayValue = `Max: $${(value as number) / 1000}k`
            return (
              <span
                key={key}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
              >
                {displayValue}
                <button
                  onClick={() =>
                    handleChange(key as keyof FilterState, undefined)
                  }
                  className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )
          })}
        </div>
      )}

      <div className="space-y-6">
        {/* Job Type */}
        <div>
          <label className="form-label">Job Type</label>
          <select
            value={localFilters.jobType || ''}
            onChange={(e) =>
              handleChange('jobType', e.target.value || undefined)
            }
            className="form-input bg-white/50"
          >
            <option value="">All Types</option>
            {JOB_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="form-label">Location</label>
          <input
            type="text"
            list="locations"
            value={localFilters.location || ''}
            onChange={(e) =>
              handleChange('location', e.target.value || undefined)
            }
            placeholder="e.g. Remote, New York"
            className="form-input bg-white/50"
          />
          <datalist id="locations">
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc} />
            ))}
          </datalist>
        </div>

        {/* Salary Presets */}
        <div>
          <label className="form-label mb-2">Minimum Salary</label>
          <div className="flex flex-wrap gap-2">
            {SALARY_PRESETS.map((preset) => (
              <button
                key={preset.value}
                onClick={() =>
                  handleChange(
                    'minSalary',
                    localFilters.minSalary === preset.value
                      ? undefined
                      : preset.value,
                  )
                }
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                  localFilters.minSalary === preset.value
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white/50 text-slate-600 border-slate-200 hover:border-primary/50 hover:bg-primary/5'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Toggle */}
        <div className="pt-4 border-t border-slate-200/50">
          <button
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="flex items-center justify-between w-full text-sm font-medium text-slate-700 hover:text-primary transition-colors"
          >
            Advanced Options
            {isAdvancedOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Advanced Options */}
        {isAdvancedOpen && (
          <div className="space-y-4 pt-2 animate-slide-up">
            <div>
              <label className="form-label">Exact Salary Range</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={localFilters.minSalary || ''}
                    onChange={(e) =>
                      handleChange(
                        'minSalary',
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    className="form-input pl-7 bg-white/50"
                  />
                </div>
                <span className="text-slate-400">-</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={localFilters.maxSalary || ''}
                    onChange={(e) =>
                      handleChange(
                        'maxSalary',
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    className="form-input pl-7 bg-white/50"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
