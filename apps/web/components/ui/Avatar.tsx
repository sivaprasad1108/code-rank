import Image from 'next/image'
import { cn } from '@/lib/utils/cn'
import { getInitials } from '@/lib/utils/format'

interface AvatarProps {
  src?: string | null
  alt?: string
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeMap = {
  xs: 'h-6 w-6 text-[9px]',
  sm: 'h-8 w-8 text-[10px]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-11 w-11 text-sm',
  xl: 'h-14 w-14 text-base',
}

const imageSizes = {
  xs: 24,
  sm: 32,
  md: 36,
  lg: 44,
  xl: 56,
}

export function Avatar({ src, alt, name, size = 'md', className }: AvatarProps) {
  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center',
        'rounded-full overflow-hidden select-none',
        'bg-accent/15 text-accent font-semibold',
        'border border-border',
        sizeMap[size],
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt ?? name}
          fill
          className="object-cover"
          sizes={`${imageSizes[size]}px`}
        />
      ) : (
        <span aria-hidden className="leading-none">{getInitials(name)}</span>
      )}
    </div>
  )
}
