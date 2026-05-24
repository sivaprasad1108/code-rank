import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Snippet, StarResponse } from '@coderank/types'
import { apiClient } from '@/lib/api/client'
import { ENDPOINTS } from '@/lib/api/endpoints'
import { queryKeys } from '@/lib/api/query-keys'

export function useStarSnippet(slug: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      return apiClient.post<StarResponse>(ENDPOINTS.SNIPPETS.STAR(slug))
    },
    onMutate: async () => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: queryKeys.snippets.detail(slug) })
      const prev = queryClient.getQueryData<Snippet>(queryKeys.snippets.detail(slug))

      if (prev) {
        queryClient.setQueryData<Snippet>(queryKeys.snippets.detail(slug), {
          ...prev,
          starredByMe: !prev.starredByMe,
          starsCount: prev.starredByMe ? prev.starsCount - 1 : prev.starsCount + 1,
        })
      }

      return { prev }
    },
    onError: (_err, _vars, context) => {
      // Rollback optimistic update
      if (context?.prev) {
        queryClient.setQueryData(queryKeys.snippets.detail(slug), context.prev)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.snippets.detail(slug) })
    },
  })
}
