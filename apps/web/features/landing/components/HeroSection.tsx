import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import type { HeroSection as HeroSectionType } from '@/config/landing.config'

const DEMO_CODE = `# Python — runs in an isolated container
def greet(name: str) -> str:
    return f"Hello, {name}! 👋"

result = greet("CodeRank")
print(result)
# Output: Hello, CodeRank! 👋`

interface Props {
  section: HeroSectionType
}

export function HeroSection({ section }: Props) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 py-24 overflow-hidden">
      {/* Background glow orbs */}
      <div
        aria-hidden
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px] pointer-events-none"
      />

      <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left — copy */}
        <div className="flex flex-col gap-8 animate-fade-in">
          <div className="flex flex-col gap-4">
            <h1 className="font-bold leading-tight text-4xl sm:text-5xl lg:text-6xl">
              <span className="text-gradient">{section.title}</span>
            </h1>
            <p className="text-text-muted text-lg sm:text-xl max-w-xl leading-relaxed">
              {section.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
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

          <div className="flex items-center gap-6 text-sm text-text-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success inline-block" />
              No signup to run code
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success inline-block" />
              4 languages supported
            </span>
          </div>
        </div>

        {/* Right — code preview */}
        <div className="glass rounded-xl overflow-hidden border border-border animate-slide-up hidden lg:block">
          {/* Fake window chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-bg-elevated">
            <span className="w-3 h-3 rounded-full bg-error/70" />
            <span className="w-3 h-3 rounded-full bg-warning/70" />
            <span className="w-3 h-3 rounded-full bg-success/70" />
            <span className="ml-2 text-xs text-text-muted font-code">main.py</span>
          </div>
          {/* Code */}
          <pre className="p-6 font-code text-sm leading-relaxed text-text-muted overflow-x-auto">
            {DEMO_CODE.split('\n').map((line, i) => (
              <div key={i} className="flex">
                <span className="select-none w-8 text-text-subtle opacity-40 shrink-0">
                  {i + 1}
                </span>
                <span className={line.startsWith('#') ? 'text-text-subtle' : 'text-text-primary'}>
                  {line}
                </span>
              </div>
            ))}
          </pre>
          {/* Output bar */}
          <div className="px-6 py-3 border-t border-border bg-bg-elevated/60 font-code text-sm">
            <span className="text-text-subtle">$ </span>
            <span className="text-success">Hello, CodeRank! 👋</span>
          </div>
        </div>
      </div>
    </section>
  )
}
