import React, { useMemo } from 'react'
import { TrendingUp, Activity } from 'lucide-react'

export function MomentumChart({ data, trend, trendMessage }) {
  const maxTotal = useMemo(() => {
    return Math.max(
      ...data.map((d) => d.applications + d.interviews + d.offers),
      10,
    )
  }, [data])

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-success" />
      case 'down':
        return <TrendingUp className="w-5 h-5 text-error transform rotate-180" />
      case 'flat':
        return <Activity className="w-5 h-5 text-slate-400" />
      default:
        return <Activity className="w-5 h-5 text-slate-400" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-success bg-success/10 border-success/20'
      case 'down':
        return 'text-error bg-error/10 border-error/20'
      case 'flat':
        return 'text-slate-600 bg-slate-100 border-slate-200'
      default:
        return 'text-slate-600 bg-slate-100 border-slate-200'
    }
  }

  const totals = useMemo(() => {
    return {
      apps: data.reduce((sum, d) => sum + d.applications, 0),
      interviews: data.reduce((sum, d) => sum + d.interviews, 0),
      offers: data.reduce((sum, d) => sum + d.offers, 0),
    }
  }, [data])

  return (
    <div className="modern-card p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Momentum
        </h3>
        <div className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getTrendColor()}`}>
          {getTrendIcon()}
          <span>{trendMessage}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 text-center">
          <div className="text-2xl font-bold text-slate-700">{totals.apps}</div>
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Apps</div>
        </div>
        <div className="bg-primary/5 rounded-lg p-3 border border-primary/10 text-center">
          <div className="text-2xl font-bold text-primary">{totals.interviews}</div>
          <div className="text-xs font-medium text-primary/70 uppercase tracking-wider mt-1">Interviews</div>
        </div>
        <div className="bg-success/5 rounded-lg p-3 border border-success/10 text-center">
          <div className="text-2xl font-bold text-success">{totals.offers}</div>
          <div className="text-xs font-medium text-success/70 uppercase tracking-wider mt-1">Offers</div>
        </div>
      </div>

      <div className="flex-1 flex items-end gap-2 mt-auto pt-4 border-t border-slate-100 min-h-[150px]">
        {data.map((item, idx) => {
          const appHeight = (item.applications / maxTotal) * 100
          const intHeight = (item.interviews / maxTotal) * 100
          const offHeight = (item.offers / maxTotal) * 100

          return (
            <div key={idx} className="flex-1 flex flex-col items-center group relative">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -mt-16 bg-slate-800 text-white text-xs rounded py-1 px-2 pointer-events-none z-10 whitespace-nowrap shadow-lg">
                <div className="font-bold mb-1 border-b border-slate-600 pb-1">{item.week}</div>
                {item.offers > 0 && <div>Offers: {item.offers}</div>}
                {item.interviews > 0 && <div>Interviews: {item.interviews}</div>}
                {item.applications > 0 && <div>Apps: {item.applications}</div>}
              </div>

              <div className="w-full max-w-[40px] flex flex-col justify-end h-[120px] rounded-t-sm overflow-hidden bg-slate-50 group-hover:bg-slate-100 transition-colors">
                {offHeight > 0 && (
                  <div className="w-full bg-success transition-all duration-500 ease-out" style={{ height: `${offHeight}%` }} />
                )}
                {intHeight > 0 && (
                  <div className="w-full bg-primary transition-all duration-500 ease-out" style={{ height: `${intHeight}%` }} />
                )}
                {appHeight > 0 && (
                  <div className="w-full bg-slate-300 transition-all duration-500 ease-out" style={{ height: `${appHeight}%` }} />
                )}
              </div>

              <div className="text-[10px] font-medium text-slate-400 mt-2 truncate w-full text-center">
                {item.week}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-slate-300"></div>
          <span>Applications</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-primary"></div>
          <span>Interviews</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-success"></div>
          <span>Offers</span>
        </div>
      </div>
    </div>
  )
}
