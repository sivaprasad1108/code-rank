import Docker from 'dockerode'
import fs from 'fs/promises'
import os from 'os'
import path from 'path'
import type { LanguageRunner } from './runner.interface'
import { SANDBOX } from './sandbox.config'

export interface ContainerResult {
  stdout: string
  stderr: string
  exitCode: number
  executionTimeMs: number
}

export class DockerService {
  private docker: Docker

  constructor() {
    this.docker = new Docker()
  }

  async runContainer(
    runner: LanguageRunner,
    code: string,
    stdin?: string,
    jobId?: string,
  ): Promise<ContainerResult> {
    const workdir = path.join(os.tmpdir(), `coderank-${jobId ?? Date.now()}`)
    const codeFile = path.join(workdir, `main.${runner.fileExtension}`)

    await fs.mkdir(workdir, { recursive: true })
    await fs.writeFile(codeFile, code, 'utf8')

    const containerCodePath = `/code/main.${runner.fileExtension}`
    const cmd = runner.buildRunCommand(containerCodePath)

    const startMs = Date.now()

    const container = await this.docker.createContainer({
      Image: runner.dockerImage,
      Cmd: cmd,
      HostConfig: {
        Memory:         this.parseMemory(SANDBOX.memoryLimit),
        MemorySwap:     this.parseMemory(SANDBOX.memorySwap),
        CpuQuota:       SANDBOX.cpuQuota,
        CpuPeriod:      SANDBOX.cpuPeriod,
        PidsLimit:      SANDBOX.pidsLimit,
        NetworkMode:    'none',
        ReadonlyRootfs: SANDBOX.readonlyRootfs,
        AutoRemove:     false,          // keep container so we can inspect + remove manually
        CapDrop:        [...SANDBOX.capDrop],
        SecurityOpt:    [...SANDBOX.securityOpt],
        Tmpfs:          { '/tmp': 'size=10m,noexec' },
        Binds:          [`${workdir}:/code:ro`],
      },
      User:         SANDBOX.user,
      AttachStdout: true,
      AttachStderr: true,
      OpenStdin:    !!stdin,
      StdinOnce:    !!stdin,
    })

    try {
      // Attach to output stream BEFORE start so we don't miss any output
      const stream = await container.attach({
        stream: true,
        stdout: true,
        stderr: true,
        stdin:  !!stdin,
      })

      const stdoutChunks: Buffer[] = []
      const stderrChunks: Buffer[] = []

      container.modem.demuxStream(
        stream,
        { write: (chunk: Buffer) => stdoutChunks.push(chunk) },
        { write: (chunk: Buffer) => stderrChunks.push(chunk) },
      )

      await container.start()

      // Write stdin after start
      if (stdin) {
        stream.write(stdin)
        stream.end()
      }

      // Race: container exits vs sandbox timeout
      const timedOut = await Promise.race([
        container.wait().then(() => false as const),
        new Promise<true>((resolve) => setTimeout(() => resolve(true), SANDBOX.timeoutMs)),
      ])

      if (timedOut) {
        await container.kill().catch(() => {})
        // Give demuxStream a tick to flush any buffered output
        await new Promise((r) => setTimeout(r, 50))
        const executionTimeMs = Date.now() - startMs
        await this.cleanup(container, workdir)
        return {
          stdout:          Buffer.concat(stdoutChunks).toString('utf8'),
          stderr:          Buffer.concat(stderrChunks).toString('utf8') + '\n[Timed out]',
          exitCode:        -1,
          executionTimeMs,
        }
      }

      // Brief tick so demuxStream can flush remaining buffered data
      await new Promise((r) => setImmediate(r))

      const info = await container.inspect()
      const exitCode = info.State.ExitCode
      const executionTimeMs = Date.now() - startMs

      await this.cleanup(container, workdir)

      return {
        stdout:          Buffer.concat(stdoutChunks).toString('utf8'),
        stderr:          Buffer.concat(stderrChunks).toString('utf8'),
        exitCode,
        executionTimeMs,
      }
    } catch (err) {
      await container.kill().catch(() => {})
      await this.cleanup(container, workdir)
      throw err
    }
  }

  async ensureImage(imageName: string): Promise<void> {
    try {
      await this.docker.getImage(imageName).inspect()
    } catch {
      await new Promise<void>((resolve, reject) => {
        this.docker.pull(imageName, (err: Error, stream: NodeJS.ReadableStream) => {
          if (err) return reject(err)
          this.docker.modem.followProgress(stream, (err: Error | null) => {
            if (err) reject(err)
            else resolve()
          })
        })
      })
    }
  }

  private async cleanup(container: Docker.Container, workdir: string): Promise<void> {
    await Promise.allSettled([
      container.remove({ force: true }),
      fs.rm(workdir, { recursive: true, force: true }),
    ])
  }

  private parseMemory(str: string): number {
    const match = str.match(/^(\d+)([mg]?)$/i)
    if (!match) return 128 * 1024 * 1024
    const n = parseInt(match[1])
    const unit = match[2].toLowerCase()
    if (unit === 'g') return n * 1024 * 1024 * 1024
    if (unit === 'm') return n * 1024 * 1024
    return n
  }
}
