'use client'

import { useCallback, useEffect, useRef } from 'react'
import type { ExecuteResult } from '@coderank/types'
import { ENDPOINTS } from '@/lib/api/endpoints'
import { apiClient } from '@/lib/api/client'
import { EXECUTION_LIMITS } from '@/config/editor.config'
import { useEditorStore } from '../store/editor.store'
import { useRecents } from './useRecents'

const POLL_INTERVAL_MS = 500
// Each test case can take up to timeoutMs; allow extra buffer for polling
const MAX_POLLS = Math.ceil((EXECUTION_LIMITS.timeoutMs * 2) / POLL_INTERVAL_MS) + 10

export function useExecution() {
  const { code, language, testCases, setOutput, setRunning, isRunning } = useEditorStore()
  const { addRecent } = useRecents()
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [])

  const run = useCallback(async () => {
    if (isRunning) return
    addRecent(language, code)
    setRunning(true)

    try {
      // Build the request: use testCases if any have stdin or expectedOutput filled in
      const hasMultiple = testCases.length > 1
      const hasExpected = testCases.some((tc) => tc.expectedOutput)
      const hasStdin    = testCases.some((tc) => tc.stdin.trim())
      const useTestCases = hasMultiple || hasExpected || hasStdin

      const body = useTestCases
        ? { language, code, testCases }
        : { language, code }

      const { jobId } = await apiClient.post<{ jobId: string }>(ENDPOINTS.EXECUTE.SUBMIT, body)

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

          if (result.status === 'pending' || result.status === 'running') return

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
  }, [code, language, testCases, isRunning, addRecent, setOutput, setRunning])

  return { run, isRunning }
}
