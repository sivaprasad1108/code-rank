const BASE = '/api/v1'

export const ENDPOINTS = {
  AUTH: {
    REGISTER: `${BASE}/auth/register`,
    LOGIN: `${BASE}/auth/login`,
    LOGOUT: `${BASE}/auth/logout`,
    ME: `${BASE}/auth/me`,
    GITHUB: `${BASE}/auth/github`,
    GITHUB_CALLBACK: `${BASE}/auth/github/callback`,
  },
  EXECUTE: {
    SUBMIT: `${BASE}/execute`,
    RESULT: (jobId: string) => `${BASE}/execute/${jobId}`,
  },
  SNIPPETS: {
    LIST: `${BASE}/snippets`,
    CREATE: `${BASE}/snippets`,
    DETAIL: (slug: string) => `${BASE}/snippets/${slug}`,
    UPDATE: (slug: string) => `${BASE}/snippets/${slug}`,
    DELETE: (slug: string) => `${BASE}/snippets/${slug}`,
    STAR: (slug: string) => `${BASE}/snippets/${slug}/star`,
    COMMENTS_LIST: (slug: string) => `${BASE}/snippets/${slug}/comments`,
    COMMENTS_CREATE: (slug: string) => `${BASE}/snippets/${slug}/comments`,
  },
  COMMENTS: {
    DELETE: (id: string) => `${BASE}/comments/${id}`,
  },
  USERS: {
    PROFILE: (username: string) => `${BASE}/users/${username}`,
    SNIPPETS: (username: string) => `${BASE}/users/${username}/snippets`,
    FOLLOW: (username: string) => `${BASE}/users/${username}/follow`,
    ME: `${BASE}/users/me`,
  },
  PLAYGROUND: {
    RECENTS: `${BASE}/playground/recents`,
    RECENT: (id: string) => `${BASE}/playground/recents/${id}`,
    COLLECTIONS: `${BASE}/playground/collections`,
    COLLECTION: (id: string) => `${BASE}/playground/collections/${id}`,
    COLLECTION_ITEMS: (id: string) => `${BASE}/playground/collections/${id}/items`,
    COLLECTION_ITEM: (id: string, itemId: string) => `${BASE}/playground/collections/${id}/items/${itemId}`,
  },
} as const
