---
order: 7
title: js.js
---

Файл `js.js` содержит задачу для обработки JavaScript файлов с использованием Webpack и Prettier. Эта задача компилирует, форматирует и сохраняет JavaScript файлы в директорию сборки.

#### Импорт модулей

```
import webpack from 'webpack-stream';
import prettier from 'gulp-prettier';
```

-  `webpack-stream`: Плагин для интеграции Webpack с Gulp.

-  `gulp-prettier`: Плагин для форматирования кода с использованием Prettier.

#### Задача `js`

Эта задача обрабатывает JavaScript файлы, форматирует их, компилирует с помощью Webpack и сохраняет в директорию сборки.

```
const js = () => {
  return (
    app.gulp.src(app.path.src.js, { sourcemaps: app.isDev })
      .pipe(app.plugins.plumber(
        app.plugins.notify.onError({
          title: 'JS',
          message: 'Error: <%= error.message %>'
        })
      ))
      .pipe(app.plugins.if(app.isDev, prettier({
        "trailingComma": "none",
        "tabWidth": 2,
        "useTabs": true,
        "semi": false,
        "singleQuote": true,
        "jsxSingleQuote": true,
        "arrowParens": "avoid",
        "importOrder": [
          "<THIRD_PARTY_MODULES>",
          "/modules/",
          "^../(.*)",
          "^./(.*)"
        ],
        "importOrderSeparation": false,
        "importOrderSortSpecifiers": true
      })))
      .pipe(webpack({
        mode: app.isBuild ? 'production' : 'development',
        output: {
          filename: app.isBuild ? `app.min.${app.version}.js` : 'app.min.js'
        },
        module: {
          rules: [
            {
              test: /\.css$/,
              use: ['style-loader', 'css-loader']
            }
          ]
        },
      }))
      .pipe(app.gulp.dest(app.path.build.js))
      .pipe(app.plugins.browserSync.stream())
  );
}

export default js;
```

### Подробное описание

-  `app.gulp.src`: Выбирает исходные JavaScript файлы из директории `src/js` с включенными sourcemaps в режиме разработки (`app.isDev`).

-  `app.plugins.plumber`: Обрабатывает ошибки, предотвращая остановку задачи.

-  `app.plugins.if(app.isDev, prettier({ ... }))`: Форматирует JavaScript файлы с использованием Prettier, если сборка в режиме разработки.

-  `webpack`: Компилирует JavaScript файлы с использованием Webpack.

   -  `mode`: Режим компиляции (`production` для сборки или `development` для разработки).

   -  `output.filename`: Имя выходного файла (включает версию в режиме сборки).

   -  `module.rules`: Правила для обработки CSS файлов.

-  `app.gulp.dest`: Сохраняет скомпилированные файлы в директорию сборки `build/js`.

-  `app.plugins.browserSync.stream()`: Обновляет браузер для синхронизации изменений.

### Объяснение

-  **Цель**: Задача `js` предназначена для обработки JavaScript файлов, включая их форматирование, компиляцию и сохранение в директорию сборки.

-  **Процесс**:

   1. Выбор исходных JavaScript файлов.

   2. Обработка ошибок.

   3. Форматирование кода с использованием Prettier (только в режиме разработки).

   4. Компиляция с использованием Webpack.

   5. Сохранение скомпилированных файлов в директорию сборки.

   6. Обновление браузера.

### Пример использования

При запуске задачи `js` в Gulp, все JavaScript файлы из директории `src/js` будут отформатированы (в режиме разработки), скомпилированы с использованием Webpack и сохранены в директорию сборки `build/js`.