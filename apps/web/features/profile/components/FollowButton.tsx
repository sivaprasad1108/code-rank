'use client'

import { UserPlus, UserMinus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useProfile } from '../hooks/useProfile'

interface FollowButtonProps {
  username: string
}

export function FollowButton({ username }: FollowButtonProps) {
  const { profile, follow, isFollowPending } = useProfile(username)

  if (!profile) return null

  return (
    <Button
      variant={profile.followedByMe ? 'ghost' : 'secondary'}
      size="sm"
      onClick={follow}
      isLoading={isFollowPending}
    >
      {profile.followedByMe ? (
        <>
          <UserMinus size={14} className="mr-1.5" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus size={14} className="mr-1.5" />
          Follow
        </>
      )}
    </Button>
  )
}
