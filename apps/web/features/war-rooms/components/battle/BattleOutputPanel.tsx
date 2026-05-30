'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Clock, Cpu, MemoryStick } from 'lucide-react'
import { Tabs } from '@/components/shared/Tabs'
import { MOCK_TIMELINE } from '../../data/mock'

const TABS = [
  { id: 'output',      label: 'Output' },
  { id: 'testcases',   label: 'Test Cases', badge: 3 },
  { id: 'submissions', label: 'Submissions', badge: 1 },
  { id: 'logs',        label: 'Logs' },
  { id: 'performance', label: 'Performance' },
]

const TEST_CASES = [
  { input: '[2,7,11,15], target = 9', expected: '[0,1]', actual: '[0,1]', passed: true },
  { input: '[3,2,4], target = 6',     expected: '[1,2]', actual: '[1,2]', passed: true },
  { input: '[3,3], target = 6',       expected: '[0,1]', actual: '[0,1]', passed: true },
]

export function BattleOutputPanel() {
  const [tab, setTab] = useState('output')

  return (
    <div className="flex flex-col h-full border-t border-border bg-bg-surface">
      <Tabs tabs={TABS} activeTab={tab} onTabChange={setTab} size="sm" className="px-4 shrink-0" />

      <div className="flex-1 overflow-y-auto p-4">
        {tab === 'output' && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10 border border-success/20">
                <CheckCircle size={13} className="text-success" />
                <span className="text-xs font-semibold text-success">Accepted</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-text-muted">
                <span className="flex items-center gap-1"><Clock size={11} /> 48ms</span>
                <span className="flex items-center gap-1"><Cpu size={11} /> 14.2MB</span>
              </div>
            </div>
            <div className="font-code text-xs bg-bg-elevated border border-border rounded-lg p-3 text-success">
              [0, 1]
            </div>
          </div>
        )}

        {tab === 'testcases' && (
          <div className="space-y-2">
            {TEST_CASES.map((tc, i) => (
              <div key={i} className={`rounded-lg border p-3 ${tc.passed ? 'border-success/20 bg-success/5' : 'border-error/20 bg-error/5'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {tc.passed
                    ? <CheckCircle size={13} className="text-success" />
                    : <XCircle size={13} className="text-error" />
                  }
                  <span className={`text-xs font-semibold ${tc.passed ? 'text-success' : 'text-error'}`}>
                    Case {i + 1} — {tc.passed ? 'Passed' : 'Failed'}
                  </span>
                </div>
                <div className="font-code text-[11px] space-y-1">
                  <div className="text-text-subtle">Input: <span className="text-text-primary">{tc.input}</span></div>
                  <div className="text-text-subtle">Expected: <span className="text-success">{tc.expected}</span></div>
                  <div className="text-text-subtle">Output: <span className="text-text-primary">{tc.actual}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'submissions' && (
          <div className="space-y-2">
            {MOCK_TIMELINE.filter(t => t.player === 'sivaprasad').map((t, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-bg-elevated border border-border">
                <span className="text-[10px] font-code text-text-subtle w-16 shrink-0">{t.time}</span>
                <span className={`text-xs font-medium ${
                  t.status === 'accepted' ? 'text-success' : t.status === 'error' ? 'text-error' : 'text-text-muted'
                }`}>{t.event}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'logs' && (
          <div className="font-code text-[11px] text-text-muted bg-bg-elevated border border-border rounded-lg p-3 space-y-1">
            <div className="text-text-subtle">[12:31:04] Submitting solution...</div>
            <div className="text-text-subtle">[12:31:04] Running test case 1/3...</div>
            <div className="text-success">[12:31:04] Test 1: PASS</div>
            <div className="text-text-subtle">[12:31:04] Running test case 2/3...</div>
            <div className="text-success">[12:31:05] Test 2: PASS</div>
            <div className="text-text-subtle">[12:31:05] Running test case 3/3...</div>
            <div className="text-success">[12:31:05] Test 3: PASS</div>
            <div className="text-success font-semibold">[12:31:05] All tests passed → Accepted</div>
          </div>
        )}

        {tab === 'performance' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Runtime',    value: '48 ms',         icon: <Clock size={14} className="text-accent" /> },
              { label: 'Memory',     value: '14.2 MB',       icon: <MemoryStick size={14} className="text-info" /> },
              { label: 'Language',   value: 'Python 3.12',   icon: <Cpu size={14} className="text-success" /> },
              { label: 'Submitted',  value: '12:31 PM',      icon: <CheckCircle size={14} className="text-success" /> },
              { label: 'Exec Time',  value: '0.048 s',       icon: <Clock size={14} className="text-warning" /> },
              { label: 'Status',     value: 'Accepted',      icon: <CheckCircle size={14} className="text-success" /> },
            ].map((m) => (
              <div key={m.label} className="p-3 rounded-lg bg-bg-elevated border border-border">
                <div className="flex items-center gap-1.5 mb-1.5">{m.icon}<span className="text-[10px] text-text-subtle uppercase tracking-wide">{m.label}</span></div>
                <div className="text-sm font-semibold text-text-primary">{m.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
