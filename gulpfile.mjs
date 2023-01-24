import gulp from 'gulp'
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
import { deleteAsync } from 'del'
import { spawn } from 'node:child_process'
import webpack from 'webpack-stream'
import purgeCSS from 'gulp-purgecss'

const sass = gulpSass(dartSass)

const { src, series, parallel, dest, task, watch } = gulp

export const render = () => {
  return spawn('npx', ['eleventy', '--quiet'], { stdio: 'inherit' })
}

export const copy = () => {
  return src('./dist/**/*').pipe(dest('./public'))
}

export const delDist = () => {
  return deleteAsync('./dist')
}

export const delPub = () => {
  return deleteAsync('./public')
}

export const del = () => {
  return deleteAsync(['./public', './dist'])
}

export function devCSS() {
  return src('./src/sass/**/*.scss')
    .pipe(sass.sync({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(dest('./dist/css'))
}

// export const devCSS = () => {
//   return (
//     src('src/sass/**/*.scss')
//       // .pipe(sass({ outputStyle: 'compressed' }))
//       .pipe(
//         sassComp({
//           // outputStyle: 'compressed',
//           precision: 10,
//           errLogToConsole: true,
//         })
//       )
//       // .pipe(
//       //   purgeCSS({
//       //     content: ['src/**/*.njk', 'src/**/*.js'],
//       //     sourceMap: true,
//       //   })
//       // )
//       .on('error', sassComp.logError)
//       .pipe(dest('./dist/css/'))
//   )
// }

// JS
//----------------------------------
export const devJS = () => {
  return src('./src/js/**/*.js')
    .pipe(webpack({ mode: 'development', devtool: 'source-map' }))
    .pipe(dest('./dist/js/'))
}

export const gulpWatch = () => {
  watch('./src/sass/**/**.scss', parallel(devCSS))
  watch('./src/js/**/**.js', parallel(devJS))
}

export const serve = series(gulpWatch)
export const build = series(devCSS, devJS)
