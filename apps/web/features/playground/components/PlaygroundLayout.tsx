'use client'

import { useEffect, useState } from 'react'
import { PanelLeftOpen, PanelLeftClose } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { SplitPane } from '@/components/layout/SplitPane'
import { EditorPanel } from './EditorPanel'
import { OutputPanel } from './OutputPanel'
import { PlaygroundSidebar } from './PlaygroundSidebar'
import { useExecution } from '../hooks/useExecution'

interface PlaygroundLayoutProps {
  onSave?: () => void
}

export function PlaygroundLayout({ onSave }: PlaygroundLayoutProps) {
  const { run } = useExecution()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Ctrl+Enter dispatched from Monaco
  useEffect(() => {
    document.addEventListener('coderank:run', run)
    return () => document.removeEventListener('coderank:run', run)
  }, [run])

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] overflow-hidden bg-bg-primary">

      {/* ── Desktop layout: sidebar + editor + output ── */}
      <div className="hidden md:flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <div
          className={cn(
            'shrink-0 border-r border-border transition-all duration-[var(--duration-normal)] overflow-hidden',
            sidebarOpen ? 'w-60' : 'w-0',
          )}
        >
          <PlaygroundSidebar />
        </div>

        {/* Sidebar toggle */}
        <div className="relative z-10 flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={cn(
              'absolute z-10 p-1.5 rounded-r-md border border-l-0 border-border bg-bg-surface text-text-subtle hover:text-text-primary hover:bg-bg-elevated transition-all',
              sidebarOpen ? 'left-0' : '-left-px',
            )}
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {sidebarOpen
              ? <PanelLeftClose size={16} />
              : <PanelLeftOpen  size={16} />
            }
          </button>
        </div>

        {/* Editor + Output split pane */}
        <SplitPane
          left={<EditorPanel onSave={onSave} />}
          right={<OutputPanel />}
          defaultSplit={58}
          minLeft={30}
          minRight={24}
          className="flex-1 overflow-hidden"
        />
      </div>

      {/* ── Mobile layout: stacked ── */}
      <div className="flex md:hidden flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-hidden min-h-0">
          <EditorPanel onSave={onSave} />
        </div>
        <div className="h-[45vh] border-t border-border shrink-0 overflow-hidden">
          <OutputPanel />
        </div>
      </div>
    </div>
  )
}
