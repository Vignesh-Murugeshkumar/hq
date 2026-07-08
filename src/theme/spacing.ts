/**
 * HealthQuest — Spacing System
 *
 * 4px base unit spacing scale for consistent layouts.
 */

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
  '6xl': 80,
} as const;

/**
 * Border radius scale for the cartoon card style.
 */
export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  card: 24,
  button: 16,
  input: 14,
  badge: 20,
  full: 9999,
} as const;

export type SpacingToken = typeof spacing;
export type RadiiToken = typeof radii;
