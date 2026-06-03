import type { SnippetFilters } from '@coderank/types'

export const queryKeys = {
  snippets: {
    all: () => ['snippets'] as const,
    list: (filters: Partial<SnippetFilters>) => ['snippets', 'list', filters] as const,
    detail: (slug: string) => ['snippets', 'detail', slug] as const,
    comments: (slug: string) => ['snippets', slug, 'comments'] as const,
  },
  feed: (cursor?: string) => ['feed', cursor] as const,
  profile: (username: string) => ['profile', username] as const,
  profileSnippets: (username: string) => ['profile', username, 'snippets'] as const,
  me: () => ['me'] as const,
  execution: (jobId: string) => ['execution', jobId] as const,
  recents: () => ['playground', 'recents'] as const,
  collections: () => ['playground', 'collections'] as const,
} as const
