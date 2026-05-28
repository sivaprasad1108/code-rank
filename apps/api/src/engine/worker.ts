import { Worker } from 'bullmq'
import IORedis from 'ioredis'
import type { TestCase, TestCaseResult } from '@coderank/types'
import { RUNNER_REGISTRY } from './runner.registry'
import { DockerService } from './docker.service'

const QUEUE_NAME = 'code-execution'
const RESULT_TTL_SECONDS = 120
const CR_TIME_RE = /__CR_TIME__:(\d+)\n?/

/** Extract the algorithm-only execution time written by the driver harness */
function extractAlgoTime(stderr: string, fallbackMs: number): { algoTimeMs: number; cleanStderr: string } {
  const m = stderr.match(CR_TIME_RE)
  return {
    algoTimeMs:  m ? parseInt(m[1], 10) : fallbackMs,
    cleanStderr: stderr.replace(CR_TIME_RE, ''),
  }
}

interface ExecutionJob {
  jobId: string
  language: string
  code: string
  stdin?: string
  testCases?: TestCase[]
}

export function createExecutionWorker(redisUrl: string, appRedis: IORedis): Worker {
  const connection = new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  })

  const docker = new DockerService()

  // Pull all runner images at startup (non-blocking)
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
      const { jobId, language, code, stdin, testCases } = job.data

      await appRedis.set(
        `exec:${jobId}`,
        JSON.stringify({ jobId, status: 'running' }),
        'EX',
        RESULT_TTL_SECONDS,
      )

      const runner = RUNNER_REGISTRY[language]
      if (!runner) throw new Error(`Unsupported language: ${language}`)

      await docker.ensureImage(runner.dockerImage)

      // ── Multi test-case mode ────────────────────────────────────────────────
      if (testCases && testCases.length > 0) {
        const results: TestCaseResult[] = []

        for (let i = 0; i < testCases.length; i++) {
          const tc = testCases[i]

          // Parse stdin lines into typed args (e.g. "[1,3]" → [1,3])
          const stdinLines = (tc.stdin ?? '').trim().split('\n').filter(Boolean)
          const stdinArgs  = stdinLines.map((l) => { try { return JSON.parse(l) } catch { return l } })

          // Embed args directly in the code — avoids any stdin piping issues
          const runnableCode = runner.wrapWithDriver?.(code, stdinArgs) ?? code
          const stdinToPass  = runnableCode !== code ? undefined : (tc.stdin || undefined)

          const result = await docker.runContainer(runner, runnableCode, stdinToPass, `${jobId}-${i}`)

          const { algoTimeMs, cleanStderr } = extractAlgoTime(result.stderr, result.executionTimeMs)

          const rawStatus = cleanStderr.includes('[Timed out]')
            ? 'timeout'
            : result.exitCode === 0
            ? 'success'
            : 'error'

          let status: TestCaseResult['status'] = rawStatus
          let passed: boolean | undefined

          if (tc.expectedOutput !== undefined) {
            const actual = result.stdout.trimEnd()
            const expected = tc.expectedOutput.trimEnd()
            passed = actual === expected
            if (rawStatus === 'success' && !passed) status = 'wrong_answer'
          }

          results.push({
            index:           i,
            stdin:           tc.stdin ?? '',
            stdout:          result.stdout,
            stderr:          cleanStderr,
            exitCode:        result.exitCode,
            executionTimeMs: algoTimeMs,
            status,
            ...(passed !== undefined ? { passed } : {}),
          })
        }

        const passedCount = results.filter(
          (r) => r.status !== 'error' && r.status !== 'timeout' && r.status !== 'wrong_answer',
        ).length
        const overallStatus = results.some((r) => r.status === 'error' || r.status === 'timeout')
          ? 'error'
          : results.some((r) => r.status === 'wrong_answer')
          ? 'error'
          : 'success'

        await appRedis.set(
          `exec:${jobId}`,
          JSON.stringify({
            jobId,
            status: overallStatus,
            testCaseResults: results,
            passedCount,
            totalCount: results.length,
          }),
          'EX',
          RESULT_TTL_SECONDS,
        )
        return
      }

      // ── Single-run mode ──────────────────────────────────────────────────────
      // Still try the driver so timing markers are injected for pure functions
      const singleLines = (stdin ?? '').trim().split('\n').filter(Boolean)
      const singleArgs  = singleLines.map((l) => { try { return JSON.parse(l) } catch { return l } })
      const singleCode  = runner.wrapWithDriver?.(code, singleArgs) ?? code
      const singleStdin = singleCode !== code ? undefined : stdin

      const result = await docker.runContainer(runner, singleCode, singleStdin, jobId)

      const { algoTimeMs: singleAlgoMs, cleanStderr: singleStderr } =
        extractAlgoTime(result.stderr, result.executionTimeMs)

      const status = singleStderr.includes('[Timed out]')
        ? 'timeout'
        : result.exitCode === 0
        ? 'success'
        : 'error'

      await appRedis.set(
        `exec:${jobId}`,
        JSON.stringify({
          jobId,
          status,
          stdout:          result.stdout,
          stderr:          singleStderr,
          exitCode:        result.exitCode,
          executionTimeMs: singleAlgoMs,
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
