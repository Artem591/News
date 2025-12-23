module.exports = {
  // Для файлов во frontend
  'frontend/src/**/*.{vue,js}': [
    'npm --prefix frontend run lint:fix',
    'npm --prefix frontend run format'
  ],
  
  // Для JS файлов в корне
  '*.js': [
    'eslint --fix --quiet',
    'prettier --write --loglevel warn'
  ],
  
  // Для остальных файлов
  '*.{json,md,css,html}': [
    'prettier --write --loglevel warn'
  ]
};