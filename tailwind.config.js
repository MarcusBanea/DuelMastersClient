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
        'myDarkGreen': '#45A29E',
        'myDarkBlue': '#011129',
        'myLightBlue': '#333e4b',
        'myBeige': '#f0dbc4',
        'myGold': '#D4AF37',
        'myGold2': "#e0bf6d",

        'myLimited': '#0f1d40',
        'myLimitedGreen' : '#0ac73c'
      },
      backgroundImage: {
        'background1': "url('Background1.jpg')",
        'frame1': "url('frame1.png')"
      },
      fontFamily: {
        'fantasy': ['Luminari', 'Chalkduster', 'Trattatello'],
        'cursive': ['Cursive']
      }
    },
  },
  plugins: [],
}