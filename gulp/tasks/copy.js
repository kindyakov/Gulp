const copy = () => {
  return (
    app.gulp.src(app.path.src.assets)
      .pipe(app.gulp.dest(app.path.build.assets))
  )
}

export default copy