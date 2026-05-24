import { z } from 'zod'

export const PaginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
})

export const ApiSuccessSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    meta: z
      .object({
        cursor: z.string().optional(),
        total: z.number().optional(),
      })
      .optional(),
  })

export const ApiErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
})

export type Pagination = z.infer<typeof PaginationSchema>
export type ApiError = z.infer<typeof ApiErrorSchema>
export type ApiResponse<T> =
  | { success: true; data: T; meta?: { cursor?: string; total?: number } }
  | { success: false; error: { code: string; message: string } }
