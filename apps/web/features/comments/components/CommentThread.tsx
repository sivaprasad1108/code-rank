'use client'

import { MessageSquare } from 'lucide-react'
import { CommentItem } from './CommentItem'
import { CommentForm } from './CommentForm'
import { EmptyState } from '@/components/shared/EmptyState'
import { SnippetCardSkeleton } from '@/components/ui/Skeleton'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { useComments } from '../hooks/useComments'
import type { Comment } from '@coderank/types'

interface CommentThreadProps {
  snippetSlug: string
  currentUserId?: string
}

function buildTree(comments: Comment[]): Comment[] {
  const map = new Map<string, Comment & { replies?: Comment[] }>()
  const roots: Comment[] = []

  for (const c of comments) {
    map.set(c.id, { ...c, replies: [] })
  }

  for (const c of comments) {
    if (c.parentId) {
      const parent = map.get(c.parentId)
      if (parent) {
        ;(parent as Comment & { replies: Comment[] }).replies!.push(map.get(c.id)!)
      } else {
        roots.push(map.get(c.id)!)
      }
    } else {
      roots.push(map.get(c.id)!)
    }
  }

  return roots
}

export function CommentThread({ snippetSlug, currentUserId }: CommentThreadProps) {
  const { data: comments, isLoading, deleteComment } = useComments(snippetSlug)

  const tree = comments ? buildTree(comments) : []

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        title={`Comments${comments ? ` (${comments.length})` : ''}`}
      />

      <CommentForm snippetSlug={snippetSlug} />

      {isLoading && (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <SnippetCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && tree.length === 0 && (
        <EmptyState
          icon={<MessageSquare size={28} />}
          title="No comments yet"
          description="Be the first to leave a comment."
        />
      )}

      {!isLoading && tree.length > 0 && (
        <div className="flex flex-col gap-6">
          {tree.map((comment) => (
            <div key={comment.id}>
              <CommentItem
                comment={comment}
                snippetSlug={snippetSlug}
                currentUserId={currentUserId}
                onDelete={(id) => deleteComment.mutate(id)}
              />
              {/* Nested replies */}
              {(comment as Comment & { replies?: Comment[] }).replies?.length ? (
                <div className="ml-10 mt-4 flex flex-col gap-4 border-l border-border pl-4">
                  {(comment as Comment & { replies: Comment[] }).replies.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      snippetSlug={snippetSlug}
                      currentUserId={currentUserId}
                      onDelete={(id) => deleteComment.mutate(id)}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
