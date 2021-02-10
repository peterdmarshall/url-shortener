module.exports = {
  purge: [
    './src/**/*.html',
    './src/**/*.js',
    './src/**/*.jsx',
    './src/**/*.ts',
    './src/**/*.tsx',
    './public/index.html',
  ],
  theme: {
    extend: {}
  },
  variants: {
    extend: {
      textColor: ['active'],
      backgroundColor: ['active'],
    }
  },
  plugins: []
}
