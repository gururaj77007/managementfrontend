/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      spacing: {
        "20%": "20%", // p-80% - should work
      },
    },
  },
  plugins: [],
};
