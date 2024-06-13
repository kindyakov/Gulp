---
order: 6
title: images.js
---

Файл `images.js` содержит задачу для обработки изображений. Эта задача включает преобразование изображений в формат WebP, оптимизацию изображений и копирование их в директорию сборки.

```
import webp from 'gulp-webp'; // Преобразование в формат WebP
import imagemin from 'gulp-imagemin'; // Оптимизация изображений
```

-  `gulp-webp`: Плагин для преобразования изображений в формат WebP.

-  `gulp-imagemin`: Плагин для оптимизации изображений.

#### Задача `images`

Эта задача обрабатывает изображения, оптимизирует их и сохраняет в директорию сборки.

```
const images = () => {
  return (
    app.gulp.src(app.path.src.images)
      .pipe(app.plugins.plumber(
        app.plugins.notify.onError({
          title: 'IMG',
          message: 'Error: <%= error.message %>'
        })
      ))
      .pipe(app.plugins.newer(app.path.build.images)) // Проверка на изменение
      .pipe(app.plugins.if(app.isBuild, webp())) // Преобразование в WebP
      .pipe(app.plugins.if(app.isBuild, app.gulp.dest(app.path.build.images))) // Сохранение WebP изображений
      .pipe(app.plugins.if(app.isBuild, app.gulp.src(app.path.src.images))) // Повторная обработка оригинальных изображений
      .pipe(app.plugins.if(app.isBuild, app.plugins.newer(app.path.build.images))) // Проверка на изменение
      .pipe(app.plugins.if(app.isBuild, imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: true }],
        interlaced: true,
        optimizationLevel: 3 // Уровень оптимизации от 0 до 7
      })))
      .pipe(app.gulp.dest(app.path.build.images)) // Сохранение оптимизированных изображений
      .pipe(app.gulp.src(app.path.src.svg)) // Обработка SVG файлов
      .pipe(app.gulp.dest(app.path.build.svg)) // Сохранение SVG файлов
      .pipe(app.plugins.browserSync.stream()) // Обновление браузера
  );
}

export default images;
```

### Подробное описание

-  `app.gulp.src`: Выбирает исходные изображения из директории `src/images`.

-  `app.plugins.plumber`: Обрабатывает ошибки, предотвращая остановку задачи.

-  `app.plugins.newer`: Проверяет, были ли изменены изображения, чтобы избежать ненужной обработки.

-  `app.plugins.if(app.isBuild, webp())`: Преобразует изображения в формат WebP, если сборка в режиме `build`.

-  `app.plugins.if(app.isBuild, app.gulp.dest(app.path.build.images))`: Сохраняет WebP изображения в директорию сборки, если сборка в режиме `build`.

-  `app.plugins.if(app.isBuild, app.gulp.src(app.path.src.images))`: Повторно выбирает оригинальные изображения для дальнейшей обработки.

-  `app.plugins.if(app.isBuild, app.plugins.newer(app.path.build.images))`: Повторная проверка на изменение изображений.

-  `app.plugins.if(app.isBuild, imagemin({ ... }))`: Оптимизирует изображения, если сборка в режиме `build`.

   -  `progressive: true`: Включает прогрессивную загрузку JPEG.

   -  `svgoPlugins: [{ removeViewBox: true }]`: Оптимизирует SVG, удаляя атрибут viewBox.

   -  `interlaced: true`: Включает чересстрочную развертку для GIF.

   -  `optimizationLevel: 3`: Уровень оптимизации (0-7).

-  `app.gulp.dest(app.path.build.images)`: Сохраняет оптимизированные изображения в директорию сборки.

-  `app.gulp.src(app.path.src.svg)`: Выбирает исходные SVG файлы.

-  `app.gulp.dest(app.path.build.svg)`: Сохраняет SVG файлы в директорию сборки.

-  `app.plugins.browserSync.stream()`: Обновляет браузер для синхронизации изменений.

### Объяснение

-  **Цель**: Задача `images` предназначена для обработки и оптимизации изображений, включая преобразование в формат WebP и сохранение оптимизированных версий в директорию сборки.

-  **Процесс**:

   1. Выбор исходных изображений.

   2. Обработка ошибок.

   3. Проверка на изменение файлов.

   4. Преобразование изображений в WebP.

   5. Сохранение WebP изображений.

   6. Повторная обработка оригинальных изображений.

   7. Оптимизация изображений.

   8. Сохранение оптимизированных изображений.

   9. Обработка и сохранение SVG файлов.

   10. Обновление браузера.

### Пример использования

При запуске задачи `images` в Gulp, все изображения из директории `src/images` будут преобразованы в WebP, оптимизированы и сохранены в директорию сборки `build/images`.