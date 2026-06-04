'use client'

import Link from 'next/link'
import { Terminal, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/config/navigation.config'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="min-h-screen bg-bg-primary bg-hero-radial flex items-center justify-center p-4">
      <div className="text-center flex flex-col items-center gap-6 max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-error/10 border border-error/20 flex items-center justify-center">
          <Terminal size={28} className="text-error" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-text-primary">Something went wrong</h1>
          <p className="text-text-muted">
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
          {error.digest && (
            <p className="text-xs text-text-subtle font-code mt-1">ID: {error.digest}</p>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="primary" size="md" onClick={reset}>
            <RefreshCw size={15} className="mr-1.5" />
            Try again
          </Button>
          <Button variant="secondary" size="md" asChild>
            <Link href={ROUTES.HOME}>Go home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
