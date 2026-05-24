import type { FastifyInstance } from 'fastify'
import { ExecuteRequestSchema } from '@coderank/types'
import { ExecuteService } from './execute.service'
import { apiSuccess } from '@/common/utils/response'
import { optionalAuth } from '@/common/middleware/auth.middleware'

export async function executeRoutes(app: FastifyInstance) {
  const service = new ExecuteService(app.redis)

  // POST /execute — submit code for execution
  app.post('/execute', {
    preHandler: [optionalAuth],
    handler: async (request, reply) => {
      const body = ExecuteRequestSchema.parse(request.body)
      const result = await service.submit(body)
      return reply.status(202).send(apiSuccess(result))
    },
  })

  // GET /execute/:jobId — poll for result
  app.get<{ Params: { jobId: string } }>('/execute/:jobId', {
    handler: async (request, reply) => {
      const { jobId } = request.params
      const result = await service.getResult(jobId)
      return reply.send(apiSuccess(result))
    },
  })
}
