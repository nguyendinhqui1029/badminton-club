/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-color': '#007aff',
        'secondary-color': '#fe5101',
      },
    }
  },
  plugins: []
}

