export type CTAButton = {
  label: string
  href: string
  variant: 'primary' | 'secondary'
}

export type FeatureItem = {
  iconName: string
  title: string
  description: string
}

export type FAQItem = {
  question: string
  answer: string
}

export type HeroSection = {
  type: 'hero'
  title: string
  description: string
  cta: CTAButton[]
}

export type FeaturesSection = {
  type: 'features'
  title: string
  items: FeatureItem[]
}

export type FAQSection = {
  type: 'faq'
  title: string
  items: FAQItem[]
}

export type CTASection = {
  type: 'cta'
  title: string
  description: string
  cta: CTAButton[]
}

export type LandingSection = HeroSection | FeaturesSection | FAQSection | CTASection

export const LANDING_SECTIONS: LandingSection[] = [
  {
    type: 'hero',
    title: 'Code. Execute. Share.',
    description:
      'A fast, minimal cloud code runner. Write in the browser, execute in isolation, share with the world.',
    cta: [
      { label: 'Open Playground', href: '/playground', variant: 'primary' },
      { label: 'Explore Snippets', href: '/feed', variant: 'secondary' },
    ],
  },
  {
    type: 'features',
    title: 'Built for developers',
    items: [
      {
        iconName: 'zap',
        title: 'Instant Execution',
        description: 'Code runs in isolated Docker containers in under a second.',
      },
      {
        iconName: 'share-2',
        title: 'Permanent Share Links',
        description: 'Every snippet gets a short, memorable URL — share anywhere.',
      },
      {
        iconName: 'code-2',
        title: '4 Languages',
        description: 'Python, JavaScript, Java, C++. More coming soon.',
      },
      {
        iconName: 'shield',
        title: 'Sandboxed by Default',
        description: 'No network access, no disk writes, no root. Safe for everyone.',
      },
    ],
  },
  {
    type: 'faq',
    title: 'Frequently Asked Questions',
    items: [
      {
        question: 'Is it free?',
        answer: 'Yes. The playground and snippet sharing are completely free.',
      },
      {
        question: 'Is my code private?',
        answer:
          'By default, snippets are public. Private snippets are coming in a future update.',
      },
      {
        question: 'Which languages are supported?',
        answer: 'Python, JavaScript, Java, and C++ today. More languages are planned.',
      },
      {
        question: 'How long can my code run?',
        answer:
          'Each execution has a 10-second timeout to keep things fast and fair for everyone.',
      },
      {
        question: 'Do I need to sign up?',
        answer:
          'No signup needed to run code. Create an account to save and share snippets.',
      },
    ],
  },
  {
    type: 'cta',
    title: 'Start building today',
    description: 'No signup needed. Open the playground and start writing.',
    cta: [{ label: 'Open Playground', href: '/playground', variant: 'primary' }],
  },
]
