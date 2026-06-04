import { useQuery } from '@tanstack/react-query'
import type { Snippet, SnippetFilters } from '@coderank/types'
import { apiClient } from '@/lib/api/client'
import { ENDPOINTS } from '@/lib/api/endpoints'
import { queryKeys } from '@/lib/api/query-keys'

export function useSnippets(filters: Partial<SnippetFilters> = {}) {
  return useQuery({
    queryKey: queryKeys.snippets.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters.language) params.set('language', filters.language)
      if (filters.sort) params.set('sort', filters.sort)
      if (filters.cursor) params.set('cursor', filters.cursor)
      if (filters.limit) params.set('limit', String(filters.limit))

      const url = `${ENDPOINTS.SNIPPETS.LIST}?${params.toString()}`
      return apiClient.get<Snippet[]>(url)
    },
  })
}
