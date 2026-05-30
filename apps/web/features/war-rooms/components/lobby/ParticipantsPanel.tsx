import { Crown, Check, X } from 'lucide-react'
import { GlassCard } from '@/components/shared/GlassCard'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { MOCK_PLAYERS } from '../../data/mock'

export function ParticipantsPanel() {
  return (
    <GlassCard padding="none" className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-text-primary">Participants</h3>
        <p className="text-xs text-text-muted">{MOCK_PLAYERS.filter(p => p.isReady).length}/{MOCK_PLAYERS.length} ready</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {MOCK_PLAYERS.map((player) => (
          <div
            key={player.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-bg-surface border border-border hover:border-border-strong transition-colors"
          >
            <div className="relative">
              <Avatar name={player.username} size="sm" />
              {player.isHost && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-warning/20 border border-warning/30 flex items-center justify-center">
                  <Crown size={8} className="text-warning" />
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-text-primary truncate">{player.username}</span>
                {player.isHost && (
                  <Badge variant="warning" size="xs">Host</Badge>
                )}
              </div>
              <div className="text-xs text-text-subtle mt-0.5">
                {player.rank} · {player.rating}
              </div>
            </div>

            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
              player.isReady
                ? 'bg-success/15 border border-success/25'
                : 'bg-error/10 border border-error/20'
            }`}>
              {player.isReady
                ? <Check size={11} className="text-success" />
                : <X size={11} className="text-error" />
              }
            </div>
          </div>
        ))}

        {/* Empty slots */}
        {Array.from({ length: Math.max(0, 4 - MOCK_PLAYERS.length) }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-border/50"
          >
            <div className="w-8 h-8 rounded-full bg-bg-surface border border-dashed border-border/50" />
            <span className="text-xs text-text-subtle">Waiting for player...</span>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
