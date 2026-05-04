import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary:   '#1A5276', // Navy blue — CTAs, links, botones primarios
        secondary: '#1A3A2A', // Forest green — navbar, hero overlay
        accent:    '#C5973A', // Golden sand — badges, highlights
        neutral:   '#FAFAF9', // Warm white — fondos de sección
        surface:   '#FFFFFF', // Blanco puro — cards, modals, forms
        ink:       '#1C2833', // Casi negro — texto principal
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Georgia', 'serif'],
        body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
      typography: (theme: (path: string) => string) => ({
        DEFAULT: {
          css: {
            color: theme('colors.ink'),
            a: { color: theme('colors.primary') },
            'h1,h2,h3,h4': { fontFamily: 'var(--font-heading)' },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
