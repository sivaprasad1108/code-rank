import { cn } from '@/lib/utils/cn'
import { CopyButton } from './CopyButton'

interface CodeBlockProps {
  code: string
  language?: string
  showLineNumbers?: boolean
  showCopy?: boolean
  className?: string
  maxHeight?: string
}

export function CodeBlock({
  code,
  language,
  showLineNumbers = true,
  showCopy = true,
  className,
  maxHeight = '400px',
}: CodeBlockProps) {
  const lines = code.split('\n')

  return (
    <div className={cn('glass rounded-xl overflow-hidden border border-border', className)}>
      {/* Header */}
      {(language || showCopy) && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-bg-elevated/60">
          {language && (
            <span className="text-xs text-text-muted font-code capitalize">{language}</span>
          )}
          {showCopy && (
            <CopyButton text={code} className="ml-auto" />
          )}
        </div>
      )}

      {/* Code */}
      <div className="overflow-auto" style={{ maxHeight }}>
        <pre className="p-4 font-code text-sm leading-relaxed">
          {lines.map((line, i) => (
            <div key={i} className="flex">
              {showLineNumbers && (
                <span className="select-none w-10 text-text-subtle opacity-40 text-right pr-4 shrink-0">
                  {i + 1}
                </span>
              )}
              <span className="text-text-primary">{line || ' '}</span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  )
}
