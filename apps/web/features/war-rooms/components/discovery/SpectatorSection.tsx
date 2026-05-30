import Link from 'next/link'
import { Eye, Users, Clock } from 'lucide-react'
import { GlassCard } from '@/components/shared/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { MOCK_ROOMS } from '../../data/mock'

export function SpectatorSection() {
  const liveBattles = MOCK_ROOMS.filter((r) => r.status === 'live')

  return (
    <section className="px-6 pb-16">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <Eye size={18} className="text-accent" />
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Spectator Mode</h2>
            <p className="text-sm text-text-muted">Watch live battles unfold in real-time</p>
          </div>
        </div>

        {liveBattles.length === 0 ? (
          <GlassCard padding="lg" className="text-center">
            <Eye size={32} className="text-text-subtle mx-auto mb-3" />
            <p className="text-text-muted text-sm">No live battles right now. Check back soon.</p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveBattles.map((room) => (
              <GlassCard key={room.id} hoverable padding="md" className="relative overflow-hidden">
                {/* Subtle live glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between mb-3">
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-success/10 text-success border border-success/20">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success" />
                    </span>
                    LIVE
                  </span>
                  <Badge variant={room.difficulty === 'Easy' ? 'success' : room.difficulty === 'Medium' ? 'warning' : 'error'} size="xs">
                    {room.difficulty}
                  </Badge>
                </div>

                <div className="font-semibold text-text-primary mb-1">{room.name}</div>
                <div className="text-xs text-text-muted font-code mb-4">#{room.id}</div>

                <div className="flex items-center gap-4 text-xs text-text-muted mb-4">
                  <div className="flex items-center gap-1">
                    <Users size={11} />
                    <span>{room.players} battling</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={11} />
                    <span>{room.createdAt}</span>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full gap-2" asChild>
                  <Link href={`/war-rooms/${room.id}/battle`}>
                    <Eye size={13} />
                    Watch Battle
                  </Link>
                </Button>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
