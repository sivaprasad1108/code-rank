import type { ApiResponse } from '@coderank/types'

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? ''

  const res = await fetch(`${apiBase}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include',
    ...options,
  })

  const json = (await res.json()) as ApiResponse<T>

  if (!json.success) {
    throw new ApiError(json.error.code, json.error.message, res.status)
  }

  return json.data
}

export const apiClient = {
  get: <T>(url: string, options?: RequestInit) =>
    request<T>(url, { method: 'GET', ...options }),

  post: <T>(url: string, body?: unknown, options?: RequestInit) =>
    request<T>(url, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...options,
    }),

  put: <T>(url: string, body?: unknown, options?: RequestInit) =>
    request<T>(url, {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...options,
    }),

  patch: <T>(url: string, body?: unknown, options?: RequestInit) =>
    request<T>(url, {
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...options,
    }),

  delete: <T>(url: string, options?: RequestInit) =>
    request<T>(url, { method: 'DELETE', ...options }),
}
