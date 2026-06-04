import { useInfiniteQuery } from '@tanstack/react-query'
import type { Snippet } from '@coderank/types'
import { apiClient } from '@/lib/api/client'
import { ENDPOINTS } from '@/lib/api/endpoints'

interface FeedParams {
  language?: string
  sort?: 'stars' | 'recent' | 'views'
}

interface FeedPage {
  snippets: Snippet[]
  nextCursor: string | null
}

export function useFeed(params: FeedParams = {}) {
  return useInfiniteQuery({
    queryKey: ['feed', params.language ?? '', params.sort ?? 'recent'],
    queryFn: async ({ pageParam }) => {
      const searchParams = new URLSearchParams()
      if (params.language) searchParams.set('language', params.language)
      if (params.sort) searchParams.set('sort', params.sort)
      if (pageParam) searchParams.set('cursor', pageParam as string)
      searchParams.set('limit', '20')

      return apiClient.get<FeedPage>(
        `${ENDPOINTS.SNIPPETS.LIST}?${searchParams.toString()}`,
      )
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })
}
