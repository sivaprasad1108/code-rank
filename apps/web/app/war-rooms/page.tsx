'use client'

import { useState } from 'react'
import { PageLayout } from '@/components/layout/PageLayout'
import { DiscoveryHero } from '@/features/war-rooms/components/discovery/DiscoveryHero'
import { PlatformMetrics } from '@/features/war-rooms/components/discovery/PlatformMetrics'
import { FeaturedRoomsGrid } from '@/features/war-rooms/components/discovery/FeaturedRoomsGrid'
import { PublicRoomsTable } from '@/features/war-rooms/components/discovery/PublicRoomsTable'
import { SpectatorSection } from '@/features/war-rooms/components/discovery/SpectatorSection'
import { CreateRoomModal } from '@/features/war-rooms/components/CreateRoomModal'

export default function WarRoomsPage() {
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <PageLayout>
      <DiscoveryHero onCreateRoom={() => setCreateOpen(true)} />
      <PlatformMetrics />
      <FeaturedRoomsGrid />
      <PublicRoomsTable />
      <SpectatorSection />
      <CreateRoomModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />
    </PageLayout>
  )
}
