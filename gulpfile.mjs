import gulp from 'gulp'
import dartsass from 'sass'
import gulpsass from 'gulp-sass'
import { spawn } from 'node:child_process'
import webpack from 'webpack-stream'
import filelog from 'gulp-filelog'
import cache from 'gulp-cache'
import gulpif from 'gulp-if'
import webp from 'gulp-webp'
import purgecss from 'gulp-purgecss'
import { config } from './gulp.config.mjs'
import minifycss from 'gulp-minify-css'
import rename from 'gulp-rename'
import sharp from 'gulp-sharp-responsive'
import sprite from 'gulp-svg-sprite'
import { deleteAsync } from 'del'
import svgo from 'gulp-svgo'
import { resolve } from 'node:path'

const { src, series, parallel, dest, watch } = gulp
const sass = gulpsass(dartsass)
let env = process.env.NODE_ENV
let production = false

// production state
//----------------------------------
export const isProduction = async () => {
  production = true
}

// svgGo
//----------------------------------
export const minSvg = async () => {
  src('./src/assets/images/site-logo.svg')
    .pipe(svgo())
    .pipe(filelog())
    .pipe(dest('./dist/images/'))
}

// svg's
//----------------------------------
export const processSvgs = async () => {
  src('./src/assets/images/**/*.svg')
    // .pipe(svgo())
    .pipe(filelog())

    .pipe(
      sprite({
        mode: {
          symbol: {
            sprite: 'sprite.svg',
            dest: 'svg',
          },
        },
      })
    )
    .pipe(filelog())

    .pipe(dest('./dist/images/'))
}

// images
//----------------------------------
export const processImages = () => {
  return src('./src/assets/images/**/*.{jpg,png}')
    .pipe(
      gulpif(
        env === 'production',
        sharp({
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
    )

    .pipe(
      gulpif(
        env === 'development',
        sharp({
          includeOriginalFile: true,
          formats: [
            {
              format: 'webp',
              webpOptions: { lossless: true },
            },
          ],
        })
      ),
      filelog()
    )

    .pipe(filelog())
    .pipe(dest('dist/images'))
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
      gulpif(
        env === 'production',
        purgecss({
          content: ['src/**/*.njk', 'src/**/*.js'],
          sourceMap: true,
        })
      )
    )
    .pipe(gulpif(env == 'production', minifycss()))

    .pipe(filelog())
    .pipe(rename(config.styles.fileName))
    .pipe(dest(config.styles.dest))
}

// JS
//----------------------------------
export const bundleJs = () => {
  return src(config.scripts.src)
    .pipe(gulpif(env === 'production', webpack({ mode: 'production' })))

    .pipe(
      gulpif(
        env === 'development',
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

// clean
//----------------------------------
export const clean = async () => {
  await Promise.resolve(deleteAsync(['dist'], { dryRun: false }))

  await new Promise((resolve) => {
    resolve(deleteAsync(['./dist', './public'], { dryRun: false }))
  })
}

// Build and Dev Commands
//----------------------------------
export const test = series(
  clean,
  clean,
  compileCss,
  bundleJs,
  processImages,
  processSvgs
)

export const serve = series(gulpWatch)

export const dev = series(compileCss, bundleJs, processImages, processSvgs)

export const build = series(
  clean,
  compileCss,
  bundleJs,
  processImages,
  processSvgs
)

//----------------------------------
//----------------------------------

// dev links
//----------------------------------

// gulp-sharp-responsive
// https://www.npmjs.com/package/gulp-sharp-responsive?activeTab=readme
