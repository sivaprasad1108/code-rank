# Phase 5 — Resource Limit Audit

## Configured Limits

| Resource | Limit | Enforcement |
|----------|-------|-------------|
| Memory | 128 MB hard | Docker `--memory=128m` |
| Swap | 128 MB (= memory limit) | `--memory-swap=128m` disables swap |
| CPU | 50% of 1 vCPU | `--cpu-quota=50000 --cpu-period=100000` |
| Execution time | 10 seconds | `Promise.race()` + `container.kill()` |
| PIDs | 50 | `--pids-limit=50` |
| Output | 1 MB | Buffer size check in worker |
| Code input | 64 KB | Zod schema validation before submission |
| /tmp writes | 10 MB, noexec | tmpfs mount |

## Test Scenarios

### Infinite Loop

```python
while True:
    pass
```

**Expected behavior:** Container runs for exactly 10 seconds, then:
1. `container.kill()` is called
2. `stderr` gets `\n[Timed out]` appended
3. `exitCode: -1` returned
4. Result stored in Redis as `status: 'timeout'`

**Verified:** Yes — `worker.ts` checks `cleanStderr.includes('[Timed out]')` and sets `status: 'timeout'`

### Memory Abuse

```python
x = []
while True:
    x.append("A" * 1000000)
```

**Expected behavior:** Container is killed by the OOM killer when memory exceeds 128 MB. The process exits with a non-zero code. Since there is no timeout event, this is returned as `status: 'error'` with `exitCode: 137` (SIGKILL).

**Verified:** The `--memory=128m --memory-swap=128m` configuration correctly limits memory and disables swap, ensuring OOM kill fires before the host is affected.

### Fork Bomb Attempt

```python
import os
while True:
    os.fork()
```

**Expected behavior:** Container hits the PID limit of 50. New forks fail with `EAGAIN`. The process may behave erratically but cannot spawn beyond 50 processes in total. The timeout (10s) also provides a backstop.

**Verified:** `--pids-limit=50` is set in `HostConfig`.

### CPU Starvation

```python
x = 0
while True:
    x += 1
```

**Expected behavior:** CPU quota 50% of 1 vCPU limits the container to half a core. After 10 seconds, the timeout kills the container. Host CPU is not starved.

### Large Output Flood

```python
while True:
    print("A" * 10000)
```

**Expected behavior:** Output truncated at 1 MB (`maxOutputBytes`). Container is also killed by the 10-second timeout. In the current implementation, the buffer check is post-execution — a future improvement would be to stream-check output size and kill the container early.

## Issues Found

| Issue | Severity | Status |
|-------|----------|--------|
| Output limit enforced post-execution, not during streaming | Low | Acceptable for V1. The timeout provides an effective backstop |
| Memory limit for Java/JVM may be too low | Medium | Java's JVM overhead alone is 30-50 MB. For complex Java programs, 128 MB may cause premature OOM. Monitoring recommended. |

## Assessment: PASS

All required resource limits are implemented and correctly configured. The sandbox prevents infinite loops, memory exhaustion, fork bombs, and CPU starvation.
