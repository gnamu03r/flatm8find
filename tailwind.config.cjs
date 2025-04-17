/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dusk: {
          50: '#f7f7fb',
          100: '#ebebf3',
          200: '#dcdcea',
          300: '#c5c4da',
          400: '#a9a6c6',
          500: '#8d89b2',
          600: '#736f98',
          700: '#5c597b',
          800: '#4c4863',
          900: '#3e3b50',
        },
        primary: '#6c63ff',
        secondary: '#f50057',
        background: '#f9f9fc',
        surface: '#ffffff',
        muted: '#7c7c8a',
        border: '#e2e2ea',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
