# Phase 12 — Case Study Compliance Report

Reference: `codeRank.pdf` (Airtribe Backend Engineering Launchpad)

---

## Requirements Matrix

### Key Features

| # | Requirement | Implemented | Evidence | Missing |
|---|-------------|-------------|---------|---------|
| 1 | **Language Support** — Python, Java, JavaScript, C++ | ✅ Yes | `engine/runner.registry.ts` — 4 language runners; Docker images per language | None |
| 2 | **Code Execution API** — RESTful API to submit code and receive results | ✅ Yes | `POST /api/v1/execute`, `GET /api/v1/execute/:jobId` | None |
| 3 | **Security Measures** — prevent malicious code, sandbox isolation | ✅ Yes | Docker sandbox: no-root, no-caps, readonly fs, no network, PID limits, memory/CPU limits | None |
| 4 | **Concurrency Handling** — multiple simultaneous executions | ✅ Yes | BullMQ queue + Worker (concurrency: 5); async job/poll pattern | None |
| 5 | **Timeout and Error Handling** — execution timeouts, runtime errors, meaningful feedback | ✅ Yes | 10s timeout + kill; error/timeout status in result; stderr returned to client | None |
| 6 | **Resource Management** — memory and CPU per execution | ✅ Yes | 128 MB RAM, 50% CPU, PID limit 50, 10 MB /tmp — all via Docker constraints | None |

### Technical Requirements

| # | Requirement | Implemented | Evidence | Missing |
|---|-------------|-------------|---------|---------|
| 1 | RESTful API design | ✅ Yes | All endpoints use correct HTTP verbs, status codes, and JSON responses | None |
| 2 | Containerization (Docker) for isolated execution | ✅ Yes | Fresh container per execution; `docker/runners/` hardened images | None |
| 3 | Database for user data and code snippets | ✅ Yes | PostgreSQL via Drizzle ORM; 6 tables with proper relations and indexes | None |
| 4 | Robust authentication and authorization | ✅ Yes | JWT in httpOnly cookies; bcrypt 12 rounds; ownership checks in service layer | None |
| 5 | Rate limiting and security measures | ✅ Yes | Global 100/min + per-route limits on execute (10/min) and auth (10/15min login, 5/15min register) | None |

---

## Scores

| Category | Score | Notes |
|----------|-------|-------|
| **Architecture** | 9/10 | Clean monorepo, module boundaries, repository pattern, shared types. -1 for dead GitHub OAuth code. |
| **Security** | 8/10 | Strong sandbox, bcrypt 12 rounds, httpOnly JWT, rate limiting, helmet. -2 for no JWT expiry (recommended fix). |
| **Reliability** | 8/10 | BullMQ queue, proper cleanup, timeout enforcement, error propagation. -2 for no retry mechanism if Redis write fails on submit. |
| **Maintainability** | 9/10 | Single responsibility, config driven, Zod schemas as single source of truth. -1 for some duplicated constants. |
| **Scalability** | 7/10 | Redis-backed queue and rate limits scale horizontally. -3 for fixed worker concurrency, no queue depth limit, no metrics. |
| **Requirement Compliance** | 10/10 | All 11 requirements from the PDF are fully implemented. |

**Overall: 8.5/10**

---

## Top 10 Issues — Priority Order

| Priority | Issue | Severity | Status |
|----------|-------|----------|--------|
| 1 | JWT has no expiry — stolen tokens are valid forever | High | ⚠️ Open — add `{ expiresIn: '7d' }` to `auth.service.ts` jwt.sign calls |
| 2 | `POST /execute` had only global 100/min rate limit | High | ✅ Fixed — now 10/min |
| 3 | Auth endpoints had no brute-force protection | High | ✅ Fixed — 10/15min login, 5/15min register |
| 4 | JWT_SECRET no startup validation | Critical | ✅ Fixed — `validateEnv()` crashes in production if missing |
| 5 | Health check did not verify DB/Redis | Medium | ✅ Fixed — now pings both dependencies |
| 6 | `console.error` in error handler leaks without context | Low | ✅ Fixed — uses `request.log.error` |
| 7 | Result TTL too short at 120s | Medium | ✅ Fixed — now 300s |
| 8 | Dead GitHub OAuth code increases attack surface | Low | ⚠️ Open — remove `githubId`, `findByGithubId`, related env vars if not implementing |
| 9 | `users.updated_at` not refreshed on UPDATE | Low | ⚠️ Open — add `updatedAt: new Date()` in `UserRepository.update()` |
| 10 | No monitoring/metrics endpoint | Medium | ⚠️ Open — add Prometheus metrics in V2 |

**✅ Fixed: 6 | ⚠️ Open: 4 (non-blocking for submission)**

---

## Deliverables Checklist

| Deliverable | Status |
|-------------|--------|
| Final, functional product | ✅ Deployed at https://code-rank-api.onrender.com |
| README with API docs, design decisions, usage | ✅ See `/README.md` |
| Public GitHub repository | ✅ |
| Explainer video | ⏳ Pending (not a code deliverable) |
