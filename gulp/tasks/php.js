const php = () => {
  return (
    app.gulp.src(app.path.src.php)
      .pipe(app.gulp.dest(app.path.build.php))
      .pipe(app.plugins.browserSync.stream())
  )
}

export default php