import type { LandingSection } from '@/config/landing.config'
import { HeroSection } from './HeroSection'
import { FeaturesSection } from './FeaturesSection'
import { FAQSection } from './FAQSection'
import { CTASection } from './CTASection'

interface Props {
  section: LandingSection
}

export function SectionRenderer({ section }: Props) {
  switch (section.type) {
    case 'hero':
      return <HeroSection section={section} />
    case 'features':
      return <FeaturesSection section={section} />
    case 'faq':
      return <FAQSection section={section} />
    case 'cta':
      return <CTASection section={section} />
  }
}
