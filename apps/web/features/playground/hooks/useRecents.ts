'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { apiClient } from '@/lib/api/client'
import { ENDPOINTS } from '@/lib/api/endpoints'
import { queryKeys } from '@/lib/api/query-keys'
import { useRecentsStore } from '../store/recents.store'
import type { RecentItem } from '../store/recents.store'

interface ApiRecentItem {
  id: string
  title: string
  language: string
  code: string
  createdAt: string
}

function toRecentItem(r: ApiRecentItem): RecentItem {
  return { id: r.id, title: r.title, language: r.language, code: r.code, timestamp: new Date(r.createdAt).getTime() }
}

export function useRecents() {
  const { user } = useAuth()
  const qc = useQueryClient()

  // localStorage store (always subscribed — hooks must be unconditional)
  const localRecents       = useRecentsStore((s) => s.recents)
  const localAddRecent     = useRecentsStore((s) => s.addRecent)
  const localRemoveRecent  = useRecentsStore((s) => s.removeRecent)
  const localUpdateRecent  = useRecentsStore((s) => s.updateRecent)

  // API query (disabled when not logged in)
  const apiQuery = useQuery<RecentItem[]>({
    queryKey: queryKeys.recents(),
    queryFn: async () => {
      const rows = await apiClient.get<ApiRecentItem[]>(ENDPOINTS.PLAYGROUND.RECENTS)
      return rows.map(toRecentItem)
    },
    enabled: !!user,
    staleTime: 30_000,
  })

  const addMutation = useMutation({
    mutationFn: ({ language, code }: { language: string; code: string }) =>
      apiClient.post<ApiRecentItem>(ENDPOINTS.PLAYGROUND.RECENTS, { language, code }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.recents() }),
  })

  const removeMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete<{ ok: boolean }>(ENDPOINTS.PLAYGROUND.RECENT(id)),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: queryKeys.recents() })
      const prev = qc.getQueryData<RecentItem[]>(queryKeys.recents())
      qc.setQueryData<RecentItem[]>(queryKeys.recents(), (old) => (old ?? []).filter((r) => r.id !== id))
      return { prev }
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(queryKeys.recents(), ctx.prev)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      apiClient.patch<ApiRecentItem>(ENDPOINTS.PLAYGROUND.RECENT(id), { title }),
    onMutate: async ({ id, title }) => {
      await qc.cancelQueries({ queryKey: queryKeys.recents() })
      const prev = qc.getQueryData<RecentItem[]>(queryKeys.recents())
      qc.setQueryData<RecentItem[]>(queryKeys.recents(), (old) =>
        (old ?? []).map((r) => r.id === id ? { ...r, title } : r),
      )
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(queryKeys.recents(), ctx.prev)
    },
  })

  if (user) {
    return {
      recents:      apiQuery.data ?? [],
      isLoading:    apiQuery.isLoading,
      addRecent:    (language: string, code: string) => addMutation.mutate({ language, code }),
      removeRecent: (id: string) => removeMutation.mutate(id),
      updateRecent: (id: string, title: string) => updateMutation.mutate({ id, title }),
    }
  }

  return {
    recents:      localRecents,
    isLoading:    false,
    addRecent:    localAddRecent,
    removeRecent: localRemoveRecent,
    updateRecent: localUpdateRecent,
  }
}
