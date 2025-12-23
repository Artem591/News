// frontend/eslint.config.js
import vuePlugin from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';

export default [
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser, // ← ЯВНО указываем парсер
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      vue: vuePlugin,
    },
    rules: {
      ...vuePlugin.configs['vue3-essential'].rules,
      'vue/multi-word-component-names': 'off',
    },
  },
];