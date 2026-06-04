'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Snippet, CreateSnippet } from '@coderank/types'
import { SUPPORTED_LANGUAGES } from '@coderank/types'
import { Modal } from '@/components/shared/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { apiClient } from '@/lib/api/client'
import { ENDPOINTS } from '@/lib/api/endpoints'
import { queryKeys } from '@/lib/api/query-keys'
import { useEditorStore } from '@/features/playground/store/editor.store'

interface SaveSnippetModalProps {
  isOpen: boolean
  onClose: () => void
  onSaved?: (snippet: Snippet) => void
}

export function SaveSnippetModal({ isOpen, onClose, onSaved }: SaveSnippetModalProps) {
  const { code, language } = useEditorStore()
  const queryClient = useQueryClient()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateSnippet) => apiClient.post<Snippet>(ENDPOINTS.SNIPPETS.CREATE, data),
    onSuccess: (snippet) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.snippets.all() })
      onSaved?.(snippet)
      onClose()
      setTitle('')
      setDescription('')
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Failed to save snippet')
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    setError('')
    // language is always a valid supported language since it comes from LANGUAGES config
    const lang = SUPPORTED_LANGUAGES.includes(language as typeof SUPPORTED_LANGUAGES[number])
      ? (language as typeof SUPPORTED_LANGUAGES[number])
      : SUPPORTED_LANGUAGES[0]

    mutate({
      title: title.trim(),
      description: description.trim() || undefined,
      language: lang,
      code,
      isPublic: true,
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Save snippet"
      size="md"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" size="md" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit}
            isLoading={isPending}
          >
            Save & share
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Title"
          placeholder="My awesome snippet"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={error && !title.trim() ? error : undefined}
          required
          autoFocus
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-primary">
            Description{' '}
            <span className="text-text-subtle font-normal">(optional)</span>
          </label>
          <textarea
            className="w-full h-20 rounded-lg px-3 py-2 bg-bg-surface border border-border text-text-primary text-sm placeholder:text-text-subtle outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/30 resize-none"
            placeholder="What does this snippet do?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {error && title.trim() && (
          <p className="text-xs text-error">{error}</p>
        )}
      </form>
    </Modal>
  )
}
