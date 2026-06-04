import { z } from 'zod'
import { PublicUserSchema } from './user.schema'
import { SUPPORTED_LANGUAGES } from './execution.schema'

export const SnippetSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  title: z.string().max(255),
  description: z.string().max(1000).nullable(),
  language: z.enum(SUPPORTED_LANGUAGES),
  code: z.string(),
  isPublic: z.boolean(),
  starsCount: z.number().int().min(0),
  viewsCount: z.number().int().min(0),
  starredByMe: z.boolean().optional(),
  author: PublicUserSchema.nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const CreateSnippetSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  language: z.enum(SUPPORTED_LANGUAGES),
  code: z.string().min(1).max(65_536),
  isPublic: z.boolean().default(true),
})

export const UpdateSnippetSchema = CreateSnippetSchema.partial()

export const SnippetFiltersSchema = z.object({
  language: z.enum(SUPPORTED_LANGUAGES).optional(),
  sort: z.enum(['stars', 'recent', 'views']).default('recent'),
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).default(20),
})

export const CommentSchema = z.object({
  id: z.string().uuid(),
  snippetId: z.string().uuid(),
  author: PublicUserSchema,
  body: z.string(),
  parentId: z.string().uuid().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const CreateCommentSchema = z.object({
  body: z.string().min(1).max(2000),
  parentId: z.string().uuid().optional(),
})

export const StarResponseSchema = z.object({
  starred: z.boolean(),
  starsCount: z.number().int().min(0),
})

export const FollowResponseSchema = z.object({
  following: z.boolean(),
})

export type Snippet = z.infer<typeof SnippetSchema>
export type CreateSnippet = z.infer<typeof CreateSnippetSchema>
export type UpdateSnippet = z.infer<typeof UpdateSnippetSchema>
export type SnippetFilters = z.infer<typeof SnippetFiltersSchema>
export type Comment = z.infer<typeof CommentSchema>
export type CreateComment = z.infer<typeof CreateCommentSchema>
export type StarResponse = z.infer<typeof StarResponseSchema>
export type FollowResponse = z.infer<typeof FollowResponseSchema>
