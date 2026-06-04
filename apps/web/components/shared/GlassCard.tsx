import { cn } from '@/lib/utils/cn'
import type { HTMLAttributes } from 'react'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Show accent glow border on hover */
  hoverable?: boolean
  /** Add a subtle purple accent gradient */
  accented?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingMap = {
  none: '',
  sm:   'p-4',
  md:   'p-5',
  lg:   'p-8',
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
        'relative rounded-xl bg-bg-elevated border border-border overflow-hidden',
        hoverable && [
          'transition-all duration-[var(--duration-normal)] cursor-pointer',
          'hover:border-border-accent hover:shadow-glow-sm hover:bg-bg-overlay',
        ],
        accented && 'bg-gradient-to-br from-accent/[0.06] to-transparent',
        paddingMap[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
