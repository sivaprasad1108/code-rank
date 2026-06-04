import { useQuery } from '@tanstack/react-query'
import type { Snippet } from '@coderank/types'
import { apiClient } from '@/lib/api/client'
import { ENDPOINTS } from '@/lib/api/endpoints'
import { queryKeys } from '@/lib/api/query-keys'

export function useSnippet(slug: string) {
  return useQuery({
    queryKey: queryKeys.snippets.detail(slug),
    queryFn: async () => {
      return apiClient.get<Snippet>(ENDPOINTS.SNIPPETS.DETAIL(slug))
    },
    enabled: !!slug,
  })
}
