# Phase 1 — Architecture Audit

## Folder Structure

```
code-rank/
├── apps/
│   ├── api/                  ← Express-style REST API (Fastify + Node.js)
│   │   └── src/
│   │       ├── app.ts        ← App bootstrap, plugin registration, startup validation
│   │       ├── db/           ← Drizzle ORM: client, schema, migrations
│   │       ├── engine/       ← Execution engine: Docker, workers, runners, sandbox config
│   │       ├── modules/      ← Feature modules: auth, execute, snippets, users
│   │       ├── repositories/ ← Data access layer (one class per entity)
│   │       └── common/       ← Shared: errors, middleware, utils
│   └── web/                  ← Next.js 14 App Router frontend
│       ├── app/              ← Route pages
│       ├── components/       ← Shared UI components (layout, shared, ui/)
│       ├── config/           ← Languages, editor, navigation config
│       └── features/         ← Feature modules: playground, snippets, profile, comments
├── packages/
│   ├── types/                ← @coderank/types — Zod schemas, shared TypeScript types
│   └── config/               ← Shared ESLint + TypeScript configs
└── docker/
    ├── compose/              ← docker-compose for local development
    └── runners/              ← Hardened Dockerfiles for each language runner
```

## Strengths

- **Clear module boundaries** — Each feature has its own router, service, and schema. No cross-module imports between feature modules.
- **Repository pattern** — All database queries are isolated in `repositories/`. Services never call Drizzle directly.
- **Single source of truth for types** — `@coderank/types` owns all Zod schemas and TypeScript interfaces. The API validates with Zod; the web imports the same types.
- **Separation of concerns in the engine** — `DockerService` (container lifecycle), `runner.registry.ts` (language config), `sandbox.config.ts` (constraints), and `worker.ts` (BullMQ job processor) are each in their own file with a single responsibility.
- **Config driven** — Languages, editor settings, and navigation are defined in config files, not scattered across components.

## Weaknesses Found

| Item | Severity | Detail |
|------|----------|--------|
| No `index.ts` barrel per module in the API | Low | Importing from deep paths (`@/modules/auth/auth.router`) is acceptable but barrel exports would be cleaner |
| GitHub OAuth fields in schema but no implementation | Low | `githubId` column, `GITHUB_*` env vars, and `findByGithubId` repo method exist but are dead code |
| `RESULT_TTL_SECONDS` was duplicated in `execute.service.ts` and `worker.ts` | Fixed | Both now share the same value; a future improvement would be a shared constant |

## Fixes Applied

- None required at the structural level — architecture is clean.

## Assessment: PASS

The monorepo structure, module boundaries, and dependency flow are well-designed and appropriate for this project scope.
