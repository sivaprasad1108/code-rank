import Link from 'next/link'
import { Play, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { CTASection as CTASectionType } from '@/config/landing.config'

interface Props {
  section: CTASectionType
}

export function CTASection({ section }: Props) {
  return (
    <section className="py-24 px-6 sm:px-8">
      <div className="max-w-[1920px] mx-auto">
        <div className="relative rounded-2xl overflow-hidden border border-border-accent bg-bg-elevated">
          {/* Background effects */}
          <div aria-hidden className="absolute inset-0 bg-accent/5 pointer-events-none" />
          <div aria-hidden className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/10 blur-[80px] rounded-full pointer-events-none" />
          <div aria-hidden className="absolute inset-0 bg-dot-grid opacity-20 pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center py-20 px-8 gap-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/25 bg-accent/10 text-accent text-xs font-semibold">
              <Play size={10} className="fill-accent" />
              Ready to run
            </div>

            <div className="flex flex-col gap-3 max-w-2xl">
              <h2 className="font-bold text-5xl sm:text-6xl text-text-primary leading-tight tracking-tight">
                {section.title}
              </h2>
              <p className="text-text-muted text-base sm:text-lg leading-relaxed">
                {section.description}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap justify-center">
              {section.cta.map((btn) => (
                btn.variant === 'primary' ? (
                  <Button key={btn.href} variant="primary" size="lg" asChild className="shadow-glow group">
                    <Link href={btn.href}>
                      {btn.label}
                      <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </Button>
                ) : (
                  <Button key={btn.href} variant="ghost" size="lg" asChild>
                    <Link href={btn.href}>{btn.label}</Link>
                  </Button>
                )
              ))}
            </div>

            <p className="text-xs text-text-subtle">
              No credit card required · Free forever
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
