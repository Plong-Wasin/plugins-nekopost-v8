module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    // 'airbnb-base',
    'eslint:recommended',
    // "plugin:@typescript-eslint/recommended",
    // "plugin:@typescript-eslint/recommended-requiring-type-checking",
    // "prettier",
  ],
  // parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    // project: ['./tsconfig.json'],
  },
  // plugins: [
  //   '@typescript-eslint',
  // ],
  rules: {
    'no-alert': 0,
    'linebreak-style': 0,
  },

};
