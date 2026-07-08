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
        // Flat colors for NativeWind v4 compatibility
        primary: '#4CAF50',
        'primary-light': '#81C784',
        'primary-dark': '#388E3C',

        secondary: '#FF6B6B',
        'secondary-light': '#FF8A8A',
        'secondary-dark': '#E55555',

        accent: '#FFD93D',
        'accent-light': '#FFE566',
        'accent-dark': '#FFB300',

        purple: '#7C4DFF',
        'purple-light': '#B388FF',
        'purple-dark': '#651FFF',

        teal: '#26C6DA',
        'teal-light': '#80DEEA',
        'teal-dark': '#00ACC1',

        orange: '#FF9800',
        'orange-light': '#FFB74D',
        'orange-dark': '#F57C00',

        pink: '#F06292',
        'pink-light': '#F48FB1',
        'pink-dark': '#EC407A',

        background: '#F8F9FF',

        surface: '#FFFFFF',
        'surface-alt': '#EEF1FF',

        text: '#2D3436',
        'text-secondary': '#636E72',
        'text-oncolor': '#FFFFFF',

        success: '#4CAF50',
        error: '#FF5252',
        warning: '#FFA726',
        info: '#42A5F5',

        border: '#E8ECF4',
        'border-focus': '#4CAF50',
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
