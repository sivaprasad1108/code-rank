import 'dotenv/config'
import Fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import fastifyCors from '@fastify/cors'
import fastifyHelmet from '@fastify/helmet'
import fastifyRateLimit from '@fastify/rate-limit'
import { Redis } from 'ioredis'
import { db } from '@/db/client'
import { sql } from 'drizzle-orm'

import { errorHandler } from '@/common/errors/error-handler'
import { authRoutes } from '@/modules/auth/auth.router'
import { executeRoutes } from '@/modules/execute/execute.router'
import { snippetRoutes } from '@/modules/snippets/snippets.router'
import { userRoutes } from '@/modules/users/users.router'
import { createExecutionWorker } from '@/engine/worker'
import { apiSuccess, apiError } from '@/common/utils/response'

const PORT = Number(process.env.PORT ?? 3001)

// ── Startup validation ─────────────────────────────────────────────────────────
function validateEnv() {
  const required: string[] = ['DATABASE_URL', 'REDIS_URL']
  const missing = required.filter((k) => !process.env[k])
  if (missing.length) {
    console.error(`[startup] Missing required environment variables: ${missing.join(', ')}`)
    process.exit(1)
  }

  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[startup] JWT_SECRET must be set in production')
      process.exit(1)
    }
    console.warn('[startup] JWT_SECRET not set — using insecure default (development only)')
  } else if (jwtSecret.length < 32) {
    console.warn('[startup] JWT_SECRET is shorter than 32 characters — use a longer secret in production')
  }
}

async function buildApp() {
  validateEnv()

  const app = Fastify({
    logger: { level: process.env.LOG_LEVEL ?? (process.env.NODE_ENV === 'production' ? 'warn' : 'info') },
  })

  // Redis
  const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379')
  app.decorate('redis', redis)

  // Plugins
  await app.register(fastifyCookie)
  await app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET ?? 'dev-secret-change-in-env',
    cookie: { cookieName: 'token', signed: false },
  })
  await app.register(fastifyCors, {
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  })
  await app.register(fastifyHelmet, { contentSecurityPolicy: false })

  // Global rate limit — covers all routes as a baseline
  await app.register(fastifyRateLimit, {
    max: 100,
    timeWindow: '1 minute',
    redis,
    keyGenerator: (request) => request.ip,
  })

  // Global error handler
  app.setErrorHandler(errorHandler)

  // Routes
  await app.register(async (api) => {
    await api.register(authRoutes)
    await api.register(executeRoutes)
    await api.register(snippetRoutes)
    await api.register(userRoutes)

    // Health check — verifies database and Redis connectivity
    api.get('/health', async (_req, reply) => {
      const checks: Record<string, string> = {}
      let healthy = true

      try {
        await db.execute(sql`SELECT 1`)
        checks.database = 'ok'
      } catch {
        checks.database = 'error'
        healthy = false
      }

      try {
        await (_req.server.redis as Redis).ping()
        checks.redis = 'ok'
      } catch {
        checks.redis = 'error'
        healthy = false
      }

      const status = healthy ? 200 : 503
      return reply.status(status).send(
        healthy
          ? apiSuccess({ status: 'ok', checks, timestamp: new Date().toISOString() })
          : apiError('SERVICE_UNAVAILABLE', 'One or more dependencies are unhealthy'),
      )
    })
  }, { prefix: '/api/v1' })

  return app
}

async function start() {
  const app = await buildApp()

  // Start execution worker with its own BullMQ-compatible Redis connection
  const redis = app.redis as Redis
  const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379'
  createExecutionWorker(redisUrl, redis)

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
