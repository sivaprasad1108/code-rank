'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageLayout } from '@/components/layout/PageLayout'
import { PlaygroundLayout } from '@/features/playground'
import { SaveSnippetModal } from '@/features/snippets'
import { ROUTES } from '@/config/navigation.config'
import type { Snippet } from '@coderank/types'

export default function PlaygroundPage() {
  const router = useRouter()
  const [saveOpen, setSaveOpen] = useState(false)

  function handleSaved(snippet: Snippet) {
    router.push(ROUTES.SNIPPET(snippet.slug))
  }

  return (
    <PageLayout hideFooter>
      <PlaygroundLayout onSave={() => setSaveOpen(true)} />
      <SaveSnippetModal
        isOpen={saveOpen}
        onClose={() => setSaveOpen(false)}
        onSaved={handleSaved}
      />
    </PageLayout>
  )
}
