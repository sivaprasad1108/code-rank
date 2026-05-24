'use client'

import { type ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

export interface TabConfig {
  id: string
  label: string
  icon?: ReactNode
  badge?: string | number
}

interface TabsProps {
  tabs: TabConfig[]
  activeTab: string
  onTabChange: (id: string) => void
  className?: string
  size?: 'sm' | 'md'
}

export function Tabs({ tabs, activeTab, onTabChange, className, size = 'md' }: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn(
        'flex items-center gap-1 border-b border-border',
        className,
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'flex items-center gap-1.5 font-medium transition-colors relative',
            'border-b-2 -mb-px',
            size === 'sm' ? 'text-xs px-3 py-2' : 'text-sm px-4 py-2.5',
            activeTab === tab.id
              ? 'text-text-primary border-accent'
              : 'text-text-muted border-transparent hover:text-text-primary hover:border-border',
          )}
        >
          {tab.icon}
          {tab.label}
          {tab.badge !== undefined && (
            <span
              className={cn(
                'px-1.5 py-0.5 rounded-full text-xs font-medium',
                activeTab === tab.id
                  ? 'bg-accent/20 text-accent'
                  : 'bg-bg-elevated text-text-muted',
              )}
            >
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
