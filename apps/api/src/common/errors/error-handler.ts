import type { FastifyError, FastifyRequest, FastifyReply } from 'fastify'
import { AppError } from './AppError'
import { apiError } from '@/common/utils/response'

export function errorHandler(
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  // Known application error
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send(apiError(error.code, error.message))
  }

  // Fastify validation error (body/params/query schema failure)
  if (error.validation) {
    return reply.status(422).send(
      apiError('VALIDATION_ERROR', error.message ?? 'Request validation failed'),
    )
  }

  // JWT error
  if (error.code === 'FST_JWT_BAD_REQUEST' || error.code === 'FST_JWT_AUTHORIZATION_TOKEN_INVALID') {
    return reply.status(401).send(apiError('UNAUTHORIZED', 'Invalid or expired token'))
  }

  // Unknown / unhandled — log with request context, never expose internals
  _request.log.error({ err: error }, '[unhandled error]')
  return reply.status(500).send(apiError('INTERNAL_ERROR', 'Internal server error'))
}
