import type { LanguageRunner } from '../runner.interface'

export class JavaRunner implements LanguageRunner {
  readonly id            = 'java'
  readonly dockerImage   = 'eclipse-temurin:21-jdk-alpine'
  readonly fileExtension = 'java'

  buildRunCommand(codePath: string): string[] {
    // Compile to /tmp (read-only /code), then time only the JVM execution
    return ['sh', '-c', [
      `cp ${codePath} /tmp/Main.java`,
      `javac /tmp/Main.java`,
      `start=$(awk '{print int($1*1000)}' /proc/uptime)`,
      `java -cp /tmp Main`,
      `ec=$?`,
      `end=$(awk '{print int($1*1000)}' /proc/uptime)`,
      `echo "__CR_TIME__:$((end - start))" >&2`,
      `exit $ec`,
    ].join(' && ')]
  }
}
