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
    'arrow-parens': 0,
    'no-param-reassign': 0,
    // 'class-methods-use-this': 0,
    'no-extra-parens': 1,
    'consistent-return': 0,
    'no-plusplus': 0,
    // 'prefer-const': 0,
  },
};
