import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Comment } from '@coderank/types'
import { apiClient } from '@/lib/api/client'
import { ENDPOINTS } from '@/lib/api/endpoints'
import { queryKeys } from '@/lib/api/query-keys'

export function useComments(snippetSlug: string) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: queryKeys.snippets.comments(snippetSlug),
    queryFn: () => apiClient.get<Comment[]>(ENDPOINTS.SNIPPETS.COMMENTS_LIST(snippetSlug)),
    enabled: !!snippetSlug,
  })

  const addComment = useMutation({
    mutationFn: (body: { body: string; parentId?: string }) =>
      apiClient.post<Comment>(ENDPOINTS.SNIPPETS.COMMENTS_CREATE(snippetSlug), body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.snippets.comments(snippetSlug) })
    },
  })

  const deleteComment = useMutation({
    mutationFn: (commentId: string) =>
      apiClient.delete<void>(ENDPOINTS.COMMENTS.DELETE(commentId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.snippets.comments(snippetSlug) })
    },
  })

  return { ...query, addComment, deleteComment }
}
