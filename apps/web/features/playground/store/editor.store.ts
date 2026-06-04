import { create } from 'zustand'
import type { ExecuteResult, TestCase } from '@coderank/types'
import { LANGUAGES, DEFAULT_LANGUAGE_ID, getLanguageById } from '@/config/languages.config'

interface EditorState {
  code:       string
  language:   string
  output:     ExecuteResult | null
  isRunning:  boolean
  testCases:  TestCase[]

  setCode:          (code: string) => void
  setLanguage:      (lang: string) => void
  setOutput:        (result: ExecuteResult) => void
  setRunning:       (v: boolean) => void
  clearOutput:      () => void
  setTestCases:     (cases: TestCase[]) => void
  addTestCase:      () => void
  removeTestCase:   (index: number) => void
  updateTestCase:   (index: number, patch: Partial<TestCase>) => void
  reset:            () => void
}

const defaultLang = getLanguageById(DEFAULT_LANGUAGE_ID) ?? LANGUAGES[0]
const DEFAULT_TEST_CASES: TestCase[] = [{ stdin: '', expectedOutput: undefined }]

export const useEditorStore = create<EditorState>((set) => ({
  code:      defaultLang.defaultCode,
  language:  defaultLang.id,
  output:    null,
  isRunning: false,
  testCases: DEFAULT_TEST_CASES,

  setCode: (code) => set({ code }),

  setLanguage: (lang) => {
    const langConfig = getLanguageById(lang)
    set({ language: lang, code: langConfig?.defaultCode ?? '', output: null })
  },

  setOutput:    (result) => set({ output: result }),
  setRunning:   (v) => set({ isRunning: v }),
  clearOutput:  () => set({ output: null }),
  setTestCases: (cases) => set({ testCases: cases }),

  addTestCase: () =>
    set((s) => ({
      testCases: [...s.testCases, { stdin: '', expectedOutput: undefined }],
    })),

  removeTestCase: (index) =>
    set((s) => ({
      testCases: s.testCases.length > 1
        ? s.testCases.filter((_, i) => i !== index)
        : s.testCases,
    })),

  updateTestCase: (index, patch) =>
    set((s) => ({
      testCases: s.testCases.map((tc, i) => (i === index ? { ...tc, ...patch } : tc)),
    })),

  reset: () =>
    set({
      code:      defaultLang.defaultCode,
      language:  defaultLang.id,
      output:    null,
      isRunning: false,
      testCases: DEFAULT_TEST_CASES,
    }),
}))
