import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/shared/GlassCard'
import type { CTASection as CTASectionType } from '@/config/landing.config'

interface Props {
  section: CTASectionType
}

export function CTASection({ section }: Props) {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <GlassCard accented padding="lg" className="text-center flex flex-col items-center gap-6">
          {/* Glow orb behind */}
          <div
            aria-hidden
            className="absolute inset-0 bg-accent/5 rounded-xl pointer-events-none"
          />
          <div className="relative flex flex-col gap-3 items-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
              {section.title}
            </h2>
            <p className="text-text-muted text-lg max-w-md">{section.description}</p>
          </div>
          <div className="relative flex flex-wrap gap-3 justify-center">
            {section.cta.map((btn) => (
              <Button
                key={btn.href}
                variant={btn.variant === 'primary' ? 'primary' : 'secondary'}
                size="lg"
                asChild
              >
                <Link href={btn.href}>{btn.label}</Link>
              </Button>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  )
}
