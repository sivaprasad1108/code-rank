import Link from 'next/link'
import { Trophy, RotateCcw, Eye, Share2, CheckCircle, XCircle } from 'lucide-react'
import { GlassCard } from '@/components/shared/GlassCard'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { MOCK_LEADERBOARD } from '../../data/mock'

const RANK_COLORS = ['text-warning', 'text-text-muted', 'text-amber-600', 'text-text-subtle']
const RANK_BG     = ['bg-warning/10 border-warning/20', 'bg-bg-elevated border-border', 'bg-bg-elevated border-border', 'bg-bg-elevated border-border']

export function FinalRankings() {
  return (
    <section className="px-6 pb-10">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Final Rankings</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <Share2 size={13} />
              Share
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5" asChild>
              <Link href="../review">
                <Eye size={13} />
                Review Solutions
              </Link>
            </Button>
            <Button variant="primary" size="sm" className="gap-1.5" asChild>
              <Link href="../">
                <RotateCcw size={13} />
                Rematch
              </Link>
            </Button>
          </div>
        </div>

        <GlassCard padding="none" className="overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[3rem_1fr_6rem_6rem_6rem_7rem_7rem] gap-4 px-5 py-3 border-b border-border bg-bg-elevated">
            <div className="text-[10px] font-semibold text-text-subtle uppercase tracking-wide text-center">#</div>
            <div className="text-[10px] font-semibold text-text-subtle uppercase tracking-wide">Player</div>
            <div className="text-[10px] font-semibold text-text-subtle uppercase tracking-wide text-right">Score</div>
            <div className="text-[10px] font-semibold text-text-subtle uppercase tracking-wide text-center">Status</div>
            <div className="text-[10px] font-semibold text-text-subtle uppercase tracking-wide text-center">Attempts</div>
            <div className="text-[10px] font-semibold text-text-subtle uppercase tracking-wide text-right">Runtime</div>
            <div className="text-[10px] font-semibold text-text-subtle uppercase tracking-wide text-right">Solved At</div>
          </div>

          {MOCK_LEADERBOARD.map((entry, i) => (
            <div
              key={entry.player.id}
              className={`grid grid-cols-[3rem_1fr_6rem_6rem_6rem_7rem_7rem] gap-4 px-5 py-4 items-center border-b border-border last:border-0 transition-colors hover:bg-bg-hover ${
                i === 0 ? 'bg-warning/3' : ''
              }`}
            >
              {/* Rank */}
              <div className="flex items-center justify-center">
                <span className={`text-sm font-bold tabular-nums ${RANK_COLORS[i] ?? 'text-text-subtle'}`}>
                  {i === 0 ? (
                    <Trophy size={16} className="text-warning" />
                  ) : (
                    entry.rank
                  )}
                </span>
              </div>

              {/* Player */}
              <div className="flex items-center gap-3 min-w-0">
                <div className={`p-0.5 rounded-full ${RANK_BG[i] ?? 'border border-border'}`}>
                  <Avatar name={entry.player.username} size="sm" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-text-primary truncate">{entry.player.username}</div>
                  <div className="text-[11px] text-text-muted">{entry.player.rank} · {entry.player.rating}</div>
                </div>
              </div>

              {/* Score */}
              <div className={`text-right text-sm font-bold tabular-nums ${i === 0 ? 'text-warning' : 'text-text-primary'}`}>
                {entry.score}
              </div>

              {/* Status */}
              <div className="flex justify-center">
                {entry.accepted ? (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 border border-success/20 text-[10px] font-semibold text-success">
                    <CheckCircle size={10} />
                    AC
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-error/10 border border-error/20 text-[10px] font-semibold text-error">
                    <XCircle size={10} />
                    WA
                  </span>
                )}
              </div>

              {/* Attempts */}
              <div className="text-center text-sm text-text-muted tabular-nums">{entry.attempts}</div>

              {/* Runtime */}
              <div className="text-right text-sm font-medium text-text-primary tabular-nums font-code">{entry.runtime}</div>

              {/* Solved At */}
              <div className="text-right text-xs text-text-muted tabular-nums font-code">{entry.submissionTime}</div>
            </div>
          ))}
        </GlassCard>

        {/* Rating delta hint */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-text-subtle">
          <span>Rating changes will be applied after match verification</span>
          <span className="w-1 h-1 rounded-full bg-text-subtle/30" />
          <span>+<span className="text-success font-semibold">+24</span> for winner</span>
        </div>
      </div>
    </section>
  )
}
