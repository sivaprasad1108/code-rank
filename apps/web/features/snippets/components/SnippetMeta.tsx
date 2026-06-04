import Link from 'next/link'
import { Star, Eye, MessageSquare } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { MetricCard } from '@/components/shared/MetricCard'
import { formatDate } from '@/lib/utils/format'
import { ROUTES } from '@/config/navigation.config'
import type { Snippet } from '@coderank/types'

interface SnippetMetaProps {
  snippet: Snippet
  className?: string
}

export function SnippetMeta({ snippet, className }: SnippetMetaProps) {
  return (
    <div className={className}>
      {/* Author */}
      {snippet.author && (
        <Link
          href={ROUTES.PROFILE(snippet.author.username)}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <Avatar
            src={snippet.author.avatarUrl ?? undefined}
            name={snippet.author.username}
            size="sm"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-text-primary">
              {snippet.author.username}
            </span>
            <span className="text-xs text-text-muted">
              {formatDate(snippet.createdAt)}
            </span>
          </div>
        </Link>
      )}

      {/* Metrics */}
      <MetricCard
        className="mt-3"
        metrics={[
          { iconNode: <Star size={14} />, label: 'stars', value: snippet.starsCount },
          { iconNode: <Eye size={14} />, label: 'views', value: snippet.viewsCount },
        ]}
      />
    </div>
  )
}
