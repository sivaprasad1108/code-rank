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

export type LanguageItem = {
  id: string
  label: string
  color: string
  emoji: string
}

export type PricingTier = {
  name: string
  price: string
  description: string
  features: string[]
  cta: string
  highlighted?: boolean
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
  subtitle: string
  items: FeatureItem[]
}

export type LanguagesSection = {
  type: 'languages'
  title: string
  subtitle: string
  items: LanguageItem[]
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

export type LandingSection =
  | HeroSection
  | FeaturesSection
  | LanguagesSection
  | FAQSection
  | CTASection

export const LANDING_SECTIONS: LandingSection[] = [
  {
    type: 'hero',
    title: 'Code. Execute. Learn. Rank Higher.',
    description:
      'A fast, minimal cloud code runner. Write in the browser, execute in isolation, share with the world — no setup required.',
    cta: [
      { label: 'Start Coding for Free', href: '/playground', variant: 'primary' },
      { label: 'Explore Snippets',      href: '/feed',        variant: 'secondary' },
    ],
  },
  {
    type: 'features',
    title: 'Everything you need to code,\ntest, and ship faster',
    subtitle: 'Built for speed. Engineered for scale.',
    items: [
      {
        iconName: 'zap',
        title: 'Instant Execution',
        description: 'Code runs in isolated Docker containers. Results in under a second — every time.',
      },
      {
        iconName: 'share-2',
        title: 'Permanent Share Links',
        description: 'Every snippet gets a unique short URL. Share snippets anywhere, forever.',
      },
      {
        iconName: 'shield',
        title: 'Sandboxed by Default',
        description: 'No network, no disk writes, no root. Fully isolated. Safe for everyone.',
      },
      {
        iconName: 'bar-chart-2',
        title: 'Execution Metrics',
        description: 'Runtime, memory usage, exit codes — visible after every run. No guesswork.',
      },
      {
        iconName: 'users',
        title: 'Community Feed',
        description: 'Discover snippets from developers worldwide. Star, fork, and learn from others.',
      },
      {
        iconName: 'code-2',
        title: 'Multiple Languages',
        description: 'Python, JavaScript, Java, C++ today. More languages added regularly.',
      },
    ],
  },
  {
    type: 'languages',
    title: 'Write in your\nfavorite language',
    subtitle: 'CodeRank runs your code instantly, in any supported language.',
    items: [
      { id: 'python',     label: 'Python',     color: '#3B82F6', emoji: '🐍' },
      { id: 'javascript', label: 'JavaScript', color: '#F59E0B', emoji: '⚡' },
      { id: 'java',       label: 'Java',       color: '#EF4444', emoji: '☕' },
      { id: 'cpp',        label: 'C++',        color: '#8B5CF6', emoji: '⚙️' },
      { id: 'rust',       label: 'Rust',       color: '#F97316', emoji: '🦀' },
      { id: 'go',         label: 'Go',         color: '#06B6D4', emoji: '🐹' },
      { id: 'ts',         label: 'TypeScript', color: '#6366F1', emoji: '📘' },
      { id: 'ruby',       label: 'Ruby',       color: '#EC4899', emoji: '💎' },
    ],
  },
  {
    type: 'faq',
    title: 'Frequently Asked Questions',
    items: [
      {
        question: 'Is it free?',
        answer: 'Yes. The playground and snippet sharing are completely free. No credit card required.',
      },
      {
        question: 'Is my code private?',
        answer: 'By default, snippets are public and discoverable. Private snippets are coming in a future update.',
      },
      {
        question: 'Which languages are supported?',
        answer: 'Python, JavaScript, Java, and C++ are supported today. More languages are coming — vote on GitHub.',
      },
      {
        question: 'How long can my code run?',
        answer: 'Each execution has a 10-second timeout. This keeps the platform fast and fair for everyone.',
      },
      {
        question: 'Do I need to sign up?',
        answer: 'No. Open the playground and start running code instantly. Sign up only to save and share snippets.',
      },
      {
        question: 'How is the code isolated?',
        answer: 'Every execution runs in a fresh Docker container with no network access, read-only filesystem, memory limits, and a 10-second timeout.',
      },
    ],
  },
  {
    type: 'cta',
    title: 'Start coding in seconds',
    description: 'No installation. No configuration. Just open the playground and run.',
    cta: [
      { label: 'Open Playground', href: '/playground', variant: 'primary' },
      { label: 'View Snippets',   href: '/feed',        variant: 'secondary' },
    ],
  },
]
