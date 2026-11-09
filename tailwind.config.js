/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 950: '#06122B', 900: '#0A1F44', 800: '#0F2D5E', 700: '#173F7A', 600: '#1F5299' },
        sky: { 50: '#F1F7FD', 100: '#E1EEFA', 200: '#BFDCF3', 300: '#8FC3E8', 400: '#5AA6DA' },
        cyanx: { 300: '#67E8F9', 400: '#22D3EE', 500: '#06B6D4', 600: '#0891B2' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Source Serif 4"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: { panel: '0 1px 2px rgba(10,31,68,.06), 0 8px 24px rgba(10,31,68,.08)' },
    },
  },
  plugins: [],
};
