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
  { id: 'stars', label: 'Most starred' },
  { id: 'views', label: 'Most viewed' },
] as const

export function FeedFilters({
  language,
  sort,
  onLanguageChange,
  onSortChange,
}: FeedFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Language filter */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onLanguageChange('')}
          className={cn(
            'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
            !language
              ? 'bg-accent/20 text-accent border border-accent/30'
              : 'glass border border-border text-text-muted hover:text-text-primary',
          )}
        >
          All
        </button>
        {LANGUAGES.map((lang) => (
          <button
            key={lang.id}
            onClick={() => onLanguageChange(lang.id)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              language === lang.id
                ? 'border text-text-primary'
                : 'glass border border-border text-text-muted hover:text-text-primary',
            )}
            style={
              language === lang.id
                ? {
                    borderColor: lang.color + '50',
                    backgroundColor: lang.color + '15',
                    color: lang.color,
                  }
                : undefined
            }
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* Separator */}
      <div className="h-5 w-px bg-border hidden sm:block" />

      {/* Sort */}
      <div className="flex items-center gap-1.5">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSortChange(opt.id)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              sort === opt.id
                ? 'bg-accent/20 text-accent border border-accent/30'
                : 'glass border border-border text-text-muted hover:text-text-primary',
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
