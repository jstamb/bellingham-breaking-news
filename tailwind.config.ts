import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Main brand colors
        primary: '#E63946',      // Red for "BREAKING" and accents
        secondary: '#1a1a2e',    // Dark navy blue
        accent: '#27C02F',       // Green accent
        lightGray: '#f8f9fa',    // Light gray backgrounds
        // Category colors
        'cat-local': '#4caf50',
        'cat-politics': '#d32f2f',
        'cat-police': '#1a237e',
        'cat-business': '#2979ff',
        'cat-wwu': '#003f87',
        'cat-sports': '#26c0ef',
        'cat-restaurants': '#e65100',
        'cat-waterfront': '#00838f',
        'cat-weather': '#ff9800',
      },
      fontFamily: {
        sans: ['var(--font-roboto)', 'sans-serif'],
        headline: ['var(--font-roboto-condensed)', 'sans-serif'],
        condensed: ['var(--font-roboto-condensed)', 'sans-serif'],
        serif: ['var(--font-pt-serif)', 'serif'],
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-150%)' },
        },
      },
      animation: {
        scroll: 'scroll 45s linear infinite',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: {
              color: '#E63946',
              '&:hover': {
                color: '#c62c38',
              },
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
