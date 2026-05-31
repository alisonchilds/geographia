/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      colors: {
        ocean: '#aadaff',
        land: '#e9e3d6',
        landHover: '#d9cfba',
        landActive: '#c9a86a',
        ink: '#202122',
      },
      boxShadow: {
        panel: '0 10px 40px -8px rgba(0,0,0,0.35)',
        float: '0 2px 12px rgba(0,0,0,0.18)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [],
};
