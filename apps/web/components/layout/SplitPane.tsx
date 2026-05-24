'use client'

import { useRef, useState, useCallback, type ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface SplitPaneProps {
  left: ReactNode
  right: ReactNode
  /** Initial split percentage for left panel (0–100) */
  defaultSplit?: number
  minLeft?: number
  minRight?: number
  className?: string
}

export function SplitPane({
  left,
  right,
  defaultSplit = 50,
  minLeft = 20,
  minRight = 20,
  className,
}: SplitPaneProps) {
  const [split, setSplit] = useState(defaultSplit)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    isDragging.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    const onMouseMove = (ev: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const rawSplit = ((ev.clientX - rect.left) / rect.width) * 100
      const clamped = Math.min(Math.max(rawSplit, minLeft), 100 - minRight)
      setSplit(clamped)
    }

    const onMouseUp = () => {
      isDragging.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }, [minLeft, minRight])

  return (
    <div ref={containerRef} className={cn('flex h-full overflow-hidden', className)}>
      {/* Left panel */}
      <div
        className="h-full overflow-hidden"
        style={{ width: `${split}%` }}
      >
        {left}
      </div>

      {/* Drag handle */}
      <div
        onMouseDown={onMouseDown}
        className={cn(
          'w-1 shrink-0 cursor-col-resize relative group',
          'bg-border hover:bg-accent/50 transition-colors duration-[var(--duration-fast)]',
        )}
        aria-hidden
      >
        <div className="absolute inset-y-0 -inset-x-1" />
      </div>

      {/* Right panel */}
      <div
        className="h-full overflow-hidden flex-1"
        style={{ width: `${100 - split}%` }}
      >
        {right}
      </div>
    </div>
  )
}
