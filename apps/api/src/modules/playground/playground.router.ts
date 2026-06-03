import type { FastifyInstance } from 'fastify'
import { eq, desc, and, ne } from 'drizzle-orm'
import { db } from '@/db/client'
import { recents, collections, collectionItems } from '@/db/schema'
import { apiSuccess } from '@/common/utils/response'
import { requireAuth } from '@/common/middleware/auth.middleware'
import { NotFoundError } from '@/common/errors/AppError'

const MAX_RECENTS = 10

function nextSnippetTitle(existingTitles: string[]): string {
  const maxN = existingTitles.reduce((max, t) => {
    const m = t.match(/^Snippet #(\d+)$/)
    return m ? Math.max(max, parseInt(m[1], 10)) : max
  }, 0)
  return `Snippet #${maxN + 1}`
}

function extractCollectionItemTitle(code: string, language: string): string {
  const comment = code.match(/^(?:\/\/|#)\s*(.+)/m)
  if (comment?.[1]) {
    const t = comment[1].trim()
    if (t.length > 2) return t.slice(0, 40)
  }
  const fn = code.match(/(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=|def\s+(\w+))/)
  const name = fn?.[1] ?? fn?.[2] ?? fn?.[3]
  if (name && name !== 'main') return name
  return `${language} snippet`
}

export async function playgroundRoutes(app: FastifyInstance) {

  // ── Recents ──────────────────────────────────────────────────────────────────

  // GET /playground/recents
  app.get('/playground/recents', {
    preHandler: [requireAuth],
    handler: async (request, reply) => {
      const userId = (request.user as { sub: string }).sub
      const rows = await db.query.recents.findMany({
        where: eq(recents.userId, userId),
        orderBy: [desc(recents.createdAt)],
        limit: MAX_RECENTS,
      })
      return reply.send(apiSuccess(rows))
    },
  })

  // POST /playground/recents
  app.post<{ Body: { language: string; code: string } }>('/playground/recents', {
    preHandler: [requireAuth],
    handler: async (request, reply) => {
      const userId = (request.user as { sub: string }).sub
      const { language, code } = request.body

      if (!code?.trim()) return reply.send(apiSuccess(null))

      // Check for existing duplicate — preserve its title so renames survive re-runs
      const duplicate = await db.query.recents.findFirst({
        where: and(eq(recents.userId, userId), eq(recents.language, language), eq(recents.code, code)),
        columns: { title: true },
      })

      let title: string
      if (duplicate) {
        title = duplicate.title
      } else {
        const existing = await db.query.recents.findMany({
          where: eq(recents.userId, userId),
          columns: { title: true },
        })
        title = nextSnippetTitle(existing.map((r) => r.title))
      }

      // Remove duplicate (same language + code) if exists
      await db.delete(recents).where(
        and(eq(recents.userId, userId), eq(recents.language, language), eq(recents.code, code)),
      )

      const [row] = await db.insert(recents).values({ userId, title, language, code }).returning()

      // Prune oldest beyond MAX_RECENTS
      const all = await db.query.recents.findMany({
        where: eq(recents.userId, userId),
        orderBy: [desc(recents.createdAt)],
      })
      if (all.length > MAX_RECENTS) {
        const toDelete = all.slice(MAX_RECENTS).map((r) => r.id)
        for (const id of toDelete) {
          await db.delete(recents).where(and(eq(recents.userId, userId), eq(recents.id, id)))
        }
      }

      return reply.status(201).send(apiSuccess(row))
    },
  })

  // PATCH /playground/recents/:id  (rename)
  app.patch<{ Params: { id: string }; Body: { title: string } }>('/playground/recents/:id', {
    preHandler: [requireAuth],
    handler: async (request, reply) => {
      const userId = (request.user as { sub: string }).sub
      const { id } = request.params
      const title = request.body?.title?.trim()
      if (!title) return reply.status(400).send({ error: 'title is required' })
      // Prevent duplicate name within user's recents
      const duplicate = await db.query.recents.findFirst({
        where: and(eq(recents.userId, userId), eq(recents.title, title), ne(recents.id, id)),
      })
      if (duplicate) return reply.status(409).send({ error: 'A snippet with this name already exists' })
      const [row] = await db
        .update(recents)
        .set({ title })
        .where(and(eq(recents.id, id), eq(recents.userId, userId)))
        .returning()
      if (!row) throw new NotFoundError('Recent')
      return reply.send(apiSuccess(row))
    },
  })

  // DELETE /playground/recents/:id
  app.delete<{ Params: { id: string } }>('/playground/recents/:id', {
    preHandler: [requireAuth],
    handler: async (request, reply) => {
      const userId = (request.user as { sub: string }).sub
      const { id } = request.params
      await db.delete(recents).where(and(eq(recents.id, id), eq(recents.userId, userId)))
      return reply.send(apiSuccess({ ok: true }))
    },
  })

  // ── Collections ───────────────────────────────────────────────────────────────

  // GET /playground/collections (with items)
  app.get('/playground/collections', {
    preHandler: [requireAuth],
    handler: async (request, reply) => {
      const userId = (request.user as { sub: string }).sub
      const cols = await db.query.collections.findMany({
        where: eq(collections.userId, userId),
        orderBy: [desc(collections.createdAt)],
        with: { items: { orderBy: [desc(collectionItems.createdAt)] } },
      })
      return reply.send(apiSuccess(cols))
    },
  })

  // POST /playground/collections
  app.post<{ Body: { name: string } }>('/playground/collections', {
    preHandler: [requireAuth],
    handler: async (request, reply) => {
      const userId = (request.user as { sub: string }).sub
      const name = request.body?.name?.trim()
      if (!name) return reply.status(400).send({ error: 'name is required' })
      // Prevent duplicate collection name for this user
      const duplicate = await db.query.collections.findFirst({
        where: and(eq(collections.userId, userId), eq(collections.name, name)),
      })
      if (duplicate) return reply.status(409).send({ error: 'A collection with this name already exists' })
      const [col] = await db.insert(collections).values({ userId, name }).returning()
      return reply.status(201).send(apiSuccess({ ...col, items: [] }))
    },
  })

  // DELETE /playground/collections/:id
  app.delete<{ Params: { id: string } }>('/playground/collections/:id', {
    preHandler: [requireAuth],
    handler: async (request, reply) => {
      const userId = (request.user as { sub: string }).sub
      const { id } = request.params
      await db.delete(collections).where(and(eq(collections.id, id), eq(collections.userId, userId)))
      return reply.send(apiSuccess({ ok: true }))
    },
  })

  // POST /playground/collections/:id/items
  app.post<{ Params: { id: string }; Body: { language: string; code: string; title?: string } }>(
    '/playground/collections/:id/items',
    {
      preHandler: [requireAuth],
      handler: async (request, reply) => {
        const userId = (request.user as { sub: string }).sub
        const { id: collectionId } = request.params
        const { language, code, title: providedTitle } = request.body

        if (!code?.trim()) return reply.status(400).send({ error: 'code is required' })

        // Verify collection belongs to user
        const col = await db.query.collections.findFirst({
          where: and(eq(collections.id, collectionId), eq(collections.userId, userId)),
        })
        if (!col) throw new NotFoundError('Collection not found')

        const title = providedTitle?.trim() || extractCollectionItemTitle(code, language)

        // Remove duplicate code in same collection
        await db.delete(collectionItems).where(
          and(eq(collectionItems.collectionId, collectionId), eq(collectionItems.code, code)),
        )

        const [item] = await db.insert(collectionItems).values({ collectionId, title, language, code }).returning()
        return reply.status(201).send(apiSuccess(item))
      },
    },
  )

  // PATCH /playground/collections/:id/items/:itemId  (rename)
  app.patch<{ Params: { id: string; itemId: string }; Body: { title: string } }>(
    '/playground/collections/:id/items/:itemId',
    {
      preHandler: [requireAuth],
      handler: async (request, reply) => {
        const userId = (request.user as { sub: string }).sub
        const { id: collectionId, itemId } = request.params
        const title = request.body?.title?.trim()
        if (!title) return reply.status(400).send({ error: 'title is required' })
        // Verify collection belongs to user
        const col = await db.query.collections.findFirst({
          where: and(eq(collections.id, collectionId), eq(collections.userId, userId)),
        })
        if (!col) throw new NotFoundError('Collection not found')
        // Prevent duplicate title within the same collection
        const duplicate = await db.query.collectionItems.findFirst({
          where: and(
            eq(collectionItems.collectionId, collectionId),
            eq(collectionItems.title, title),
            ne(collectionItems.id, itemId),
          ),
        })
        if (duplicate) return reply.status(409).send({ error: 'An item with this name already exists in this collection' })
        const [row] = await db
          .update(collectionItems)
          .set({ title })
          .where(and(eq(collectionItems.id, itemId), eq(collectionItems.collectionId, collectionId)))
          .returning()
        if (!row) throw new NotFoundError('Item not found')
        return reply.send(apiSuccess(row))
      },
    },
  )

  // DELETE /playground/collections/:id/items/:itemId
  app.delete<{ Params: { id: string; itemId: string } }>(
    '/playground/collections/:id/items/:itemId',
    {
      preHandler: [requireAuth],
      handler: async (request, reply) => {
        const userId = (request.user as { sub: string }).sub
        const { id: collectionId, itemId } = request.params

        // Verify collection belongs to user
        const col = await db.query.collections.findFirst({
          where: and(eq(collections.id, collectionId), eq(collections.userId, userId)),
        })
        if (!col) throw new NotFoundError('Collection not found')

        await db.delete(collectionItems).where(
          and(eq(collectionItems.id, itemId), eq(collectionItems.collectionId, collectionId)),
        )
        return reply.send(apiSuccess({ ok: true }))
      },
    },
  )
}
