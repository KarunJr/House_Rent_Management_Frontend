/**
 * Mirrors tailwind.config.js so components that can't take a `className`
 * (react-native-svg, expo-linear-gradient, shadow styles) stay in sync with
 * the design system instead of hard-coding one-off hex values.
 */
export const colors = {
  paper: '#FBF6F0',
  surface: '#FFFFFF',
  surfaceMuted: '#F3ECE3',
  ink: '#2A241D',
  inkMuted: '#8A8074',
  inkFaint: '#B7AC9D',
  border: '#EAE0D2',

  terracotta: '#C1652F',
  terracottaSoft: '#F1DAC7',
  terracottaDeep: '#96481E',

  sage: '#6E8368',
  sageSoft: '#E3E9DD',
  sageDeep: '#4E6049',

  amber: '#C99A3F',
  amberSoft: '#F5E9CE',
  amberDeep: '#8F6C24',

  clay: '#B5533D',
  claySoft: '#F3DED8',
  clayDeep: '#823A2A',
} as const;

export const shadow = {
  card: {
    shadowColor: '#2A241D',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  banner: {
    shadowColor: '#96481E',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
} as const;
