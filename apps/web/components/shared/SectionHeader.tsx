import { cn } from '@/lib/utils/cn'
import type { ReactNode } from 'react'

interface SectionHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  className?: string
  align?: 'left' | 'center'
}

export function SectionHeader({
  title,
  description,
  action,
  className,
  align = 'left',
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4',
        align === 'center' && 'flex-col items-center text-center',
        className,
      )}
    >
      <div className="space-y-1.5">
        <h2
          className={cn(
            'font-bold text-text-primary leading-tight',
            'text-xl sm:text-2xl',
          )}
        >
          {title}
        </h2>
        {description && (
          <p className="text-text-muted text-sm sm:text-base max-w-xl">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
