module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
      },
      colors: {
        'main': '#000105',
        'accent': '#0066FF',
        'muted': 'rgba(255, 255, 255, 0.8)',
      },
      boxShadow: {
        'glow': 'inset 0 0 100px #0066FF',
      },
      animation: {
        'float-slow': 'float-slow 15s ease-in-out infinite',
        'gentle-blob': 'gentle-blob 8s infinite',
        'gradient': 'gradient 4s ease infinite',
        'soft-pulse': 'soft-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'gentle-blob': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(20px, -40px) scale(1.05)' },
          '66%': { transform: 'translate(-15px, 15px) scale(0.98)' },
        },
        'gradient': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'soft-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
}
