# CodeRank — Architecture Diagrams

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER'S BROWSER                             │
│                                                                     │
│   Next.js 14 (App Router)          Deployed on Vercel (Edge CDN)   │
│   ┌──────────────┐  ┌───────────┐  ┌──────────┐  ┌─────────────┐  │
│   │  Landing /   │  │Playground │  │  Feed /  │  │  War Rooms  │  │
│   │  Marketing   │  │  Monaco   │  │ Snippets │  │  (Preview)  │  │
│   └──────────────┘  └───────────┘  └──────────┘  └─────────────┘  │
└──────────────────────────────┬──────────────────────────────────────┘
                               │  HTTPS  (httpOnly cookie auth)
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                       UBUNTU VPS  · 161.118.182.142                  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Fastify API  (PM2)  · port 3001                             │   │
│  │                                                              │   │
│  │  /auth    /execute    /snippets    /users    /playground     │   │
│  │                                                              │   │
│  │  Zod validation · JWT middleware · Rate limiting (Redis)     │   │
│  └──────────┬──────────────┬───────────────────────────────────┘   │
│             │              │                                         │
│             ▼              ▼                                         │
│  ┌─────────────────┐  ┌────────────────────────────────────────┐   │
│  │  Redis (Docker) │  │  BullMQ Worker Pool  (5 concurrent)    │   │
│  │                 │  │                                         │   │
│  │  · Rate limits  │  │  Picks up execute jobs from queue       │   │
│  │  · Job queue    │  │  Spins up Docker containers per job     │   │
│  │  · Result TTL   │  │  Writes result back to Redis (5m TTL)  │   │
│  │    (5 min)      │  └──────────────┬─────────────────────────┘   │
│  └─────────────────┘                 │                              │
│                                      ▼                              │
│              ┌───────────────────────────────────────┐             │
│              │        Docker Execution Sandbox        │             │
│              │                                        │             │
│              │  python:3.12-slim   node:20-alpine     │             │
│              │  eclipse-temurin:21 gcc:13             │             │
│              │                                        │             │
│              │  no network · read-only fs · nobody    │             │
│              │  128MB RAM · 50 PIDs · 10s timeout     │             │
│              └───────────────────────────────────────┘             │
└──────────────────────────┬───────────────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
┌─────────────────────┐    ┌────────────────────────┐
│  PostgreSQL (Neon)  │    │   Vercel (Frontend)     │
│  serverless         │    │   Next.js static +      │
│                     │    │   server components     │
│  users              │    │   Edge CDN delivery     │
│  snippets           │    └────────────────────────┘
│  stars · comments   │
│  collections        │
│  recents            │
└─────────────────────┘
```

---

## 2. Code Execution Flow

```
Browser                  Fastify API              Redis           BullMQ Worker        Docker
  │                           │                     │                  │                  │
  │── POST /execute ─────────►│                     │                  │                  │
  │   { code, language }      │                     │                  │                  │
  │                           │── SET exec:{id}    ►│                  │                  │
  │                           │   { status:pending }│                  │                  │
  │                           │── enqueue job ─────────────────────►  │                  │
  │◄── 202 { jobId } ─────────│                     │                  │                  │
  │                           │                     │                  │                  │
  │  (poll every 500ms)       │                     │                  │                  │
  │── GET /execute/:id ──────►│                     │                  │                  │
  │◄── { status: pending } ───│                     │                  │                  │
  │                           │                     │                  │                  │
  │                           │                     │  dequeue job ◄───│                  │
  │                           │                     │                  │── docker run ──►│
  │                           │                     │                  │   bind-mount     │
  │                           │                     │                  │   code read-only │
  │                           │                     │                  │                  │
  │                           │                     │                  │◄── stdout/stderr─│
  │                           │                     │                  │    exitCode       │
  │                           │                     │◄── SET result ───│                  │
  │                           │                     │    (TTL 5min)    │── rm container ─►│
  │                           │                     │                  │                  │
  │── GET /execute/:id ──────►│                     │                  │                  │
  │                           │── GET exec:{id} ───►│                  │                  │
  │                           │◄── { status:success }                  │                  │
  │◄── { stdout, time, ... }──│                     │                  │                  │
