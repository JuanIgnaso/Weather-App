/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      aspectRatio: {
        '1/2': '1 / 2',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
