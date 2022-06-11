module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      sm: '560px',
    },
    extend: {
      borderRadius: {
        '3px': '3px',
      },
    },
  },
  plugins: [],
};
