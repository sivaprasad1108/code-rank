'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { FAQSection as FAQSectionType } from '@/config/landing.config'

interface Props {
  section: FAQSectionType
}

export function FAQSection({ section }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
            {section.title}
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {section.items.map((item, i) => (
            <div
              key={i}
              className="glass rounded-xl border border-border overflow-hidden"
            >
              <button
                type="button"
                className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-white/[0.02] transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
              >
                <span className="font-medium text-text-primary">{item.question}</span>
                <ChevronDown
                  size={18}
                  className={cn(
                    'text-text-muted shrink-0 transition-transform duration-[var(--duration-normal)]',
                    openIndex === i && 'rotate-180',
                  )}
                />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-4 text-text-muted text-sm leading-relaxed border-t border-border/50 pt-4">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
