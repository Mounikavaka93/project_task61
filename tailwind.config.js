/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    screens: {
      xs: '380px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
    },
    extend: {
      colors: {
        canvas: '#f5f3ef',
        card: '#fffcfa',
        line: '#e6e1ea',
        sidebar: '#14131c',
        ink: {
          DEFAULT: '#16141f',
          soft: '#5e5872',
          faint: '#8d879c',
        },
        brand: {
          50: '#f4f1fc',
          100: '#e7e1f8',
          200: '#d2c6f3',
          400: '#8d74e4',
          500: '#6e56cf',
          600: '#5b45c5',
          700: '#4a37a8',
        },
        roseheart: '#e11d48',
      },
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(20, 19, 28, 0.04), 0 10px 28px rgba(20, 19, 28, 0.05)',
        pop: '0 18px 50px rgba(20, 19, 28, 0.16)',
      },
    },
  },
  plugins: [],
};
