---
order: 14
title: zip.js
---

Файл `zip.js` содержит задачи для создания ZIP-архивов из файлов проекта. Эти задачи позволяют создать архивы для сборки и разработки, а также обработать процесс деплоя через Git.

#### Импорт модулей

```
import { deleteAsync } from "del";
import zipPlugins from "gulp-zip";
import git from 'simple-git';
import fs from 'fs';
```

-  `del`: Модуль для удаления файлов и папок.

-  `gulp-zip`: Плагин для создания ZIP-архивов.

-  `simple-git`: Библиотека для взаимодействия с Git.

-  `fs`: Модуль для работы с файловой системой.

#### Задача `zip`

Эта задача создает ZIP-архив из файлов сборки.

```
export const zip = () => {
  deleteAsync(`./${app.path.rootFolder}_build.zip`);
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
  );
}
```

### Подробное описание

-  `deleteAsync`: Удаляет старый ZIP-архив, если он существует.

-  `app.gulp.src`: Выбирает файлы сборки.

-  `app.plugins.plumber`: Обрабатывает ошибки, предотвращая остановку задачи.

-  `zipPlugins`: Создает ZIP-архив с именем корневой директории.

-  `app.gulp.dest`: Сохраняет архив в корневую директорию.

#### Задача `zipDev`

Эта задача создает ZIP-архив для разработки и обрабатывает процесс деплоя через Git.

```
export const zipDev = () => {
  deleteAsync(`./${app.path.rootFolder}_dev.zip`);
  return (
    app.gulp.src([
      'gulp/**/*',
      'src/**/*',
      'shared/**/*',
      'package.json',
      'gulpfile.js',
    ], { base: '.' })
      .pipe(zipPlugins(`${app.path.rootFolder}_dev.zip`))
      .pipe(app.gulp.dest('./'))
      .on('end', async () => {
        if (!app.settings.repoUrl) {
          console.log(app.log.error("Репозиторий ещё не создан выполните команду:"), app.plugins.chalk.italic('npm run gitDev'));
          return;
        }

        const gitInstance = git();
        try {
          await gitInstance.init();
          await gitInstance.add('./*');
          await gitInstance.commit(app.version);
        } catch (err) {
          if (err.message.includes('fatal: unable to auto-detect email address')) {
            console.log(app.log.error('Пожалуйста, установите ваше имя и адрес электронной почты для Git, используя следующие команды:'));
            console.log(app.log.error('git config --global user.name "Ваше имя"'));
            console.log(app.log.error('git config --global user.email "ваша-почта@пример.com"'));
            return;
          }

          if (err.message.includes('fatal: detected dubious ownership in repository')) {
            console.log(app.log.error('Git обнаружил проблему с владельцем репозитория. Вы можете добавить исключение для этого каталога, вызвав следующую команду:'));
            console.log(app.log.error(`git config --global --add safe.directory '${app.path.dirname}'`));
            return;
          }

          throw err; // Если это другая ошибка, просто выбросьте ее
        }

        if (app.settings.useExistingRepo) {
          await gitInstance.push('origin', 'master');
        } else {
          const isOriginExists = (await gitInstance.getRemotes()).some(remote => remote.name === 'origin');

          if (!isOriginExists) {
            await gitInstance.addRemote('origin', app.settings.repoUrl);
          }

          await gitInstance.push('origin', 'master', { '--repo': app.settings.repoUrl });
          app.settings.useExistingRepo = true;
          fs.writeFileSync('settings.json', JSON.stringify(app.settings, null, 2));
        }

        console.log(app.plugins.chalk.green(`Изменения добавлены: коммит "${app.version}"`));
      })
      .on('error', (err) => console.error('Failed to commit+push', err))
  );
}
```

### Подробное описание

-  `deleteAsync`: Удаляет старый ZIP-архив для разработки, если он существует.

-  `app.gulp.src`: Выбирает файлы для разработки и создает архив с корректной структурой.

-  `zipPlugins`: Создает ZIP-архив с именем корневой директории.

-  `app.gulp.dest`: Сохраняет архив в корневую директорию.

-  `on('end', async () => { ... })`: Обрабатывает процесс деплоя через Git после создания архива.

   -  `gitInstance.init()`: Инициализация Git репозитория.

   -  `gitInstance.add('./*')`: Добавление всех файлов в индекс.

   -  `gitInstance.commit(app.version)`: Создание коммита с текущей версией.

   -  `gitInstance.push('origin', 'master')`: Отправка изменений в удаленный репозиторий.

   -  `gitInstance.addRemote('origin', app.settings.repoUrl)`: Добавление удаленного репозитория, если он не существует.

   -  `fs.writeFileSync('settings.json', JSON.stringify(app.settings, null, 2))`: Обновление настроек проекта.

### Объяснение

-  **Цель**: Задачи `zip` и `zipDev` предназначены для создания ZIP-архивов из файлов проекта и обработки деплоя через Git.

-  **Процесс**:

   1. Удаление старых ZIP-архивов.

   2. Выбор файлов для архивации.

   3. Создание ZIP-архивов.

   4. Сохранение архивов.

   5. Обработка деплоя через Git (для задачи `zipDev`).

### Пример использования

При запуске задачи `zip` в Gulp, создается ZIP-архив из файлов сборки. При запуске задачи `zipDev` в Gulp, создается ZIP-архив для разработки и обрабатывается процесс деплоя через Git, включая инициализацию репозитория, добавление файлов, создание коммита и отправку изменений в удаленный репозиторий.