'use client'

import { useState } from 'react'
import { Tag, Lightbulb } from 'lucide-react'
import { Tabs } from '@/components/shared/Tabs'
import { Badge } from '@/components/ui/Badge'
import { MOCK_PROBLEMS } from '../../data/mock'

const problem = MOCK_PROBLEMS[0]

const TABS = [
  { id: 'description', label: 'Description' },
  { id: 'examples',    label: 'Examples', badge: problem.examples.length },
  { id: 'constraints', label: 'Constraints' },
  { id: 'hints',       label: 'Hints' },
  { id: 'tags',        label: 'Tags' },
]

interface ProblemStatementProps {
  isOpen?: boolean
  onToggle?: () => void
}

export function ProblemStatement({ isOpen = true, onToggle }: ProblemStatementProps) {
  const [tab, setTab] = useState('description')

  return (
    <div className="flex flex-col h-full bg-bg-surface border-b border-border">
      {/* Problem header */}
      <div className="px-5 py-3 border-b border-border flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs font-code text-text-subtle">#{problem.id}</span>
          <h2 className="font-semibold text-text-primary text-sm">{problem.name}</h2>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge
            variant={problem.difficulty === 'Easy' ? 'success' : problem.difficulty === 'Medium' ? 'warning' : 'error'}
            size="sm"
          >
            {problem.difficulty}
          </Badge>
          {onToggle && (
            <button
              onClick={onToggle}
              title={isOpen ? 'Collapse problem' : 'Expand problem'}
              className="h-6 w-6 rounded flex items-center justify-center text-text-subtle hover:text-text-primary hover:bg-bg-hover transition-colors"
            >
              {isOpen
                ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 8L6 4L10 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                : <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              }
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={TABS} activeTab={tab} onTabChange={setTab} size="sm" className="px-4 shrink-0" />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 prose-sm text-sm text-text-muted leading-relaxed">
        {tab === 'description' && (
          <p className="whitespace-pre-wrap">{problem.description}</p>
        )}

        {tab === 'examples' && (
          <div className="space-y-4">
            {problem.examples.map((ex, i) => (
              <div key={i} className="rounded-lg bg-bg-elevated border border-border overflow-hidden">
                <div className="px-3 py-1.5 bg-bg-surface border-b border-border text-[11px] font-semibold text-text-subtle uppercase tracking-wide">
                  Example {i + 1}
                </div>
                <div className="p-3 font-code text-xs space-y-1">
                  <div><span className="text-text-subtle">Input: </span><span className="text-text-primary">{ex.input}</span></div>
                  <div><span className="text-text-subtle">Output: </span><span className="text-success">{ex.output}</span></div>
                  {ex.explanation && (
                    <div className="text-text-subtle mt-2 pt-2 border-t border-border/50">
                      <span className="text-text-subtle">Explanation: </span>{ex.explanation}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'constraints' && (
          <ul className="space-y-2">
            {problem.constraints.map((c, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-accent mt-2 shrink-0" />
                <code className="font-code text-xs text-text-primary">{c}</code>
              </li>
            ))}
          </ul>
        )}

        {tab === 'hints' && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/5 border border-accent/15">
            <Lightbulb size={16} className="text-accent shrink-0 mt-0.5" />
            <div className="text-sm text-text-muted">
              Try using a hash map to store indices as you traverse the array. For each element, check if its complement exists.
            </div>
          </div>
        )}

        {tab === 'tags' && (
          <div className="flex flex-wrap gap-2">
            {problem.tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-bg-elevated border border-border text-xs text-text-muted">
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
