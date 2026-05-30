import { PageLayout } from '@/components/layout/PageLayout'
import { CountdownTimer } from '@/features/war-rooms/components/nomination/CountdownTimer'
import { ProblemNominator } from '@/features/war-rooms/components/nomination/ProblemNominator'
import { NominationsPanel } from '@/features/war-rooms/components/nomination/NominationsPanel'

export default function NominatePage() {
  return (
    <PageLayout>
      <div className="max-w-[1100px] mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Nomination Phase</h1>
          <p className="text-sm text-text-muted">Submit a problem for this battle. Everyone can see nominations.</p>
        </div>

        <div className="flex flex-col items-center gap-6 mb-10">
          <CountdownTimer initialSeconds={90} label="Time to nominate" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          <ProblemNominator />
          <NominationsPanel />
        </div>
      </div>
    </PageLayout>
  )
}
