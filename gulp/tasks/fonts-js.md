---
order: 2
title: fonts.js
---

Файл `fonts.js` содержит задачи для обработки шрифтов, включая их конвертацию и создание файла стилей для их подключения. Давайте подробно рассмотрим каждую задачу.

#### Импорт модулей

```
import fs from 'fs';
import fonter from 'gulp-fonter-fix';
import ttf2woff2 from 'gulp-ttf2woff2';
```

-  `fs`: Модуль для работы с файловой системой.

-  `gulp-fonter-fix`: Плагин для конвертации шрифтов.

-  `gulp-ttf2woff2`: Плагин для конвертации шрифтов в формат WOFF2.

#### Задача `otfToTtf`

Эта задача конвертирует шрифты из формата `.otf` в `.ttf`.

```
export const otfToTtf = () => {
  return (
    app.gulp.src(`${app.path.srcFolder}/fonts/*.otf`, {})
      .pipe(app.plugins.plumber(
        app.plugins.notify.onError({
          title: 'FONTS',
          message: 'Error: <%= error.message %>'
        })
      ))
      .pipe(fonter({
        formats: ['ttf']
      }))
      .pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`))
  );
}
```

-  `app.gulp.src`: Выбирает файлы `.otf` в папке `fonts`.

-  `app.plugins.plumber`: Обрабатывает ошибки.

-  `fonter`: Конвертирует файлы в формат `.ttf`.

-  `app.gulp.dest`: Сохраняет конвертированные файлы обратно в папку `fonts`.

#### Задача `ttfToWoff`

Эта задача конвертирует шрифты из формата `.ttf` в `.woff` и `.woff2`.

```
export const ttfToWoff = () => {
  return (
    app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`, {})
      .pipe(app.plugins.plumber(
        app.plugins.notify.onError({
          title: 'FONTS',
          message: 'Error: <%= error.message %>'
        })
      ))
      .pipe(fonter({
        formats: ['woff']
      }))
      .pipe(app.gulp.dest(app.path.build.fonts))
      .pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`, {}))
      .pipe(ttf2woff2())
      .pipe(app.gulp.dest(app.path.build.fonts))
  );
}
```

-  `app.gulp.src`: Выбирает файлы `.ttf`.

-  `app.plugins.plumber`: Обрабатывает ошибки.

-  `fonter`: Конвертирует файлы в формат `.woff`.

-  `ttf2woff2`: Конвертирует файлы в формат `.woff2`.

-  `app.gulp.dest`: Сохраняет конвертированные файлы в папку `build/fonts`.

#### Задача `fontsStyle`

Эта задача создает файл стилей для подключения шрифтов.

```
export const fontsStyle = () => {
  let fontsFile = `${app.path.srcFolder}/scss/settings/fonts.scss`;
  fs.readdir(app.path.build.fonts, function (err, fontsFiles) {
    if (fontsFiles) {
      if (!fs.existsSync(fontsFile)) {
        fs.writeFile(fontsFile, '', cb);
        let newFileOnly;
        for (var i = 0; i < fontsFiles.length; i++) {
          let fontFileName = fontsFiles[i].split('.')[0];
          if (newFileOnly !== fontFileName) {
            let fontName = fontFileName.split('-')[0] ? fontFileName.split('-')[0] : fontFileName;
            let fontWeight = fontFileName.split('-')[1] ? fontFileName.split('-')[1] : fontFileName;
            if (fontWeight.toLowerCase() === 'thin') {
              fontWeight = 100;
            } else if (fontWeight.toLowerCase() === 'extralight') {
              fontWeight = 200;
            } else if (fontWeight.toLowerCase() === 'light') {
              fontWeight = 300;
            } else if (fontWeight.toLowerCase() === 'medium') {
              fontWeight = 500;
            } else if (fontWeight.toLowerCase() === 'semibold') {
              fontWeight = 600;
            } else if (fontWeight.toLowerCase() === 'bold') {
              fontWeight = 700;
            } else if (fontWeight.toLowerCase() === 'extrabold' || fontWeight.toLowerCase() === 'heavy') {
              fontWeight = 800;
            } else if (fontWeight.toLowerCase() === 'black') {
              fontWeight = 900;
            } else {
              fontWeight = 400;
            }
            fs.appendFile(fontsFile, `@font-face{\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style: normal;\n}\r\n`, cb);
            newFileOnly = fontFileName;
          }
        }
      } else {
        console.log("Файл scss/settings/fonts.scss уже существует. Для обновления файла нужно его удалить!");
      }
    }
  });
  return app.gulp.src(`${app.path.srcFolder}`);
  function cb() { }
}
```

-  `fs.readdir`: Читает файлы в папке `build/fonts`.

-  `fs.writeFile`: Создает файл стилей, если его нет.

-  `fs.appendFile`: Добавляет в файл стилей `@font-face` для каждого шрифта.

-  `cb`: Callback-функция для завершения операций записи.

#### Задача `iconsfonts`

Эта задача копирует иконки шрифтов из исходной директории в директорию сборки.

```
export const iconsfonts = () => {
  return (
    app.gulp.src(`${app.path.srcFolder}/fonts/iconsfonts/**.*`)
      .pipe(app.gulp.dest(`${app.path.build.fonts}iconsfonts/`))
  );
}
```

-  `app.gulp.src`: Выбирает все файлы из папки `iconsfonts`.

-  `app.gulp.dest`: Копирует их в папку `build/fonts/iconsfonts`.


