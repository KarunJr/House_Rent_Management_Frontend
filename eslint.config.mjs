// // https://docs.expo.dev/guides/using-eslint/
// const { defineConfig } = require('eslint/config');
// const expoConfig = require('eslint-config-expo/flat');

// module.exports = defineConfig([
//   expoConfig,
//   {
//     ignores: ['dist/*'],
//   },
// ]);

import expo from 'eslint-config-expo/flat.js';
import eslintConfigPrettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  ...expo,
  eslintConfigPrettier,
  {
    ignores: [
      'node_modules/',
      '.expo/',
      'dist/',
      'build/',
      'coverage/',
      'android/',
      'ios/',
      'scripts/reset-project.js',
    ],
    rules: {
      // Make unused variables errors
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // Prefer const
      'prefer-const': 'error',

      // Prevent var
      'no-var': 'error',

      // Allow console (useful in RN development)
      'no-console': 'off',

      // Formatting rules (Prettier handles most of this)
      quotes: [
        'error',
        'single',
        {
          avoidEscape: true,
        },
      ],

      semi: ['error', 'always'],
    },
  },
]);
