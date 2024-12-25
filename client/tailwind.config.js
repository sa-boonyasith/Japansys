/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background:"#E4DCCF",
        buttonnonactive:"#576F73",
        buttonactive:"#7D9D9C"
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"], // Choose or customize themes
  },
}

