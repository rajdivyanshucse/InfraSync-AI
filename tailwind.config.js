/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#0B0F17',
          subtle: '#0E1420',
        },
        surface: {
          DEFAULT: '#111827',
          subtle: '#151F30',
          muted: '#1E293B',
          card: '#0F172A',
          elevated: '#1A2436',
          border: '#1E293B',
          hover: '#1B283E',
        },
        brand: {
          50: '#F0F7FF',
          100: '#E0EFFF',
          200: '#BAE0FD',
          300: '#7CC4FA',
          400: '#38A3F6',
          500: '#1D82E2',
          600: '#0B63C5',
          700: '#094FA3',
          800: '#0D4485',
          900: '#103A6F',
          950: '#0B2447',
          accent: '#0284C7',
        },
        infra: {
          track: '#10B981',      // On Track / Healthy Green
          risk: '#F59E0B',       // At Risk / Warning Amber
          delayed: '#EF4444',    // Delayed / Critical Red
          info: '#0EA5E9',       // Engineering / Info Sky Blue
          completed: '#64748B',  // Completed / Neutral Slate
          pending: '#8B5CF6',    // Pending Review / Purple
        },
        blueprint: {
          grid: '#1E293B',
          line: '#1E3A8A33',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '0.875rem' }],
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      boxShadow: {
        'panel': '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3)',
        'panel-md': '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.4)',
        'panel-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.5)',
        'glow-brand': '0 0 16px -2px rgba(11, 99, 197, 0.25)',
        'glow-success': '0 0 12px -2px rgba(16, 185, 129, 0.25)',
        'glow-warning': '0 0 12px -2px rgba(245, 158, 11, 0.25)',
        'glow-critical': '0 0 12px -2px rgba(239, 68, 68, 0.25)',
      },
      borderRadius: {
        'xs': '2px',
        'sm': '4px',
        'DEFAULT': '6px',
        'md': '8px',
        'lg': '10px',
        'xl': '12px',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulseSubtle 2.5s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        }
      }
    },
  },
  plugins: [],
}
