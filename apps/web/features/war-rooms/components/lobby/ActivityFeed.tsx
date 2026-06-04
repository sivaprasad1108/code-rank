import { Activity } from 'lucide-react'
import { GlassCard } from '@/components/shared/GlassCard'
import { MOCK_ACTIVITY } from '../../data/mock'

const typeStyle = {
  system: 'text-text-subtle',
  join:   'text-info',
  ready:  'text-success',
}

const typeDot = {
  system: 'bg-text-subtle',
  join:   'bg-info',
  ready:  'bg-success',
}

export function ActivityFeed() {
  return (
    <GlassCard padding="none" className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <Activity size={14} className="text-accent" />
        <h3 className="text-sm font-semibold text-text-primary">Activity Feed</h3>
        <span className="ml-auto flex items-center gap-1 text-[10px] text-success font-medium">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success" />
          </span>
          Live
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {MOCK_ACTIVITY.map((event) => (
            <div key={event.id} className="flex items-start gap-3">
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${typeDot[event.type]}`} />
              <div className="flex-1 min-w-0">
                <span className={`text-sm ${typeStyle[event.type]}`}>{event.content}</span>
              </div>
              <span className="text-[10px] text-text-subtle shrink-0">{event.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Host controls */}
      <div className="p-3 border-t border-border">
        <div className="text-xs text-text-subtle font-semibold uppercase tracking-wide mb-2">Host Controls</div>
        <div className="grid grid-cols-2 gap-1.5">
          {['Kick User', 'Lock Room', 'Transfer Host', 'Mute Chat'].map((action) => (
            <button
              key={action}
              className="h-7 px-2 rounded text-[11px] font-medium text-text-muted bg-bg-surface border border-border hover:border-border-strong hover:text-text-primary transition-colors"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </GlassCard>
  )
}
