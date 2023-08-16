/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,js,ts,tsx,jsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "place-pattern": "url('/src/assets/images/place-pattern.svg')",
      },
    },
  },
  plugins: [],
};
