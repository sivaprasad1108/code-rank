'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useComments } from '../hooks/useComments'

interface CommentFormProps {
  snippetSlug: string
  parentId?: string
  placeholder?: string
  onSubmitted?: () => void
}

export function CommentForm({
  snippetSlug,
  parentId,
  placeholder = 'Add a comment…',
  onSubmitted,
}: CommentFormProps) {
  const [body, setBody] = useState('')
  const { addComment } = useComments(snippetSlug)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return

    addComment.mutate(
      { body: body.trim(), parentId },
      {
        onSuccess: () => {
          setBody('')
          onSubmitted?.()
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        className="w-full h-20 rounded-lg px-3 py-2 bg-bg-surface border border-border text-text-primary text-sm placeholder:text-text-subtle outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/30 resize-none"
        placeholder={placeholder}
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          size="sm"
          isLoading={addComment.isPending}
          disabled={!body.trim()}
        >
          Comment
        </Button>
      </div>
    </form>
  )
}
