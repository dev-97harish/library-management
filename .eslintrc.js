module.exports = {
  extends: 'airbnb-base',
  rules: {
    'linebreak-style': 0,
    'no-param-reassign': 0,
    'no-underscore-dangle': 0,
    'no-return-await': 0,
    'max-len': 0,
    'no-case-declarations': 0,
    camelcase: 0,
    'no-restricted-syntax': 0,
    'no-await-in-loop': 0,
    'new-cap': 0,
    'import/named': 1,
    'no-unused-expressions': 0,
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  parser: 'babel-eslint',
};
