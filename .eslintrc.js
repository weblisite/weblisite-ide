module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'import', '@typescript-eslint'],
  rules: {
    // Essential syntax error prevention rules
    'no-unused-vars': 'warn',
    'react/prop-types': 'off', // We're using TypeScript
    'react/react-in-jsx-scope': 'error',
    'react/jsx-no-undef': 'error',
    'react/jsx-key': 'error',
    'no-undef': 'error',
    'import/no-unresolved': 'error',
    'import/named': 'error',
    'import/default': 'error',
    'import/export': 'error',
    'no-const-assign': 'error',
    'no-this-before-super': 'error',
    'no-dupe-args': 'error',
    'no-dupe-class-members': 'error',
    'no-dupe-keys': 'error',
    'no-unreachable': 'error',
    'valid-typeof': 'error',
    'no-irregular-whitespace': 'error',
    'quotes': ['error', 'double'], // Enforce double quotes
    'jsx-quotes': ['error', 'prefer-double'], // Enforce double quotes in JSX
    'object-curly-spacing': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'arrow-parens': ['error', 'always'],
    'no-console': 'warn',
    'semi': ['error', 'always'],
    'no-extra-semi': 'error',
    'semi-spacing': 'error',
    'no-func-assign': 'error',
    'no-class-assign': 'error',
    'no-extra-boolean-cast': 'error'
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};