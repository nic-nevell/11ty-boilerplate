import gulp from 'gulp'
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
import { spawn } from 'node:child_process'
import webpack from 'webpack-stream'
import fileLog from 'gulp-filelog'
import imagesMin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin'
import cache from 'gulp-cache'
import gulpIf from 'gulp-if'
import webp from 'gulp-webp'
import purgeCss from 'gulp-purgecss'
import { config } from './myConfig.mjs'
import minifyCss from 'gulp-minify-css'
import rename from 'gulp-rename'
import sharpResponsive from 'gulp-sharp-responsive'
import svgSprite from 'gulp-svg-sprite'

const { src, series, parallel, dest, task, watch } = gulp
const sass = gulpSass(dartSass)

let production = true

const spriteConfig = {
  mode: {
    css: {
      // Activate the «css» mode
      render: {
        css: true, // Activate CSS output (with default options)
      },
    },
  },
}

// svg's
//----------------------------------
export const svg = async () => {
  src('./src/assets/images/icons/*.svg')
    // .pipe(svgSprite(spriteConfig))
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            sprite: 'sprite.svg',
            dest: 'svg',
          },
        },
      })
    )

    .pipe(fileLog())
    .pipe(dest('./dist/images/'))
}
export const svgLogo = async () => {
  src('./src/assets/images/site-logo.svg')
    .pipe(fileLog())
    .pipe(dest('./dist/images/'))
}

// images
//----------------------------------
export const processImages = () => {
  return src('./src/assets/images/**/*.{jpg,png}')
    .pipe(
      sharpResponsive({
        includeOriginalFile: true,
        formats: [
          {
            width: 600,
            rename: { suffix: '-(sm)' },
            jpegOptions: { quality: 80, progressive: true },
          },

          {
            format: 'webp',
            webpOptions: { quality: 80 },
          },
          {
            format: 'webp',
            width: (metadata) => metadata.width * 0.5,
            rename: { suffix: '-(sm)' },
            webpOptions: { quality: 80 },
          },
        ],
      })
    )
    .pipe(fileLog())
    .pipe(dest('dist/images'))
}

// imagesMin
export const minImages = () => {
  return src(config.images.src)
    .pipe(
      gulpIf(
        production,
        imagesMin([
          gifsicle({ interlaced: true }),
          mozjpeg({ quality: 50, progressive: true }),
          optipng({ optimizationLevel: 5 }),
          svgo({
            plugins: [
              {
                name: 'removeViewBox',
                active: true,
              },
              {
                name: 'cleanupIDs',
                active: false,
              },
            ],
          }),
        ])
      )
    )
    .pipe(fileLog())
    .pipe(dest(config.images.dest))
}

// imagesWebp
export const imagesWebp = async () => {
  if (production) {
    return src(config.images.src)
      .pipe(webp({ quality: 50 }))
      .pipe(fileLog())
      .pipe(dest(config.images.dest))
  }
}

// HTML
//----------------------------------
export const render = () => {
  return spawn('npx', ['eleventy', '--quiet'], { stdio: 'inherit' })
}

export const copy = () => {
  return src('./dist/**/*').pipe(dest('./public'))
}

// CSS
//----------------------------------
export function compileCss() {
  return src(config.styles.src)
    .pipe(sass.sync({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(
      gulpIf(
        production,
        purgeCss({
          content: ['src/**/*.njk', 'src/**/*.js'],
          sourceMap: true,
        })
      )
    )
    .pipe(gulpIf(production, minifyCss()))
    .pipe(rename(config.styles.fileName))
    .pipe(fileLog())
    .pipe(dest(config.styles.dest))
}

// JS
//----------------------------------
export const bundleJs = () => {
  return src(config.scripts.src)
    .pipe(gulpIf(production, webpack({ mode: 'production' })))
    .pipe(
      gulpIf(
        !production,
        webpack({ mode: 'development', devtool: 'source-map' })
      )
    )
    .pipe(dest(config.scripts.dest))
}

// Gulp Watch
//----------------------------------
export const gulpWatch = () => {
  watch('./src/sass/**/**.scss', parallel(compileCss))
  watch('./src/js/**/**.js', parallel(bundleJs))
  watch('./src/assets/images/', parallel(processImages))
}

// Build and Dev Commands
//----------------------------------
export const serve = series(gulpWatch)

export const isProduction = async () => {
  production = true
}
export const build = series(
  compileCss,
  bundleJs,
  processImages,
  svgLogo,
  // imagesWebp,
  svg
)

//----------------------------------
//----------------------------------

// dev links
//----------------------------------

// gulp-sharp-responsive
// https://www.npmjs.com/package/gulp-sharp-responsive?activeTab=readme
