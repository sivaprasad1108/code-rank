'use client'

import { useState } from 'react'
import { Trash2, MessageSquare } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils/format'
import { ROUTES } from '@/config/navigation.config'
import type { Comment } from '@coderank/types'
import Link from 'next/link'
import { CommentForm } from './CommentForm'

interface CommentItemProps {
  comment: Comment
  snippetSlug: string
  onDelete?: (id: string) => void
  currentUserId?: string
}

export function CommentItem({
  comment,
  snippetSlug,
  onDelete,
  currentUserId,
}: CommentItemProps) {
  const [showReply, setShowReply] = useState(false)
  const isOwner = currentUserId === comment.author?.id

  return (
    <div className="flex gap-3">
      <Link href={comment.author ? ROUTES.PROFILE(comment.author.username) : '#'}>
        <Avatar
          src={comment.author?.avatarUrl ?? undefined}
          name={comment.author?.username ?? 'Anonymous'}
          size="sm"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Link
            href={comment.author ? ROUTES.PROFILE(comment.author.username) : '#'}
            className="text-sm font-medium text-text-primary hover:text-accent transition-colors"
          >
            {comment.author?.username ?? 'Anonymous'}
          </Link>
          <span className="text-xs text-text-subtle">
            {formatDate(comment.createdAt)}
          </span>
        </div>

        <p className="text-sm text-text-muted leading-relaxed">{comment.body}</p>

        <div className="flex items-center gap-2 mt-1.5">
          <button
            onClick={() => setShowReply((v) => !v)}
            className="flex items-center gap-1 text-xs text-text-subtle hover:text-text-muted transition-colors"
          >
            <MessageSquare size={12} />
            Reply
          </button>

          {isOwner && onDelete && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onDelete(comment.id)}
              aria-label="Delete comment"
              className="h-5 w-5 text-text-subtle hover:text-error"
            >
              <Trash2 size={12} />
            </Button>
          )}
        </div>

        {showReply && (
          <div className="mt-3">
            <CommentForm
              snippetSlug={snippetSlug}
              parentId={comment.id}
              placeholder="Write a reply…"
              onSubmitted={() => setShowReply(false)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
