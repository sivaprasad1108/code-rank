'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PageLayout } from '@/components/layout/PageLayout'
import { CountdownTimer } from '@/features/war-rooms/components/nomination/CountdownTimer'
import { ProblemVoteCard } from '@/features/war-rooms/components/voting/ProblemVoteCard'
import { Button } from '@/components/ui/Button'
import { MOCK_PROBLEMS } from '@/features/war-rooms/data/mock'

export default function VotePage() {
  const { roomId } = useParams<{ roomId: string }>()
  const router = useRouter()
  const [selectedId, setSelectedId] = useState<number | null>(null)

  function handleComplete() {
    router.push(`/war-rooms/${roomId}/battle`)
  }

  return (
    <PageLayout>
      <div className="max-w-[900px] mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Vote for a Problem</h1>
          <p className="text-sm text-text-muted">The problem with the most votes will be used for this battle.</p>
        </div>

        <div className="flex flex-col items-center gap-6 mb-10">
          <CountdownTimer initialSeconds={15} label="Time to vote" onComplete={handleComplete} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {MOCK_PROBLEMS.map((problem) => (
            <ProblemVoteCard
              key={problem.id}
              problem={problem}
              selected={selectedId === problem.id}
              onSelect={() => setSelectedId(problem.id)}
            />
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            variant="primary"
            size="lg"
            className="min-w-[180px]"
            onClick={handleComplete}
          >
            {selectedId !== null ? 'Confirm Vote & Start' : 'Skip & Start Battle'}
          </Button>
        </div>
      </div>
    </PageLayout>
  )
}
