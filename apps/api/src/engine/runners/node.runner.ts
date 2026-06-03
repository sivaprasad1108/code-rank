import type { LanguageRunner } from '../runner.interface'

export class NodeRunner implements LanguageRunner {
  readonly id            = 'javascript'
  readonly dockerImage   = 'node:20-alpine'
  readonly fileExtension = 'js'

  buildRunCommand(codePath: string): string[] {
    return ['node', codePath]
  }

  wrapWithDriver(code: string, args: unknown[]): string | null {
    // Build stdin lines from args and embed them directly in the code so the
    // container never needs Docker stdin piped.  This also gives users a
    // global input() / readline() / lines without any require() boilerplate.
    const stdinLines = args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a)))

    const preamble = `;(function(){
  var __lines = ${JSON.stringify(stdinLines)};
  var __idx   = 0;
  global.input    = function(){ return __idx < __lines.length ? __lines[__idx++] : '' };
  global.readline = global.input;
  global.lines    = __lines;
})();\n`

    // Strip comments before structural analysis
    const stripped = code
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/[^\n]*/g, '')

    // If console.log appears at brace-depth 0 the user handles their own output.
    // Just prepend the stdin helpers and run the code as-is.
    if (this.hasTopLevel(stripped, /console\.log\s*\(/)) {
      return preamble + code
    }

    const fnName = this.detectFunctionName(code)
    if (!fnName) {
      // No detectable top-level function — add helpers and run as-is
      return preamble + code
    }

    // Full driver: auto-call the function with the provided args, time it 3×,
    // then print the return value (if any) and emit the timing marker.
    const driver = `
// ── CodeRank driver ──
;(() => {
  const __args  = ${JSON.stringify(args)}
  const __times = []
  let __result
  for (let __i = 0; __i < 3; __i++) {
    const __t0 = process.hrtime.bigint()
    __result   = ${fnName}(...__args)
    const __t1 = process.hrtime.bigint()
    __times.push(Number(__t1 - __t0))
  }
  __times.sort((a, b) => a - b)
  if (__result !== undefined && __result !== null) {
    const __out = typeof __result === 'object' ? JSON.stringify(__result) : String(__result)
    process.stdout.write(__out + '\\n')
  }
  process.stderr.write('__CR_TIME__:' + Math.round(__times[1] / 1_000_000) + '\\n')
})()`

    return preamble + code + driver
  }

  /**
   * Returns true if `pattern` matches somewhere at brace-depth 0
   * (i.e. not inside a function / class / block body).
   * Skips string literals to avoid false positives.
   */
  private hasTopLevel(code: string, pattern: RegExp): boolean {
    let depth = 0
    let inStr  = false
    let strCh  = ''
    let i      = 0
    while (i < code.length) {
      const ch = code[i]
      if (inStr) {
        if (ch === '\\') { i += 2; continue }
        if (ch === strCh) inStr = false
        i++; continue
      }
      if (ch === '"' || ch === "'" || ch === '`') {
        inStr = true; strCh = ch; i++; continue
      }
      if (ch === '{') { depth++; i++; continue }
      if (ch === '}') { depth--; i++; continue }
      if (depth === 0 && pattern.test(code.slice(i))) return true
      i++
    }
    return false
  }

  private detectFunctionName(code: string): string | null {
    const patterns = [
      /(?:^|\n)(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?function/,
      /(?:^|\n)(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?\(/,
      /(?:^|\n)(?:async\s+)?function\s+(\w+)\s*\(/,
    ]
    for (const p of patterns) {
      const m = code.match(p)
      if (m?.[1]) return m[1]
    }
    return null
  }
}
