'use client'

import { useState, useEffect } from 'react'
import { EDITOR_OPTIONS } from '@/config/editor.config'

interface EditorPrefs {
  fontSize: number
  tabSize: number
  wordWrap: 'on' | 'off'
  lineNumbers: 'on' | 'off'
}

const STORAGE_KEY = 'coderank:editor-prefs'

const DEFAULTS: EditorPrefs = {
  fontSize: EDITOR_OPTIONS.fontSize,
  tabSize: EDITOR_OPTIONS.tabSize,
  wordWrap: EDITOR_OPTIONS.wordWrap,
  lineNumbers: EDITOR_OPTIONS.lineNumbers,
}

export function useEditorPrefs() {
  const [prefs, setPrefs] = useState<EditorPrefs>(DEFAULTS)

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setPrefs({ ...DEFAULTS, ...JSON.parse(stored) })
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  function updatePrefs(patch: Partial<EditorPrefs>) {
    setPrefs((prev) => {
      const next = { ...prev, ...patch }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // ignore storage errors
      }
      return next
    })
  }

  return { prefs, updatePrefs }
}
