module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@next/next/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    // Add any rules you want to customize here
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
  env: {
    browser: true,
    node: true,
    es6: true
  }
}; 