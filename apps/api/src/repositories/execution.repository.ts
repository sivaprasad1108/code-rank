import { eq } from 'drizzle-orm'
import type { DB } from '@/db/client'
import { executions } from '@/db/schema'

export type ExecutionRow = typeof executions.$inferSelect

export class ExecutionRepository {
  constructor(private db: DB) {}

  async create(data: {
    userId?: string
    snippetId?: string
    language: string
    code: string
    stdin?: string
    status?: string
  }): Promise<ExecutionRow> {
    const rows = await this.db.insert(executions).values(data).returning()
    return rows[0]
  }

  async updateResult(
    id: string,
    data: {
      status: string
      stdout?: string
      stderr?: string
      exitCode?: number
      executionTimeMs?: number
      memoryUsedKb?: number
    },
  ): Promise<void> {
    await this.db.update(executions).set(data).where(eq(executions.id, id))
  }
}
