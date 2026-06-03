'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  Clock, ArrowRight,
  PanelLeftClose, PanelLeftOpen,
  PanelRightClose, PanelRightOpen,
  Users, Trophy, MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/Button'
import { ParticipantsSidebar } from './ParticipantsSidebar'
import { ProblemStatement } from './ProblemStatement'
import { BattleEditor } from './BattleEditor'
import { LiveLeaderboard } from './LiveLeaderboard'
import { LiveChat } from './LiveChat'
import { BattleOutputPanel } from './BattleOutputPanel'

// ── Constraints ───────────────────────────────────────────────────────────────
const LEFT_MIN    = 180
const LEFT_MAX    = 380
const LEFT_DEF    = 220

const RIGHT_MIN   = 220
const RIGHT_MAX   = 440
const RIGHT_DEF   = 280

const PROBLEM_MIN = 110
const PROBLEM_MAX = 360
const PROBLEM_DEF = 160

const OUTPUT_MIN  = 90
const OUTPUT_MAX  = 460
const OUTPUT_DEF  = 170

const RAIL_W      = 52   // collapsed peek-rail width (VS Code style)

const ELAPSED     = '06:12'
const TIME_LEFT   = '23:48'

// ── Drag handles ──────────────────────────────────────────────────────────────
function ColHandle({ onDrag }: { onDrag: (dx: number) => void }) {
  const startX = useRef(0)

  function onMouseDown(e: React.MouseEvent) {
    e.preventDefault()
    startX.current = e.clientX
    document.body.style.cursor    = 'col-resize'
    document.body.style.userSelect = 'none'

    function onMove(ev: MouseEvent) {
      onDrag(ev.clientX - startX.current)
      startX.current = ev.clientX
    }
    function onUp() {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.body.style.cursor    = ''
      document.body.style.userSelect = ''
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  return (
    <div
      onMouseDown={onMouseDown}
      className="w-1 shrink-0 cursor-col-resize bg-transparent hover:bg-accent/50 active:bg-accent/70 transition-colors"
    />
  )
}

function RowHandle({ onDrag }: { onDrag: (dy: number) => void }) {
  const startY = useRef(0)

  function onMouseDown(e: React.MouseEvent) {
    e.preventDefault()
    startY.current = e.clientY
    document.body.style.cursor    = 'row-resize'
    document.body.style.userSelect = 'none'

    function onMove(ev: MouseEvent) {
      onDrag(ev.clientY - startY.current)
      startY.current = ev.clientY
    }
    function onUp() {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.body.style.cursor    = ''
      document.body.style.userSelect = ''
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  return (
    <div
      onMouseDown={onMouseDown}
      className="h-1 shrink-0 cursor-row-resize bg-transparent hover:bg-accent/50 active:bg-accent/70 transition-colors"
    />
  )
}

// ── Icon rail — collapsed sidebar ─────────────────────────────────────────────
interface RailProps {
  side: 'left' | 'right'
  onExpand: () => void
  icons: { icon: React.ReactNode; label: string }[]
}

function PeekRail({ side, onExpand, icons }: RailProps) {
  return (
    <button
      onClick={onExpand}
      title="Expand panel"
      className={cn(
        'flex flex-col items-center gap-4 pt-3 pb-4 h-full w-full',
        'bg-bg-surface hover:bg-bg-elevated transition-colors',
        'group focus:outline-none',
      )}
    >
      {/* Expand arrow */}
      <span className="flex items-center justify-center w-7 h-7 rounded text-text-subtle group-hover:text-text-primary group-hover:bg-bg-hover transition-colors shrink-0">
        {side === 'left' ? <PanelLeftOpen size={14} /> : <PanelRightOpen size={14} />}
      </span>

      {/* Divider */}
      <span className="w-5 h-px bg-border shrink-0" />

      {/* Section icons */}
      {icons.map(({ icon, label }) => (
        <span
          key={label}
          title={label}
          className="flex flex-col items-center gap-1.5 text-text-subtle group-hover:text-text-muted transition-colors shrink-0"
        >
          {icon}
          <span
            className="text-[8px] font-semibold uppercase tracking-widest leading-none select-none"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            {label}
          </span>
        </span>
      ))}
    </button>
  )
}

// ── Main layout ───────────────────────────────────────────────────────────────
export function BattleLayout({ roomId }: { roomId: string }) {
  const [leftW,     setLeftW]     = useState(LEFT_DEF)
  const [rightW,    setRightW]    = useState(RIGHT_DEF)
  const [problemH,  setProblemH]  = useState(PROBLEM_DEF)
  const [outputH,   setOutputH]   = useState(OUTPUT_DEF)
  const [leftOpen,  setLeftOpen]  = useState(true)
  const [rightOpen, setRightOpen] = useState(true)

  const dragLeft    = useCallback((dx: number) => setLeftW  (w => Math.max(LEFT_MIN,    Math.min(LEFT_MAX,    w + dx))), [])
  const dragRight   = useCallback((dx: number) => setRightW (w => Math.max(RIGHT_MIN,   Math.min(RIGHT_MAX,   w - dx))), [])
  const dragProblem = useCallback((dy: number) => setProblemH(h => Math.max(PROBLEM_MIN, Math.min(PROBLEM_MAX, h + dy))), [])
  const dragOutput  = useCallback((dy: number) => setOutputH (h => Math.max(OUTPUT_MIN,  Math.min(OUTPUT_MAX,  h - dy))), [])

  return (
    // h-screen — battle page has NO NavBar (no PageLayout wrapper), so use full viewport
    <div className="flex flex-col h-screen bg-bg-primary overflow-hidden">

      {/* ── Top bar ── */}
      <div className="flex items-center gap-3 px-3 h-10 bg-bg-surface border-b border-border shrink-0">

        {/* Panel toggle buttons */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setLeftOpen(o => !o)}
            title={leftOpen ? 'Collapse left panel' : 'Expand left panel'}
            className="h-6 w-6 rounded flex items-center justify-center text-text-subtle hover:text-text-primary hover:bg-bg-hover transition-colors"
          >
            {leftOpen ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
          </button>
          <button
            onClick={() => setRightOpen(o => !o)}
            title={rightOpen ? 'Collapse right panel' : 'Expand right panel'}
            className="h-6 w-6 rounded flex items-center justify-center text-text-subtle hover:text-text-primary hover:bg-bg-hover transition-colors"
          >
            {rightOpen ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
          </button>
        </div>

        <div className="w-px h-4 bg-border shrink-0" />

        {/* Room info */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
          </span>
          <span className="text-sm font-semibold text-text-primary truncate">Algorithm Duel #42</span>
          <span className="text-xs text-text-subtle hidden sm:inline shrink-0">· Two Sum</span>
        </div>

        {/* Timer + End Battle */}
        <div className="flex items-center gap-3 ml-auto shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Clock size={12} />
            <span className="tabular-nums hidden sm:inline">
              <span className="text-text-subtle">Elapsed </span>{ELAPSED}
            </span>
            <span className="w-px h-3 bg-border mx-1 hidden sm:inline" />
            <span className={`font-bold tabular-nums ${parseInt(TIME_LEFT) < 5 ? 'text-error' : 'text-warning'}`}>
              {TIME_LEFT}
            </span>
            <span className="text-text-subtle"> left</span>
          </div>
          <Button variant="primary" size="sm" className="gap-1.5 h-7" asChild>
            <Link href={`/war-rooms/${roomId}/results`}>
              End Battle
              <ArrowRight size={12} />
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Body — fills every remaining pixel ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* ── Left panel ── */}
        <div
          className="shrink-0 border-r border-border overflow-hidden transition-[width] duration-200 ease-in-out"
          style={{ width: leftOpen ? leftW : RAIL_W }}
        >
          {leftOpen ? (
            <ParticipantsSidebar />
          ) : (
            <PeekRail
              side="left"
              onExpand={() => setLeftOpen(true)}
              icons={[
                { icon: <Users size={15} />,  label: 'Players'   },
                { icon: <Trophy size={15} />, label: 'Standings' },
              ]}
            />
          )}
        </div>

        {/* Left col-resize handle (only when open) */}
        {leftOpen && <ColHandle onDrag={dragLeft} />}

        {/* ── Center workspace ── */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0 min-h-0">

          {/* Problem statement (resizable) */}
          <div className="shrink-0 overflow-hidden" style={{ height: problemH }}>
            <ProblemStatement />
          </div>

          <RowHandle onDrag={dragProblem} />

          {/* Editor — gets all remaining vertical space */}
          <div className="flex-1 overflow-hidden min-h-0">
            <BattleEditor />
          </div>

          <RowHandle onDrag={dragOutput} />

          {/* Output panel (resizable) */}
          <div className="shrink-0 overflow-hidden border-t border-border" style={{ height: outputH }}>
            <BattleOutputPanel />
          </div>
        </div>

        {/* Right col-resize handle (only when open) */}
        {rightOpen && <ColHandle onDrag={dragRight} />}

        {/* ── Right panel ── */}
        <div
          className="shrink-0 border-l border-border overflow-hidden flex flex-col transition-[width] duration-200 ease-in-out"
          style={{ width: rightOpen ? rightW : RAIL_W }}
        >
          {rightOpen ? (
            <>
              <div className="flex-1 overflow-y-auto min-h-0">
                <LiveLeaderboard />
              </div>
              <LiveChat />
            </>
          ) : (
            <PeekRail
              side="right"
              onExpand={() => setRightOpen(true)}
              icons={[
                { icon: <Trophy size={15} />,       label: 'Leaderboard' },
                { icon: <MessageSquare size={15} />, label: 'Chat'        },
              ]}
            />
          )}
        </div>
      </div>
    </div>
  )
}
