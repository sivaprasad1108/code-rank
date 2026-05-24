import Link from 'next/link'
import { Star, Eye } from 'lucide-react'
import { GlassCard } from '@/components/shared/GlassCard'
import { LanguageBadge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { formatNumber, formatDate } from '@/lib/utils/format'
import { ROUTES } from '@/config/navigation.config'
import type { Snippet } from '@coderank/types'

interface SnippetCardProps {
  snippet: Snippet
}

export function SnippetCard({ snippet }: SnippetCardProps) {
  return (
    <Link href={ROUTES.SNIPPET(snippet.slug)} className="block group">
      <GlassCard hoverable className="h-full flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors line-clamp-1">
            {snippet.title}
          </h3>
          <LanguageBadge language={snippet.language} />
        </div>

        {/* Description */}
        {snippet.description && (
          <p className="text-text-muted text-sm leading-relaxed line-clamp-2">
            {snippet.description}
          </p>
        )}

        {/* Code preview */}
        <div className="rounded-lg bg-bg-primary border border-border p-3 font-code text-xs text-text-muted overflow-hidden max-h-20 leading-relaxed">
          <pre className="truncate">{snippet.code.slice(0, 200)}</pre>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-1">
          {snippet.author ? (
            <div className="flex items-center gap-1.5">
              <Avatar
                src={snippet.author.avatarUrl ?? undefined}
                name={snippet.author.username}
                size="xs"
              />
              <span className="text-xs text-text-muted">{snippet.author.username}</span>
            </div>
          ) : (
            <span className="text-xs text-text-subtle">Anonymous</span>
          )}

          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <Star size={12} />
              {formatNumber(snippet.starsCount)}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={12} />
              {formatNumber(snippet.viewsCount)}
            </span>
            <span className="text-text-subtle hidden sm:inline">
              {formatDate(snippet.createdAt)}
            </span>
          </div>
        </div>
      </GlassCard>
    </Link>
  )
}
