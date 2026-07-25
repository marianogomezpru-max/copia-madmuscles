/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { 50: '#f0fdf4', 100: '#dcfce7', 500: '#10b981', 600: '#059669', 900: '#064e3b' },
        // Deep indigo-navy (the tone used in the AI Coach banner) — the
        // app's one "dark" color, standing in for black everywhere.
        navy: { 700: '#2b2470', 800: '#221d5c', 900: '#1a1652' },
        accent: { 500: '#6d5bd0', 600: '#5a48bd' },
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
