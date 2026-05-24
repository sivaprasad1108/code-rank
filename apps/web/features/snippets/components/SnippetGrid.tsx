import { SnippetCard } from './SnippetCard'
import { SnippetCardSkeleton } from '@/components/ui/Skeleton'
import type { Snippet } from '@coderank/types'

interface SnippetGridProps {
  snippets: Snippet[]
  isLoading?: boolean
  skeletonCount?: number
}

export function SnippetGrid({ snippets, isLoading, skeletonCount = 6 }: SnippetGridProps) {
  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SnippetCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {snippets.map((snippet) => (
        <SnippetCard key={snippet.id} snippet={snippet} />
      ))}
    </div>
  )
}
