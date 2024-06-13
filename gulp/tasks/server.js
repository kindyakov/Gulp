const server = (done) => {
  app.plugins.browserSync.init({
    server: {
      baseDir: `${app.path.build.html}`,
      notify: false,
      port: 3000,
    }
    // Раскомментировать для запуска на https
    // server: `${app.path.build.html}`,
    // https: {
    // key: "./gulp/ssl/server.key",
    // cert: "./gulp/ssl/server.crt"
    // },
  })
}

export default server