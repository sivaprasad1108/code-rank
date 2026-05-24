import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4',
        'py-16 px-6 text-center',
        className,
      )}
    >
      {icon && (
        <div className="text-text-subtle opacity-50 mb-2">{icon}</div>
      )}
      <div className="space-y-2">
        <h3 className="text-text-primary font-semibold text-lg">{title}</h3>
        {description && (
          <p className="text-text-muted text-sm max-w-sm mx-auto">{description}</p>
        )}
      </div>
      {action && (
        <>
          {action.href ? (
            <Button variant="secondary" size="md" asChild>
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ) : (
            <Button variant="secondary" size="md" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </>
      )}
    </div>
  )
}
