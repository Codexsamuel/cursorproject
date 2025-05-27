export type ThemeType = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  danger: string;
  warning: string;
  info: string;
  background: string;
  surface: string;
  white: string;
  black: string;
  border: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  status: {
    active: string;
    inactive: string;
    pending: string;
  };
  overlay: string;
}

export interface Theme {
  dark: boolean;
  colors: ThemeColors;
  roundness: number;
  animation: {
    scale: number;
  };
}

export const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: '#2563EB',
    secondary: '#64748B',
    success: '#22C55E',
    danger: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    white: '#FFFFFF',
    black: '#000000',
    border: '#E2E8F0',
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
      disabled: '#94A3B8',
    },
    status: {
      active: '#22C55E',
      inactive: '#94A3B8',
      pending: '#F59E0B',
    },
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  roundness: 8,
  animation: {
    scale: 1.0,
  },
};

export const darkTheme: Theme = {
  dark: true,
  colors: {
    primary: '#3B82F6',
    secondary: '#94A3B8',
    success: '#34D399',
    danger: '#F87171',
    warning: '#FBBF24',
    info: '#60A5FA',
    background: '#0F172A',
    surface: '#1E293B',
    white: '#FFFFFF',
    black: '#000000',
    border: '#334155',
    text: {
      primary: '#F1F5F9',
      secondary: '#CBD5E1',
      disabled: '#64748B',
    },
    status: {
      active: '#34D399',
      inactive: '#64748B',
      pending: '#FBBF24',
    },
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
  roundness: 8,
  animation: {
    scale: 1.0,
  },
}; 