# Phase 11 — Production Readiness Audit

## Deployment Architecture

```
Frontend (Vercel)           Backend (Render)
─────────────────           ────────────────
Next.js 14                  Fastify API
NEXT_PUBLIC_API_URL=...     PORT=3001 (or $PORT)
                            CORS_ORIGIN=https://code-rank-app.vercel.app

                            Neon PostgreSQL (ap-southeast-1)
                            Upstash Redis (rediss:// TLS)
                            Docker socket (Render native Docker)
```

## Environment Variables

### API

| Variable | Required | Default | Notes |
|----------|----------|---------|-------|
| `DATABASE_URL` | Yes | — | Startup fails if missing |
| `REDIS_URL` | Yes | — | Startup fails if missing |
| `JWT_SECRET` | Yes (prod) | dev fallback | Startup crashes in production if missing |
| `CORS_ORIGIN` | Yes (prod) | `http://localhost:3000` | Must match frontend URL exactly |
| `PORT` | No | `3001` | Set by Render automatically |
| `NODE_ENV` | No | — | `production` on Render |
| `LOG_LEVEL` | No | `warn` (prod) | Set to `info` for debugging |

### Frontend

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXT_PUBLIC_API_URL` | Yes | Full URL to API, no trailing slash |

## Startup Validation (after audit fix)

`validateEnv()` in `app.ts` runs before the Fastify app is built:
- Crashes if `DATABASE_URL` or `REDIS_URL` are missing
- Crashes in production if `JWT_SECRET` is missing
- Warns if `JWT_SECRET` < 32 chars

This prevents silent misconfiguration in production.

## Health Check (after audit fix)

`GET /api/v1/health` now:
1. Pings the database with `SELECT 1`
2. Pings Redis with `PING`
3. Returns 200 if both succeed, 503 if either fails

```json
// Healthy
{
  "success": true,
  "data": {
    "status": "ok",
    "checks": { "database": "ok", "redis": "ok" },
    "timestamp": "2026-05-30T..."
  }
}

// Degraded
{ "success": false, "error": { "code": "SERVICE_UNAVAILABLE", "message": "One or more dependencies are unhealthy" } }
```

This allows Render's health check monitor to detect database/Redis connectivity issues.

## Logging

- Fastify built-in JSON logger
- Log level: `warn` in production, `info` in development (configurable via `LOG_LEVEL`)
- Unhandled errors now logged via `request.log.error` with structured context
- No stack traces exposed to clients in production

## Docker Runner Images

- All 4 runner images must be available on the host before the first execution
- Worker pre-pulls images at startup (non-blocking, with fallback per-job pull)
- Images are large (openjdk:21-slim ~300 MB, gcc:13-slim ~1.2 GB) — initial startup slow on cold deploy
- Render's persistent disk or image caching reduces this for subsequent deployments

## Known Production Gaps

| Gap | Severity | Recommendation |
|-----|----------|----------------|
| No metrics export (Prometheus / Grafana) | Medium | Add execution count, queue depth, container boot time metrics in V2 |
| No distributed tracing | Low | OpenTelemetry would enable request tracing across queue → worker → container |
| No alert thresholds | Medium | Set up Render/UptimeRobot alerts on health check endpoint |
| Docker socket exposure | Medium | The API accesses the Docker socket to manage containers. On Render, this is the intended pattern. On a shared multi-tenant host, this would require a Docker-in-Docker or Podman setup. |
| JWT tokens do not expire | Medium | Add `{ expiresIn: '7d' }` to JWT sign calls |

## Assessment: PASS (with noted gaps for V2)
