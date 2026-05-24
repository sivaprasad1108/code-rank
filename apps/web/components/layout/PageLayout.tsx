import type { ReactNode } from 'react'
import { NavBar } from './NavBar'
import { Footer } from './Footer'

interface PageLayoutProps {
  children: ReactNode
  /** Hide the standard footer (useful for playground full-screen) */
  hideFooter?: boolean
}

export function PageLayout({ children, hideFooter = false }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <NavBar />
      <main className="flex-1 pt-14">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  )
}
