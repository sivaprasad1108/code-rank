import path from 'path'
import type { LanguageRunner } from '../runner.interface'

export class JavaRunner implements LanguageRunner {
  readonly id            = 'java'
  readonly dockerImage   = 'eclipse-temurin:21-jdk-alpine'
  readonly fileExtension = 'java'

  buildRunCommand(codePath: string): string[] {
    const dir = path.dirname(codePath)
    // Compile then run; class name must be Main
    return ['sh', '-c', `javac ${codePath} && java -cp ${dir} Main`]
  }
}
