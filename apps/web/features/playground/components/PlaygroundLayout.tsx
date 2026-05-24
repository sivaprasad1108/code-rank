'use client'

import { useEffect } from 'react'
import { SplitPane } from '@/components/layout/SplitPane'
import { EditorPanel } from './EditorPanel'
import { OutputPanel } from './OutputPanel'
import { useExecution } from '../hooks/useExecution'

interface PlaygroundLayoutProps {
  onSave?: () => void
}

export function PlaygroundLayout({ onSave }: PlaygroundLayoutProps) {
  const { run } = useExecution()

  // Listen for Ctrl+Enter shortcut dispatched from Monaco
  useEffect(() => {
    function handleRun() {
      run()
    }
    document.addEventListener('coderank:run', handleRun)
    return () => document.removeEventListener('coderank:run', handleRun)
  }, [run])

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Desktop: side-by-side split pane */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        <SplitPane
          left={<EditorPanel onSave={onSave} />}
          right={<OutputPanel />}
          defaultSplit={58}
          minLeft={30}
          minRight={25}
          className="flex-1"
        />
      </div>

      {/* Mobile: stacked editor + output sheet */}
      <div className="flex md:hidden flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <EditorPanel onSave={onSave} />
        </div>
        <div className="h-[40vh] border-t border-border shrink-0">
          <OutputPanel />
        </div>
      </div>
    </div>
  )
}
