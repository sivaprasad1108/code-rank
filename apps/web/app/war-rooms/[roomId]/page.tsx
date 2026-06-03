import { PageLayout } from '@/components/layout/PageLayout'
import { ParticipantsPanel } from '@/features/war-rooms/components/lobby/ParticipantsPanel'
import { RoomInfoPanel } from '@/features/war-rooms/components/lobby/RoomInfoPanel'
import { ActivityFeed } from '@/features/war-rooms/components/lobby/ActivityFeed'

export default function RoomLobbyPage({ params }: { params: { roomId: string } }) {
  return (
    <PageLayout>
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          <div className="flex flex-col gap-6">
            <ParticipantsPanel />
            <ActivityFeed />
          </div>
          <div>
            <RoomInfoPanel roomId={params.roomId} />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
