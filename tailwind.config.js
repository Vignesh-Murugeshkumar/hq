/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
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
          oncolor: '#FFFFFF',
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
      },
      fontFamily: {
        'nunito': ['Nunito_400Regular'],
        'nunito-medium': ['Nunito_500Medium'],
        'nunito-semibold': ['Nunito_600SemiBold'],
        'nunito-bold': ['Nunito_700Bold'],
        'nunito-extrabold': ['Nunito_800ExtraBold'],
      },
      fontSize: {
        'display-lg': ['34px', { lineHeight: '42px', fontWeight: '800' }],
        'display-md': ['28px', { lineHeight: '36px', fontWeight: '700' }],
        'heading-lg': ['24px', { lineHeight: '32px', fontWeight: '700' }],
        'heading-md': ['20px', { lineHeight: '28px', fontWeight: '700' }],
        'heading-sm': ['18px', { lineHeight: '26px', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '22px', fontWeight: '400' }],
        'body-sm': ['12px', { lineHeight: '18px', fontWeight: '400' }],
        'label': ['14px', { lineHeight: '20px', fontWeight: '700' }],
        'label-sm': ['12px', { lineHeight: '16px', fontWeight: '700' }],
      },
      borderRadius: {
        'card': '24px',
        'button': '16px',
        'input': '14px',
        'badge': '20px',
        'avatar': '9999px',
      },
      spacing: {
        '4.5': '18px',
        '13': '52px',
        '15': '60px',
        '18': '72px',
        '22': '88px',
      },
      boxShadow: {
        'card': '0 4px 12px rgba(124, 77, 255, 0.08)',
        'card-active': '0 4px 16px rgba(76, 175, 80, 0.15)',
        'button': '0 4px 14px rgba(76, 175, 80, 0.25)',
        'button-secondary': '0 4px 14px rgba(255, 107, 107, 0.25)',
        'elevated': '0 8px 24px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
