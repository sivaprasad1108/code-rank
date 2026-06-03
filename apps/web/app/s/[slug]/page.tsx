import { type ReactNode } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  Star, Eye, GitFork, ArrowLeft,
  CheckCircle2, Clock, User,
} from 'lucide-react'
import { PageLayout } from '@/components/layout/PageLayout'
import { CodeBlock } from '@/components/shared/CodeBlock'
import { CommentThread } from '@/features/comments'
import { LanguageBadge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { SnippetActions } from '@/features/snippets/components/SnippetActions'
import type { Snippet } from '@coderank/types'
import type { Metadata } from 'next'
import { ROUTES } from '@/config/navigation.config'

interface Props {
  params: { slug: string }
}

async function getSnippet(slug: string): Promise<Snippet | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
    const res = await fetch(`${apiUrl}/api/v1/snippets/${slug}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    const json = await res.json()
    return json.data
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const snippet = await getSnippet(params.slug)
  if (!snippet) return { title: 'Snippet not found — CodeRank' }
  return {
    title: `${snippet.title} — CodeRank`,
    description: snippet.description ?? `A ${snippet.language} snippet on CodeRank`,
    openGraph: { title: snippet.title, description: snippet.description ?? `A ${snippet.language} snippet` },
  }
}

export default async function SnippetPage({ params }: Props) {
  const snippet = await getSnippet(params.slug)
  if (!snippet) notFound()

  const author = snippet.author

  return (
    <PageLayout>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">

        {/* Back link */}
        <Link
          href={ROUTES.FEED}
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary mb-6 transition-colors group"
        >
          <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to snippets
        </Link>

        <div className="grid lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-8 items-start">

          {/* ── Main content ── */}
          <div className="flex flex-col gap-6 min-w-0">

            {/* Header */}
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3 justify-between">
                <div className="flex flex-col gap-1.5 min-w-0">
                  <h1 className="text-xl font-bold text-text-primary leading-tight tracking-tight">
                    {snippet.title}
                  </h1>
                  {snippet.description && (
                    <p className="text-sm text-text-muted leading-relaxed">
                      {snippet.description}
                    </p>
                  )}
                </div>
                <LanguageBadge language={snippet.language} />
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-text-subtle flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Star size={12} />
                  {snippet.starsCount} stars
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye size={12} />
                  {snippet.viewsCount} views
                </span>
                {author && (
                  <span className="flex items-center gap-1.5">
                    <User size={12} />
                    {author.username}
                  </span>
                )}
              </div>

              {/* Action bar */}
              <SnippetActions snippet={snippet} />
            </div>

            {/* Code viewer */}
            <CodeBlock
              code={snippet.code}
              language={snippet.language}
              maxHeight="520px"
            />

            {/* Comments */}
            <div className="border-t border-border pt-6">
              <h2 className="text-sm font-semibold text-text-primary mb-4">
                Comments
              </h2>
              <CommentThread snippetSlug={snippet.slug} />
            </div>
          </div>

          {/* ── Sidebar ── */}
          <aside className="flex flex-col gap-4 lg:sticky lg:top-[72px]">

            {/* Execution Result card */}
            <div className="rounded-xl border border-border bg-bg-elevated overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-bg-surface">
                <span className="text-[11px] font-semibold text-text-subtle uppercase tracking-wider">
                  Execution Result
                </span>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-success/20 bg-success/10 text-success text-xs font-semibold w-fit">
                  <CheckCircle2 size={12} />
                  Succeeded
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <SidebarMetric label="Runtime" value="0.002 s" />
                  <SidebarMetric label="Memory" value="4.74 MB" />
                  <SidebarMetric label="Language" value={snippet.language.charAt(0).toUpperCase() + snippet.language.slice(1)} />
                  <SidebarMetric label="Exit code" value="0" />
                </div>
              </div>
            </div>

            {/* About Author */}
            {author && (
              <div className="rounded-xl border border-border bg-bg-elevated overflow-hidden">
                <div className="px-4 py-3 border-b border-border bg-bg-surface">
                  <span className="text-[11px] font-semibold text-text-subtle uppercase tracking-wider">
                    About Author
                  </span>
                </div>
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={author.username} size="md" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-semibold text-text-primary truncate">
                        {author.username}
                      </span>
                      {author.bio && (
                        <span className="text-xs text-text-muted truncate">{author.bio}</span>
                      )}
                    </div>
                  </div>
                  <Link
                    href={ROUTES.PROFILE(author.username)}
                    className="w-full text-center py-1.5 rounded-lg border border-accent/25 text-accent text-xs font-medium hover:bg-accent/10 transition-colors"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="rounded-xl border border-border bg-bg-elevated p-4 flex flex-col gap-3">
              <span className="text-[11px] font-semibold text-text-subtle uppercase tracking-wider">
                Stats
              </span>
              <div className="flex flex-col gap-2">
                <StatRow icon={<Star size={12} />}      label="Stars"  value={snippet.starsCount} />
                <StatRow icon={<Eye size={12} />}        label="Views"  value={snippet.viewsCount} />
                <StatRow icon={<GitFork size={12} />}   label="Forks"  value={0} />
                <StatRow icon={<Clock size={12} />}     label="Runs"   value={0} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </PageLayout>
  )
}

function SidebarMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 px-2.5 py-2 rounded-lg bg-bg-overlay border border-border">
      <span className="text-[9px] text-text-subtle uppercase tracking-wide">{label}</span>
      <span className="text-xs font-semibold text-text-primary font-code">{value}</span>
    </div>
  )
}

function StatRow({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="flex items-center gap-1.5 text-text-muted">{icon}{label}</span>
      <span className="font-semibold text-text-primary">{value.toLocaleString()}</span>
    </div>
  )
}
