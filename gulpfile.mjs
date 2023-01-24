import gulp from 'gulp'
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
import { spawn } from 'node:child_process'
import webpack from 'webpack-stream'
import fileLog from 'gulp-filelog'
import imagemin from 'gulp-imagemin'
import cache from 'gulp-cache'
import gulpif from 'gulp-if'
import webp from 'gulp-cwebp'
import purgecss from 'gulp-purgecss'
import { config } from './myConfig.mjs'

const { src, series, parallel, dest, task, watch } = gulp
const sass = gulpSass(dartSass)

const isProduction = false // TODO: add business logic
console.log(config.images.src)

export const imgMin = () => {
  return src(config.images.src)
    .pipe(gulpif(isProduction, imagemin({ optimizationLevel: 1 })))
    .pipe(fileLog())
    .pipe(dest(config.images.src))

  // .pipe(
  //   gulpif(
  //     browserSync.active,
  //     browserSync.reload({ stream: true, once: true })
  //   )
  // )
}

// images
//----------------------------------
export const imgWebp = async () => {
  return (
    src(config.images.src)
      .pipe(webp())
      // .pipe(fileLog())
      .pipe(dest(config.images.src))
  )
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
export function devCSS() {
  return (
    src('./src/sass/**/*.scss')
      .pipe(sass.sync({ outputStyle: 'compressed' }).on('error', sass.logError))

      .pipe(
        gulpif(
          isProduction,
          purgecss({
            content: ['src/**/*.njk', 'src/**/*.js'],
            sourceMap: true,
          })
        )
      )
      // .pipe(fileLog())
      .pipe(dest('./dist/css'))
  )
}

// JS
//----------------------------------
export const devJS = () => {
  return src('./src/js/**/*.js')
    .pipe(gulpif(isProduction, webpack({ mode: 'production' })))
    .pipe(
      gulpif(
        !isProduction,
        webpack({ mode: 'development', devtool: 'source-map' })
      )
    )
    .pipe(dest('./dist/js/'))
}

// Gulp Watch
//----------------------------------
export const gulpWatch = () => {
  watch('./src/sass/**/**.scss', parallel(devCSS))
  watch('./src/js/**/**.js', parallel(devJS))
  watch('./src/assets/images/', parallel(imgMin))
}

// Build and Dev Commands
//----------------------------------
export const serve = series(gulpWatch)
export const dev = series(devCSS, devJS)

export const build = series(devCSS, devJS, imgMin, imgWebp)
