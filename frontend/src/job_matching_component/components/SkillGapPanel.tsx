import React, { useState } from 'react'
import {
  BookOpen,
  Target,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertCircle,
} from 'lucide-react'

export interface SkillGap {
  id: string
  skill: string
  importance: 'high' | 'medium' | 'low'
  currentLevel: number // 0-100
  requiredLevel: number // 0-100
  resources: {
    title: string
    type: 'course' | 'article' | 'video' | 'project'
    url: string
    duration: string
  }[]
}

interface SkillGapPanelProps {
  gaps: SkillGap[]
  overallProgress: number // 0-100
}

export function SkillGapPanel({ gaps, overallProgress }: SkillGapPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'bg-error/10 text-error border-error/20'
      case 'medium':
        return 'bg-warning/10 text-warning-700 border-warning/20'
      case 'low':
        return 'bg-primary/10 text-primary border-primary/20'
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200'
    }
  }

  const sortedGaps = [...gaps].sort((a, b) => {
    const impMap = {
      high: 3,
      medium: 2,
      low: 1,
    } as const

    return impMap[b.importance] - impMap[a.importance]
  })

  if (gaps.length === 0) {
    return (
      <div className="modern-card p-6 text-center h-full flex flex-col items-center justify-center">
        <Target className="w-12 h-12 text-success mx-auto mb-3 opacity-50" />
        <h3 className="text-lg font-medium text-slate-900">Perfect Match!</h3>
        <p className="text-slate-500 mt-1">
          You meet all the skill requirements for this role.
        </p>
      </div>
    )
  }

  return (
    <div className="modern-card p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Skill Gaps
        </h3>
        <div className="text-sm font-medium text-slate-500">
          {gaps.length} missing skills
        </div>
      </div>

      {/* Summary Progress */}
      <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
        <div className="flex justify-between text-sm font-semibold text-slate-700 mb-2">
          <span>Overall Skill Match</span>
          <span className="text-primary">{overallProgress}%</span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${Math.min(100, Math.max(0, overallProgress))}%`,
            }}
          />
        </div>
      </div>

      {/* Gaps List */}
      <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {sortedGaps.map((gap) => {
          const isExpanded = expandedId === gap.id
          const gapPercentage = Math.max(0, gap.requiredLevel - gap.currentLevel)

          return (
            <div
              key={gap.id}
              className={`border rounded-lg transition-all duration-200 ${
                isExpanded
                  ? 'border-primary/30 shadow-sm bg-white'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div
                className="p-3 flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpand(gap.id)}
              >
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-slate-900 truncate">
                      {gap.skill}
                    </h4>
                    <span
                      className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded border ${getImportanceColor(
                        gap.importance,
                      )}`}
                    >
                      {gap.importance} priority
                    </span>
                  </div>

                  {/* Mini progress bar for this skill */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-success"
                        style={{ width: `${gap.currentLevel}%` }}
                        title={`Current: ${gap.currentLevel}%`}
                      />
                      <div
                        className="h-full bg-warning/50"
                        style={{ width: `${gapPercentage}%` }}
                        title={`Gap: ${gapPercentage}%`}
                      />
                    </div>
                  </div>
                </div>

                <div className="text-slate-400 flex-shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="px-3 pb-3 pt-0 animate-slide-up border-t border-slate-100 mt-2">
                  <div className="pt-3">
                    <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      Learning Resources
                    </h5>

                    {gap.resources.length > 0 ? (
                      <div className="space-y-2">
                        {gap.resources.map((resource, idx) => (
                          <a
                            key={idx}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start justify-between p-2 rounded bg-slate-50 hover:bg-primary/5 border border-slate-100 hover:border-primary/20 transition-colors group"
                          >
                            <div className="min-w-0 pr-2">
                              <p className="text-sm font-medium text-slate-700 group-hover:text-primary truncate">
                                {resource.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                <span className="capitalize">{resource.type}</span>
                                <span>•</span>
                                <span>{resource.duration}</span>
                              </div>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary flex-shrink-0 mt-0.5" />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-slate-500 flex items-center gap-2 p-2 bg-slate-50 rounded">
                        <AlertCircle className="w-4 h-4 text-slate-400" />
                        No specific resources found.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
