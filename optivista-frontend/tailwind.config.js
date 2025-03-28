/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust this path based on your project structure
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          light: '#3b82f6',
          dark: '#1d4ed8',
        },
        secondary: {
          DEFAULT: '#64748b',
        },
        accent: {
          DEFAULT: '#f59e0b',
        },
        success: {
          DEFAULT: '#22c55e',
        },
        error: {
          DEFAULT: '#ef4444',
        },
        warning: {
          DEFAULT: '#f59e0b',
        },
        info: {
          DEFAULT: '#3b82f6',
        },
        background: {
          DEFAULT: '#ffffff',
          light: '#f8fafc',
          dark: '#0f172a',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#1e293b',
        },
        muted: {
          DEFAULT: '#f1f5f9',
          foreground: '#64748b',
        },
        input: {
          DEFAULT: '#e2e8f0',
        },
      },
      borderRadius: {
        lg: `0.5rem`,
        md: `0.375rem`,
        sm: '0.25rem',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [],
}