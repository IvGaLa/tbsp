import js from '@eslint/js';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
  },

  js.configs.recommended,

  eslintConfigPrettier,

  {
    rules: {
      'no-undef': 'error',
      'no-unreachable': 'error',
      'no-duplicate-imports': 'error',
      'no-unused-private-class-members': 'error',

      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'warn',
      'no-return-await': 'warn',

      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      'no-process-exit': 'warn',

      'no-console': 'off',
    },
  },
];
