# CodeRank

A full-stack online code execution platform with multi-language support, Docker sandbox isolation, and real-time code sharing.

**Live:** https://code-rank-app.vercel.app  
**API:** https://code-rank-api.onrender.com

---

## Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Architecture](#architecture)
4. [Tech Stack](#tech-stack)
5. [Getting Started](#getting-started)
6. [Environment Variables](#environment-variables)
7. [API Documentation](#api-documentation)
8. [Execution Engine](#execution-engine)
9. [Security Model](#security-model)
10. [Design Decisions](#design-decisions)
11. [Project Structure](#project-structure)

---

## Overview

CodeRank is a backend-focused engineering platform built around secure, isolated code execution. Users can write and run code in multiple programming languages, save and share snippets, follow other developers, and explore a public feed of code samples.

The system is designed as a case study in:
- RESTful API design
- Docker-based sandbox isolation
- Concurrent job queue processing
- Secure authentication
- Production-grade resource management

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Multi-language execution** | Python, JavaScript, Java, C++ — each in an isolated Docker container |
| **Sandbox isolation** | Non-root user, no network, read-only filesystem, memory + CPU + PID limits |
| **Async job queue** | BullMQ + Redis — submissions are queued, clients poll for results |
| **Code snippets** | Save, share, star, comment, and browse a public feed |
| **Authentication** | JWT in httpOnly cookies — XSS resistant, CSRF protected |
| **Rate limiting** | Per-route Redis-backed limits — brute-force and abuse protection |
| **Driver auto-injection** | Python and JavaScript functions auto-wrapped with a timing harness |

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                  Next.js Frontend (Vercel)                │
│  Playground │ Snippets Feed │ Profile │ Auth              │
└────────────────────────┬─────────────────────────────────┘
                         │ HTTPS + httpOnly cookies
┌────────────────────────▼─────────────────────────────────┐
│                  Fastify REST API (Render)                 │
│                                                           │
│  /auth     /snippets     /users     /execute              │
│                                                           │
│  Rate Limiting (Redis) │ JWT Auth │ Zod Validation        │
└──────┬────────────────────────────────┬───────────────────┘
       │                                │
       ▼                                ▼
 PostgreSQL (Neon)              Redis (Upstash)
 Users, Snippets,               BullMQ job queue
 Executions, Stars,             Execution results (TTL 5min)
 Comments, Follows              Rate limit counters
                                        │
                               ┌────────▼────────┐
                               │  BullMQ Worker   │
                               │  (concurrency 5) │
                               └────────┬─────────┘
                                        │
                       ┌────────────────▼────────────────┐
                       │      Docker Execution Sandbox     │
                       │  python:3.12-slim                 │
                       │  node:20-alpine                   │
                       │  openjdk:21-slim                  │
                       │  gcc:13-slim                      │
                       │  • no network  • read-only rootfs │
                       │  • 128MB RAM   • 50% CPU          │
                       │  • 10s timeout • run as nobody    │
                       └───────────────────────────────────┘
```

---

## Tech Stack

### Backend (`apps/api`)

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 20 |
| Framework | Fastify 4 |
| ORM | Drizzle ORM |
| Database | PostgreSQL 16 (Neon) |
| Cache / Queue | Redis (Upstash) + BullMQ |
| Execution | Dockerode (Docker SDK for Node) |
| Auth | @fastify/jwt (httpOnly cookies) |
| Validation | Zod |
| Language | TypeScript |

### Frontend (`apps/web`)

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Editor | Monaco Editor |
| State | Zustand + TanStack Query |
| Styling | Tailwind CSS + CVA |
| Language | TypeScript |

### Shared (`packages/types`)

Zod schemas for all API payloads — single source of truth for both runtime validation and TypeScript types.

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (for code execution)

### Local Setup

```bash
# 1. Clone and install
git clone <repo-url>
cd code-rank
pnpm install

# 2. Start local PostgreSQL and Redis
docker compose -f docker/compose/docker-compose.dev.yml up -d

# 3. Configure environment
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env — set DATABASE_URL, REDIS_URL, JWT_SECRET

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

---

## Environment Variables

### API (`apps/api/.env`)

```env
# Required
DATABASE_URL=postgresql://coderank:coderank@localhost:5432/coderank_dev
REDIS_URL=redis://localhost:6379

# Required in production (min 32 characters)
JWT_SECRET=your-secret-key-minimum-32-characters-long

# CORS — must match frontend URL exactly, no trailing slash
CORS_ORIGIN=http://localhost:3000

# Optional
PORT=3001
NODE_ENV=development
LOG_LEVEL=info
```

### Frontend (`apps/web/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## API Documentation

**Base URL:** `https://code-rank-api.onrender.com/api/v1`

All responses use a consistent envelope:

```json
{ "success": true,  "data": { ... } }
{ "success": false, "error": { "code": "ERROR_CODE", "message": "Human readable message" } }
```

---

### Authentication

#### `POST /auth/register`
_Rate limit: 5 per 15 minutes per IP_

```json
// Request
{ "username": "alice", "email": "alice@example.com", "password": "securepassword" }

// Response 201
{ "success": true, "data": { "id": "uuid", "username": "alice", "email": "...", "createdAt": "..." } }
```

Errors: `409 CONFLICT` (email/username taken) · `422 VALIDATION_ERROR`

---

#### `POST /auth/login`
_Rate limit: 10 per 15 minutes per IP_

```json
// Request
{ "email": "alice@example.com", "password": "securepassword" }

// Response 200 — sets httpOnly "token" cookie
{ "success": true, "data": { "id": "uuid", "username": "alice", ... } }
```

Errors: `401 UNAUTHORIZED` (invalid credentials)

---

#### `POST /auth/logout`

Clears the auth cookie. `200 { "ok": true }`

---

#### `GET /auth/me` _(auth required)_

Returns the authenticated user's profile.

---

### Code Execution

#### `POST /execute`
_Rate limit: 10 per minute per IP_

```json
// Request
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
| `language` | string | Yes | `python` `javascript` `java` `cpp` |
| `code` | string | Yes | Max 64 KB |
| `stdin` | string | No | Used in single-run mode |
| `testCases` | array | No | Each: `{ stdin, expectedOutput }` |

```json
// Response 202
{ "success": true, "data": { "jobId": "uuid" } }
```

---

#### `GET /execute/:jobId`

Poll until `status` is no longer `pending` or `running`.

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

// Test case result
{
  "success": true,
  "data": {
    "jobId": "uuid",
    "status": "success",
    "passedCount": 2,
    "totalCount": 2,
    "testCaseResults": [
      {
        "index": 0,
        "stdin": "3\n5",
        "stdout": "8\n",
        "exitCode": 0,
        "executionTimeMs": 38,
        "status": "success",
        "passed": true
      }
    ]
  }
}
```

**Execution statuses:**

| Status | Description |
|--------|-------------|
| `pending` | Queued, not yet started |
| `running` | Executing in Docker |
| `success` | Exit code 0 |
| `error` | Non-zero exit or runtime crash |
| `timeout` | Exceeded 10-second limit |
| `wrong_answer` | Test case output mismatch |

---

### Snippets

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/snippets` | Optional | List public snippets (`?language=&sort=stars\|recent\|views&limit=&cursor=`) |
| `POST` | `/snippets` | Optional | Create snippet |
| `GET` | `/snippets/:slug` | Optional | Get snippet (includes `starredByMe` if authenticated) |
| `PUT` | `/snippets/:slug` | Required | Update snippet (owner only) |
| `DELETE` | `/snippets/:slug` | Required | Delete snippet (owner only) |
| `POST` | `/snippets/:slug/star` | Required | Toggle star → `{ starred: true/false }` |
| `GET` | `/snippets/:slug/comments` | None | List comments |
| `POST` | `/snippets/:slug/comments` | Required | Add comment (supports `parentId` for replies) |
| `DELETE` | `/comments/:id` | Required | Delete comment (author only) |

---

### Users

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/users/:username` | Optional | Public profile |
| `GET` | `/users/:username/snippets` | None | User's public snippets |
| `POST` | `/users/:username/follow` | Required | Toggle follow |
| `PATCH` | `/users/me` | Required | Update username/bio |

---

### Health

#### `GET /health`

```json
// 200 — All dependencies healthy
{
  "success": true,
  "data": {
    "status": "ok",
    "checks": { "database": "ok", "redis": "ok" },
    "timestamp": "2026-05-30T12:00:00.000Z"
  }
}

// 503 — A dependency is down
{ "success": false, "error": { "code": "SERVICE_UNAVAILABLE", "message": "One or more dependencies are unhealthy" } }
```

---

## Execution Engine

### Flow

```
POST /execute
  → generate UUID jobId
  → Redis: store { status: 'pending' }
  → BullMQ: enqueue job
  → return { jobId }        ← 202 immediately

Worker (background):
  → pick up job
  → write code to host tmpdir
  → create Docker container with sandbox constraints
  → bind-mount code as /code:ro (read-only)
  → attach stdout/stderr streams
  → start container
  → race: container.wait() vs 10s timeout
  → on timeout: kill container
  → cleanup: remove container + tmpdir
  → Redis: store result { status, stdout, stderr, exitCode, executionTimeMs }

GET /execute/:jobId
  → Redis: GET exec:{jobId}
  → return result or 404
```

### Supported Languages

| Language | Image | Compilation |
|----------|-------|-------------|
| Python 3.12 | `python:3.12-slim` | Interpreted |
| JavaScript | `node:20-alpine` | Interpreted |
| Java 21 | `openjdk:21-slim` | `javac` then `java Main` |
| C++ | `gcc:13-slim` | `g++ -O2` then `./a.out` |

### Auto-Driver Injection

For Python and JavaScript, CodeRank detects function definitions and automatically injects a harness that calls the function and measures its execution time. This means users can submit a bare function — no `print()` or `main()` wrapper needed.

```python
# User submits:
def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i

# With input: [2,7,11,15] and 9
# CodeRank auto-wraps → Output: [0, 1], executionTimeMs: 0.04ms
```

---

## Security Model

### Container Sandbox Constraints

| Constraint | Value | Prevents |
|------------|-------|---------|
| User | `nobody` | Root exploits |
| Capabilities | ALL dropped | Privilege escalation |
| `no-new-privileges` | Enabled | setuid/setgid attacks |
| Network | Disabled | Data exfiltration, downloads |
| Root filesystem | Read-only | Persistence attacks |
| `/tmp` | 10 MB, `noexec` | Write-then-execute escapes |
| Memory | 128 MB hard | Memory exhaustion |
| Swap | Disabled | Memory limit bypass |
| CPU | 50% of 1 vCPU | CPU starvation |
| PID limit | 50 | Fork bombs |
| Timeout | 10 seconds | Infinite loops |

### Auth Security

- Passwords: bcrypt with 12 rounds
- JWT: httpOnly cookie — JavaScript cannot access it
- CSRF: `sameSite: lax` on the cookie
- HTTPS: `secure: true` in production
- Startup: crashes if `JWT_SECRET` is missing in production

### Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| All routes | 100 | 1 minute |
| `POST /execute` | 10 | 1 minute |
| `POST /auth/login` | 10 | 15 minutes |
| `POST /auth/register` | 5 | 15 minutes |

All limits are backed by Redis and apply per IP address.

---

## Design Decisions

### 1. Async queue for execution (not synchronous HTTP)

Code execution can take up to 10 seconds. Blocking the HTTP connection that long degrades perceived performance and risks client timeouts. BullMQ decouples the HTTP layer from Docker execution — clients receive a `jobId` immediately and poll for results. This also makes the system naturally horizontally scalable.

### 2. Fresh Docker container per execution

Each execution runs in a new container rather than reusing a running one. This provides complete state isolation — no residual files, processes, or environment variables from previous runs. The security boundary is absolute: one user's code cannot affect another's.

### 3. httpOnly cookies for JWT

JWTs in `localStorage` are vulnerable to XSS — any injected script can steal the token. httpOnly cookies are inaccessible to JavaScript. The browser sends them automatically on every request to the API, including CORS requests when `credentials: true` is set.

### 4. Zod schemas as single source of truth

`@coderank/types` defines Zod schemas once. These are used:
- API-side: `.parse()` validates all incoming request bodies
- Web-side: TypeScript types are inferred from the same schemas

When a field is added or renamed, both sides fail to compile until updated — the type system enforces consistency.

### 5. Drizzle ORM over Prisma

Drizzle is SQL-first: the schema file defines the exact PostgreSQL types, the generated queries are predictable SQL. No implicit N+1 queries, no opaque query builder, no schema DSL that differs from SQL. The repository pattern keeps all queries in one place per entity.

### 6. `RESULT_TTL_SECONDS = 300` (5 minutes)

Execution results are stored in Redis with a 5-minute TTL. This gives polling clients ample time to retrieve results even if they are slow or the client briefly disconnects. Results are not stored in the database — they are ephemeral. Long-term execution history would require a different storage strategy.

---

## Project Structure

```
code-rank/
├── apps/
│   ├── api/src/
│   │   ├── app.ts                  ← Bootstrap, plugins, startup validation
│   │   ├── db/                     ← schema.ts, client.ts, migrations/
│   │   ├── engine/
│   │   │   ├── docker.service.ts   ← Container lifecycle
│   │   │   ├── worker.ts           ← BullMQ worker
│   │   │   ├── runner.registry.ts  ← Language runner configs
│   │   │   └── sandbox.config.ts   ← All sandbox constraints (single source)
│   │   ├── modules/
│   │   │   ├── auth/               ← router, service
│   │   │   ├── execute/            ← router, service
│   │   │   ├── snippets/           ← router, service
│   │   │   └── users/              ← router, service
│   │   ├── repositories/           ← user, snippet, execution, comment
│   │   └── common/
│   │       ├── errors/             ← AppError hierarchy, error-handler
│   │       ├── middleware/         ← requireAuth, optionalAuth
│   │       └── utils/              ← response helpers
│   └── web/
│       ├── app/                    ← Next.js route pages
│       ├── components/             ← layout/, shared/, ui/
│       ├── features/               ← playground/, snippets/, profile/, comments/
│       └── config/                 ← languages, editor, navigation
├── packages/
│   ├── types/src/                  ← Zod schemas + TS types (shared)
│   └── config/                     ← ESLint + TypeScript base configs
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
