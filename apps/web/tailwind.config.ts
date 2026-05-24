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
          primary: 'var(--color-bg-primary)',
          surface: 'var(--color-bg-surface)',
          elevated: 'var(--color-bg-elevated)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
        },
        'text-primary': 'var(--color-text-primary)',
        'text-muted': 'var(--color-text-muted)',
        'text-subtle': 'var(--color-text-subtle)',
        border: {
          DEFAULT: 'var(--color-border)',
          accent: 'var(--color-border-accent)',
        },
        success: 'var(--color-success)',
        error: 'var(--color-error)',
        warning: 'var(--color-warning)',
      },
      fontFamily: {
        ui: ['var(--font-ui)', 'system-ui', 'sans-serif'],
        code: ['var(--font-code)', 'monospace'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        glow: '0 0 20px var(--color-accent-glow)',
        'glow-sm': '0 0 10px var(--color-accent-glow)',
      },
      backgroundImage: {
        'hero-radial':
          'radial-gradient(ellipse at top, rgba(124, 58, 237, 0.15) 0%, transparent 60%)',
        'card-gradient':
          'linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, transparent 60%)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up var(--duration-slow, 350ms) ease-out',
        shimmer: 'shimmer 1.5s infinite linear',
        'spin-slow': 'spin-slow 2s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
