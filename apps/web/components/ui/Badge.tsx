import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center gap-1 font-medium select-none whitespace-nowrap',
  {
    variants: {
      variant: {
        default: [
          'bg-bg-elevated text-text-muted',
          'border border-border',
        ],
        accent: [
          'bg-accent/15 text-accent',
          'border border-accent/25',
        ],
        success: [
          'bg-success/15 text-success',
          'border border-success/25',
        ],
        error: [
          'bg-error/15 text-error',
          'border border-error/25',
        ],
        warning: [
          'bg-warning/15 text-warning',
          'border border-warning/25',
        ],
        info: [
          'bg-info/15 text-info',
          'border border-info/25',
        ],
      },
      size: {
        sm: 'text-[10px] px-1.5 py-0.5 rounded-sm',
        md: 'text-xs px-2 py-0.5 rounded',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

/** Language-specific badge with the language's brand color */
export function LanguageBadge({
  language,
  color,
  className,
}: {
  language: string
  color?: string
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded',
        'border',
        className,
      )}
      style={
        color
          ? {
              color,
              backgroundColor: `${color}20`,
              borderColor: `${color}40`,
            }
          : undefined
      }
    >
      {language}
    </span>
  )
}
