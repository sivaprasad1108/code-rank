'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { Mail, Lock, User } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { apiClient } from '@/lib/api/client'
import { ENDPOINTS } from '@/lib/api/endpoints'
import { ROUTES } from '@/config/navigation.config'
import { queryKeys } from '@/lib/api/query-keys'
import type { User as UserType } from '@coderank/types'

export function RegisterForm() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const user = await apiClient.post<UserType>(ENDPOINTS.AUTH.REGISTER, {
        username,
        email,
        password,
      })
      queryClient.setQueryData(queryKeys.me(), user)
      router.push(ROUTES.PLAYGROUND)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        type="text"
        label="Username"
        placeholder="yourhandle"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        leftIcon={<User size={16} />}
        hint="3–32 characters, letters, numbers, _ or -"
        required
        autoComplete="username"
      />
      <Input
        type="email"
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        leftIcon={<Mail size={16} />}
        required
        autoComplete="email"
      />
      <Input
        type="password"
        label="Password"
        placeholder="Min. 8 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        leftIcon={<Lock size={16} />}
        required
        autoComplete="new-password"
      />

      {error && (
        <p className="text-sm text-error rounded-lg bg-error/10 border border-error/20 px-3 py-2">
          {error}
        </p>
      )}

      <Button type="submit" variant="primary" size="md" isLoading={isLoading} className="mt-2">
        Create account
      </Button>
    </form>
  )
}
