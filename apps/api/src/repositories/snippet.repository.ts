import { eq, desc, and, sql } from 'drizzle-orm'
import type { DB } from '@/db/client'
import { snippets, users, stars } from '@/db/schema'

export type SnippetRow = typeof snippets.$inferSelect
export type SnippetWithAuthor = SnippetRow & {
  author: { id: string; username: string; avatarUrl: string | null; bio: string | null } | null
  starredByMe: boolean
}

export class SnippetRepository {
  constructor(private db: DB) {}

  async findBySlug(slug: string, viewerUserId?: string): Promise<SnippetWithAuthor | null> {
    const rows = await this.db
      .select({
        snippet: snippets,
        author: {
          id: users.id,
          username: users.username,
          avatarUrl: users.avatarUrl,
          bio: users.bio,
        },
      })
      .from(snippets)
      .leftJoin(users, eq(snippets.userId, users.id))
      .where(eq(snippets.slug, slug))
      .limit(1)

    if (!rows[0]) return null

    let starredByMe = false
    if (viewerUserId) {
      const star = await this.db
        .select()
        .from(stars)
        .where(and(eq(stars.userId, viewerUserId), eq(stars.snippetId, rows[0].snippet.id)))
        .limit(1)
      starredByMe = !!star[0]
    }

    return { ...rows[0].snippet, author: rows[0].author, starredByMe }
  }

  async findAllPublic(opts: {
    language?: string
    sort?: 'stars' | 'recent' | 'views'
    limit?: number
    cursor?: string
  }): Promise<{ snippets: SnippetWithAuthor[]; nextCursor: string | null }> {
    const { language, sort = 'recent', limit = 20 } = opts

    const conditions = [eq(snippets.isPublic, true)]
    if (language) conditions.push(eq(snippets.language, language))

    const orderCol = sort === 'stars'
      ? desc(snippets.starsCount)
      : sort === 'views'
      ? desc(snippets.viewsCount)
      : desc(snippets.createdAt)

    const rows = await this.db
      .select({
        snippet: snippets,
        author: {
          id: users.id,
          username: users.username,
          avatarUrl: users.avatarUrl,
          bio: users.bio,
        },
      })
      .from(snippets)
      .leftJoin(users, eq(snippets.userId, users.id))
      .where(and(...conditions))
      .orderBy(orderCol)
      .limit(limit + 1)

    const hasMore = rows.length > limit
    const page = rows.slice(0, limit)
    const nextCursor = hasMore ? page[page.length - 1].snippet.id : null

    return {
      snippets: page.map((r) => ({ ...r.snippet, author: r.author, starredByMe: false })),
      nextCursor,
    }
  }

  async findByUserId(userId: string): Promise<SnippetRow[]> {
    return this.db
      .select()
      .from(snippets)
      .where(and(eq(snippets.userId, userId), eq(snippets.isPublic, true)))
      .orderBy(desc(snippets.createdAt))
  }

  async create(data: {
    slug: string
    userId?: string
    title: string
    description?: string
    language: string
    code: string
    isPublic: boolean
  }): Promise<SnippetRow> {
    const rows = await this.db.insert(snippets).values(data).returning()
    return rows[0]
  }

  async update(id: string, data: Partial<Pick<SnippetRow, 'title' | 'description' | 'code' | 'language' | 'isPublic'>>): Promise<SnippetRow | null> {
    const rows = await this.db
      .update(snippets)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(snippets.id, id))
      .returning()
    return rows[0] ?? null
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(snippets).where(eq(snippets.id, id))
  }

  async incrementViews(id: string): Promise<void> {
    await this.db
      .update(snippets)
      .set({ viewsCount: sql`${snippets.viewsCount} + 1` })
      .where(eq(snippets.id, id))
  }

  async toggleStar(userId: string, snippetId: string): Promise<{ starred: boolean; starsCount: number }> {
    const existing = await this.db
      .select()
      .from(stars)
      .where(and(eq(stars.userId, userId), eq(stars.snippetId, snippetId)))
      .limit(1)

    if (existing[0]) {
      await this.db.delete(stars).where(and(eq(stars.userId, userId), eq(stars.snippetId, snippetId)))
      const rows = await this.db
        .update(snippets)
        .set({ starsCount: sql`${snippets.starsCount} - 1` })
        .where(eq(snippets.id, snippetId))
        .returning({ starsCount: snippets.starsCount })
      return { starred: false, starsCount: rows[0].starsCount }
    } else {
      await this.db.insert(stars).values({ userId, snippetId })
      const rows = await this.db
        .update(snippets)
        .set({ starsCount: sql`${snippets.starsCount} + 1` })
        .where(eq(snippets.id, snippetId))
        .returning({ starsCount: snippets.starsCount })
      return { starred: true, starsCount: rows[0].starsCount }
    }
  }
}
