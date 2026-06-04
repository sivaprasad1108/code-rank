'use client'

import { Swords, Plus, Hash } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface DiscoveryHeroProps {
  onCreateRoom: () => void
}

export function DiscoveryHero({ onCreateRoom }: DiscoveryHeroProps) {
  return (
    <section className="relative py-16 px-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-[1920px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            {/* Label */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/25 flex items-center justify-center">
                <Swords size={14} className="text-accent" />
              </div>
              <span className="text-xs font-semibold text-accent tracking-widest uppercase">
                War Rooms
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-text-primary leading-tight">
              Live Coding{' '}
              <span className="text-gradient">Battles</span>
            </h1>
            <p className="mt-3 text-text-muted text-lg max-w-xl">
              Compete in real-time with developers worldwide. Nominate problems, vote on challenges, and prove your skills under pressure.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button variant="secondary" size="lg" className="gap-2">
              <Hash size={15} />
              Join by ID
            </Button>
            <Button variant="primary" size="lg" className="gap-2" onClick={onCreateRoom}>
              <Plus size={15} />
              Create Room
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
