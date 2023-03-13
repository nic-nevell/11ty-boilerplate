export const ASSET_EXTENSIONS = [
  'js',
  'jsx',
  'css',
  'png',
  'jpe?g',
  'gif',
  'svg',
  'eot',
  'otf',
  'ttc',
  'ttf',
  'woff2?',
]

export const config = {
  developmentPort: 3000,
  browserSyncPort: 3001,
  sourceDirectory: './src/',
  buildDirectory: './dist/',
  assetExtensions: ASSET_EXTENSIONS,

  scripts: {
    src: './src/js/index.js',
    dest: './dist/js/',
  },

  svg: {
    src: ['./src/assets/images/icons/*.svg', './src/assets/images/logos/*.svg'],
    dest: './dist/images/',
    sprite: { fileName: 'sprite.svg', dest: 'svg/' },
  },

  images: {
    // src: './src/images/**/*.{jpeg,jpg,png,gif}',
    src: './src/assets/images/**/*.*',
    dest: './dist/images/',
  },

  fonts: {
    src: './src/fonts/**/*.{eot,otf,ttc,ttf,woff2}',
    dest: './dist/fonts/',
  },

  styles: {
    src: './src/sass/**/*.scss',
    watch: './src/sass/**/*.scss',
    dest: './dist/css/',
    dataSrc: './src/_data/sass/**/*.json',
  },
}
