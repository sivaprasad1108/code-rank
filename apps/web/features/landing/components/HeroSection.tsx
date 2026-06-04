import Link from 'next/link'
import { Play, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { HeroSection as HeroSectionType } from '@/config/landing.config'

const DEMO_LINES = [
  { tokens: [{ text: 'def ', c: 'keyword' }, { text: 'two_sum', c: 'function' }, { text: '(nums, target):', c: 'default' }] },
  { tokens: [{ text: '    lookup', c: 'default' }, { text: ' = ', c: 'op' }, { text: '{}', c: 'default' }], indent: 4 },
  { tokens: [{ text: '    ', c: 'default' }, { text: 'for ', c: 'keyword' }, { text: 'i, num ', c: 'default' }, { text: 'in ', c: 'keyword' }, { text: 'enumerate', c: 'function' }, { text: '(nums):', c: 'default' }] },
  { tokens: [{ text: '        complement', c: 'default' }, { text: ' = ', c: 'op' }, { text: 'target', c: 'default' }, { text: ' - ', c: 'op' }, { text: 'num', c: 'default' }] },
  { tokens: [{ text: '        ', c: 'default' }, { text: 'if ', c: 'keyword' }, { text: 'complement ', c: 'default' }, { text: 'in ', c: 'keyword' }, { text: 'lookup:', c: 'default' }] },
  { tokens: [{ text: '            ', c: 'default' }, { text: 'return ', c: 'keyword' }, { text: '[lookup[complement], i]', c: 'default' }] },
  { tokens: [{ text: '        lookup[num]', c: 'default' }, { text: ' = ', c: 'op' }, { text: 'i', c: 'default' }] },
  { tokens: [] },
  { tokens: [{ text: '# Binary search', c: 'comment' }] },
  { tokens: [{ text: 'nums', c: 'default' }, { text: ' = ', c: 'op' }, { text: '[2, 7, 11, 15]', c: 'number' }] },
  { tokens: [{ text: 'target', c: 'default' }, { text: ' = ', c: 'op' }, { text: '9', c: 'number' }] },
  { tokens: [{ text: 'result', c: 'default' }, { text: ' = ', c: 'op' }, { text: 'two_sum', c: 'function' }, { text: '(nums, target)', c: 'default' }] },
  { tokens: [{ text: 'print', c: 'function' }, { text: '(', c: 'default' }, { text: '"Indices:"', c: 'string' }, { text: ', result)', c: 'default' }] },
]

const COLOR_MAP: Record<string, string> = {
  keyword:  '#C084FC',
  function: '#67E8F9',
  string:   '#4ADE80',
  number:   '#FB923C',
  comment:  '#4A5578',
  op:       '#C084FC',
  default:  '#E8ECF8',
}


interface Props { section: HeroSectionType }

export function HeroSection({ section }: Props) {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background layers */}
      <div aria-hidden className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" />
      <div aria-hidden className="absolute inset-0 bg-hero-glow pointer-events-none" />
      {/* Right-side glow orb */}
      <div aria-hidden className="absolute top-1/4 right-[-10%] w-[600px] h-[600px] rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

      {/* ── Main hero content ── */}
      <div className="relative z-10 flex-1 flex items-center max-w-[1920px] mx-auto w-full px-6 sm:px-8 lg:px-12 pt-28 pb-16 lg:pt-32 lg:pb-20">
        <div className="w-full grid lg:grid-cols-[1fr_1fr] gap-12 xl:gap-20 items-center">

          {/* Left — copy */}
          <div className="flex flex-col gap-7 animate-fade-in">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/25 bg-accent/8 text-accent text-xs font-semibold w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Cloud Code Execution — Now Live
            </div>

            {/* Headline */}
            <div className="flex flex-col gap-1">
              <h1 className="font-bold text-5xl sm:text-6xl xl:text-7xl leading-[1.05] tracking-[-0.03em] text-text-primary">
                Code. Execute.
              </h1>
              <h1 className="font-bold text-5xl sm:text-6xl xl:text-7xl leading-[1.05] tracking-[-0.03em]">
                Learn.{' '}
                <span className="text-gradient-bright">Rank Higher.</span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-text-muted text-lg sm:text-xl max-w-[480px] leading-relaxed">
              A fast, minimal cloud code runner. Write in the browser, execute in
              isolation, share with the world — no setup required.
            </p>

            {/* CTA */}
            <div className="flex items-center gap-3 flex-wrap">
              <Button variant="primary" size="lg" asChild className="group shadow-glow">
                <Link href={section.cta[0]?.href ?? '/playground'}>
                  <Play size={15} className="fill-white" />
                  {section.cta[0]?.label ?? 'Start Coding'}
                  <ArrowRight size={14} className="opacity-70 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
              {section.cta[1] && (
                <Button variant="outline" size="lg" asChild>
                  <Link href={section.cta[1].href}>{section.cta[1].label}</Link>
                </Button>
              )}
            </div>

            {/* Trust signals */}
            <div className="flex items-center gap-5 flex-wrap text-xs text-text-subtle">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                Free forever
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                No signup required
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                Docker-isolated
              </span>
            </div>
          </div>

          {/* Right — code editor preview */}
          <div className="hidden lg:block animate-fade-in-scale">
            <div className="relative">
              {/* Glow behind the card */}
              <div className="absolute inset-0 rounded-2xl bg-accent/10 blur-[40px] scale-95 translate-y-4 pointer-events-none" />

              <div className="relative rounded-2xl border border-border overflow-hidden shadow-xl bg-bg-elevated">
                {/* Window chrome */}
                <div className="flex items-center justify-between px-4 py-3 bg-bg-surface border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-error/70" />
                    <span className="w-3 h-3 rounded-full bg-warning/70" />
                    <span className="w-3 h-3 rounded-full bg-success/70" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-bg-elevated rounded-md border border-border">
                    <div className="w-2 h-2 rounded-sm bg-accent/60" />
                    <span className="text-xs text-text-muted font-code">main.py</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent text-white text-xs font-semibold cursor-pointer hover:bg-accent-hover transition-colors shadow-glow-sm">
                    <Play size={10} className="fill-white" />
                    Run
                  </div>
                </div>

                {/* Code editor body */}
                <div className="flex bg-bg-primary">
                  {/* Line numbers */}
                  <div className="py-5 px-3 select-none">
                    {DEMO_LINES.map((_, i) => (
                      <div key={i} className="font-code text-[12px] leading-[22px] text-text-subtle/40 text-right w-5">
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  {/* Code */}
                  <div className="flex-1 py-5 pr-6 overflow-x-auto">
                    {DEMO_LINES.map((line, i) => (
                      <div key={i} className="font-code text-[12px] leading-[22px] whitespace-pre">
                        {line.tokens.length === 0 ? '\u00A0' : line.tokens.map((t, j) => (
                          <span key={j} style={{ color: COLOR_MAP[t.c] ?? COLOR_MAP.default }}>
                            {t.text}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Output bar */}
                <div className="border-t border-border bg-bg-surface px-4 py-2.5 flex items-center justify-between">
                  <div className="font-code text-xs">
                    <span className="text-text-subtle">$ </span>
                    <span className="text-success">Indices: [0, 1]</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text-subtle">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-success" />
                      0.002s
                    </span>
                    <span>4.2 MB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
