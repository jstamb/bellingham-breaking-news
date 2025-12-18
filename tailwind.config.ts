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
        'cat-local': '#4caf50',
        'cat-politics': '#d32f2f',
        'cat-police': '#1a237e',
        'cat-business': '#2979ff',
        'cat-wwu': '#003f87',
        'cat-sports': '#26c0ef',
        'cat-restaurants': '#e65100',
        'cat-waterfront': '#00838f',
        'cat-weather': '#ff9800',
        'news-gray': '#f0f1f2',
        'news-text': '#666666',
      },
      fontFamily: {
        sans: ['var(--font-roboto)', 'sans-serif'],
        headline: ['var(--font-roboto-condensed)', 'sans-serif'],
        serif: ['var(--font-pt-serif)', 'serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: {
              color: '#2979ff',
              '&:hover': {
                color: '#1565c0',
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
