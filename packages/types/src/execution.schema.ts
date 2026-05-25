import { z } from 'zod'

export const SUPPORTED_LANGUAGES = ['python', 'javascript', 'java', 'cpp'] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const TestCaseSchema = z.object({
  stdin:          z.string().max(4_096).default(''),
  expectedOutput: z.string().max(4_096).optional(),
})

export const ExecuteRequestSchema = z.object({
  language:  z.enum(SUPPORTED_LANGUAGES),
  code:      z.string().min(1).max(65_536),
  stdin:     z.string().max(4_096).optional(),       // single-run compat
  testCases: z.array(TestCaseSchema).min(1).max(20).optional(),
})

export const ExecutionStatusSchema = z.enum([
  'pending',
  'running',
  'success',
  'timeout',
  'error',
])

export const TestCaseResultSchema = z.object({
  index:           z.number().int(),
  stdin:           z.string(),
  stdout:          z.string(),
  stderr:          z.string(),
  exitCode:        z.number().int(),
  executionTimeMs: z.number().int(),
  status:          z.enum(['success', 'error', 'timeout', 'wrong_answer']),
  passed:          z.boolean().optional(),   // only set when expectedOutput was given
})

export const ExecuteResultSchema = z.object({
  jobId:             z.string(),
  status:            ExecutionStatusSchema,
  // single-run fields
  stdout:            z.string().optional(),
  stderr:            z.string().optional(),
  exitCode:          z.number().int().optional(),
  executionTimeMs:   z.number().int().optional(),
  memoryUsedKb:      z.number().int().optional(),
  // multi-test-case fields
  testCaseResults:   z.array(TestCaseResultSchema).optional(),
  passedCount:       z.number().int().optional(),
  totalCount:        z.number().int().optional(),
})

export const ExecuteSubmitResponseSchema = z.object({
  jobId: z.string(),
})

export type TestCase        = z.infer<typeof TestCaseSchema>
export type TestCaseResult  = z.infer<typeof TestCaseResultSchema>
export type ExecuteRequest  = z.infer<typeof ExecuteRequestSchema>
export type ExecutionStatus = z.infer<typeof ExecutionStatusSchema>
export type ExecuteResult   = z.infer<typeof ExecuteResultSchema>
export type ExecuteSubmitResponse = z.infer<typeof ExecuteSubmitResponseSchema>
