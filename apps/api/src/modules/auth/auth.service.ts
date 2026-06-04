import bcrypt from 'bcrypt'
import type { FastifyInstance } from 'fastify'
import type { CreateUser, Login } from '@coderank/types'
import { UserRepository } from '@/repositories/user.repository'
import { ConflictError, UnauthorizedError } from '@/common/errors/AppError'
import { db } from '@/db/client'

const BCRYPT_ROUNDS = 12

export class AuthService {
  private users: UserRepository

  constructor(private app: FastifyInstance) {
    this.users = new UserRepository(db)
  }

  async register(input: CreateUser) {
    const [existingEmail, existingUsername] = await Promise.all([
      this.users.findByEmail(input.email),
      this.users.findByUsername(input.username),
    ])

    if (existingEmail) throw new ConflictError('Email already in use')
    if (existingUsername) throw new ConflictError('Username already taken')

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS)
    const user = await this.users.create({
      username: input.username,
      email: input.email,
      passwordHash,
    })

    const token = this.app.jwt.sign({ sub: user.id, username: user.username })
    return { user: this.toPublic(user), token }
  }

  async login(input: Login) {
    const user = await this.users.findByEmail(input.email)
    if (!user || !user.passwordHash) throw new UnauthorizedError('Invalid email or password')

    const valid = await bcrypt.compare(input.password, user.passwordHash)
    if (!valid) throw new UnauthorizedError('Invalid email or password')

    const token = this.app.jwt.sign({ sub: user.id, username: user.username })
    return { user: this.toPublic(user), token }
  }

  async me(userId: string) {
    const user = await this.users.findById(userId)
    if (!user) throw new UnauthorizedError()
    return this.toPublic(user)
  }

  private toPublic(user: { id: string; username: string; email: string; avatarUrl: string | null; bio: string | null; createdAt: Date }) {
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
