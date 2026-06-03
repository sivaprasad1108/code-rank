import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface RecentItem {
  id:        string
  title:     string
  language:  string
  code:      string
  timestamp: number
}

const MAX_RECENTS = 10

function nextSnippetTitle(existing: { title: string }[]): string {
  const maxN = existing.reduce((max, r) => {
    const m = r.title.match(/^Snippet #(\d+)$/)
    return m ? Math.max(max, parseInt(m[1], 10)) : max
  }, 0)
  return `Snippet #${maxN + 1}`
}

interface RecentsState {
  recents:      RecentItem[]
  addRecent:    (language: string, code: string) => void
  removeRecent: (id: string) => void
  updateRecent: (id: string, title: string) => void
}

export const useRecentsStore = create<RecentsState>()(
  persist(
    (set) => ({
      recents: [],

      addRecent: (language, code) => {
        if (!code.trim()) return
        set((s) => {
          const duplicate = s.recents.find(
            (r) => r.language === language && r.code.trim() === code.trim(),
          )
          const filtered = s.recents.filter(
            (r) => !(r.language === language && r.code.trim() === code.trim()),
          )
          // Preserve existing title (and id) so renames survive re-runs
          const title = duplicate?.title ?? nextSnippetTitle(filtered)
          const id    = duplicate?.id    ?? Date.now().toString()
          return {
            recents: [
              { id, title, language, code, timestamp: Date.now() },
              ...filtered,
            ].slice(0, MAX_RECENTS),
          }
        })
      },

      removeRecent: (id) =>
        set((s) => ({ recents: s.recents.filter((r) => r.id !== id) })),

      updateRecent: (id, title) =>
        set((s) => {
          const duplicate = s.recents.some(
            (r) => r.id !== id && r.title.toLowerCase() === title.toLowerCase(),
          )
          if (duplicate) return s
          return { recents: s.recents.map((r) => r.id === id ? { ...r, title } : r) }
        }),
    }),
    { name: 'coderank_recents' },
  ),
)
