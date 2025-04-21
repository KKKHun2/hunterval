/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}', // 혹시 components 경로 따로 있을 때
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
