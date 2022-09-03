/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'myBlack': '#0B0C10',
        'myDarkGray': '#1F2833',
        'myLightGray': '#C5C6C7',
        'myLightGreen': '#66FCF1',
        'myDarkGreen': '#45A29E'
      }
    },
  },
  plugins: [],
}