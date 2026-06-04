'use client'

import { useRef } from 'react'
import MonacoEditor, { type OnMount } from '@monaco-editor/react'
import { EDITOR_OPTIONS, EDITOR_THEME_NAME, MONACO_THEME_DATA } from '@/config/editor.config'
import { getLanguageById } from '@/config/languages.config'
import { useEditorStore } from '../store/editor.store'
import { useEditorPrefs } from '../hooks/useEditorPrefs'
import { EditorToolbar } from './EditorToolbar'

interface EditorPanelProps {
  onSave?: () => void
}

export function EditorPanel({ onSave }: EditorPanelProps) {
  const { code, language, setCode, isRunning } = useEditorStore()
  const { prefs } = useEditorPrefs()
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null)

  const langConfig = getLanguageById(language)

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor

    // Register and apply custom theme
    monaco.editor.defineTheme(EDITOR_THEME_NAME, MONACO_THEME_DATA)
    monaco.editor.setTheme(EDITOR_THEME_NAME)

    // Run on Ctrl/Cmd+Enter
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      () => {
        if (!isRunning) {
          document.dispatchEvent(new CustomEvent('coderank:run'))
        }
      },
    )
  }

  return (
    <div className="flex flex-col h-full bg-bg-primary">
      <EditorToolbar onSave={onSave} />

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <MonacoEditor
          height="100%"
          language={langConfig?.monacoLanguage ?? language}
          value={code}
          theme={EDITOR_THEME_NAME}
          onChange={(val) => setCode(val ?? '')}
          onMount={handleMount}
          options={{
            ...EDITOR_OPTIONS,
            fontSize: prefs.fontSize,
            tabSize: prefs.tabSize,
            wordWrap: prefs.wordWrap,
            lineNumbers: prefs.lineNumbers,
            readOnly: isRunning,
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
          <span className="w-px h-3 bg-border" />
          <span>LF</span>
        </div>
        <div className="font-code text-[10px] text-text-subtle">
          {langConfig?.label ?? language}
        </div>
      </div>
    </div>
  )
}
