import { eq, and } from 'drizzle-orm'
import { UserRepository } from '@/repositories/user.repository'
import { SnippetRepository } from '@/repositories/snippet.repository'
import { db } from '@/db/client'
import { follows } from '@/db/schema'
import { NotFoundError, ForbiddenError } from '@/common/errors/AppError'

export class UsersService {
  private users: UserRepository
  private snippets: SnippetRepository

  constructor() {
    this.users = new UserRepository(db)
    this.snippets = new SnippetRepository(db)
  }

  async getProfile(username: string, viewerUserId?: string) {
    const user = await this.users.findByUsername(username)
    if (!user) throw new NotFoundError('User')

    let followedByMe = false
    if (viewerUserId) {
      const row = await db
        .select()
        .from(follows)
        .where(and(eq(follows.followerId, viewerUserId), eq(follows.followingId, user.id)))
        .limit(1)
      followedByMe = !!row[0]
    }

    return {
      id: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      followedByMe,
    }
  }

  async getUserSnippets(username: string) {
    const user = await this.users.findByUsername(username)
    if (!user) throw new NotFoundError('User')

    return this.snippets.findByUserId(user.id)
  }

  async toggleFollow(followerId: string, username: string) {
    if (!followerId) throw new ForbiddenError()

    const target = await this.users.findByUsername(username)
    if (!target) throw new NotFoundError('User')
    if (target.id === followerId) throw new ForbiddenError("You can't follow yourself")

    const existing = await db
      .select()
      .from(follows)
      .where(and(eq(follows.followerId, followerId), eq(follows.followingId, target.id)))
      .limit(1)

    if (existing[0]) {
      await db.delete(follows).where(and(eq(follows.followerId, followerId), eq(follows.followingId, target.id)))
      return { following: false }
    } else {
      await db.insert(follows).values({ followerId, followingId: target.id })
      return { following: true }
    }
  }

  async updateMe(userId: string, data: { username?: string; bio?: string | null }) {
    const user = await this.users.update(userId, data)
    if (!user) throw new NotFoundError('User')

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      createdAt: user.createdAt.toISOString(),
    }
  }
}
