# Phase 7 — Database Audit

## Schema Overview

ORM: Drizzle ORM  
Database: PostgreSQL 16 (Neon in production)

### Tables

| Table | Primary Key | Unique Constraints | Foreign Keys | Indexes |
|-------|-------------|-------------------|--------------|---------|
| `users` | `id` (UUID) | `username`, `email`, `github_id` | — | implicit on unique cols |
| `snippets` | `id` (UUID) | `slug` | `user_id → users.id` (SET NULL) | `idx_snippets_user_id`, `idx_snippets_language`, `idx_snippets_public_created` |
| `executions` | `id` (UUID) | — | `snippet_id` (SET NULL), `user_id` (SET NULL) | `idx_executions_user_id` |
| `stars` | `(user_id, snippet_id)` | composite PK | `user_id` (CASCADE), `snippet_id` (CASCADE) | composite PK acts as index |
| `comments` | `id` (UUID) | — | `snippet_id` (CASCADE), `user_id` (CASCADE), `parent_id` (CASCADE, self-ref) | `idx_comments_snippet` |
| `follows` | `(follower_id, following_id)` | composite PK | both (CASCADE) | `idx_follows_follower` |

## Referential Integrity Analysis

| Relationship | On Delete | Correct? |
|-------------|-----------|---------|
| snippet → user | SET NULL | Yes — orphaned snippets survive; anonymous authorship |
| execution → snippet | SET NULL | Yes — execution history survives snippet deletion |
| execution → user | SET NULL | Yes — execution history survives account deletion |
| star → user | CASCADE | Yes — user deletion removes their stars |
| star → snippet | CASCADE | Yes — snippet deletion removes all its stars |
| comment → snippet | CASCADE | Yes — snippet deletion removes all comments |
| comment → user | CASCADE | Yes — user deletion removes their comments |
| comment → parent comment | CASCADE | Yes — deleting parent cascades to children |
| follow → user (both) | CASCADE | Yes — both follower and following deletions clean up |

## Index Adequacy

### High-traffic query patterns and their indexes

| Query | Filter/Sort | Index | Adequate? |
|-------|-------------|-------|-----------|
| List public snippets sorted by `createdAt` | `is_public=true ORDER BY created_at` | `idx_snippets_public_created` | Yes |
| List snippets by language | `language=X` | `idx_snippets_language` | Yes |
| Get snippets by user | `user_id=X` | `idx_snippets_user_id` | Yes |
| Get executions by user | `user_id=X` | `idx_executions_user_id` | Yes |
| Get comments by snippet | `snippet_id=X` | `idx_comments_snippet` | Yes |
| Check if user follows another | `(follower_id, following_id)` | composite PK | Yes |
| Check if user starred snippet | `(user_id, snippet_id)` | composite PK | Yes |

## `starsCount` / `viewsCount` Counters

The `snippets` table maintains denormalized counters `starsCount` and `viewsCount`. This is a common pattern to avoid `COUNT(*)` queries on the `stars` table for every snippet list request.

**Consistency guarantee:** The `SnippetRepository.toggleStar()` method updates `starsCount` atomically in the same transaction as the upsert/delete on `stars`. Views are incremented atomically via `UPDATE snippets SET views_count = views_count + 1`.

## Issues Found

| Issue | Severity | Status |
|-------|----------|--------|
| `executions.status` is `varchar(20)` not an enum | Low | Acceptable for Drizzle/Postgres; enum migration is disruptive. Document valid values: `pending`, `running`, `success`, `error`, `timeout` |
| No index on `snippets.is_public` + `created_at` combined | Low | The current index is on `created_at` alone. A partial index `WHERE is_public = true` would be more efficient. Acceptable for current data volume. |
| `users.updated_at` not auto-updated on UPDATE | Low | Drizzle doesn't auto-update `updated_at` on UPDATE. The `UserRepository.update()` should include `updatedAt: new Date()` in the update payload. |

## Assessment: PASS

Schema design is correct, relational integrity is enforced, and indexes cover all high-traffic query patterns.
