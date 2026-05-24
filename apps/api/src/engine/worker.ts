import { Worker } from 'bullmq'
import IORedis from 'ioredis'
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

export function createExecutionWorker(redisUrl: string, appRedis: IORedis): Worker {
  // BullMQ requires maxRetriesPerRequest: null — use a dedicated connection
  const connection = new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  })

  const docker = new DockerService()

  // Pull all runner images at startup (non-blocking — don't await)
  Promise.allSettled(
    Object.values(RUNNER_REGISTRY).map(async (runner) => {
      try {
        await docker.ensureImage(runner.dockerImage)
        console.log(`[worker] image ready: ${runner.dockerImage}`)
      } catch (err) {
        console.warn(`[worker] failed to pull ${runner.dockerImage}:`, err)
      }
    }),
  ).then(() => {
    console.log('[worker] image pre-pull complete')
  })

  const worker = new Worker<ExecutionJob>(
    QUEUE_NAME,
    async (job) => {
      const { jobId, language, code, stdin } = job.data

      // Mark as running
      await appRedis.set(
        `exec:${jobId}`,
        JSON.stringify({ jobId, status: 'running' }),
        'EX',
        RESULT_TTL_SECONDS,
      )

      const runner = RUNNER_REGISTRY[language]
      if (!runner) {
        throw new Error(`Unsupported language: ${language}`)
      }

      // Ensure image is available (pulls if needed)
      await docker.ensureImage(runner.dockerImage)

      const result = await docker.runContainer(runner, code, stdin, jobId)

      const status = result.stderr.includes('[Timed out]')
        ? 'timeout'
        : result.exitCode === 0
        ? 'success'
        : 'error'

      await appRedis.set(
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
    { connection, concurrency: 5 },
  )

  worker.on('failed', async (job, err) => {
    if (!job) return
    await appRedis.set(
      `exec:${job.data.jobId}`,
      JSON.stringify({ jobId: job.data.jobId, status: 'error', stderr: err.message }),
      'EX',
      RESULT_TTL_SECONDS,
    )
  })

  return worker
}
