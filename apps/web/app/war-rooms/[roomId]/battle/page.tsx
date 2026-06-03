import { BattleLayout } from '@/features/war-rooms/components/battle/BattleLayout'

// Full-screen battle workspace — no PageLayout wrapper (no nav/footer)
export default function BattlePage({ params }: { params: { roomId: string } }) {
  return <BattleLayout roomId={params.roomId} />
}
