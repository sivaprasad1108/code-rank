import React from 'react'
import { cn } from '@/lib/utils/cn'

interface SkeletonProps {
  className?: string
  style?: React.CSSProperties
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      style={style}
      className={cn(
        'rounded-md bg-white/5',
        'animate-[pulse_1.8s_ease-in-out_infinite]',
        className,
      )}
    />
  )
}

/** Pre-built skeleton for a snippet card */
export function SnippetCardSkeleton() {
  return (
    <div className="glass rounded-xl p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16 rounded" />
        <Skeleton className="h-4 w-32 rounded" />
      </div>
      <Skeleton className="h-5 w-3/4 rounded" />
      <Skeleton className="h-3 w-full rounded" />
      <Skeleton className="h-3 w-2/3 rounded" />
      <div className="flex items-center gap-4 pt-1">
        <Skeleton className="h-4 w-10 rounded" />
        <Skeleton className="h-4 w-10 rounded" />
        <Skeleton className="h-4 w-10 rounded" />
      </div>
    </div>
  )
}
