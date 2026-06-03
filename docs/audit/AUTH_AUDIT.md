# Phase 8 — Authentication & Authorization Audit

## Authentication Flow

```
Registration:
  POST /auth/register { username, email, password }
    → validate schema (Zod)
    → check email uniqueness
    → check username uniqueness
    → bcrypt.hash(password, 12)
    → INSERT user
    → jwt.sign({ sub: userId, username })
    → SET httpOnly cookie "token"
    → return { id, username, email, avatarUrl, bio, createdAt }

Login:
  POST /auth/login { email, password }
    → validate schema (Zod)
    → find user by email
    → bcrypt.compare(password, passwordHash)
    → jwt.sign({ sub: userId, username })
    → SET httpOnly cookie "token"
    → return user

Logout:
  POST /auth/logout
    → clearCookie("token")
    → return { ok: true }

Authenticated Request:
  GET /auth/me (or any protected route)
    → Fastify JWT plugin reads "token" cookie
    → Verifies signature against JWT_SECRET
    → Attaches decoded payload to request.user
    → Handler uses request.user.sub as userId
```

## Cookie Security

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `httpOnly` | `true` | Inaccessible to JavaScript — XSS resistant |
| `sameSite` | `'lax'` | Sent on same-site + top-level cross-site navigation |
| `secure` | `true` in production | HTTPS-only |
| `path` | `/` | Available on all routes |

## Protected Routes Audit

| Route | Protection | Ownership Check |
|-------|-----------|-----------------|
| `GET /auth/me` | `requireAuth` | N/A |
| `POST /users/:username/follow` | `requireAuth` | Cannot follow self |
| `PATCH /users/me` | `requireAuth` | Always own profile |
| `PUT /snippets/:slug` | `requireAuth` | `snippet.userId === user.sub` |
| `DELETE /snippets/:slug` | `requireAuth` | `snippet.userId === user.sub` |
| `POST /snippets/:slug/star` | `requireAuth` | N/A |
| `POST /snippets/:slug/comments` | `requireAuth` | N/A |
| `DELETE /comments/:id` | `requireAuth` | `comment.userId === user.sub` |

## Authorization Logic

Ownership checks are enforced at the **service layer**, not the route layer. This is correct — it prevents bypassing via middleware changes.

Example from `snippets.service.ts`:
```typescript
if (snippet.userId !== userId) throw new ForbiddenError()
```

## Issues Found

| Issue | Severity | Recommendation |
|-------|----------|----------------|
| JWT has no expiry | Medium | Add `{ expiresIn: '7d' }` to all `jwt.sign()` calls in `auth.service.ts`. Without this, tokens are valid indefinitely — a stolen token cannot be invalidated short of rotating the JWT_SECRET. |
| No refresh token mechanism | Low | Acceptable for V1. Required once expiry is added. |
| GitHub OAuth fields dead code | Low | `githubId` column and `findByGithubId` repo method exist but no OAuth routes. Either implement or remove to reduce attack surface. |
| JWT_SECRET startup check | Fixed | Added in `app.ts` — crashes in production if JWT_SECRET is unset. |

## Assessment: PASS (with noted recommendation)

Core auth is solid. JWT expiry should be added before the feature is used in production at scale.
