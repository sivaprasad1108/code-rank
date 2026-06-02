import type { LanguageRunner } from '../runner.interface'

export class CppRunner implements LanguageRunner {
  readonly id            = 'cpp'
  readonly dockerImage   = 'gcc:13'
  readonly fileExtension = 'cpp'

  buildRunCommand(codePath: string): string[] {
    // /code is read-only; write compiled binary to /tmp
    return ['sh', '-c', `g++ -O2 -o /build/a.out ${codePath} && /build/a.out`]
  }
}
