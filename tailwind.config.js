/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: '#abefcd',
        input: '#d3f8e3',
        ring: '#19b077',
        background: '#edfcf4',
        foreground: '#04271d',
        primary: {
          50: '#edfcf4',
          100: '#d3f8e3',
          200: '#abefcd',
          300: '#75e0b1',
          400: '#3dca90',
          500: '#19b077',
          600: '#0d8e60',
          700: '#0a724f',
          800: '#0b5a40',
          900: '#0a4a36',
          950: '#04271d',
          DEFAULT: '#19b077',
          foreground: '#ffffff',
        },
        secondary: {
          50: '#edfcf4',
          100: '#d3f8e3',
          200: '#abefcd',
          300: '#75e0b1',
          400: '#3dca90',
          500: '#0d8e60',
          600: '#0a724f',
          700: '#0b5a40',
          800: '#0a4a36',
          900: '#04271d',
          DEFAULT: '#0d8e60',
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#dc2626',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#abefcd',
          foreground: '#0a724f',
        },
        accent: {
          DEFAULT: '#3dca90',
          foreground: '#04271d',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#04271d',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#04271d',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}