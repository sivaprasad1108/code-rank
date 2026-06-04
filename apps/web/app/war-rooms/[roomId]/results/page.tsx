import { PageLayout } from '@/components/layout/PageLayout'
import { ResultsHero } from '@/features/war-rooms/components/results/ResultsHero'
import { AchievementCards } from '@/features/war-rooms/components/results/AchievementCards'
import { FinalRankings } from '@/features/war-rooms/components/results/FinalRankings'

export default function ResultsPage() {
  return (
    <PageLayout>
      <ResultsHero />
      <AchievementCards />
      <FinalRankings />
    </PageLayout>
  )
}
