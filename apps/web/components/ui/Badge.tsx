import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'
import { LANGUAGES } from '@/config/languages.config'

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
          'border border-accent/20',
        ],
        success: [
          'bg-success/10 text-success',
          'border border-success/20',
        ],
        error: [
          'bg-error/10 text-error',
          'border border-error/20',
        ],
        warning: [
          'bg-warning/10 text-warning',
          'border border-warning/20',
        ],
        info: [
          'bg-info/10 text-info',
          'border border-info/20',
        ],
      },
      size: {
        xs: 'text-[9px]  px-1.5 py-0.5 rounded-xs tracking-wide',
        sm: 'text-[10px] px-1.5 py-0.5 rounded-sm',
        md: 'text-xs    px-2   py-1   rounded',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
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

/** Language badge that automatically uses the language's brand color */
export function LanguageBadge({
  language,
  className,
}: {
  language: string
  className?: string
}) {
  const langConfig = LANGUAGES.find((l) => l.id === language)
  const color = langConfig?.color ?? '#8892B4'
  const label = langConfig?.label ?? language

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-sm',
        'border tracking-wide',
        className,
      )}
      style={{
        color,
        backgroundColor: `${color}18`,
        borderColor:      `${color}35`,
      }}
    >
      {label}
    </span>
  )
}
