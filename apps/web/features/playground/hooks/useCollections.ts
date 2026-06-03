'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { apiClient } from '@/lib/api/client'
import { ENDPOINTS } from '@/lib/api/endpoints'
import { queryKeys } from '@/lib/api/query-keys'
import { useCollectionsStore } from '../store/collections.store'
import type { Collection, CollectionItem } from '../store/collections.store'

interface ApiCollectionItem {
  id: string
  title: string
  language: string
  code: string
  createdAt: string
}

interface ApiCollection {
  id: string
  name: string
  createdAt: string
  items: ApiCollectionItem[]
}

function toCollection(c: ApiCollection): Collection {
  return {
    id:        c.id,
    name:      c.name,
    createdAt: new Date(c.createdAt).getTime(),
    items:     (c.items ?? []).map((i) => ({ id: i.id, title: i.title, language: i.language, code: i.code })),
  }
}

export function useCollections() {
  const { user } = useAuth()
  const qc = useQueryClient()

  // localStorage store (always subscribed — hooks must be unconditional)
  const localCollections              = useCollectionsStore((s) => s.collections)
  const localCreateCollection         = useCollectionsStore((s) => s.createCollection)
  const localDeleteCollection         = useCollectionsStore((s) => s.deleteCollection)
  const localAddToCollection          = useCollectionsStore((s) => s.addToCollection)
  const localRemoveFromCollection     = useCollectionsStore((s) => s.removeFromCollection)
  const localUpdateCollectionItem     = useCollectionsStore((s) => s.updateCollectionItem)

  // API query (disabled when not logged in)
  const apiQuery = useQuery<Collection[]>({
    queryKey: queryKeys.collections(),
    queryFn: async () => {
      const rows = await apiClient.get<ApiCollection[]>(ENDPOINTS.PLAYGROUND.COLLECTIONS)
      return rows.map(toCollection)
    },
    enabled: !!user,
    staleTime: 30_000,
  })

  const createMutation = useMutation({
    mutationFn: (name: string) =>
      apiClient.post<ApiCollection>(ENDPOINTS.PLAYGROUND.COLLECTIONS, { name }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.collections() }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient.delete<{ ok: boolean }>(ENDPOINTS.PLAYGROUND.COLLECTION(id)),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: queryKeys.collections() })
      const prev = qc.getQueryData<Collection[]>(queryKeys.collections())
      qc.setQueryData<Collection[]>(queryKeys.collections(), (old) => (old ?? []).filter((c) => c.id !== id))
      return { prev }
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(queryKeys.collections(), ctx.prev)
    },
  })

  const addItemMutation = useMutation({
    mutationFn: ({ collectionId, language, code, title }: { collectionId: string; language: string; code: string; title?: string }) =>
      apiClient.post<ApiCollectionItem>(ENDPOINTS.PLAYGROUND.COLLECTION_ITEMS(collectionId), { language, code, title }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.collections() }),
  })

  const updateItemMutation = useMutation({
    mutationFn: ({ collectionId, itemId, title }: { collectionId: string; itemId: string; title: string }) =>
      apiClient.patch<ApiCollectionItem>(ENDPOINTS.PLAYGROUND.COLLECTION_ITEM(collectionId, itemId), { title }),
    onMutate: async ({ collectionId, itemId, title }) => {
      await qc.cancelQueries({ queryKey: queryKeys.collections() })
      const prev = qc.getQueryData<Collection[]>(queryKeys.collections())
      qc.setQueryData<Collection[]>(queryKeys.collections(), (old) =>
        (old ?? []).map((c) =>
          c.id !== collectionId ? c : {
            ...c,
            items: c.items.map((i: CollectionItem) => i.id === itemId ? { ...i, title } : i),
          },
        ),
      )
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(queryKeys.collections(), ctx.prev)
    },
  })

  const removeItemMutation = useMutation({
    mutationFn: ({ collectionId, itemId }: { collectionId: string; itemId: string }) =>
      apiClient.delete<{ ok: boolean }>(ENDPOINTS.PLAYGROUND.COLLECTION_ITEM(collectionId, itemId)),
    onMutate: async ({ collectionId, itemId }) => {
      await qc.cancelQueries({ queryKey: queryKeys.collections() })
      const prev = qc.getQueryData<Collection[]>(queryKeys.collections())
      qc.setQueryData<Collection[]>(queryKeys.collections(), (old) =>
        (old ?? []).map((c) =>
          c.id !== collectionId ? c : { ...c, items: c.items.filter((i: CollectionItem) => i.id !== itemId) },
        ),
      )
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(queryKeys.collections(), ctx.prev)
    },
  })

  if (user) {
    return {
      collections:          apiQuery.data ?? [],
      isLoading:            apiQuery.isLoading,
      createCollection:     (name: string) => createMutation.mutate(name),
      deleteCollection:     (id: string) => deleteMutation.mutate(id),
      addToCollection:      (collectionId: string, language: string, code: string, title?: string) =>
        addItemMutation.mutate({ collectionId, language, code, title }),
      removeFromCollection:   (collectionId: string, itemId: string) =>
        removeItemMutation.mutate({ collectionId, itemId }),
      updateCollectionItem:   (collectionId: string, itemId: string, title: string) =>
        updateItemMutation.mutate({ collectionId, itemId, title }),
    }
  }

  return {
    collections:            localCollections,
    isLoading:              false,
    createCollection:       localCreateCollection,
    deleteCollection:       localDeleteCollection,
    addToCollection:        localAddToCollection,
    removeFromCollection:   localRemoveFromCollection,
    updateCollectionItem:   localUpdateCollectionItem,
  }
}
