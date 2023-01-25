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
    src: './src/js/**/*.js',
    dest: './dist/js/',
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
    fileName: 'main.css',
  },
}
