import React, { useEffect, useState } from 'react'

interface ScoreGaugeProps {
  score: number
  label?: string
  size?: 'sm' | 'md' | 'lg'
  animate?: boolean
}

export function ScoreGauge({
  score,
  label = 'Match Score',
  size = 'md',
  animate = true,
}: ScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score)

  useEffect(() => {
    if (!animate) {
      setDisplayScore(score)
      return
    }

    let startTime: number | null = null
    const duration = 1000 // 1s animation

    const animateScore = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      const easeProgress = 1 - Math.pow(1 - progress, 4) // easeOutQuart
      setDisplayScore(Math.floor(easeProgress * score))
      if (progress < 1) {
        requestAnimationFrame(animateScore)
      }
    }

    requestAnimationFrame(animateScore)
  }, [score, animate])

  const getScoreColor = (val: number) => {
    if (val >= 90) return 'text-success'
    if (val >= 70) return 'text-primary'
    if (val >= 50) return 'text-warning'
    return 'text-slate-400'
  }

  const getScoreStroke = (val: number) => {
    if (val >= 90) return '#10b981' // success
    if (val >= 70) return '#3b82f6' // primary
    if (val >= 50) return '#f59e0b' // warning
    return '#94a3b8' // slate-400
  }

  const getScoreBg = (val: number) => {
    if (val >= 90) return 'bg-success/10'
    if (val >= 70) return 'bg-primary/10'
    if (val >= 50) return 'bg-warning/10'
    return 'bg-slate-100'
  }

  const dimensions = {
    sm: {
      wrapper: 'w-16 h-16',
      svg: '36',
      stroke: '3',
      text: 'text-lg',
    },
    md: {
      wrapper: 'w-24 h-24',
      svg: '36',
      stroke: '2.5',
      text: 'text-2xl',
    },
    lg: {
      wrapper: 'w-32 h-32',
      svg: '36',
      stroke: '2',
      text: 'text-4xl',
    },
  } as const

  const d = dimensions[size]
  const radius = 15.9155

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`relative ${d.wrapper} flex items-center justify-center rounded-full ${getScoreBg(
          score,
        )} p-2`}
      >
        <svg
          className="w-full h-full transform -rotate-90 drop-shadow-sm"
          viewBox={`0 0 ${d.svg} ${d.svg}`}
        >
          <path
            className="text-white/50"
            strokeWidth={d.stroke}
            stroke="currentColor"
            fill="none"
            d={`M18 2.0845 a ${radius} ${radius} 0 0 1 0 31.831 a ${radius} ${radius} 0 0 1 0 -31.831`}
          />
          <path
            strokeWidth={d.stroke}
            strokeDasharray={`${displayScore}, 100`}
            stroke={getScoreStroke(score)}
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-1000 ease-out"
            d={`M18 2.0845 a ${radius} ${radius} 0 0 1 0 31.831 a ${radius} ${radius} 0 0 1 0 -31.831`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold ${getScoreColor(score)} ${d.text}`}>
            {displayScore}
          </span>
        </div>
      </div>
      {label && (
        <span className="mt-3 text-sm font-medium text-slate-600">{label}</span>
      )}
    </div>
  )
}
