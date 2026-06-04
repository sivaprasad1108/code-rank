import Link from 'next/link'
import { Terminal } from 'lucide-react'
import { GlassCard } from '@/components/shared/GlassCard'
import { LoginForm } from '@/features/auth'
import { OAuthButtons } from '@/features/auth'
import { ROUTES } from '@/config/navigation.config'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign in — CodeRank',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-bg-primary bg-hero-glow flex items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col gap-6">
        {/* Logo */}
        <Link href={ROUTES.HOME} className="flex items-center gap-2 justify-center">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Terminal size={16} className="text-white" />
          </div>
          <span className="text-xl font-bold text-gradient">CodeRank</span>
        </Link>

        <GlassCard padding="lg" className="flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-xl font-bold text-text-primary">Welcome back</h1>
            <p className="text-text-muted text-sm mt-1">Sign in to your account</p>
          </div>

          <LoginForm />
          <OAuthButtons />
        </GlassCard>

        <p className="text-center text-sm text-text-muted">
          Don&apos;t have an account?{' '}
          <Link href={ROUTES.REGISTER} className="text-accent hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
