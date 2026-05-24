'use client'

import { Play, Save } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { LanguageBadge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { LANGUAGES } from '@/config/languages.config'
import { useEditorStore } from '../store/editor.store'
import { useExecution } from '../hooks/useExecution'

interface EditorToolbarProps {
  onSave?: () => void
}

export function EditorToolbar({ onSave }: EditorToolbarProps) {
  const { language, setLanguage, isRunning } = useEditorStore()
  const { run } = useExecution()

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-bg-surface shrink-0">
      {/* Language selector */}
      <div className="relative">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="appearance-none bg-bg-elevated border border-border rounded-lg pl-3 pr-8 py-1.5 text-sm text-text-primary cursor-pointer focus:outline-none focus:border-accent transition-colors"
          aria-label="Select language"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.label}
            </option>
          ))}
        </select>
        <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
          <LanguageBadge language={language} />
        </span>
      </div>

      <div className="flex-1" />

      {/* Save */}
      {onSave && (
        <Button variant="ghost" size="sm" onClick={onSave}>
          <Save size={15} className="mr-1.5" />
          Save
        </Button>
      )}

      {/* Run */}
      <Button
        variant="primary"
        size="sm"
        onClick={run}
        disabled={isRunning}
        aria-label={isRunning ? 'Running…' : 'Run code'}
      >
        {isRunning ? (
          <>
            <Spinner size="sm" className="mr-1.5" />
            Running…
          </>
        ) : (
          <>
            <Play size={15} className="mr-1.5" />
            Run
          </>
        )}
      </Button>
    </div>
  )
}
