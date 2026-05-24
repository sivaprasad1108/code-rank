import { Queue } from 'bullmq'
import type Redis from 'ioredis'
import { randomUUID } from 'crypto'
import type { ExecuteRequest, ExecuteResult } from '@coderank/types'
import { RUNNER_REGISTRY } from '@/engine/runner.registry'
import { ValidationError, NotFoundError } from '@/common/errors/AppError'

const QUEUE_NAME = 'code-execution'
const RESULT_TTL_SECONDS = 120

export class ExecuteService {
  private queue: Queue

  constructor(private redis: Redis) {
    this.queue = new Queue(QUEUE_NAME, {
      connection: redis as ConstructorParameters<typeof Queue>[1] extends { connection: infer C } ? C : never,
    })
  }

  async submit(request: ExecuteRequest): Promise<{ jobId: string }> {
    if (!RUNNER_REGISTRY[request.language]) {
      throw new ValidationError(`Language '${request.language}' is not supported`)
    }

    const jobId = randomUUID()

    // Store initial pending status
    await this.redis.set(
      `exec:${jobId}`,
      JSON.stringify({ jobId, status: 'pending' }),
      'EX',
      RESULT_TTL_SECONDS,
    )

    await this.queue.add('run', { jobId, ...request }, { jobId, removeOnComplete: true })

    return { jobId }
  }

  async getResult(jobId: string): Promise<ExecuteResult> {
    const raw = await this.redis.get(`exec:${jobId}`)
    if (!raw) throw new NotFoundError('Execution result')

    return JSON.parse(raw) as ExecuteResult
  }
}
