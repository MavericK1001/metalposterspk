import type {Config} from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F5F0E8',
        ink: '#111111',
        red: '#D63B2F',
        cream: '#EDE8DC',
        mid: '#C8C2B4',
        muted: '#7A7570',
      },
      fontFamily: {
        display: ['Anton', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
