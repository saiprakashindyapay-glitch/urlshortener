/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#f6f1e7',
        ink: '#1f1b16',
        inksoft: '#5c5346',
        rule: '#d9cfba',
        clip: '#c4501f',
        clipsoft: '#e9d9c8',
        measure: '#2f6b5e',
      },
    },
  },
  plugins: [],
};
