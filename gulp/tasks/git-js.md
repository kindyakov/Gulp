---
order: 4
title: git.js
---

Файл `git.js` содержит задачу для создания нового репозитория на GitHub с использованием API. Эта задача позволяет автоматизировать процесс создания репозитория и обновления настроек проекта.

#### Импорт модулей

```
import { Octokit } from "@octokit/rest";
import fs from 'fs';
import CyrillicToTranslit from 'cyrillic-to-translit-js';
```

-  `Octokit`: Библиотека для работы с API GitHub.

-  `fs`: Модуль для работы с файловой системой.

-  `CyrillicToTranslit`: Библиотека для транслитерации кириллического текста в латиницу.

#### Функция `checkAndTransliterate`

Эта функция проверяет строку на наличие кириллических символов и, если они найдены, транслитерирует их в латиницу.

```
function checkAndTransliterate(str) {
  const cyrillicPattern = /[а-яё]/i;
  if (cyrillicPattern.test(str)) {
    return new CyrillicToTranslit().transform(str, "_").toLowerCase();
  }
  return str;
}
```

-  `cyrillicPattern`: Регулярное выражение для поиска кириллических символов.

-  `CyrillicToTranslit().transform`: Транслитерирует кириллический текст в латиницу, заменяя пробелы на подчеркивания и переводя текст в нижний регистр.

#### Задача `createRepo`

Эта задача создает новый репозиторий на GitHub.

```
export const createRepo = (done) => {
  if (app.settings.repoUrl) {
    console.log(app.log.warning("Репозиторий уже создан:", app.settings.repoUrl));
    done();
    return;
  }

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  const repositoryName = checkAndTransliterate(app.path.rootFolder);

  octokit.repos.createForAuthenticatedUser({
    name: `${repositoryName}_dev`,
    description: 'This is my new repository',
    private: true
  }).then(({ data }) => {
    console.log(app.log.success("Репозиторий успешно создан:"), data.html_url);
    app.settings.repoUrl = data.html_url;
    fs.writeFileSync('settings.json', JSON.stringify(app.settings, null, 2));
    done();
  }).catch((error) => {
    console.error(app.log.error("Ошибка при создании репозитория:"), error);
  });
};
```

### Подробное описание

-  **Проверка существования репозитория**:

   -  Если в настройках проекта (`app.settings.repoUrl`) уже есть URL репозитория, выводится предупреждение, и задача завершается.

-  **Создание объекта Octokit**:

   -  Объект `Octokit` создается с использованием токена аутентификации, хранящегося в переменной окружения `GITHUB_TOKEN`.

-  **Транслитерация имени репозитория**:

   -  Имя корневой папки проекта транслитерируется в латиницу и используется в качестве имени репозитория с суффиксом `_dev`.

-  **Создание репозитория**:

   -  Используя метод `octokit.repos.createForAuthenticatedUser`, создается новый приватный репозиторий с указанным именем и описанием.

-  **Обработка успешного создания**:

   -  В случае успеха, URL репозитория сохраняется в настройках проекта, и обновленный файл `settings.json` записывается на диск.

-  **Обработка ошибок**:

   -  В случае ошибки выводится сообщение об ошибке.

### Пример использования

При запуске задачи `createRepo`, если репозиторий еще не создан, будет создан новый репозиторий на GitHub с использованием API и обновлены настройки проекта для хранения URL созданного репозитория.