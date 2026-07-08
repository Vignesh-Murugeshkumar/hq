/**
 * HealthQuest — Bright Cartoon Color Palette
 *
 * A cheerful, kid-friendly color system inspired by Duolingo and Khan Academy Kids.
 * Uses warm, inviting colors with high contrast for readability.
 */

export const colors = {
  // Primary Palette
  primary: {
    DEFAULT: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
  },
  secondary: {
    DEFAULT: '#FF6B6B',
    light: '#FF8A8A',
    dark: '#E55555',
  },
  accent: {
    DEFAULT: '#FFD93D',
    light: '#FFE566',
    dark: '#FFB300',
  },
  purple: {
    DEFAULT: '#7C4DFF',
    light: '#B388FF',
    dark: '#651FFF',
  },
  teal: {
    DEFAULT: '#26C6DA',
    light: '#80DEEA',
    dark: '#00ACC1',
  },
  orange: {
    DEFAULT: '#FF9800',
    light: '#FFB74D',
    dark: '#F57C00',
  },
  pink: {
    DEFAULT: '#F06292',
    light: '#F48FB1',
    dark: '#EC407A',
  },

  // Surfaces
  background: '#F8F9FF',
  surface: {
    DEFAULT: '#FFFFFF',
    alt: '#EEF1FF',
  },

  // Text
  text: {
    DEFAULT: '#2D3436',
    secondary: '#636E72',
    onColor: '#FFFFFF',
  },

  // Semantic
  success: '#4CAF50',
  error: '#FF5252',
  warning: '#FFA726',
  info: '#42A5F5',

  // Borders
  border: {
    DEFAULT: '#E8ECF4',
    focus: '#4CAF50',
  },

  // Gradients (start, end)
  gradients: {
    xp: ['#4CAF50', '#26C6DA'] as const,
    coin: ['#FFD93D', '#FF9800'] as const,
    badge: ['#7C4DFF', '#E040FB'] as const,
    streak: ['#FF6B6B', '#FF9800'] as const,
    primary: ['#4CAF50', '#81C784'] as const,
    purple: ['#7C4DFF', '#B388FF'] as const,
    sunset: ['#FF6B6B', '#FFD93D'] as const,
  },
} as const;

export type ColorToken = typeof colors;
