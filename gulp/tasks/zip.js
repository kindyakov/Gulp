import { deleteAsync } from "del"
import zipPlugins from "gulp-zip"
import git from 'simple-git';
import fs from 'fs';

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
      'shared/**/*',
      'package.json',
      'gulpfile.js',
    ], { base: '.' }) // Указываем базовую директорию для корректной структуры в архиве
      .pipe(zipPlugins(`${app.path.rootFolder}_dev.zip`))
      .pipe(app.gulp.dest('./'))
      .on('end', async () => {
        if (!app.settings.repoUrl) {
          app.log.error('Репозиторий ещё не создан выполните команду:', app.plugins.chalk.italic('npm run gitDev'))
          return
        }

        const gitInstance = git();
        try {
          await gitInstance.init();
          await gitInstance.add('./*');
          await gitInstance.commit(app.version);

        } catch (err) {
          if (err.message.includes('fatal: unable to auto-detect email address')) {
            app.log.error('Пожалуйста, установите ваше имя и адрес электронной почты для Git, используя следующие команды:')
            app.log.error('git config --global user.name "Ваше имя"')
            app.log.error('git config --global user.email "ваша-почта@пример.com"')
            return;
          }

          if (err.message.includes('fatal: detected dubious ownership in repository')) {
            app.log.error('Git обнаружил проблему с владельцем репозитория. Вы можете добавить исключение для этого каталога, вызвав следующую команду:')
            app.log.error(`git config --global --add safe.directory '${app.path.dirname}'`)
            return;
          }

          throw err; // Если это другая ошибка, просто выбросьте ее
        }

        if (app.settings.useExistingRepo) {
          await gitInstance.push('origin', 'master');
        } else {
          const isOriginExists = (await gitInstance.getRemotes()).some(remote => remote.name === 'origin');

          if (!isOriginExists) {
            // await gitInstance.removeRemote('origin');
            await gitInstance.addRemote('origin', app.settings.repoUrl);
          }

          await gitInstance.push('origin', 'master', { '--repo': app.settings.repoUrl });
          app.settings.useExistingRepo = true;
          fs.writeFileSync('settings.json', JSON.stringify(app.settings, null, 2));
        }

        app.log.success(`Изменения добавлены: коммит "${app.version}"`)
      })
      .on('error', (err) => console.error('Failed to commit+push', err))
  )
}

