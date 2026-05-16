/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6C5CE7',
        secondary: '#00CEC9',
        accent: '#FDCB6E',
        success: '#00B894',
        danger: '#FF7675',
        background: '#F8F9FA',
      },
      fontSize: {
        'kid': '20px',
        'kid-lg': '24px',
        'kid-xl': '32px',
      },
    },
  },
  plugins: [],
}