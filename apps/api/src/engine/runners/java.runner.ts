import type { LanguageRunner } from '../runner.interface'

export class JavaRunner implements LanguageRunner {
  readonly id            = 'java'
  readonly dockerImage   = 'eclipse-temurin:21-jdk-alpine'
  readonly fileExtension = 'java'

  buildRunCommand(codePath: string): string[] {
    // /code is read-only; copy to /tmp/Main.java so javac can write .class files
    return ['sh', '-c', `cp ${codePath} /tmp/Main.java && javac /tmp/Main.java && java -cp /tmp Main`]
  }
}
