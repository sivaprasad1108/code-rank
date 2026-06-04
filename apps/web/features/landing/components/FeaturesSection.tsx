import { Icon } from '@/components/ui/Icon'
import type { FeaturesSection as FeaturesSectionType } from '@/config/landing.config'

interface Props {
  section: FeaturesSectionType
}

export function FeaturesSection({ section }: Props) {
  return (
    <section className="relative py-24 px-6 sm:px-8 overflow-hidden">
      {/* Background glow */}
      <div aria-hidden className="absolute left-1/2 -translate-x-1/2 top-0 w-[800px] h-[400px] bg-accent/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-accent text-sm font-semibold mb-3 tracking-wide uppercase">
            {section.subtitle}
          </p>
          <h2 className="font-bold text-4xl sm:text-5xl text-text-primary leading-tight tracking-tight whitespace-pre-line">
            {section.title}
          </h2>
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {section.items.map((item, i) => (
            <div
              key={item.title}
              className="group bg-bg-primary hover:bg-bg-elevated transition-colors duration-[var(--duration-normal)] p-8 flex flex-col gap-5 relative"
            >
              {/* Subtle hover glow */}
              <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/[0.03] transition-colors pointer-events-none" />

              {/* Icon container */}
              <div className="w-11 h-11 rounded-xl bg-accent/10 border border-accent/15 flex items-center justify-center text-accent group-hover:border-accent/30 group-hover:bg-accent/15 transition-all">
                <Icon name={item.iconName} size={20} />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-sm text-text-primary">{item.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Number */}
              <div className="absolute top-6 right-6 font-code text-xs text-text-subtle/30">
                0{i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
