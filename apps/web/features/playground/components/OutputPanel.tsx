'use client'

import { useState } from 'react'
import { Terminal, AlertTriangle, BarChart2 } from 'lucide-react'
import { Tabs, type TabConfig } from '@/components/shared/Tabs'
import { EmptyState } from '@/components/shared/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/lib/utils/cn'
import { formatMs } from '@/lib/utils/format'
import { useEditorStore } from '../store/editor.store'

const OUTPUT_TABS: TabConfig[] = [
  { id: 'stdout', label: 'Output', icon: <Terminal size={13} /> },
  { id: 'stderr', label: 'Errors', icon: <AlertTriangle size={13} /> },
  { id: 'metrics', label: 'Metrics', icon: <BarChart2 size={13} /> },
]

export function OutputPanel() {
  const { output, isRunning } = useEditorStore()
  const [activeTab, setActiveTab] = useState('stdout')

  if (isRunning) {
    return (
      <div className="flex flex-col h-full bg-bg-surface border-l border-border">
        <Tabs tabs={OUTPUT_TABS} activeTab={activeTab} onTabChange={setActiveTab} className="px-4" size="sm" />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-text-muted">
            <Spinner size="md" />
            <span className="text-sm">Running…</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-bg-surface border-l border-border">
      <Tabs
        tabs={OUTPUT_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="px-4"
        size="sm"
      />

      <div className="flex-1 overflow-auto p-4">
        {!output && (
          <EmptyState
            icon={<Terminal size={32} />}
            title="No output yet"
            description="Run your code to see the result here."
          />
        )}

        {output && activeTab === 'stdout' && (
          <pre className={cn(
            'font-code text-sm leading-relaxed whitespace-pre-wrap break-words',
            output.status === 'success' ? 'text-text-primary' : 'text-text-muted',
          )}>
            {output.stdout || (
              <span className="text-text-subtle italic">No output</span>
            )}
            {output.status === 'timeout' && (
              <span className="text-warning block mt-2">⏱ Execution timed out (10s limit)</span>
            )}
          </pre>
        )}

        {output && activeTab === 'stderr' && (
          <pre className={cn(
            'font-code text-sm leading-relaxed whitespace-pre-wrap break-words',
            output.stderr ? 'text-error' : 'text-text-subtle italic',
          )}>
            {output.stderr || 'No errors'}
          </pre>
        )}

        {output && activeTab === 'metrics' && (
          <div className="flex flex-col gap-3">
            <MetricRow label="Status" value={
              <StatusBadge status={output.status} />
            } />
            {output.executionTimeMs !== undefined && (
              <MetricRow label="Time" value={formatMs(output.executionTimeMs)} />
            )}
            {output.memoryUsedKb !== undefined && (
              <MetricRow label="Memory" value={`${output.memoryUsedKb} KB`} />
            )}
            {output.exitCode !== undefined && (
              <MetricRow label="Exit code" value={String(output.exitCode)} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function MetricRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50">
      <span className="text-sm text-text-muted">{label}</span>
      <span className="text-sm font-medium text-text-primary">{value}</span>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    success: 'text-success',
    error: 'text-error',
    timeout: 'text-warning',
    pending: 'text-text-muted',
    running: 'text-accent',
  }
  return (
    <span className={cn('font-medium capitalize', map[status] ?? 'text-text-muted')}>
      {status}
    </span>
  )
}
