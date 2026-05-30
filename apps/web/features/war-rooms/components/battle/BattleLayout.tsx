'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ParticipantsSidebar } from './ParticipantsSidebar'
import { ProblemStatement } from './ProblemStatement'
import { BattleEditor } from './BattleEditor'
import { LiveLeaderboard } from './LiveLeaderboard'
import { LiveChat } from './LiveChat'
import { BattleOutputPanel } from './BattleOutputPanel'

const ELAPSED = '06:12'
const TIME_LEFT = '23:48'

export function BattleLayout() {
  const [outputHeight, setOutputHeight] = useState(220)

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-bg-primary overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-4 h-11 bg-bg-surface border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
          </span>
          <span className="text-sm font-semibold text-text-primary">Algorithm Duel #42</span>
          <span className="text-xs text-text-subtle">· Two Sum</span>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Clock size={12} />
            <span className="tabular-nums">
              <span className="text-text-subtle">Elapsed </span>{ELAPSED}
            </span>
            <span className="w-px h-3 bg-border mx-1" />
            <span className={`font-bold tabular-nums ${parseInt(TIME_LEFT) < 5 ? 'text-error' : 'text-warning'}`}>
              {TIME_LEFT}
            </span>
            <span className="text-text-subtle"> left</span>
          </div>

          <Button variant="primary" size="sm" className="gap-1.5" asChild>
            <Link href="results">
              End Battle
              <ArrowRight size={12} />
            </Link>
          </Button>
        </div>
      </div>

      {/* Three-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar: Participants + standings */}
        <div className="w-[220px] shrink-0 border-r border-border overflow-hidden">
          <ParticipantsSidebar />
        </div>

        {/* Center: Problem + Editor + Output */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Problem statement */}
          <div className="h-[200px] shrink-0 overflow-hidden">
            <ProblemStatement />
          </div>

          {/* Editor fills remaining space */}
          <div className="flex-1 overflow-hidden">
            <BattleEditor />
          </div>

          {/* Output panel */}
          <div className="shrink-0 border-t border-border" style={{ height: outputHeight }}>
            <BattleOutputPanel />
          </div>
        </div>

        {/* Right sidebar: Leaderboard + Chat */}
        <div className="w-[280px] shrink-0 border-l border-border flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <LiveLeaderboard />
          </div>
          <LiveChat />
        </div>
      </div>
    </div>
  )
}
