'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Terminal } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/Button'
import { NAV_LINKS, ROUTES } from '@/config/navigation.config'

export function NavBar() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 inset-x-0 z-40 h-14">
      <div className="glass border-b border-border h-full">
        <nav className="h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-2 text-text-primary font-bold shrink-0"
          >
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
              <Terminal size={14} className="text-white" />
            </div>
            <span className="hidden sm:inline text-gradient">CodeRank</span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  'hover:bg-white/5 hover:text-text-primary',
                  pathname === link.href
                    ? 'text-text-primary bg-white/5'
                    : 'text-text-muted',
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="sm" asChild>
              <Link href={ROUTES.LOGIN}>Sign in</Link>
            </Button>
            <Button variant="primary" size="sm" asChild>
              <Link href={ROUTES.REGISTER}>Sign up</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
