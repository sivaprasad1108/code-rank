'use client'

import Link from 'next/link'
import { Copy, Share2, ArrowRight, Clock, Users, Shield, Swords } from 'lucide-react'
import { GlassCard } from '@/components/shared/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

const ROOM = {
  name:       'Algorithm Duel #42',
  id:         'room-alpha-42',
  inviteCode: 'ALPHA-7X42',
  mode:       'Battle',
  difficulty: 'Medium',
  timer:      '30 min',
  players:    '4 / 4',
  createdAt:  '2 min ago',
}

export function RoomInfoPanel() {
  function copyInvite() {
    navigator.clipboard?.writeText(`https://coderank.app/war-rooms/${ROOM.id}`)
  }

  return (
    <GlassCard padding="none" className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-text-primary">Room Details</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Room name */}
        <div>
          <div className="text-xl font-bold text-text-primary">{ROOM.name}</div>
          <div className="text-xs text-text-subtle font-code mt-0.5">#{ROOM.id}</div>
        </div>

        {/* Info rows */}
        <div className="space-y-3">
          {[
            { icon: <Swords size={13} />, label: 'Mode', value: ROOM.mode },
            { icon: <Shield size={13} />, label: 'Difficulty', value: ROOM.difficulty },
            { icon: <Clock size={13} />, label: 'Timer', value: ROOM.timer },
            { icon: <Users size={13} />, label: 'Players', value: ROOM.players },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-b-0">
              <div className="flex items-center gap-2 text-text-muted text-sm">
                <span className="text-text-subtle">{row.icon}</span>
                {row.label}
              </div>
              <span className="text-sm font-medium text-text-primary">{row.value}</span>
            </div>
          ))}
        </div>

        {/* Invite code */}
        <div className="bg-bg-surface rounded-lg border border-border p-4">
          <div className="text-xs text-text-muted font-semibold uppercase tracking-wide mb-2">Invite Code</div>
          <div className="flex items-center gap-2">
            <code className="flex-1 font-code text-lg font-bold text-accent tracking-[0.2em]">
              {ROOM.inviteCode}
            </code>
            <button
              onClick={copyInvite}
              className="w-8 h-8 rounded-md bg-bg-elevated border border-border flex items-center justify-center hover:border-accent/40 hover:text-accent transition-colors text-text-muted"
            >
              <Copy size={13} />
            </button>
          </div>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={copyInvite}>
            <Copy size={12} />
            Copy Link
          </Button>
          <Button variant="secondary" size="sm" className="gap-1.5">
            <Share2 size={12} />
            Share
          </Button>
        </div>
      </div>

      {/* Host controls */}
      <div className="p-4 border-t border-border space-y-2">
        <Button variant="primary" size="md" className="w-full gap-2" asChild>
          <Link href="nominate">
            Start Match
            <ArrowRight size={14} />
          </Link>
        </Button>
      </div>
    </GlassCard>
  )
}
