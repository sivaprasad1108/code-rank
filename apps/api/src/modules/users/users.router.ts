import type { FastifyInstance } from 'fastify'
import { UpdateProfileSchema } from '@coderank/types'
import { UsersService } from './users.service'
import { apiSuccess } from '@/common/utils/response'
import { requireAuth, optionalAuth } from '@/common/middleware/auth.middleware'

export async function userRoutes(app: FastifyInstance) {
  const service = new UsersService()

  // GET /users/:username
  app.get<{ Params: { username: string } }>('/users/:username', {
    preHandler: [optionalAuth],
    handler: async (request, reply) => {
      const viewerId = (request.user as { sub?: string } | undefined)?.sub
      const profile = await service.getProfile(request.params.username, viewerId)
      return reply.send(apiSuccess(profile))
    },
  })

  // GET /users/:username/snippets
  app.get<{ Params: { username: string } }>('/users/:username/snippets', {
    handler: async (request, reply) => {
      const snippets = await service.getUserSnippets(request.params.username)
      return reply.send(apiSuccess(snippets))
    },
  })

  // POST /users/:username/follow
  app.post<{ Params: { username: string } }>('/users/:username/follow', {
    preHandler: [requireAuth],
    handler: async (request, reply) => {
      const followerId = (request.user as { sub: string }).sub
      const result = await service.toggleFollow(followerId, request.params.username)
      return reply.send(apiSuccess(result))
    },
  })

  // PATCH /users/me
  app.patch('/users/me', {
    preHandler: [requireAuth],
    handler: async (request, reply) => {
      const userId = (request.user as { sub: string }).sub
      const body = UpdateProfileSchema.parse(request.body)
      const user = await service.updateMe(userId, { username: body.username, bio: body.bio })
      return reply.send(apiSuccess(user))
    },
  })
}
