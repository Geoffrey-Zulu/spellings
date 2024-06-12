module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0C1841', 
        bgGray: '#F5F5F5', 
      },
      fontFamily: {
        serif: ['Inria Serif', 'serif'], 
        sans: ['Istok Web', 'sans-serif'], 
        grover: ['Irish Grover', 'cursive'], 
      },
      boxShadow: {
        text: '0px 11px 4px rgba(0, 0, 0, 0.25)', 
      },
    },
  },
  plugins: [],
}
