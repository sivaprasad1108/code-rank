'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Terminal, LayoutGrid, User } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { ROUTES } from '@/config/navigation.config'

const MOBILE_TABS = [
  { label: 'Playground', href: ROUTES.PLAYGROUND, Icon: Terminal },
  { label: 'Feed', href: ROUTES.FEED, Icon: LayoutGrid },
  { label: 'Profile', href: '/profile', Icon: User },
] as const

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 glass border-t border-border md:hidden">
      <div className="flex items-center justify-around h-16 px-4">
        {MOBILE_TABS.map(({ label, href, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 rounded-lg',
                'text-xs font-medium transition-colors',
                active ? 'text-accent' : 'text-text-muted',
              )}
            >
              <Icon
                size={20}
                className={cn(
                  'transition-transform',
                  active && 'scale-110',
                )}
              />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
