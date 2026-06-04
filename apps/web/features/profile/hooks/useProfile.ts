import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { PublicUser, Snippet, FollowResponse } from '@coderank/types'
import { apiClient } from '@/lib/api/client'
import { ENDPOINTS } from '@/lib/api/endpoints'
import { queryKeys } from '@/lib/api/query-keys'

export function useProfile(username: string) {
  const queryClient = useQueryClient()

  const profileQuery = useQuery({
    queryKey: queryKeys.profile(username),
    queryFn: () => apiClient.get<PublicUser>(ENDPOINTS.USERS.PROFILE(username)),
    enabled: !!username,
  })

  const snippetsQuery = useQuery({
    queryKey: queryKeys.profileSnippets(username),
    queryFn: () => apiClient.get<Snippet[]>(ENDPOINTS.USERS.SNIPPETS(username)),
    enabled: !!username,
  })

  const follow = useMutation({
    mutationFn: () => apiClient.post<FollowResponse>(ENDPOINTS.USERS.FOLLOW(username)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile(username) })
    },
  })

  return {
    profile: profileQuery.data,
    snippets: snippetsQuery.data ?? [],
    isLoading: profileQuery.isLoading,
    isSnippetsLoading: snippetsQuery.isLoading,
    follow: () => follow.mutate(),
    isFollowPending: follow.isPending,
  }
}
