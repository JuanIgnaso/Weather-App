/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      keyframes:{
        mark:{
          '0%':{'opacity':1},
          '100%':{'opacity':0},
        },
      },
      animation:{
        mark: 'mark 1s ease-in-out',
      },
      colors:{
        lightOrange:'#ec6e4c'
      },
      aspectRatio: {
        '1/2': '1 / 2',
        '1/3': '1 / 3',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
