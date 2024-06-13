---
order: 5
title: html.js
---

Файл `html.js` содержит задачи для обработки HTML файлов, включая их сборку, вставку критического CSS, замену расширений изображений и генерацию данных о страницах.

#### Импорт модулей

```
import fs from 'fs';
import path from 'path';
import fileinclude from "gulp-file-include";
import webpHtmlNosvg from "gulp-webp-html-nosvg";
import versionNumber from 'gulp-version-number';
import removeHtmlComments from 'gulp-remove-html-comments';
```

-  `fs`: Модуль для работы с файловой системой.

-  `path`: Модуль для работы с путями файловой системы.

-  `gulp-file-include`: Плагин для включения HTML файлов.

-  `gulp-webp-html-nosvg`: Плагин для вставки изображений WebP.

-  `gulp-version-number`: Плагин для добавления версионности к файлам.

-  `gulp-remove-html-comments`: Плагин для удаления комментариев из HTML.

#### Задача `html`

Эта задача обрабатывает HTML файлы, вставляет критический CSS, заменяет версии файлов и удаляет комментарии.

```
const dataFileName = '#pageData.json';

const html = () => {
  const __dirname = path.resolve();
  const pageData = JSON.parse(fs.readFileSync(path.resolve(__dirname, `src/${dataFileName}`), 'utf8'));

  return (
    app.gulp.src(['./src/**/*.html', '!./src/html/**/*.html', '!./src/pageData/**/*.html'])
      .pipe(app.plugins.plumber(
        app.plugins.notify.onError({
          title: 'HTML',
          message: 'Error: <%= error.message %>'
        })
      ))
      .pipe(app.plugins.through2.obj(function (file, _, cb) {
        if (file.isBuffer()) {
          const fileName = path.basename(file.path, '.html');
          let fileContents = file.contents.toString();

          if (fileContents.includes('@@fileName')) {
            fileContents = fileContents.replace(/fileName/g, fileName);
          }

          file.contents = Buffer.from(fileContents);
        }
        cb(null, file);
      }))
      .pipe(fileinclude({
        context: pageData // Передаем данные из JSON-файла
      }))
      .pipe(app.plugins.through2.obj(function (file, _, cb) {
        if (file.isBuffer()) {
          const fileName = path.basename(file.path, '.html');
          const fileStylePath = path.join(app.path.shared.css, `${fileName}.css`);
          let fileContents = file.contents.toString();

          if (fileContents.includes('@@critical-css')) {
            if (fs.existsSync(fileStylePath)) {
              const cssContent = fs.readFileSync(`${app.path.shared.css}${fileName}.css`, 'utf8');
              fileContents = fileContents.replace(/@@critical-css/g, `<style>${cssContent}</style>`);
            } else {
              fileContents = fileContents.replace(/@@critical-css/g, '');
            }
          }

          if (app.isBuild && fileContents.includes('app.min.js')) {
            fileContents = fileContents.replace(/app.min.js/g, `app.min.${app.version}.js`);
          }

          file.contents = Buffer.from(fileContents);
        }
        cb(null, file);
      }))
      .pipe(app.plugins.if(app.isBuild, versionNumber({
        'value': '%DT%',
        'append': {
          'key': '_v',
          'cover': 0,
          'to': ['css',] // 'js'
        },
        'output': {
          'file': 'gulp/version.json'
        },
      })))
      .pipe(app.plugins.if(app.isBuild, app.plugins.replace(/(api-maps\.yandex\.ru[^"]*_v=)[^&"]*/g, 'api-maps.yandex.ru/v3/?apikey=b756749a-c9d8-4f04-a6c7-2653f5d9d0b7&lang=ru_RU')))
      .pipe(app.plugins.if(app.isBuild, removeHtmlComments())) // Убираем комментарии
      .pipe(app.gulp.dest(app.path.build.html))
      .pipe(app.plugins.browserSync.stream())
  );
}

export default html;
```

