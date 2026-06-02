import type { LanguageRunner } from '../runner.interface'

export class PythonRunner implements LanguageRunner {
  readonly id            = 'python'
  readonly dockerImage   = 'python:3.12-slim'
  readonly fileExtension = 'py'

  buildRunCommand(codePath: string): string[] {
    return ['python3', '-u', codePath]
  }

  wrapWithDriver(code: string, args: unknown[]): string | null {
    // Strip comments, then check if the user already has explicit output
    const stripped = code.replace(/#[^\n]*/g, '')
    if (/^\s*print\s*\(/m.test(stripped)) return null

    const fnName = this.detectFunctionName(code)
    if (!fnName) return null

    // Embed args directly — no stdin piping needed
    const argsJson = JSON.stringify(JSON.stringify(args)) // double-encode for Python string literal
    const driver = `

# ── CodeRank driver ──
import json as _cr_json, time as _cr_time, sys as _cr_sys
_cr_args   = _cr_json.loads(${argsJson})
_cr_times  = []
for _cr_i in range(3):
    _cr_t0 = _cr_time.perf_counter_ns()
    _cr_result = ${fnName}(*_cr_args)
    _cr_t1 = _cr_time.perf_counter_ns()
    _cr_times.append(_cr_t1 - _cr_t0)
_cr_times.sort()
if _cr_result is not None:
    print(_cr_result)
_cr_sys.stderr.write('__CR_TIME__:' + str(_cr_times[1] // 1_000_000) + '\\n')
`

    return code + driver
  }

  private detectFunctionName(code: string): string | null {
    const m = code.match(/(?:^|\n)\s*def\s+(\w+)\s*\(/)
    return m?.[1] ?? null
  }
}
