/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        Info_info: '#1697de', // Adding custom color
      },
    },
  },
  plugins: [],
}
