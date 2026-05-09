const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
  extends: ['@cjx-low-code/eslint-config'],
  env: {
    browser: true,
    node: true
  },
  settings: {
    'import/resolver': {
      node: { extensions: ['.js', '.mjs', '.ts', '.d.ts', '.tsx'] }
    }
  },
  overrides: [
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.vue'],
        ecmaVersion: 'latest',
        ecmaFeatures: {
          jsx: true
        }
      }
    }
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    'no-unreachable': 'off',
    'no-console': 'off'
  }
})
