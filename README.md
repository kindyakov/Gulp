Файл `gulpfile.js` -- это конфигурационный файл для Gulp, который содержит задачи автоматизации для вашего проекта. Давайте рассмотрим его содержимое и функционал по порядку.

#### Импорт модулей

```
import gulp from 'gulp';
import { path } from './gulp/config/path.js';
import plugins from './gulp/config/plugins.js';
import dotenv from 'dotenv';
import fs from 'fs';
```

-  **gulp**: Основной модуль Gulp.

-  **path**: Модуль, содержащий пути к файлам и папкам проекта.

-  **plugins**: Модуль с подключаемыми плагинами для Gulp.

-  **dotenv**: Модуль для работы с переменными окружения из файла `.env`.

-  **fs**: Модуль для работы с файловой системой.

### Генерация версии файла

```
function generateFileVersion() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}
```

Функция для генерации версии файла на основе текущей даты и времени.

### Инициализация переменных окружения и настройка глобальных переменных

```
dotenv.config();
const settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));

const error = plugins.chalk.bold.red;
const success = plugins.chalk.bold.green;
const warning = plugins.chalk.hex('#FFA500');

global.app = {
  path,
  gulp,
  plugins,
  isBuild: process.argv.includes('--build'),
  isDev: !process.argv.includes('--build'),
  version: generateFileVersion(),
  settings,
  log: {
    error, warning, success
  }
};
```

-  **dotenv.config()**: Загрузка переменных окружения из файла `.env`.

-  **settings**: Чтение настроек из файла `settings.json`.

-  **global.app**: Установка глобальных переменных для использования в задачах Gulp.

### Импорт задач Gulp

```
import copy from './gulp/tasks/copy.js';
import reset from './gulp/tasks/reset.js';
import html, { htmlReplaceExtensionImg, generateHtmlData } from './gulp/tasks/html.js';
import server from './gulp/tasks/server.js';
import scss, { insertCriticalCss } from './gulp/tasks/scss.js';
import js from './gulp/tasks/js.js';
import images from './gulp/tasks/images.js';
import { otfToTtf, ttfToWoff, fontsStyle, iconsfonts } from './gulp/tasks/fonts.js';
import svgSprite from './gulp/tasks/svgSprite.js';
import { zip, zipDev } from './gulp/tasks/zip.js';
import ftp from './gulp/tasks/ftp.js';
import php from './gulp/tasks/php.js';
import { video } from "./gulp/tasks/video.js";
import { createRepo } from './gulp/tasks/git.js';
```

Здесь перечислены все задачи, используемые в проекте, каждая из которых выполняет определенные функции.

### Определение наблюдателей

```
function watcher() {
  gulp.watch(path.watch.assets, copy);
  gulp.watch(path.watch.html, html);
  gulp.watch(path.watch.scssCritical, insertCriticalCss);
  gulp.watch(path.watch.scss, scss);
  gulp.watch(path.watch.js, js);
  gulp.watch(path.watch.images, images);
  gulp.watch(path.watch.php, php);
}
```

Функция `watcher` устанавливает наблюдатели для файлов, которые запускают соответствующие задачи при изменениях.

### Определение основных и вспомогательных задач

```
const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle, iconsfonts);
const mainTasks = gulp.series(video, gulp.parallel(copy, gulp.series(insertCriticalCss, html, htmlReplaceExtensionImg, js), scss, images, php));
const devTasks = gulp.series(video, gulp.parallel(copy, gulp.series(generateHtmlData, insertCriticalCss, html), scss, js, images, php));
const dev = gulp.series(reset, devTasks, gulp.parallel(watcher, server));
const build = gulp.series(reset, mainTasks);
const deployZIP = gulp.series(reset, mainTasks, zip);
const deployZIP_DEV = gulp.series(zipDev);
const deployFTP = gulp.series(reset, mainTasks, ftp);
const deployGIT_DEV = gulp.series(createRepo);
```

Здесь определены последовательные задачи и сценарии их выполнения для различных режимов (разработка, сборка, деплой).

### Экспорт сценариев и установка задачи по умолчанию

```
gulp.task('default', dev);
export { dev, build, fonts, svgSprite, deployZIP, deployFTP, deployZIP_DEV, deployGIT_DEV };
```

### Описание задач

-  `copy`: Задача копирования файлов.

-  `reset`: Задача очистки выходных директорий.

-  `html`: Задача обработки HTML файлов.

-  `htmlReplaceExtensionImg`: Дополнительная задача для замены расширений изображений в HTML.

-  `generateHtmlData`: Задача генерации данных для HTML.

-  `server`: Задача запуска локального сервера для разработки.

-  `scss`: Задача компиляции SCSS файлов в CSS.

-  `insertCriticalCss`: Задача вставки критического CSS.

-  `js`: Задача обработки JavaScript файлов.

-  `images`: Задача оптимизации изображений.

-  `otfToTtf`, `ttfToWoff`, `fontsStyle`, `iconsfonts`: Задачи обработки шрифтов.

-  `svgSprite`: Задача создания SVG спрайтов.

-  `zip`, `zipDev`: Задачи создания ZIP архивов для деплоя.

-  `ftp`: Задача деплоя через FTP.

-  `php`: Задача обработки PHP файлов.

-  `video`: Задача обработки видео файлов.

-  `createRepo`: Задача создания репозитория на GitHub.
