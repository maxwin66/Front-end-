/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        sora: ['Sora', 'sans-serif']
      },
      backgroundImage: {
        'anime': "url('https://raw.githubusercontent.com/Minatoz997/angel_background.png/main/angel_background.png')"
      }
    },
  },
  plugins: [],
}
