import type { LanguageRunner } from './runner.interface'
import { PythonRunner } from './runners/python.runner'
import { NodeRunner } from './runners/node.runner'
import { JavaRunner } from './runners/java.runner'
import { CppRunner } from './runners/cpp.runner'

export const RUNNER_REGISTRY: Record<string, LanguageRunner> = {
  python:     new PythonRunner(),
  javascript: new NodeRunner(),
  java:       new JavaRunner(),
  cpp:        new CppRunner(),
}

// To add a new language:
// 1. Create engine/runners/<lang>.runner.ts implementing LanguageRunner
// 2. Add an entry here — the entire execution pipeline picks it up automatically
