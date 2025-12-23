// .lintstagedrc.cjs
module.exports = {
  stash: false,

  'frontend/src/**/*.{vue,js}': [
    'cd frontend && npx eslint --fix --quiet',
    'cd frontend && npx prettier --write --log-level warn',
  ],

  '*.js': ['eslint --fix --quiet', 'prettier --write --log-level warn'],

  '*.{json,md,css,html,ts,tsx}': ['prettier --write --log-level warn'],
};
