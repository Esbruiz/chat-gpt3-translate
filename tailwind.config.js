/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  // eslint-disable-next-line global-require
  plugins: [require('@tailwindcss/forms')],
};
