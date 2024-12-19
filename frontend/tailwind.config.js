module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'delay-150': 'delay 150ms',
      },
      keyframes: {
        delay: {
          '0%, 100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
};
