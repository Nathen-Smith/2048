module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      sm: '523px',
    },
    extend: {
      borderRadius: {
        '3px': '3px',
      },
      colors: {
        yellow: {
          250: '#FEE869',
        },
        amber: {
          250: '#FDDD6C',
        },
      },
    },
  },
  plugins: [],
};
