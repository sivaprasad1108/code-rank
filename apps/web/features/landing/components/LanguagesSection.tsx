import type { LanguagesSection as LanguagesSectionType } from '@/config/landing.config'

interface Props {
  section: LanguagesSectionType
}

export function LanguagesSection({ section }: Props) {
  return (
    <section className="relative py-24 px-6 sm:px-8 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-16 items-center">

          {/* Left — copy */}
          <div className="flex flex-col gap-5">
            <p className="text-accent text-sm font-semibold tracking-wide uppercase">
              Multi-language support
            </p>
            <h2 className="font-bold text-4xl sm:text-5xl text-text-primary leading-tight tracking-tight whitespace-pre-line">
              {section.title}
            </h2>
            <p className="text-text-muted text-base leading-relaxed max-w-md">
              {section.subtitle}
            </p>
          </div>

          {/* Right — language grid */}
          <div className="grid grid-cols-4 gap-3">
            {section.items.map((lang) => (
              <div
                key={lang.id}
                className="group flex flex-col items-center gap-2.5 p-4 rounded-xl bg-bg-elevated border border-border hover:border-border-strong transition-all duration-[var(--duration-normal)] cursor-default"
              >
                <span className="text-2xl select-none">{lang.emoji}</span>
                <span className="text-xs font-medium text-text-muted group-hover:text-text-primary transition-colors text-center leading-tight">
                  {lang.label}
                </span>
                <div
                  className="w-4 h-0.5 rounded-full opacity-60"
                  style={{ backgroundColor: lang.color }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
