import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { QueryProvider } from '@/lib/query/provider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-ui',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-code',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'CodeRank — Code. Execute. Share.',
    template: '%s | CodeRank',
  },
  description:
    'A fast, minimal cloud code runner. Write in the browser, execute in isolation, share with the world.',
  keywords: ['code editor', 'online compiler', 'code sharing', 'playground', 'snippets'],
  openGraph: {
    type: 'website',
    siteName: 'CodeRank',
    title: 'CodeRank — Code. Execute. Share.',
    description:
      'A fast, minimal cloud code runner. Write in the browser, execute in isolation, share with the world.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
