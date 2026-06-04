'use client'

import { useState, useEffect } from 'react'

interface CountdownTimerProps {
  initialSeconds: number
  label: string
  onComplete?: () => void
}

export function CountdownTimer({ initialSeconds, label, onComplete }: CountdownTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds)

  useEffect(() => {
    if (seconds <= 0) {
      onComplete?.()
      return
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds, onComplete])

  const progress = seconds / initialSeconds
  const radius   = 44
  const circ     = 2 * Math.PI * radius
  const dash     = circ * progress
  const urgent   = seconds <= 5

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-28">
        {/* Track */}
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            strokeWidth="4"
            className="stroke-bg-elevated"
          />
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            className={urgent ? 'stroke-error' : 'stroke-accent'}
            style={{ transition: 'stroke-dasharray 0.8s ease' }}
          />
        </svg>

        {/* Number */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-4xl font-bold tabular-nums leading-none ${urgent ? 'text-error' : 'text-text-primary'}`}>
            {seconds}
          </span>
        </div>
      </div>
      <span className="text-xs font-semibold text-text-muted uppercase tracking-widest">{label}</span>
    </div>
  )
}
