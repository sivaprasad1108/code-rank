'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { User } from '@coderank/types'
import { apiClient } from '@/lib/api/client'
import { ENDPOINTS } from '@/lib/api/endpoints'
import { queryKeys } from '@/lib/api/query-keys'

export function useAuth() {
  const queryClient = useQueryClient()

  const { data: user, isLoading } = useQuery({
    queryKey: queryKeys.me(),
    queryFn: async (): Promise<User | null> => {
      try {
        return await apiClient.get<User>(ENDPOINTS.AUTH.ME)
      } catch {
        return null
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  })

  const logout = useMutation({
    mutationFn: () => apiClient.post<void>(ENDPOINTS.AUTH.LOGOUT),
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.me(), null)
      queryClient.clear()
    },
  })

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
    logout: () => logout.mutate(),
  }
}
