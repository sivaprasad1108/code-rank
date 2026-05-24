import type { LanguageRunner } from '../runner.interface'

export class PythonRunner implements LanguageRunner {
  readonly id            = 'python'
  readonly dockerImage   = 'python:3.12-slim'
  readonly fileExtension = 'py'

  buildRunCommand(codePath: string): string[] {
    return ['python3', '-u', codePath]
  }
}
