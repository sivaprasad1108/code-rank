import { eq } from 'drizzle-orm'
import type { DB } from '@/db/client'
import { comments, users } from '@/db/schema'

export type CommentRow = typeof comments.$inferSelect
export type CommentWithAuthor = CommentRow & {
  author: { id: string; username: string; avatarUrl: string | null; bio: string | null }
}

export class CommentRepository {
  constructor(private db: DB) {}

  async findBySnippetId(snippetId: string): Promise<CommentWithAuthor[]> {
    const rows = await this.db
      .select({
        comment: comments,
        author: {
          id: users.id,
          username: users.username,
          avatarUrl: users.avatarUrl,
          bio: users.bio,
        },
      })
      .from(comments)
      .innerJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.snippetId, snippetId))

    return rows.map((r) => ({ ...r.comment, author: r.author }))
  }

  async create(data: {
    snippetId: string
    userId: string
    body: string
    parentId?: string
  }): Promise<CommentWithAuthor> {
    const rows = await this.db.insert(comments).values(data).returning()
    const comment = rows[0]

    const userRows = await this.db
      .select({ id: users.id, username: users.username, avatarUrl: users.avatarUrl, bio: users.bio })
      .from(users)
      .where(eq(users.id, comment.userId))
      .limit(1)

    return { ...comment, author: userRows[0] }
  }

  async findById(id: string): Promise<CommentRow | null> {
    const rows = await this.db.select().from(comments).where(eq(comments.id, id)).limit(1)
    return rows[0] ?? null
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(comments).where(eq(comments.id, id))
  }
}
