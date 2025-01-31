import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Helvetica', 'Arial', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#E2E8F0',
            maxWidth: 'none',
            h1: {
              color: '#E2E8F0',
            },
            h2: {
              color: '#E2E8F0',
            },
            h3: {
              color: '#E2E8F0',
            },
            h4: {
              color: '#E2E8F0',
            },
            strong: {
              color: '#E2E8F0',
            },
            a: {
              color: '#60A5FA',
              '&:hover': {
                color: '#93C5FD',
              },
            },
          },
        },
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [typography()],
}