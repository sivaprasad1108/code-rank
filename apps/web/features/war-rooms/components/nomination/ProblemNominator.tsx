'use client'

import { useState } from 'react'
import { Search, Shuffle, Tag, Clock, CheckCircle } from 'lucide-react'
import { GlassCard } from '@/components/shared/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { MOCK_PROBLEMS } from '../../data/mock'

export function ProblemNominator() {
  const [input, setInput]     = useState('')
  const [preview, setPreview] = useState<(typeof MOCK_PROBLEMS)[0] | null>(null)
  const [nominated, setNom]   = useState(false)

  function handleInput(val: string) {
    setInput(val)
    setNom(false)
    const num = parseInt(val, 10)
    if (!isNaN(num)) {
      const found = MOCK_PROBLEMS.find((p) => p.id === num)
      setPreview(found ?? null)
    } else {
      setPreview(null)
    }
  }

  function handleNominate() {
    if (preview) setNom(true)
  }

  function handleRandom() {
    const p = MOCK_PROBLEMS[Math.floor(Math.random() * MOCK_PROBLEMS.length)]
    setInput(String(p.id))
    setPreview(p)
    setNom(false)
  }

  return (
    <div className="space-y-4">
      {/* Input */}
      <div>
        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
          Problem ID
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle" />
            <input
              type="text"
              value={input}
              onChange={(e) => handleInput(e.target.value)}
              placeholder="e.g. 1, 20, 53..."
              className="w-full h-10 pl-9 pr-3 bg-bg-surface border border-border rounded-lg text-sm text-text-primary placeholder:text-text-subtle focus:outline-none focus:border-accent/50 font-code"
            />
          </div>
          <Button variant="outline" size="md" onClick={handleRandom} className="gap-2 shrink-0">
            <Shuffle size={14} />
            Random
          </Button>
        </div>
      </div>

      {/* Preview */}
      {preview ? (
        <GlassCard padding="md" className={`transition-all ${nominated ? 'border-accent/40 shadow-glow-sm' : ''}`}>
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <div className="text-xs text-text-subtle font-code mb-1">#{preview.id}</div>
              <div className="font-semibold text-text-primary">{preview.name}</div>
            </div>
            <Badge
              variant={preview.difficulty === 'Easy' ? 'success' : preview.difficulty === 'Medium' ? 'warning' : 'error'}
              size="sm"
            >
              {preview.difficulty}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-xs text-text-muted mb-3">
            <div className="flex items-center gap-1">
              <CheckCircle size={11} className="text-success" />
              <span>Acceptance: {preview.acceptance}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={11} />
              <span>{preview.estimatedTime}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {preview.tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-bg-surface border border-border text-text-muted">
                <Tag size={9} />
                {tag}
              </span>
            ))}
          </div>

          {nominated ? (
            <div className="flex items-center gap-2 text-sm text-accent font-medium">
              <CheckCircle size={15} />
              Nominated!
            </div>
          ) : (
            <Button variant="primary" size="sm" className="w-full" onClick={handleNominate}>
              Nominate This Problem
            </Button>
          )}
        </GlassCard>
      ) : input ? (
        <div className="text-center py-6 text-text-subtle text-sm">
          No problem found with ID <code className="font-code text-text-muted">{input}</code>
        </div>
      ) : null}
    </div>
  )
}
