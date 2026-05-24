import type { FastifyRequest, FastifyReply } from 'fastify'
import { UnauthorizedError } from '@/common/errors/AppError'

/**
 * Verifies the JWT from the Authorization header or cookie.
 * Attaches the decoded payload as `request.user`.
 * Use as a preHandler on routes that require authentication.
 */
export async function requireAuth(request: FastifyRequest, _reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch {
    throw new UnauthorizedError()
  }
}

/**
 * Optionally verifies a JWT. If present and valid, `request.user` is set.
 * If absent or invalid, the request continues without a user.
 */
export async function optionalAuth(request: FastifyRequest, _reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch {
    // Not authenticated — that's fine for this handler
  }
}
