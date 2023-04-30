import gulp from 'gulp'
import dartsass from 'sass'
import gulpsass from 'gulp-sass'
import { spawn } from 'node:child_process'
import webpack from 'webpack-stream'
import filelog from 'gulp-filelog'
import cache from 'gulp-cache'
import gulpif from 'gulp-if'
import purgecss from 'gulp-purgecss'
import minifycss from 'gulp-minify-css'
import rename from 'gulp-rename'
import sharp from 'gulp-sharp-responsive'
import sprite from 'gulp-svg-sprite'
import { deleteAsync } from 'del'
import svgo from 'gulp-svgo'
import sitemap from 'gulp-sitemap'
import { config } from './gulp.config.mjs'
import sassImportJson from 'gulp-sass-import-json'
import minifyClassNames from './my-modules/minifyClassNames.js'
import sourcemaps from 'gulp-sourcemaps'

const { src, series, parallel, dest, watch } = gulp
const sass = gulpsass(dartsass)
let env = process.env.NODE_ENV
let production = false

// development
//----------------------------------
gulp.task('minify-css-names', (done) => {
  minifyClassNames([
    { input: 'index.html', output: 'build/index.html' },
    // { input: 'src/assets/js/app.js', output: 'build/assets/js/app.js' },
    { input: 'main.css', output: 'build/assets/css/main.css' },
  ])

  done()
})

// production state
//----------------------------------
export const isProduction = async () => {
  production = true
}

// svg's
//----------------------------------
export const minSvg = async () => {
  src('./src/assets/images/*.svg')
    .pipe(svgo())
    .pipe(filelog())
    .pipe(dest('./dist/images/svg/'))
}

export const spriteSvg = async () => {
  src(config.svg.src)
    .pipe(filelog())

    .pipe(
      sprite({
        svg: {
          // General options for created SVG files
          xmlDeclaration: true, // Add XML declaration to SVG sprite
          doctypeDeclaration: true, // Add DOCTYPE declaration to SVG sprite
          namespaceIDs: true, // Add namespace token to all IDs in SVG shapes
          namespaceIDPrefix: '', // Add a prefix to the automatically generated namespaceIDs
          namespaceClassnames: false, // Add namespace token to all CSS class names in SVG shapes
          dimensionAttributes: true, // Width and height attributes on the sprite
        },

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
          includeOriginalFile: false,
          formats: [
            {
              width: 800,
              rename: { suffix: '-(800)' },
              jpegOptions: { quality: 80, progressive: true },
            },
            {
              width: 1200,
              rename: { suffix: '-(1200)' },
              jpegOptions: { quality: 80, progressive: true },
            },

            {
              format: 'webp',
              width: 800,
              rename: { suffix: '-(800)' },
              webpOptions: { quality: 80 },
            },

            {
              format: 'webp',
              width: 1200,
              // width: metadata => metadata.width * 0.5,
              rename: { suffix: '-(1200)' },
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
    .pipe(gulpif(env != 'production', sourcemaps.init()))

    .pipe(sassImportJson({ isScss: true, cache: false }))
    .pipe(sass.sync({ outputStyle: 'expanded' }).on('error', sass.logError))

    .pipe(gulpif(env != 'production', sourcemaps.write('../maps')))

    .pipe(
      gulpif(
        env === 'production',
        purgecss({
          content: ['src/**/*.njk', 'src/**/*.js'],
        })
      )
    )
    .pipe(gulpif(env == 'production', minifycss()))

    .pipe(filelog())
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
  watch(config.scripts.src, series(bundleJs, cleanIndexJs))
  watch(config.images.src, parallel(processImages))
  watch(config.svg.src, parallel(spriteSvg, minSvg))

  watch(config.styles.dataSrc, parallel(compileCss))
}

// clean
//----------------------------------
export const cleanIndexJs = async () => {
  await Promise.resolve(deleteAsync(['dist/js/index.js'], { dryRun: false }))
}

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
export const testJs = () => {
  return src(config.scripts.src).pipe(webpack()).pipe(dest(config.scripts.dest))
}

export const testDev = series(
  // clean,
  // compileCss,
  // bundleJs,
  processImages
  // spriteSvg,
  // minSvg,
  // gulpWatch,
  // testJs
)

export const testBuild = series(
  // clean,
  // compileCss,
  // bundleJs,
  processImages
  // spriteSv,
)

export const serve = series(gulpWatch)

export const dev = series(
  // clean,
  compileCss,
  bundleJs,
  processImages,
  spriteSvg,
  minSvg
)

export const build = series(
  clean,
  compileCss,
  bundleJs,
  processImages,
  spriteSvg,
  minSvg
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
