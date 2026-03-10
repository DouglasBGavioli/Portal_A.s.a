/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          900: "#222222",
          700: "#2c3b17",
          600: "#4d5b39",
          500: "#72815e",
          400: "#aec096",
        },
      },
    },
  },
  plugins: [],
};
