'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Terminal, Zap, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/Button'
import { NAV_LINKS_EXTENDED, ROUTES } from '@/config/navigation.config'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Avatar } from '@/components/ui/Avatar'

export function NavBar() {
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <header className="fixed top-0 inset-x-0 z-[200] h-14">
      {/* Glass backdrop */}
      <div className="h-full border-b border-border bg-bg-surface/80 backdrop-blur-xl">
        <nav className="h-full max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center gap-6">

          {/* ── Logo ── */}
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-2 shrink-0 group"
          >
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-all duration-[var(--duration-normal)]">
              <Terminal size={13} className="text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight text-gradient hidden sm:inline">
              CodeRank
            </span>
          </Link>

          {/* ── Divider ── */}
          <div className="hidden sm:block h-4 w-px bg-border shrink-0" />

          {/* ── Primary nav links ── */}
          <div className="flex items-center gap-0.5 flex-1">
            {NAV_LINKS_EXTENDED.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-[var(--duration-fast)]',
                    'hover:bg-bg-hover hover:text-text-primary',
                    isActive
                      ? 'text-text-primary bg-bg-active'
                      : 'text-text-muted',
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* ── Right side ── */}
          <div className="flex items-center gap-2 shrink-0">
            {isAuthenticated && user ? (
              <>
                {/* Pro badge */}
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent/10 border border-accent/25 text-accent text-xs font-semibold">
                  <Zap size={10} className="fill-accent" />
                  Pro
                </div>

                {/* User avatar + dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-bg-hover transition-colors">
                    <Avatar
                      src={undefined}
                      name={user.username}
                      size="xs"
                    />
                    <span className="hidden sm:inline text-xs text-text-muted font-medium max-w-[80px] truncate">
                      {user.username}
                    </span>
                    <ChevronDown size={12} className="text-text-subtle" />
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 top-full mt-1.5 w-44 py-1 bg-bg-overlay border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-[var(--duration-fast)] z-[300]">
                    <Link
                      href={ROUTES.PROFILE(user.username)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
                    >
                      Profile
                    </Link>
                    <div className="my-1 h-px bg-border" />
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-error hover:bg-error/10 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={ROUTES.LOGIN}>Sign in</Link>
                </Button>
                <Button variant="primary" size="sm" asChild className="hidden sm:inline-flex">
                  <Link href={ROUTES.REGISTER}>Get started</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
