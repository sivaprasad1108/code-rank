'use client'

import { useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Star, GitFork, Play, Share2 } from 'lucide-react'
import { CopyButton } from '@/components/shared/CopyButton'
import { useEditorStore } from '@/features/playground/store/editor.store'
import { ROUTES } from '@/config/navigation.config'
import { ShareModal } from './ShareModal'
import type { Snippet } from '@coderank/types'

interface Props {
  snippet: Snippet
}

export function SnippetActions({ snippet }: Props) {
  const [shareOpen, setShareOpen] = useState(false)
  const router = useRouter()
  const setCode = useEditorStore((s) => s.setCode)
  const setLanguage = useEditorStore((s) => s.setLanguage)

  function handleFork() {
    // setLanguage resets code to default — setCode overrides it immediately after
    setLanguage(snippet.language)
    setCode(snippet.code)
    router.push(ROUTES.PLAYGROUND)
  }

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        <ActionButton icon={<Star size={13} />} label="Star" />
        <ActionButton icon={<GitFork size={13} />} label="Fork & Start" onClick={handleFork} />
        <CopyButton text={snippet.code} className="h-8" />
        <a
          href={`${ROUTES.PLAYGROUND}?snippet=${snippet.slug}`}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-accent hover:bg-accent-hover text-white text-xs font-semibold transition-all shadow-glow-sm hover:shadow-glow active:scale-[0.97]"
        >
          <Play size={11} className="fill-white" />
          Run Code
        </a>
        <ActionButton icon={<Share2 size={13} />} label="Share" onClick={() => setShareOpen(true)} />
      </div>
      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        snippet={snippet}
      />
    </>
  )
}

function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode
  label: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border text-text-muted text-xs font-medium hover:border-border-strong hover:text-text-primary hover:bg-bg-hover transition-all"
    >
      {icon}
      {label}
    </button>
  )
}
