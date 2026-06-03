# Phase 3 — Execution Engine Audit

## Architecture

```
POST /execute
    → ExecuteService.submit()
        → Redis: set status "pending"
        → BullMQ: enqueue job
        → Return jobId

GET /execute/:jobId
    → ExecuteService.getResult()
        → Redis: GET exec:{jobId}
        → Return JSON result or 404

BullMQ Worker (background)
    → picks up job
    → DockerService.runContainer()
        → create container with sandbox limits
        → attach stdout/stderr streams
        → start container
        → race: container.wait() vs 10s timeout
        → kill on timeout
        → cleanup (remove container + tmpdir)
    → Redis: set result (TTL 300s)
```

## Language Runner Registry

| Language | Image | Compile | Driver Wrapping |
|----------|-------|---------|-----------------|
| python | python:3.12-slim | No | Yes — detects functions, wraps with timing harness |
| javascript | node:20-alpine | No | Yes — IIFE wrapper with timing markers |
| java | openjdk:21-slim | Yes (javac) | No — requires `public class Main` |
| cpp | gcc:13-slim | Yes (g++ -O2) | No — requires `main()` function |

## Sandbox Constraints (sandbox.config.ts)

| Constraint | Value | Purpose |
|------------|-------|---------|
| Memory limit | 128 MB | Prevent memory exhaustion |
| Swap | 128 MB (= limit) | Disable swap (swap = limit) |
| CPU quota | 50% of 1 vCPU | Prevent CPU starvation |
| PID limit | 50 | Prevent fork bombs |
| Execution timeout | 10 seconds | Prevent infinite loops |
| Max output | 1 MB | Prevent stdout flooding |
| Max code | 64 KB | Prevent large payload abuse |
| Network | Disabled | Prevent exfiltration / downloads |
| Filesystem | Read-only root | Prevent filesystem writes |
| /tmp | 10 MB, noexec | Temp space with execution disabled |
| User | nobody | Non-root execution |
| Capabilities | ALL dropped | Minimum privilege |
| Security opt | no-new-privileges | Prevent privilege escalation |

## Execution Flow — Detail

### Code Delivery
1. Code is written to a host tmpdir (`/tmp/coderank-{jobId}/main.{ext}`)
2. tmpdir is bind-mounted into the container as `/code:ro` (read-only)
3. Container runs the command against `/code/main.{ext}`
4. tmpdir is removed after execution regardless of outcome

### Stream Handling
- `container.attach()` is called BEFORE `container.start()` to avoid missing early output
- `modem.demuxStream()` separates stdout and stderr into `Buffer[]` arrays
- After timeout kill, a 50ms delay allows stream buffers to flush before reading

### Timeout Handling
- `Promise.race()` between `container.wait()` and `setTimeout(10s)`
- On timeout: `container.kill()`, then cleanup, then return `stderr += '[Timed out]'`
- `exitCode` is set to `-1` on timeout — clients can detect this

### Cleanup
- `cleanup()` calls `container.remove({ force: true })` and `fs.rm(workdir)`
- Both wrapped in `Promise.allSettled()` — cleanup failure does not propagate
- Also called in the `catch` block to handle unexpected errors

## Driver Harness (Python/JavaScript)

For Python and JavaScript, if the code contains a function definition, the runner detects it and wraps the code with a driver that:
1. Embeds the arguments directly as a JSON literal in the code (no stdin pipe)
2. Calls the function with those arguments
3. Prints the return value
4. Writes `__CR_TIME__:{ns}` to stderr (nanosecond timing of the function call)

The worker extracts and strips the timing marker, reporting `algoTimeMs` (algorithm only) rather than container startup overhead.

## Issues Found

| Issue | Severity | Status |
|-------|----------|--------|
| `RESULT_TTL_SECONDS` was 120s — too short for polling clients | Medium | Fixed: now 300s |
| `RESULT_TTL_SECONDS` duplicated in two files | Low | Fixed: both updated |
| Worker image pre-pull is fire-and-forget — failures only warn | Low | Acceptable — `ensureImage` is also called per-job |
| No container pool in current deployment | Low | Pool code exists but appears unused — `DockerService.runContainer` is called directly |

## Fixes Applied

1. `worker.ts` — `RESULT_TTL_SECONDS` increased to 300
2. `execute.service.ts` — `RESULT_TTL_SECONDS` increased to 300

## Assessment: PASS (after fixes)

The execution engine correctly isolates code, enforces resource limits, handles timeouts, and cleans up after itself. The sandbox configuration is production-grade.
