import dartSass from 'sass'
import gulpSass from 'gulp-sass'
import rename from 'gulp-rename' // переименовывает файлы

import cleanCss from 'gulp-clean-css' // Сжатие CSS файла
import webpcss from 'gulp-webpcss' // Вывод WEBP изображений
import autoprefixer from 'gulp-autoprefixer' // Добавление вендорных префиксов 
import groupCssMediaQueries from 'gulp-group-css-media-queries' // Групировака media запросов

const sass = gulpSass(dartSass)

const scss = () => {
  return (
    app.gulp.src(app.path.src.scss, { sourcemaps: app.isDev })
      .pipe(app.plugins.plumber(
        app.plugins.notify.onError({
          title: 'SCSS',
          message: 'Error: <%= error.message %>'
        })
      ))
      .pipe(app.plugins.replace(/@img\//g, '../img/'))
      .pipe(sass({
        outputStyle: `expanded`
      }))
      .pipe(groupCssMediaQueries())
      // Выполнитья в режиме build
      .pipe(app.plugins.if(app.isBuild, webpcss({
        webpClass: '.webp',
        noWebpClass: '.no-webp'
      })))
      .pipe(app.plugins.if(app.isBuild, autoprefixer({
        grid: true,
        overrideBrowserslist: ['Last 3 versions'],
        cascade: true
      })))
      // ========================>
      .pipe(app.gulp.dest(app.path.build.css)) // добавляет не сжатый файл
      .pipe(cleanCss())
      .pipe(rename({
        extname: '.min.css'
      }))
      .pipe(app.gulp.dest(app.path.build.css))
      .pipe(app.plugins.browserSync.stream())
  )
}

export default scss 