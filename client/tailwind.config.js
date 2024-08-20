/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'yellow-to-red':'url(\'assets/images/background-yellow-red.webp\')',
        'badminton':'url(\'assets/images/badminton.webp\')',
        'white_to_pink':'url(\'assets/images/white_to_pink.webp\')',

      },
      colors: {
        'primary-color': '#007aff',
        'secondary-color': '#fe5101',
        'three-color': 'rgb(240, 242, 245)',
        'gray-color-20':'#f7f8fa',
        'gray-color': '#EBEDF0',
        'white': 'rgb(255, 255, 255)',
        'black': '#000000',
        'vivid_purple': '#c600ff',
        'red-color': '#e2003b',
        'very_dark_black': '#111111',
        'vivid_red': '#ff0047',
        'deep_blue':'#2c34c7',
        'royal_blue': '#5d3fda',
        'neon_pink': '#fc36fd',
        'slate_gray': '#5d6374',
        'gunmetal_gray': '#16181d'
      }
    }
  },
  plugins: []
}
