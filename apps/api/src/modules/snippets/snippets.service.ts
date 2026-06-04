import { nanoid } from 'nanoid'
import type { CreateSnippet, UpdateSnippet } from '@coderank/types'
import { SnippetRepository } from '@/repositories/snippet.repository'
import { CommentRepository } from '@/repositories/comment.repository'
import { db } from '@/db/client'
import { ForbiddenError, NotFoundError } from '@/common/errors/AppError'

export class SnippetService {
  private snippets: SnippetRepository
  private comments: CommentRepository

  constructor() {
    this.snippets = new SnippetRepository(db)
    this.comments = new CommentRepository(db)
  }

  async list(filters: { language?: string; sort?: 'stars' | 'recent' | 'views'; limit?: number; cursor?: string }) {
    return this.snippets.findAllPublic(filters)
  }

  async create(userId: string | undefined, data: CreateSnippet) {
    const slug = nanoid(10)
    const snippet = await this.snippets.create({ slug, userId, ...data })
    return this.snippets.findBySlug(slug, userId)
  }

  async getBySlug(slug: string, viewerUserId?: string) {
    const snippet = await this.snippets.findBySlug(slug, viewerUserId)
    if (!snippet) throw new NotFoundError('Snippet')

    // Increment view count asynchronously
    this.snippets.incrementViews(snippet.id).catch(() => {})

    return snippet
  }

  async update(slug: string, userId: string, data: UpdateSnippet) {
    const snippet = await this.snippets.findBySlug(slug)
    if (!snippet) throw new NotFoundError('Snippet')
    if (snippet.userId !== userId) throw new ForbiddenError()

    return this.snippets.update(snippet.id, data)
  }

  async delete(slug: string, userId: string) {
    const snippet = await this.snippets.findBySlug(slug)
    if (!snippet) throw new NotFoundError('Snippet')
    if (snippet.userId !== userId) throw new ForbiddenError()

    await this.snippets.delete(snippet.id)
  }

  async star(slug: string, userId: string) {
    const snippet = await this.snippets.findBySlug(slug)
    if (!snippet) throw new NotFoundError('Snippet')

    return this.snippets.toggleStar(userId, snippet.id)
  }

  async listComments(slug: string) {
    const snippet = await this.snippets.findBySlug(slug)
    if (!snippet) throw new NotFoundError('Snippet')

    const rows = await this.comments.findBySnippetId(snippet.id)
    return rows.map((c) => ({
      id: c.id,
      snippetId: c.snippetId,
      author: c.author,
      body: c.body,
      parentId: c.parentId,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    }))
  }

  async addComment(slug: string, userId: string, body: string, parentId?: string) {
    const snippet = await this.snippets.findBySlug(slug)
    if (!snippet) throw new NotFoundError('Snippet')

    const comment = await this.comments.create({ snippetId: snippet.id, userId, body, parentId })
    return {
      id: comment.id,
      snippetId: comment.snippetId,
      author: comment.author,
      body: comment.body,
      parentId: comment.parentId,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
    }
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await this.comments.findById(commentId)
    if (!comment) throw new NotFoundError('Comment')
    if (comment.userId !== userId) throw new ForbiddenError()

    await this.comments.delete(commentId)
  }
}
