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
import minifycss from 'gulp-minify-css'
import rename from 'gulp-rename'
import sharp from 'gulp-sharp-responsive'
import sprite from 'gulp-svg-sprite'
import { deleteAsync } from 'del'
import svgo from 'gulp-svgo'
import { resolve } from 'node:path'
import sitemap from 'gulp-sitemap'
import { config } from './gulp.config.mjs'
import sassImportJson from 'gulp-sass-import-json'

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
  src(config.svg.src)
    .pipe(filelog())

    .pipe(
      sprite({
        svg: {
          // General options for created SVG files
          xmlDeclaration: true, // Add XML declaration to SVG sprite
          doctypeDeclaration: true, // Add DOCTYPE declaration to SVG sprite
          namespaceIDs: false, // Add namespace token to all IDs in SVG shapes
          namespaceIDPrefix: '', // Add a prefix to the automatically generated namespaceIDs
          namespaceClassnames: false, // Add namespace token to all CSS class names in SVG shapes
          dimensionAttributes: true, // Width and height attributes on the sprite
        },
        namespaceClassnames: false,
        namespaceIDs: false,
        mode: {
          symbol: {
            sprite: config.svg.sprite.fileName,
            dest: config.svg.sprite.dest,
          },
        },
      })
    )
    .pipe(filelog())

    .pipe(dest(config.svg.dest))
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
    .pipe(sassImportJson({ isScss: true, cache: false }))
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
  watch(config.styles.src, parallel(compileCss))
  watch(config.scripts.src, parallel(bundleJs))
  watch(config.images.src, parallel(processImages))
  watch(config.svg.src, parallel(processSvgs))

  watch(config.styles.dataSrc, parallel(compileCss))
}

// clean
//----------------------------------
export const clean = async () => {
  await Promise.resolve(deleteAsync(['dist'], { dryRun: false }))

  await new Promise((resolve) => {
    resolve(deleteAsync(['./dist', './public'], { dryRun: false }))
  })
}

// sitemap
//----------------------------------
export const siteMap = async () => {
  src('./dist/**/*.html', {
    read: false,
  })
    .pipe(
      sitemap({
        siteUrl: 'https://11ty-boilerplate.netlify.app/',
      })
    )
    .pipe(dest('./dist'))
}

// Build and Dev Commands
//----------------------------------
export const testDev = series(
  clean,
  // compileCss,
  bundleJs,
  // processImages,
  // processSvgs
  // gulpWatch
)

export const testBuild = series(
  clean,
  // compileCss
  bundleJs,
  // processImages,
  // processSvgs
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

if (env === production) {
  siteMap
}

//----------------------------------
//----------------------------------

// dev links
//----------------------------------

// gulp-sharp-responsive
// https://www.npmjs.com/package/gulp-sharp-responsive?activeTab=readme
