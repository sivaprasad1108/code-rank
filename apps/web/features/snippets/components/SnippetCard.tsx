import Link from 'next/link'
import { Eye, Play } from 'lucide-react'
import { LanguageBadge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { formatNumber } from '@/lib/utils/format'
import { ROUTES } from '@/config/navigation.config'
import { cn } from '@/lib/utils/cn'
import { StarButton } from './StarButton'
import type { Snippet } from '@coderank/types'

interface SnippetCardProps {
  snippet: Snippet
}

export function SnippetCard({ snippet }: SnippetCardProps) {
  return (
    <Link href={ROUTES.SNIPPET(snippet.slug)} className="block group h-full">
      <article
        className={cn(
          'relative h-full flex flex-col bg-bg-elevated border border-border rounded-xl overflow-hidden',
          'transition-all duration-[var(--duration-normal)]',
          'hover:border-border-accent hover:shadow-glow-sm hover:bg-bg-overlay',
        )}
      >
        {/* Code preview strip */}
        <div className="bg-bg-primary border-b border-border px-4 py-3 font-code text-[11px] text-text-subtle leading-[1.6] max-h-[80px] overflow-hidden relative">
          <pre className="whitespace-pre-wrap break-all line-clamp-3">
            {snippet.code.slice(0, 240)}
          </pre>
          {/* fade out */}
          <div className="absolute bottom-0 inset-x-0 h-5 bg-gradient-to-t from-bg-primary to-transparent" />
        </div>

        {/* Card body */}
        <div className="flex flex-col gap-2.5 p-4 flex-1">
          {/* Title + lang badge */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm text-text-primary group-hover:text-accent-light transition-colors leading-snug line-clamp-2">
              {snippet.title}
            </h3>
            <LanguageBadge language={snippet.language} className="shrink-0 mt-0.5" />
          </div>

          {/* Description */}
          {snippet.description && (
            <p className="text-text-muted text-xs leading-relaxed line-clamp-2">
              {snippet.description}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-1">
            {/* Author */}
            {snippet.author ? (
              <div className="flex items-center gap-1.5">
                <Avatar
                  src={snippet.author.avatarUrl ?? undefined}
                  name={snippet.author.username}
                  size="xs"
                />
                <span className="text-xs text-text-subtle">{snippet.author.username}</span>
              </div>
            ) : (
              <span className="text-xs text-text-subtle">Anonymous</span>
            )}

            {/* Stats */}
            <div className="flex items-center gap-3 text-[11px] text-text-subtle">
              <StarButton
                slug={snippet.slug}
                initialCount={snippet.starsCount}
                initialStarred={snippet.starredByMe}
                iconSize={11}
              />
              <span className="flex items-center gap-1">
                <Eye size={11} />
                {formatNumber(snippet.viewsCount)}
              </span>
            </div>
          </div>
        </div>

        {/* Hover: run overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-accent/90 flex items-center justify-center shadow-glow-sm">
            <Play size={12} className="fill-white text-white ml-0.5" />
          </div>
        </div>
      </article>
    </Link>
  )
}
