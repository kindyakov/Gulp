---
order: 11
title: server.js
---

Файл `server.js` содержит задачу для запуска локального сервера с использованием BrowserSync. Эта задача помогает в разработке, обеспечивая автоматическую перезагрузку браузера при изменении файлов.

#### Задача `server`

Эта задача запускает локальный сервер для разработки.

```
const server = (done) => {
  app.plugins.browserSync.init({
    server: {
      baseDir: `${app.path.build.html}`,
      notify: false,
      port: 3000,
    }
    // Раскомментировать для запуска на https
    // server: `${app.path.build.html}`,
    // https: {
    // key: "./gulp/ssl/server.key",
    // cert: "./gulp/ssl/server.crt"
    // },
  });
  done();
}

export default server;
```

### Подробное описание

-  `app.plugins.browserSync.init`: Инициализация BrowserSync с заданными настройками.

   -  `server`: Указывает параметры сервера.

      -  `baseDir`: Устанавливает базовую директорию для сервера (директория сборки HTML файлов).

      -  `notify`: Отключает уведомления BrowserSync.

      -  `port`: Устанавливает порт для сервера (3000).

   -  `https`: Настройки для HTTPS (закомментированы).

### Объяснение

-  **Цель**: Задача `server` предназначена для запуска локального сервера с помощью BrowserSync, обеспечивая автоматическую перезагрузку браузера при изменении файлов.

-  **Процесс**:

   1. Инициализация BrowserSync с указанными настройками.

   2. Установка базовой директории для сервера.

   3. Отключение уведомлений.

   4. Установка порта для сервера.

   5. (Опционально) Настройка HTTPS сервера (закомментировано).

### Пример использования

При запуске задачи `server` в Gulp, локальный сервер будет запущен на порту 3000, используя файлы из директории сборки HTML. Браузер автоматически обновится при изменении файлов.