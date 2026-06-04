import { CheckCircle } from 'lucide-react'
import { GlassCard } from '@/components/shared/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { MOCK_PROBLEMS } from '../../data/mock'

export function NominationsPanel() {
  const nominations = MOCK_PROBLEMS.filter((p) => p.nominatedBy)

  return (
    <GlassCard padding="none">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-text-primary">Nominations</h3>
        <p className="text-xs text-text-muted">{nominations.length} submitted</p>
      </div>

      <div className="divide-y divide-border/50">
        {nominations.map((p) => (
          <div key={p.id} className="flex items-center gap-3 px-4 py-3 hover:bg-bg-hover/30 transition-colors">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-code text-text-subtle">#{p.id}</span>
                <span className="font-medium text-sm text-text-primary truncate">{p.name}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={p.difficulty === 'Easy' ? 'success' : p.difficulty === 'Medium' ? 'warning' : 'error'}
                  size="xs"
                >
                  {p.difficulty}
                </Badge>
                <span className="text-[10px] text-text-subtle">Acceptance: {p.acceptance}</span>
              </div>
            </div>

            {p.nominatedBy && (
              <div className="flex items-center gap-1.5 shrink-0">
                <Avatar name={p.nominatedBy} size="xs" />
                <span className="text-xs text-text-muted">{p.nominatedBy}</span>
              </div>
            )}
          </div>
        ))}

        {nominations.length === 0 && (
          <div className="py-10 text-center text-text-subtle text-sm">
            No nominations yet — be the first!
          </div>
        )}
      </div>
    </GlassCard>
  )
}
