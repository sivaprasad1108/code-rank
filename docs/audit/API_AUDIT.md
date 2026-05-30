# Phase 2 — API Audit

## Endpoint Inventory

All routes are prefixed `/api/v1`.

### Auth Routes

| Method | Path | Auth | Status Codes | Validated |
|--------|------|------|-------------|-----------|
| POST | `/auth/register` | None | 201, 409, 422 | `CreateUserSchema` |
| POST | `/auth/login` | None | 200, 401, 422 | `LoginSchema` |
| POST | `/auth/logout` | None | 200 | — |
| GET | `/auth/me` | Required | 200, 401 | — |

### User Routes

| Method | Path | Auth | Status Codes |
|--------|------|------|-------------|
| GET | `/users/:username` | Optional | 200, 404 |
| GET | `/users/:username/snippets` | None | 200 |
| POST | `/users/:username/follow` | Required | 200, 401, 403 |
| PATCH | `/users/me` | Required | 200, 401, 422 |

### Snippet Routes

| Method | Path | Auth | Status Codes |
|--------|------|------|-------------|
| GET | `/snippets` | Optional | 200 |
| POST | `/snippets` | Optional | 201, 422 |
| GET | `/snippets/:slug` | Optional | 200, 404 |
| PUT | `/snippets/:slug` | Required | 200, 401, 403, 404 |
| DELETE | `/snippets/:slug` | Required | 200, 401, 403, 404 |
| POST | `/snippets/:slug/star` | Required | 200, 401, 404 |
| GET | `/snippets/:slug/comments` | None | 200, 404 |
| POST | `/snippets/:slug/comments` | Required | 201, 401, 422 |
| DELETE | `/comments/:id` | Required | 200, 401, 403, 404 |

### Execution Routes

| Method | Path | Auth | Status Codes |
|--------|------|------|-------------|
| POST | `/execute` | Optional | 202, 422, 429 |
| GET | `/execute/:jobId` | None | 200, 404 |

### Health

| Method | Path | Status Codes |
|--------|------|-------------|
| GET | `/health` | 200, 503 |

## Response Format

All responses follow a consistent envelope:

```json
// Success
{ "success": true, "data": { ... }, "meta": { ... } }

// Error
{ "success": false, "error": { "code": "ERROR_CODE", "message": "Human readable message" } }
```

This is enforced via `apiSuccess()` and `apiError()` in `common/utils/response.ts`.

## Validation

All request bodies are validated with Zod schemas from `@coderank/types`. Invalid bodies return `422 VALIDATION_ERROR`. Validation happens at the router level before the handler runs.

## Ownership Enforcement

- `PUT /snippets/:slug` — verifies `snippet.userId === request.user.sub`, throws 403 if mismatch
- `DELETE /snippets/:slug` — same
- `DELETE /comments/:id` — verifies `comment.userId === request.user.sub`, throws 403 if mismatch
- `POST /users/:username/follow` — verifies follower cannot follow self, throws 403

## Issues Found

| Issue | Severity | Fix |
|-------|----------|-----|
| `/execute` had only global 100/min rate limit | High | Fixed: now 10/min per IP |
| `/auth/login` had no brute-force protection beyond global limit | High | Fixed: 10 attempts / 15 min per IP |
| `/auth/register` had no spam protection | Medium | Fixed: 5 registrations / 15 min per IP |

## Fixes Applied

1. `execute.router.ts` — added `config: { rateLimit: { max: 10, timeWindow: '1 minute' } }` to POST `/execute`
2. `auth.router.ts` — added route-level rate limits: login (10/15 min), register (5/15 min)

## Assessment: PASS (after fixes)
