'use client'

import Link from 'next/link'
import { Users, Clock, Shield } from 'lucide-react'
import { GlassCard } from '@/components/shared/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { MOCK_ROOMS, type RoomStatus, type Difficulty } from '../../data/mock'

function StatusPill({ status }: { status: RoomStatus }) {
  if (status === 'waiting') return (
    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-info/10 text-info border border-info/20">
      <span className="w-1.5 h-1.5 rounded-full bg-info" />
      Waiting
    </span>
  )
  if (status === 'starting') return (
    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-warning/10 text-warning border border-warning/20">
      <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
      Starting
    </span>
  )
  return (
    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-success/10 text-success border border-success/20">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success" />
      </span>
      Live Battle
    </span>
  )
}

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const map: Record<Difficulty, { variant: 'success' | 'warning' | 'error' | 'info' }> = {
    Easy:   { variant: 'success' },
    Medium: { variant: 'warning' },
    Hard:   { variant: 'error'   },
    Mixed:  { variant: 'info'    },
  }
  return <Badge variant={map[difficulty].variant} size="sm">{difficulty}</Badge>
}

export function FeaturedRoomsGrid() {
  const featured = MOCK_ROOMS.slice(0, 3)

  return (
    <section className="px-6 pb-10">
      <div className="max-w-[1920px] mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Featured Rooms</h2>
            <p className="text-sm text-text-muted">Active rooms ready to join</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {featured.map((room) => (
            <GlassCard key={room.id} hoverable padding="md" className="flex flex-col gap-4">
              {/* Top row */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-text-primary truncate">{room.name}</div>
                  <div className="text-xs text-text-subtle mt-0.5 font-code">#{room.id}</div>
                </div>
                <StatusPill status={room.status} />
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-3 flex-wrap">
                <DifficultyBadge difficulty={room.difficulty} />
                <Badge variant="default" size="sm">{room.mode}</Badge>
                <div className="flex items-center gap-1 text-xs text-text-muted">
                  <Clock size={11} />
                  {room.duration}
                </div>
              </div>

              {/* Host + players */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar name={room.host} size="xs" />
                  <div>
                    <div className="text-xs text-text-muted">Host</div>
                    <div className="text-xs font-medium text-text-primary">{room.host}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Users size={13} className="text-text-subtle" />
                  <span className="font-semibold text-text-primary">{room.players}</span>
                  <span className="text-text-subtle">/ {room.maxPlayers}</span>
                </div>
              </div>

              {/* Languages */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {room.language.map((lang) => (
                  <span
                    key={lang}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-bg-surface border border-border text-text-muted capitalize"
                  >
                    {lang}
                  </span>
                ))}
              </div>

              {/* Join button */}
              <Button
                variant={room.status === 'live' ? 'ghost' : 'primary'}
                size="sm"
                className="w-full mt-auto"
                asChild
              >
                <Link href={`/war-rooms/${room.id}`}>
                  {room.status === 'live' ? 'Spectate' : 'Join Room'}
                </Link>
              </Button>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
