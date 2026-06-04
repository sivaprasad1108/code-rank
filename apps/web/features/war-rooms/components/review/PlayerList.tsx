'use client'

import { Trophy, CheckCircle, XCircle } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { MOCK_LEADERBOARD, type LeaderboardEntry } from '../../data/mock'

interface PlayerListProps {
  selectedId: string
  onSelect: (playerId: string) => void
}

export function PlayerList({ selectedId, onSelect }: PlayerListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border shrink-0">
        <h3 className="text-xs font-semibold text-text-subtle uppercase tracking-wide">Players</h3>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {MOCK_LEADERBOARD.map((entry: LeaderboardEntry, i: number) => {
          const isSelected = entry.player.id === selectedId
          return (
            <button
              key={entry.player.id}
              onClick={() => onSelect(entry.player.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                isSelected
                  ? 'bg-accent/10 border-r-2 border-accent'
                  : 'hover:bg-bg-hover'
              }`}
            >
              {/* Rank */}
              <div className="w-5 shrink-0 flex items-center justify-center">
                {i === 0 ? (
                  <Trophy size={13} className="text-warning" />
                ) : (
                  <span className="text-[11px] font-bold text-text-subtle">{entry.rank}</span>
                )}
              </div>

              <Avatar name={entry.player.username} size="xs" />

              <div className="flex-1 min-w-0">
                <div className={`text-xs font-semibold truncate ${isSelected ? 'text-accent' : 'text-text-primary'}`}>
                  {entry.player.username}
                </div>
                <div className="text-[10px] text-text-subtle font-code">{entry.runtime} · {entry.memory}</div>
              </div>

              {entry.accepted ? (
                <CheckCircle size={12} className="text-success shrink-0" />
              ) : (
                <XCircle size={12} className="text-error shrink-0" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
