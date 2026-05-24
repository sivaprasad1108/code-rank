import path from 'path'
import type { LanguageRunner } from '../runner.interface'

export class CppRunner implements LanguageRunner {
  readonly id            = 'cpp'
  readonly dockerImage   = 'gcc:13-slim'
  readonly fileExtension = 'cpp'

  buildRunCommand(codePath: string): string[] {
    const dir = path.dirname(codePath)
    const out = path.join(dir, 'a.out')
    return ['sh', '-c', `g++ -O2 -o ${out} ${codePath} && ${out}`]
  }
}