```

---

## 3. Authentication Flow

```
Browser                        Fastify API                  PostgreSQL
  │                                 │                            │
  │  ── POST /auth/register ───────►│                            │
  │     { username, email, pwd }    │                            │
  │                                 │── INSERT users ───────────►│
  │                                 │   bcrypt(pwd, 12)          │
  │                                 │◄── user row ───────────────│
  │                                 │                            │
  │                                 │  sign JWT { sub, username }│
  │◄── 201 + Set-Cookie: token ─────│  httpOnly · secure         │
  │          (JWT, httpOnly)        │  sameSite: none (prod)     │
  │                                 │                            │
  │  ── GET /auth/me ─────────────►│                            │
  │     Cookie: token=...           │  verify JWT                │
  │◄── { id, username, email } ────│  attach req.user           │
  │                                 │                            │
  │  ── POST /auth/logout ─────────►│                            │
  │◄── 200 + Clear-Cookie ──────────│                            │


  requireAuth   → rejects if no/invalid cookie   → 401
  optionalAuth  → attaches user if valid, skips if missing → always passes
```

---

## 4. Snippet Lifecycle

```
Browser                   Fastify API              PostgreSQL            Anyone
  │                            │                       │                    │
  │── POST /snippets ─────────►│                       │                    │
  │   { title, code, lang }    │── INSERT snippets ───►│                    │
  │                            │   slug = nanoid(10)   │                    │
  │◄── { slug: "abc1234xyz" }──│◄── row ───────────────│                    │
  │                            │                       │                    │
  │  Share URL: /s/abc1234xyz  │                       │                    │
  │                            │                       │         ── GET /snippets/abc1234xyz ──►│
  │                            │                       │◄── snippet row ────────────────────────│
  │                            │                       │   viewsCount++ (async)                 │
  │                            │                       │         ◄── { code, title, lang } ─────│
  │                            │                       │                    │
  │── POST /snippets/:slug/star►│                       │                    │
  │   (requires auth)          │── UPSERT stars ──────►│                    │
  │                            │   snippets.starsCount++                    │
  │◄── { starred: true } ──────│                       │                    │
  │                            │                       │                    │
  │── POST /snippets/:slug/    │                       │                    │
  │        comments            │── INSERT comments ───►│                    │
  │   { body, parentId? }      │   supports replies    │                    │
  │◄── { comment } ────────────│   via parentId        │                    │
```

---

## 5. Database Schema

```
┌────────────────┐        ┌────────────────────┐        ┌────────────────┐
│     users      │        │      snippets       │        │    comments    │
│────────────────│        │────────────────────│        │────────────────│
│ id (PK)        │──┐     │ id (PK)             │──┐     │ id (PK)        │
│ username       │  │     │ slug (unique)        │  │     │ snippetId (FK) │
│ email          │  │     │ userId (FK) ─────────┘  │     │ userId (FK)    │
│ passwordHash   │  └────►│ title                   │     │ parentId (FK)  │◄─self
│ avatarUrl      │        │ description             │     │ body           │
│ bio            │        │ language                │     │ createdAt      │
│ createdAt      │        │ code                    │     └────────────────┘
└────────────────┘        │ isPublic                │
        │                 │ starsCount              │     ┌────────────────┐
        │                 │ viewsCount              │     │     stars      │
        │                 │ createdAt               │     │────────────────│
        │                 └────────────────────────┘     │ userId (FK)    │
        │                            │                    │ snippetId (FK) │
        │                            └───────────────────►│ (composite PK) │
        │                                                 └────────────────┘
        │
        ├──────────────────────────────────────────────────────────────────
        │
        ▼
