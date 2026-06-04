import { Code2, Star, Users } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { MetricCard } from '@/components/shared/MetricCard'
import { GlassCard } from '@/components/shared/GlassCard'
import { FollowButton } from './FollowButton'
import type { PublicUser } from '@coderank/types'

interface ProfileHeaderProps {
  profile: PublicUser
  snippetCount?: number
  currentUserId?: string
}

export function ProfileHeader({ profile, snippetCount = 0, currentUserId }: ProfileHeaderProps) {
  const isOwnProfile = currentUserId === profile.id

  return (
    <GlassCard padding="lg">
      <div className="flex flex-col sm:flex-row items-start gap-5">
        <Avatar src={profile.avatarUrl ?? undefined} name={profile.username} size="lg" />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-text-primary">{profile.username}</h1>
              {profile.bio && (
                <p className="text-text-muted text-sm mt-1 max-w-md">{profile.bio}</p>
              )}
            </div>
            {!isOwnProfile && (
              <FollowButton username={profile.username} />
            )}
          </div>

          <MetricCard
            className="mt-4"
            metrics={[
              { iconNode: <Code2 size={14} />, label: 'snippets', value: snippetCount },
            ]}
          />
        </div>
      </div>
    </GlassCard>
  )
}
