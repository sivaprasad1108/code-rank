'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Clock, ArrowRight, Users, Trophy, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/Button'
import { ParticipantsSidebar } from './ParticipantsSidebar'
import { ProblemStatement } from './ProblemStatement'
import { BattleEditor } from './BattleEditor'
import { LiveLeaderboard } from './LiveLeaderboard'
import { LiveChat } from './LiveChat'
import { BattleOutputPanel } from './BattleOutputPanel'

// ── Size constraints ───────────────────────────────────────────────────────────
const LEFT_MIN      = 180
const LEFT_MAX      = 380
const LEFT_DEF      = 220

const RIGHT_MIN     = 220
const RIGHT_MAX     = 440
const RIGHT_DEF     = 280

const PROBLEM_MIN   = 120
const PROBLEM_MAX   = 360
const PROBLEM_DEF   = 165
const PROBLEM_HDR   = 44   // collapsed: just the header row

const OUTPUT_MIN    = 100
const OUTPUT_MAX    = 460
const OUTPUT_DEF    = 172
const OUTPUT_HDR    = 38   // collapsed: just the tabs row

const RAIL_W        = 52   // collapsed side-panel rail

const ELAPSED       = '06:12'
const TIME_LEFT     = '23:48'

// ── Inline transition helper ───────────────────────────────────────────────────
const T_COL = { transition: 'width 0.18s ease', overflow: 'hidden' as const, flexShrink: 0 }
const T_ROW = { transition: 'height 0.18s ease', overflow: 'hidden' as const }

