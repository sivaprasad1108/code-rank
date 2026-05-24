import { icons, type LucideProps } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface IconProps extends LucideProps {
  /** Lucide icon name — kebab-case (e.g. 'zap', 'share-2') or PascalCase ('Zap') */
  name: string
  className?: string
}

function toIconKey(name: string): string {
  // Convert kebab-case to PascalCase: 'share-2' → 'Share2'
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

export function Icon({ name, className, size = 20, ...props }: IconProps) {
  const key = toIconKey(name) as keyof typeof icons
  const LucideIcon = icons[key]

  if (!LucideIcon) {
    return null
  }

  return <LucideIcon size={size} className={cn(className)} {...props} />
}
