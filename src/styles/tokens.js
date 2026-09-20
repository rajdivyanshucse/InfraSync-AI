/**
 * InfraSync AI Design System Tokens (JavaScript)
 * Planning-to-Execution Intelligence for Infrastructure Projects
 */

export const colors = {
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
    accent: '#0284C7',
  },
  status: {
    onTrack: {
      label: 'On Track',
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.1)',
      border: 'rgba(16, 185, 129, 0.25)',
      text: '#34D399',
    },
    atRisk: {
      label: 'At Risk',
      color: '#F59E0B',
      bg: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.25)',
      text: '#FBBF24',
    },
    delayed: {
      label: 'Delayed',
      color: '#EF4444',
      bg: 'rgba(239, 68, 68, 0.1)',
      border: 'rgba(239, 68, 68, 0.25)',
      text: '#F87171',
    },
    completed: {
      label: 'Completed',
      color: '#64748B',
      bg: 'rgba(100, 116, 139, 0.12)',
      border: 'rgba(100, 116, 139, 0.25)',
      text: '#94A3B8',
    },
    pendingReview: {
      label: 'Pending Review',
      color: '#8B5CF6',
      bg: 'rgba(139, 92, 246, 0.1)',
      border: 'rgba(139, 92, 246, 0.25)',
      text: '#A78BFA',
    },
    info: {
      label: 'Information',
      color: '#0EA5E9',
      bg: 'rgba(14, 165, 233, 0.1)',
      border: 'rgba(14, 165, 233, 0.25)',
      text: '#38BDF8',
    },
  },
};

export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
};

export const borderRadius = {
  xs: '2px',
  sm: '4px',
  base: '6px',
  md: '8px',
  lg: '10px',
  xl: '12px',
  full: '9999px',
};

export const typography = {
  fonts: {
    sans: 'Inter, system-ui, -apple-system, sans-serif',
    mono: 'JetBrains Mono, SFMono-Regular, Menlo, Monaco, monospace',
  },
  sizes: {
    pageTitle: 'text-2xl font-bold tracking-tight',
    sectionTitle: 'text-lg font-semibold tracking-tight text-slate-100',
    cardTitle: 'text-sm font-semibold text-slate-200 uppercase tracking-wider',
    body: 'text-sm text-slate-300',
    supporting: 'text-xs text-slate-400',
    label: 'text-xs font-medium text-slate-400',
    metric: 'text-2xl font-bold font-mono text-slate-50',
    metricLabel: 'text-xs font-medium uppercase tracking-wider text-slate-400',
  },
};
