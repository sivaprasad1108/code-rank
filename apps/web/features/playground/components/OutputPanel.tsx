'use client'

import { useState } from 'react'
import {
  CheckCircle2, XCircle, Clock, AlertTriangle,
  Terminal, FileText, BarChart2, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { formatMs } from '@/lib/utils/format'
import { Spinner } from '@/components/ui/Spinner'
import { useEditorStore } from '../store/editor.store'

type OutputTab = 'output' | 'input' | 'logs'

const TABS: { id: OutputTab; label: string; icon: React.ReactNode }[] = [
  { id: 'output', label: 'Output', icon: <Terminal size={12} /> },
  { id: 'input',  label: 'Input',  icon: <FileText size={12} /> },
  { id: 'logs',   label: 'Logs',   icon: <BarChart2 size={12} /> },
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

function getStatusConfig(status: string) {
  return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.error
}

export function OutputPanel() {
  const { output, isRunning, language } = useEditorStore()
  const [activeTab, setActiveTab] = useState<OutputTab>('output')
  const [stdin, setStdin] = useState('')

  const statusCfg = output ? getStatusConfig(output.status) : null

  return (
    <div className="flex flex-col h-full bg-bg-surface border-l border-border">

      {/* ── Top: Execution Result card ── */}
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

        {/* Status area */}
        <div className="px-5 pb-4">
          {isRunning && (
            <div className="flex items-center gap-3 py-2">
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

          {!isRunning && output && statusCfg && (
            <div className="flex flex-col gap-4">
              {/* Status badge */}
              <div className="flex items-center gap-2">
                <div className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold',
                  statusCfg.className,
                )}>
                  {statusCfg.icon}
                  {statusCfg.label}
                </div>
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {output.executionTimeMs !== undefined && (
                  <MetricCell
                    label="Runtime"
                    value={formatMs(output.executionTimeMs)}
                  />
                )}
                {output.memoryUsedKb !== undefined && (
                  <MetricCell
                    label="Memory"
                    value={`${(output.memoryUsedKb / 1024).toFixed(2)} MB`}
                  />
                )}
                <MetricCell
                  label="Language"
                  value={language.charAt(0).toUpperCase() + language.slice(1)}
                />
                {output.exitCode !== undefined && (
                  <MetricCell
                    label="Exit code"
                    value={String(output.exitCode)}
                  />
                )}
              </div>

              {/* Timeout message */}
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
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-auto p-4">
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
            {!isRunning && output && (
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
            )}
            {!isRunning && output?.status === 'error' && output.stderr && (
              <div className="mt-3 p-3 rounded-lg bg-error/10 border border-error/20">
                <pre className="font-code text-xs text-error leading-relaxed whitespace-pre-wrap break-words">
                  {output.stderr}
                </pre>
              </div>
            )}
          </>
        )}

        {activeTab === 'input' && (
          <div className="flex flex-col gap-2 h-full">
            <label className="text-xs text-text-muted font-medium">
              Standard Input (stdin)
            </label>
            <textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="Provide input for your program…"
              className={cn(
                'flex-1 font-code text-xs bg-bg-input border border-border rounded-lg p-3',
                'text-text-primary placeholder:text-text-subtle resize-none',
                'focus:outline-none focus:border-accent transition-colors',
                'min-h-[120px]',
              )}
              spellCheck={false}
            />
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="flex flex-col gap-2 font-code text-[11px] text-text-subtle">
            {isRunning && (
              <LogLine type="info" text="Submitting to execution queue…" />
            )}
            {output && (
              <>
                <LogLine type="info"    text={`Process finished with exit code ${output.exitCode ?? 0}`} />
                {output.executionTimeMs !== undefined && (
                  <LogLine type="success" text={`Execution completed in ${formatMs(output.executionTimeMs)}`} />
                )}
              </>
            )}
            {!isRunning && !output && (
              <p className="text-text-subtle italic">No logs yet.</p>
            )}
          </div>
        )}
      </div>
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
  const colors = {
    info:    'text-text-subtle',
    success: 'text-success',
    error:   'text-error',
  }
  const prefixes = { info: '→', success: '✓', error: '✗' }
  return (
    <div className={cn('flex items-start gap-2', colors[type])}>
      <span>{prefixes[type]}</span>
      <span>{text}</span>
    </div>
  )
}
