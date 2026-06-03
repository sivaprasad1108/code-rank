# Phase 4 — Security Audit

## Attack Surface Analysis

### 1. Code Execution Path

**Risk: Remote Code Execution / Sandbox Escape**

Mitigations in place:
- Code runs inside a fresh Docker container per execution (no state sharing)
- Container user: `nobody` (non-root)
- All Linux capabilities dropped (`capDrop: ['ALL']`)
- `no-new-privileges` security option set
- Network completely disabled (`NetworkMode: none`)
- Root filesystem is read-only (`ReadonlyRootfs: true`)
- Only `/tmp` is writable (10 MB, `noexec` — cannot execute files written there)
- PID limit 50 prevents fork bombs
- Memory hard limit 128 MB
- CPU quota 50% of one vCPU
- Execution timeout 10 seconds with forced kill

**Residual risk:** Container runtime vulnerabilities (e.g. CVE-level Docker escapes) are outside the application's control. Using `--security-opt seccomp=default` or a custom seccomp profile would reduce the syscall attack surface further. This is a V2 hardening improvement.

### 2. Command Injection

**Risk: User-provided code or stdin used in shell commands**

Analysis: Code is passed directly as file content to the container via a bind mount — it is never interpolated into a shell command on the host. The container's entrypoint (`python /code/main.py`, `node /code/main.js`, etc.) is a fixed command array, not a shell string. **No command injection risk on the host.**

Inside the container, user code runs in a minimal, network-disabled, read-only environment. Malicious code cannot reach external services or the host filesystem.

### 3. Authentication Security

**JWT Implementation:**
- Secret loaded from `JWT_SECRET` environment variable
- Startup validation added: crashes in production if `JWT_SECRET` is unset; warns if < 32 chars
- Token stored as httpOnly cookie (inaccessible to JavaScript — XSS resistant)
- `sameSite: 'lax'` provides CSRF protection for cross-site navigation
- `secure: true` in production (HTTPS-only cookies)

**Password Storage:**
- bcrypt with 12 rounds — well above the recommended 10
- Login errors return generic "Invalid email or password" (no user enumeration via error messages)

**Token Expiry:**
- No explicit expiry set in the JWT sign call — tokens are long-lived by default
- Recommendation: Add `{ expiresIn: '7d' }` to `this.app.jwt.sign()` in `auth.service.ts`

### 4. Rate Limiting

**Before audit:**
- Global only: 100 req/min all routes

**After audit fixes:**
- Global: 100 req/min (baseline)
- `POST /execute`: 10 req/min (compute-intensive)
- `POST /auth/login`: 10 attempts / 15 min (brute-force protection)
- `POST /auth/register`: 5 registrations / 15 min (spam protection)
- All limits backed by Redis (distributed — works across multiple API instances)

### 5. Input Validation

- All request bodies validated with Zod before reaching the handler
- Code submission capped at 64 KB (`maxCodeBytes` in sandbox config)
- Output capped at 1 MB (`maxOutputBytes`)
- Username capped at 32 chars, email at 255 chars, snippet title at 255 chars

### 6. CORS

- `CORS_ORIGIN` env var controls allowed origin — defaults to `http://localhost:3000`
- Production: set to the exact Vercel domain, no wildcard
- `credentials: true` allows cookies to be sent cross-origin (required for httpOnly cookie auth)

### 7. HTTP Security Headers

`@fastify/helmet` adds:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 0` (modern browsers use CSP instead)
- `Referrer-Policy: no-referrer`
- `Permissions-Policy`
- `Strict-Transport-Security` (HSTS) in production

`contentSecurityPolicy: false` — disabled because Monaco editor requires inline scripts. Acceptable tradeoff for a developer tool.

### 8. Error Information Disclosure

- Production errors return only `{ code, message }` — no stack traces, no internal paths
- Unhandled errors now log with `request.log.error` (structured, goes to log aggregator) instead of `console.error`
- 500 errors return generic "Internal server error"

## Issues Found and Fixed

| Issue | Severity | Fix Applied |
|-------|----------|-------------|
| JWT_SECRET had insecure fallback, no startup check | Critical | Added `validateEnv()` in `app.ts` — crashes in production if unset |
| `/execute` only had global rate limit | High | 10/min per-route limit added |
| `/auth/login` had no brute-force protection | High | 10 attempts / 15 min limit added |
| `/auth/register` had no spam protection | Medium | 5 registrations / 15 min limit added |
| `console.error` leaked unhandled errors without request context | Low | Changed to `request.log.error` |

## Remaining Recommendations (not breaking, V2)

1. Add `{ expiresIn: '7d' }` to JWT sign in `auth.service.ts` — prevents indefinitely valid tokens
2. Add seccomp profile to Docker containers — reduces syscall attack surface
3. Implement token refresh endpoint — needed once token expiry is added
4. Add audit logging for admin-level operations

## Assessment: PASS (after fixes)
