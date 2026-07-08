/**
 * HealthQuest — Typography System
 *
 * Uses Nunito — a rounded, friendly font that is highly legible for children.
 * All sizes are optimized for mobile readability in Grades 3–6.
 */

export const typography = {
  fonts: {
    regular: 'Nunito_400Regular',
    medium: 'Nunito_500Medium',
    semibold: 'Nunito_600SemiBold',
    bold: 'Nunito_700Bold',
    extrabold: 'Nunito_800ExtraBold',
  },

  sizes: {
    displayLg: {
      fontSize: 34,
      lineHeight: 42,
      fontFamily: 'Nunito_800ExtraBold',
    },
    displayMd: {
      fontSize: 28,
      lineHeight: 36,
      fontFamily: 'Nunito_700Bold',
    },
    headingLg: {
      fontSize: 24,
      lineHeight: 32,
      fontFamily: 'Nunito_700Bold',
    },
    headingMd: {
      fontSize: 20,
      lineHeight: 28,
      fontFamily: 'Nunito_700Bold',
    },
    headingSm: {
      fontSize: 18,
      lineHeight: 26,
      fontFamily: 'Nunito_600SemiBold',
    },
    bodyLg: {
      fontSize: 16,
      lineHeight: 24,
      fontFamily: 'Nunito_400Regular',
    },
    bodyMd: {
      fontSize: 14,
      lineHeight: 22,
      fontFamily: 'Nunito_400Regular',
    },
    bodySm: {
      fontSize: 12,
      lineHeight: 18,
      fontFamily: 'Nunito_400Regular',
    },
    label: {
      fontSize: 14,
      lineHeight: 20,
      fontFamily: 'Nunito_700Bold',
    },
    labelSm: {
      fontSize: 12,
      lineHeight: 16,
      fontFamily: 'Nunito_700Bold',
    },
  },
} as const;

export type TypographyToken = typeof typography;
