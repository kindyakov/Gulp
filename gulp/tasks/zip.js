import { deleteAsync } from "del"
import zipPlugins from "gulp-zip"

export const zip = () => {
  deleteAsync(`./${app.path.rootFolder}_build.zip`)
  return (
    app.gulp.src(app.path.build.project)
      .pipe(app.plugins.plumber(
        app.plugins.notify.onError({
          title: 'ZIP',
          message: 'Error: <%= error.message %>'
        })
      ))
      .pipe(zipPlugins(`${app.path.rootFolder}_build.zip`))
      .pipe(app.gulp.dest('./'))
  )
}

export const zipDev = () => {
  deleteAsync(`./${app.path.rootFolder}_dev.zip`); // Удаляем старый архив, если есть
  return (
    app.gulp.src([
      'gulp/**/*', // gulp и все вложенные файлы и папки
      'src/**/*', // src и все вложенные файлы и папки
      'package.json',
      'gulpfile.js',
    ], { base: '.' }) // Указываем базовую директорию для корректной структуры в архиве
      .pipe(zipPlugins(`${app.path.rootFolder}_dev.zip`))
      .pipe(app.gulp.dest('./'))
  );
};
