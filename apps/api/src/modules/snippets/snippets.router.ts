import type { FastifyInstance } from 'fastify'
import { CreateSnippetSchema, UpdateSnippetSchema, CreateCommentSchema, SnippetFiltersSchema, SUPPORTED_LANGUAGES } from '@coderank/types'
import { SnippetService } from './snippets.service'
import { apiSuccess } from '@/common/utils/response'
import { requireAuth, optionalAuth } from '@/common/middleware/auth.middleware'

/** Lowercase and validate a language string; returns undefined if unknown */
function normalizeLang(lang: unknown): string | undefined {
  if (typeof lang !== 'string') return undefined
  const lower = lang.toLowerCase()
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(lower) ? lower : undefined
}

export async function snippetRoutes(app: FastifyInstance) {
  const service = new SnippetService()

  // GET /snippets
  app.get('/snippets', {
    preHandler: [optionalAuth],
    handler: async (request, reply) => {
      const raw = request.query as Record<string, unknown>
      // Normalize language case before Zod's strict enum check;
      // unknown languages are coerced to undefined so the filter is simply ignored.
      const filters = SnippetFiltersSchema.parse({
        ...raw,
        language: normalizeLang(raw.language),
      })
      const result = await service.list({
        language: filters.language,
        sort: filters.sort,
        limit: filters.limit,
        cursor: filters.cursor,
      })
      return reply.send(apiSuccess({ snippets: result.snippets, nextCursor: result.nextCursor ?? null }))
    },
  })

  // POST /snippets
  app.post('/snippets', {
    preHandler: [optionalAuth],
    handler: async (request, reply) => {
      const raw = request.body as Record<string, unknown>
      // Normalize language case so 'Python', 'PYTHON', 'python' all pass validation
      const body = CreateSnippetSchema.parse({
        ...raw,
        language: normalizeLang(raw.language) ?? raw.language,
      })
      const userId = (request.user as { sub?: string } | undefined)?.sub
      const snippet = await service.create(userId, body)
      return reply.status(201).send(apiSuccess(snippet))
    },
  })

  // GET /snippets/:slug
  app.get<{ Params: { slug: string } }>('/snippets/:slug', {
    preHandler: [optionalAuth],
    handler: async (request, reply) => {
      const userId = (request.user as { sub?: string } | undefined)?.sub
      const snippet = await service.getBySlug(request.params.slug, userId)
      return reply.send(apiSuccess(snippet))
    },
  })

  // PUT /snippets/:slug
  app.put<{ Params: { slug: string } }>('/snippets/:slug', {
    preHandler: [requireAuth],
    handler: async (request, reply) => {
      const raw = request.body as Record<string, unknown>
      const body = UpdateSnippetSchema.parse({
        ...raw,
        ...(raw.language !== undefined && { language: normalizeLang(raw.language) ?? raw.language }),
      })
      const userId = (request.user as { sub: string }).sub
      const snippet = await service.update(request.params.slug, userId, body)
      return reply.send(apiSuccess(snippet))
    },
  })

  // DELETE /snippets/:slug
  app.delete<{ Params: { slug: string } }>('/snippets/:slug', {
    preHandler: [requireAuth],
    handler: async (request, reply) => {
      const userId = (request.user as { sub: string }).sub
      await service.delete(request.params.slug, userId)
      return reply.send(apiSuccess({ ok: true }))
    },
  })

  // POST /snippets/:slug/star
  app.post<{ Params: { slug: string } }>('/snippets/:slug/star', {
    preHandler: [requireAuth],
    handler: async (request, reply) => {
      const userId = (request.user as { sub: string }).sub
      const result = await service.star(request.params.slug, userId)
      return reply.send(apiSuccess(result))
    },
  })

  // GET /snippets/:slug/comments
  app.get<{ Params: { slug: string } }>('/snippets/:slug/comments', {
    handler: async (request, reply) => {
      const comments = await service.listComments(request.params.slug)
      return reply.send(apiSuccess(comments))
    },
  })

  // POST /snippets/:slug/comments
  app.post<{ Params: { slug: string } }>('/snippets/:slug/comments', {
    preHandler: [requireAuth],
    handler: async (request, reply) => {
      const { body, parentId } = CreateCommentSchema.parse(request.body)
      const userId = (request.user as { sub: string }).sub
      const comment = await service.addComment(request.params.slug, userId, body, parentId)
      return reply.status(201).send(apiSuccess(comment))
    },
  })

  // DELETE /comments/:id
  app.delete<{ Params: { id: string } }>('/comments/:id', {
    preHandler: [requireAuth],
    handler: async (request, reply) => {
      const userId = (request.user as { sub: string }).sub
      await service.deleteComment(request.params.id, userId)
      return reply.send(apiSuccess({ ok: true }))
    },
  })
}
