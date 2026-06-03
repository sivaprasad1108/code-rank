import { Zap, Clock, Target, Brain, TrendingUp } from 'lucide-react'
import { GlassCard } from '@/components/shared/GlassCard'
import { Avatar } from '@/components/ui/Avatar'
import { MOCK_LEADERBOARD } from '../../data/mock'

const ACHIEVEMENTS = [
  {
    icon: <Zap size={16} className="text-warning" />,
    title: 'Fastest Solver',
    player: MOCK_LEADERBOARD[0].player.username,
    detail: `Solved in ${MOCK_LEADERBOARD[0].submissionTime}`,
    color: 'border-warning/20 bg-warning/5',
  },
  {
    icon: <Clock size={16} className="text-accent" />,
    title: 'Best Runtime',
    player: MOCK_LEADERBOARD[0].player.username,
    detail: MOCK_LEADERBOARD[0].runtime,
    color: 'border-accent/20 bg-accent/5',
  },
  {
    icon: <Target size={16} className="text-success" />,
    title: 'Fewest Attempts',
    player: MOCK_LEADERBOARD[0].player.username,
    detail: `${MOCK_LEADERBOARD[0].attempts} attempt`,
    color: 'border-success/20 bg-success/5',
  },
  {
    icon: <Brain size={16} className="text-info" />,
    title: 'Most Efficient',
    player: MOCK_LEADERBOARD[1].player.username,
    detail: MOCK_LEADERBOARD[1].memory,
    color: 'border-info/20 bg-info/5',
  },
  {
    icon: <TrendingUp size={16} className="text-error" />,
    title: 'Highest Accuracy',
    player: MOCK_LEADERBOARD[1].player.username,
    detail: '100% test cases',
    color: 'border-error/20 bg-error/5',
  },
]

export function AchievementCards() {
  return (
    <section className="px-6 pb-8">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Battle Highlights</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {ACHIEVEMENTS.map((a) => (
            <GlassCard key={a.title} padding="md" className={`border ${a.color}`}>
              <div className="mb-3">{a.icon}</div>
              <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-2">{a.title}</div>
              <div className="flex items-center gap-1.5 mb-1">
                <Avatar name={a.player} size="xs" />
                <span className="text-xs font-medium text-text-primary truncate">{a.player}</span>
              </div>
              <div className="text-xs text-text-subtle">{a.detail}</div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
