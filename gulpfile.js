import gulp from 'gulp'
import { path } from './gulp/config/path.js'
import plugins from './gulp/config/plugins.js'

// Глобальные переменные
global.app = {
  path,
  gulp,
  plugins,
  isBuild: process.argv.includes('--build'),
  isDev: !process.argv.includes('--build')
}

import copy from './gulp/tasks/copy.js'
import reset from './gulp/tasks/reset.js'
import html from './gulp/tasks/html.js'
import server from './gulp/tasks/server.js'
import scss from './gulp/tasks/scss.js'
import js from './gulp/tasks/js.js'
import images from './gulp/tasks/images.js'
import { otfToTtf, ttfToWoff, fontsStyle } from './gulp/tasks/fonts.js'
import svgSprite from './gulp/tasks/svgSprite.js'
import { zip, zipDev } from './gulp/tasks/zip.js'
import ftp from './gulp/tasks/ftp.js'
import php from './gulp/tasks/php.js'

function watcher() {
  gulp.watch(path.watch.assets, copy)
  gulp.watch(path.watch.html, html)
  gulp.watch(path.watch.scss, scss)
  gulp.watch(path.watch.js, js)
  gulp.watch(path.watch.images, images)
  gulp.watch(path.watch.php, php)
}


// Последовательная обработка шрифтов 
const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle)
// Основные задачи
const mainTasks = gulp.series(fonts, gulp.parallel(copy, html, scss, js, images, php))
// Сценарий выполнения задач 
const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server))
const build = gulp.series(reset, mainTasks)
const deployZIP = gulp.series(reset, mainTasks, zip)
const deployZIP_DEV = gulp.series(zipDev)
const deployFTP = gulp.series(reset, mainTasks, ftp)

gulp.task('default', dev)

// export сценариев
export { dev, build, svgSprite, deployZIP, deployFTP, deployZIP_DEV }