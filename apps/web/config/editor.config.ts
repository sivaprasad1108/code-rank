// Monaco editor default options and execution constants

export const EDITOR_OPTIONS = {
  fontSize: 14,
  tabSize: 2,
  wordWrap: 'on',
  lineNumbers: 'on',
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
  fontLigatures: true,
  renderWhitespace: 'selection',
  cursorBlinking: 'smooth',
  smoothScrolling: true,
  contextmenu: false,
  automaticLayout: true,
  padding: { top: 16, bottom: 16 },
  lineHeight: 1.65,
  scrollbar: {
    verticalScrollbarSize: 6,
    horizontalScrollbarSize: 6,
  },
} as const

export const EDITOR_THEME_NAME = 'coderank-dark'

export const EXECUTION_LIMITS = {
  timeoutMs: 10_000,
  maxCodeBytes: 65_536,     // 64 KB
  maxOutputBytes: 1_048_576, // 1 MB
} as const

// Custom Monaco dark theme matching CodeRank design system
export const MONACO_THEME_DATA = {
  base: 'vs-dark' as const,
  inherit: true,
  rules: [
    { token: 'keyword',         foreground: 'c084fc' },
    { token: 'string',          foreground: '4ade80' },
    { token: 'comment',         foreground: '4a5578', fontStyle: 'italic' },
    { token: 'number',          foreground: 'fb923c' },
    { token: 'type',            foreground: 'a5f3fc' },
    { token: 'function',        foreground: '67e8f9' },
    { token: 'variable',        foreground: 'f0f4ff' },
    { token: 'operator',        foreground: 'c084fc' },
    { token: 'delimiter',       foreground: '8b9cc8' },
    { token: 'class',           foreground: 'fde68a' },
    { token: 'interface',       foreground: 'a5f3fc' },
    { token: 'namespace',       foreground: 'fde68a' },
    { token: 'tag',             foreground: 'c084fc' },
    { token: 'attribute.name',  foreground: '67e8f9' },
    { token: 'attribute.value', foreground: '4ade80' },
  ],
  colors: {
    'editor.background':              '#080912',
    'editor.foreground':              '#E8ECF8',
    'editor.lineHighlightBackground': '#0C0D1B',
    'editor.selectionBackground':     '#7c3aed40',
    'editor.inactiveSelectionBackground': '#7c3aed20',
    'editorLineNumber.foreground':    '#2E3450',
    'editorLineNumber.activeForeground': '#4A5578',
    'editorCursor.foreground':        '#7C3AED',
    'editor.findMatchBackground':     '#7c3aed40',
    'editor.findMatchHighlightBackground': '#7c3aed20',
    'editorBracketMatch.background':  '#7c3aed30',
    'editorBracketMatch.border':      '#7c3aed',
    'editorGutter.background':        '#080912',
    'editorWidget.background':        '#101223',
    'editorWidget.border':            '#1E2035',
    'editorSuggestWidget.background': '#101223',
    'editorSuggestWidget.border':     '#1E2035',
    'editorSuggestWidget.selectedBackground': '#7c3aed30',
    'scrollbar.shadow':               '#00000000',
    'scrollbarSlider.background':     '#ffffff08',
    'scrollbarSlider.hoverBackground': '#ffffff12',
    'scrollbarSlider.activeBackground': '#ffffff20',
    'focusBorder':                    '#7C3AED',
    'input.background':               '#12131F',
    'input.border':                   '#1E2035',
  },
}
