import { Trophy } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { MOCK_LEADERBOARD } from '../../data/mock'

const RANK_COLOR = ['text-warning', 'text-text-muted', 'text-warning/60']

export function LiveLeaderboard() {
  return (
    <div className="flex flex-col">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <Trophy size={13} className="text-warning" />
        <span className="text-xs font-semibold text-text-primary">Live Leaderboard</span>
        <span className="ml-auto flex items-center gap-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success" />
          </span>
        </span>
      </div>

      <div className="divide-y divide-border/50">
        {MOCK_LEADERBOARD.map((row, i) => (
          <div key={row.player.id} className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-bg-hover/30 transition-colors">
            <span className={`text-xs font-bold w-4 tabular-nums shrink-0 ${RANK_COLOR[i] ?? 'text-text-subtle'}`}>
              {row.rank}
            </span>
            <Avatar name={row.player.username} size="xs" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-text-primary truncate">{row.player.username}</div>
              <div className="text-[10px] text-text-subtle">
                {row.attempts} attempt{row.attempts !== 1 ? 's' : ''}
                {row.accepted ? ` · ${row.runtime}` : ''}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className={`text-sm font-bold tabular-nums ${row.accepted ? 'text-success' : 'text-text-muted'}`}>
                {row.score}
              </div>
              {row.accepted && (
                <div className="text-[9px] text-success font-medium">SOLVED</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
