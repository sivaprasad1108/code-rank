import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  primaryKey,
  index,
  type AnyPgColumn,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ──────────────────────────────────────────────────────────────────────────────
// Users
// ──────────────────────────────────────────────────────────────────────────────

export const users = pgTable('users', {
  id:           uuid('id').primaryKey().defaultRandom(),
  username:     varchar('username', { length: 32 }).notNull().unique(),
  email:        varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }),
  avatarUrl:    text('avatar_url'),
  bio:          text('bio'),
  githubId:     varchar('github_id', { length: 64 }).unique(),
  createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:    timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// ──────────────────────────────────────────────────────────────────────────────
// Snippets
// ──────────────────────────────────────────────────────────────────────────────

export const snippets = pgTable(
  'snippets',
  {
    id:          uuid('id').primaryKey().defaultRandom(),
    slug:        varchar('slug', { length: 16 }).notNull().unique(),
    userId:      uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    title:       varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    language:    varchar('language', { length: 32 }).notNull(),
    code:        text('code').notNull(),
    isPublic:    boolean('is_public').notNull().default(true),
    starsCount:  integer('stars_count').notNull().default(0),
    viewsCount:  integer('views_count').notNull().default(0),
    createdAt:   timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt:   timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx:         index('idx_snippets_user_id').on(t.userId),
    languageIdx:     index('idx_snippets_language').on(t.language),
    publicCreatedIdx: index('idx_snippets_public_created').on(t.createdAt),
  }),
)

// ──────────────────────────────────────────────────────────────────────────────
// Executions
// ──────────────────────────────────────────────────────────────────────────────

export const executions = pgTable(
  'executions',
  {
    id:              uuid('id').primaryKey().defaultRandom(),
    snippetId:       uuid('snippet_id').references(() => snippets.id, { onDelete: 'set null' }),
    userId:          uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    language:        varchar('language', { length: 32 }).notNull(),
    code:            text('code').notNull(),
    stdin:           text('stdin'),
    stdout:          text('stdout'),
    stderr:          text('stderr'),
    exitCode:        integer('exit_code'),
    executionTimeMs: integer('execution_time_ms'),
    memoryUsedKb:    integer('memory_used_kb'),
    status:          varchar('status', { length: 20 }).notNull().default('pending'),
    createdAt:       timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index('idx_executions_user_id').on(t.userId),
  }),
)

// ──────────────────────────────────────────────────────────────────────────────
// Stars
// ──────────────────────────────────────────────────────────────────────────────

export const stars = pgTable(
  'stars',
  {
    userId:    uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    snippetId: uuid('snippet_id').notNull().references(() => snippets.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.snippetId] }),
  }),
)

// ──────────────────────────────────────────────────────────────────────────────
// Comments
// ──────────────────────────────────────────────────────────────────────────────

export const comments = pgTable(
  'comments',
  {
    id:        uuid('id').primaryKey().defaultRandom(),
    snippetId: uuid('snippet_id').notNull().references(() => snippets.id, { onDelete: 'cascade' }),
    userId:    uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    parentId:  uuid('parent_id').references((): AnyPgColumn => comments.id, { onDelete: 'cascade' }),
    body:      text('body').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    snippetIdx: index('idx_comments_snippet').on(t.snippetId),
  }),
)

// ──────────────────────────────────────────────────────────────────────────────
// Follows
// ──────────────────────────────────────────────────────────────────────────────

export const follows = pgTable(
  'follows',
  {
    followerId:  uuid('follower_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    followingId: uuid('following_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    createdAt:   timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    pk:          primaryKey({ columns: [t.followerId, t.followingId] }),
    followerIdx: index('idx_follows_follower').on(t.followerId),
  }),
)

// ──────────────────────────────────────────────────────────────────────────────
// Playground Recents
// ──────────────────────────────────────────────────────────────────────────────

export const recents = pgTable(
  'recents',
  {
    id:        uuid('id').primaryKey().defaultRandom(),
    userId:    uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    title:     varchar('title', { length: 255 }).notNull(),
    language:  varchar('language', { length: 32 }).notNull(),
    code:      text('code').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index('idx_recents_user_id').on(t.userId),
  }),
)

// ──────────────────────────────────────────────────────────────────────────────
// Playground Collections
// ──────────────────────────────────────────────────────────────────────────────

export const collections = pgTable(
  'collections',
  {
    id:        uuid('id').primaryKey().defaultRandom(),
    userId:    uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    name:      varchar('name', { length: 100 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index('idx_collections_user_id').on(t.userId),
  }),
)

export const collectionItems = pgTable(
  'collection_items',
  {
    id:           uuid('id').primaryKey().defaultRandom(),
    collectionId: uuid('collection_id').notNull().references(() => collections.id, { onDelete: 'cascade' }),
    title:        varchar('title', { length: 255 }).notNull(),
    language:     varchar('language', { length: 32 }).notNull(),
    code:         text('code').notNull(),
    createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    collectionIdx: index('idx_collection_items_collection_id').on(t.collectionId),
  }),
)

// ── Relations ─────────────────────────────────────────────────────────────────

export const collectionsRelations = relations(collections, ({ many }) => ({
  items: many(collectionItems),
}))

export const collectionItemsRelations = relations(collectionItems, ({ one }) => ({
  collection: one(collections, {
    fields: [collectionItems.collectionId],
    references: [collections.id],
  }),
}))
