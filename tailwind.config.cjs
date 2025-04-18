// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        dusk: {
          900: '#0f1115',
          800: '#1a1d22',
          700: '#262a31',
          600: '#32363f',
          500: '#3e434e',
          400: '#4a505d',
          300: '#666c7a',
        },
        accent: '#FF6B6B',
      },
    },
  },
  plugins: [],
};
