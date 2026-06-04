'use client'

import { useState } from 'react'
import MonacoEditor, { type OnMount } from '@monaco-editor/react'
import { Play, Save, RotateCcw, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EDITOR_OPTIONS, EDITOR_THEME_NAME, MONACO_THEME_DATA } from '@/config/editor.config'
import { LANGUAGES } from '@/config/languages.config'

const DEFAULT_CODE = `def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
`

interface BattleEditorProps {
  readOnly?: boolean
  initialCode?: string
  initialLanguage?: string
}

export function BattleEditor({
  readOnly = false,
  initialCode = DEFAULT_CODE,
  initialLanguage = 'python',
}: BattleEditorProps) {
  const [code, setCode]     = useState(initialCode)
  const [language, setLang] = useState(initialLanguage)
  const [langOpen, setLangOpen] = useState(false)

  const langConfig = LANGUAGES.find((l) => l.id === language) ?? LANGUAGES[0]

  const handleMount: OnMount = (_editor, monaco) => {
    monaco.editor.defineTheme(EDITOR_THEME_NAME, MONACO_THEME_DATA)
    monaco.editor.setTheme(EDITOR_THEME_NAME)
  }

  return (
    <div className="flex flex-col h-full bg-bg-primary">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-bg-surface border-b border-border shrink-0">
        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => setLangOpen((o) => !o)}
            className="flex items-center gap-1.5 h-7 px-2.5 rounded-md bg-bg-elevated border border-border text-xs text-text-muted hover:border-border-strong hover:text-text-primary transition-colors"
          >
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: langConfig.color }} />
            {langConfig.label}
            <ChevronDown size={11} />
          </button>

          {langOpen && (
            <div className="absolute left-0 top-full mt-1 w-36 py-1 bg-bg-overlay border border-border rounded-lg shadow-xl z-50">
              {LANGUAGES.map((l) => (
                <button
                  key={l.id}
                  onClick={() => { setLang(l.id); setCode(l.defaultCode); setLangOpen(false) }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-text-muted hover:bg-bg-hover hover:text-text-primary transition-colors"
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: l.color }} />
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="text-xs text-text-subtle font-code">main.{langConfig.fileExtension}</span>

        <div className="flex items-center gap-1.5 ml-auto">
          {!readOnly && (
            <>
              <button className="h-7 px-2 rounded-md text-xs text-text-muted bg-bg-elevated border border-border hover:border-border-strong hover:text-text-primary transition-colors flex items-center gap-1">
                <RotateCcw size={11} />
                Reset
              </button>
              <Button variant="ghost" size="sm" className="h-7 gap-1.5">
                <Save size={12} />
                Draft
              </Button>
              <Button variant="primary" size="sm" className="h-7 gap-1.5 shadow-glow-sm">
                <Play size={11} className="fill-white" />
                Run
              </Button>
            </>
          )}
          {readOnly && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-text-subtle/10 text-text-subtle border border-border font-medium uppercase tracking-wide">
              Read Only
            </span>
          )}
        </div>
      </div>

      {/* Monaco */}
      <div className="flex-1 overflow-hidden">
        <MonacoEditor
          height="100%"
          language={langConfig.monacoLanguage}
          value={code}
          theme={EDITOR_THEME_NAME}
          onChange={(val) => { if (!readOnly) setCode(val ?? '') }}
          onMount={handleMount}
          options={{
            ...EDITOR_OPTIONS,
            readOnly,
          }}
          loading={
            <div className="flex items-center justify-center h-full bg-bg-primary">
              <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          }
        />
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-1 bg-bg-surface border-t border-border shrink-0">
        <div className="flex items-center gap-3 font-code text-[10px] text-text-subtle">
          <span>Ln 1, Col 1</span>
          <span className="w-px h-3 bg-border" />
          <span>UTF-8</span>
        </div>
        <div className="font-code text-[10px] text-text-subtle">{langConfig.label}</div>
      </div>
    </div>
  )
}
