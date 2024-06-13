---
order: 2
title: path.js
---

Файл `path.js` используется для хранения путей к различным директориям и файлам в вашем проекте. Это позволяет легко управлять путями и использовать их в задачах Gulp.

### Импорт модулей и определение переменных

```
import * as nodePath from 'path';

const dirname = nodePath.resolve();
const rootFolder = nodePath.basename(nodePath.resolve());

const buildFolder = `./dist`;
const srcFolder = `./src`;
const sharedFolder = `./shared`;
```

-  `nodePath`: Встроенный модуль Node.js для работы с путями файловой системы.

-  `dirname`: Абсолютный путь к текущей директории.

-  `rootFolder`: Имя корневой директории проекта.

-  `buildFolder`: Путь к директории для собранных файлов.

-  `srcFolder`: Путь к директории с исходными файлами.

-  `sharedFolder`: Путь к директории с общими ресурсами.

#### Экспорт объекта `path`

```
export const path = {
  build: {
    html: `${buildFolder}/`,
    css: `${buildFolder}/css/`,
    js: `${buildFolder}/js/`,
    images: `${buildFolder}/img/`,
    svg: `${buildFolder}/img/`,
    fonts: `${buildFolder}/fonts/`,
    assets: `${buildFolder}/assets/`,
    project: `${buildFolder}/**/*.*`,
    php: `${buildFolder}/php/`,
    video: `${buildFolder}/video/`,
  },
  src: {
    html: `${srcFolder}/*.html`,
    scss: `${srcFolder}/scss/style.scss`,
    scssCritical: `${srcFolder}/scss/critical/*.scss`,
    js: `${srcFolder}/js/app.js`,
    images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp,ico}`,
    svg: `${srcFolder}/img/**/*.svg`,
    svgicons: `${srcFolder}/svgicons/**/*.svg`,
    assets: `${srcFolder}/assets/**/*.*`,
    php: `${srcFolder}/php/**/*.*`,
    video: `${srcFolder}/video/**/*.{mp3,mp4,avi,mkv,wmv,mov,flv,webm}`,
  },
  shared: {
    css: `${sharedFolder}/css/`,
  },
  watch: {
    html: `${srcFolder}/**/*.html`,
    scss: `${srcFolder}/scss/**/*.scss`,
    scssCritical: `${srcFolder}/scss/critical/*.scss`,
    js: `${srcFolder}/js/**/*.js`,
    images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp,svg}`,
    svgicons: `${srcFolder}/svgicons/**/*.svg`,
    assets: `${srcFolder}/assets/**/*.*`,
    php: `${srcFolder}/php/**/*.*`,
  },
  clean: buildFolder,
  buildFolder,
  srcFolder,
  rootFolder,
  sharedFolder,
  dirname,
  ftp: ``
};
```

#### Описание ключевых свойств

-  `build`: Пути для выходных файлов после сборки.

   -  `html`: Путь для собранных HTML файлов.

   -  `css`: Путь для собранных CSS файлов.

   -  `js`: Путь для собранных JavaScript файлов.

   -  `images` и `svg`: Путь для изображений.

   -  `fonts`: Путь для шрифтов.

   -  `assets`: Путь для ассетов.

   -  `project`: Путь для всех файлов проекта.

   -  `php`: Путь для PHP файлов.

   -  `video`: Путь для видео файлов.

-  `src`: Пути для исходных файлов.

   -  `html`: Путь для исходных HTML файлов.

   -  `scss`: Путь для основного SCSS файла.

   -  `scssCritical`: Путь для критического SCSS.

   -  `js`: Путь для основного JavaScript файла.

   -  `images`: Путь для исходных изображений.

   -  `svg`: Путь для исходных SVG файлов.

   -  `svgicons`: Путь для SVG иконок.

   -  `assets`: Путь для ассетов.

   -  `php`: Путь для PHP файлов.

   -  `video`: Путь для видео файлов.

-  `shared`: Путь для общих CSS файлов.

-  `watch`: Пути для файлов, за изменениями которых будет следить Gulp.

   -  `html`: Путь для HTML файлов.

   -  `scss`: Путь для SCSS файлов.

   -  `scssCritical`: Путь для критических SCSS файлов.

   -  `js`: Путь для JavaScript файлов.

   -  `images`: Путь для изображений.

   -  `svgicons`: Путь для SVG иконок.

   -  `assets`: Путь для ассетов.

   -  `php`: Путь для PHP файлов.

-  `clean`: Директория для очистки.

-  `buildFolder`, `srcFolder`, `rootFolder`, `sharedFolder`, `dirname`: Дополнительные переменные для путей.

-  `ftp`: Путь для FTP деплоя (пока не используется).


