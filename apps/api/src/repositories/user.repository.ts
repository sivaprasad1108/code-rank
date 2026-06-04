import { eq } from 'drizzle-orm'
import type { DB } from '@/db/client'
import { users } from '@/db/schema'

export type UserRow = typeof users.$inferSelect

export class UserRepository {
  constructor(private db: DB) {}

  async findById(id: string): Promise<UserRow | null> {
    const rows = await this.db.select().from(users).where(eq(users.id, id)).limit(1)
    return rows[0] ?? null
  }

  async findByEmail(email: string): Promise<UserRow | null> {
    const rows = await this.db.select().from(users).where(eq(users.email, email)).limit(1)
    return rows[0] ?? null
  }

  async findByUsername(username: string): Promise<UserRow | null> {
    const rows = await this.db.select().from(users).where(eq(users.username, username)).limit(1)
    return rows[0] ?? null
  }

  async findByGithubId(githubId: string): Promise<UserRow | null> {
    const rows = await this.db.select().from(users).where(eq(users.githubId, githubId)).limit(1)
    return rows[0] ?? null
  }

  async create(data: {
    username: string
    email: string
    passwordHash?: string
    githubId?: string
    avatarUrl?: string
  }): Promise<UserRow> {
    const rows = await this.db
      .insert(users)
      .values(data)
      .returning()
    return rows[0]
  }

  async update(id: string, data: Partial<Pick<UserRow, 'username' | 'bio' | 'avatarUrl'>>): Promise<UserRow | null> {
    const rows = await this.db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning()
    return rows[0] ?? null
  }
}
