'use client'

import React, { useState } from 'react'
import {
  CheckCircle2, XCircle, Clock, AlertTriangle,
  Terminal, FileText, BarChart2, ChevronRight,
  Plus, Trash2, ChevronDown,
} from 'lucide-react'
import type { TestCaseResult } from '@coderank/types'
import { cn } from '@/lib/utils/cn'
import { formatMs } from '@/lib/utils/format'
import { Spinner } from '@/components/ui/Spinner'
import { useEditorStore } from '../store/editor.store'

type OutputTab = 'output' | 'input' | 'logs'

const TABS: { id: OutputTab; label: string; icon: React.ReactNode }[] = [
  { id: 'output', label: 'Output',  icon: <Terminal size={12} /> },
  { id: 'input',  label: 'Input',   icon: <FileText size={12} /> },
  { id: 'logs',   label: 'Logs',    icon: <BarChart2 size={12} /> },
]

const STATUS_CONFIG = {
  success: {
    icon:      <CheckCircle2 size={14} className="text-success" />,
    label:     'Succeeded',
    className: 'text-success bg-success/10 border-success/20',
  },
  error: {
    icon:      <XCircle size={14} className="text-error" />,
    label:     'Failed',
    className: 'text-error bg-error/10 border-error/20',
  },
  timeout: {
    icon:      <Clock size={14} className="text-warning" />,
    label:     'Timed Out',
    className: 'text-warning bg-warning/10 border-warning/20',
  },
  wrong_answer: {
    icon:      <XCircle size={14} className="text-warning" />,
    label:     'Wrong Answer',
    className: 'text-warning bg-warning/10 border-warning/20',
  },
  pending: {
    icon:      <Spinner size="sm" />,
    label:     'Running',
    className: 'text-text-muted bg-bg-elevated border-border',
  },
  running: {
    icon:      <Spinner size="sm" />,
    label:     'Running',
    className: 'text-text-muted bg-bg-elevated border-border',
  },
}

function getStatusCfg(status: string) {
  return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.error
}

