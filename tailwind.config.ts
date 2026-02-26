import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Guild Light Theme
        'guild-light': {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#adb5bd',
          500: '#868e96',
          600: '#495057',
          700: '#373b41',
          800: '#252829',
          900: '#1a1d1f',
        },
        // Guild Void Theme (Dark Slate)
        'guild-void': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Primary accent colors
        'primary': {
          light: '#6366f1', // Indigo
          dark: '#818cf8',  // Light indigo for dark mode
        },
        'accent': {
          light: '#ec4899', // Pink
          dark: '#f472b6',  // Light pink for dark mode
        },
      },
      fontFamily: {
        sans: 'var(--font-geist-sans)',
        mono: 'var(--font-geist-mono)',
      },
    },
  },
  darkMode: 'class', // or 'media' if you want to use system preference
  plugins: [],
} satisfies Config;
