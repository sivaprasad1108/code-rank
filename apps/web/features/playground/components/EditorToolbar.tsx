'use client'

import { Play, Save, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { LANGUAGES } from '@/config/languages.config'
import { Spinner } from '@/components/ui/Spinner'
import { useEditorStore } from '../store/editor.store'
import { useExecution } from '../hooks/useExecution'

interface EditorToolbarProps {
  onSave?: () => void
}

const LANG_DOT_COLORS: Record<string, string> = {
  python:     '#3B82F6',
  javascript: '#F59E0B',
  java:       '#EF4444',
  cpp:        '#8B5CF6',
}

export function EditorToolbar({ onSave }: EditorToolbarProps) {
  const { language, setLanguage, isRunning } = useEditorStore()
  const { run } = useExecution()

  const currentLang = LANGUAGES.find((l) => l.id === language)

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-bg-surface shrink-0 h-11">

      {/* Left — file tab */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-bg-elevated border border-border text-xs font-medium text-text-muted">
          <div
            className="w-2 h-2 rounded-sm shrink-0 opacity-80"
            style={{ backgroundColor: LANG_DOT_COLORS[language] ?? '#8B9CC8' }}
          />
          <span className="font-code">
            main.{currentLang?.fileExtension ?? 'py'}
          </span>
        </div>
        <div className="w-px h-4 bg-border mx-1" />
        {/* Keyboard shortcut hint */}
        <span className="hidden sm:flex items-center gap-1 text-[10px] text-text-subtle/50 font-code">
          <span className="px-1 py-0.5 rounded border border-border text-[9px]">⌘</span>
          <span className="px-1 py-0.5 rounded border border-border text-[9px]">↵</span>
          <span className="ml-0.5">Run</span>
        </span>
      </div>

      {/* Right — controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Language selector */}
        <div className="relative">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={cn(
              'appearance-none bg-bg-input border border-border rounded-md',
              'pl-2.5 pr-7 py-1.5 text-xs text-text-muted font-medium',
              'cursor-pointer hover:border-border-strong hover:text-text-primary',
              'focus:outline-none focus:border-accent transition-all',
            )}
            aria-label="Select language"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.label}
              </option>
            ))}
          </select>
          <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-text-subtle" />
        </div>

        {/* Save */}
        {onSave && (
          <button
            onClick={onSave}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-text-muted hover:text-text-primary hover:bg-bg-hover border border-transparent hover:border-border transition-all"
          >
            <Save size={12} />
            Save
          </button>
        )}

        {/* Run */}
        <button
          onClick={run}
          disabled={isRunning}
          aria-label={isRunning ? 'Running…' : 'Run code (⌘↵)'}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all',
            isRunning
              ? 'bg-accent/20 text-accent cursor-not-allowed'
              : 'bg-accent hover:bg-accent-hover text-white shadow-glow-sm hover:shadow-glow active:scale-[0.97]',
          )}
        >
          {isRunning ? (
            <>
              <Spinner size="sm" />
              Running
            </>
          ) : (
            <>
              <Play size={11} className="fill-white" />
              Run Code
            </>
          )}
        </button>
      </div>
    </div>
  )
}
