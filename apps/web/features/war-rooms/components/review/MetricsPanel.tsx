import { Clock, Cpu, MemoryStick, RefreshCw, CheckCircle, Code2 } from 'lucide-react'
import { MOCK_LEADERBOARD, type LeaderboardEntry } from '../../data/mock'

interface MetricsPanelProps {
  playerId: string
}

export function MetricsPanel({ playerId }: MetricsPanelProps) {
  const entry: LeaderboardEntry =
    MOCK_LEADERBOARD.find((e) => e.player.id === playerId) ?? MOCK_LEADERBOARD[0]

  const metrics = [
    { label: 'Runtime',    value: entry.runtime,          icon: <Clock size={13} className="text-accent" /> },
    { label: 'Memory',     value: entry.memory,           icon: <MemoryStick size={13} className="text-info" /> },
    { label: 'Attempts',   value: `${entry.attempts}`,    icon: <RefreshCw size={13} className="text-warning" /> },
    { label: 'Solved At',  value: entry.submissionTime,   icon: <CheckCircle size={13} className="text-success" /> },
    { label: 'Score',      value: `${entry.score} pts`,   icon: <Cpu size={13} className="text-text-muted" /> },
    { label: 'Language',   value: 'Python 3.12',          icon: <Code2 size={13} className="text-text-muted" /> },
  ]

  return (
    <div className="border-t border-border bg-bg-surface shrink-0">
      <div className="px-4 py-2 border-b border-border">
        <h3 className="text-[10px] font-semibold text-text-subtle uppercase tracking-wide">Metrics — {entry.player.username}</h3>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 divide-x divide-border">
        {metrics.map((m) => (
          <div key={m.label} className="px-4 py-3">
            <div className="flex items-center gap-1.5 mb-1">{m.icon}<span className="text-[9px] text-text-subtle uppercase tracking-wide">{m.label}</span></div>
            <div className="text-sm font-semibold text-text-primary font-code">{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
