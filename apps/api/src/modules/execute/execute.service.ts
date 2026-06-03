import { Queue } from 'bullmq'
import IORedis from 'ioredis'
import { randomUUID } from 'crypto'
import type { ExecuteRequest, ExecuteResult } from '@coderank/types'
import { RUNNER_REGISTRY } from '@/engine/runner.registry'
import { ValidationError, NotFoundError } from '@/common/errors/AppError'

const QUEUE_NAME = 'code-execution'
const RESULT_TTL_SECONDS = 300  // 5 minutes — must match worker TTL

export class ExecuteService {
  private queue: Queue

  constructor(
    private redis: IORedis,
    redisUrl: string,
  ) {
    // BullMQ needs its own connection with maxRetriesPerRequest: null
    const connection = new IORedis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    })
    this.queue = new Queue(QUEUE_NAME, { connection })
  }

  async submit(request: ExecuteRequest): Promise<{ jobId: string }> {
    if (!RUNNER_REGISTRY[request.language]) {
      throw new ValidationError(`Language '${request.language}' is not supported`)
    }

    const jobId = randomUUID()

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
