'use client'

import { cn } from '@/lib/utils/cn'
import { LANGUAGES } from '@/config/languages.config'

interface FeedFiltersProps {
  language: string
  sort: 'stars' | 'recent' | 'views'
  onLanguageChange: (lang: string) => void
  onSortChange: (sort: 'stars' | 'recent' | 'views') => void
}

const SORT_OPTIONS = [
  { id: 'recent', label: 'Recent' },
  { id: 'stars',  label: 'Top' },
  { id: 'views',  label: 'Trending' },
] as const

export function FeedFilters({
  language,
  sort,
  onLanguageChange,
  onSortChange,
}: FeedFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Language filters */}
      <FilterPill
        active={!language}
        onClick={() => onLanguageChange('')}
      >
        All
      </FilterPill>

      {LANGUAGES.map((lang) => (
        <FilterPill
          key={lang.id}
          active={language === lang.id}
          onClick={() => onLanguageChange(lang.id)}
          activeStyle={
            language === lang.id
              ? { borderColor: lang.color + '50', backgroundColor: lang.color + '18', color: lang.color }
              : undefined
          }
        >
          {lang.label}
        </FilterPill>
      ))}

      {/* Divider */}
      <div className="h-5 w-px bg-border mx-0.5 hidden sm:block" />

      {/* Sort */}
      {SORT_OPTIONS.map((opt) => (
        <FilterPill
          key={opt.id}
          active={sort === opt.id}
          onClick={() => onSortChange(opt.id)}
        >
          {opt.label}
        </FilterPill>
      ))}
    </div>
  )
}

function FilterPill({
  active,
  onClick,
  activeStyle,
  children,
}: {
  active: boolean
  onClick: () => void
  activeStyle?: React.CSSProperties
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      style={active ? activeStyle : undefined}
      className={cn(
        'px-3 py-1.5 rounded-md text-xs font-medium transition-all border',
        active && !activeStyle
          ? 'bg-accent/15 text-accent border-accent/25'
          : !active
          ? 'text-text-muted border-border hover:border-border-strong hover:text-text-primary hover:bg-bg-hover'
          : '',
        active && activeStyle ? 'border' : '',
      )}
    >
      {children}
    </button>
  )
}
