import configFTP from "../config/ftp.cfg.js"
import vinyFTP from 'vinyl-ftp'
// import util from 'gupl-util'


const ftp = () => {
  // configFTP.log = util.log
  const ftpConnect = vinyFTP.create(configFTP)
  return (
    app.gulp.src(app.path.build.project)
      .pipe(app.plugins.notify.onError({
        title: 'JS',
        message: 'Error: <%= error.message %>'
      }))
      .pipe(ftpConnect.dest(`/${app.path.ftp}/${app.path.rootFolder}`))
  )
}

export default ftp