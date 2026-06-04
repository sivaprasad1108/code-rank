'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { FAQSection as FAQSectionType } from '@/config/landing.config'

interface Props {
  section: FAQSectionType
}

export function FAQSection({ section }: Props) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="py-24 px-6 sm:px-8">
      <div className="max-w-[1920px] mx-auto">
        <div className="grid lg:grid-cols-[380px_1fr] gap-16 items-start">

          {/* Left — header (sticky on desktop) */}
          <div className="lg:sticky lg:top-20">
            <p className="text-accent text-sm font-semibold mb-3 tracking-wide uppercase">
              FAQ
            </p>
            <h2 className="font-bold text-4xl sm:text-5xl text-text-primary leading-tight tracking-tight mb-4">
              {section.title}
            </h2>
            <p className="text-text-muted text-sm leading-relaxed">
              Can&apos;t find what you&apos;re looking for?{' '}
              <a href="#" className="text-accent hover:text-accent-light underline underline-offset-2 transition-colors">
                Contact us
              </a>
            </p>
          </div>

          {/* Right — accordion */}
          <div className="flex flex-col divide-y divide-border">
            {section.items.map((item, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-start justify-between gap-4 py-5 text-left group"
                  aria-expanded={open === i}
                >
                  <span className={cn(
                    'text-sm font-semibold transition-colors leading-snug',
                    open === i ? 'text-text-primary' : 'text-text-muted group-hover:text-text-primary',
                  )}>
                    {item.question}
                  </span>
                  <ChevronDown
                    size={16}
                    className={cn(
                      'shrink-0 text-text-subtle transition-transform duration-[var(--duration-fast)] mt-0.5',
                      open === i && 'rotate-180 text-accent',
                    )}
                  />
                </button>

                <div className={cn(
                  'overflow-hidden transition-all duration-[var(--duration-normal)]',
                  open === i ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0',
                )}>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
