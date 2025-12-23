import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    files: ['**/*.js'],
    ignores: ['frontend/**', 'node_modules/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-console': 'off',
      'no-unused-vars': 'warn',
    },
  },
];