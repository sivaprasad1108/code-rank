import { PageLayout } from '@/components/layout/PageLayout'
import { HistoryTable } from '@/features/war-rooms/components/history/HistoryTable'

export default function WarRoomsHistoryPage() {
  return (
    <PageLayout>
      <div className="pt-8">
        <HistoryTable />
      </div>
    </PageLayout>
  )
}
