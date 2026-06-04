# CodeRank — User Flow Summary

---

## Introduction

Hi, I'm Siva. I built CodeRank as my capstone project — a full-stack platform where developers can write code in the browser, execute it securely on a server, and share it with a permanent link.

The idea is simple: you shouldn't need a local setup to test an idea, share a solution, or practice an algorithm. CodeRank gives you a Monaco editor, a sandboxed execution engine that runs code inside Docker containers, and a community layer where snippets can be discovered, starred, and discussed. On top of that, I've built a preview of War Rooms — a competitive coding feature where players battle each other live to solve the same problem first.

The stack is Next.js on the frontend, Fastify on the backend, PostgreSQL for persistence, Redis for the execution queue, and Docker for isolated code execution. Everything is deployed — the API runs on a Ubuntu VPS, the frontend is on Vercel, and the database is on Neon.

What follows is a walkthrough of the five core user flows — what the user does, and what's happening behind the scenes at each step.

---

## 1. Landing Page

The first thing a new visitor sees is the landing page at `/`. It opens with the headline — *Code. Execute. Learn. Rank Higher.* — and two calls to action: **Start Coding for Free** pointing to the playground, and **Explore Snippets** pointing to the feed. No login required to do either.

The page is structured as five sections: a hero, a feature highlights grid, a language showcase, an FAQ, and a closing CTA strip. Behind the scenes, each section isn't hard-coded in the JSX — it's driven by a `LANDING_SECTIONS` configuration array. The page component maps over that array and delegates rendering to a section-type resolver. This keeps the marketing page easy to update without touching layout logic.

On the tech side, this is a **Next.js Server Component** under the `(marketing)` route group — a parallel layout segment that applies a minimal wrapper without the app's main navigation. Because there's no user-specific data on this page, it renders entirely on the server and ships as static HTML. No API calls, no client hydration on first load. Vercel caches it at the edge, so it loads instantly from anywhere in the world.

The language section lists eight languages visually — but only four are live today: Python, JavaScript, Java, and C++. The others are intentional placeholders that signal the roadmap without overpromising.

---

## 2. Register / Sign In

A user lands on CodeRank and clicks **Register**. They fill in a username, email, and password and submit. On the backend, Fastify validates the payload with a Zod schema, hashes the password using **bcrypt at 12 rounds**, creates a row in the `users` table in PostgreSQL, signs a **JWT** containing `{ sub: userId, username }`, and sets it as an **httpOnly cookie** — meaning JavaScript in the browser can never read it directly.

From that point on, every request the browser makes carries that cookie automatically. The API has two middleware helpers — `requireAuth` (blocks unauthenticated requests) and `optionalAuth` (passes the user through if the cookie is valid, silently ignores it if not). Login follows the same path — bcrypt compare, new JWT, new cookie.

The playground, feed, and snippet viewer are fully accessible without an account. Auth only unlocks saving, starring, commenting, and personalised collections.

---

## 2. Playground — Execution, Recents, Collections

The user opens the playground, selects a language, writes some code, and clicks **Run**.

The frontend sends a `POST /execute` with the code, language, and optional stdin. The API **does not run the code immediately**. It generates a `jobId`, stores `{ status: pending }` in Redis, and pushes the job into a **BullMQ queue**. The response back to the browser is a `202` with just the `jobId`.

Behind the scenes, a **BullMQ worker** (up to 5 running in parallel) picks up the job. It writes the code to a temp directory on the host, then calls the Docker API to spin up a language-specific container — Python 3.12, Node 20, Java 21, or GCC 13. The code directory is **bind-mounted read-only** into the container. The container runs with no network, no root, 128MB RAM, a 50-PID limit, and a hard 10-second timeout. Stdout and stderr are streamed out. Once the process exits (or is killed), the worker writes the result back to Redis with a **5-minute TTL** and removes the container.

The frontend polls `GET /execute/:jobId` every 500ms until the status is no longer `pending`. When the result lands, the output, exit code, and execution time render in the panel.

**Recents:** Every execution is auto-saved to a `recents` table in Postgres under the authenticated user. It deduplicates by language + code, keeps a max of 10 entries per user, and prunes the oldest when that limit is exceeded. The sidebar loads these on mount.

**Collections:** The user can create named collections and add code to them manually. These live in `collections` and `collectionItems` tables. Item titles are auto-extracted from code comments or function names. For users who aren't logged in, both recents and collections fall back to **localStorage**.

---

## 3. Snippet Lifecycle

The user writes something worth keeping — clicks **Save Snippet**, fills in a title, and saves. The API creates a row in the `snippets` table with a **10-character nanoid slug** as the unique identifier. That slug becomes the permanent URL: `/s/abc1234xyz`.

Anyone — logged in or not — can open that URL, see the code and metadata, and click **Run** to execute it. Each view increments the `viewsCount` column asynchronously so it doesn't block the response.

Authenticated users can **star** the snippet. Stars are tracked in a `stars` join table with a composite primary key on `(userId, snippetId)`. A toggle endpoint flips the state and updates the `starsCount` counter on the snippet row. Users can also leave **comments** — and replies are supported via a `parentId` self-reference on the `comments` table.

The **Feed** at `/feed` queries the public snippets table with filters (language, sort by stars / recent / views) and cursor-based pagination. Any public snippet lands there automatically.

The owner can update or delete their snippet. Everyone else gets a read-only view.

---

## 4. War Room Lifecycle *(UI Preview)*

War Rooms is a **design prototype** — the full flow is navigable but every screen runs on hardcoded mock data. There is no backend.

The intended flow: a user creates a room from the discovery page, other players join via an invite code, and everyone lands in the **lobby** where the host sees a Start Match button. That kicks off the **nomination phase** — a 15-second countdown where each player submits a LeetCode-style problem. Nominations flow into the **voting phase**, another 15-second countdown where players pick their favourite from the submitted problems. The highest-voted problem is locked in and the **battle workspace** opens.

The battle workspace is the flagship screen — a three-column layout with a collapsible participant sidebar on the left, a Monaco editor and problem statement in the center, and a live leaderboard + chat on the right. Players code, submit, and see each other's progress in real time. The first to get accepted wins. After the timer or a correct submission, the **results screen** shows the winner, achievement cards, and final rankings. Players can then enter **review mode** to read each other's solutions side by side.

What exists today is the complete UI for all of these screens — built, styled, and navigable. What's missing is the real-time backend: WebSocket connections for live state, matchmaking logic, battle state management, and result persistence. That is the next development phase.

---

## Closing

CodeRank started as a requirement to build an online compiler and grew into something I'm genuinely proud of. The execution engine handles real user-submitted code securely. The snippet system makes it persistent and shareable. The community feed adds a discovery layer. And War Rooms lays out where the platform is headed.

Every part of the stack was built and wired together by me — from the Docker sandbox configuration to the BullMQ async queue model, the JWT cookie auth, the Drizzle schema, and the full Next.js frontend. It's production-deployed and working.

The foundation is solid. The next phase is bringing War Rooms to life with real-time WebSockets, and expanding language support beyond the current four.

Thank you for taking the time to review CodeRank.
