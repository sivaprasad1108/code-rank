import { z } from 'zod'

export const PublicUserSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  avatarUrl: z.string().url().nullable(),
  bio: z.string().nullable(),
  /** Contextual — only present when the request is authenticated */
  followedByMe: z.boolean().optional(),
})

export const UserSchema = PublicUserSchema.extend({
  email: z.string().email(),
  createdAt: z.string().datetime(),
})

export const CreateUserSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-zA-Z0-9_-]+$/, 'Only letters, numbers, underscores and hyphens allowed'),
  email: z.string().email(),
  password: z.string().min(8).max(128),
})

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const UpdateProfileSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-zA-Z0-9_-]+$/)
    .optional(),
  bio: z.string().max(500).nullable().optional(),
})

export type PublicUser = z.infer<typeof PublicUserSchema>
export type User = z.infer<typeof UserSchema>
export type CreateUser = z.infer<typeof CreateUserSchema>
export type Login = z.infer<typeof LoginSchema>
export type UpdateProfile = z.infer<typeof UpdateProfileSchema>
