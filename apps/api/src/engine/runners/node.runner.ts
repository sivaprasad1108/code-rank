import type { LanguageRunner } from '../runner.interface'

export class NodeRunner implements LanguageRunner {
  readonly id            = 'javascript'
  readonly dockerImage   = 'node:20-alpine'
  readonly fileExtension = 'js'

  buildRunCommand(codePath: string): string[] {
    return ['node', codePath]
  }

  wrapWithDriver(code: string, args: unknown[]): string | null {
    // Strip comments, then check if the user already has explicit output
    const stripped = code
      .replace(/\/\*[\s\S]*?\*\//g, '')   // block comments
      .replace(/\/\/[^\n]*/g, '')          // line comments
    if (/console\.log\s*\(/.test(stripped)) return null

    const fnName = this.detectFunctionName(code)
    if (!fnName) return null

    // Embed args directly — no stdin piping needed
    const driver = `
// ── CodeRank driver ──
;(() => {
  const __args = ${JSON.stringify(args)}
  const __t0   = process.hrtime.bigint()
  const __result = ${fnName}(...__args)
  const __t1   = process.hrtime.bigint()
  if (__result !== undefined && __result !== null) {
    const __out = typeof __result === 'object' ? JSON.stringify(__result) : String(__result)
    process.stdout.write(__out + '\\n')
  }
  process.stderr.write('__CR_TIME__:' + Number((__t1 - __t0) / 1_000_000n) + '\\n')
})()`

    return code + driver
  }

  private detectFunctionName(code: string): string | null {
    const patterns = [
      /(?:^|\n)\s*(?:async\s+)?function\s+(\w+)\s*\(/,
      /(?:^|\n)\s*(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?function/,
      /(?:^|\n)\s*(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?\(/,
    ]
    for (const p of patterns) {
      const m = code.match(p)
      if (m?.[1]) return m[1]
    }
    return null
  }
}
