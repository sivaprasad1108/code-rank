import { create } from 'zustand'
import type { ExecuteResult } from '@coderank/types'
import { LANGUAGES, DEFAULT_LANGUAGE_ID, getLanguageById } from '@/config/languages.config'

interface EditorState {
  code: string
  language: string
  output: ExecuteResult | null
  isRunning: boolean

  setCode: (code: string) => void
  setLanguage: (lang: string) => void
  setOutput: (result: ExecuteResult) => void
  setRunning: (v: boolean) => void
  clearOutput: () => void
  reset: () => void
}

const defaultLang = getLanguageById(DEFAULT_LANGUAGE_ID) ?? LANGUAGES[0]

export const useEditorStore = create<EditorState>((set) => ({
  code: defaultLang.defaultCode,
  language: defaultLang.id,
  output: null,
  isRunning: false,

  setCode: (code) => set({ code }),

  setLanguage: (lang) => {
    const langConfig = getLanguageById(lang)
    set({
      language: lang,
      // Reset to default code when switching languages
      code: langConfig?.defaultCode ?? '',
      output: null,
    })
  },

  setOutput: (result) => set({ output: result }),
  setRunning: (v) => set({ isRunning: v }),
  clearOutput: () => set({ output: null }),

  reset: () =>
    set({
      code: defaultLang.defaultCode,
      language: defaultLang.id,
      output: null,
      isRunning: false,
    }),
}))