### Подробное описание

-  `dataFileName`: Имя файла данных, содержащего информацию о страницах.

-  `__dirname`: Абсолютный путь к текущей директории.

-  `pageData`: Данные из JSON-файла, содержащего информацию о страницах.

#### Основные шаги задачи

1. **Чтение данных из файла**: Чтение данных о страницах из файла `#pageData.json`.

2. **Обработка файлов HTML**: Выбор всех HTML файлов, исключая определенные директории.

3. **Обработка ошибок**: Использование `plumber` и `notify` для обработки ошибок.

4. **Замена имени файла**: Замена плейсхолдера `@@fileName` на имя файла.

5. **Включение HTML файлов**: Использование `fileinclude` для включения HTML файлов с контекстом данных из `pageData`.

6. **Вставка критического CSS**: Замена плейсхолдера `@@critical-css` содержимым критического CSS.

7. **Версионность файлов**: Добавление версии к именам файлов.

8. **Замена URL**: Замена версий URL для карт Яндекса.

9. **Удаление комментариев**: Удаление комментариев из HTML.

10. **Сохранение файлов**: Сохранение обработанных файлов в директорию сборки.

11. **Обновление браузера**: Автоматическая перезагрузка браузера.

#### Задача `htmlReplaceExtensionImg`

Эта задача заменяет расширения изображений в HTML файлах на `.webp`.

```
export const htmlReplaceExtensionImg = () => {
  return app.gulp.src(app.path.build.html + '/**/*.html')
    .pipe(app.plugins.if(app.isBuild, app.plugins.replace(/\.png(?=\")/g, '.webp')))
    .pipe(app.plugins.if(app.isBuild, app.plugins.replace(/\.jpg(?=\")/g, '.webp')))
    .pipe(app.gulp.dest(app.path.build.html));
}
```

### Подробное описание

-  `app.gulp.src`: Выбирает все HTML файлы в директории сборки.

-  `app.plugins.replace`: Заменяет расширения файлов изображений на `.webp`.

-  `app.gulp.dest`: Сохраняет обработанные файлы в директорию сборки.

#### Задача `generateHtmlData`

Эта задача генерирует данные о страницах и сохраняет их в файл `#pageData.json`.

```
export const generateHtmlData = () => {
  const dataPath = path.join(app.path.srcFolder, dataFileName);

  if (fs.existsSync(dataPath)) {
    console.log(app.plugins.chalk.yellow(`Файл ${dataFileName} существует, чтобы обновить его, удалите файл ${dataFileName}`));
    return app.gulp.src('.'); // возвращает пустой поток
  }

  let data = {};

  return app.gulp.src(['./src/**/*.html', '!./src/html/**/*.html', '!./src/pageData/'])
    .pipe(app.plugins.through2.obj(function (file, _, cb) {
      if (file.isBuffer()) {
        const fileName = path.basename(file.path, '.html');
        const relativePath = path.relative(app.path.srcFolder, file.path);

        const depth = relativePath.split('\\').length - 1;
        const pathPrefix = '../'.repeat(depth);

        data[fileName] = {
          "title": "",
          "description": "",
          "keywords": "",
          "pathPrefix": depth > 0 ? pathPrefix : ""
        };

        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      }

      cb(null, file);
    }))
    .on('end', function () {
      console.log(app.plugins.chalk.green(`Данные о страницах успешно сгенерированы и сохранены в файле ${dataFileName}`));
    });
}
```

### Подробное описание

-  `dataPath`: Путь к файлу данных.

-  `fs.existsSync`: Проверка существования файла данных.

-  `app.gulp.src`: Выбор всех HTML файлов, исключая определенные директории.

-  `app.plugins.through2.obj`: Обработка каждого файла и генерация данных о страницах.

-  `fs.writeFileSync`: Запись данных о страницах в файл `#pageData.json`.

-  `console.log`: Вывод сообщения о завершении генерации данных.