import type { LanguageRunner } from '../runner.interface'

export class NodeRunner implements LanguageRunner {
  readonly id            = 'javascript'
  readonly dockerImage   = 'node:20-alpine'
  readonly fileExtension = 'js'

  buildRunCommand(codePath: string): string[] {
    return ['node', codePath]
  }
}
