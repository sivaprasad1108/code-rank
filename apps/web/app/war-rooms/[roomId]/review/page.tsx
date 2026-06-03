'use client'

import { useState } from 'react'
import { PageLayout } from '@/components/layout/PageLayout'
import { PlayerList } from '@/features/war-rooms/components/review/PlayerList'
import { SolutionViewer } from '@/features/war-rooms/components/review/SolutionViewer'
import { MetricsPanel } from '@/features/war-rooms/components/review/MetricsPanel'
import { MOCK_LEADERBOARD } from '@/features/war-rooms/data/mock'

export default function ReviewPage() {
  const [selectedPlayerId, setSelectedPlayerId] = useState(MOCK_LEADERBOARD[0].player.id)
  const [comparePlayerId, setComparePlayerId]   = useState(MOCK_LEADERBOARD[1].player.id)
  const [compareMode, setCompareMode]           = useState(false)

  return (
    <PageLayout hideFooter>
      <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
        {/* Left: player list */}
        <div className="w-[200px] shrink-0 border-r border-border bg-bg-surface overflow-hidden">
          <PlayerList selectedId={selectedPlayerId} onSelect={setSelectedPlayerId} />
        </div>

        {/* Center + bottom metrics */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div className="flex-1 overflow-hidden">
            <SolutionViewer
              primaryPlayerId={selectedPlayerId}
              comparePlayerId={comparePlayerId}
              compareMode={compareMode}
              onToggleCompare={() => setCompareMode((c) => !c)}
              onSetComparePlayer={setComparePlayerId}
            />
          </div>
          <MetricsPanel playerId={selectedPlayerId} />
        </div>
      </div>
    </PageLayout>
  )
}
