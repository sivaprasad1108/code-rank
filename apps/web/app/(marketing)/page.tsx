import { LANDING_SECTIONS } from '@/config/landing.config'
import { SectionRenderer } from '@/features/landing/components/SectionRenderer'
import { NavBar } from '@/components/layout/NavBar'
import { Footer } from '@/components/layout/Footer'

export const metadata = {
  title: 'CodeRank — Cloud Code Runner & Snippet Sharing',
  description:
    'Write, execute, and share code in the browser. Isolated Docker containers, 4 languages, permanent share links.',
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg-primary bg-hero-radial">
      <NavBar />
      <main className="pt-14">
        {LANDING_SECTIONS.map((section, i) => (
          <SectionRenderer key={`${section.type}-${i}`} section={section} />
        ))}
      </main>
      <Footer />
    </div>
  )
}
