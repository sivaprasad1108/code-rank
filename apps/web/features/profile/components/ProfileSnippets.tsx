import { Code2 } from 'lucide-react'
import { SnippetGrid } from '@/features/snippets/components/SnippetGrid'
import { EmptyState } from '@/components/shared/EmptyState'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { ROUTES } from '@/config/navigation.config'
import type { Snippet } from '@coderank/types'

interface ProfileSnippetsProps {
  snippets: Snippet[]
  isLoading?: boolean
  isOwnProfile?: boolean
}

export function ProfileSnippets({
  snippets,
  isLoading,
  isOwnProfile,
}: ProfileSnippetsProps) {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader title="Snippets" />

      {!isLoading && snippets.length === 0 ? (
        <EmptyState
          icon={<Code2 size={32} />}
          title={isOwnProfile ? "You haven't saved any snippets yet" : 'No public snippets'}
          description={isOwnProfile ? 'Run some code and save it to share with others.' : undefined}
          action={
            isOwnProfile
              ? { label: 'Open Playground', href: ROUTES.PLAYGROUND }
              : undefined
          }
        />
      ) : (
        <SnippetGrid snippets={snippets} isLoading={isLoading} />
      )}
    </div>
  )
}
