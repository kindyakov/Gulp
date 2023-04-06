import webp from 'gulp-webp' // форматирует в формат webp
import imagemin from 'gulp-imagemin' //сжимает картинки

const images = () => {
  return (
    app.gulp.src(app.path.src.images)
      .pipe(app.plugins.plumber(
        app.plugins.notify.onError({
          title: 'IMG',
          message: 'Error: <%= error.message  %>'
        })
      ))
      // Выполнитья в режиме build
      .pipe(app.plugins.newer(app.path.build.images)) // проверка на изменение
      .pipe(app.plugins.if(app.isBuild, webp()))
      .pipe(app.plugins.if(app.isBuild, app.gulp.dest(app.path.build.images)))
      .pipe(app.plugins.if(app.isBuild, app.gulp.src(app.path.src.images)))
      .pipe(app.plugins.if(app.isBuild, app.plugins.newer(app.path.build.images))) // проверка на изменение
      .pipe(app.plugins.if(app.isBuild, imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: true }],
        interlaced: true,
        optimizationLevel: 3 // 0 to 7
      })))
      // ========================>
      .pipe(app.gulp.dest(app.path.build.images))
      .pipe(app.gulp.src(app.path.src.svg))
      .pipe(app.gulp.dest(app.path.build.svg))
      .pipe(app.plugins.browserSync.stream())
  )
}

export default images