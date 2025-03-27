/** @type {import('tailwindcss').Config} */

export default {

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        'body': ['Orbitron', 'sans-serif'],
        'headers': ['Russo One', 'sans-serif'],
        'footer': ['Russo One', 'sans-serif'],
      },
    },
  },

  plugins: [],

}


