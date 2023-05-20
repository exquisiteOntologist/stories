module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,css,scss,html}', './index.html'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: {
          100: '#F8F6F6'
        }
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
