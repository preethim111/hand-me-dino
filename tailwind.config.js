/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          teal:        '#4e9895',
          'teal-dark': '#3a7472',
          'teal-light':'#7dbdba',
          'teal-pale': '#edf7f6',
          green:       '#a6c96e',
          'green-dark':'#8aae4f',
          'green-pale':'#f2f8e8',
          beige:       '#ceb495',
          'beige-light':'#ddc9ae',
          cream:       '#f6f0e2',
          'cream-dark':'#ede4d0',
          dark:        '#2d4a49',
        },
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-12px)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)'    },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.85)' },
          to:   { opacity: '1', transform: 'scale(1)'    },
        },
        countUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)'    },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%':       { transform: 'rotate(3deg)'  },
        },
      },
      animation: {
        float:      'float 4s ease-in-out infinite',
        fadeInUp:   'fadeInUp 0.6s ease-out forwards',
        scaleIn:    'scaleIn 0.35s ease-out forwards',
        countUp:    'countUp 0.5s ease-out forwards',
        wiggle:     'wiggle 2s ease-in-out infinite',
        'float-slow':'float 6s ease-in-out infinite',
        'float-fast':'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