// ── Chevron SVG (inline, no extra dep) ────────────────────────────────────────
function Chevron({ dir }: { dir: 'left' | 'right' | 'up' | 'down' }) {
  const paths = {
    left:  'M8 2L4 6L8 10',
    right: 'M4 2L8 6L4 10',
    up:    'M2 7L6 3L10 7',
    down:  'M2 5L6 9L10 5',
  }
  return (
    <svg width="10" height="12" viewBox="0 0 12 12" fill="none">
      <path d={paths[dir]} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Column drag handle — with a hover-reveal collapse tab ─────────────────────
function ColHandle({
  onDrag,
  onCollapse,
  side,
}: {
  onDrag: (dx: number) => void
  onCollapse: () => void
  side: 'left' | 'right'
}) {
  const startX = useRef(0)

  function onMouseDown(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest('button')) return
    e.preventDefault()
    startX.current = e.clientX
    document.body.style.cursor    = 'col-resize'
    document.body.style.userSelect = 'none'
    function onMove(ev: MouseEvent) { onDrag(ev.clientX - startX.current); startX.current = ev.clientX }
    function onUp()  {
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
      className="relative w-2 shrink-0 cursor-col-resize group bg-transparent hover:bg-accent/30 transition-colors"
    >
      {/* Collapse tab — always visible, vertically centered */}
      <button
        onClick={(e) => { e.stopPropagation(); onCollapse() }}
        onMouseDown={(e) => e.stopPropagation()}
        title={`Collapse ${side} panel`}
        className={cn(
          'absolute top-6 z-20',
          'w-4 h-8 rounded',
          'bg-bg-overlay border border-border',
          'flex items-center justify-center',
          'text-text-subtle hover:text-accent hover:border-accent/50 hover:bg-bg-hover',
          'opacity-0 group-hover:opacity-100 transition-opacity',
          side === 'left' ? '-right-1' : '-left-1',
        )}
      >
        <Chevron dir={side === 'left' ? 'left' : 'right'} />
      </button>
    </div>
  )
}

// ── Row drag handle (horizontal resize) ───────────────────────────────────────
function RowHandle({ onDrag }: { onDrag: (dy: number) => void }) {
  const startY = useRef(0)

  function onMouseDown(e: React.MouseEvent) {
    e.preventDefault()
    startY.current = e.clientY
    document.body.style.cursor    = 'row-resize'
    document.body.style.userSelect = 'none'
    function onMove(ev: MouseEvent) { onDrag(ev.clientY - startY.current); startY.current = ev.clientY }
    function onUp()  {
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
      className="h-1 shrink-0 cursor-row-resize bg-transparent hover:bg-accent/40 active:bg-accent/60 transition-colors"
    />
  )
}

// ── Collapsed side-panel rail ──────────────────────────────────────────────────
function PeekRail({
  side,
  onExpand,
  icons,
}: {
  side: 'left' | 'right'
  onExpand: () => void
  icons: { icon: React.ReactNode; label: string }[]
}) {
  return (
    <button
      onClick={onExpand}
      title="Expand panel"
      className="flex flex-col items-center gap-4 pt-3 pb-4 h-full w-full bg-bg-surface hover:bg-bg-elevated transition-colors group focus:outline-none"
    >
      <span className="flex items-center justify-center w-6 h-6 rounded text-text-muted group-hover:text-accent transition-colors shrink-0">
        <Chevron dir={side === 'left' ? 'right' : 'left'} />
      </span>
      <span className="w-5 h-px bg-border shrink-0" />
      {icons.map(({ icon, label }) => (
        <span
          key={label}
          title={label}
          className="flex flex-col items-center gap-1.5 text-text-muted group-hover:text-accent transition-colors shrink-0"
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

// ── Main layout ────────────────────────────────────────────────────────────────
export function BattleLayout({ roomId }: { roomId: string }) {
  const [leftW,       setLeftW]       = useState(LEFT_DEF)
  const [rightW,      setRightW]      = useState(RIGHT_DEF)
  const [problemH,    setProblemH]    = useState(PROBLEM_DEF)
  const [outputH,     setOutputH]     = useState(OUTPUT_DEF)
  const [leftOpen,    setLeftOpen]    = useState(true)
  const [rightOpen,   setRightOpen]   = useState(true)
  const [problemOpen, setProblemOpen] = useState(true)
  const [outputOpen,  setOutputOpen]  = useState(true)

  const dragLeft    = useCallback((dx: number) => setLeftW   (w => Math.max(LEFT_MIN,    Math.min(LEFT_MAX,    w + dx))), [])
  const dragRight   = useCallback((dx: number) => setRightW  (w => Math.max(RIGHT_MIN,   Math.min(RIGHT_MAX,   w - dx))), [])
  const dragProblem = useCallback((dy: number) => setProblemH(h => Math.max(PROBLEM_MIN, Math.min(PROBLEM_MAX, h + dy))), [])
  const dragOutput  = useCallback((dy: number) => setOutputH (h => Math.max(OUTPUT_MIN,  Math.min(OUTPUT_MAX,  h - dy))), [])

  return (
    // h-screen: battle page has no NavBar (no PageLayout), so use full viewport
    <div className="flex flex-col bg-bg-primary" style={{ height: '100dvh', overflow: 'hidden' }}>

      {/* ── Top bar ── */}
      <div className="flex items-center gap-3 px-4 bg-bg-surface border-b border-border shrink-0" style={{ height: 40 }}>
        {/* Live indicator + room name */}
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
              End Battle <ArrowRight size={12} />
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex min-h-0" style={{ flex: 1, overflow: 'hidden' }}>

        {/* ── Left panel ── */}
        <div style={{ width: leftOpen ? leftW : RAIL_W, ...T_COL }}>
          {leftOpen
            ? <ParticipantsSidebar />
            : <PeekRail side="left" onExpand={() => setLeftOpen(true)} icons={[
                { icon: <Users size={15} />,  label: 'Players'   },
                { icon: <Trophy size={15} />, label: 'Standings' },
              ]} />
          }
        </div>

        {/* Left col-resize + collapse tab */}
        {leftOpen && <ColHandle onDrag={dragLeft} onCollapse={() => setLeftOpen(false)} side="left" />}

        {/* ── Center ── */}
        <div className="flex flex-col min-w-0 min-h-0" style={{ flex: 1, overflow: 'hidden' }}>

          {/* Problem statement */}
          <div style={{ height: problemOpen ? problemH : PROBLEM_HDR, ...T_ROW, flexShrink: 0 }}>
            <ProblemStatement isOpen={problemOpen} onToggle={() => setProblemOpen(o => !o)} />
          </div>

          {/* Problem ↕ resize (only when open) */}
          {problemOpen && <RowHandle onDrag={dragProblem} />}

          {/* Editor — all remaining vertical space */}
          <div className="min-h-0" style={{ flex: 1, overflow: 'hidden' }}>
            <BattleEditor />
          </div>

          {/* Output ↕ resize (only when open) */}
          {outputOpen && <RowHandle onDrag={dragOutput} />}

          {/* Output panel */}
          <div style={{ height: outputOpen ? outputH : OUTPUT_HDR, ...T_ROW, flexShrink: 0, borderTop: '1px solid var(--color-border)' }}>
            <BattleOutputPanel isOpen={outputOpen} onToggle={() => setOutputOpen(o => !o)} />
          </div>
        </div>

        {/* Right col-resize + collapse tab */}
        {rightOpen && <ColHandle onDrag={dragRight} onCollapse={() => setRightOpen(false)} side="right" />}

        {/* ── Right panel ── */}
        <div className="flex flex-col" style={{ width: rightOpen ? rightW : RAIL_W, ...T_COL }}>
          {rightOpen ? (
            <>
              <div className="min-h-0" style={{ flex: 1, overflowY: 'auto' }}>
                <LiveLeaderboard />
              </div>
              <LiveChat />
            </>
          ) : (
            <PeekRail side="right" onExpand={() => setRightOpen(true)} icons={[
              { icon: <Trophy size={15} />,        label: 'Leaderboard' },
              { icon: <MessageSquare size={15} />, label: 'Chat'        },
            ]} />
          )}
        </div>
      </div>
    </div>
  )
}
