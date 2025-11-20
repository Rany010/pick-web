/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E64A19',
        secondary: '#2E7D32',
        accent: '#FFC107',
        dark: '#263238',
        light: '#F5F5F5',
      },
    },
  },
  plugins: [],
}

