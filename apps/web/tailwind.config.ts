import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
    './config/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base:     'var(--color-bg-base)',
          primary:  'var(--color-bg-primary)',
          surface:  'var(--color-bg-surface)',
          elevated: 'var(--color-bg-elevated)',
          overlay:  'var(--color-bg-overlay)',
          input:    'var(--color-bg-input)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover:   'var(--color-accent-hover)',
          light:   'var(--color-accent-light)',
          lighter: 'var(--color-accent-lighter)',
          dim:     'var(--color-accent-dim)',
        },
        'text-primary':   'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted':     'var(--color-text-muted)',
        'text-subtle':    'var(--color-text-subtle)',
        'text-disabled':  'var(--color-text-disabled)',
        border: {
          DEFAULT: 'var(--color-border)',
          subtle:  'var(--color-border-subtle)',
          strong:  'var(--color-border-strong)',
          accent:  'var(--color-border-accent)',
        },
        success:  'var(--color-success)',
        error:    'var(--color-error)',
        warning:  'var(--color-warning)',
        info:     'var(--color-info)',
      },
      fontFamily: {
        ui:   ['var(--font-ui)', 'system-ui', 'sans-serif'],
        code: ['var(--font-code)', 'monospace'],
      },
      fontSize: {
        // Extra-small only — don't override Tailwind defaults below
        '2xs': ['11px', { lineHeight: '16px' }],
        // Tailwind defaults preserved: xs=12px sm=14px base=16px lg=18px xl=20px …
        // Display sizes for hero headings
        '5xl': ['3rem',   { lineHeight: '1.1' }],   // 48px
        '6xl': ['3.75rem',{ lineHeight: '1.05' }],  // 60px
        '7xl': ['4.5rem', { lineHeight: '1.0' }],   // 72px
        '8xl': ['5.5rem', { lineHeight: '1.0' }],   // 88px
      },
      borderRadius: {
        xs:   'var(--radius-xs)',
        sm:   'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
        '2xl':'var(--radius-2xl)',
        '3xl':'var(--radius-3xl)',
      },
      boxShadow: {
        'glow':    'var(--glow-md)',
        'glow-sm': 'var(--glow-sm)',
        'glow-lg': 'var(--glow-lg)',
        'xs':      'var(--shadow-xs)',
        'sm':      'var(--shadow-sm)',
        'md':      'var(--shadow-md)',
        'lg':      'var(--shadow-lg)',
        'xl':      'var(--shadow-xl)',
        'glass':   'var(--glass-shadow)',
      },
      backgroundImage: {
        'hero-glow':
          'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124, 58, 237, 0.18) 0%, transparent 60%)',
        'hero-glow-right':
          'radial-gradient(ellipse 50% 70% at 80% 30%, rgba(124, 58, 237, 0.10) 0%, transparent 60%)',
        'card-gradient':
          'linear-gradient(135deg, rgba(124, 58, 237, 0.06) 0%, transparent 60%)',
        'accent-gradient':
          'linear-gradient(135deg, #7C3AED 0%, #6D28D9 50%, #5B21B6 100%)',
        'purple-fade':
          'linear-gradient(180deg, rgba(124, 58, 237, 0.15) 0%, transparent 100%)',
        'surface-gradient':
          'linear-gradient(180deg, var(--color-bg-surface) 0%, var(--color-bg-primary) 100%)',
      },
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-scale': {
          '0%':   { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          '0%':   { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-in-left': {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: 'var(--glow-sm)' },
          '50%':      { boxShadow: 'var(--glow-lg)' },
        },
      },
      animation: {
        'fade-in':       'fade-in 0.25s ease-out',
        'fade-in-scale': 'fade-in-scale 0.25s ease-out',
        'slide-up':      'slide-up 0.35s ease-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        shimmer:         'shimmer 1.8s infinite linear',
        float:           'float 4s ease-in-out infinite',
        'glow-pulse':    'glow-pulse 2s ease-in-out infinite',
      },
      transitionDuration: {
        '80':  '80ms',
        '120': '120ms',
        '350': '350ms',
      },
    },
  },
  plugins: [],
}

export default config
