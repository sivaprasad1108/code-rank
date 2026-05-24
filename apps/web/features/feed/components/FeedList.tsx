'use client'

import { useState } from 'react'
import { LayoutGrid } from 'lucide-react'
import { FeedFilters } from './FeedFilters'
import { SnippetGrid } from '@/features/snippets/components/SnippetGrid'
import { InfiniteScroll } from '@/components/shared/InfiniteScroll'
import { EmptyState } from '@/components/shared/EmptyState'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { useFeed } from '../hooks/useFeed'

export function FeedList() {
  const [language, setLanguage] = useState('')
  const [sort, setSort] = useState<'stars' | 'recent' | 'views'>('recent')

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useFeed({
    language: language || undefined,
    sort,
  })

  const snippets = data?.pages.flatMap((p) => p.snippets) ?? []

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-5">
        <SectionHeader
          title="Explore snippets"
          description="Browse runnable code shared by developers"
        />
        <FeedFilters
          language={language}
          sort={sort}
          onLanguageChange={setLanguage}
          onSortChange={setSort}
        />
      </div>

      {!isLoading && snippets.length === 0 ? (
        <EmptyState
          icon={<LayoutGrid size={36} />}
          title="No snippets found"
          description="Try a different language or sort order."
        />
      ) : (
        <InfiniteScroll
          onLoadMore={fetchNextPage}
          hasMore={!!hasNextPage}
          isLoading={isFetchingNextPage}
        >
          <SnippetGrid snippets={snippets} isLoading={isLoading} />
        </InfiniteScroll>
      )}
    </div>
  )
}
