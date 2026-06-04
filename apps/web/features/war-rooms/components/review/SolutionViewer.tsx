'use client'

import { GitCompare, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { BattleEditor } from '../battle/BattleEditor'
import { MOCK_LEADERBOARD, SOLUTION_CODES } from '../../data/mock'

interface SolutionViewerProps {
  primaryPlayerId: string
  comparePlayerId: string | null
  compareMode: boolean
  onToggleCompare: () => void
  onSetComparePlayer: (id: string) => void
}

export function SolutionViewer({
  primaryPlayerId,
  comparePlayerId,
  compareMode,
  onToggleCompare,
  onSetComparePlayer,
}: SolutionViewerProps) {
  const primaryEntry = MOCK_LEADERBOARD.find((e) => e.player.id === primaryPlayerId) ?? MOCK_LEADERBOARD[0]
  const compareEntry = MOCK_LEADERBOARD.find((e) => e.player.id === comparePlayerId) ?? MOCK_LEADERBOARD[1]

  const primaryCode = SOLUTION_CODES[primaryEntry.player.username] ?? '# No solution submitted'
  const compareCode = SOLUTION_CODES[compareEntry.player.username] ?? '# No solution submitted'

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-bg-surface border-b border-border shrink-0">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <User size={12} />
          <span className="font-semibold text-text-primary">{primaryEntry.player.username}</span>
          <span className="text-text-subtle">— solution review</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {compareMode && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-text-subtle">Compare with:</span>
              <select
                value={comparePlayerId ?? ''}
                onChange={(e) => onSetComparePlayer(e.target.value)}
                className="h-7 px-2 rounded-md bg-bg-elevated border border-border text-xs text-text-muted focus:outline-none focus:border-accent"
              >
                {MOCK_LEADERBOARD
                  .filter((e) => e.player.id !== primaryPlayerId)
                  .map((e) => (
                    <option key={e.player.id} value={e.player.id}>
                      {e.player.username}
                    </option>
                  ))}
              </select>
            </div>
          )}
          <Button
            variant={compareMode ? 'primary' : 'ghost'}
            size="sm"
            className="h-7 gap-1.5"
            onClick={onToggleCompare}
          >
            <GitCompare size={12} />
            Compare
          </Button>
        </div>
      </div>

      {/* Editor(s) */}
      <div className="flex-1 flex overflow-hidden">
        {!compareMode ? (
          <div className="flex-1">
            <BattleEditor readOnly initialCode={primaryCode} initialLanguage="python" />
          </div>
        ) : (
          <>
            <div className="flex-1 border-r border-border">
              <div className="h-7 flex items-center px-3 bg-bg-elevated border-b border-border">
                <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wide">{primaryEntry.player.username}</span>
                <span className="ml-2 text-[10px] text-success">{primaryEntry.runtime}</span>
              </div>
              <div className="h-[calc(100%-1.75rem)]">
                <BattleEditor readOnly initialCode={primaryCode} initialLanguage="python" />
              </div>
            </div>
            <div className="flex-1">
              <div className="h-7 flex items-center px-3 bg-bg-elevated border-b border-border">
                <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wide">{compareEntry.player.username}</span>
                <span className="ml-2 text-[10px] text-success">{compareEntry.runtime}</span>
              </div>
              <div className="h-[calc(100%-1.75rem)]">
                <BattleEditor readOnly initialCode={compareCode} initialLanguage="python" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
