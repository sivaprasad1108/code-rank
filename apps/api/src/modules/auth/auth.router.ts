import type { FastifyInstance } from 'fastify'
import { CreateUserSchema, LoginSchema } from '@coderank/types'
import { AuthService } from './auth.service'
import { apiSuccess } from '@/common/utils/response'
import { requireAuth } from '@/common/middleware/auth.middleware'

export async function authRoutes(app: FastifyInstance) {
  const service = new AuthService(app)

  // POST /auth/register
  app.post('/auth/register', {
    handler: async (request, reply) => {
      const body = CreateUserSchema.parse(request.body)
      const { user, token } = await service.register(body)
      reply.setCookie('token', token, { httpOnly: true, path: '/', sameSite: 'lax', secure: process.env.NODE_ENV === 'production' })
      return reply.status(201).send(apiSuccess(user))
    },
  })

  // POST /auth/login
  app.post('/auth/login', {
    handler: async (request, reply) => {
      const body = LoginSchema.parse(request.body)
      const { user, token } = await service.login(body)
      reply.setCookie('token', token, { httpOnly: true, path: '/', sameSite: 'lax', secure: process.env.NODE_ENV === 'production' })
      return reply.send(apiSuccess(user))
    },
  })

  // POST /auth/logout
  app.post('/auth/logout', {
    handler: async (_request, reply) => {
      reply.clearCookie('token', { path: '/' })
      return reply.send(apiSuccess({ ok: true }))
    },
  })

  // GET /auth/me
  app.get('/auth/me', {
    preHandler: [requireAuth],
    handler: async (request, reply) => {
      const payload = request.user as { sub: string }
      const user = await service.me(payload.sub)
      return reply.send(apiSuccess(user))
    },
  })
}
