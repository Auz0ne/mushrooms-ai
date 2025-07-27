/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-matte': '#191819',
        'dark-grey': '#B4B4B4',
        'light-grey': '#E6E6E6',
        'vibrant-orange': '#FF6F3C',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'opensans': ['Open Sans', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
      },
      animation: {
        'bounce-in': 'bounceIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-orange': 'pulseOrange 2s infinite',
      },
      keyframes: {
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseOrange: {
          '0%, 100%': { backgroundColor: '#FF6F3C' },
          '50%': { backgroundColor: '#FF8C5A' },
        },
      },
      height: {
        'dvh': '100dvh',
        '70dvh': '70dvh',
      },
      minHeight: {
        'dvh': '100dvh',
      },
    },
  },
  plugins: [],
};