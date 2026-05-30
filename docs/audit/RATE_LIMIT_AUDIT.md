# Phase 9 — Rate Limiting & Abuse Prevention Audit

## Rate Limit Configuration (after audit fixes)

| Route | Limit | Window | Purpose |
|-------|-------|--------|---------|
| All routes (global) | 100 req | 1 minute | Baseline protection |
| `POST /execute` | 10 req | 1 minute | CPU-intensive; prevents execution flood |
| `POST /auth/login` | 10 req | 15 minutes | Brute-force password attack prevention |
| `POST /auth/register` | 5 req | 15 minutes | Account spam prevention |

## Implementation

- Plugin: `@fastify/rate-limit`
- Storage: Redis (distributed — works correctly across multiple API instances)
- Key: IP address (`request.ip`)
- Exceeded response: HTTP 429 with `{ success: false, error: { code: "RATE_LIMIT_EXCEEDED", message: "Too many requests. Please try again later." } }`

## Per-Route Override Mechanism

`@fastify/rate-limit` supports per-route config via `config.rateLimit`:

```typescript
app.post('/execute', {
  config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
  handler: ...
})
```

This overrides the global limit for that specific route.

## Abuse Scenarios Covered

| Attack | Mitigation |
|--------|-----------|
| Password brute force | Login limited to 10 attempts / 15 min per IP |
| Account registration spam | Register limited to 5 / 15 min per IP |
| Execution flooding (DoS via CPU) | Execute limited to 10 / min per IP |
| General API abuse | Global 100 / min per IP |
| Cross-instance rate limit bypass | Redis-backed counters — shared across all instances |

## Issues Found and Fixed

| Issue | Severity | Fix |
|-------|----------|-----|
| `/execute` only covered by global 100/min | High | 10/min per-route limit added |
| Auth endpoints no brute-force protection | High | Per-route limits added to login and register |
| Rate limit key not explicit | Low | Added `keyGenerator: (req) => req.ip` to global config for clarity |

## Remaining Considerations

- **Authenticated users** currently share IP-based rate limits with unauthenticated users behind the same NAT/proxy. Adding user-ID based rate limiting for authenticated routes would be more precise.
- **Execution quota per user:** An authenticated user making 10 execute calls/minute is the same limit as an anonymous one. Consider higher limits for authenticated users in V2.

## Assessment: PASS (after fixes)
