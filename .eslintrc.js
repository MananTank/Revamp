module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
    jest: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    'no-restricted-syntax': 0,
    'linebreak-style': 0,
    'no-constant-condition': 0,
  },
};
