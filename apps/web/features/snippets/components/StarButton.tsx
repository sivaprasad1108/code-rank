'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useStarSnippet } from '../hooks/useStarSnippet'
import { formatNumber } from '@/lib/utils/format'

interface Props {
  slug: string
  initialCount: number
  initialStarred?: boolean
  /** Icon size in px */
  iconSize?: number
  showCount?: boolean
  /** When true renders as a pill action button (snippet detail page) */
  pill?: boolean
  className?: string
}

export function StarButton({
  slug,
  initialCount,
  initialStarred = false,
  iconSize = 11,
  showCount = true,
  pill = false,
  className,
}: Props) {
  const { user } = useAuth()
  const { mutate, isPending } = useStarSnippet(slug)
  const [starred, setStarred] = useState(initialStarred)
  const [count, setCount] = useState(initialCount)

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!user || isPending) return

    const prevStarred = starred
    const prevCount   = count
    setStarred(!prevStarred)
    setCount(prevStarred ? prevCount - 1 : prevCount + 1)

    mutate(undefined, {
      onError: () => {
        setStarred(prevStarred)
        setCount(prevCount)
      },
    })
  }

  if (pill) {
    return (
      <button
        onClick={handleClick}
        disabled={isPending}
        title={!user ? 'Sign in to star' : starred ? 'Unstar' : 'Star'}
        className={cn(
          'inline-flex items-center gap-1.5 h-8 px-3 rounded-md border text-xs font-medium transition-all',
          starred
            ? 'border-yellow-400/40 text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/15'
            : 'border-border text-text-muted hover:border-border-strong hover:text-text-primary hover:bg-bg-hover',
          !user && 'opacity-60 cursor-default',
          className,
        )}
      >
        <Star size={iconSize} className={cn(starred && 'fill-current')} />
        {starred ? 'Starred' : 'Star'}
        {showCount && count > 0 && (
          <span className={cn(
            'px-1.5 py-0.5 rounded text-[10px] font-semibold',
            starred ? 'bg-yellow-400/20' : 'bg-bg-overlay',
          )}>
            {formatNumber(count)}
          </span>
        )}
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={!user ? 'Sign in to star' : starred ? 'Unstar' : 'Star'}
      className={cn(
        'flex items-center gap-1 transition-colors',
        starred
          ? 'text-yellow-400'
          : 'text-text-subtle hover:text-text-muted',
        !user && 'cursor-default',
        className,
      )}
    >
      <Star size={iconSize} className={cn(starred && 'fill-current')} />
      {showCount && formatNumber(count)}
    </button>
  )
}
