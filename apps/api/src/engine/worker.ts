import { Worker } from 'bullmq'
import type Redis from 'ioredis'
import { RUNNER_REGISTRY } from './runner.registry'
import { DockerService } from './docker.service'

const QUEUE_NAME = 'code-execution'
const RESULT_TTL_SECONDS = 120

interface ExecutionJob {
  jobId: string
  language: string
  code: string
  stdin?: string
}

export function createExecutionWorker(redis: Redis): Worker {
  const docker = new DockerService()

  const worker = new Worker<ExecutionJob>(
    QUEUE_NAME,
    async (job) => {
      const { jobId, language, code, stdin } = job.data

      // Mark as running
      await redis.set(
        `exec:${jobId}`,
        JSON.stringify({ jobId, status: 'running' }),
        'EX',
        RESULT_TTL_SECONDS,
      )

      const runner = RUNNER_REGISTRY[language]
      if (!runner) {
        throw new Error(`Unsupported language: ${language}`)
      }

      const result = await docker.runContainer(runner, code, stdin, jobId)

      const status =
        result.stderr.includes('[Timed out]')
          ? 'timeout'
          : result.exitCode === 0
          ? 'success'
          : 'error'

      await redis.set(
        `exec:${jobId}`,
        JSON.stringify({
          jobId,
          status,
          stdout: result.stdout,
          stderr: result.stderr,
          exitCode: result.exitCode,
          executionTimeMs: result.executionTimeMs,
        }),
        'EX',
        RESULT_TTL_SECONDS,
      )
    },
    {
      connection: redis as ConstructorParameters<typeof Worker>[2] extends { connection: infer C } ? C : never,
      concurrency: 5,
    },
  )

  worker.on('failed', async (job, err) => {
    if (!job) return
    const { jobId } = job.data
    await redis.set(
      `exec:${jobId}`,
      JSON.stringify({
        jobId,
        status: 'error',
        stderr: err.message,
      }),
      'EX',
      RESULT_TTL_SECONDS,
    )
  })

  return worker
}
