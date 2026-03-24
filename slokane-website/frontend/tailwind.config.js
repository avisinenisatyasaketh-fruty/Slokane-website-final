/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        outfit:   ['Outfit', 'sans-serif'],
        fraunces: ['Fraunces', 'Georgia', 'serif'],
      },
      colors: {
        // PRIMARY: Orange
        ember: {
          DEFAULT: '#F97316',
          light:   '#FB923C',
          dark:    '#EA6000',
        },
        // ACCENT: Lavender
        gold: {
          DEFAULT: '#A78BFA',
          light:   '#C4B5FD',
          pale:    '#EDE9FE',
        },
        // BACKGROUND: Deep purple-dark
        ink: {
          DEFAULT: '#0D0B14',
          900:     '#0D0B14',
          800:     '#13101E',
          700:     '#1C1830',
          600:     '#2A2445',
        },
        // TEXT: Lavender-tinted white
        cream: {
          DEFAULT: '#F5F3FF',
          light:   '#FDFCFF',
          dark:    '#E9E4FF',
        },
        // MUTED: Purple-grey
        smoke: {
          DEFAULT: '#7C6FA0',
          light:   '#A89EC0',
          dark:    '#4A3F6B',
        },
      },
      animation: {
        'ticker':      'ticker 30s linear infinite',
        'float':       'float 6s ease-in-out infinite',
        'float-delay': 'float 6s ease-in-out 2s infinite',
        'pulse-ring':  'pulseRing 2.5s ease-out infinite',
        'fade-up':     'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-right':  'fadeRight 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-left':   'fadeLeft 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        'shimmer':     'shimmer 2.5s linear infinite',
        'spin-slow':   'spin 8s linear infinite',
        'dot-bounce':  'dotBounce 1.4s ease-in-out infinite',
      },
      keyframes: {
        ticker:    { '0%': { transform: 'translateX(0)' },           '100%': { transform: 'translateX(-50%)' } },
        float:     { '0%,100%': { transform: 'translateY(0)' },      '50%':  { transform: 'translateY(-14px)' } },
        pulseRing: { '0%': { transform: 'scale(0.8)', opacity:'1' }, '100%': { transform: 'scale(2)', opacity:'0' } },
        fadeUp:    { from: { opacity:'0', transform:'translateY(40px)' },  to: { opacity:'1', transform:'translateY(0)' } },
        fadeRight: { from: { opacity:'0', transform:'translateX(-40px)' }, to: { opacity:'1', transform:'translateX(0)' } },
        fadeLeft:  { from: { opacity:'0', transform:'translateX(40px)' },  to: { opacity:'1', transform:'translateX(0)' } },
        shimmer:   { '0%': { backgroundPosition:'-200% 0' },         '100%': { backgroundPosition:'200% 0' } },
        dotBounce: { '0%,100%': { transform:'translateY(0)' },       '50%':  { transform:'translateY(-10px)' } },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
