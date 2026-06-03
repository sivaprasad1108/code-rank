import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CollectionItem {
  id:       string
  title:    string
  language: string
  code:     string
}

export interface Collection {
  id:        string
  name:      string
  items:     CollectionItem[]
  createdAt: number
}

function extractTitle(code: string, language: string): string {
  const comment = code.match(/^(?:\/\/|#)\s*(.+)/m)
  if (comment?.[1]) return comment[1].trim().slice(0, 40)
  const fn = code.match(/(?:function\s+(\w+)|def\s+(\w+))/)
  const name = fn?.[1] ?? fn?.[2]
  if (name) return name
  return `${language} snippet`
}

interface CollectionsState {
  collections:          Collection[]
  createCollection:     (name: string) => void
  deleteCollection:     (id: string) => void
  addToCollection:      (collectionId: string, language: string, code: string, title?: string) => void
  removeFromCollection: (collectionId: string, itemId: string) => void
  updateCollectionItem: (collectionId: string, itemId: string, title: string) => void
}

export const useCollectionsStore = create<CollectionsState>()(
  persist(
    (set) => ({
      collections: [],

      createCollection: (name) => {
        const trimmed = name.trim()
        if (!trimmed) return
        set((s) => {
          const duplicate = s.collections.some(
            (c) => c.name.toLowerCase() === trimmed.toLowerCase(),
          )
          if (duplicate) return s
          return {
            collections: [
              ...s.collections,
              { id: Date.now().toString(), name: trimmed, items: [], createdAt: Date.now() },
            ],
          }
        })
      },

      deleteCollection: (id) =>
        set((s) => ({ collections: s.collections.filter((c) => c.id !== id) })),

      addToCollection: (collectionId, language, code, title) => {
        if (!code.trim()) return
        set((s) => ({
          collections: s.collections.map((c) =>
            c.id !== collectionId ? c : {
              ...c,
              items: [
                ...c.items.filter((i) => i.code.trim() !== code.trim()),
                {
                  id:       Date.now().toString(),
                  title:    title ?? extractTitle(code, language),
                  language,
                  code,
                },
              ],
            },
          ),
        }))
      },

      removeFromCollection: (collectionId, itemId) =>
        set((s) => ({
          collections: s.collections.map((c) =>
            c.id !== collectionId ? c : { ...c, items: c.items.filter((i) => i.id !== itemId) },
          ),
        })),

      updateCollectionItem: (collectionId, itemId, title) =>
        set((s) => ({
          collections: s.collections.map((c) => {
            if (c.id !== collectionId) return c
            const duplicate = c.items.some(
              (i) => i.id !== itemId && i.title.toLowerCase() === title.toLowerCase(),
            )
            if (duplicate) return c
            return { ...c, items: c.items.map((i) => i.id === itemId ? { ...i, title } : i) }
          }),
        })),
    }),
    { name: 'coderank_collections' },
  ),
)
