'use client'

import { PageLayout } from '@/components/layout/PageLayout'
import { ProfileHeader, ProfileSnippets, useProfile } from '@/features/profile'
import { Skeleton } from '@/components/ui/Skeleton'

interface Props {
  params: { username: string }
}

export default function ProfilePage({ params }: Props) {
  const { profile, snippets, isLoading, isSnippetsLoading } = useProfile(params.username)

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        ) : profile ? (
          <ProfileHeader
            profile={profile}
            snippetCount={snippets.length}
          />
        ) : (
          <p className="text-text-muted text-center py-16">User not found.</p>
        )}

        {profile && (
          <ProfileSnippets
            snippets={snippets}
            isLoading={isSnippetsLoading}
          />
        )}
      </div>
    </PageLayout>
  )
}
