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
        Memory: this.parseMemory(SANDBOX.memoryLimit),
        MemorySwap: this.parseMemory(SANDBOX.memorySwap),
        CpuQuota: SANDBOX.cpuQuota,
        CpuPeriod: SANDBOX.cpuPeriod,
        PidsLimit: SANDBOX.pidsLimit,
        NetworkMode: 'none',
        ReadonlyRootfs: SANDBOX.readonlyRootfs,
        AutoRemove: SANDBOX.autoRemove,
        CapDrop: [...SANDBOX.capDrop],
        SecurityOpt: [...SANDBOX.securityOpt],
        Tmpfs: { '/tmp': 'size=10m,noexec' },
        Binds: [`${workdir}:/code:ro`],
      },
      User: SANDBOX.user,
      AttachStdout: true,
      AttachStderr: true,
      StdinOnce: !!stdin,
      OpenStdin: !!stdin,
    })

    try {
      const stream = await container.attach({
        stream: true,
        stdout: true,
        stderr: true,
        stdin: !!stdin,
      })

      if (stdin) {
        stream.write(stdin)
        stream.end()
      }

      await container.start()

      // Collect output with timeout
      const { stdout, stderr } = await this.collectOutput(container, stream)
      const executionTimeMs = Date.now() - startMs

      const info = await container.inspect().catch(() => ({ State: { ExitCode: -1 } }))

      await fs.rm(workdir, { recursive: true, force: true })

      return {
        stdout: stdout.slice(0, SANDBOX.maxOutputBytes),
        stderr: stderr.slice(0, SANDBOX.maxOutputBytes),
        exitCode: info.State.ExitCode,
        executionTimeMs,
      }
    } catch (err) {
      await container.kill().catch(() => {})
      await fs.rm(workdir, { recursive: true, force: true })
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

  private async collectOutput(
    container: Docker.Container,
    stream: NodeJS.ReadWriteStream,
  ): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      const stdoutChunks: Buffer[] = []
      const stderrChunks: Buffer[] = []

      const timeout = setTimeout(async () => {
        await container.kill().catch(() => {})
        resolve({
          stdout: Buffer.concat(stdoutChunks).toString('utf8'),
          stderr: Buffer.concat(stderrChunks).toString('utf8') + '\n[Timed out]',
        })
      }, SANDBOX.timeoutMs)

      container.modem.demuxStream(stream, {
        write: (chunk: Buffer) => stdoutChunks.push(chunk),
      }, {
        write: (chunk: Buffer) => stderrChunks.push(chunk),
      })

      stream.on('end', () => {
        clearTimeout(timeout)
        resolve({
          stdout: Buffer.concat(stdoutChunks).toString('utf8'),
          stderr: Buffer.concat(stderrChunks).toString('utf8'),
        })
      })

      stream.on('error', (err) => {
        clearTimeout(timeout)
        reject(err)
      })
    })
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
