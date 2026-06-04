'use client'

import { Tag, CheckCircle, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils/cn'
import type { MockProblem } from '../../data/mock'

interface ProblemVoteCardProps {
  problem: MockProblem
  selected: boolean
  onSelect: () => void
}

export function ProblemVoteCard({ problem, selected, onSelect }: ProblemVoteCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'w-full text-left rounded-xl border p-5 transition-all duration-200',
        'bg-bg-elevated hover:bg-bg-overlay',
        selected
          ? 'border-accent shadow-glow-sm scale-[1.02]'
          : 'border-border hover:border-border-strong hover:scale-[1.01]',
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="text-[11px] font-code text-text-subtle mb-1">#{problem.id}</div>
          <div className="font-semibold text-text-primary">{problem.name}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge
            variant={problem.difficulty === 'Easy' ? 'success' : problem.difficulty === 'Medium' ? 'warning' : 'error'}
            size="sm"
          >
            {problem.difficulty}
          </Badge>
          {selected && (
            <div className="w-6 h-6 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
              <CheckCircle size={13} className="text-accent" />
            </div>
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-text-muted mb-3">
        <span>Acceptance: {problem.acceptance}</span>
        <div className="flex items-center gap-1">
          <Clock size={10} />
          {problem.estimatedTime}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {problem.tags.map((tag) => (
          <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-bg-surface border border-border/60 text-text-muted">
            <Tag size={8} />
            {tag}
          </span>
        ))}
      </div>

      {/* Selected indicator */}
      {selected && (
        <div className="mt-4 pt-3 border-t border-accent/20 flex items-center gap-2 text-xs font-medium text-accent">
          <CheckCircle size={12} />
          Your vote
        </div>
      )}
    </button>
  )
}
