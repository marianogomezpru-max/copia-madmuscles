/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { 50: '#f0fdf4', 100: '#dcfce7', 500: '#10b981', 600: '#059669', 900: '#064e3b' },
        navy: { 800: '#1e293b', 900: '#0f172a' },
        finaraCardGreen: '#10b981',
        finaraCardOrange: '#f97316',
        finaraCardYellow: '#eab308',
        finaraCardPurple: '#a855f7',
        finaraCardBlue: '#3b82f6',
        finaraCardRed: '#ef4444',
      },
    },
  },
  plugins: [],
}
