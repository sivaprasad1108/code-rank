import Link from 'next/link'
import { Terminal } from 'lucide-react'
import { ROUTES } from '@/config/navigation.config'

const FOOTER_LINKS = [
  { label: 'Playground', href: ROUTES.PLAYGROUND },
  { label: 'Feed', href: ROUTES.FEED },
  { label: 'Sign in', href: ROUTES.LOGIN },
  { label: 'Sign up', href: ROUTES.REGISTER },
] as const

export function Footer() {
  return (
    <footer className="border-t border-border py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <Link
          href={ROUTES.HOME}
          className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors"
        >
          <div className="w-6 h-6 rounded-md bg-accent/80 flex items-center justify-center">
            <Terminal size={12} className="text-white" />
          </div>
          <span className="font-semibold">CodeRank</span>
        </Link>

        {/* Links */}
        <nav className="flex items-center gap-5">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-xs text-text-subtle">
          © {new Date().getFullYear()} CodeRank
        </p>
      </div>
    </footer>
  )
}