export function OutputPanel() {
  const { output, isRunning, language, testCases, addTestCase, removeTestCase, updateTestCase } =
    useEditorStore()
  const [activeTab, setActiveTab] = useState<OutputTab>('output')
  const [expandedCases, setExpandedCases] = useState<Set<number>>(new Set())

  // Auto-expand all cases whenever new results arrive
  const prevResultRef = React.useRef(output)
  if (output !== prevResultRef.current) {
    prevResultRef.current = output
    if (output?.testCaseResults) {
      setExpandedCases(new Set(output.testCaseResults.map((r) => r.index)))
    }
  }

  const isMultiCase = !!output?.testCaseResults

  const overallStatusCfg = output ? getStatusCfg(output.status) : null

  return (
    <div className="flex flex-col h-full bg-bg-surface border-l border-border">

      {/* ── Header card ── */}
      <div className="border-b border-border bg-bg-elevated shrink-0">
        <div className="px-5 py-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Execution Result
          </span>
          {output && (
            <button className="text-[10px] text-accent hover:text-accent-light transition-colors flex items-center gap-0.5">
              View Full Report <ChevronRight size={10} />
            </button>
          )}
        </div>

        <div className="px-5 pb-4">
          {isRunning && (
            <div className="flex items-center gap-2 py-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-overlay border border-border text-text-muted text-xs font-medium">
                <Spinner size="sm" />
                Executing…
              </div>
            </div>
          )}

          {!isRunning && !output && (
            <div className="py-4 text-center">
              <Terminal size={24} className="text-text-subtle/40 mx-auto mb-2" />
              <p className="text-xs text-text-subtle">Run your code to see the result</p>
            </div>
          )}

          {!isRunning && output && overallStatusCfg && (
            <div className="flex flex-col gap-3">
              {/* Status + test-case score */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold',
                  overallStatusCfg.className,
                )}>
                  {overallStatusCfg.icon}
                  {overallStatusCfg.label}
                </div>
                {isMultiCase && output.totalCount !== undefined && (
                  <span className="text-xs text-text-muted font-code">
                    {output.passedCount}/{output.totalCount} passed
                  </span>
                )}
              </div>

              {/* Metrics (single-run only) */}
              {!isMultiCase && (
                <div className="grid grid-cols-2 gap-2.5">
                  {output.executionTimeMs !== undefined && (
                    <MetricCell label="Runtime"  value={formatMs(output.executionTimeMs)} />
                  )}
                  <MetricCell
                    label="Language"
                    value={language.charAt(0).toUpperCase() + language.slice(1)}
                  />
                  {output.exitCode !== undefined && (
                    <MetricCell label="Exit code" value={String(output.exitCode)} />
                  )}
                </div>
              )}

              {output.status === 'timeout' && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-warning/10 border border-warning/20 text-xs text-warning">
                  <AlertTriangle size={12} />
                  Execution timed out after 10 seconds
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center border-b border-border bg-bg-surface shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-all border-b-2 -mb-px',
              activeTab === tab.id
                ? 'text-text-primary border-accent'
                : 'text-text-subtle border-transparent hover:text-text-muted',
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.id === 'input' && testCases.length > 1 && (
              <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-accent/20 text-accent text-[10px] font-bold leading-none">
                {testCases.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-auto p-4">

        {/* OUTPUT TAB */}
        {activeTab === 'output' && (
          <>
            {isRunning && (
              <div className="flex items-center gap-2 text-xs text-text-muted font-code">
                <Spinner size="sm" />
                <span>Waiting for output…</span>
              </div>
            )}

            {!isRunning && !output && (
              <p className="text-xs text-text-subtle italic">No output yet. Run your code above.</p>
            )}

            {/* Multi-case results */}
            {!isRunning && output?.testCaseResults && (
              <div className="flex flex-col gap-2">
                {output.testCaseResults.map((tc) => (
                  <TestCaseRow
                    key={tc.index}
                    tc={tc}
                    expanded={expandedCases.has(tc.index)}
                    onToggle={() =>
                      setExpandedCases((prev) => {
                        const next = new Set(prev)
                        next.has(tc.index) ? next.delete(tc.index) : next.add(tc.index)
                        return next
                      })
                    }
                  />
                ))}
              </div>
            )}

            {/* Single-run result */}
            {!isRunning && output && !output.testCaseResults && (
              <>
                <pre className={cn(
                  'font-code text-xs leading-relaxed whitespace-pre-wrap break-words',
                  output.status === 'success' ? 'text-text-primary' : 'text-text-muted',
                )}>
                  {output.stdout || (
                    <span className="text-text-subtle italic">No stdout output</span>
                  )}
                  {output.stderr && output.status !== 'error' && (
                    <span className="block mt-2 text-error/80">{output.stderr}</span>
                  )}
                </pre>
                {output.status === 'error' && output.stderr && (
                  <div className="mt-3 p-3 rounded-lg bg-error/10 border border-error/20">
                    <pre className="font-code text-xs text-error leading-relaxed whitespace-pre-wrap break-words">
                      {output.stderr}
                    </pre>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* INPUT TAB */}
        {activeTab === 'input' && (
          <div className="flex flex-col gap-3">
            {testCases.map((tc, i) => (
              <div key={i} className="flex flex-col gap-2 p-3 rounded-lg bg-bg-elevated border border-border">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wide">
                    Case {i + 1}
                  </span>
                  {testCases.length > 1 && (
                    <button
                      onClick={() => removeTestCase(i)}
                      className="p-1 rounded text-text-subtle hover:text-error hover:bg-error/10 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-text-subtle uppercase tracking-wide">Input (stdin)</label>
                  <textarea
                    value={tc.stdin}
                    onChange={(e) => updateTestCase(i, { stdin: e.target.value })}
                    placeholder={`One value per line, e.g.\n[1,3]\n[2]\n\nRead in code:\nlines = sys.stdin.read().split('\\n')\nnums1 = json.loads(lines[0])`}
                    rows={3}
                    className={cn(
                      'font-code text-xs bg-bg-input border border-border rounded-md p-2.5',
                      'text-text-primary placeholder:text-text-subtle resize-y',
                      'focus:outline-none focus:border-accent transition-colors',
                    )}
                    spellCheck={false}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-text-subtle uppercase tracking-wide">
                    Expected Output <span className="normal-case">(optional)</span>
                  </label>
                  <textarea
                    value={tc.expectedOutput ?? ''}
                    onChange={(e) =>
                      updateTestCase(i, { expectedOutput: e.target.value || undefined })
                    }
                    placeholder="Leave empty to skip pass/fail check"
                    rows={2}
                    className={cn(
                      'font-code text-xs bg-bg-input border border-border rounded-md p-2.5',
                      'text-text-primary placeholder:text-text-subtle resize-y',
                      'focus:outline-none focus:border-accent transition-colors',
                    )}
                    spellCheck={false}
                  />
                </div>
              </div>
            ))}

            <button
              onClick={addTestCase}
              className={cn(
                'flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed',
                'border-border text-text-subtle hover:border-accent hover:text-accent',
                'text-xs font-medium transition-colors',
              )}
            >
              <Plus size={12} />
              Add Test Case
            </button>
          </div>
        )}

        {/* LOGS TAB */}
        {activeTab === 'logs' && (
          <div className="flex flex-col gap-2 font-code text-[11px] text-text-subtle">
            {isRunning && <LogLine type="info" text="Submitting to execution queue…" />}
            {output && (
              <>
                {output.testCaseResults ? (
                  output.testCaseResults.map((tc) => (
                    <LogLine
                      key={tc.index}
                      type={tc.status === 'success' ? 'success' : 'error'}
                      text={`Case ${tc.index + 1}: exit ${tc.exitCode} · ${formatMs(tc.executionTimeMs)}`}
                    />
                  ))
                ) : (
                  <>
                    <LogLine type="info" text={`Process finished with exit code ${output.exitCode ?? 0}`} />
                    {output.executionTimeMs !== undefined && (
                      <LogLine type="success" text={`Execution completed in ${formatMs(output.executionTimeMs)}`} />
                    )}
                  </>
                )}
              </>
            )}
            {!isRunning && !output && <p className="text-text-subtle italic">No logs yet.</p>}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function TestCaseRow({
  tc,
  expanded,
  onToggle,
}: {
  tc: TestCaseResult
  expanded: boolean
  onToggle: () => void
}) {
  const cfg = getStatusCfg(tc.status)
  const hasPassed = tc.passed !== undefined

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-3 py-2.5 bg-bg-elevated hover:bg-bg-overlay transition-colors text-left"
      >
        <div className={cn(
          'flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full border',
          cfg.className,
        )}>
          {cfg.icon}
          {hasPassed ? (tc.passed ? 'Passed' : cfg.label) : cfg.label}
        </div>
        <span className="text-[11px] text-text-muted flex-1">Case {tc.index + 1}</span>
        <span className="text-[10px] text-text-subtle font-code">{formatMs(tc.executionTimeMs)}</span>
        <ChevronDown
          size={12}
          className={cn('text-text-subtle transition-transform', expanded && 'rotate-180')}
        />
      </button>

      {expanded && (
        <div className="flex flex-col gap-3 px-3 py-3 bg-bg-surface border-t border-border">
          {tc.stdin && (
            <OutputBlock label="Input" content={tc.stdin} />
          )}
          <OutputBlock
            label="Output"
            content={tc.stdout || ''}
            empty="No stdout — make sure you print/console.log your result"
          />
          {tc.stderr && (
            <OutputBlock label="Stderr" content={tc.stderr} variant="error" />
          )}
        </div>
      )}
    </div>
  )
}

function OutputBlock({
  label,
  content,
  variant = 'default',
  empty,
}: {
  label: string
  content: string
  variant?: 'default' | 'error'
  empty?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] text-text-subtle uppercase tracking-wide">{label}</span>
      <pre className={cn(
        'font-code text-[11px] leading-relaxed whitespace-pre-wrap break-words p-2 rounded-md bg-bg-overlay',
        variant === 'error' ? 'text-error' : 'text-text-primary',
      )}>
        {content || (
          <span className="text-text-subtle italic">{empty ?? 'empty'}</span>
        )}
      </pre>
    </div>
  )
}

function MetricCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 px-3 py-2.5 rounded-lg bg-bg-overlay border border-border">
      <span className="text-[10px] text-text-subtle uppercase tracking-wide">{label}</span>
      <span className="text-sm font-semibold text-text-primary font-code">{value}</span>
    </div>
  )
}

function LogLine({ type, text }: { type: 'info' | 'success' | 'error'; text: string }) {
  const colors = { info: 'text-text-subtle', success: 'text-success', error: 'text-error' }
  const prefixes = { info: '→', success: '✓', error: '✗' }
  return (
    <div className={cn('flex items-start gap-2', colors[type])}>
      <span>{prefixes[type]}</span>
      <span>{text}</span>
    </div>
  )
}
