'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import {
  Clock, ArrowRight,
  PanelLeftClose, PanelLeftOpen,
  PanelRightClose, PanelRightOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/Button'
import { ParticipantsSidebar } from './ParticipantsSidebar'
import { ProblemStatement } from './ProblemStatement'
import { BattleEditor } from './BattleEditor'
import { LiveLeaderboard } from './LiveLeaderboard'
import { LiveChat } from './LiveChat'
import { BattleOutputPanel } from './BattleOutputPanel'

// ── Size constraints ──────────────────────────────────────────────────────────
const LEFT_MIN    = 160
const LEFT_MAX    = 360
const LEFT_DEF    = 220

const RIGHT_MIN   = 220
const RIGHT_MAX   = 420
const RIGHT_DEF   = 280

const PROBLEM_MIN = 110
const PROBLEM_MAX = 340
const PROBLEM_DEF = 160

const OUTPUT_MIN  = 90
const OUTPUT_MAX  = 440
const OUTPUT_DEF  = 170

const COLLAPSED_W = 32   // width of icon-only strip when panel is collapsed

const ELAPSED    = '06:12'
const TIME_LEFT  = '23:48'

// ── Drag handle ───────────────────────────────────────────────────────────────
function ColHandle({ onDrag }: { onDrag: (dx: number) => void }) {
  const start = useRef(0)

  function onMouseDown(e: React.MouseEvent) {
    e.preventDefault()
    start.current = e.clientX
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    function onMove(ev: MouseEvent) { onDrag(ev.clientX - start.current); start.current = ev.clientX }
    function onUp() {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  return (
    <div
      onMouseDown={onMouseDown}
      className="w-[4px] shrink-0 cursor-col-resize bg-transparent hover:bg-accent/40 active:bg-accent/60 transition-colors group relative z-10"
    >
      {/* visual nub */}
      <div className="absolute inset-y-0 -left-px -right-px opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  )
}

function RowHandle({ onDrag }: { onDrag: (dy: number) => void }) {
  const start = useRef(0)

  function onMouseDown(e: React.MouseEvent) {
    e.preventDefault()
    start.current = e.clientY
    document.body.style.cursor = 'row-resize'
    document.body.style.userSelect = 'none'

    function onMove(ev: MouseEvent) { onDrag(ev.clientY - start.current); start.current = ev.clientY }
    function onUp() {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  return (
    <div
      onMouseDown={onMouseDown}
      className="h-[4px] shrink-0 cursor-row-resize bg-transparent hover:bg-accent/40 active:bg-accent/60 transition-colors"
    />
  )
}

// ── Main layout ───────────────────────────────────────────────────────────────
export function BattleLayout({ roomId }: { roomId: string }) {
  const [leftW,         setLeftW]         = useState(LEFT_DEF)
  const [rightW,        setRightW]        = useState(RIGHT_DEF)
  const [problemH,      setProblemH]      = useState(PROBLEM_DEF)
  const [outputH,       setOutputH]       = useState(OUTPUT_DEF)
  const [leftOpen,      setLeftOpen]      = useState(true)
  const [rightOpen,     setRightOpen]     = useState(true)

  // Clamp helpers
  const dragLeft    = useCallback((dx: number) => setLeftW  (w => Math.max(LEFT_MIN,    Math.min(LEFT_MAX,    w + dx))), [])
  const dragRight   = useCallback((dx: number) => setRightW (w => Math.max(RIGHT_MIN,   Math.min(RIGHT_MAX,   w - dx))), [])
  const dragProblem = useCallback((dy: number) => setProblemH(h => Math.max(PROBLEM_MIN, Math.min(PROBLEM_MAX, h + dy))), [])
  const dragOutput  = useCallback((dy: number) => setOutputH (h => Math.max(OUTPUT_MIN,  Math.min(OUTPUT_MAX,  h - dy))), [])

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-bg-primary overflow-hidden">

      {/* ── Top bar ── */}
      <div className="flex items-center gap-3 px-3 h-10 bg-bg-surface border-b border-border shrink-0">

        {/* Panel toggles */}
        <div className="flex items-center gap-1">
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

        {/* Timer + End */}
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

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left panel ── */}
        <div
          className={cn(
            'shrink-0 border-r border-border overflow-hidden flex flex-col',
            'transition-[width] duration-200 ease-in-out',
          )}
          style={{ width: leftOpen ? leftW : COLLAPSED_W }}
        >
          {leftOpen ? (
            <ParticipantsSidebar />
          ) : (
            /* Collapsed strip */
            <div className="flex flex-col items-center gap-3 pt-3 h-full bg-bg-surface">
              <button
                onClick={() => setLeftOpen(true)}
                title="Expand left panel"
                className="h-7 w-7 rounded flex items-center justify-center text-text-subtle hover:text-text-primary hover:bg-bg-hover transition-colors"
              >
                <PanelLeftOpen size={14} />
              </button>
              {/* Rotated label */}
              <span
                className="text-[10px] font-semibold text-text-subtle uppercase tracking-widest select-none mt-2"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                Players
              </span>
            </div>
          )}
        </div>

        {/* Left drag handle — only when open */}
        {leftOpen && <ColHandle onDrag={dragLeft} />}

        {/* ── Center ── */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">

          {/* Problem statement */}
          <div className="shrink-0 overflow-hidden" style={{ height: problemH }}>
            <ProblemStatement />
          </div>

          {/* Problem ↕ drag handle */}
          <RowHandle onDrag={dragProblem} />

          {/* Editor — fills all remaining space */}
          <div className="flex-1 overflow-hidden min-h-0">
            <BattleEditor />
          </div>

          {/* Output ↕ drag handle */}
          <RowHandle onDrag={dragOutput} />

          {/* Output panel */}
          <div className="shrink-0 overflow-hidden border-t border-border" style={{ height: outputH }}>
            <BattleOutputPanel />
          </div>
        </div>

        {/* Right drag handle — only when open */}
        {rightOpen && <ColHandle onDrag={dragRight} />}

        {/* ── Right panel ── */}
        <div
          className={cn(
            'shrink-0 border-l border-border flex flex-col overflow-hidden',
            'transition-[width] duration-200 ease-in-out',
          )}
          style={{ width: rightOpen ? rightW : COLLAPSED_W }}
        >
          {rightOpen ? (
            <>
              <div className="flex-1 overflow-y-auto min-h-0">
                <LiveLeaderboard />
              </div>
              <LiveChat />
            </>
          ) : (
            /* Collapsed strip */
            <div className="flex flex-col items-center gap-3 pt-3 h-full bg-bg-surface">
              <button
                onClick={() => setRightOpen(true)}
                title="Expand right panel"
                className="h-7 w-7 rounded flex items-center justify-center text-text-subtle hover:text-text-primary hover:bg-bg-hover transition-colors"
              >
                <PanelRightOpen size={14} />
              </button>
              <span
                className="text-[10px] font-semibold text-text-subtle uppercase tracking-widest select-none mt-2"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                Leaderboard
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
