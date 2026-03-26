import React, { useMemo, useState } from 'react'
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Zap,
  ArrowRight,
  PlayCircle,
} from 'lucide-react'

export function ActionQueue({ actions, onComplete, onSimulate }) {
  const [expandedId, setExpandedId] = useState(null)

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'skill':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'resume':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'network':
        return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'apply':
        return 'bg-green-100 text-green-700 border-green-200'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const sortedActions = useMemo(() => {
    return [...actions].sort((a, b) => {
      if (a.isCompleted && !b.isCompleted) return 1
      if (!a.isCompleted && b.isCompleted) return -1
      return b.impact - a.impact
    })
  }, [actions])

  const totalPotentialBoost = useMemo(() => {
    return actions
      .filter((a) => !a.isCompleted)
      .reduce((sum, a) => sum + a.impact, 0)
  }, [actions])

  if (actions.length === 0) {
    return (
      <div className="modern-card p-6 text-center">
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3 opacity-50" />
        <h3 className="text-lg font-medium text-slate-900">All caught up!</h3>
        <p className="text-slate-500 mt-1">
          You have completed all recommended actions for this opportunity.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          Action Queue
        </h3>
        {totalPotentialBoost > 0 && (
          <div className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1">
            <span>+{totalPotentialBoost}</span>
            <span className="font-medium">Potential Boost</span>
          </div>
        )}
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {sortedActions.map((action) => {
          const isExpanded = expandedId === action.id

          return (
            <div
              key={action.id}
              className={`modern-card border transition-all duration-200 ${action.isCompleted ? 'bg-slate-50 border-slate-200 opacity-70' : isExpanded ? 'border-primary/30 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <div
                className="p-4 flex items-start gap-3 cursor-pointer"
                onClick={() => toggleExpand(action.id)}
              >
                <div className="mt-0.5">
                  {action.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4
                      className={`text-sm font-semibold truncate ${action.isCompleted ? 'text-slate-500 line-through' : 'text-slate-900'}`}
                    >
                      {action.title}
                    </h4>
                    {!action.isCompleted && (
                      <span className="flex-shrink-0 text-xs font-bold text-success bg-success/10 px-1.5 py-0.5 rounded">
                        +{action.impact}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${getTypeColor(action.type)}`}
                    >
                      {action.type}
                    </span>
                    <p className="text-xs text-slate-500 truncate">
                      {action.description}
                    </p>
                  </div>
                </div>

                <div className="mt-1 text-slate-400">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 pt-0 animate-slide-up border-t border-slate-100 mt-2">
                  <div className="pt-3">
                    <p className="text-sm text-slate-600 mb-4">
                      {action.details || action.description}
                    </p>

                    <div className="flex items-center gap-2 justify-end">
                      {!action.isCompleted && onSimulate && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            onSimulate(action)
                          }}
                          className="btn-secondary text-xs py-1.5 px-3"
                        >
                          <PlayCircle className="w-3.5 h-3.5 mr-1.5" />
                          Simulate Impact
                        </button>
                      )}

                      {!action.isCompleted && onComplete && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            onComplete(action.id)
                          }}
                          className="btn-primary text-xs py-1.5 px-3"
                        >
                          Mark Complete
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </button>
                      )}
                    </div>
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
