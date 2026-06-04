# CodeRank

A full-stack online code execution platform with multi-language support, Docker sandbox isolation, job queue processing, and real-time code sharing.

**Live:** https://code-rank-app.vercel.app  
**API:** http://161.118.182.142:3001/api/v1  
**GitHub:** https://github.com/sivaprasad1108/code-rank

For detailed system diagrams — topology, execution flow, auth, DB schema, and deployment — see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## Table of Contents

1. [Background & Objective](#background--objective)
2. [Key Features](#key-features)
3. [Architecture](#architecture)
4. [Tech Stack](#tech-stack)
5. [Getting Started](#getting-started)
6. [Environment Variables](#environment-variables)
7. [API Documentation](#api-documentation)
8. [Execution Engine](#execution-engine)
9. [Security Model](#security-model)
10. [Concurrency & Resource Management](#concurrency--resource-management)
11. [Design Decisions](#design-decisions)
12. [Project Structure](#project-structure)

---

## Background & Objective

CodeRank is a backend engineering case study in building a production-grade online code execution platform. Users can write and run code in multiple programming languages directly in the browser — no local setup required. The system is designed around secure Docker isolation, async job queue processing, and RESTful API principles.

---

## Key Features

| # | Feature | How it's implemented |
|---|---------|----------------------|
| 1 | **Multi-language support** | Python 3.12, JavaScript (Node 20), Java 21, C++ — each with its own isolated Docker image |
| 2 | **Code Execution API** | RESTful `POST /execute` → `jobId` → `GET /execute/:jobId` polling pattern |
| 3 | **Security & Sandbox isolation** | Non-root user, no network, read-only filesystem, dropped capabilities, memory/CPU/PID limits |
| 4 | **Concurrency handling** | BullMQ worker pool (`concurrency: 5`) — 5 containers execute in parallel; queue absorbs spikes |
| 5 | **Timeout & error handling** | 10-second container timeout, runtime errors captured from stderr, meaningful status codes returned |
| 6 | **Resource management** | 128 MB RAM cap, 50% CPU cap, 50 PID limit, 10 MB `/tmp`, per-IP rate limiting via Redis |
| — | **Snippets & social feed** | Save, share, star, and browse public code snippets with author profiles |
| — | **Authentication** | JWT in httpOnly cookies — XSS-resistant, CSRF-safe |
| — | **Playground collections** | Save and organise snippets into named collections; recent history persisted per user |
| — | **War Rooms** *(preview)* | UI prototype for live competitive coding battles — backend coming soon |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                   Next.js Frontend (Vercel)                   │
│   Playground │ Snippets Feed │ Profile │ Auth │ War Rooms     │
└───────────────────────────┬──────────────────────────────────┘
                            │ HTTPS + httpOnly cookies
┌───────────────────────────▼──────────────────────────────────┐
│              Fastify REST API  (Ubuntu VPS, PM2)              │
│                                                               │
│   /auth     /snippets     /users     /execute    /playground  │
│                                                               │
│   Zod validation │ JWT auth │ Rate limiting (Redis)           │
└──────┬──────────────────────────────┬─────────────────────────┘
       │                              │
       ▼                              ▼
 PostgreSQL (Neon)             Redis (local, Docker)
 Users, Snippets,              BullMQ job queue
 Stars, Comments,              Execution results (5 min TTL)
 Follows, Collections          Rate limit counters
                                      │
                             ┌────────▼─────────┐
                             │   BullMQ Worker   │
                             │  concurrency = 5  │
                             └────────┬──────────┘
                                      │  one container per job
                     ┌────────────────▼────────────────────┐
                     │         Docker Execution Sandbox      │
                     │  python:3.12-slim                     │
                     │  node:20-alpine                       │
                     │  openjdk:21-slim                      │
                     │  gcc:13-slim                          │
                     │  • no network    • read-only rootfs   │
                     │  • 128 MB RAM    • 50% CPU            │
                     │  • 10 s timeout  • run as nobody      │
                     │  • 50 PID cap    • 10 MB /tmp noexec  │
                     └─────────────────────────────────────┘
```

---

## Tech Stack

### Backend (`apps/api`)

| Layer | Technology | Why |
|-------|------------|-----|
| Runtime | Node.js 20 | LTS, native async, Docker SDK |
| Framework | Fastify 4 | 2× faster than Express, typed schema hooks |
| ORM | Drizzle ORM | SQL-first, zero magic, predictable queries |
| Database | PostgreSQL 16 (Neon) | Relational integrity, serverless-compatible |
| Queue | BullMQ 5 + Redis | Reliable job persistence, retries, concurrency control |
| Execution | Dockerode | Node.js Docker SDK — full container lifecycle control |
| Auth | @fastify/jwt + @fastify/cookie | httpOnly JWT cookies |
| Validation | Zod | Runtime + compile-time safety |
| Language | TypeScript | End-to-end type safety |

### Frontend (`apps/web`)

| Layer | Technology | Why |
|-------|------------|-----|
| Framework | Next.js 14 App Router | SSR + client components, Vercel-optimised |
| Editor | Monaco Editor | VS Code engine in the browser |
| State | Zustand + TanStack Query | Local UI state + server state with caching |
| Styling | Tailwind CSS + CVA | Utility-first, variant-safe design system |
| Language | TypeScript | Shared types with backend |

### Shared (`packages/types`)

Zod schemas defined once — used for API runtime validation and TypeScript type inference on both sides. A single source of truth that breaks at compile time if either side drifts.

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (for code execution sandbox and local Redis)

### Local Setup

```bash
# 1. Clone and install dependencies
git clone https://github.com/sivaprasad1108/code-rank
cd code-rank
pnpm install

# 2. Start local Redis and PostgreSQL
docker run -d --name coderank-redis -p 127.0.0.1:6379:6379 redis:7-alpine
# Or use docker compose:
docker compose -f docker/compose/docker-compose.dev.yml up -d

# 3. Configure environment
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env — minimum: DATABASE_URL, REDIS_URL, JWT_SECRET

# 4. Push database schema
pnpm --filter api db:push

# 5. Start development servers
pnpm dev
```

| Service | URL |
|---------|-----|
| Web | http://localhost:3000 |
| API | http://localhost:3001 |
| Health check | http://localhost:3001/api/v1/health |

### Production Deployment (VPS)

```bash
# On the server
git pull origin main
pnpm install
pnpm --filter api build

# Ensure Redis is running
docker start coderank-redis

# Restart API (PM2 must be started from apps/api so dotenv finds .env)
pm2 delete coderank-api
cd apps/api
pm2 start dist/app.js --name coderank-api
```

---

## Environment Variables

### API (`apps/api/.env`)

```env
# ── Database ──────────────────────────────────────────────────
DATABASE_URL=postgresql://coderank:coderank@localhost:5432/coderank_dev

# ── Redis ─────────────────────────────────────────────────────
# App-level caching + rate limiting
REDIS_URL=redis://localhost:6379

# BullMQ job queue — must be a standard Redis server (not Upstash)
# BullMQ uses persistent Lua scripts; Upstash's 500k req/month cap
# is exhausted within hours by BullMQ's polling interval.
QUEUE_REDIS_URL=redis://localhost:6379

# ── Auth ──────────────────────────────────────────────────────
# Minimum 32 characters — required in production
JWT_SECRET=your-secret-key-minimum-32-characters-long

# ── Server ────────────────────────────────────────────────────
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=info
```

> **Why two Redis vars?**  
> BullMQ runs a tight polling loop (~10 req/s with Lua scripts). Upstash's free tier (500k req/month) is exhausted in 12–14 hours. `QUEUE_REDIS_URL` keeps the queue on a local Redis instance while `REDIS_URL` can point to any Redis for app caching and rate limiting.

### Frontend (`apps/web/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## API Documentation

**Base URL:** `http://161.118.182.142:3001/api/v1`

All responses use a consistent envelope:

```json
{ "success": true,  "data": { ... } }
{ "success": false, "error": { "code": "ERROR_CODE", "message": "Human readable" } }
```

---

### Authentication

#### `POST /auth/register`
_Rate limit: 5 per 15 min per IP_

```json
// Request
{ "username": "alice", "email": "alice@example.com", "password": "securepassword" }

// Response 201
{ "success": true, "data": { "id": "uuid", "username": "alice", "email": "...", "createdAt": "..." } }
```

Errors: `409 CONFLICT` (email/username taken) · `422 VALIDATION_ERROR`

---

#### `POST /auth/login`
_Rate limit: 10 per 15 min per IP_

```json
// Request
{ "email": "alice@example.com", "password": "securepassword" }

// Response 200 — sets httpOnly "token" cookie (sameSite: none in production for cross-origin)
{ "success": true, "data": { "id": "uuid", "username": "alice", "email": "..." } }
```

Errors: `401 UNAUTHORIZED`

---

#### `POST /auth/logout`

Clears the auth cookie. Returns `200 { "ok": true }`.

---

#### `GET /auth/me` _(requires auth)_

Returns the currently authenticated user's profile.

---

### Code Execution

#### `POST /execute`
_Rate limit: 10 per minute per IP_

```json
// Request body
{
  "language": "python",
  "code": "def add(a, b):\n    return a + b",
  "stdin": "3\n5",
  "testCases": [
    { "stdin": "3\n5", "expectedOutput": "8" }
  ]
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `language` | string | Yes | `python` · `javascript` · `java` · `cpp` |
| `code` | string | Yes | Max 64 KB |
| `stdin` | string | No | Used in single-run mode |
| `testCases` | array | No | Each: `{ stdin, expectedOutput }` |

```json
// Response 202 — accepted, not yet executed
{ "success": true, "data": { "jobId": "uuid" } }
```

---

#### `GET /execute/:jobId`

Poll until `status` is no longer `pending` or `running`. Results expire after 5 minutes.

```json
// Single-run result
{
  "success": true,
  "data": {
    "jobId": "uuid",
    "status": "success",
    "stdout": "8\n",
    "stderr": "",
    "exitCode": 0,
    "executionTimeMs": 42
  }
}

// Test-case result
{
  "success": true,
  "data": {
    "jobId": "uuid",
    "status": "success",
    "passedCount": 2,
    "totalCount": 2,
    "testCaseResults": [
      { "index": 0, "stdin": "3\n5", "stdout": "8\n", "exitCode": 0,
        "executionTimeMs": 38, "status": "success", "passed": true }
    ]
  }
}
```

**Execution statuses:**

| Status | Meaning |
|--------|---------|
| `pending` | Queued, not yet picked up |
| `running` | Executing inside Docker |
| `success` | Exit code 0 |
| `error` | Non-zero exit / runtime crash |
| `timeout` | Exceeded 10-second limit |
| `wrong_answer` | Test case output mismatch |

---

### Snippets

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/snippets` | Optional | List public snippets — `?language=&sort=stars\|recent\|views&limit=&cursor=` |
| `POST` | `/snippets` | Optional | Create snippet |
| `GET` | `/snippets/:slug` | Optional | Get snippet (includes `starredByMe` when authenticated) |
| `PUT` | `/snippets/:slug` | Required | Update snippet (owner only) |
| `DELETE` | `/snippets/:slug` | Required | Delete snippet (owner only) |
| `POST` | `/snippets/:slug/star` | Required | Toggle star → `{ starred: true/false }` |
| `GET` | `/snippets/:slug/comments` | None | List comments (supports nested replies) |
| `POST` | `/snippets/:slug/comments` | Required | Add comment (`parentId` for replies) |
| `DELETE` | `/comments/:id` | Required | Delete comment (author only) |

Language filter is case-insensitive: `?language=Python` and `?language=python` both work.

---

### Users

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/users/:username` | Optional | Public profile |
| `GET` | `/users/:username/snippets` | None | User's public snippets |
| `POST` | `/users/:username/follow` | Required | Toggle follow |
| `PATCH` | `/users/me` | Required | Update username / bio |

---

### Playground

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/playground/recents` | Required | Last 20 recently executed snippets |
| `DELETE` | `/playground/recents/:id` | Required | Remove a recent entry |
| `GET` | `/playground/collections` | Required | List user's collections |
| `POST` | `/playground/collections` | Required | Create collection `{ name }` |
| `PUT` | `/playground/collections/:id` | Required | Rename collection |
| `DELETE` | `/playground/collections/:id` | Required | Delete collection |
| `POST` | `/playground/collections/:id/items` | Required | Add snippet to collection |
| `DELETE` | `/playground/collections/:id/items/:itemId` | Required | Remove snippet from collection |

For unauthenticated users, recents and collections are stored in browser `localStorage` on the frontend.

---

### Health

#### `GET /health`

```json
// 200 — all healthy
{
  "success": true,
  "data": { "status": "ok", "checks": { "database": "ok", "redis": "ok" }, "timestamp": "..." }
}

// 503 — degraded
{ "success": false, "error": { "code": "SERVICE_UNAVAILABLE", "message": "One or more dependencies are unhealthy" } }
```

---

## Execution Engine

### Request Flow

```
POST /execute
  → validate with Zod
  → generate UUID jobId
  → Redis SET exec:{jobId} = { status: 'pending' }
  → BullMQ enqueue job
  → return 202 { jobId }      ← immediate response, no waiting

BullMQ Worker (concurrency 5 — up to 5 containers in parallel):
  → dequeue job
  → write code file to host tmpdir
  → create Docker container (language-specific image)
  → bind-mount code dir as /code:ro
  → apply all sandbox constraints (see Security Model)
  → attach stdout/stderr streams
  → container.start()
  → race: container.wait() vs 10s timeout
  → on timeout → kill container → status = 'timeout'
  → collect stdout/stderr/exitCode
  → cleanup: remove container + tmpdir
  → Redis SET exec:{jobId} = { status, stdout, stderr, exitCode, executionTimeMs }
  → TTL: 300 seconds

GET /execute/:jobId
  → Redis GET exec:{jobId}
  → return result, or 404 if expired / never existed
```

### Supported Languages

| Language | Docker Image | Execution |
|----------|-------------|-----------|
| Python 3.12 | `python:3.12-slim` | Interpreted — `python3 /code/main.py` |
| JavaScript | `node:20-alpine` | Interpreted — `node /code/main.js` |
| Java 21 | `openjdk:21-slim` | Compiled — `javac Main.java` → `java Main` |
| C++ | `gcc:13-slim` | Compiled — `g++ -O2 -o a.out` → `./a.out` |

### Auto-Driver Injection (Python & JavaScript)

CodeRank detects bare function submissions and automatically wraps them with a timing harness. Users can submit a function directly — no `print()` boilerplate required.

```python
# User submits:
def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i

# Input: [2,7,11,15]\n9
# CodeRank auto-injects: stdin parsing + function call + time measurement
# Output: [0, 1]  executionTimeMs: 0.04
```

The injection uses a brace-depth-aware scanner to distinguish top-level statements from function bodies, so existing `print()` calls at the top level are detected and driver injection is skipped.

### Execution Time Measurement

| Language | What's measured |
|----------|----------------|
| Python | Algorithm only — `time.perf_counter()` around the function call |
| JavaScript | Algorithm only — `process.hrtime.bigint()` around the function call |
| Java | Full container time — includes `javac` compilation + JVM startup |
| C++ | Full container time — includes `g++` compilation + process startup |

Java and C++ report honest timings inclusive of compilation — this is the real cost of running those languages and is documented clearly to users.

---

## Security Model

### Container Sandbox

| Constraint | Value | Threat mitigated |
|------------|-------|-----------------|
| User | `nobody` (non-root) | Root privilege exploits |
| Linux capabilities | ALL dropped | Privilege escalation |
| `no-new-privileges` | Enabled | setuid/setgid attacks |
| Network | Disabled | Data exfiltration, package downloads |
| Root filesystem | Read-only | Persistence, file-based attacks |
| `/tmp` tmpfs | 10 MB, `noexec` | Write-then-execute attacks |
| Memory limit | 128 MB (no swap) | Memory exhaustion / OOM bombing |
| CPU quota | 50% of 1 vCPU | CPU starvation DoS |
| PID limit | 50 | Fork bombs |
| Execution timeout | 10 seconds | Infinite loops |

### Authentication Security

- Passwords hashed with **bcrypt** (12 rounds)
- JWT stored in **httpOnly cookie** — inaccessible to JavaScript, immune to XSS
- `sameSite: none` + `secure: true` in production (required for cross-origin Vercel ↔ VPS)
- `sameSite: lax` in development
- Server crashes at startup if `JWT_SECRET` is missing in production

### Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| All routes (baseline) | 100 req | 1 minute |
| `POST /execute` | 10 req | 1 minute |
| `POST /auth/login` | 10 req | 15 minutes |
| `POST /auth/register` | 5 req | 15 minutes |

All limits are Redis-backed and applied per IP address. When the Redis rate limit store is unavailable, requests are allowed through (fail-open) rather than blocking all traffic.

---

## Concurrency & Resource Management

### Concurrency Model

The BullMQ worker runs with `concurrency: 5`, meaning up to 5 Docker containers execute simultaneously. Incoming jobs beyond that are queued in Redis and processed in order. This decouples HTTP request volume from Docker execution throughput — the API accepts submissions instantly (202) regardless of how busy the workers are.

```
Request spike: 50 simultaneous POSTs
  → 50 jobs enqueued immediately
  → 5 jobs start in Docker right away
  → 45 jobs wait in Redis queue
  → as each container finishes, the next job starts
  → all 50 complete without any HTTP timeout or request failure
```

### Resource Isolation

Each job gets:
- Its own ephemeral Docker container (destroyed after execution)
- Its own tmpdir on the host (bind-mounted read-only into the container)
- Strictly bounded memory (128 MB) and CPU (50%)

No shared state between executions. One user's infinite loop or memory bomb cannot affect another user's job.

---

## Design Decisions

### 1. Async queue instead of synchronous HTTP execution

Code execution takes up to 10 seconds. Blocking the HTTP thread that long degrades API throughput and risks client-side timeouts. BullMQ decouples the HTTP layer from Docker execution. The API returns a `jobId` in ~5ms; clients poll until done. This also makes horizontal scaling trivial: add more workers without changing the API layer.

### 2. Fresh container per execution (not container reuse)

Each job runs in a new container, not a warm pool. This guarantees complete state isolation: no residual files, environment variables, or background processes from prior runs. The security boundary is absolute — one submission cannot observe or affect another.

### 3. httpOnly cookies for JWT (not localStorage)

Tokens in `localStorage` are readable by any JavaScript on the page, making them vulnerable to XSS. httpOnly cookies are inaccessible to scripts. The browser sends them automatically with every credentialed request. The tradeoff is that cross-origin cookies require `sameSite: none; Secure` — which requires HTTPS in production.

### 4. Zod schemas as single source of truth

All API request/response shapes are defined as Zod schemas in `@coderank/types`. The API validates with `.parse()` at the boundary. The frontend infers TypeScript types from the same schemas. If a field changes, both sides fail to compile until updated — the type system enforces consistency without duplication.

### 5. Drizzle ORM over Prisma

Drizzle is SQL-first: the schema file maps directly to PostgreSQL types, generated queries are predictable SQL, and there is no implicit N+1 or opaque query builder. Repository pattern keeps all queries in one place per entity, making performance analysis straightforward.

### 6. Result TTL = 5 minutes, not persisted in DB

Execution results are ephemeral — stored in Redis with a 300-second TTL. This keeps the hot path (submit → poll) entirely in-memory without touching PostgreSQL. Long-term execution history (if needed) would require a separate archival strategy, but for this use case the 5-minute window covers all realistic polling scenarios.

### 7. Separate REDIS_URL and QUEUE_REDIS_URL

BullMQ runs a continuous Lua-script polling loop (~10 requests/second). Managed Redis services like Upstash have request quotas (500k/month on the free tier) that BullMQ exhausts in 12–14 hours. The queue Redis must be a standard persistent Redis instance. The app Redis (rate limiting, result caching) remains low-volume and can use a managed service. The split makes this explicit in config.

---

## Project Structure

```
code-rank/
├── apps/
│   ├── api/
│   │   └── src/
│   │       ├── app.ts                  ← Bootstrap: plugins, middleware, routes, startup validation
│   │       ├── db/
│   │       │   ├── schema.ts           ← Drizzle table definitions
│   │       │   └── client.ts           ← PostgreSQL connection
│   │       ├── engine/
│   │       │   ├── docker.service.ts   ← Container lifecycle (create/start/wait/remove)
│   │       │   ├── worker.ts           ← BullMQ worker (concurrency 5)
│   │       │   ├── runner.registry.ts  ← Per-language image + command config
│   │       │   ├── sandbox.config.ts   ← All Docker security constraints (single source of truth)
│   │       │   ├── container-pool.ts   ← Container management utilities
│   │       │   └── runners/
│   │       │       ├── python.runner.ts
│   │       │       ├── node.runner.ts
│   │       │       ├── java.runner.ts
│   │       │       └── cpp.runner.ts
│   │       ├── modules/
│   │       │   ├── auth/               ← register, login, logout, me
│   │       │   ├── execute/            ← submit job, poll result
│   │       │   ├── snippets/           ← CRUD, star, comments
│   │       │   ├── users/              ← profile, follow
│   │       │   └── playground/         ← recents, collections
│   │       ├── repositories/           ← user, snippet, execution, comment repos
│   │       └── common/
│   │           ├── errors/             ← AppError hierarchy, global error handler
│   │           ├── middleware/         ← requireAuth, optionalAuth
│   │           └── utils/              ← response helpers, pagination
│   └── web/
│       ├── app/                        ← Next.js App Router pages
│       │   ├── playground/
│       │   ├── feed/
│       │   ├── s/[slug]/
│       │   ├── profile/[username]/
│       │   ├── war-rooms/              ← UI preview (Coming Soon)
│       │   ├── login/
│       │   └── register/
│       ├── components/
│       │   ├── layout/                 ← NavBar, PageLayout, Footer
│       │   ├── shared/                 ← GlassCard, Modal, Tabs, MetricCard
│       │   └── ui/                     ← Button, Badge, Avatar, Input, Skeleton
│       ├── features/
│       │   ├── auth/                   ← useAuth, login/register forms
│       │   ├── playground/             ← editor, execution, collections, recents
│       │   ├── snippets/               ← feed, card, actions, star, share
│       │   ├── feed/                   ← public snippet discovery
│       │   ├── profile/                ← user profile page
│       │   └── war-rooms/              ← Coming Soon UI prototype
│       └── config/
│           ├── languages.config.ts     ← Supported languages + Monaco mappings
│           ├── editor.config.ts        ← Monaco options + custom dark theme
│           └── navigation.config.ts    ← Nav links, routes
├── packages/
│   ├── types/src/                      ← Zod schemas + inferred TS types (shared)
│   └── config/                         ← ESLint + TypeScript base configs
└── docker/
    ├── compose/docker-compose.dev.yml
    └── runners/
        ├── Dockerfile.python
        ├── Dockerfile.node
        ├── Dockerfile.java
        └── Dockerfile.cpp
```

---

## License

MIT
