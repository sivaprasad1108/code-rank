import Link from 'next/link'
import { Terminal } from 'lucide-react'
import { ROUTES } from '@/config/navigation.config'

const FOOTER_COLS = [
  {
    title: 'Product',
    links: [
      { label: 'Playground',  href: ROUTES.PLAYGROUND },
      { label: 'Snippets',    href: ROUTES.FEED },
      { label: 'Pricing',     href: '#pricing' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign in',  href: ROUTES.LOGIN },
      { label: 'Register', href: ROUTES.REGISTER },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Docs',       href: '#' },
      { label: 'API',        href: '#' },
      { label: 'Status',     href: '#' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-surface">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-[200px_repeat(3,1fr)] gap-8 mb-12">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-1 flex flex-col gap-4">
            <Link href={ROUTES.HOME} className="flex items-center gap-2 w-fit group">
              <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-all">
                <Terminal size={13} className="text-white" />
              </div>
              <span className="font-bold text-sm text-gradient">CodeRank</span>
            </Link>
            <p className="text-xs text-text-subtle leading-relaxed max-w-[200px]">
              Cloud code execution and snippet sharing for developers.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <p className="text-xs font-semibold text-text-primary">{col.title}</p>
              <nav className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-xs text-text-subtle hover:text-text-muted transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-subtle">
            © {new Date().getFullYear()} CodeRank. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-xs text-text-subtle hover:text-text-muted transition-colors">Privacy</Link>
            <Link href="#" className="text-xs text-text-subtle hover:text-text-muted transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
