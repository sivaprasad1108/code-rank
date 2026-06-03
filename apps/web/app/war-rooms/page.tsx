'use client'

import { useState, useEffect } from 'react'
import { PageLayout } from '@/components/layout/PageLayout'
import { DiscoveryHero } from '@/features/war-rooms/components/discovery/DiscoveryHero'
import { PlatformMetrics } from '@/features/war-rooms/components/discovery/PlatformMetrics'
import { FeaturedRoomsGrid } from '@/features/war-rooms/components/discovery/FeaturedRoomsGrid'
import { PublicRoomsTable } from '@/features/war-rooms/components/discovery/PublicRoomsTable'
import { SpectatorSection } from '@/features/war-rooms/components/discovery/SpectatorSection'
import { CreateRoomModal } from '@/features/war-rooms/components/CreateRoomModal'
import { ComingSoonModal } from '@/features/war-rooms/components/ComingSoonModal'

const STORAGE_KEY = 'war-rooms-preview-acknowledged'

export default function WarRoomsPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)

  // Show modal on first visit unless user opted out
  useEffect(() => {
    const acknowledged = localStorage.getItem(STORAGE_KEY)
    if (!acknowledged) {
      setPreviewModalOpen(true)
    }
  }, [])

  return (
    <PageLayout>
      <ComingSoonModal
        isOpen={previewModalOpen}
        onContinue={() => setPreviewModalOpen(false)}
        onClose={() => setPreviewModalOpen(false)}
      />
      <DiscoveryHero onCreateRoom={() => setCreateOpen(true)} />
      <PlatformMetrics />
      <FeaturedRoomsGrid />
      <PublicRoomsTable />
      <SpectatorSection />
      <CreateRoomModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />
    </PageLayout>
  )
}
