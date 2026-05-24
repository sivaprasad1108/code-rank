import 'dotenv/config'
import Fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import fastifyCors from '@fastify/cors'
import fastifyHelmet from '@fastify/helmet'
import fastifyRateLimit from '@fastify/rate-limit'
import { Redis } from 'ioredis'

import { errorHandler } from '@/common/errors/error-handler'
import { authRoutes } from '@/modules/auth/auth.router'
import { executeRoutes } from '@/modules/execute/execute.router'
import { snippetRoutes } from '@/modules/snippets/snippets.router'
import { userRoutes } from '@/modules/users/users.router'
import { createExecutionWorker } from '@/engine/worker'
import { apiSuccess } from '@/common/utils/response'

const PORT = Number(process.env.PORT ?? 3001)

async function buildApp() {
  const app = Fastify({
    logger: { level: process.env.NODE_ENV === 'production' ? 'warn' : 'info' },
  })

  // Redis
  const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379')
  app.decorate('redis', redis)

  // Plugins
  await app.register(fastifyCookie)
  await app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
    cookie: { cookieName: 'token', signed: false },
  })
  await app.register(fastifyCors, {
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  })
  await app.register(fastifyHelmet, { contentSecurityPolicy: false })
  await app.register(fastifyRateLimit, {
    max: 100,
    timeWindow: '1 minute',
    redis,
  })

  // Global error handler
  app.setErrorHandler(errorHandler)

  // Routes
  await app.register(async (api) => {
    await api.register(authRoutes)
    await api.register(executeRoutes)
    await api.register(snippetRoutes)
    await api.register(userRoutes)

    // Health check
    api.get('/health', async (_req, reply) => {
      return reply.send(apiSuccess({ status: 'ok', timestamp: new Date().toISOString() }))
    })
  }, { prefix: '/api/v1' })

  return app
}

async function start() {
  const app = await buildApp()

  // Start execution worker
  const redis = app.redis as Redis
  createExecutionWorker(redis)

  try {
    await app.listen({ port: PORT, host: '0.0.0.0' })
    console.log(`[api] listening on port ${PORT}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

// Type augmentation for Fastify
declare module 'fastify' {
  interface FastifyInstance {
    redis: Redis
  }
}

start()
