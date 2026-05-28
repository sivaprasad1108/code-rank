import Docker from 'dockerode'
import { randomUUID } from 'crypto'
import type { LanguageRunner } from './runner.interface'
import { SANDBOX } from './sandbox.config'
import type { ContainerResult } from './docker.service'

/** Number of warm containers to keep per language */
const POOL_SIZE = 2

export class ContainerPool {
  private readonly docker = new Docker()
  private readonly pools  = new Map<string, Docker.Container[]>()
  private readonly inUse  = new Set<string>()

  /**
   * Pre-spawn idle containers for every runner.
   * Must be called AFTER images are confirmed present.
   */
  async warmUp(runners: LanguageRunner[]): Promise<void> {
    await Promise.allSettled(
      runners.map(async (runner) => {
        const list: Docker.Container[] = []
        for (let n = 0; n < POOL_SIZE; n++) {
          try {
            list.push(await this.spawn(runner))
          } catch (err) {
            console.warn(`[pool] failed to spawn ${runner.id}:`, err)
          }
        }
        this.pools.set(runner.id, list)
        console.log(`[pool] ${runner.id}: ${list.length}/${POOL_SIZE} ready`)
      }),
    )
  }

  /**
   * Run code in a warm container via a single docker exec.
   * Pipes the code through stdin so there is no separate write step.
   * ~20–50ms vs ~150–300ms for docker run.
   */
  async run(runner: LanguageRunner, code: string): Promise<ContainerResult> {
    const container  = await this.acquire(runner.id)
    const startMs    = Date.now()
    const id         = randomUUID()
    const codePath   = `/tmp/${id}/main.${runner.fileExtension}`
    const timeoutSec = Math.ceil(SANDBOX.timeoutMs / 1000)
    const runCmd     = runner.buildRunCommand(codePath)

    // One exec: mkdir + cat (code via stdin) + run + cleanup
    const shellCmd = [
      'sh', '-c',
      `mkdir -p /tmp/${id} && cat > ${codePath} && timeout ${timeoutSec} ${runCmd.join(' ')}; ec=$?; rm -rf /tmp/${id}; exit $ec`,
    ]

    try {
      const { stdout, stderr, exitCode } = await this.execWithInput(container, shellCmd, code)

      const timedOut = exitCode === 124
      this.release(runner.id, container)

      return {
        stdout,
        stderr:          timedOut ? stderr + '\n[Timed out]' : stderr,
        exitCode:        timedOut ? -1 : exitCode,
        executionTimeMs: Date.now() - startMs,
      }
    } catch (err) {
      // Container may be in a bad state — replace it
      await this.replace(runner, container)
      throw err
    }
  }

  async shutdown(): Promise<void> {
    const all = [...this.pools.values()].flat()
    await Promise.allSettled(
      all.map(async (c) => {
        await c.kill().catch(() => {})
        await c.remove({ force: true }).catch(() => {})
      }),
    )
  }

  // ── private ────────────────────────────────────────────────────────────────

  private async spawn(runner: LanguageRunner): Promise<Docker.Container> {
    const c = await this.docker.createContainer({
      Image: runner.dockerImage,
      Cmd:   ['sleep', 'infinity'],
      HostConfig: {
        Memory:         128 * 1024 * 1024,
        MemorySwap:     128 * 1024 * 1024,
        CpuQuota:       SANDBOX.cpuQuota,
        CpuPeriod:      SANDBOX.cpuPeriod,
        PidsLimit:      SANDBOX.pidsLimit,
        NetworkMode:    'none',
        ReadonlyRootfs: true,
        AutoRemove:     false,
        CapDrop:        [...SANDBOX.capDrop],
        SecurityOpt:    [...SANDBOX.securityOpt],
        // exec needs to write code + possibly run compiled binaries in /tmp
        Tmpfs:          { '/tmp': 'size=32m,exec' },
      },
      User: SANDBOX.user,
    })
    await c.start()
    return c
  }

  private async acquire(language: string): Promise<Docker.Container> {
    const pool     = this.pools.get(language) ?? []
    const deadline = Date.now() + 5_000
    while (Date.now() < deadline) {
      const c = pool.find((c) => !this.inUse.has(c.id))
      if (c) { this.inUse.add(c.id); return c }
      await new Promise((r) => setTimeout(r, 30))
    }
    throw new Error(`[pool] no available container for ${language}`)
  }

  private release(language: string, container: Docker.Container): void {
    this.inUse.delete(container.id)
  }

  private async replace(runner: LanguageRunner, container: Docker.Container): Promise<void> {
    const pool = this.pools.get(runner.id)
    const idx  = pool?.indexOf(container) ?? -1
    this.inUse.delete(container.id)
    await container.kill().catch(() => {})
    await container.remove({ force: true }).catch(() => {})
    if (pool && idx !== -1) {
      try { pool[idx] = await this.spawn(runner) } catch {}
    }
  }

  /**
   * Single exec: pipes `input` as stdin so the shell can `cat` it into a file,
   * then runs the program — all in one round-trip.
   */
  private async execWithInput(
    container: Docker.Container,
    cmd:       string[],
    input:     string,
  ): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    const exec = await container.exec({
      Cmd:          cmd,
      AttachStdin:  true,
      AttachStdout: true,
      AttachStderr: true,
      User:         SANDBOX.user,
    })

    const stdoutChunks: Buffer[] = []
    const stderrChunks: Buffer[] = []

    const stream = await exec.start({ hijack: true, stdin: true })

    container.modem.demuxStream(
      stream,
      { write: (c: Buffer) => stdoutChunks.push(c) },
      { write: (c: Buffer) => stderrChunks.push(c) },
    )

    // Write code then close stdin so `cat` sees EOF and the program starts
    stream.write(input)
    stream.end()

    // Poll at 10ms — average wait ≈ 5ms for fast functions
    await new Promise<void>((resolve) => {
      const poll = setInterval(async () => {
        const info = await exec.inspect().catch(() => ({ Running: false }))
        if (!info.Running) { clearInterval(poll); resolve() }
      }, 10)
      // Hard ceiling: sandbox timeout + 2s
      setTimeout(() => { clearInterval(poll); resolve() }, SANDBOX.timeoutMs + 2_000)
    })

    // One event-loop tick so demuxStream can flush remaining buffered data
    await new Promise((r) => setImmediate(r))

    const info = await exec.inspect().catch(() => ({ ExitCode: 0 }))
    return {
      stdout:   Buffer.concat(stdoutChunks).toString('utf8'),
      stderr:   Buffer.concat(stderrChunks).toString('utf8'),
      exitCode: info.ExitCode ?? 0,
    }
  }
}
