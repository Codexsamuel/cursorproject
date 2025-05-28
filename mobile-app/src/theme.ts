export type Theme = 'light' | 'dark';

export const colors = {
  light: {
    primary: '#007AFF',
    background: '#FFFFFF',
    card: '#F2F2F7',
    text: {
      primary: '#000000',
      secondary: '#8E8E93',
      inverse: '#FFFFFF',
    },
    border: '#C6C6C8',
    status: {
      success: '#34C759',
      error: '#FF3B30',
      warning: '#FF9500',
      info: '#5856D6',
    },
  },
  dark: {
    primary: '#0A84FF',
    background: '#000000',
    card: '#1C1C1E',
    text: {
      primary: '#FFFFFF',
      secondary: '#8E8E93',
      inverse: '#000000',
    },
    border: '#38383A',
    status: {
      success: '#30D158',
      error: '#FF453A',
      warning: '#FF9F0A',
      info: '#5E5CE6',
    },
  },
} as const; 