---
order: 10
title: scss.js
---

Файл `scss.js` содержит задачи для компиляции SCSS в CSS, включая обработку критических стилей. Эти задачи компилируют SCSS файлы, добавляют префиксы, группируют медиа-запросы, создают WebP версии изображений, минифицируют CSS и сохраняют результат в директорию сборки.

#### **Импорт модулей**

```
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';
import cleanCss from 'gulp-clean-css';
import webpcss from 'gulp-webpcss';
import autoprefixer from 'gulp-autoprefixer';
import groupCssMediaQueries from 'gulp-group-css-media-queries';
```

-  `sass`: Препроцессор для компиляции SCSS.

-  `gulp-sass`: Плагин для интеграции Sass с Gulp.

-  `gulp-rename`: Плагин для переименования файлов.

-  `gulp-clean-css`: Плагин для минификации CSS.

-  `gulp-webpcss`: Плагин для генерации CSS с поддержкой WebP изображений.

-  `gulp-autoprefixer`: Плагин для добавления вендорных префиксов.

-  `gulp-group-css-media-queries`: Плагин для группировки медиа-запросов.

#### Задача `scss`

Эта задача компилирует SCSS файлы в CSS, добавляет префиксы, группирует медиа-запросы, создает WebP версии изображений, минифицирует CSS и сохраняет результат в директорию сборки.

```
const sass = gulpSass(dartSass);

const scss = () => {
  return (
    app.gulp.src(app.path.src.scss, { sourcemaps: app.isDev })
      .pipe(app.plugins.plumber(
        app.plugins.notify.onError({
          title: 'SCSS',
          message: 'Error: <%= error.message %>'
        })
      ))
      .pipe(sass({ outputStyle: `expanded` }))
      .pipe(app.plugins.replace(/@img\//g, '../img/'))
      .pipe(app.plugins.if(app.isBuild, groupCssMediaQueries()))
      .pipe(app.plugins.if(app.isBuild, webpcss({
        webpClass: '.webp',
        noWebpClass: '.no-webp'
      })))
      .pipe(app.plugins.if(app.isBuild, autoprefixer({
        grid: true,
        overrideBrowserslist: ['Last 3 versions'],
        cascade: true
      })))
      .pipe(app.plugins.if(app.isDev, app.gulp.dest(app.path.build.css)))
      .pipe(app.plugins.if(app.isBuild, cleanCss()))
      .pipe(rename({ extname: '.min.css' }))
      .pipe(app.gulp.dest(app.path.build.css))
      .pipe(app.plugins.browserSync.stream())
  );
}

export default scss;
```

### Подробное описание

-  `gulpSass(dartSass)`: Инициализация Gulp-Sass с использованием Dart Sass.

-  `app.gulp.src`: Выбор исходных SCSS файлов из директории `src/scss`.

-  `app.plugins.plumber`: Обработка ошибок, предотвращая остановку задачи.

-  `sass({ outputStyle: 'expanded' })`: Компиляция SCSS в расширенный CSS.

-  `app.plugins.replace(/@img\//g, '../img/')`: Замена путей к изображениям.

-  `app.plugins.if(app.isBuild, groupCssMediaQueries())`: Группировка медиа-запросов, если сборка в режиме `build`.

-  `app.plugins.if(app.isBuild, webpcss({ webpClass: '.webp', noWebpClass: '.no-webp' }))`: Создание WebP версии CSS, если сборка в режиме `build`.

-  `app.plugins.if(app.isBuild, autoprefixer({ grid: true, overrideBrowserslist: ['Last 3 versions'], cascade: true }))`: Добавление вендорных префиксов, если сборка в режиме `build`.

-  `app.plugins.if(app.isDev, app.gulp.dest(app.path.build.css))`: Сохранение не сжатого файла в режиме разработки.

-  `app.plugins.if(app.isBuild, cleanCss())`: Минификация CSS, если сборка в режиме `build`.

-  `rename({ extname: '.min.css' })`: Переименование файла в `.min.css`.

-  `app.gulp.dest(app.path.build.css)`: Сохранение скомпилированных файлов в директорию сборки.

-  `app.plugins.browserSync.stream()`: Обновление браузера для синхронизации изменений.

#### Задача `insertCriticalCss`

Эта задача компилирует и обрабатывает критические SCSS файлы.

```
export function insertCriticalCss() {
  return (
    app.gulp.src(app.path.src.scssCritical)
      .pipe(sass({ outputStyle: `expanded` }))
      .pipe(app.plugins.if(app.isBuild, groupCssMediaQueries()))
      .pipe(app.plugins.if(app.isBuild, webpcss({
        webpClass: '.webp',
        noWebpClass: '.no-webp'
      })))
      .pipe(app.plugins.if(app.isBuild, autoprefixer({
        grid: true,
        overrideBrowserslist: ['Last 3 versions'],
        cascade: true
      })))
      .pipe(app.plugins.if(app.isBuild, cleanCss()))
      .pipe(app.gulp.dest(app.path.shared.css))
      .on('end', function () {
        console.log(app.plugins.chalk.green(`Добавлены критические стили`));
      })
  );
}
```

### Подробное описание

-  `app.gulp.src`: Выбор исходных критических SCSS файлов из директории `src/scss/critical`.

-  `sass({ outputStyle: 'expanded' })`: Компиляция SCSS в расширенный CSS.

-  `app.plugins.if(app.isBuild, groupCssMediaQueries())`: Группировка медиа-запросов, если сборка в режиме `build`.

-  `app.plugins.if(app.isBuild, webpcss({ webpClass: '.webp', noWebpClass: '.no-webp' }))`: Создание WebP версии CSS, если сборка в режиме `build`.

-  `app.plugins.if(app.isBuild, autoprefixer({ grid: true, overrideBrowserslist: ['Last 3 versions'], cascade: true }))`: Добавление вендорных префиксов, если сборка в режиме `build`.

-  `app.plugins.if(app.isBuild, cleanCss())`: Минификация CSS, если сборка в режиме `build`.

-  `app.gulp.dest(app.path.shared.css)`: Сохранение скомпилированных файлов в директорию `shared/css`.

-  `on('end', function () { ... })`: Вывод сообщения в консоль по завершении задачи.

### Объяснение

-  **Цель**: Задачи `scss` и `insertCriticalCss` предназначены для компиляции SCSS файлов в CSS, добавления префиксов, группировки медиа-запросов, создания WebP версии изображений, минификации CSS и сохранения результата в директорию сборки или директорию критических стилей.

-  **Процесс**:

   1. Выбор исходных SCSS файлов.

   2. Обработка ошибок.

   3. Компиляция SCSS в CSS.

   4. Замена путей к изображениям.

   5. Группировка медиа-запросов.

   6. Создание WebP версии CSS.

   7. Добавление вендорных префиксов.

   8. Сохранение не сжатого файла (в режиме разработки).

   9. Минификация CSS.

   10. Переименование файла.

   11. Сохранение скомпилированных файлов.

   12. Обновление браузера.

### Пример использования

При запуске задачи `scss` в Gulp, все SCSS файлы из директории `src/scss` будут скомпилированы в CSS, добавлены префиксы, сгруппированы медиа-запросы, создана WebP версия, минифицированы и сохранены в директорию сборки `build/css`. Задача `insertCriticalCss` выполняет аналогичные действия для критических SCSS файлов.