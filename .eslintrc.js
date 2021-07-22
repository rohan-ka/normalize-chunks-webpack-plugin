module.exports = {
  extends: ['plugin:prettier/recommended'],
    parserOptions: {
        ecmaVersion: 2017
    },
    env: {
        es6: true
    },
  rules: {
    'arrow-parens': [
        'error',
        'always',
    ],
    'class-methods-use-this': 0,
    "prettier/prettier": "error",
  }
};
