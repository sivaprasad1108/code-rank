'use client'

import { useCallback, useEffect, useRef } from 'react'
import type { ExecuteResult } from '@coderank/types'
import { ENDPOINTS } from '@/lib/api/endpoints'
import { apiClient } from '@/lib/api/client'
import { EXECUTION_LIMITS } from '@/config/editor.config'
import { useEditorStore } from '../store/editor.store'

const POLL_INTERVAL_MS = 500
const MAX_POLLS = Math.ceil(EXECUTION_LIMITS.timeoutMs / POLL_INTERVAL_MS) + 5

export function useExecution() {
  const { code, language, setOutput, setRunning, isRunning } = useEditorStore()
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [])

  const run = useCallback(async () => {
    if (isRunning) return
    setRunning(true)

    try {
      const { jobId } = await apiClient.post<{ jobId: string }>(ENDPOINTS.EXECUTE.SUBMIT, {
        language,
        code,
      })

      let polls = 0

      pollRef.current = setInterval(async () => {
        polls++

        if (polls > MAX_POLLS) {
          clearInterval(pollRef.current!)
          setOutput({ jobId, status: 'timeout', stderr: 'Execution timed out.' })
          setRunning(false)
          return
        }

        try {
          const result = await apiClient.get<ExecuteResult>(ENDPOINTS.EXECUTE.RESULT(jobId))

          if (result.status === 'pending' || result.status === 'running') {
            return // keep polling
          }

          clearInterval(pollRef.current!)
          setOutput(result)
          setRunning(false)
        } catch {
          clearInterval(pollRef.current!)
          setOutput({ jobId, status: 'error', stderr: 'Failed to fetch execution result.' })
          setRunning(false)
        }
      }, POLL_INTERVAL_MS)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Execution failed.'
      setOutput({ jobId: '', status: 'error', stderr: message })
      setRunning(false)
    }
  }, [code, language, isRunning, setOutput, setRunning])

  return { run, isRunning }
}
