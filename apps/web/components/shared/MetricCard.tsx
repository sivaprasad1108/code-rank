import { cn } from '@/lib/utils/cn'
import { formatNumber } from '@/lib/utils/format'

interface MetricItem {
  iconNode: React.ReactNode
  label: string
  value: number | string
}

interface MetricCardProps {
  metrics: MetricItem[]
  className?: string
}

export function MetricCard({ metrics, className }: MetricCardProps) {
  return (
    <div className={cn('flex items-center gap-5', className)}>
      {metrics.map((m, i) => (
        <div key={i} className="flex items-center gap-1.5 text-text-muted text-sm">
          <span className="opacity-60">{m.iconNode}</span>
          <span className="font-medium text-text-primary">
            {typeof m.value === 'number' ? formatNumber(m.value) : m.value}
          </span>
          <span className="hidden sm:inline text-xs">{m.label}</span>
        </div>
      ))}
    </div>
  )
}
