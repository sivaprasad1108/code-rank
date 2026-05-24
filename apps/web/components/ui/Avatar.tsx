import Image from 'next/image'
import { cn } from '@/lib/utils/cn'
import { getInitials } from '@/lib/utils/format'

interface AvatarProps {
  src?: string | null
  /** Accessible label for the image. Defaults to name if not provided. */
  alt?: string
  name: string       // used for initials fallback
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
}

export function Avatar({ src, alt, name, size = 'md', className }: AvatarProps) {
  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center',
        'rounded-full overflow-hidden select-none',
        'bg-accent/20 text-accent font-semibold',
        'border border-border',
        'ring-2 ring-bg-surface',
        sizeMap[size],
        className,
      )}
    >
      {src ? (
        <Image src={src} alt={alt ?? name} fill className="object-cover" sizes="56px" />
      ) : (
        <span aria-hidden>{getInitials(name)}</span>
      )}
    </div>
  )
}
