import { Icon } from '@/components/ui/Icon'
import { GlassCard } from '@/components/shared/GlassCard'
import type { FeaturesSection as FeaturesSectionType } from '@/config/landing.config'

interface Props {
  section: FeaturesSectionType
}

export function FeaturesSection({ section }: Props) {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
            {section.title}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {section.items.map((item) => (
            <GlassCard
              key={item.title}
              hoverable
              className="flex flex-col gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <Icon name={item.iconName} size={20} />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-semibold text-text-primary">{item.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
