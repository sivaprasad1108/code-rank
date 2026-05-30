import { Crown, Clock, Trophy } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { MOCK_LEADERBOARD } from '../../data/mock'

const winner = MOCK_LEADERBOARD[0]

export function ResultsHero() {
  return (
    <section className="relative px-6 py-14 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-warning/6 rounded-full blur-[100px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] bg-accent/8 rounded-full blur-[80px]" />
      </div>

      <div className="relative max-w-[800px] mx-auto text-center">
        {/* Badge */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Trophy size={16} className="text-warning" />
          <span className="text-xs font-semibold text-warning tracking-widest uppercase">Battle Complete</span>
        </div>

        {/* Winner card */}
        <div className="inline-flex flex-col items-center gap-4 px-10 py-8 rounded-2xl bg-bg-elevated border border-warning/20 shadow-[0_0_60px_rgba(251,191,36,0.08)]">
          <div className="relative">
            <Avatar name={winner.player.username} size="xl" />
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-warning/20 border-2 border-warning/40 flex items-center justify-center">
              <Crown size={14} className="text-warning" />
            </div>
          </div>

          <div>
            <div className="text-2xl font-bold text-text-primary">{winner.player.username}</div>
            <div className="text-sm text-text-muted mt-1">{winner.player.rank} · {winner.player.rating} rating</div>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-warning tabular-nums">{winner.score}</div>
              <div className="text-xs text-text-muted mt-1">Points</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <div className="text-3xl font-bold text-success tabular-nums">{winner.runtime}</div>
              <div className="text-xs text-text-muted mt-1">Runtime</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center flex items-center flex-col">
              <div className="flex items-center gap-1.5 text-2xl font-bold text-text-primary">
                <Clock size={18} className="text-text-muted" />
                {winner.submissionTime}
              </div>
              <div className="text-xs text-text-muted mt-1">Solved at</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
