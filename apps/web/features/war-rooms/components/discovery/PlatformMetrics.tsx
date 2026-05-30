import { Swords, Users, Zap, Clock } from 'lucide-react'
import { GlassCard } from '@/components/shared/GlassCard'
import { PLATFORM_STATS } from '../../data/mock'

const METRICS = [
  {
    icon: <Swords size={18} className="text-accent" />,
    label: 'Active Rooms',
    value: PLATFORM_STATS.activeRooms,
    suffix: '',
    live: true,
  },
  {
    icon: <Users size={18} className="text-info" />,
    label: 'Players Online',
    value: PLATFORM_STATS.playersOnline,
    suffix: '',
    live: true,
  },
  {
    icon: <Zap size={18} className="text-success" />,
    label: 'Battles Today',
    value: PLATFORM_STATS.battlesToday,
    suffix: '',
    live: false,
  },
  {
    icon: <Clock size={18} className="text-warning" />,
    label: 'Avg Duration',
    value: PLATFORM_STATS.avgDuration,
    suffix: '',
    live: false,
  },
]

export function PlatformMetrics() {
  return (
    <section className="px-6 pb-8">
      <div className="max-w-[1400px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((m) => (
          <GlassCard key={m.label} padding="md" className="relative">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-bg-surface border border-border flex items-center justify-center">
                {m.icon}
              </div>
              {m.live && (
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                  </span>
                  <span className="text-[10px] text-success font-medium">LIVE</span>
                </div>
              )}
            </div>
            <div className="text-2xl font-bold text-text-primary tabular-nums">
              {m.value}{m.suffix}
            </div>
            <div className="text-xs text-text-muted mt-1">{m.label}</div>
          </GlassCard>
        ))}
      </div>
    </section>
  )
}
