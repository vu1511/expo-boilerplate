// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config')
const expoConfig = require('eslint-config-expo/flat')

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
    plugins: {
      prettier: require('eslint-plugin-prettier'),
      'simple-import-sort': require('eslint-plugin-simple-import-sort'),
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin')
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json'
        }
      }
    },
    rules: {
      'prettier/prettier': [
        'warn',
        {},
        {
          usePrettierrc: true
        }
      ],
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never'
        }
      ],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'react/function-component-definition': 'off',
      'react/destructuring-assignment': 'off',
      'react/require-default-props': 'off',
      'react/jsx-props-no-spreading': 'off',
      'import/prefer-default-export': 'off',
      'no-else-return': 'off',
      'react/display-name': 'off',
      'object-shorthand': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-key': 'error',
      'react/no-array-index-key': 'off',
      'react/no-unstable-nested-components': 'off',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error'
    }
  }
])