┌────────────────┐    ┌──────────────────┐    ┌─────────────────────────┐
│    recents     │    │   collections    │    │    collectionItems      │
│────────────────│    │──────────────────│    │─────────────────────────│
│ id (PK)        │    │ id (PK)           │    │ id (PK)                 │
│ userId (FK)    │    │ userId (FK)       │    │ collectionId (FK)       │
│ title          │    │ name             │    │ title                   │
│ language       │    │ createdAt        │    │ language                │
│ code           │    └──────────────────┘    │ code                    │
│ createdAt      │             │              │ createdAt               │
└────────────────┘             └─────────────►└─────────────────────────┘
  max 10/user
  deduped by
  (lang + code)
```

---

## 6. Request Rate Limiting

```
All routes         ──  100 req / 1 min  / IP
POST /execute      ──   10 req / 1 min  / IP
POST /auth/login   ──   10 req / 15 min / IP
POST /auth/register──    5 req / 15 min / IP

Backed by Redis · Fail-open if Redis unavailable
```

---

## 7. Deployment Topology

```
                        ┌──────────────────────────────┐
                        │         Vercel (CDN)          │
                        │   Next.js 14 · App Router     │
                        │   Edge-cached static pages    │
                        │   NEXT_PUBLIC_API_URL ──────┐ │
                        └────────────────────────────┼─┘
                                                      │ HTTPS
                        ┌─────────────────────────────▼──────────────────┐
                        │            Ubuntu VPS  (161.118.182.142)        │
                        │                                                  │
                        │  ┌─────────────────────────────────────────┐   │
                        │  │  PM2  →  node dist/app.js  (port 3001)  │   │
                        │  │  started from apps/api/ (dotenv path)   │   │
                        │  └─────────────────────────────────────────┘   │
                        │                                                  │
                        │  ┌─────────────────────────────────────────┐   │
                        │  │  Docker                                  │   │
                        │  │  · coderank-redis  (Redis 7, port 6379) │   │
                        │  │  · python:3.12-slim  (pre-pulled)       │   │
                        │  │  · node:20-alpine    (pre-pulled)       │   │
                        │  │  · eclipse-temurin:21                   │   │
                        │  │  · gcc:13                               │   │
                        │  └─────────────────────────────────────────┘   │
                        └──────────────────────────────────────────────────┘
                                              │
                              ┌───────────────┴────────────────┐
                              ▼                                 ▼
                   ┌─────────────────────┐          ┌──────────────────┐
                   │   Neon (Postgres)   │          │  REDIS_URL       │
                   │   serverless pool   │          │  app caching +   │
                   │   DATABASE_URL      │          │  rate limits     │
                   │                     │          │                  │
                   │   QUEUE_REDIS_URL  ─┼──────────►  BullMQ only    │
                   │   (persistent,      │          │  ~10 req/s       │
                   │    not Upstash)     │          │  Lua scripts     │
                   └─────────────────────┘          └──────────────────┘
```

---

## 8. Frontend Feature Module Structure

```
apps/web/
├── app/                          Next.js App Router pages (thin shells)
│   ├── (marketing)/page.tsx      Landing — server component, static
│   ├── playground/page.tsx       Playground
│   ├── feed/page.tsx             Snippet discovery
│   ├── s/[slug]/page.tsx         Snippet viewer
│   ├── profile/[username]/       User profile
│   ├── login/ · register/        Auth forms
│   └── war-rooms/                War Rooms (UI preview)
│
├── features/                     Domain feature modules
│   ├── playground/               Editor, execution, collections, recents
│   ├── snippets/                 Snippet cards, detail, share
│   └── war-rooms/                Battle UI, lobby, results (mock data)
│
├── components/
│   ├── layout/                   NavBar, PageLayout, Sidebar
│   ├── shared/                   GlassCard, Tabs, Modal, MetricCard
│   └── ui/                       Button, Badge, Avatar, Input, Spinner
│
└── lib/
    ├── api/                      Typed fetch wrappers, endpoints, query keys
    └── utils/                    cn(), formatters
```
