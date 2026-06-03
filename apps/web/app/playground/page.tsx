'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PageLayout } from '@/components/layout/PageLayout'
import { PlaygroundLayout } from '@/features/playground'
import { SaveSnippetModal } from '@/features/snippets'
import { ROUTES } from '@/config/navigation.config'
import { apiClient } from '@/lib/api/client'
import { ENDPOINTS } from '@/lib/api/endpoints'
import { useEditorStore } from '@/features/playground/store/editor.store'
import type { Snippet } from '@coderank/types'

// Separate component so useSearchParams is isolated inside Suspense
function SnippetLoader() {
  const params = useSearchParams()
  const setCode = useEditorStore((s) => s.setCode)
  const setLanguage = useEditorStore((s) => s.setLanguage)

  useEffect(() => {
    const slug = params.get('snippet')
    if (!slug) return
    apiClient
      .get<Snippet>(ENDPOINTS.SNIPPETS.DETAIL(slug))
      .then((snippet) => {
        // setLanguage also resets code — call setCode after to override
        setLanguage(snippet.language)
        setCode(snippet.code)
      })
      .catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export default function PlaygroundPage() {
  const router = useRouter()
  const [saveOpen, setSaveOpen] = useState(false)

  function handleSaved(snippet: Snippet) {
    router.push(ROUTES.SNIPPET(snippet.slug))
  }

  return (
    <PageLayout hideFooter>
      <Suspense fallback={null}>
        <SnippetLoader />
      </Suspense>
      <PlaygroundLayout onSave={() => setSaveOpen(true)} />
      <SaveSnippetModal
        isOpen={saveOpen}
        onClose={() => setSaveOpen(false)}
        onSaved={handleSaved}
      />
    </PageLayout>
  )
}
