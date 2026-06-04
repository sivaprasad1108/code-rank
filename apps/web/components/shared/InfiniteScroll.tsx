'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { Spinner } from '@/components/ui/Spinner'

interface InfiniteScrollProps {
  onLoadMore: () => void
  hasMore: boolean
  isLoading: boolean
  children: ReactNode
  className?: string
  /** Distance from bottom edge to trigger load (px) */
  threshold?: number
}

export function InfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  children,
  className,
  threshold = 200,
}: InfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore()
        }
      },
      { rootMargin: `${threshold}px` },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, isLoading, onLoadMore, threshold])

  return (
    <div className={className}>
      {children}
      <div ref={sentinelRef} aria-hidden />
      {isLoading && (
        <div className="flex justify-center py-8">
          <Spinner size="md" />
        </div>
      )}
    </div>
  )
}
