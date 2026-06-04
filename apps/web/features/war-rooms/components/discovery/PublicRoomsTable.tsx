'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ChevronDown } from 'lucide-react'
import { GlassCard } from '@/components/shared/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { MOCK_ROOMS, type RoomStatus, type Difficulty } from '../../data/mock'

const DIFFICULTIES: (Difficulty | 'All')[] = ['All', 'Easy', 'Medium', 'Hard', 'Mixed']
const STATUSES: (RoomStatus | 'all')[]     = ['all', 'waiting', 'starting', 'live']

function statusLabel(s: RoomStatus) {
  return s === 'live' ? 'Live' : s === 'starting' ? 'Starting' : 'Waiting'
}

function statusColor(s: RoomStatus) {
  if (s === 'live') return 'text-success'
  if (s === 'starting') return 'text-warning'
  return 'text-info'
}

function diffColor(d: Difficulty) {
  if (d === 'Easy') return 'text-success'
  if (d === 'Medium') return 'text-warning'
  if (d === 'Hard') return 'text-error'
  return 'text-info'
}

export function PublicRoomsTable() {
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState<Difficulty | 'All'>('All')
  const [status, setStatus] = useState<RoomStatus | 'all'>('all')

  const filtered = MOCK_ROOMS.filter((r) => {
    const matchesSearch = !search || r.id.toLowerCase().includes(search.toLowerCase()) || r.name.toLowerCase().includes(search.toLowerCase())
    const matchesDiff   = difficulty === 'All' || r.difficulty === difficulty
    const matchesStatus = status === 'all' || r.status === status
    return matchesSearch && matchesDiff && matchesStatus
  })

  return (
    <section className="px-6 pb-10">
      <div className="max-w-[1920px] mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Public Rooms</h2>
            <p className="text-sm text-text-muted">{filtered.length} rooms available</p>
          </div>
        </div>

        <GlassCard padding="none">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-border">
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle" />
              <input
                type="text"
                placeholder="Search room ID or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 bg-bg-surface border border-border rounded-lg text-sm text-text-primary placeholder:text-text-subtle focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty | 'All')}
                className="h-9 px-3 pr-8 bg-bg-surface border border-border rounded-lg text-sm text-text-muted focus:outline-none focus:border-accent/50 appearance-none cursor-pointer"
              >
                {DIFFICULTIES.map((d) => <option key={d} value={d}>{d === 'All' ? 'All Difficulties' : d}</option>)}
              </select>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as RoomStatus | 'all')}
                className="h-9 px-3 pr-8 bg-bg-surface border border-border rounded-lg text-sm text-text-muted focus:outline-none focus:border-accent/50 appearance-none cursor-pointer"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : statusLabel(s as RoomStatus)}</option>)}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['Room', 'Host', 'Players', 'Difficulty', 'Mode', 'Status', ''].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-text-subtle uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((room, i) => (
                  <tr
                    key={room.id}
                    className={`border-b border-border/50 hover:bg-bg-hover/40 transition-colors ${i === filtered.length - 1 ? 'border-b-0' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-text-primary">{room.name}</div>
                      <div className="text-[11px] text-text-subtle font-code">#{room.id}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={room.host} size="xs" />
                        <span className="text-text-muted text-xs">{room.host}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-muted tabular-nums">
                      {room.players}/{room.maxPlayers}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-medium text-xs ${diffColor(room.difficulty)}`}>{room.difficulty}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="default" size="xs">{room.mode}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${statusColor(room.status)}`}>
                        {statusLabel(room.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Button variant={room.status === 'live' ? 'ghost' : 'secondary'} size="sm" asChild>
                        <Link href={`/war-rooms/${room.id}`}>
                          {room.status === 'live' ? 'Watch' : 'Join'}
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="py-16 text-center text-text-subtle text-sm">
                No rooms match your filters
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </section>
  )
}
