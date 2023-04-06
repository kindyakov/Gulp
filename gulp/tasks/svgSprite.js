import sprite from 'gulp-svg-sprite'

const svgSprite = () => {
  return (
    app.gulp.src(app.path.src.svgicons, {})
      .pipe(app.plugins.plumber(
        app.plugins.notify.onError({
          title: 'Svgicons',
          message: 'Error: <%= error.message  %>'
        })
      ))
      .pipe(sprite({
        mode: {
          stack: {
            sprite: '../icons/sprite.svg',
            // Создавать страницу с перечнем иконок
            example: true
          }
        }
      }))
      .pipe(app.gulp.dest(app.path.build.images))
  )
}

export default svgSprite