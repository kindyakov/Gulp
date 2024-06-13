import fs from 'fs'
import path from 'path'
import fileinclude from "gulp-file-include"
import webpHtmlNosvg from "gulp-webp-html-nosvg"
import versionNumber from 'gulp-version-number'
import removeHtmlComments from 'gulp-remove-html-comments';

const dataFileName = '#pageData.json'

const html = () => {
  const __dirname = path.resolve()
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
          const fileStylePath = path.join(app.path.shared.css, `${fileName}.css`)
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

          file.contents = Buffer.from(fileContents)
        }
        cb(null, file);
      }))
      // .pipe(app.plugins.replace(/@img\//g, 'img/'))
      // .pipe(app.plugins.if(app.isBuild, webpHtmlNosvg()))
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
      // Удаляем версию из URL api-maps.yandex.ru
      .pipe(app.plugins.if(app.isBuild, app.plugins.replace(/(api-maps\.yandex\.ru[^"]*_v=)[^&"]*/g, 'api-maps.yandex.ru/v3/?apikey=b756749a-c9d8-4f04-a6c7-2653f5d9d0b7&lang=ru_RU')))
      .pipe(app.plugins.if(app.isBuild, removeHtmlComments())) // Убираем комментарии
      .pipe(app.gulp.dest(app.path.build.html))
      .pipe(app.plugins.browserSync.stream())
  )
}

export default html

export const htmlReplaceExtensionImg = () => {
  return app.gulp.src(app.path.build.html + '/**/*.html')
    .pipe(app.plugins.if(app.isBuild, app.plugins.replace(/\.png(?=\")/g, '.webp'))) // Заменить расширение в строках
    .pipe(app.plugins.if(app.isBuild, app.plugins.replace(/\.jpg(?=\")/g, '.webp'))) // Заменить расширение в строках
    .pipe(app.gulp.dest(app.path.build.html))
}

export const generateHtmlData = () => {
  const dataPath = path.join(app.path.srcFolder, dataFileName)

  if (fs.existsSync(dataPath)) {
    app.log.warning(`Файл ${dataFileName} существует, чтобы обновить его, удалите файл ${dataFileName}`)
    return app.gulp.src('.') // возвращает пустой поток
  }

  let data = {}

  return app.gulp.src(['./src/**/*.html', '!./src/html/**/*.html', '!./src/pageData/'])
    .pipe(app.plugins.through2.obj(function (file, _, cb) {
      if (file.isBuffer()) {
        const fileName = path.basename(file.path, '.html')
        const relativePath = path.relative(app.path.srcFolder, file.path)

        const depth = relativePath.split('\\').length - 1;
        const pathPrefix = '../'.repeat(depth)

        data[fileName] = {
          "title": "",
          "description": "",
          "keywords": "",
          "pathPrefix": depth > 0 ? pathPrefix : ""
        }

        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2))
      }

      cb(null, file)
    }))
    .on('end', function () {
      app.log.success(`Данные о страницах успешно сгенерированы и сохранены в файле ${dataFileName}`)
    })
}