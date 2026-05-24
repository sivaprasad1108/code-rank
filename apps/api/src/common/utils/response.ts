export function apiSuccess<T>(data: T, meta?: { cursor?: string; total?: number }) {
  return {
    success: true as const,
    data,
    ...(meta ? { meta } : {}),
  }
}

export function apiError(code: string, message: string) {
  return {
    success: false as const,
    error: { code, message },
  }
}
