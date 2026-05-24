import { cn } from '@/lib/utils/cn'
import type { HTMLAttributes } from 'react'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds an accent glow border on hover */
  hoverable?: boolean
  /** Adds a subtle purple accent gradient overlay */
  accented?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-8',
}

export function GlassCard({
  className,
  hoverable = false,
  accented = false,
  padding = 'md',
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'glass rounded-xl relative overflow-hidden',
        hoverable && [
          'transition-all duration-[var(--duration-normal)]',
          'hover:border-border-accent hover:shadow-glow-sm',
        ],
        accented && 'bg-card-gradient',
        paddingMap[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
