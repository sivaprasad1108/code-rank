# Phase 6 — Concurrency Audit

## Queue Architecture

```
Incoming requests → ExecuteService.submit()
                      → BullMQ queue (Redis-backed)
                           → Worker pool (concurrency: 5)
                                → DockerService.runContainer() × 5 simultaneous
```

- **Queue:** BullMQ with Redis as the backing store
- **Worker concurrency:** 5 simultaneous executions
- **Job deduplication:** Each job has a unique UUID — no deduplication (every submission is independent)
- **Job cleanup:** `removeOnComplete: true` — completed jobs are removed from the BullMQ queue (results live in Redis separately with TTL)

## Concurrency Model

### Multiple simultaneous requests

When 10 requests arrive simultaneously:
- All 10 are enqueued immediately (fast, just a Redis write)
- First 5 are picked up by the worker immediately
- Remaining 5 wait in the queue
- As each worker slot frees up, the next job is processed
- Each client polls for their `jobId` independently

### Race conditions analyzed

| Scenario | Risk | Mitigation |
|----------|------|------------|
| Two requests with same jobId | None | jobIds are `randomUUID()` — collision probability negligible |
| Worker reads result before it's written | None | Result is written atomically to Redis; client polls until key exists |
| Redis write failure during submit | Low | Client gets 202 but job may not be queued. BullMQ has retry logic. |
| Container cleanup failure | Low | `Promise.allSettled()` in cleanup — failures are swallowed, container may linger briefly |
| Worker crashes mid-execution | Medium | BullMQ retries failed jobs; `worker.on('failed')` writes error status to Redis |

### Database contention

- View increment (`incrementViews`) is an atomic SQL `UPDATE` — no race condition
- Star toggle uses upsert pattern — idempotent
- Connection pool max: 20 connections with 30s idle timeout — appropriate for this load

## Issues Found

| Issue | Severity | Status |
|-------|----------|--------|
| No max queue depth limit | Low | Under very high load, the Redis queue could grow unbounded. A `maxSize` option on the BullMQ queue would shed load gracefully. Acceptable for V1. |
| Worker concurrency fixed at 5 | Low | Should be configurable via environment variable for tuning in production. |

## Assessment: PASS

The queue-based architecture correctly handles concurrent execution requests. No race conditions exist in the critical path.
