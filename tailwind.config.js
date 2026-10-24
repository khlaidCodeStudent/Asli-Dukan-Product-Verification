/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 24px 60px -24px rgba(15, 23, 42, 0.35)',
        'card-dark': '0 24px 60px -20px rgba(0, 0, 0, 0.65)',
      },
    },
  },
  plugins: [],
}
