module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-gold)',
        accent: 'var(--color-silver)',
        background: 'var(--color-cream)',
        secondary: 'var(--color-charcoal)',
        slate: 'var(--color-slate)',
        goldlight: 'var(--color-gold-light)'
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['Manrope', 'sans-serif']
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 600ms ease-out both'
      }
    }
  },
  plugins: [],
}
