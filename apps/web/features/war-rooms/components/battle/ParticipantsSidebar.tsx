import { Trophy } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { MOCK_PLAYERS, MOCK_LEADERBOARD } from '../../data/mock'
import type { PlayerStatus } from '../../data/mock'

const STATUS_CONFIG: Record<PlayerStatus, { label: string; color: string; dot: string }> = {
  thinking:            { label: 'Thinking',    color: 'text-text-muted',   dot: 'bg-text-subtle' },
  running:             { label: 'Running...',  color: 'text-warning',      dot: 'bg-warning animate-pulse' },
  wrong_answer:        { label: 'Wrong Ans',   color: 'text-error',        dot: 'bg-error' },
  time_limit_exceeded: { label: 'TLE',         color: 'text-warning',      dot: 'bg-warning' },
  runtime_error:       { label: 'RT Error',    color: 'text-error',        dot: 'bg-error' },
  accepted:            { label: 'Accepted ✓',  color: 'text-success',      dot: 'bg-success' },
  disconnected:        { label: 'Offline',     color: 'text-text-subtle',  dot: 'bg-text-subtle' },
  ready:               { label: 'Ready',       color: 'text-success',      dot: 'bg-success' },
  not_ready:           { label: 'Not Ready',   color: 'text-text-muted',   dot: 'bg-text-subtle' },
}

export function ParticipantsSidebar() {
  return (
    <div className="flex flex-col h-full bg-bg-surface border-r border-border overflow-hidden">
      {/* Players */}
      <div className="px-3 py-3 border-b border-border">
        <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">Players</span>
      </div>

      <div className="p-2 space-y-1.5">
        {MOCK_PLAYERS.map((p) => {
          const sc = STATUS_CONFIG[p.status]
          return (
            <div key={p.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-bg-elevated transition-colors">
              <div className="relative shrink-0">
                <Avatar name={p.username} size="sm" />
                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-bg-surface ${sc.dot}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-text-primary truncate">{p.username}</div>
                <div className={`text-[10px] font-medium ${sc.color}`}>{sc.label}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Mini Leaderboard */}
      <div className="mt-auto border-t border-border">
        <div className="px-3 py-2 flex items-center gap-1.5">
          <Trophy size={12} className="text-warning" />
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">Standings</span>
        </div>
        <div className="px-2 pb-3 space-y-1">
          {MOCK_LEADERBOARD.map((row) => (
            <div key={row.player.id} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-bg-elevated transition-colors">
              <span className={`text-xs font-bold tabular-nums w-4 ${row.rank === 1 ? 'text-warning' : row.rank === 2 ? 'text-text-muted' : 'text-text-subtle'}`}>
                {row.rank}
              </span>
              <Avatar name={row.player.username} size="xs" />
              <span className="text-xs text-text-muted flex-1 truncate">{row.player.username}</span>
              <span className={`text-xs font-bold tabular-nums ${row.accepted ? 'text-success' : 'text-text-subtle'}`}>
                {row.score}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
