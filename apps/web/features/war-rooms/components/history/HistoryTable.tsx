'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Trophy, TrendingDown, Eye, RotateCcw } from 'lucide-react'
import { GlassCard } from '@/components/shared/GlassCard'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { MOCK_HISTORY, type MatchHistoryEntry, type Difficulty } from '../../data/mock'

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  Easy:   'text-success bg-success/10 border-success/20',
  Medium: 'text-warning bg-warning/10 border-warning/20',
  Hard:   'text-error bg-error/10 border-error/20',
  Mixed:  'text-info bg-info/10 border-info/20',
}

export function HistoryTable() {
  const [search, setSearch]     = useState('')
  const [result, setResult]     = useState<'all' | 'Win' | 'Loss'>('all')
  const [difficulty, setDiff]   = useState<'all' | Difficulty>('all')

  const filtered = MOCK_HISTORY.filter((h) => {
    const matchSearch = h.problem.toLowerCase().includes(search.toLowerCase())
    const matchResult = result === 'all' || h.result === result
    const matchDiff   = difficulty === 'all' || h.difficulty === difficulty
    return matchSearch && matchResult && matchDiff
  })

  const wins   = MOCK_HISTORY.filter((h) => h.result === 'Win').length
  const losses = MOCK_HISTORY.filter((h) => h.result === 'Loss').length

  return (
    <div className="px-6 pb-10">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Match History</h1>
            <p className="text-sm text-text-muted mt-1">{MOCK_HISTORY.length} battles played · {wins} wins · {losses} losses</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center px-4 py-2 rounded-lg bg-success/10 border border-success/20">
              <div className="text-lg font-bold text-success">{wins}</div>
              <div className="text-[10px] text-text-subtle uppercase tracking-wide">Wins</div>
            </div>
            <div className="text-center px-4 py-2 rounded-lg bg-error/10 border border-error/20">
              <div className="text-lg font-bold text-error">{losses}</div>
              <div className="text-[10px] text-text-subtle uppercase tracking-wide">Losses</div>
            </div>
            <div className="text-center px-4 py-2 rounded-lg bg-accent/10 border border-accent/20">
              <div className="text-lg font-bold text-accent">{Math.round((wins / MOCK_HISTORY.length) * 100)}%</div>
              <div className="text-[10px] text-text-subtle uppercase tracking-wide">Win Rate</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search problems…"
              className="w-full h-9 pl-8 pr-3 rounded-lg bg-bg-elevated border border-border text-sm text-text-primary placeholder:text-text-subtle focus:outline-none focus:border-accent"
            />
          </div>

          <select
            value={result}
            onChange={(e) => setResult(e.target.value as typeof result)}
            className="h-9 px-3 rounded-lg bg-bg-elevated border border-border text-sm text-text-muted focus:outline-none focus:border-accent"
          >
            <option value="all">All Results</option>
            <option value="Win">Wins</option>
            <option value="Loss">Losses</option>
          </select>

          <select
            value={difficulty}
            onChange={(e) => setDiff(e.target.value as typeof difficulty)}
            className="h-9 px-3 rounded-lg bg-bg-elevated border border-border text-sm text-text-muted focus:outline-none focus:border-accent"
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Table */}
        <GlassCard padding="none" className="overflow-hidden">
          <div className="grid grid-cols-[1fr_6rem_7rem_7rem_6rem_5rem_8rem] gap-4 px-5 py-3 border-b border-border bg-bg-elevated">
            <div className="text-[10px] font-semibold text-text-subtle uppercase tracking-wide">Problem</div>
            <div className="text-[10px] font-semibold text-text-subtle uppercase tracking-wide">Difficulty</div>
            <div className="text-[10px] font-semibold text-text-subtle uppercase tracking-wide">Winner</div>
            <div className="text-[10px] font-semibold text-text-subtle uppercase tracking-wide">Duration</div>
            <div className="text-[10px] font-semibold text-text-subtle uppercase tracking-wide text-right">Score</div>
            <div className="text-[10px] font-semibold text-text-subtle uppercase tracking-wide text-center">Result</div>
            <div className="text-[10px] font-semibold text-text-subtle uppercase tracking-wide text-right">Actions</div>
          </div>

          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-text-subtle">No matches found</div>
          )}

          {filtered.map((entry: MatchHistoryEntry) => (
            <div
              key={entry.id}
              className="grid grid-cols-[1fr_6rem_7rem_7rem_6rem_5rem_8rem] gap-4 px-5 py-3.5 items-center border-b border-border last:border-0 hover:bg-bg-hover transition-colors"
            >
              {/* Problem */}
              <div>
                <div className="text-sm font-semibold text-text-primary">{entry.problem}</div>
                <div className="text-[11px] text-text-subtle mt-0.5">{entry.date} · {entry.mode}</div>
              </div>

              {/* Difficulty */}
              <div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${DIFFICULTY_COLORS[entry.difficulty]}`}>
                  {entry.difficulty}
                </span>
              </div>

              {/* Winner */}
              <div className="flex items-center gap-1.5">
                <Avatar name={entry.winner} size="xs" />
                <span className="text-xs text-text-muted truncate">{entry.winner}</span>
              </div>

              {/* Duration */}
              <div className="text-sm text-text-muted tabular-nums font-code">{entry.duration}</div>

              {/* Score */}
              <div className="text-right text-sm font-semibold text-text-primary tabular-nums">{entry.myScore}</div>

              {/* Result */}
              <div className="flex justify-center">
                {entry.result === 'Win' ? (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 border border-success/20 text-[10px] font-bold text-success">
                    <Trophy size={9} />
                    Win
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-error/10 border border-error/20 text-[10px] font-bold text-error">
                    <TrendingDown size={9} />
                    Loss
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 justify-end">
                <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] gap-1" asChild>
                  <Link href={`/war-rooms/demo-room/review`}>
                    <Eye size={10} />
                    Review
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] gap-1" asChild>
                  <Link href="/war-rooms">
                    <RotateCcw size={10} />
                    Rematch
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </GlassCard>
      </div>
    </div>
  )
}
