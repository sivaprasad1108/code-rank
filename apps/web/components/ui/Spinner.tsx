import { cn } from '@/lib/utils/cn'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'h-4 w-4 border-[1.5px]',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-2',
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        'rounded-full border-text-subtle border-t-accent animate-spin',
        sizeMap[size],
        className,
      )}
    />
  )
}
