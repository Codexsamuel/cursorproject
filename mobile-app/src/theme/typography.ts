import { Platform } from 'react-native';

const baseFontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const typography = {
  h1: {
    fontFamily: 'System',
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  h2: {
    fontFamily: 'System',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  h3: {
    fontFamily: 'System',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  h4: {
    fontFamily: 'System',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
  },
  h5: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
  },
  h6: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 22,
  },
  subtitle1: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  subtitle2: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 22,
  },
  body1: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  body2: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
  },
  button: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    textTransform: 'uppercase',
  },
  caption: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
  },
  overline: {
    fontFamily: 'System',
    fontSize: 10,
    fontWeight: '400',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
} as const; 