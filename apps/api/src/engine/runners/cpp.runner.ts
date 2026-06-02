import type { LanguageRunner } from '../runner.interface'

export class CppRunner implements LanguageRunner {
  readonly id            = 'cpp'
  readonly dockerImage   = 'gcc:13'
  readonly fileExtension = 'cpp'

  buildRunCommand(codePath: string): string[] {
    // Compile to /build (exec-allowed tmpfs), then time only the binary execution
    return ['sh', '-c', [
      `g++ -O2 -o /build/a.out ${codePath}`,
      `start=$(awk '{print int($1*1000)}' /proc/uptime)`,
      `/build/a.out`,
      `ec=$?`,
      `end=$(awk '{print int($1*1000)}' /proc/uptime)`,
      `echo "__CR_TIME__:$((end - start))" >&2`,
      `exit $ec`,
    ].join(' && ')]
  }
}
