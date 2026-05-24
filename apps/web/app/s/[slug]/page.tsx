import { notFound } from 'next/navigation'
import { Star, Eye, Play } from 'lucide-react'
import { PageLayout } from '@/components/layout/PageLayout'
import { GlassCard } from '@/components/shared/GlassCard'
import { CodeBlock } from '@/components/shared/CodeBlock'
import { SnippetMeta } from '@/features/snippets'
import { CommentThread } from '@/features/comments'
import { LanguageBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Snippet } from '@coderank/types'
import type { Metadata } from 'next'

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
    openGraph: {
      title: snippet.title,
      description: snippet.description ?? `A ${snippet.language} snippet`,
    },
  }
}

export default async function SnippetPage({ params }: Props) {
  const snippet = await getSnippet(params.slug)
  if (!snippet) notFound()

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-[1fr_280px] gap-8">
          {/* Main */}
          <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl font-bold text-text-primary">{snippet.title}</h1>
                <LanguageBadge language={snippet.language} />
              </div>
              {snippet.description && (
                <p className="text-text-muted">{snippet.description}</p>
              )}
              <div className="flex items-center gap-3">
                <Button variant="primary" size="sm" asChild>
                  <a href={`/playground?snippet=${snippet.slug}`}>
                    <Play size={14} className="mr-1.5" />
                    Run in Playground
                  </a>
                </Button>
              </div>
            </div>

            {/* Code */}
            <CodeBlock
              code={snippet.code}
              language={snippet.language}
              maxHeight="600px"
            />

            {/* Comments */}
            <CommentThread snippetSlug={snippet.slug} />
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-6">
            <GlassCard>
              <SnippetMeta snippet={snippet} />
            </GlassCard>
          </aside>
        </div>
      </div>
    </PageLayout>
  )
}
